import { create } from 'zustand';

export interface StoryCard {
  id: string;
  type: 'story' | 'choice';
  image?: string;
  text?: string;
  choices?: { id: string; text: string; nextCardId: string }[];
  nextCardId?: string;
}

export interface Chapter {
  id: string;
  title: string;
  cards: Record<string, StoryCard>;
  startCardId: string;
}

interface StoryState {
  currentChapterId: string;
  currentCardId: string;
  history: string[]; // Card IDs visited
  
  // Actions
  setChapter: (chapter: Chapter) => void;
  nextCard: (choiceId?: string) => void;
}

// Mock Data
export const CHAPTER_1: Chapter = {
  id: 'ch1',
  title: 'The Encounter',
  startCardId: 'c1',
  cards: {
    'c1': {
      id: 'c1',
      type: 'story',
      image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2003&auto=format&fit=crop',
      text: "You walk into the climbing gym. The air smells of chalk and sweat. It's crowded tonight.",
      nextCardId: 'c2'
    },
    'c2': {
      id: 'c2',
      type: 'choice',
      image: 'https://images.unsplash.com/photo-1516592673884-4a382d1124c2?q=80&w=2070&auto=format&fit=crop',
      text: "You see a girl struggling on a V4 problem. She looks familiar.",
      choices: [
        { id: 'a', text: "Say 'Hi'", nextCardId: 'c3a' },
        { id: 'b', text: "Watch silently", nextCardId: 'c3b' }
      ]
    },
    'c3a': {
      id: 'c3a',
      type: 'story',
      image: 'https://images.unsplash.com/photo-1601924582970-9238bcb495d9?q=80&w=1974&auto=format&fit=crop',
      text: "'Hey,' you say. She turns around, surprised. 'Do I know you?'",
      nextCardId: 'end'
    },
    'c3b': {
      id: 'c3b',
      type: 'story',
      image: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?q=80&w=2144&auto=format&fit=crop',
      text: "You decide not to disturb her. She falls, looks at you, and shrugs.",
      nextCardId: 'end'
    }
  }
};

export const useStoryStore = create<StoryState>((set, get) => ({
  currentChapterId: 'ch1',
  currentCardId: 'c1',
  history: [],

  setChapter: (chapter) => set({ currentChapterId: chapter.id, currentCardId: chapter.startCardId, history: [] }),
  
  nextCard: (choiceId) => {
    const state = get();
    // In a real app, we'd look up the current chapter from a separate store or map
    const chapter = CHAPTER_1; 
    const currentCard = chapter.cards[state.currentCardId];

    if (currentCard.type === 'choice' && choiceId) {
      const choice = currentCard.choices?.find(c => c.id === choiceId);
      if (choice) {
        set({ currentCardId: choice.nextCardId, history: [...state.history, state.currentCardId] });
      }
    } else if (currentCard.nextCardId) {
      set({ currentCardId: currentCard.nextCardId, history: [...state.history, state.currentCardId] });
    }
  }
}));
