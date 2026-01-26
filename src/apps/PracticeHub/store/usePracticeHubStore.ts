import { create } from 'zustand';
import { CollectionItem, Tag, CollectionStatus } from '../types';

interface PracticeHubStore {
  // Data
  collections: CollectionItem[];
  tags: Tag[];
  selectedTags: string[];
  searchQuery: string;
  sortBy: 'recent' | 'practiced' | 'count' | 'waiting';

  // View State
  detailPanelOpen: boolean;
  selectedCollection: CollectionItem | null;
  addDialogOpen: boolean;

  // Actions
  setCollections: (collections: CollectionItem[]) => void;
  addCollection: (collection: CollectionItem) => void;
  updateCollection: (id: string, data: Partial<CollectionItem>) => void;
  deleteCollection: (id: string) => void;
  logPractice: (collectionId: string, note?: string) => void;
  
  setTags: (tags: Tag[]) => void;
  toggleTagFilter: (tagName: string) => void;

  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'recent' | 'practiced' | 'count' | 'waiting') => void;
  
  openDetailPanel: (collection: CollectionItem) => void;
  closeDetailPanel: () => void;
  
  openAddDialog: () => void;
  closeAddDialog: () => void;
}

export const usePracticeHubStore = create<PracticeHubStore>((set) => ({
  // Initial Data
  collections: [],
  tags: [],
  selectedTags: [],
  searchQuery: '',
  sortBy: 'recent',

  // Initial View State
  detailPanelOpen: false,
  selectedCollection: null,
  addDialogOpen: false,

  // Actions
  setCollections: (collections) => set({ collections }),
  addCollection: (collection) => set((state) => ({ 
    collections: [collection, ...state.collections] 
  })),
  updateCollection: (id, data) => set((state) => ({
    collections: state.collections.map((c) => 
      c.id === id ? { ...c, ...data } : c
    ),
    selectedCollection: state.selectedCollection?.id === id 
      ? { ...state.selectedCollection, ...data } 
      : state.selectedCollection
  })),
  deleteCollection: (id) => set((state) => ({
    collections: state.collections.filter((c) => c.id !== id),
    selectedCollection: state.selectedCollection?.id === id ? null : state.selectedCollection,
    detailPanelOpen: state.selectedCollection?.id === id ? false : state.detailPanelOpen
  })),
  logPractice: (collectionId, note) => set((state) => ({
    collections: state.collections.map((c) => 
      c.id === collectionId 
        ? { 
            ...c, 
            practice_count: c.practice_count + 1,
            last_practiced: new Date().toISOString()
          } 
        : c
    ),
    selectedCollection: state.selectedCollection?.id === collectionId
      ? {
          ...state.selectedCollection,
          practice_count: state.selectedCollection.practice_count + 1,
          last_practiced: new Date().toISOString()
        }
      : state.selectedCollection
  })),

  setTags: (tags) => set({ tags }),
  toggleTagFilter: (tagName) => set((state) => {
    const isSelected = state.selectedTags.includes(tagName);
    return {
      selectedTags: isSelected 
        ? state.selectedTags.filter(t => t !== tagName)
        : [...state.selectedTags, tagName]
    };
  }),

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSortBy: (sort) => set({ sortBy: sort }),

  openDetailPanel: (collection) => set({ 
    selectedCollection: collection, 
    detailPanelOpen: true 
  }),
  closeDetailPanel: () => set({ 
    detailPanelOpen: false, 
    selectedCollection: null 
  }),

  openAddDialog: () => set({ addDialogOpen: true }),
  closeAddDialog: () => set({ addDialogOpen: false }),
}));
