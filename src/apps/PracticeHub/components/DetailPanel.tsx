import React from 'react';
import { usePracticeHubStore } from '../store/usePracticeHubStore';

const DetailPanel = () => {
  const { 
    selectedCollection, 
    detailPanelOpen, 
    closeDetailPanel,
    logPractice 
  } = usePracticeHubStore();

  if (!selectedCollection) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          detailPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeDetailPanel}
      />

      {/* Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-full md:w-[600px] bg-slate-50 shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col ${
          detailPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white hover:bg-white/50 transition-colors shrink-0">
          <button 
            onClick={closeDetailPanel}
            className="p-2 -ml-2 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
          >
            ← Back
          </button>
          
          <div className="flex gap-2">
            <button className="px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-200 transition-colors">Edit</button>
            <button className="px-3 py-1.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors">Delete</button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
           {/* Thumbnail */}
           <div className="aspect-video w-full rounded-2xl bg-black/5 overflow-hidden shadow-inner relative">
              {selectedCollection.thumbnail ? (
                <img src={selectedCollection.thumbnail} alt={selectedCollection.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 text-5xl">
                   Image
                </div>
              )}
           </div>

           {/* Title & Stats */}
           <div>
             <h1 className="text-2xl font-bold text-slate-800 mb-2">{selectedCollection.title}</h1>
             <div className="flex items-center gap-4 text-sm text-slate-500">
               <span className="flex items-center gap-1">
                 ⏱ 30 min
               </span>
               <span className="flex items-center gap-1">
                 📊 Level 2
               </span>
               <a href={selectedCollection.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                 Open Link ↗
               </a>
             </div>
           </div>

           {/* Tags */}
           <div className="flex flex-wrap gap-2">
             {selectedCollection.tags.map(tag => (
               <span key={tag} className="px-3 py-1 rounded-full text-sm bg-white border border-slate-200 text-slate-600 shadow-sm">
                 {tag}
               </span>
             ))}
           </div>

           {/* Big Actions */}
           <div className="grid grid-cols-2 gap-4">
             <button 
               onClick={() => logPractice(selectedCollection.id)}
               className="h-14 rounded-xl bg-blue-500 text-white font-semibold shadow-lg shadow-blue-500/30 active:scale-95 transition-all text-lg flex items-center justify-center gap-2"
             >
               <span>🎯</span> Log Practice
             </button>
             <button className="h-14 rounded-xl bg-white text-slate-700 font-medium shadow-sm border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all flex items-center justify-center gap-2">
               <span>📝</span> Add Note
             </button>
           </div>

           {/* History Section (Mocked for now) */}
           <div className="space-y-4">
             <h3 className="text-lg font-semibold text-slate-800">History</h3>
             <div className="border-l-2 border-slate-200 pl-4 space-y-6">
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-slate-50" />
                  <p className="text-sm font-medium text-slate-800">Yesterday, 10:30 AM</p>
                  <p className="text-sm text-slate-500 mt-1">"Felt great, improved my posture."</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-slate-300 ring-4 ring-slate-50" />
                  <p className="text-sm font-medium text-slate-800">Jan 20, 2026</p>
                  <p className="text-sm text-slate-500 mt-1">No notes.</p>
                </div>
             </div>
           </div>
        </div>
      </div>
    </>
  );
};

export default DetailPanel;
