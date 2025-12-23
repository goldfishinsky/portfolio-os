'use client';

import React, { useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat1, Shuffle, List } from 'lucide-react';
import { useMusicStore } from '../store/musicStore';

interface MusicPlayerProps {
  url?: string;
  title?: string;
  artist?: string;
  cover?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  url: initialUrl, 
  title: initialTitle, 
  artist: initialArtist,
  cover: initialCover
}) => {
  const { 
    playlist,
    currentSongIndex,
    isPlaying,
    progress,
    duration,
    volume,
    isLoop,
    togglePlay,
    playNext,
    playPrev,
    setVolume,
    setIsLoop,
    setCurrentSongIndex,
    setProgress
  } = useMusicStore();

  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const currentSong = playlist[currentSongIndex];

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setProgress(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full w-full bg-gradient-to-b from-red-900/90 to-black/90 backdrop-blur-xl flex flex-col p-6 select-none overflow-hidden relative">
      {/* Snow effect background layer */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full"
            style={{ 
              width: `${Math.random() * 4 + 2}px`, 
              height: `${Math.random() * 4 + 2}px`,
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.3
            }} 
          />
        ))}
      </div>

      {/* Playlist Overlay */}
      {showPlaylist && (
        <div className="absolute inset-0 bg-black/80 z-20 overflow-y-auto p-4 animate-in fade-in duration-200">
           <div className="flex justify-between items-center mb-4">
               <h3 className="text-white text-lg font-bold">Playlist</h3>
               <button onClick={() => setShowPlaylist(false)} className="text-white/60 hover:text-white">✕</button>
           </div>
           <div className="space-y-2">
               {playlist.map((song, index) => (
                   <div 
                        key={index}
                        onClick={() => {
                            setCurrentSongIndex(index);
                            setShowPlaylist(false);
                        }}
                        className={`p-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors ${currentSongIndex === index ? 'bg-red-900/50 border border-yellow-500/30' : 'hover:bg-white/10'}`}
                   >
                       <img src={song.cover} className="w-10 h-10 rounded object-cover" />
                       <div>
                           <div className={`font-medium ${currentSongIndex === index ? 'text-yellow-400' : 'text-white'}`}>{song.title}</div>
                           <div className="text-xs text-white/50">{song.artist}</div>
                       </div>
                       {currentSongIndex === index && isPlaying && (
                           <div className="ml-auto">
                               <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                           </div>
                       )}
                   </div>
               ))}
           </div>
        </div>
      )}

      {/* Album Art & Info */}
      <div className="flex flex-col items-center flex-1 justify-center space-y-6 relative z-10 p-4">
        <div className="w-56 h-56 rounded-2xl shadow-[0_20px_50px_rgba(255,0,0,0.3)] overflow-hidden group relative border-4 border-yellow-600/30">
          <img 
            src={currentSong.cover} 
            alt="Album Cover" 
            className={`w-full h-full object-cover transition-transform duration-700 ${isPlaying ? 'scale-110' : 'scale-100'}`}
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          
          {/* Santa Hat on Album */}
          <div className="absolute -top-4 -right-4 rotate-12 scale-110 drop-shadow-xl">
            <div className="w-16 h-12 bg-red-600 rounded-t-full relative">
              <div className="absolute -bottom-2 -left-2 w-20 h-5 bg-white rounded-full shadow-lg" />
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-white rounded-full shadow-lg" />
            </div>
          </div>
        </div>
        
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold text-white drop-shadow-md truncate max-w-xs">{currentSong.title}</h2>
          <p className="text-yellow-500/80 font-medium">✨ {currentSong.artist} ✨</p>
        </div>
      </div>

      {/* Controls Area */}
      <div className="space-y-6 mt-auto pb-4 relative z-10">
        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            step="0.1"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-500"
          />
          <div className="flex justify-between text-xs font-semibold text-red-200/60">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Unified Controls Row */}
        <div className="flex items-center justify-between px-6">
          {/* Volume Control (Far Left) */}
          <div className="relative">
            <button 
              onClick={() => setShowVolumeControl(!showVolumeControl)}
              className={`transition-colors ${showVolumeControl ? 'text-yellow-400' : 'text-red-300/50 hover:text-yellow-400'}`}
            >
              <Volume2 size={22} />
            </button>
            
            {showVolumeControl && (
              <div className="absolute bottom-12 left-0 w-8 h-28 bg-black/90 backdrop-blur-md rounded-xl border border-white/10 flex flex-col items-center justify-end pb-3 pt-3 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50 shadow-2xl">
                 <div className="h-20 w-1 bg-white/20 rounded-full relative">
                    <div 
                      className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-full"
                      style={{ height: `${volume * 100}%` }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      style={{ appearance: 'slider-vertical' as any }}
                    />
                 </div>
              </div>
            )}
          </div>

          <button className="text-red-300/50 hover:text-yellow-400 transition-colors transform active:scale-95">
            <Shuffle size={20} />
          </button>
          
          <div className="flex items-center space-x-6">
            <button 
              onClick={playPrev}
              className="text-white hover:text-yellow-400 transition-colors drop-shadow-md transform active:scale-95"
            >
              <SkipBack size={26} fill="currentColor" />
            </button>
            <button 
              onClick={() => togglePlay()}
              className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,0,0,0.5)] border-2 border-yellow-500/50 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={playNext}
              className="text-white hover:text-yellow-400 transition-colors drop-shadow-md transform active:scale-95"
            >
              <SkipForward size={26} fill="currentColor" />
            </button>
          </div>

          <button 
            onClick={() => setIsLoop(!isLoop)}
            className={`transition-colors drop-shadow-md transform active:scale-95 ${isLoop ? 'text-yellow-400' : 'text-red-300/50 hover:text-yellow-400'}`}
          >
            <Repeat1 size={20} />
          </button>

          <button 
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`transition-colors transform active:scale-95 ${showPlaylist ? 'text-yellow-400' : 'text-red-300/50 hover:text-yellow-400'}`}
          >
            <List size={22} />
          </button>
        </div>
      </div>
    </div>
  );
};
