import React, { useState } from 'react';
import { MoodImage } from '../../../lib/moodStore';
import { TagList } from './TagList';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

interface PolaroidCardProps {
  moodImage: MoodImage;
  className?: string;
  onRemove?: () => void;
}

export const PolaroidCard: React.FC<PolaroidCardProps> = ({ moodImage, className = '', onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Random rotation for organic feel (stable based on ID if possible, using 0 for now)
  const rotation = React.useMemo(() => Math.random() * 6 - 3, []); 

  // Decoration rendering
  const renderDecoration = () => {
    switch (moodImage.decoration_type) {
      case 'tape':
        return (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-white/40 backdrop-blur-[1px] rotate-[-2deg] shadow-sm z-20 border-l border-r border-white/20 transform skew-x-12 opacity-80" />
        );
      case 'clip':
        return (
          <div className="absolute -top-4 right-8 w-4 h-8 bg-stone-800 rounded-full border-2 border-stone-600 z-20 shadow-md" />
        );
      case 'pin':
        return (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-500 rounded-full shadow-md z-20 flex items-center justify-center">
             <div className="w-1 h-1 bg-red-300 rounded-full" />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className={`relative group inline-block ${className}`}
      // style={{ rotate: rotation }}
      whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {renderDecoration()}

      <div className="bg-white p-3 pb-8 shadow-md border border-stone-100 transition-shadow duration-300 group-hover:shadow-xl w-full">
        {/* Simple Image Placeholder or Real Image */}
        <div className="aspect-[4/5] bg-stone-100 overflow-hidden relative grayscale-[10%] group-hover:grayscale-0 transition-all duration-500">
          <img 
            src={moodImage.image_url} 
            alt={moodImage.caption || 'Mood board image'} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
          
          {/* Grain Overlay */}
          <div className="absolute inset-0 bg-noise opacity-[0.05] pointer-events-none mix-blend-overlay" />
        </div>
        
        {/* Delete Button */}
        {onRemove && (
           <button 
             onClick={(e) => {
               e.stopPropagation();
               setShowDeleteConfirm(true);
             }}
             className="absolute top-2 left-2 z-30 p-1.5 bg-white/80 rounded-full text-stone-400 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200"
             title="Delete Image"
           >
             <X size={14} />
           </button>
        )}

        {/* Caption */}
        {moodImage.caption && (
          <div className="mt-3 font-handwriting text-stone-600 text-center text-sm leading-tight">
            {moodImage.caption}
          </div>
        )}
      </div>

      {/* Tags floating on top-right of image */}
      <div className="absolute top-5 right-5 z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 flex flex-col items-end">
         <TagList tags={moodImage.tags || []} />
      </div>

      <ConfirmDialog 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          if (onRemove) onRemove();
          setShowDeleteConfirm(false);
        }}
        title="Delete Image?"
        description="Are you sure you want to remove this image from your mood board? This action cannot be undone."
      />
    </motion.div>
  );
};
