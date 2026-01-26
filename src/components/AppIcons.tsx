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

export const TimeQuadrantIcon = () => (
  <IconContainer className="bg-white flex items-center justify-center">
    <div className="grid grid-cols-2 gap-0.5 p-3 w-full h-full">
      <div className="bg-red-500 rounded-tl-md" />
      <div className="bg-blue-500 rounded-tr-md" />
      <div className="bg-orange-500 rounded-bl-md" />
      <div className="bg-green-500 rounded-br-md" />
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

export const PreviewIcon = () => (
  <IconContainer className="bg-white flex items-center justify-center">
    <div className="relative w-[70%] h-[80%] bg-blue-50 border border-blue-200 shadow-sm flex flex-col items-center justify-center">
      <div className="text-[8px] font-bold text-blue-500 mb-1">PDF</div>
      <div className="w-[60%] h-[2px] bg-blue-200 mb-1" />
      <div className="w-[60%] h-[2px] bg-blue-200 mb-1" />
      <div className="w-[40%] h-[2px] bg-blue-200" />
    </div>
  </IconContainer>
);

export const FeedIcon = () => (
  <IconContainer className="bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
    <div className="text-white">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 11a9 9 0 0 1 9 9" />
        <path d="M4 4a16 16 0 0 1 16 16" />
        <circle cx="5" cy="19" r="1" />
      </svg>
    </div>
  </IconContainer>
);

export const GuitarIcon = () => (
  <IconContainer className="bg-gradient-to-br from-[#2c3e50] to-[#000000] flex items-center justify-center">
    <div className="w-full h-full flex items-center justify-center p-1.5">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg" style={{ transform: 'rotate(-45deg)' }}>
        {/* Strap Buttons */}
        <circle cx="35" cy="85" r="1.5" fill="#bdc3c7" />
        <circle cx="25" cy="45" r="1.5" fill="#bdc3c7" />

        {/* Body (Strat-like shape) */}
        <path 
          d="M35 85 C 25 85, 20 75, 25 60 C 28 55, 32 50, 32 50 C 32 50, 28 45, 28 40 C 28 30, 35 25, 45 25 C 55 25, 60 35, 60 45 C 60 45, 65 50, 65 60 C 65 75, 50 85, 35 85 Z" 
          fill="#e74c3c" 
          stroke="#c0392b" 
          strokeWidth="1"
        />
        
        {/* Pickguard */}
        <path 
          d="M38 75 C 33 75, 30 70, 32 60 C 33 58, 35 57, 35 57 C 35 57, 33 53, 33 50 C 33 45, 37 40, 42 40 C 47 40, 49 45, 49 50 L 49 65 C 49 68, 42 75, 38 75 Z" 
          fill="#ecf0f1" 
          opacity="0.9"
        />

        {/* Neck */}
        <rect x="42" y="5" width="6" height="45" fill="#f1c40f" /> {/* Maple Neck */}
        <rect x="42.5" y="5" width="5" height="45" fill="#3e2723" /> {/* Rosewood Fretboard */}
        
        {/* Frets */}
        {[...Array(10)].map((_, i) => (
            <line key={i} x1="42.5" y1={10 + i * 3.5} x2="47.5" y2={10 + i * 3.5} stroke="#bdc3c7" strokeWidth="0.5" />
        ))}

        {/* Headstock */}
        <path d="M42 5 L 40 0 C 40 0, 46 -5, 52 0 L 48 5 Z" fill="#f1c40f" />
        
        {/* Tuning Pegs */}
        <circle cx="41" cy="1" r="1" fill="#bdc3c7" />
        <circle cx="41" cy="3" r="1" fill="#bdc3c7" />
        <circle cx="42" cy="0" r="1" fill="#bdc3c7" />
        <circle cx="44" cy="-1" r="1" fill="#bdc3c7" />
        <circle cx="46" cy="-1" r="1" fill="#bdc3c7" />
        <circle cx="48" cy="0" r="1" fill="#bdc3c7" />

        {/* Bridge */}
        <rect x="40" y="72" width="10" height="3" fill="#bdc3c7" />
        
        {/* Pickups */}
        <rect x="43" y="55" width="4" height="2" rx="0.5" fill="#34495e" transform="rotate(-10 45 56)" />
        <rect x="42.5" y="60" width="5" height="2" rx="0.5" fill="#34495e" transform="rotate(-10 45 61)" />
        <rect x="42" y="65" width="6" height="2" rx="0.5" fill="#34495e" transform="rotate(-10 45 66)" />

        {/* Strings */}
        <line x1="43" y1="0" x2="43" y2="72" stroke="#bdc3c7" strokeWidth="0.2" />
        <line x1="43.8" y1="0" x2="43.8" y2="72" stroke="#bdc3c7" strokeWidth="0.2" />
        <line x1="44.6" y1="0" x2="44.6" y2="72" stroke="#bdc3c7" strokeWidth="0.2" />
        <line x1="45.4" y1="0" x2="45.4" y2="72" stroke="#bdc3c7" strokeWidth="0.2" />
        <line x1="46.2" y1="0" x2="46.2" y2="72" stroke="#bdc3c7" strokeWidth="0.2" />
        <line x1="47" y1="0" x2="47" y2="72" stroke="#bdc3c7" strokeWidth="0.2" />
        
        {/* Output Jack */}
        <ellipse cx="55" cy="75" rx="1.5" ry="2.5" fill="#bdc3c7" transform="rotate(45 55 75)" />
        
        {/* Knobs */}
        <circle cx="52" cy="68" r="1.5" fill="#ecf0f1" stroke="#bdc3c7" strokeWidth="0.5" />
        <circle cx="56" cy="70" r="1.5" fill="#ecf0f1" stroke="#bdc3c7" strokeWidth="0.5" />
      </svg>
    </div>
  </IconContainer>
);

export const MusicFileIcon = () => (
  <IconContainer className="bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center relative">
    {/* Snow sprinkles */}
    {[...Array(6)].map((_, i) => (
      <div 
        key={i} 
        className="absolute w-1 h-1 bg-white rounded-full opacity-60"
        style={{ 
          top: `${Math.random() * 80}%`, 
          left: `${Math.random() * 80}%`,
          animation: `pulse 2s infinite ${i * 0.3}s`
        }} 
      />
    ))}
    
    <div className="text-white drop-shadow-lg flex flex-col items-center justify-center relative">
      {/* Santa Hat on the note */}
      <div className="absolute -top-3 -right-2 rotate-12 scale-75 overflow-visible">
        <div className="w-8 h-6 bg-red-500 rounded-t-full relative">
          <div className="absolute -bottom-1 -left-1 w-10 h-3 bg-white rounded-full shadow-sm" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-sm" />
        </div>
      </div>
      
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" stroke="#ffd700" /> {/* Gold strokes */}
        <circle cx="6" cy="18" r="3" fill="#ffffff" stroke="none" /> {/* White note balls */}
        <circle cx="18" cy="16" r="3" fill="#ffffff" stroke="none" />
      </svg>
    </div>
  </IconContainer>
);

export const MoodBoardIcon = () => (
  <IconContainer className="bg-[#fcf8f2] flex items-center justify-center">
    <div className="relative w-full h-full p-2 flex flex-col gap-1 overflow-hidden">
        {/* Polaroids */}
        <div className="absolute top-2 left-2 w-8 h-10 bg-white shadow-sm rotate-[-6deg] p-0.5 border border-stone-200">
           <div className="w-full h-7 bg-stone-300"/>
        </div>
        <div className="absolute top-4 right-2 w-8 h-10 bg-white shadow-sm rotate-[12deg] p-0.5 border border-stone-200 z-10">
           <div className="w-full h-7 bg-amber-200"/>
        </div>
        {/* Washi Tape */}
        <div className="absolute top-3 right-1 w-6 h-2 bg-red-400/80 rotate-[30deg] z-20 mix-blend-multiply" />
    </div>
  </IconContainer>
);

export const PracticeHubIcon = () => (
  <IconContainer className="bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
    <div className="text-white text-3xl drop-shadow-md">🎯</div>
  </IconContainer>
);
