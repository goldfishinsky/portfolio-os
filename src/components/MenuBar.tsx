import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Wifi, Battery, Search, Command, Sun, Moon } from 'lucide-react';
import { useOSStore } from '../store/osStore';
import { useThemeStore } from '../store/themeStore';
import { apps } from '../config/apps';

import { userConfig } from '../config/userConfig';

export const MenuBar: React.FC = () => {
  const { activeWindowId, windows } = useOSStore();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
        <div className="flex items-center gap-3 text-white/90">
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
          <Command size={16} />
        </div>
        <div className="cursor-default hover:bg-white/20 px-2 py-0.5 rounded transition-colors">
          {format(time, 'EEE MMM d h:mm aa')}
        </div>
      </div>
    </div>
  );
};
