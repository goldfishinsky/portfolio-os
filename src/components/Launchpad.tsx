import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '../store/osStore';
import { apps } from '../config/apps';
import { Search } from 'lucide-react';

export const Launchpad: React.FC = () => {
  const { isLaunchpadOpen, toggleLaunchpad, openWindow } = useOSStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApps = Object.values(apps).filter(app => 
    app.id !== 'launchpad' && // Don't show Launchpad in Launchpad
    app.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAppClick = (appId: string, title: string, icon: any) => {
    toggleLaunchpad(false);
    // Small delay to allow exit animation to start
    setTimeout(() => {
      openWindow(appId as any, title, icon);
    }, 100);
  };

  return (
    <AnimatePresence>
      {isLaunchpadOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-2xl flex flex-col items-center pt-20"
          onClick={() => toggleLaunchpad(false)}
        >
          {/* Search Bar */}
          <div 
            className="relative mb-12 w-64"
            onClick={(e) => e.stopPropagation()}
          >
            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search" 
              autoFocus
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 transition-colors"
            />
          </div>

          {/* App Grid */}
          <div 
            className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-x-8 gap-y-12 max-w-5xl px-8"
            onClick={(e) => e.stopPropagation()}
          >
            {filteredApps.map((app) => (
              <motion.div
                key={app.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-3 cursor-pointer group"
                onClick={() => handleAppClick(app.id, app.title, app.icon)}
              >
                <div className="w-20 h-20 md:w-24 md:h-24 shadow-2xl rounded-[22%] overflow-hidden">
                  {app.icon}
                </div>
                <span className="text-white font-medium text-sm md:text-base drop-shadow-md text-center">
                  {app.title}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Pagination Dots (Visual Only) */}
          <div className="absolute bottom-8 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-white"></div>
            <div className="w-2 h-2 rounded-full bg-white/30"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
