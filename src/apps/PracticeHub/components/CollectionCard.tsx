import React, { useMemo } from 'react';
import { CollectionItem, TAG_COLORS } from '../types';
import { usePracticeHubStore } from '../store/usePracticeHubStore';

interface CollectionCardProps {
  item: CollectionItem;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ item }) => {
  const { logPractice, openDetailPanel } = usePracticeHubStore();

  const handleQuickLog = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real implementation with backend, we'd call an API here.
    // For now, we update the store.
    logPractice(item.id);
  };

  const timeSinceLastPractice = useMemo(() => {
    if (!item.last_practiced) return 'Never';
    const diff = new Date().getTime() - new Date(item.last_practiced).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  }, [item.last_practiced]);

  const platformIcon = useMemo(() => {
    switch (item.platform) {
      case 'bilibili': return '📺';
      case 'youtube': return '▶️';
      case 'xiaohongshu': return '📕';
      case 'douyin': return '🎵';
      default: return '🔗';
    }
  }, [item.platform]);

  return (
    <div 
      className="group relative bg-slate-100 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer select-none"
      style={{
        boxShadow: '8px 8px 16px rgba(163, 177, 198, 0.6), -6px -6px 12px rgba(255, 255, 255, 0.8)'
      }}
      onClick={() => openDetailPanel(item)}
    >
      {/* Thumbnail Area */}
      <div className="aspect-video w-full rounded-xl bg-slate-200 overflow-hidden mb-4 relative shadow-inner">
        {item.thumbnail ? (
          <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 text-4xl">
            {platformIcon}
          </div>
        )}
        
        {/* Platform Badge */}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg text-xs font-medium shadow-sm flex items-center gap-1">
          {platformIcon} <span className="capitalize">{item.platform}</span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-slate-700 line-clamp-2 min-h-[1.5rem] text-sm leading-snug group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 h-6 overflow-hidden">
          {item.tags.slice(0, 3).map(tag => (
            <span 
              key={tag} 
              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-blue-50 text-blue-500 border border-blue-100"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] text-slate-400">+{item.tags.length - 3}</span>
          )}
        </div>

        {/* Footer / Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
          <div className="flex flex-col text-xs text-slate-500">
            <span className="flex items-center gap-1">
              📊 <b>{item.practice_count}</b> times
            </span>
            <span className="flex items-center gap-1 text-[10px] opacity-75">
              🕐 {timeSinceLastPractice}
            </span>
          </div>

          <button 
            onClick={handleQuickLog}
            className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 text-slate-600 hover:text-green-600 active:scale-95 active:shadow-inner transition-all"
            style={{
              boxShadow: '4px 4px 8px rgba(163, 177, 198, 0.6), -4px -4px 8px rgba(255, 255, 255, 0.8)'
            }}
            title="Quick Log (+1)"
          >
            +1
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;
