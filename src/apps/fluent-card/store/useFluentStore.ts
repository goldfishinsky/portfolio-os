import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserLevel = 'beginner' | 'intermediate' | 'advanced';

export interface FluentState {
  hasOnboarded: boolean;
  interests: string[];
  level: UserLevel;
  
  // Actions
  completeOnboarding: (interests: string[], level: UserLevel) => void;
  resetProgress: () => void;
}

export const useFluentStore = create<FluentState>()(
  persist(
    (set) => ({
      hasOnboarded: false,
      interests: [],
      level: 'beginner',

      completeOnboarding: (interests, level) => set({ hasOnboarded: true, interests, level }),
      resetProgress: () => set({ hasOnboarded: false, interests: [], level: 'beginner' }),
    }),
    {
      name: 'fluent-card-storage',
    }
  )
);
