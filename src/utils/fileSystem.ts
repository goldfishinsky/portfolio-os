import type { FileSystemItem } from '../types';

export const fileSystem: FileSystemItem = {
  name: 'root',
  type: 'folder',
  children: {
    'Desktop': {
      name: 'Desktop',
      type: 'folder',
      children: {
        'Resume.pdf': { name: 'Resume.pdf', type: 'file', content: 'Resume Content', icon: 'file-text' },
        'Portfolio': { name: 'Portfolio', type: 'folder', children: {} },
      }
    },
    'Documents': {
      name: 'Documents',
      type: 'folder',
      children: {
        'Blog': {
          name: 'Blog',
          type: 'folder',
          children: {
            'hello-world.md': { name: 'hello-world.md', type: 'file', content: '# Hello World\nWelcome to my blog!' },
            'react-os.md': { name: 'react-os.md', type: 'file', content: '# Building a Web OS\nIt was fun.' }
          }
        }
      }
    }
  }
};
