import React, { useEffect, useRef } from 'react';
import { RefreshCw, Image, FolderPlus, Info, Monitor } from 'lucide-react';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onAction: (action: string) => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onAction }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuItems = [
    { id: 'refresh', label: 'Refresh', icon: <RefreshCw size={14} /> },
    { id: 'wallpaper', label: 'Change Wallpaper', icon: <Image size={14} /> },
    { type: 'separator' },
    { id: 'new_folder', label: 'New Folder', icon: <FolderPlus size={14} /> },
    { id: 'display', label: 'Display Settings', icon: <Monitor size={14} /> },
    { type: 'separator' },
    { id: 'info', label: 'Get Info', icon: <Info size={14} /> },
  ];

  return (
    <div 
      ref={ref}
      className="absolute z-[99999] w-56 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700 rounded-lg shadow-xl py-1.5 animate-in fade-in zoom-in-95 duration-100 transition-colors duration-300"
      style={{ top: y, left: x }}
    >
      {menuItems.map((item, index) => {
        if (item.type === 'separator') {
          return <div key={index} className="h-px bg-gray-200 dark:bg-gray-600 my-1 mx-2 transition-colors" />;
        }
        return (
          <button
            key={item.id}
            onClick={() => { onAction(item.id!); onClose(); }}
            className="w-full px-3 py-1.5 flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-500 hover:text-white dark:hover:text-white transition-colors text-left"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};
