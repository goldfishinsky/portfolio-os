'use client';

import React, { useState, useEffect } from 'react';
import { useOSStore } from '../store/osStore';
import { apps } from '../config/apps';
import { Taskbar } from './Taskbar';
import { MenuBar } from './MenuBar';
import { WindowFrame } from './WindowFrame';
import { ContextMenu } from './ContextMenu';
import { AnimatePresence } from 'framer-motion';
import { Launchpad } from './Launchpad';
import { fileSystem } from '../utils/fileSystem';
import { userConfig } from '../config/userConfig';
import { FileText, Folder, Music } from 'lucide-react';
import videoFileIcon from '../assets/icons/video-file.png';
import { ChristmasScene } from './ChristmasScene';

export const Desktop: React.FC = () => {
  const { windows, openWindow } = useOSStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [showChristmasControls, setShowChristmasControls] = useState(false);

  // Lifted Christmas Scene State
  const [isInteractive, setIsInteractive] = useState(true);
  const [snowSpeed, setSnowSpeed] = useState(0.2); 
  const [isSnowing, setIsSnowing] = useState(true);
  const [sceneMode, setSceneMode] = useState<'night' | 'sunset'>('night');

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
        alert('Wallpaper is locked to Christmas Scene for this demo.');
        break;
      case 'new_folder':
        alert('New Folder created (simulation)');
        break;
      case 'settings':
        alert('Settings not implemented');
        break;
      case 'info':
        alert('React Web OS v1.0.0');
        break;
    }
    setContextMenu(null);
  };

  const handleDesktopItemClick = (name: string, item: any) => {
    if (item.type === 'folder') {
      // For now, just alert or open Finder if we had a way to pass path
      // Since Finder isn't fully implemented for paths, we'll just open the folder if it's Vlogs by name for now, 
      // or generic Finder. Ideally Finder should take a path prop.
      if (name === 'Vlogs') {
        // Open Finder with specific path
        openWindow('finder', name, undefined, { initialPath: ['Desktop', 'Vlogs'] });
      } else {
        openWindow('finder', 'Finder');
      }
    } else if (item.metadata?.appId) {
       openWindow(item.metadata.appId, item.name, undefined, item.metadata);
    } else if (name === userConfig.system.resumeFilename) {
      openWindow('resume', 'Resume');
    } else {
      alert(`Opening ${name}...`);
    }
  };

  const handleChristmasToggle = React.useCallback(() => {
    setShowChristmasControls(prev => !prev);
  }, []);

    // Force re-render after vlogs are loaded
    const [, setForceUpdate] = useState(0);

    useEffect(() => {
    // Fetch vlogs on mount
    import('../utils/bilibili').then(({ fetchBilibiliVlogs }) => {
      fetchBilibiliVlogs().then(success => {
        if (success) {
          setForceUpdate(n => n + 1);
        }
      });
    });
  }, []);

  return (
    <div
      className="h-screen w-screen overflow-hidden relative select-none bg-black"
      onContextMenu={handleContextMenu}
      onClick={() => {
        setContextMenu(null);
        setShowChristmasControls(false);
      }}
    >
      {/* 3D Wallpaper Layer */}
      <ChristmasScene 
        isInteractive={isInteractive}
        snowSpeed={snowSpeed}
        isSnowing={isSnowing}
        sceneMode={sceneMode}
      />

      {/* Overlay Layer */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/20 pointer-events-none transition-colors duration-500 z-0" />

      {/* System Components */}
      <div className="relative z-10 pointer-events-none h-full w-full">
        {/* Re-enable pointer events for specific UI elements */}
        <div className="pointer-events-auto">
          <MenuBar 
            onChristmasToggle={handleChristmasToggle}
            showChristmasControls={showChristmasControls}
            sceneProps={{
              isInteractive, setIsInteractive,
              snowSpeed, setSnowSpeed,
              isSnowing, setIsSnowing,
              sceneMode, setSceneMode
            }}
          />
        </div>

        <div className="pointer-events-auto">
          <Launchpad />
        </div>

        {/* Desktop Icons Area */}
        <div className="absolute top-8 right-0 bottom-20 p-4 flex flex-col flex-wrap content-end gap-6 z-0 items-end pointer-events-none">
          {/* Christmas Control App - MOVED TO MENU BAR */}
          
          {Object.entries(fileSystem.children?.['Desktop']?.children || {}).map(([name, item]) => (
            <button
              key={name}
              onDoubleClick={() => handleDesktopItemClick(name, item)}
              className="w-24 flex flex-col items-center gap-1 group text-white text-shadow-sm pointer-events-auto"
            >
              {item.type === 'folder' ? (
                <div className="w-16 h-16 text-blue-400 drop-shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
                  <Folder size={64} fill="currentColor" />
                </div>
              ) : item.icon === 'video' ? (
                <div className="w-16 h-16 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <img src={videoFileIcon.src} alt="Video" className="w-12 h-12 object-cover rounded-lg drop-shadow-md" />
                </div>
              ) : item.icon === 'music' ? (
                <div className="w-16 h-16 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-lg border border-white/20 relative overflow-visible">
                    <Music size={32} className="text-white drop-shadow-md" stroke="#ffd700" />
                    {/* Tiny hat on desktop icon */}
                    <div className="absolute -top-1 -right-1 rotate-12 scale-50">
                      <div className="w-6 h-4 bg-red-500 rounded-t-full relative">
                        <div className="absolute -bottom-1 -left-1 w-8 h-2 bg-white rounded-full" />
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-14 h-16 bg-white rounded-[2px] shadow-sm flex flex-col items-center justify-center relative group-hover:brightness-95 transition-all">
                  {/* PDF/File Style */}
                  <div className="absolute top-0 right-0 w-4 h-4 bg-gray-200 rounded-bl-lg" />
                  <div className="mt-2 text-[8px] font-bold text-red-500 uppercase tracking-wider">PDF</div>
                  <FileText size={24} className="text-gray-400" />
                </div>
              )}
              <span className="text-xs text-center font-medium drop-shadow-md line-clamp-2 leading-tight bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
                {name}
              </span>
            </button>
          ))}
        </div>

        {/* Window Container */}
        <div className="absolute inset-0 top-8 bottom-20 pointer-events-none z-20">
          <AnimatePresence>
            {windows.map((window) => {
              const AppComp = apps[window.appId]?.component;
              if (!AppComp) return null;

              return (
                <div key={window.id} className="pointer-events-auto">
                  <WindowFrame window={window}>
                    <AppComp {...window.props} />
                  </WindowFrame>
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Dock (formerly Taskbar) */}
        <div className="absolute inset-0 z-30 pointer-events-none">
          <Taskbar apps={apps} />
        </div>

        {/* Context Menu */}
        {contextMenu && (
          <div className="pointer-events-auto relative z-50">
            <ContextMenu
              x={contextMenu.x}
              y={contextMenu.y}
              onClose={() => setContextMenu(null)}
              onAction={handleContextMenuAction}
            />
          </div>
        )}
      </div>
    </div>
  );
};
