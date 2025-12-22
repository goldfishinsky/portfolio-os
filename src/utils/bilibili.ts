import { fileSystem } from './fileSystem';
import type { FileSystemItem } from '../types';

interface BilibiliArchive {
  bvid: string;
  title: string;
  cover: string;
  // Add other fields if needed
}

export const fetchBilibiliVlogs = async () => {
  try {
    const response = await fetch('/api/bilibili?mid=11321390&season_id=2860765&page_num=1&page_size=30');
    const data = await response.json();

    if (data.code === 0 && data.data && data.data.archives) {
      const archives: BilibiliArchive[] = data.data.archives;

      // Clear existing hardcoded vlogs (optional, or just overwrite)
      const vlogsFolder = fileSystem.children?.['Desktop']?.children?.['Vlogs'];
        
      if (vlogsFolder && vlogsFolder.children) {
         // Clear existing children to avoid duplicates/stale data if we want a fresh list
         vlogsFolder.children = {};

        archives.forEach((archive) => {
           // Clean title for filename
           const safeTitle = archive.title.replace(/[\/\\?%*:|"<>]/g, '-');
           const fileName = `${safeTitle}.mp4`; // Virtual extension

           vlogsFolder.children![fileName] = {
             name: fileName,
             type: 'file',
             icon: 'video',
             metadata: {
               appId: 'video-player',
               bvid: archive.bvid,
               title: archive.title,
               cover: archive.cover,
             }
           };
        });
        
        console.log('Vlogs updated from Bilibili API', Object.keys(vlogsFolder.children).length);
        return true; // Indicate success
      }
    } else {
        console.error('Invalid Bilibili data format', data);
    }
  } catch (error) {
    console.error('Failed to fetch Bilibili vlogs:', error);
  }
  return false;
};
