import { create } from 'zustand';

interface Song {
  title: string;
  artist: string;
  url: string;
  cover: string;
}

const PLAYLIST: Song[] = [
  {
    title: '小屋',
    artist: '赵雷',
    url: 'https://owhqrvhsxmpmrecxavug.supabase.co/storage/v1/object/sign/like/little%20room_zhaolei.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZGRmNGI3Yi0zZDg2LTQ0NGEtYTliNC01NGNkNzc5OGRkMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsaWtlL2xpdHRsZSByb29tX3poYW9sZWkubXAzIiwiaWF0IjoxNzY2MDkzNDAxLCJleHAiOjE3OTc2Mjk0MDF9.9Jj5kY_I4Kki5pZ5X1zLuzfdjrwCJQyrt-e_jJwowmU',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: '咬春',
    artist: '赵雷',
    url: 'https://owhqrvhsxmpmrecxavug.supabase.co/storage/v1/object/sign/like/bite%20spring.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZGRmNGI3Yi0zZDg2LTQ0NGEtYTliNC01NGNkNzc5OGRkMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsaWtlL2JpdGUgc3ByaW5nLm1wMyIsImlhdCI6MTc2NjA5NzQ5OSwiZXhwIjoxNzk3NjMzNDk5fQ.mIz20gIT4ofbFSAchsrBKJsQvNeVEH9DOeCx48CFfyk',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60'
  },
  {
    title: '难受',
    artist: '赵雷',
    url: 'https://owhqrvhsxmpmrecxavug.supabase.co/storage/v1/object/sign/like/tough.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9mZGRmNGI3Yi0zZDg2LTQ0NGEtYTliNC01NGNkNzc5OGRkMzUiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsaWtlL3RvdWdoLm1wMyIsImlhdCI6MTc2NjA5NzUyOSwiZXhwIjoxNzk3NjMzNTI5fQ.TvF05Kf8il0Dge7yyhwyvEQ08PBGLJEM6qIKBNjghd0',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=60'
  }
];

interface MusicState {
  isPlaying: boolean;
  currentSongIndex: number;
  progress: number;
  duration: number;
  volume: number;
  isLoop: boolean;
  playlist: Song[];
  
  // Actions
  togglePlay: (isPlaying?: boolean) => void;
  setVolume: (volume: number) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setIsLoop: (isLoop: boolean) => void;
  playNext: () => void;
  playPrev: () => void;
  setCurrentSongIndex: (index: number) => void;
}

export const useMusicStore = create<MusicState>((set, get) => ({
  isPlaying: false,
  currentSongIndex: 0,
  progress: 0,
  duration: 0,
  volume: 0.7,
  isLoop: true,
  playlist: PLAYLIST,

  togglePlay: (isPlaying) => {
    set((state) => ({
      isPlaying: isPlaying !== undefined ? isPlaying : !state.isPlaying,
    }));
  },

  setVolume: (volume) => set({ volume }),

  setProgress: (progress) => set({ progress }),
  
  setDuration: (duration) => set({ duration }),

  setIsLoop: (isLoop) => set({ isLoop }),

  playNext: () => {
    const { currentSongIndex, playlist } = get();
    let nextIndex = currentSongIndex + 1;
    if (nextIndex >= playlist.length) {
      nextIndex = 0; // Loop back to start
    }
    set({ currentSongIndex: nextIndex, isPlaying: true });
  },

  playPrev: () => {
    const { currentSongIndex, playlist } = get();
    let prevIndex = currentSongIndex - 1;
    if (prevIndex < 0) {
      prevIndex = playlist.length - 1;
    }
    set({ currentSongIndex: prevIndex, isPlaying: true });
  },

  setCurrentSongIndex: (index) => {
    const { playlist } = get();
    if (index >= 0 && index < playlist.length) {
       set({ currentSongIndex: index, isPlaying: true });
    }
  },
}));
