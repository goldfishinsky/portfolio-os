import type { AppConfig } from '../types';
import { Blog } from '../apps/Blog';
import { Terminal } from '../apps/Terminal';
import { Browser } from '../apps/Browser';
import { Finder } from '../apps/Finder';
import { Launchpad } from '../components/Launchpad';
import launchpadIcon from '../assets/icons/launchpad.png';
import safariIcon from '../assets/icons/safari.png';
import terminalIcon from '../assets/icons/terminal.png';
import notesIcon from '../assets/icons/notes.png';
import calculatorIcon from '../assets/icons/calculator.png';
import trashIcon from '../assets/icons/trash.png';
import mailIcon from '../assets/icons/mail.png';
import vscodeIcon from '../assets/icons/vscode.png';
import { Calculator } from '../apps/Calculator';
import { VideoPlayer } from '../apps/VideoPlayer';
import videoPlayerIcon from '../assets/icons/video-player.png';
import finderMorandiIcon from '../assets/icons/finder-morandi.png';

// Placeholder Components
const Notepad = () => <div className="h-full w-full p-4"><textarea className="w-full h-full resize-none bg-transparent outline-none font-mono" placeholder="Type here..." /></div>;

// Morandi Color Palette Helper with Gradients
const MorandiIcon = ({ children, from, to, invert = false }: { children: React.ReactNode, from: string, to: string, invert?: boolean }) => (
  <div 
    className={`w-full h-full rounded-xl flex items-center justify-center shadow-sm overflow-hidden relative`} 
    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
  >
    {/* Subtle noise texture overlay for matte feel */}
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-overlay" />
    
    <div className={`w-[85%] h-[85%] flex items-center justify-center filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105 ${invert ? 'invert brightness-0 opacity-80' : ''}`}>
      {children}
    </div>
  </div>
);

export const apps: Record<string, AppConfig> = {
  finder: {
    id: 'finder',
    title: 'Finder',
    // Use the new generated Finder icon, but apply slight desaturation to match Morandi vibe if needed
    icon: <img src={finderMorandiIcon} alt="Finder" className="w-full h-full object-cover rounded-xl drop-shadow-md filter saturate-[0.8]" />,
    component: Finder,
    width: 800,
    height: 600,
  },
  launchpad: {
    id: 'launchpad',
    title: 'Launchpad',
    icon: <MorandiIcon from="#E0E4E8" to="#C0C4C8"><img src={launchpadIcon} alt="Launchpad" className="w-full h-full object-contain" /></MorandiIcon>,
    component: Launchpad,
  },
  safari: {
    id: 'safari',
    title: 'Safari',
    icon: <MorandiIcon from="#D6E4E8" to="#B6C4C8"><img src={safariIcon} alt="Safari" className="w-full h-full object-contain" /></MorandiIcon>,
    component: Browser,
    width: 1024,
    height: 768,
  },
  mail: {
    id: 'mail',
    title: 'Mail',
    icon: <MorandiIcon from="#C8D6E0" to="#A8B6C0"><img src={mailIcon} alt="Mail" className="w-full h-full object-contain" /></MorandiIcon>,
    component: Notepad, // Placeholder
    width: 800,
    height: 600,
  },
  notes: {
    id: 'notes',
    title: 'Notes',
    icon: <MorandiIcon from="#E8E0D0" to="#C8C0B0"><img src={notesIcon} alt="Notes" className="w-full h-full object-contain" /></MorandiIcon>,
    component: Notepad,
    width: 800,
    height: 600,
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    icon: <MorandiIcon from="#5A646B" to="#3A444B" invert><img src={terminalIcon} alt="Terminal" className="w-full h-full object-contain" /></MorandiIcon>,
    component: Terminal,
    width: 600,
    height: 400,
  },
  vscode: {
    id: 'vscode',
    title: 'VS Code',
    icon: <MorandiIcon from="#B4C4D4" to="#94A4B4"><img src={vscodeIcon} alt="VS Code" className="w-full h-full object-contain" /></MorandiIcon>,
    component: Notepad, // Placeholder for VS Code
    width: 1000,
    height: 800,
  },
  calculator: {
    id: 'calculator',
    title: 'Calculator',
    icon: <MorandiIcon from="#D4C4B4" to="#B4A494"><img src={calculatorIcon} alt="Calculator" className="w-full h-full object-contain" /></MorandiIcon>,
    component: Calculator,
    width: 320,
    height: 450,
  },
  trash: {
    id: 'trash',
    title: 'Trash',
    icon: <MorandiIcon from="#D0D0D0" to="#B0B0B0"><img src={trashIcon} alt="Trash" className="w-full h-full object-contain" /></MorandiIcon>,
    component: Notepad, // Placeholder
    width: 600,
    height: 400,
  },
  blog: {
    id: 'blog',
    title: 'Blog',
    icon: <MorandiIcon from="#E0D4C8" to="#C0B4A8"><img src={notesIcon} alt="Blog" className="w-full h-full object-contain" /></MorandiIcon>,
    component: Blog,
    width: 800,
    height: 600,
  },
  'video-player': {
    id: 'video-player',
    title: 'Videos',
    // Desaturate the video player icon to match the theme
    icon: <img src={videoPlayerIcon} alt="Videos" className="w-full h-full object-cover rounded-xl drop-shadow-md filter saturate-[0.7]" />,
    component: VideoPlayer,
    width: 900,
    height: 600,
  },
};
