import React from 'react';

// Common container for all icons to ensure consistent shape and shadow
const IconContainer = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full h-full rounded-[22%] overflow-hidden shadow-md relative ${className}`}>
    {children}
    {/* Glossy reflection overlay */}
    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
  </div>
);

export const TerminalIcon = () => (
  <IconContainer className="bg-[#333333] flex flex-col items-center justify-center border border-gray-700">
    <div className="text-white font-mono text-3xl font-bold -mt-1">{`>_`}</div>
  </IconContainer>
);

export const CalculatorIcon = () => (
  <IconContainer className="bg-[#2c2c2c] p-2 grid grid-cols-4 grid-rows-5 gap-[2px]">
    <div className="col-span-4 bg-[#4a4a4a] rounded-sm mb-1" />
    {[...Array(16)].map((_, i) => (
      <div 
        key={i} 
        className={`rounded-full ${
          (i + 1) % 4 === 0 ? 'bg-[#ff9f0a]' : i < 3 ? 'bg-[#5c5c5c]' : 'bg-[#333333]'
        }`} 
      />
    ))}
  </IconContainer>
);

export const NotesIcon = () => (
  <IconContainer className="bg-white flex flex-col relative">
    <div className="absolute top-0 w-full h-4 bg-[#f2f2f2] border-b border-gray-300" />
    <div className="mt-6 px-2 space-y-2">
      <div className="w-full h-[2px] bg-gray-100" />
      <div className="w-full h-[2px] bg-gray-100" />
      <div className="w-3/4 h-[2px] bg-gray-100" />
      <div className="w-full h-[2px] bg-gray-100" />
    </div>
    <div className="absolute bottom-0 right-0 w-0 h-0 border-t-[15px] border-t-transparent border-l-[15px] border-l-gray-200 border-b-[15px] border-b-white border-r-[15px] border-r-white shadow-sm" />
  </IconContainer>
);

export const SafariIcon = () => (
  <IconContainer className="bg-white flex items-center justify-center">
    <div className="w-[85%] h-[85%] rounded-full bg-gradient-to-b from-[#1b88f7] to-[#0062cc] relative flex items-center justify-center shadow-inner">
      {/* Compass Ticks */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-[2px] h-[90%] bg-white/30"
          style={{ transform: `rotate(${i * 30}deg)` }}
        />
      ))}
      <div className="absolute w-[85%] h-[85%] rounded-full bg-gradient-to-b from-[#2aa1ff] to-[#007aff] flex items-center justify-center">
         {/* Inner circle details */}
         <div className="w-[90%] h-[90%] rounded-full border border-white/20" />
      </div>
      
      {/* Needle */}
      <div className="absolute w-[15%] h-[80%] flex flex-col items-center justify-center" style={{ transform: 'rotate(45deg)' }}>
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[35px] border-b-red-500" />
        <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[35px] border-t-white" />
      </div>
    </div>
  </IconContainer>
);

export const MailIcon = ({ originalIcon }: { originalIcon: string }) => (
  <IconContainer className="bg-gradient-to-b from-[#4da1ff] to-[#2c85e6] flex items-center justify-center">
     <img src={originalIcon} alt="Mail" className="w-[75%] h-[75%] object-contain drop-shadow-sm invert brightness-0 opacity-90" />
  </IconContainer>
);

export const VSCodeIcon = ({ originalIcon }: { originalIcon: string }) => (
  <IconContainer className="bg-white flex items-center justify-center p-2">
    <img src={originalIcon} alt="VS Code" className="w-full h-full object-contain" />
  </IconContainer>
);

export const LaunchpadIcon = () => (
  <IconContainer className="bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
    <div className="grid grid-cols-3 gap-1 p-3">
      {[...Array(9)].map((_, i) => (
        <div key={i} className={`w-2 h-2 rounded-[2px] ${
          [0, 2, 4, 6, 8].includes(i) ? 'bg-gray-600' : 'bg-gray-500'
        }`} />
      ))}
    </div>
  </IconContainer>
);

export const TrashIcon = () => (
  <IconContainer className="bg-gradient-to-b from-[#e0e0e0] to-[#c0c0c0] flex items-center justify-center border border-gray-300">
    <div className="w-[60%] h-[70%] border-2 border-gray-500 rounded-b-md border-t-0 relative flex justify-center">
        <div className="absolute -top-1 w-[110%] h-[2px] bg-gray-500" />
        <div className="w-[2px] h-[80%] bg-gray-400 mx-1 mt-2" />
        <div className="w-[2px] h-[80%] bg-gray-400 mx-1 mt-2" />
    </div>
  </IconContainer>
);
