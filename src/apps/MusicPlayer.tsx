'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat1, Shuffle, List } from 'lucide-react';

interface MusicPlayerProps {
  url?: string;
  title?: string;
  artist?: string;
  cover?: string;
}

interface MusicPlayerProps {
  url?: string;
  title?: string;
  artist?: string;
  cover?: string;
}

const PLAYLIST = [
  {
    title: '小屋',
    artist: '赵雷',
    url: 'https://owhqrvhsxmpmrecxavug.supabase.co/storage/v1/object/sign/like/little%20room_zhaolei.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZGRmNGI3Yi0zZDg2LTQ0NGEtYTliNC01NGNkNzc5OGRkMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsaWtlL2xpdHRsZSByb29tX3poYW9sZWkubXAzIiwiaWF0IjoxNzY2MDkzNDAxLCJleHAiOjE3OTc2Mjk0MDF9.9Jj5kY_I4Kki5pZ5X1zLuzfdjrwCJQyrt-e_jJwowmU', // URL from fileSystem.ts
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: '咬春',
    artist: '赵雷',
    url: 'https://owhqrvhsxmpmrecxavug.supabase.co/storage/v1/object/sign/like/bite%20spring.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZGRmNGI3Yi0zZDg2LTQ0NGEtYTliNC01NGNkNzc5OGRkMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsaWtlL2JpdGUgc3ByaW5nLm1wMyIsImlhdCI6MTc2NjA5NzQ5OSwiZXhwIjoxNzk3NjMzNDk5fQ.mIz20gIT4ofbFSAchsrBKJsQvNeVEH9DOeCx48CFfyk',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: '难受',
    artist: '赵雷',
    url: 'https://owhqrvhsxmpmrecxavug.supabase.co/storage/v1/object/sign/like/tough.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZGRmNGI3Yi0zZDg2LTQ0NGEtYTliNC01NGNkNzc5OGRkMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsaWtlL3RvdWdoLm1wMyIsImlhdCI6MTc2NjA5NzUyOSwiZXhwIjoxNzk3NjMzNTI5fQ.TvF05Kf8il0Dge7yyhwyvEQ08PBGLJEM6qIKBNjghd0',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60'
  }
];

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ 
  url: initialUrl, 
  title: initialTitle, 
  artist: initialArtist,
  cover: initialCover
}) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoop, setIsLoop] = useState(true); // Default to true for list loop
  const [volume, setVolume] = useState(0.7);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentSong = PLAYLIST[currentSongIndex];

  // If props are passed (e.g. from file click), they define the "current" song context, 
  // but for now we prioritize our hardcoded playlist as per user request.
  // We can merge them if needed, but the request was specific to these songs.
  
  useEffect(() => {
    if (audioRef.current) {
        // Handle play state change
        if (isPlaying) {
            audioRef.current.play().catch(e => console.error("Play failed:", e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isPlaying, currentSongIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= PLAYLIST.length) {
      nextIndex = 0; // Loop back to start
    }
    setCurrentSongIndex(nextIndex);
    setIsPlaying(true);
  };

  const playPrev = () => {
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) {
      prevIndex = PLAYLIST.length - 1;
    }
    setCurrentSongIndex(prevIndex);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleEnded = () => {
    if (isLoop) {
      playNext();
    } else {
      setIsPlaying(false);
    }
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
               {PLAYLIST.map((song, index) => (
                   <div 
                        key={index}
                        onClick={() => {
                            setCurrentSongIndex(index);
                            setIsPlaying(true);
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

        {/* Main Buttons */}
        <div className="flex items-center justify-between px-4">
          <button className="text-red-300/50 hover:text-yellow-400 transition-colors">
            <Shuffle size={20} />
          </button>
          
          <div className="flex items-center space-x-8">
            <button 
              onClick={playPrev}
              className="text-white hover:text-yellow-400 transition-colors drop-shadow-md"
            >
              <SkipBack size={32} fill="currentColor" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(255,0,0,0.5)] border-2 border-yellow-500/50 hover:scale-105 active:scale-95 transition-all"
            >
              {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={playNext}
              className="text-white hover:text-yellow-400 transition-colors drop-shadow-md"
            >
              <SkipForward size={32} fill="currentColor" />
            </button>
          </div>

          <button 
            onClick={() => setIsLoop(!isLoop)}
            className={`transition-colors drop-shadow-md ${isLoop ? 'text-yellow-400' : 'text-red-300/50 hover:text-yellow-400'}`}
          >
            <Repeat1 size={20} />
          </button>
        </div>

        {/* Volume & Details */}
        <div className="flex items-center space-x-4 px-2">
          <Volume2 size={18} className="text-red-300/50" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-600"
          />
          <button 
            onClick={() => setShowPlaylist(!showPlaylist)}
            className={`transition-colors ${showPlaylist ? 'text-yellow-400' : 'text-red-300/50 hover:text-yellow-400'}`}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      <audio 
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />
    </div>
  );
};
