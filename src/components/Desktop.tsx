import React, { useState } from 'react';
import { useOSStore } from '../store/osStore';
import { apps } from '../config/apps';
import { Taskbar } from './Taskbar';
import { MenuBar } from './MenuBar';
import { WindowFrame } from './WindowFrame';
import { ContextMenu } from './ContextMenu';
import { AnimatePresence } from 'framer-motion';

export const Desktop: React.FC = () => {
  const { windows, openWindow } = useOSStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [wallpaper, setWallpaper] = useState(() => {
    return localStorage.getItem('wallpaper') || 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80';
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleContextMenuAction = (action: string) => {
    switch (action) {
      case 'refresh':
        window.location.reload();
        break;
      case 'wallpaper':
        const wallpapers = [
          'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2940&q=80',
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
          'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80',
        ];
        const currentIdx = wallpapers.indexOf(wallpaper);
        const nextIdx = (currentIdx + 1) % wallpapers.length;
        const nextWallpaper = wallpapers[nextIdx];
        setWallpaper(nextWallpaper);
        localStorage.setItem('wallpaper', nextWallpaper);
        break;
      case 'new_folder':
        alert('New Folder created (simulation)');
        break;
      case 'info':
        alert('React Web OS v1.0\nCreated by Junrong Huang');
        break;
    }
  };

  return (
    <div 
      className="relative w-screen h-screen overflow-hidden bg-cover bg-center" 
      style={{ backgroundImage: `url('${wallpaper}')` }}
      onContextMenu={handleContextMenu}
      onClick={() => setContextMenu(null)}
    >
      <MenuBar />
      
      {/* Desktop Icons Grid */}
      <div className="absolute top-8 left-0 bottom-20 p-4 flex flex-col flex-wrap content-start gap-4 z-0">
        {Object.values(apps).map((app) => (
          <button
            key={app.id}
            onDoubleClick={() => openWindow(app.id, app.title)}
            className="w-24 h-28 flex flex-col items-center justify-center gap-2 rounded hover:bg-white/20 transition-colors group text-white text-shadow-sm"
          >
            <div className="text-white drop-shadow-md group-hover:scale-105 transition-transform w-16 h-16 flex items-center justify-center">
              {app.icon}
            </div>
            <span className="text-xs text-center font-medium drop-shadow-md line-clamp-2 leading-tight bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
              {app.title}
            </span>
          </button>
        ))}
      </div>

      {/* Window Container */}
      <div className="absolute inset-0 top-8 bottom-20 pointer-events-none z-10">
        <AnimatePresence>
          {windows.map((window) => {
            const AppComp = apps[window.appId]?.component;
            if (!AppComp) return null;
            
            return (
              <div key={window.id} className="pointer-events-auto">
                <WindowFrame window={window}>
                  <AppComp />
                </WindowFrame>
              </div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Dock (formerly Taskbar) */}
      <Taskbar apps={apps} />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          onClose={() => setContextMenu(null)} 
          onAction={handleContextMenuAction}
        />
      )}
    </div>
  );
};
