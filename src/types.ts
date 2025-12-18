import type { ReactNode } from 'react';

export type AppId = 'notepad' | 'calculator' | 'explorer' | 'terminal' | 'vscode' | 'browser' | 'settings' | 'resume' | 'blog' | 'finder' | 'launchpad' | 'safari' | 'mail' | 'notes' | 'trash' | 'projects' | 'video-player' | 'time-quadrant' | 'feed' | 'guitar' | 'driving-test' | 'fluent-card' | 'music-player';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  icon?: ReactNode;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  props?: any; // Data passed to the app
}

export interface FileSystemItem {
  name: string;
  type: 'file' | 'folder';
  content?: string; // For files
  children?: { [key: string]: FileSystemItem }; // For folders
  icon?: string;
  metadata?: any; // Extra data like video ID
}

export interface AppConfig {
  id: AppId;
  title: string;
  icon: ReactNode;
  component: React.ComponentType<any>;
  width?: number;
  height?: number;
}
