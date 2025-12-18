import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Wifi, Battery, Search, Command, Sun, Moon, Maximize, Minimize, Gift } from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useThemeStore } from '../store/themeStore';
import { apps } from '../config/apps';

import { userConfig } from '../config/userConfig';

interface MenuBarProps {
  onChristmasToggle?: () => void;
  showChristmasControls?: boolean;
  sceneProps?: {
    isInteractive: boolean;
    setIsInteractive: (val: boolean) => void;
    snowSpeed: number;
    setSnowSpeed: (val: number) => void;
    isSnowing: boolean;
    setIsSnowing: (val: boolean) => void;
    sceneMode: 'night' | 'sunset';
    setSceneMode: (val: 'night' | 'sunset') => void;
  };
}

export const MenuBar: React.FC<MenuBarProps> = ({ 
  onChristmasToggle, 
  showChristmasControls,
  sceneProps 
}) => {
  const { activeWindowId, windows } = useOSStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [time, setTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const activeAppId = windows.find(w => w.id === activeWindowId)?.appId;
  const activeAppName = activeAppId ? apps[activeAppId]?.title : 'Finder';

  return (
    <div className="h-8 bg-white/20 dark:bg-black/40 backdrop-blur-xl border-b border-white/10 dark:border-white/5 flex items-center justify-between px-4 text-white text-sm select-none z-[10000] relative shadow-sm transition-colors duration-300">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button className="hover:bg-white/20 px-2 py-1 rounded transition-colors font-bold text-base">
          {userConfig.profile.initials}
        </button>
        <span className="font-bold">{activeAppName}</span>
        <div className="hidden sm:flex gap-4 text-white/90">
          <span className="cursor-default hover:text-white">File</span>
          <span className="cursor-default hover:text-white">Edit</span>
          <span className="cursor-default hover:text-white">View</span>
          <span className="cursor-default hover:text-white">Go</span>
          <span className="cursor-default hover:text-white">Window</span>
          <span className="cursor-default hover:text-white">Help</span>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 text-white/90 relative">
          <button 
            onClick={toggleTheme}
            className="hover:bg-white/20 p-1 rounded transition-colors"
            title={isDarkMode ? "Current: Dark Mode" : "Current: Light Mode"}
          >
            {isDarkMode ? <Moon size={16} /> : <Sun size={16} />}
          </button>
          <div className="h-4 w-[1px] bg-white/20 mx-1" />
          <Battery size={18} />
          <Wifi size={16} />
          <Search size={16} />
          {/* Christmas Controls Toggle */}
          {onChristmasToggle && sceneProps && (
            <div className="relative">
                <button
                onClick={(e) => {
                    e.stopPropagation();
                    onChristmasToggle();
                }}
                className={`hover:bg-white/20 p-0.5 rounded transition-colors ${showChristmasControls ? 'bg-white/20' : ''}`}
                title="Christmas Settings"
                >
                <img src="/minion_icon_final.png" alt="Xmas" className="w-5 h-5 object-cover rounded shadow-sm" />
                </button>
                
                {/* Dropdown Menu */}
                {showChristmasControls && (
                    <div 
                        onClick={(e) => e.stopPropagation()}
                        className="absolute top-full right-0 mt-2 p-4 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 text-white flex flex-col gap-4 w-64 shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-[10001] origin-top-right"
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Interactive Mode</span>
                            <button 
                                onClick={() => sceneProps.setIsInteractive(!sceneProps.isInteractive)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${sceneProps.isInteractive ? 'bg-green-500' : 'bg-gray-600'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${sceneProps.isInteractive ? 'left-7' : 'left-1'}`} />
                            </button>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <span className="text-xs text-gray-300">Ambience</span>
                            <div className="flex bg-white/10 rounded-lg p-1">
                                <button 
                                    onClick={() => sceneProps.setSceneMode('night')}
                                    className={`flex-1 text-xs py-1.5 rounded-md transition-all ${sceneProps.sceneMode === 'night' ? 'bg-blue-500/80 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Night
                                </button>
                                <button 
                                    onClick={() => sceneProps.setSceneMode('sunset')}
                                    className={`flex-1 text-xs py-1.5 rounded-md transition-all ${sceneProps.sceneMode === 'sunset' ? 'bg-orange-500/80 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Sunset
                                </button>
                            </div>
                        </div>

                        {/* Snow Toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium opacity-80">Snow</span>
                            <button 
                                onClick={() => sceneProps.setIsSnowing(!sceneProps.isSnowing)}
                                className={`w-12 h-6 rounded-full transition-colors relative ${sceneProps.isSnowing ? 'bg-green-500/50' : 'bg-white/10'}`}
                            >
                                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${sceneProps.isSnowing ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-xs text-gray-300">
                                <span>Snow Speed</span>
                                <span>{Math.round(sceneProps.snowSpeed * 10)}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="2" 
                                step="0.1" 
                                value={sceneProps.snowSpeed} 
                                onChange={(e) => sceneProps.setSnowSpeed(parseFloat(e.target.value))}
                                className="w-full accent-white h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                        
                        <div className="text-[10px] text-gray-400 text-center border-t border-white/10 pt-2 mt-1">
                            {sceneProps.isInteractive ? 'Scroll to zoom • Click/drag to rotate' : 'Wallpaper mode enabled'}
                        </div>
                    </div>
                )}
            </div>
          )}
          <button
            onClick={toggleFullscreen}
            className="hover:bg-white/20 p-1 rounded transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
        <div className="cursor-default hover:bg-white/20 px-2 py-0.5 rounded transition-colors">
          {format(time, 'EEE MMM d h:mm aa')}
        </div>
      </div>
    </div>
  );
};
