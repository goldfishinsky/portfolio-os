import React, { useState } from 'react';

interface VideoPlayerProps {
  bvid?: string;
  title?: string;
}

import { fileSystem } from '../utils/fileSystem';

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ bvid }) => {
  // Get vlogs dynamically from fileSystem
  const getVlogs = () => {
    const vlogsFolder = fileSystem.children?.['Desktop']?.children?.['Vlogs'];
    if (vlogsFolder && vlogsFolder.children) {
      return Object.values(vlogsFolder.children)
        .filter((file) => file.metadata?.appId === 'video-player')
        .map((file) => ({
          id: file.metadata.bvid,
          title: file.metadata.title,
          cover: file.metadata.cover,
        }));
    }
    return [];
  };

  const vlogs = getVlogs();
  const [currentBvid, setCurrentBvid] = useState(bvid || (vlogs.length > 0 ? vlogs[0].id : 'BV1xq63YUEqY')); 

  // Effect to update current video if props change or initial load
  React.useEffect(() => {
    if (bvid) setCurrentBvid(bvid);
    else if (vlogs.length > 0 && !currentBvid) setCurrentBvid(vlogs[0].id);
  }, [bvid, vlogs.length]);

  return (
    <div className="flex h-full w-full bg-black text-white overflow-hidden">
      {/* Sidebar (Playlist) */}
      <div className="w-64 bg-[#1c1c1e] border-r border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10 bg-[#2c2c2e]">
          <h2 className="font-semibold text-sm text-gray-300">My Vlogs</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {vlogs.map((vlog) => (
            <button
              key={vlog.id}
              onClick={() => setCurrentBvid(vlog.id)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                currentBvid === vlog.id 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="line-clamp-2">{vlog.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Player Area */}
      <div className="flex-1 flex flex-col bg-black relative">
        <div className="flex-1 relative">
          <iframe
            src={`https://player.bilibili.com/player.html?bvid=${currentBvid}&page=1&high_quality=1&danmaku=0`}
            className="absolute inset-0 w-full h-full border-none"
            allowFullScreen
            title="Bilibili Player"
          />
        </div>
        {/* Controls Bar (Visual only, as iframe handles controls) */}
        <div className="h-12 bg-[#1c1c1e] border-t border-white/10 flex items-center px-4 justify-between">
          <div className="text-xs text-gray-500">
            Playing: {vlogs.find(v => v.id === currentBvid)?.title || 'Unknown Video'}
          </div>
          <div className="text-xs text-gray-600 font-mono">
            Bilibili Player
          </div>
        </div>
      </div>
    </div>
  );
};
