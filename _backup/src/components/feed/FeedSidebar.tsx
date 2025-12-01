import React, { useState } from 'react';
import { Rss, Plus, LayoutGrid, Folder } from 'lucide-react';
import { useFeedStore } from '../../store/feedStore';

interface FeedSidebarProps {
  onNavigate?: (id: string | 'all') => void;
}

export const FeedSidebar: React.FC<FeedSidebarProps> = ({ onNavigate }) => {
  const { feeds, addFeed, selectedFeedId, setSelectedFeedId } = useFeedStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newUrl, setNewUrl] = useState('');

  const handleAddFeed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newUrl) {
      await addFeed(newUrl);
      setNewUrl('');
      setIsAdding(false);
    }
  };

  const handleSelect = (id: string | 'all') => {
    setSelectedFeedId(id);
    if (onNavigate) onNavigate(id);
  };

  return (
    <div className="w-64 bg-gray-100/80 dark:bg-black/40 backdrop-blur-2xl border-r border-gray-200 dark:border-white/10 flex flex-col h-full shrink-0">
      <div className="p-4 pt-6">
        <h2 className="text-xl font-bold text-black dark:text-white flex items-center gap-2 mb-6 px-2">
          <Rss size={24} className="text-orange-500" />
          Feed
        </h2>

        <button
          onClick={() => handleSelect('all')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all mb-6 ${
            selectedFeedId === 'all'
              ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <LayoutGrid size={18} />
          All Articles
        </button>

        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Subscriptions
          </span>
          <button 
            onClick={() => setIsAdding(true)}
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-1">
          {feeds.map((feed) => (
            <button
              key={feed.id}
              onClick={() => handleSelect(feed.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedFeedId === feed.id
                  ? 'bg-white dark:bg-white/10 text-black dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/5'
              }`}
            >
              {feed.icon ? (
                <img src={feed.icon} alt="" className="w-4 h-4 rounded-sm" />
              ) : (
                <Folder size={18} />
              )}
              <span className="truncate">{feed.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Feed Modal/Input */}
      {isAdding && (
        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-md">
          <form onSubmit={handleAddFeed}>
            <input
              autoFocus
              type="text"
              placeholder="Paste RSS URL..."
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2 text-sm mb-2 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black dark:text-white"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-500 text-white text-xs font-bold py-1.5 rounded-md hover:bg-blue-600">
                Add
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-gray-300 text-xs font-bold py-1.5 rounded-md hover:bg-gray-300 dark:hover:bg-white/20">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
