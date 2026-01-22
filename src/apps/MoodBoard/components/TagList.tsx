import React from 'react';
import { MoodTag } from '../../../lib/moodStore';
import { X, Copy } from 'lucide-react';

interface TagListProps {
  tags: MoodTag[];
  onRemoveTag?: (tagId: string) => void;
}

export const TagList: React.FC<TagListProps> = ({ tags, onRemoveTag }) => {
  const [isHovered, setIsHovered] = React.useState(false);

  if (!tags || tags.length === 0) return null;

  const handleCopy = (tag: string) => {
    navigator.clipboard.writeText(tag);
  };

  // Determine what to display
  const displayTags = isHovered 
    ? tags 
    : [tags[0]]; // Only show first tag by default

  const remainingCount = tags.length - 1;

  return (
    <div 
      className="flex flex-col gap-1.5 mt-2 min-w-[80px] transition-all duration-200 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-wrap gap-1.5 flex-col items-start bg-white/40 backdrop-blur-sm p-1.5 rounded-lg border border-stone-100 shadow-sm hover:bg-white/60 transition-colors">
        {displayTags.map((tag) => (
          <div 
            key={tag.id}
            className="group/tag relative flex items-center w-full"
          >
            {/* Tag Itself */}
            <button
              onClick={() => handleCopy(tag.tag)}
              className="px-2 py-1 rounded-lg border border-white/50 
                         text-[10px] font-sans font-medium text-stone-600 shadow-sm 
                         bg-white/90 backdrop-blur-md
                         hover:bg-white hover:text-stone-900 hover:shadow-md transition-all
                         cursor-copy text-left whitespace-nowrap w-full flex items-center justify-between gap-2 group/btn"
              title="Click to copy"
            >
              <span className="truncate max-w-[120px]">{tag.tag}</span>
              <Copy size={12} className="text-stone-400 group-hover/btn:text-stone-600" />
            </button>

            {/* Remove Button (visible on hover of the specific tag) */}
            {onRemoveTag && isHovered && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveTag(tag.id);
                }}
                className="opacity-0 group-hover/tag:opacity-100 absolute -right-2 top-1/2 -translate-y-1/2 bg-white text-red-500 rounded-full p-1 hover:bg-red-50 shadow-sm border border-stone-100 transition-opacity z-10"
              >
                <X size={10} />
              </button>
            )}
          </div>
        ))}

        {/* The "+N" badge (Only visible if NOT hovered and there are remaining tags) */}
        {!isHovered && remainingCount > 0 && (
           <div className="px-2 py-1 rounded-lg border border-white/50 
                         text-[10px] font-sans font-medium text-stone-500 shadow-sm
                         bg-white/90 backdrop-blur-md
                         cursor-default text-center w-full">
              +{remainingCount}
           </div>
        )}
      </div>
    </div>
  );
};
