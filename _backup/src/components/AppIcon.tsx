import React from 'react';

interface AppIconProps {
  icon: React.ReactNode;
  gradient: string;
  size?: number;
}

export const AppIcon: React.FC<AppIconProps> = ({ icon, gradient }) => {
  return (
    <div 
      className={`relative flex items-center justify-center rounded-[22%] shadow-lg overflow-hidden group transition-transform active:scale-95 ${gradient}`}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Top Shine */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
      
      {/* Icon */}
      <div className="text-white drop-shadow-md relative z-10 transform transition-transform group-hover:scale-110 duration-300">
        {React.cloneElement(icon as any, { 
          size: '60%', 
          strokeWidth: 2 
        })}
      </div>

      {/* Bottom Shadow */}
      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
    </div>
  );
};
