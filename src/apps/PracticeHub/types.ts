export type Platform = 'bilibili' | 'youtube' | 'xiaohongshu' | 'douyin' | 'other';

export type CollectionStatus = 'active' | 'mastered' | 'archived';

export interface CollectionItem {
  id: string;
  user_id: string;
  title: string;
  url: string;
  thumbnail?: string;
  platform: Platform;
  tags: string[];
  practice_count: number;
  status: CollectionStatus;
  created_at: string;
  last_practiced: string | null;
  notes?: string;
}

export interface PracticeLog {
  id: string;
  collection_id: string;
  practiced_at: string;
  note?: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  type: 'preset' | 'custom';
}

export const PRESET_TAGS = {
  type: ['Yoga', 'Fitness', 'Dance', 'Cooking', 'Music', 'Language', 'Craft', 'Painting'],
  duration: ['5min', '10min', '15min', '30min', '1h'],
  difficulty: ['Beginner', 'Easy', 'Medium', 'Hard'],
  time: ['Morning', 'Lunch', 'Evening', 'Anytime']
};

export const TAG_COLORS: Record<string, string> = {
  type: '#6C93E8',      // Blue
  duration: '#7BC96F',  // Green
  difficulty: '#F5A962', // Orange
  time: '#A78BFA',      // Purple
  custom: '#F093B0'     // Pink
};
