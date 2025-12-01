import React, { useState, useRef } from 'react';
import { Loader2, ArrowDown } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh: React.FC<PullToRefreshProps> = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const THRESHOLD = 80;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (contentRef.current && contentRef.current.scrollTop === 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY === 0) return;
    const y = e.touches[0].clientY;
    const diff = y - startY;
    if (diff > 0) {
      setCurrentY(diff * 0.4); // Resistance
    }
  };

  const handleTouchEnd = async () => {
    if (currentY > THRESHOLD) {
      setIsRefreshing(true);
      setCurrentY(THRESHOLD); // Snap to threshold
      await onRefresh();
      setIsRefreshing(false);
    }
    setCurrentY(0);
    setStartY(0);
  };

  return (
    <div 
      className="relative h-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Refresh Indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center items-center pointer-events-none z-10 transition-transform duration-200"
        style={{ 
          height: `${THRESHOLD}px`,
          transform: `translateY(${currentY - THRESHOLD}px)` 
        }}
      >
        {isRefreshing ? (
          <Loader2 className="animate-spin text-gray-500" />
        ) : (
          <ArrowDown 
            className={`text-gray-500 transition-transform ${currentY > THRESHOLD ? 'rotate-180' : ''}`} 
            style={{ opacity: Math.min(currentY / THRESHOLD, 1) }}
          />
        )}
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        className="h-full overflow-y-auto transition-transform duration-200"
        style={{ transform: `translateY(${currentY}px)` }}
      >
        {children}
      </div>
    </div>
  );
};
