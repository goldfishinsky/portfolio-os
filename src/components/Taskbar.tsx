import React, { useRef } from 'react';
import { useOSStore } from '../store/osStore';
import type { AppConfig } from '../types';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface TaskbarProps {
  apps: Record<string, AppConfig>;
}

export const Taskbar: React.FC<TaskbarProps> = ({ apps }) => {
  const { windows, openWindow, focusWindow, toggleLaunchpad, isLaunchpadOpen } = useOSStore();
  const mouseX = useMotionValue(Infinity);

  const handleAppClick = (appId: string, title: string, icon: any) => {
    if (appId === 'launchpad') {
      toggleLaunchpad();
      return;
    }
    
    // Close Launchpad if open when clicking another dock item
    if (isLaunchpadOpen) {
      toggleLaunchpad(false);
    }

    const isOpen = windows.find((w) => w.id.startsWith(appId));
    if (isOpen) {
      if (isOpen.isMinimized) {
        focusWindow(isOpen.id);
      } else {
        // If already focused, minimize? (Mac behavior is focus, click again doesn't minimize usually)
        focusWindow(isOpen.id);
      }
    } else {
      openWindow(appId as any, title, icon);
    }
  };

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[9999]">
      <div 
        className="flex items-end gap-3 px-4 py-3 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-2xl h-[80px]"
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
      >
        {Object.values(apps).map((app) => (
          <DockItem 
            key={app.id} 
            app={app} 
            mouseX={mouseX} 
            onClick={() => handleAppClick(app.id, app.title, app.icon)}
            isOpen={windows.some(w => w.appId === app.id)}
          />
        ))}
      </div>
    </div>
  );
};

function DockItem({ app, mouseX, onClick, isOpen }: { app: AppConfig; mouseX: any; onClick: () => void; isOpen: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Use scale instead of width to prevent layout shifts
  const scaleSync = useTransform(distance, [-150, 0, 150], [1, 1.4, 1]);
  const scale = useSpring(scaleSync, { mass: 0.1, stiffness: 150, damping: 12 });
  
  // Move up slightly when scaling
  const ySync = useTransform(distance, [-150, 0, 150], [0, -10, 0]);
  const y = useSpring(ySync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.button
      ref={ref}
      style={{ scale, y }}
      onClick={onClick}
      className="relative w-14 h-14 rounded-2xl flex items-center justify-center group transition-colors"
    >
      <div className="w-full h-full p-0.5 drop-shadow-xl">
        {app.icon}
      </div>
      {isOpen && (
        <div className="absolute -bottom-2 w-1 h-1 bg-white/90 rounded-full shadow-[0_0_2px_rgba(255,255,255,0.8)]" />
      )}
      
      {/* Tooltip */}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-gray-200/80 text-black/80 text-sm font-medium px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap backdrop-blur-xl border border-white/40 shadow-xl">
        {app.title}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-6 border-transparent border-t-gray-200/80" />
      </div>
    </motion.button>
  );
}
