import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Feed {
  id: string;
  url: string;
  title: string;
  icon?: string;
  category: string;
  created_at: string;
}

export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  content: string;
  contentSnippet: string;
  feedId: string;
  feedTitle: string;
  isRead: boolean;
}

interface FeedState {
  feeds: Feed[];
  articles: FeedItem[];
  isLoading: boolean;
  error: string | null;
  selectedFeedId: string | 'all';
  selectedCategory: string | 'all';

  fetchFeeds: () => Promise<void>;
  addFeed: (url: string) => Promise<void>;
  refreshArticles: () => Promise<void>;
  markAsRead: (url: string) => Promise<void>;
  setSelectedFeedId: (id: string | 'all') => void;
  setSelectedCategory: (category: string | 'all') => void;
  setSelectedArticle: (article: FeedItem | null) => void;
  selectedArticle: FeedItem | null;
}

// Helper to fetch RSS data using dual-strategy
const fetchRSS = async (url: string) => {
  // Strategy 1: rss2json
  try {
    const rss2jsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
    const response = await fetch(rss2jsonUrl);
    const data = await response.json();

    if (data.status === 'ok') {
      return {
        title: data.feed.title,
        image: data.feed.image,
        items: data.items.map((item: any) => ({
          title: item.title,
          link: item.link,
          pubDate: item.pubDate,
          content: item.content,
          contentSnippet: item.description,
        })),
      };
    }
  } catch (e) {
    console.warn(`rss2json failed for ${url}, trying fallback...`);
  }

  // Strategy 2: Fallback (allorigins + DOMParser)
  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const proxyData = await response.json();
    
    if (!proxyData.contents) throw new Error('No content from proxy');

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(proxyData.contents, "text/xml");
    
    const channelTitle = xmlDoc.querySelector("channel > title")?.textContent || "Unknown Feed";
    const channelImage = xmlDoc.querySelector("channel > image > url")?.textContent;

    const items = Array.from(xmlDoc.querySelectorAll("item")).map((item) => {
      const title = item.querySelector("title")?.textContent || "";
      const link = item.querySelector("link")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || "";
      const content = item.querySelector("content\\:encoded")?.textContent || item.querySelector("description")?.textContent || "";
      const description = item.querySelector("description")?.textContent || "";

      return {
        title,
        link,
        pubDate,
        content,
        contentSnippet: description,
      };
    });

    return {
      title: channelTitle,
      image: channelImage,
      items,
    };
  } catch (e) {
    console.error(`All strategies failed for ${url}`, e);
    throw new Error('Failed to fetch RSS feed');
  }
};

export const useFeedStore = create<FeedState>((set, get) => ({
  feeds: [],
  articles: [],
  isLoading: false,
  error: null,
  selectedFeedId: 'all',
  selectedCategory: 'all',
  selectedArticle: null,

  fetchFeeds: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .order('title');

      if (error) throw error;
      set({ feeds: data || [] });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addFeed: async (url: string) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Fetch feed data (using helper with fallback)
      const feedData = await fetchRSS(url);

      // 2. Insert into Supabase
      const { data: newFeed, error } = await supabase
        .from('feeds')
        .insert([{ 
          url, 
          title: feedData.title, 
          icon: feedData.image,
          category: 'General' 
        }])
        .select()
        .single();

      if (error) throw error;

      // 3. Update state immediately with new feed AND articles
      const newArticles: FeedItem[] = feedData.items.map((item: any) => ({
        ...item,
        feedId: newFeed.id,
        feedTitle: newFeed.title,
        isRead: false, // Assume new items are unread
      }));

      set((state) => ({ 
        feeds: [...state.feeds, newFeed],
        articles: [...newArticles, ...state.articles].sort((a, b) => 
          new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
        )
      }));
      
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshArticles: async () => {
    set({ isLoading: true, error: null });
    const { feeds } = get();
    let allArticles: FeedItem[] = [];

    try {
      // Fetch read items first
      const { data: readItems } = await supabase.from('read_items').select('url');
      const readUrls = new Set(readItems?.map((i) => i.url) || []);

      // Fetch all feeds in parallel
      const promises = feeds.map(async (feed) => {
        try {
          const feedData = await fetchRSS(feed.url);
          return feedData.items.map((item: any) => ({
            ...item,
            feedId: feed.id,
            feedTitle: feed.title,
            isRead: readUrls.has(item.link),
          }));
        } catch (e) {
          console.error(`Failed to refresh ${feed.title}`, e);
          return [];
        }
      });

      const results = await Promise.all(promises);
      allArticles = results.flat().sort((a, b) => 
        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );

      set({ articles: allArticles });
    } catch (err: any) {
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (url: string) => {
    set((state) => ({
      articles: state.articles.map((a) => 
        a.link === url ? { ...a, isRead: true } : a
      )
    }));

    try {
      const { error } = await supabase
        .from('read_items')
        .insert([{ url }]); 
      
      if (error && error.code !== '23505') { 
        console.error('Error marking as read:', error);
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  },

  setSelectedFeedId: (id) => set({ selectedFeedId: id }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedArticle: (article) => set({ selectedArticle: article }),
}));
