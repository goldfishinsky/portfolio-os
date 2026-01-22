import React, { useState } from 'react';
import { MoodWeek, MoodImage } from '../../../lib/moodStore';
import { PolaroidCard } from './PolaroidCard';
import { PasteOverlay } from './PasteOverlay';
import { Plus } from 'lucide-react';
import { format, addDays } from 'date-fns';

interface WeeklyGridProps {
  week: MoodWeek;
  onAddImage: (dayIndex: number) => void;
  onDeleteImage: (id: string) => void;
  onUpdateNotes: (notes: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Weekend'];

export const WeeklyGrid: React.FC<WeeklyGridProps> = ({ week, onAddImage, onDeleteImage, onUpdateNotes }) => {
  const [activePasteDay, setActivePasteDay] = useState<number | null>(null);
  const startDate = new Date(week.start_date);

  const getImagesForDay = (dayIndex: number) => {
    // Weekend logic: index 5 maps to Fri, but strictly map 0=Mon, 1=Tue...
    // Let's assume dayIndex 5 covers Sat(5) & Sun(6)
    if (dayIndex === 5) {
      return week.images.filter(img => img.day_index === 5 || img.day_index === 6);
    }
    return week.images.filter(img => img.day_index === dayIndex);
  };

  const renderCell = (dayIndex: number, label: string) => {
    const images = getImagesForDay(dayIndex);
    const date = addDays(startDate, dayIndex);

    return (
      <div className="flex flex-col h-full border-r border-stone-200/50 last:border-r-0 relative p-4 group">
        {/* Header */}
        <div className="flex justify-between items-baseline mb-4">
          <h3 className="font-serif italic text-xl text-stone-400">{label}</h3>
          <span className="text-xs font-mono text-stone-300">{format(date, 'MMM d')}</span>
        </div>

        {/* Drop Zone / Content */}
        <div className={`flex-1 min-h-[200px] grid gap-4 content-start relative transition-all duration-300
          ${images.length <= 1 ? 'grid-cols-1 place-items-center' : ''}
          ${images.length > 1 && images.length <= 4 ? 'grid-cols-2' : ''}
          ${images.length > 4 ? 'grid-cols-3' : ''}
        `}>
           {images.map(img => (
             <PolaroidCard 
               key={img.id} 
               moodImage={img} 
               className={images.length === 1 ? 'max-w-[280px]' : 'w-full'}
               onRemove={() => onDeleteImage(img.id)}
             />
           ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-0 w-full max-w-[1400px] mx-auto bg-white shadow-2xl rounded-sm overflow-hidden border border-stone-200">
      {/* Row 1: Mon - Wed */}
      <div className="grid grid-cols-3 min-h-[350px] border-b border-stone-200/50 divide-x divide-stone-200/50">
        {renderCell(0, 'Monday')}
        {renderCell(1, 'Tuesday')}
        {renderCell(2, 'Wednesday')}
      </div>

      {/* Row 2: Thu - Weekend */}
      <div className="grid grid-cols-3 min-h-[350px] border-b border-stone-200/50 divide-x divide-stone-200/50">
        {renderCell(3, 'Thursday')}
        {renderCell(4, 'Friday')}
        {renderCell(5, 'Weekend')}
      </div>

      {/* Row 3: Notes */}
      <div className="flex-1 p-6 bg-[#fdfbf7] min-h-[200px] relative">
         <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-b from-stone-200/20 to-transparent" />
         <h3 className="font-serif italic text-lg text-stone-400 mb-2">Weekly Notes</h3>
         <textarea 
           value={week.notes || ''}
           onChange={(e) => onUpdateNotes(e.target.value)}
           placeholder="Jot down your thoughts, themes, or inspirations for the week..."
           className="w-full h-full bg-transparent resize-none outline-none font-handwriting text-stone-600 text-lg leading-relaxed placeholder:text-stone-300"
         />
      </div>
      
      {activePasteDay !== null && (
        <PasteOverlay 
          dayIndex={activePasteDay} 
          onClose={() => setActivePasteDay(null)} 
        />
      )}
    </div>
  );
};
