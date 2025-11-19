import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { useOSStore } from '../store/osStore';
import type { WindowState } from '../types';
import { motion } from 'framer-motion';

interface WindowFrameProps {
  window: WindowState;
  children: React.ReactNode;
}

export const WindowFrame: React.FC<WindowFrameProps> = ({ window, children }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useOSStore();
  const nodeRef = useRef(null);

  if (window.isMinimized) return null;

  return (
    <Draggable
      handle=".window-title-bar"
      bounds="parent"
      nodeRef={nodeRef}
      onMouseDown={() => focusWindow(window.id)}
      disabled={window.isMaximized}
      position={window.isMaximized ? { x: 0, y: 0 } : undefined}
    >
      <motion.div
        ref={nodeRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          width: window.isMaximized ? '100%' : window.size?.width || 800,
          height: window.isMaximized ? '100%' : window.size?.height || 600,
          top: window.isMaximized ? 0 : undefined,
          left: window.isMaximized ? 0 : undefined,
        }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`absolute flex flex-col bg-window-bg backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden ${
          window.isMaximized ? 'rounded-none !w-full !h-full top-0 left-0' : ''
        }`}
        style={{ zIndex: window.zIndex }}
      >
        {/* Title Bar */}
        <div className="window-title-bar h-10 bg-gray-100/50 border-b border-gray-200/50 flex items-center px-4 select-none cursor-default relative">
          {/* Traffic Lights */}
          <div className="flex items-center gap-2 z-10 group">
            <button
              onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
              className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center hover:brightness-90 active:brightness-75 transition-all"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/50">x</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
              className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center hover:brightness-90 active:brightness-75 transition-all"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/50">-</span>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); maximizeWindow(window.id); }}
              className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center hover:brightness-90 active:brightness-75 transition-all"
            >
              <span className="opacity-0 group-hover:opacity-100 text-[6px] font-bold text-black/50">↗</span>
            </button>
          </div>

          {/* Title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="font-semibold text-sm text-gray-600 opacity-80">{window.title}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto relative bg-white/80">
          {children}
        </div>
      </motion.div>
    </Draggable>
  );
};
