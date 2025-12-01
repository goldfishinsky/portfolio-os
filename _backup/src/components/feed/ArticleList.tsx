import React, { useState } from 'react';
import { useFeedStore } from '../../store/feedStore';
import { formatDistanceToNow } from 'date-fns';
import { Search } from 'lucide-react';
import { PullToRefresh } from './PullToRefresh';

interface ArticleListProps {
  onSelectArticle?: (article: any) => void;
  selectedArticle?: any;
}

export const ArticleList: React.FC<ArticleListProps> = ({ onSelectArticle, selectedArticle }) => {
  const { articles, selectedFeedId, markAsRead, refreshArticles } = useFeedStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter((article) => {
    const matchesFeed = selectedFeedId === 'all' || article.feedId === selectedFeedId;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          article.contentSnippet.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFeed && matchesSearch;
  });

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div className="w-full md:w-96 bg-gray-50 dark:bg-black border-r border-gray-200 dark:border-white/10 flex flex-col h-full overflow-hidden shrink-0">
      {/* Header / Search */}
      <div className="p-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-200 dark:border-white/5">
        <h1 className="text-2xl font-bold text-black dark:text-white mb-3 tracking-tight">
          {selectedFeedId === 'all' ? 'All Articles' : articles.find(a => a.feedId === selectedFeedId)?.feedTitle || 'Articles'}
        </h1>
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-200/50 dark:bg-white/10 text-black dark:text-white pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder-gray-500"
          />
        </div>
      </div>

      {/* Article List with Pull to Refresh */}
      <div className="flex-1 overflow-hidden relative">
        <PullToRefresh onRefresh={async () => await refreshArticles()}>
          <div className="divide-y divide-gray-200/50 dark:divide-white/5">
            {filteredArticles.map((article) => (
              <div
                key={article.link}
                onClick={() => {
                  markAsRead(article.link);
                  if (onSelectArticle) onSelectArticle(article);
                }}
                className={`p-4 cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-white/5 active:scale-[0.99] ${
                  selectedArticle?.link === article.link ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-1">
                  <h3 className={`font-semibold text-[15px] leading-snug line-clamp-2 ${
                    article.isRead ? 'text-gray-500 dark:text-gray-400' : 'text-black dark:text-white'
                  }`}>
                    {article.title}
                  </h3>
                  {!article.isRead && (
                    <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5 shadow-sm shadow-blue-500/50" />
                  )}
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2 leading-relaxed">
                  {stripHtml(article.contentSnippet)}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 font-medium">
                  <span className="flex items-center gap-1">
                    {article.feedTitle}
                  </span>
                  <span>{formatDistanceToNow(new Date(article.pubDate), { addSuffix: true })}</span>
                </div>
              </div>
            ))}
            
            {filteredArticles.length === 0 && (
              <div className="p-8 text-center text-gray-400">
                No articles found
              </div>
            )}
          </div>
        </PullToRefresh>
      </div>
    </div>
  );
};
