import type { FileSystemItem } from '../types';
import { userConfig } from '../config/userConfig';

export const fileSystem: FileSystemItem = {
  name: 'root',
  type: 'folder',
  children: {
    'Desktop': {
      name: 'Desktop',
      type: 'folder',
      children: {
        [userConfig.system.resumeFilename]: { name: userConfig.system.resumeFilename, type: 'file', content: 'Resume Content', icon: 'file-text' },
        'Vlogs': {
          name: 'Vlogs',
          type: 'folder',
          children: {
            'Tokyo Trip.mp4': { 
              name: 'Tokyo Trip.mp4', 
              type: 'file', 
              icon: 'video',
              metadata: { appId: 'video-player', bvid: 'BV1xq63YUEqY' }
            },
            'Coding Setup.mp4': { 
              name: 'Coding Setup.mp4', 
              type: 'file', 
              icon: 'video',
              metadata: { appId: 'video-player', bvid: 'BV1Ec41187GM' }
            },
            'Day in Life.mp4': { 
              name: 'Day in Life.mp4', 
              type: 'file', 
              icon: 'video',
              metadata: { appId: 'video-player', bvid: 'BV1C4HjzsEHs' }
            },
          }
        },
        'Project-Alpha': { name: 'Project-Alpha', type: 'folder', children: {} },
        '小屋.mp3': { 
          name: '小屋.mp3', 
          type: 'file', 
          icon: 'music',
          metadata: { 
            appId: 'music-player', 
            url: 'https://owhqrvhsxmpmrecxavug.supabase.co/storage/v1/object/sign/like/little%20room_zhaolei.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZGRmNGI3Yi0zZDg2LTQ0NGEtYTliNC01NGNkNzc5OGRkMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsaWtlL2xpdHRsZSByb29tX3poYW9sZWkubXAzIiwiaWF0IjoxNzY2MDkzNDAxLCJleHAiOjE3OTc2Mjk0MDF9.9Jj5kY_I4Kki5pZ5X1zLuzfdjrwCJQyrt-e_jJwowmU',
            title: '小屋',
            artist: '赵雷'
          } 
        },
      }
    },
    'Documents': {
      name: 'Documents',
      type: 'folder',
      children: {
        'Work': {
          name: 'Work',
          type: 'folder',
          children: {
            'Q4-Report.docx': { name: 'Q4-Report.docx', type: 'file', content: 'Report Content' },
            'Meeting-Notes.txt': { name: 'Meeting-Notes.txt', type: 'file', content: 'Meeting Notes' },
          }
        },
        'Personal': {
          name: 'Personal',
          type: 'folder',
          children: {
            'Budget.xlsx': { name: 'Budget.xlsx', type: 'file', content: 'Budget Content' },
          }
        }
      }
    },
    'Downloads': {
      name: 'Downloads',
      type: 'folder',
      children: {
        'installer.dmg': { name: 'installer.dmg', type: 'file', content: 'Binary' },
        'image.png': { name: 'image.png', type: 'file', content: 'Image' },
      }
    },
    'Pictures': {
      name: 'Pictures',
      type: 'folder',
      children: {
        'Vacation': { name: 'Vacation', type: 'folder', children: {} },
        'Screenshot.png': { name: 'Screenshot.png', type: 'file', content: 'Image' },
      }
    },
    'Music': {
      name: 'Music',
      type: 'folder',
      children: {}
    },
    'Movies': {
      name: 'Movies',
      type: 'folder',
      children: {}
    }
  }
};
