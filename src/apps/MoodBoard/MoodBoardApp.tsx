import React, { useEffect } from 'react';
import { useMoodStore } from '../../lib/moodStore';
import { WeeklyGrid } from './components/WeeklyGrid';
import { ConfirmDialog } from './components/ConfirmDialog';
import { startOfWeek, format, addWeeks, subWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export const MoodBoardApp = () => {
  const { currentWeek, fetchWeek, addImage, deleteImage, updateNotes, isLoading, isGeneratingTags } = useMoodStore();
  
  // Initialize with current week
  const [currentStartDate, setCurrentStartDate] = React.useState(() => 
    startOfWeek(new Date(), { weekStartsOn: 1 }).toISOString()
  );

  const [alertState, setAlertState] = React.useState<{ isOpen: boolean; title: string; message: string }>({
    isOpen: false,
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchWeek(currentStartDate);
  }, [currentStartDate, fetchWeek]);

  const handlePrevWeek = () => {
    const newDate = subWeeks(new Date(currentStartDate), 1);
    setCurrentStartDate(startOfWeek(newDate, { weekStartsOn: 1 }).toISOString());
  };

  const handleNextWeek = () => {
    const newDate = addWeeks(new Date(currentStartDate), 1);
    setCurrentStartDate(startOfWeek(newDate, { weekStartsOn: 1 }).toISOString());
  };

  // Handle global paste
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of items) {
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          if (file) {
            // Calculate today's index (0-6, Mon-Sun) based on real time
            // Note: If user is viewing a different week, we still paste to "today" of that week? 
            // Or just strictly "Today" relative to the view?
            // The prompt implies "put it on the day" (meaning Today). 
            // Let's assume we map the current real day to the grid.
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0=Sun, 1=Mon
            // Map to our grid: Mon=0, ... Sun=6
            const gridIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

            // TODO: Use a global loading indicator or toast. For now, rely on specific loading states if possible.
            // We need to call upload directly.
            // Since we can't easily access store actions outside hook without destructuring, we do it here.
            try {
              // We need to access uploadImage from store
              const { uploadImage, addImage } = useMoodStore.getState();
              const { publicUrl, path } = await uploadImage(file);
              await addImage(gridIndex, publicUrl, path);
            } catch (error) {
              console.error('Paste upload failed:', error);
              setAlertState({
                isOpen: true,
                title: 'Upload Failed',
                message: 'Failed to upload pasted image. Please check your connection and try again.'
              });
            }
          }
          // Continue to next item instead of breaking
        }
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const handleAddImage = async (dayIndex: number) => {
    // This is now purely for manual "Add" button click, handled by WeeklyGrid -> PasteOverlay
  };

  return (
    <div className="h-full w-full bg-[#fcf8f2] text-stone-800 flex flex-col font-sans overflow-hidden">
      {/* Header / Nav */}
      <div className="p-4 border-b border-stone-200 bg-white/50 backdrop-blur-sm flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold tracking-tight text-amber-900 flex items-center gap-2">
            Mood Board
            {isLoading && <Loader2 className="animate-spin text-amber-500" size={16} />}
          </h1>
          {isGeneratingTags && (
             <span className="text-xs text-amber-600 animate-pulse bg-amber-100 px-2 py-0.5 rounded-full">
               AI Generating Tags...
             </span>
          )}
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center bg-white rounded-md shadow-sm border border-stone-200">
             <button onClick={handlePrevWeek} className="p-1 hover:bg-stone-50 text-stone-500"><ChevronLeft size={20}/></button>
             <span className="px-3 py-1 font-mono text-sm border-l border-r border-stone-100 min-w-[140px] text-center">
               {format(new Date(currentStartDate), 'MMM d')} - {format(addWeeks(new Date(currentStartDate), 1), 'MMM d')}
             </span>
             <button onClick={handleNextWeek} className="p-1 hover:bg-stone-50 text-stone-500"><ChevronRight size={20}/></button>
           </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8 relative">
        <div className="absolute inset-0 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
        
        {currentWeek ? (
          <WeeklyGrid 
            week={currentWeek} 
            onAddImage={handleAddImage}
            onDeleteImage={deleteImage}
            onUpdateNotes={updateNotes}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-stone-400">
             {!isLoading && "No data for this week."}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={alertState.isOpen}
        onClose={() => setAlertState(prev => ({ ...prev, isOpen: false }))}
        title={alertState.title}
        description={alertState.message}
        variant="alert"
      />
    </div>
  );
};
