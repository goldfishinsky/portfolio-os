import { create } from 'zustand';
import { supabase } from './supabase';

export interface MoodImage {
  id: string;
  week_id: string;
  day_index: number;
  image_url: string;
  caption?: string;
  style_type: 'polaroid' | 'raw';
  decoration_type: 'tape' | 'clip' | 'pin';
  tags?: MoodTag[];
  created_at: string;
}

export interface MoodTag {
  id: string;
  tag: string;
  confidence?: number;
}

export interface MoodWeek {
  id: string;
  start_date: string;
  notes: string;
  images: MoodImage[];
}

interface MoodState {
  currentWeek: MoodWeek | null;
  isLoading: boolean;
  isGeneratingTags: boolean;
  error: string | null;

  fetchWeek: (startDate: string) => Promise<void>;
  addImage: (dayIndex: number, imageUrl: string, imagePath?: string) => Promise<void>;
  uploadImage: (file: File) => Promise<{ publicUrl: string; path: string }>;
  deleteImage: (imageId: string) => Promise<void>;
  updateNotes: (notes: string) => Promise<void>;
  generateTagsForImage: (imageId: string, imageUrl: string, imagePath?: string) => Promise<void>;
}

export const useMoodStore = create<MoodState>((set, get) => ({
  currentWeek: null,
  isLoading: false,
  isGeneratingTags: false,
  error: null,

  fetchWeek: async (startDate: string) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Get or Create Week
      let { data: week, error: weekError } = await supabase
        .from('mood_weeks')
        .select('*')
        .eq('start_date', startDate)
        .single();

      if (weekError && weekError.code === 'PGRST116') {
        // Not found, create it
        const { data: newWeek, error: createError } = await supabase
          .from('mood_weeks')
          .insert([{ start_date: startDate }])
          .select()
          .single();
        
        if (createError) throw createError;
        week = newWeek;
      } else if (weekError) {
        throw weekError;
      }

      // 2. Get Images and Tags
      const { data: images, error: imagesError } = await supabase
        .from('mood_images')
        .select(`
          *,
          tags:mood_tags(*)
        `)
        .eq('week_id', week.id);

      if (imagesError) throw imagesError;

      set({ currentWeek: { ...week, images: images || [] } });
    } catch (err: any) {
      console.error('Fetch Week Error:', err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
    }
  },

  addImage: async (dayIndex: number, imageUrl: string, imagePath?: string) => {
    const { currentWeek } = get();
    if (!currentWeek) return;

    try {
      const { data: newImage, error } = await supabase
        .from('mood_images')
        .insert([{
          week_id: currentWeek.id,
          day_index: dayIndex,
          image_url: imageUrl,
          style_type: 'polaroid',
          decoration_type: 'tape'
        }])
        .select()
        .single();

      if (error) throw error;

      // Update local state
      set(state => ({
        currentWeek: state.currentWeek ? {
          ...state.currentWeek,
          images: [...state.currentWeek.images, { ...newImage, tags: [] }]
        } : null
      }));

      // Trigger AI Tag Generation (Use Signed URL if path exists)
      get().generateTagsForImage(newImage.id, imageUrl, imagePath);

    } catch (err: any) {
      set({ error: err.message });
    }
  },

  updateNotes: async (notes: string) => {
    const { currentWeek } = get();
    if (!currentWeek) return;

    // Optimistic update
    set(state => ({
      currentWeek: state.currentWeek ? { ...state.currentWeek, notes } : null
    }));

    try {
      const { error } = await supabase
        .from('mood_weeks')
        .update({ notes })
        .eq('id', currentWeek.id);

      if (error) throw error;
    } catch (err: any) {
      set({ error: err.message });
      // Revert if needed? simplified for now
    }
  },

  generateTagsForImage: async (imageId: string, imageUrl: string, imagePath?: string) => {
    set({ isGeneratingTags: true });
    try {
      let targetUrl = imageUrl;

      // If we have a path (new upload), generate a temporary signed URL for the AI
      // This allows the AI to read private buckets
      if (imagePath) {
        const { data, error } = await supabase.storage
          .from('mood-board-assets')
          .createSignedUrl(imagePath, 60 * 5); // 5 minutes
        
        if (data?.signedUrl) {
          targetUrl = data.signedUrl;
        }
      }

      const response = await fetch('/api/ai/generate-tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: targetUrl }),
      });

      if (!response.ok) throw new Error('AI Generation Failed');

      const { tags } = await response.json();

      // Save tags to Supabase
      const { error: tagError } = await supabase
        .from('mood_tags')
        .insert(tags.map((tag: string) => ({
          image_id: imageId,
          tag,
          confidence: 1.0
        })));

      if (tagError) throw tagError;

      // Update local state
      set(state => {
        if (!state.currentWeek) return state;
        return {
          currentWeek: {
            ...state.currentWeek,
            images: state.currentWeek.images.map(img => 
              img.id === imageId 
                ? { ...img, tags: tags.map((t: string) => ({ id: 'temp-' + t, tag: t })) }
                : img
            )
          }
        };
      });

    } catch (err: any) {
      console.error('Tag Generation Error:', err);
    } finally {
      set({ isGeneratingTags: false });
    }
  },

  uploadImage: async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('mood-board-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('mood-board-assets')
        .getPublicUrl(filePath);

      return { publicUrl: data.publicUrl, path: filePath };
    } catch (error: any) {
      console.error('Upload Error:', error);
      throw error;
    }
  },

  deleteImage: async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('mood_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      set(state => ({
        currentWeek: state.currentWeek ? {
          ...state.currentWeek,
          images: state.currentWeek.images.filter(img => img.id !== imageId)
        } : null
      }));
    } catch (err: any) {
      console.error('Delete Error:', err);
      set({ error: err.message });
    }
  }
}));
