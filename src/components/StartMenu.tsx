import React from 'react';
import { useOSStore } from '../store/osStore';
import type { AppConfig } from '../types';
import { Search, Power } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StartMenuProps {
  apps: Record<string, AppConfig>;
}

export const StartMenu: React.FC<StartMenuProps> = ({ apps }) => {
  const { isStartMenuOpen, openWindow } = useOSStore();

  if (!isStartMenuOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="absolute bottom-14 left-4 w-[600px] h-[700px] bg-window-bg backdrop-blur-2xl rounded-xl shadow-2xl border border-white/40 flex flex-col overflow-hidden z-[9998]"
      >
        {/* Search */}
        <div className="p-6 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Type here to search"
              className="w-full bg-white/50 border border-gray-200 rounded-full py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>

        {/* Pinned Apps Grid */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-semibold text-gray-600">Pinned</h3>
            <button className="text-xs text-blue-600 hover:underline">All apps &gt;</button>
          </div>
          
          <div className="grid grid-cols-6 gap-4">
            {Object.values(apps).map((app) => (
              <button
                key={app.id}
                onClick={() => openWindow(app.id, app.title)}
                className="flex flex-col items-center gap-2 p-2 rounded hover:bg-white/50 transition-colors group"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-shadow">
                  {app.icon}
                </div>
                <span className="text-xs text-center text-gray-700 font-medium">{app.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="h-16 bg-black/5 border-t border-gray-200/50 flex items-center justify-between px-6">
          <div className="flex items-center gap-3 hover:bg-white/40 p-2 rounded cursor-pointer transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
              H
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800">Henry</span>
              <span className="text-xs text-gray-500">Admin</span>
            </div>
          </div>
          
          <button className="p-2 hover:bg-white/40 rounded text-gray-700">
            <Power size={20} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
