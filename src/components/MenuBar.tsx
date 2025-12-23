import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Wifi, Battery, Search, Command, Sun, Moon, Maximize, Minimize, Gift, LogOut } from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useThemeStore } from '../store/themeStore';
import { apps } from '../config/apps';
import { userConfig } from '../config/userConfig';
import { useAuthStore } from '../store/authStore';

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
    windX: number;
    setWindX: (val: number) => void;
    turbulence: number;
    setTurbulence: (val: number) => void;
    snowflakeSize: number;
    setSnowflakeSize: (val: number) => void;
  };
}

export const MenuBar: React.FC<MenuBarProps> = ({ 
  onChristmasToggle, 
  showChristmasControls,
  sceneProps 
}) => {
  const { activeWindowId, windows } = useOSStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const { user, initialize, signInWithGoogle, signOut } = useAuthStore();
  
  const [time, setTime] = useState(new Date());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAuthMenu, setShowAuthMenu] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

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
    <div 
      onClick={() => setShowAuthMenu(false)}
      className="h-8 bg-white/20 dark:bg-black/40 backdrop-blur-xl border-b border-white/10 dark:border-white/5 flex items-center justify-between px-4 text-white text-sm select-none z-[10000] relative shadow-sm transition-colors duration-300"
    >
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowAuthMenu(!showAuthMenu);
            }}
            className={`hover:bg-white/20 px-2 py-1 rounded transition-colors font-bold text-base flex items-center gap-2 ${showAuthMenu ? 'bg-white/20' : ''}`}
          >
            {userConfig.profile.initials}
            <div className={`w-2 h-2 rounded-full ${user ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-gray-400'}`} />
          </button>

          {/* Auth Dropdown */}
          {showAuthMenu && (
             <div 
               onClick={(e) => e.stopPropagation()}
               className="absolute top-full left-0 mt-2 p-4 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 text-white flex flex-col gap-3 w-64 shadow-2xl animate-in fade-in zoom-in-95 duration-200 z-[10001] origin-top-left"
             >
               {user ? (
                 <>
                   <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-lg font-bold">
                       {user.email?.[0].toUpperCase()}
                     </div>
                     <div className="flex flex-col overflow-hidden">
                       <span className="font-medium truncate">{user.user_metadata.full_name || 'User'}</span>
                       <span className="text-xs text-gray-400 truncate">{user.email}</span>
                     </div>
                   </div>
                   <button 
                     onClick={() => {
                       signOut();
                       setShowAuthMenu(false);
                     }}
                     className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-red-400 transition-colors text-sm"
                   >
                     <LogOut size={16} />
                     Sign Out
                   </button>
                 </>
               ) : (
                 <>
                   <div className="text-center pb-2 border-b border-white/10">
                     <p className="font-medium">Guest User</p>
                     <p className="text-xs text-gray-400 mt-1">Sign in to access specific apps</p>
                   </div>
                   <button 
                     onClick={() => {
                       signInWithGoogle();
                       setShowAuthMenu(false);
                     }}
                     className="flex items-center justify-center gap-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
                   >
                     <img src="https://www.google.com/favicon.ico" alt="G" className="w-4 h-4" />
                     Sign in with Google
                   </button>
                 </>
               )}
             </div>
          )}
        </div>

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
        {/* ... (rest of the right side components remain unchanged) */}
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
                        {/* ... (Christmas Controls Content) */}
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

                        {/* Wind Control */}
                        <div className="flex flex-col gap-2">
                             <div className="flex justify-between text-xs text-gray-300">
                                <span>Wind (Drift)</span>
                                <span>{sceneProps.windX.toFixed(1)}</span>
                            </div>
                            <input 
                                type="range" 
                                min="-2" 
                                max="2" 
                                step="0.1" 
                                value={sceneProps.windX} 
                                onChange={(e) => sceneProps.setWindX(parseFloat(e.target.value))}
                                className="w-full accent-white h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Turbulence Control */}
                         <div className="flex flex-col gap-2">
                             <div className="flex justify-between text-xs text-gray-300">
                                <span>Turbulence</span>
                                <span>{sceneProps.turbulence.toFixed(1)}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="2" 
                                step="0.1" 
                                value={sceneProps.turbulence} 
                                onChange={(e) => sceneProps.setTurbulence(parseFloat(e.target.value))}
                                className="w-full accent-white h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                         {/* Size Control */}
                         <div className="flex flex-col gap-2">
                             <div className="flex justify-between text-xs text-gray-300">
                                <span>Flake Size</span>
                                <span>{sceneProps.snowflakeSize.toFixed(1)}</span>
                            </div>
                            <input 
                                type="range" 
                                min="0.2" 
                                max="3.0" 
                                step="0.1" 
                                value={sceneProps.snowflakeSize} 
                                onChange={(e) => sceneProps.setSnowflakeSize(parseFloat(e.target.value))}
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
