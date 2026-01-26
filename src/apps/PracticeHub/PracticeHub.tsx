import React, { useEffect } from 'react';
import { usePracticeHubStore } from './store/usePracticeHubStore';
import CollectionGrid from './components/CollectionGrid';
import AddCollectionDialog from './components/AddCollectionDialog';
import DetailPanel from './components/DetailPanel';

// Mock Data Seeding (Temporary)
const seedData = () => {
    const { setCollections, collections } = usePracticeHubStore.getState();
    if (collections.length > 0) return;
    
    setCollections([
        {
            id: '1',
            user_id: '1',
            title: 'Morning Yoga Stretches for Beginners',
            url: 'https://youtube.com',
            platform: 'youtube',
            tags: ['Yoga', 'Morning', '15min'],
            practice_count: 12,
            status: 'active',
            created_at: new Date().toISOString(),
            last_practiced: new Date(Date.now() - 86400000 * 2).toISOString(),
            thumbnail: 'https://images.unsplash.com/photo-1544367563-12123d8966bf?auto=format&fit=crop&q=80&w=600'
        },
        {
            id: '2',
            user_id: '1',
            title: 'Guitar Fingerstyle Techniques',
            url: 'https://bilibili.com',
            platform: 'bilibili',
            tags: ['Music', 'Guitar', 'Technique'],
            practice_count: 5,
            status: 'active',
            created_at: new Date().toISOString(),
            last_practiced: new Date(Date.now() - 86400000 * 5).toISOString(),
            thumbnail: 'https://images.unsplash.com/photo-1510915361408-059d5749d9ee?auto=format&fit=crop&q=80&w=600'
        }
    ]);
};


const PracticeHub = () => {
  const { 
    searchQuery, 
    setSearchQuery,
    openAddDialog,
    collections
  } = usePracticeHubStore();

  useEffect(() => {
    seedData();
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-slate-100 overflow-hidden font-sans">
      {/* Header */}
      <div className="h-16 bg-white/80 backdrop-blur-md border-b border-white/20 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
        <h1 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
          <span className="text-2xl">🎯</span> Practice Hub
        </h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-slate-100 border-none focus:ring-2 focus:ring-blue-400 outline-none w-64 text-sm transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
          </div>
          
          <button 
            onClick={openAddDialog}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-blue-500/30 transition-all active:scale-95 flex items-center gap-2"
          >
            <span>+</span> Add Content
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Smart Recommendations Section - Placeholder */}
          <section className="bg-white/50 rounded-2xl p-6 shadow-sm border border-white/60">
            <h2 className="text-lg font-medium text-slate-700 mb-4 flex items-center gap-2">
              💡 Today's Focus
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="h-32 bg-white/60 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200 border-dashed">
                 No recommendations yet
               </div>
            </div>
          </section>

          {/* Tag Filter Bar - Placeholder */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
             {['Yoga', 'Fitness', 'Music', 'Coding'].map(tag => (
               <button key={tag} className="px-4 py-1.5 rounded-full bg-white text-slate-600 text-sm font-medium shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors whitespace-nowrap">
                 {tag}
               </button>
             ))}
          </div>

          {/* Collection Grid */}
          <CollectionGrid items={collections.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))} />
        </div>
      </div>

      {/* Dialogs and Panels */}
      <AddCollectionDialog />
      <DetailPanel />
    </div>
  );
};

export default PracticeHub;
