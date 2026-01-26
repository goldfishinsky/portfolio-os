import React, { useState } from 'react';
import { usePracticeHubStore } from '../store/usePracticeHubStore';
import { CollectionItem, Platform } from '../types';

const AddCollectionDialog = () => {
  const { addDialogOpen, closeAddDialog, addCollection } = usePracticeHubStore();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  
  if (!addDialogOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple mock logic
    const newItem: CollectionItem = {
      id: crypto.randomUUID(),
      user_id: 'user-mock',
      title: title || 'New Practice Item',
      url,
      platform: 'youtube', // mock
      tags: ['New'],
      practice_count: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      last_practiced: null
    };

    addCollection(newItem);
    handleClose();
  };

  const handleClose = () => {
    setUrl('');
    setTitle('');
    closeAddDialog();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 transform transition-all scale-100">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Add New Content</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Link URL</label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="Paste URL from YouTube, Bilibili..."
              value={url}
              onChange={e => setUrl(e.target.value)}
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-600 mb-1">Title</label>
             <input 
               type="text" 
               className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
               placeholder="e.g. Morning Yoga Flow"
               value={title}
               onChange={e => setTitle(e.target.value)}
             />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={handleClose}
              className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-medium hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 shadow-lg shadow-blue-500/30 transition-all active:scale-95"
            >
              Add Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCollectionDialog;
