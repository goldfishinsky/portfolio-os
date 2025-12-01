import React, { useState } from 'react';

interface VideoPlayerProps {
  bvid?: string;
  title?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ bvid }) => {
  const [currentBvid, setCurrentBvid] = useState(bvid || 'BV1xq63YUEqY'); // Default to first video

  // List of vlogs for the sidebar/playlist
  const vlogs = [
    { id: 'BV1xq63YUEqY', title: 'Vlog 1: Tokyo Trip' },
    { id: 'BV1Ec41187GM', title: 'Vlog 2: Coding Setup' },
    { id: 'BV1C4HjzsEHs', title: 'Vlog 3: Day in Life' },
  ];

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
              <div className="line-clamp-1">{vlog.title}</div>
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
