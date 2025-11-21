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
  const { closeWindow, minimizeWindow, maximizeWindow, focusWindow, moveWindow, resizeWindow } = useOSStore();
  const nodeRef = useRef(null);
  const resizeRef = useRef(null);
  
  // Use local state for immediate drag feedback
  const [position, setPosition] = React.useState(window.position || { x: 0, y: 0 });

  // Sync local state when window.position changes externally (e.g. initial load or restore)
  React.useEffect(() => {
    if (!window.isMaximized && window.position) {
      setPosition(window.position);
    }
  }, [window.position, window.isMaximized]);

  if (window.isMinimized) return null;

  const handleResize = (e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = window.size?.width || 800;
    const startHeight = window.size?.height || 600;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(300, startWidth + (e.clientX - startX));
      const newHeight = Math.max(200, startHeight + (e.clientY - startY));
      resizeWindow(window.id, { width: newWidth, height: newHeight });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const currentPosition = window.isMaximized ? { x: 0, y: 0 } : position;

  return (
    <Draggable
      handle=".window-title-bar"
      nodeRef={nodeRef}
      onMouseDown={() => focusWindow(window.id)}
      onDrag={(_e, data) => setPosition({ x: data.x, y: data.y })}
      onStop={(_e, data) => moveWindow(window.id, { x: data.x, y: data.y })}
      disabled={window.isMaximized}
      position={currentPosition}
    >
      <div
        ref={nodeRef}
        className={`absolute flex flex-col ${window.isMaximized ? 'top-0 left-0 w-full h-full' : ''}`}
        style={{ zIndex: window.zIndex }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
            width: window.isMaximized ? '100%' : window.size?.width || 800,
            height: window.isMaximized ? '100%' : window.size?.height || 600,
          }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`flex flex-col w-full h-full bg-window-bg backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 overflow-hidden ${
            window.isMaximized ? 'rounded-none' : ''
          }`}
        >
          {/* Title Bar */}
          <div 
            className="window-title-bar h-9 bg-gray-200/90 backdrop-blur-md border-b border-gray-300/50 flex items-center px-3 select-none cursor-default relative rounded-t-xl"
            onDoubleClick={() => maximizeWindow(window.id)}
          >
            {/* Traffic Lights */}
            <div className="flex items-center gap-2 z-10 group">
              <button
                onClick={(e) => { e.stopPropagation(); closeWindow(window.id); }}
                className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center hover:brightness-90 active:brightness-75 transition-all"
              >
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100 text-black/60">
                  <path d="M1 1L5 5M5 1L1 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); minimizeWindow(window.id); }}
                className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center hover:brightness-90 active:brightness-75 transition-all"
              >
                <svg width="6" height="2" viewBox="0 0 6 2" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100 text-black/60">
                  <path d="M1 1H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); maximizeWindow(window.id); }}
                className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center hover:brightness-90 active:brightness-75 transition-all"
              >
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-0 group-hover:opacity-100 text-black/60">
                  <path d="M1 5V1H5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  <path d="M1 5L5 1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Title */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-bold text-sm text-gray-700/90 tracking-wide drop-shadow-sm">{window.title}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto relative bg-white/80">
            {children}
          </div>

          {/* Resize Handle */}
          {!window.isMaximized && (
            <div
              ref={resizeRef}
              onMouseDown={handleResize}
              className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end p-1"
            >
               {/* Visual indicator for resize handle */}
               <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
                 <path d="M8 0V8H0L8 0Z" fill="#999"/>
               </svg>
            </div>
          )}
        </motion.div>
      </div>
    </Draggable>
  );
};
