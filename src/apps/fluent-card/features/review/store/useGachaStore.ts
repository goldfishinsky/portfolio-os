import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CollectedWord {
  id: string;
  word: string;
  context: string;
  timestamp: number;
  mastery: number; // 0-100
}

interface GachaState {
  energy: number;
  collection: CollectedWord[];
  pendingWords: CollectedWord[]; // Words captured but not yet reviewed
  
  // Actions
  addPendingWord: (word: string, context: string) => void;
  pullGacha: () => CollectedWord[] | null; // Returns rewards or null if no energy
  addEnergy: (amount: number) => void;
}

export const useGachaStore = create<GachaState>()(
  persist(
    (set, get) => ({
      energy: 100,
      collection: [],
      pendingWords: [],

      addPendingWord: (word, context) => {
        const newWord: CollectedWord = {
          id: Math.random().toString(36).substr(2, 9),
          word,
          context,
          timestamp: Date.now(),
          mastery: 0
        };
        set((state) => ({ pendingWords: [...state.pendingWords, newWord] }));
      },

      pullGacha: () => {
        const { energy, pendingWords, collection } = get();
        if (energy < 10) return null;
        if (pendingWords.length === 0) return []; // Or return random words from collection for review

        // Pull 3 words from pending
        const pulled = pendingWords.slice(0, 3);
        const remaining = pendingWords.slice(3);

        set({
          energy: energy - 10,
          pendingWords: remaining,
          collection: [...collection, ...pulled]
        });

        return pulled;
      },

      addEnergy: (amount) => set((state) => ({ energy: Math.min(100, state.energy + amount) }))
    }),
    {
      name: 'fluent-gacha-storage'
    }
  )
);
