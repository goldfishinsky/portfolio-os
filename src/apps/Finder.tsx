import React, { useState } from 'react';
import { 
  Folder, 
  FileText, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  LayoutGrid, 
  List as ListIcon,
  Clock,
  Cloud,
  Monitor,
  Download,
  Image as ImageIcon,
  HardDrive
} from 'lucide-react';
import { fileSystem } from '../utils/fileSystem';
import type { FileSystemItem } from '../types';
import { useOSStore } from '../store/osStore';
import videoFileIcon from '../assets/icons/video-file.png';

const SidebarItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active?: boolean; 
  onClick: () => void;
  color?: string;
}> = ({ icon, label, active, onClick, color = "text-gray-500" }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-1.5 rounded-md cursor-pointer text-sm font-medium transition-colors ${
      active ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
    }`}
  >
    <span className={color}>{icon}</span>
    <span>{label}</span>
  </div>
);

export const Finder: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string[]>(['Desktop']);
  const [history, setHistory] = useState<string[][]>([['Desktop']]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const { openWindow } = useOSStore();

  const getCurrentFolder = (): FileSystemItem => {
    let current = fileSystem;
    // Root check
    if (currentPath.length === 0) return current;

    for (const segment of currentPath) {
      if (current.children && current.children[segment]) {
        current = current.children[segment];
      } else {
        return current; // Fallback
      }
    }
    return current;
  };

  const currentFolder = getCurrentFolder();

  const navigateTo = (path: string[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
    setSelectedItem(null);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(history[historyIndex - 1]);
      setSelectedItem(null);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(history[historyIndex + 1]);
      setSelectedItem(null);
    }
  };

  const handleItemClick = (name: string) => {
    setSelectedItem(name);
  };

  const handleItemDoubleClick = (item: FileSystemItem) => {
    if (item.type === 'folder') {
      navigateTo([...currentPath, item.name]);
    } else {
      // Open file logic
      if (item.metadata?.appId) {
        openWindow(item.metadata.appId, item.name, undefined, item.metadata);
      } else if (item.name === 'Resume.pdf') {
        openWindow('resume', 'Resume');
      } else {
        // Default open logic or preview
        console.log('Open file:', item.name);
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-white dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-100 transition-colors duration-300">
      {/* Toolbar */}
      <div className="h-12 bg-[#f6f6f6] dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 flex items-center px-4 justify-between shrink-0 window-drag-handle transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
            <button 
              onClick={handleBack} 
              disabled={historyIndex === 0}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleForward} 
              disabled={historyIndex === history.length - 1}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          <span className="font-semibold text-gray-700 dark:text-gray-200 ml-2">{currentFolder.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-200 dark:bg-gray-700 rounded-md p-0.5 transition-colors">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-600 shadow-sm' : 'hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'}`}
            >
              <ListIcon size={16} />
            </button>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-2 top-1.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search" 
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md pl-8 pr-2 py-1 text-sm w-40 focus:ring-2 focus:ring-blue-400 outline-none transition-colors dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-[#f6f6f6]/80 dark:bg-gray-800/80 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 flex flex-col py-4 px-2 gap-1 shrink-0 text-sm transition-colors duration-300">
          <div className="px-3 text-xs font-semibold text-gray-400 mb-1 mt-2">Favorites</div>
          <SidebarItem icon={<Cloud size={18} />} label="AirDrop" onClick={() => {}} color="text-blue-500" />
          <SidebarItem icon={<Clock size={18} />} label="Recents" onClick={() => {}} color="text-blue-500" />
          <SidebarItem icon={<HardDrive size={18} />} label="Applications" onClick={() => {}} color="text-blue-500" />
          
          <div className="px-3 text-xs font-semibold text-gray-400 mb-1 mt-4">Locations</div>
          <SidebarItem 
            icon={<Monitor size={18} />} 
            label="Desktop" 
            active={currentPath[0] === 'Desktop' && currentPath.length === 1}
            onClick={() => navigateTo(['Desktop'])} 
            color="text-blue-500"
          />
          <SidebarItem 
            icon={<FileText size={18} />} 
            label="Documents" 
            active={currentPath[0] === 'Documents'}
            onClick={() => navigateTo(['Documents'])} 
            color="text-blue-500"
          />
          <SidebarItem 
            icon={<Download size={18} />} 
            label="Downloads" 
            active={currentPath[0] === 'Downloads'}
            onClick={() => navigateTo(['Downloads'])} 
            color="text-blue-500"
          />
          <SidebarItem 
            icon={<ImageIcon size={18} />} 
            label="Pictures" 
            active={currentPath[0] === 'Pictures'}
            onClick={() => navigateTo(['Pictures'])} 
            color="text-blue-500"
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white dark:bg-gray-900 overflow-y-auto p-4 transition-colors duration-300" onClick={() => setSelectedItem(null)}>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-4">
              {currentFolder.children && Object.values(currentFolder.children).map((item) => (
                <div 
                  key={item.name}
                  onClick={(e) => { e.stopPropagation(); handleItemClick(item.name); }}
                  onDoubleClick={(e) => { e.stopPropagation(); handleItemDoubleClick(item); }}
                  className={`flex flex-col items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                    selectedItem === item.name ? 'bg-blue-100 dark:bg-blue-900/50 ring-1 ring-blue-300 dark:ring-blue-700' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="w-16 h-16 flex items-center justify-center text-blue-500">
                    {item.type === 'folder' ? (
                      <Folder size={60} fill="currentColor" className="text-blue-400" />
                    ) : item.icon === 'video' ? (
                      <img src={videoFileIcon.src} alt="Video" className="w-12 h-12 object-cover rounded-lg drop-shadow-sm" />
                    ) : (
                      <FileText size={50} className="text-gray-400" />
                    )}
                  </div>
                  <span className={`text-sm text-center truncate w-full px-1 rounded ${selectedItem === item.name ? 'bg-blue-500 text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="grid grid-cols-[1fr_100px_150px] px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                <span>Name</span>
                <span>Kind</span>
                <span>Date Modified</span>
              </div>
              {currentFolder.children && Object.values(currentFolder.children).map((item) => (
                <div 
                  key={item.name}
                  onClick={(e) => { e.stopPropagation(); handleItemClick(item.name); }}
                  onDoubleClick={(e) => { e.stopPropagation(); handleItemDoubleClick(item); }}
                  className={`grid grid-cols-[1fr_100px_150px] px-4 py-2 text-sm cursor-pointer items-center transition-colors ${
                    selectedItem === item.name ? 'bg-blue-500 text-white' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  } even:bg-gray-50/50 dark:even:bg-gray-800/30`}
                >
                  <div className="flex items-center gap-2">
                    {item.type === 'folder' ? (
                      <Folder size={16} className={selectedItem === item.name ? 'text-white' : 'text-blue-400'} fill="currentColor" />
                    ) : (
                      <FileText size={16} className={selectedItem === item.name ? 'text-white' : 'text-gray-400'} />
                    )}
                    <span>{item.name}</span>
                  </div>
                  <span>{item.type === 'folder' ? 'Folder' : 'Document'}</span>
                  <span>Today at 12:00 PM</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Status Bar */}
      <div className="h-6 bg-[#f6f6f6] dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center px-4 text-xs text-gray-500 dark:text-gray-400 shrink-0 transition-colors duration-300">
        {currentFolder.children ? Object.keys(currentFolder.children).length : 0} items
      </div>
    </div>
  );
};
