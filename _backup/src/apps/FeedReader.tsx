import React, { useEffect, useState } from 'react';
import { FeedSidebar } from '../components/feed/FeedSidebar';
import { ArticleList } from '../components/feed/ArticleList';
import { ArticleView } from '../components/feed/ArticleView';
import { useFeedStore } from '../store/feedStore';
import { ChevronLeft } from 'lucide-react';

export const FeedReader: React.FC = () => {
  const { fetchFeeds, refreshArticles, selectedArticle, setSelectedArticle, setSelectedFeedId } = useFeedStore();
  const [deviceType, setDeviceType] = useState<'phone' | 'tablet'>('tablet');
  // Phone Navigation State: 'feeds' -> 'articles' -> 'reader'
  const [phoneView, setPhoneView] = useState<'feeds' | 'articles' | 'reader'>('feeds');

  useEffect(() => {
    const init = async () => {
      await fetchFeeds();
      // Only refresh articles after feeds are loaded
      refreshArticles();
    };
    init();
    
    // Simple responsive check based on window width (or container width if we could measure it)
    // For now, let's default to tablet, but if the window is small, switch to phone.
    // Since this is running in a "window" in our OS, we might want to listen to resize events or just check initial.
    // Let's use a ResizeObserver on the container if possible, but for simplicity, we'll assume Tablet for now unless explicitly resized small.
    // Actually, let's make it dynamic based on the props passed from the OS window if available, or just use a ref.
  }, []);

  // Handle resizing to switch frames
  const containerRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 800) {
          setDeviceType('phone');
        } else {
          setDeviceType('tablet');
        }
      }
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // Phone Navigation Logic
  const handleFeedSelect = (id: string | 'all') => {
    setSelectedFeedId(id);
    setPhoneView('articles');
  };

  const handleArticleSelect = (article: any) => {
    setSelectedArticle(article);
    setPhoneView('reader');
  };

  const handleBack = () => {
    if (phoneView === 'reader') {
      setPhoneView('articles');
      setSelectedArticle(null);
    } else if (phoneView === 'articles') {
      setPhoneView('feeds');
      setSelectedFeedId('all');
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full bg-white dark:bg-black text-black dark:text-white overflow-hidden font-sans flex relative">
      {deviceType === 'tablet' ? (
        // Tablet/Desktop Layout: Split View
        <>
          <FeedSidebar />
          <ArticleList 
            onSelectArticle={setSelectedArticle} 
            selectedArticle={selectedArticle}
          />
          <ArticleView article={selectedArticle} />
        </>
      ) : (
        // Phone Layout: Stacked Navigation
        <div className="w-full h-full relative">
          {/* Header for Back Button - Only show when not in main feed list */}
          {phoneView !== 'feeds' && (
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center px-4 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/5 dark:border-white/10 transition-all">
              <button 
                onClick={handleBack} 
                className="flex items-center text-blue-500 gap-1 font-medium active:opacity-50 transition-opacity"
              >
                <ChevronLeft size={24} />
                <span className="text-lg">Back</span>
              </button>
            </div>
          )}

          {/* Views with slide transitions (simulated with conditional rendering for now) */}
          {phoneView === 'feeds' && (
            <div className="w-full h-full">
               <FeedSidebarWrapper onSelect={handleFeedSelect} />
            </div>
          )}
          
          {phoneView === 'articles' && (
            <div className="w-full h-full pt-12">
              <ArticleList 
                onSelectArticle={handleArticleSelect} 
                selectedArticle={selectedArticle}
              />
            </div>
          )}

          {phoneView === 'reader' && (
            <div className="w-full h-full pt-12 bg-white dark:bg-black">
              <ArticleView article={selectedArticle} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Wrapper to intercept Sidebar clicks for Phone view
const FeedSidebarWrapper: React.FC<{ onSelect: (id: string | 'all') => void }> = ({ onSelect }) => {
  // We need to reimplement the sidebar UI briefly or modify the original Sidebar to accept an onSelect prop.
  // Modifying the original Sidebar is cleaner. 
  // For now, let's just render the original Sidebar, but we need to intercept the state change.
  // Actually, the Sidebar uses the store directly. 
  // Let's modify FeedSidebar to accept an optional onSelect callback.
  
  return <FeedSidebar onNavigate={onSelect} />;
};
