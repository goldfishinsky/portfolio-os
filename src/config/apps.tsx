import type { AppConfig } from '../types';
import { Resume } from '../apps/Resume';
import { Blog } from '../apps/Blog';
import { Terminal } from '../apps/Terminal';
import { Browser } from '../apps/Browser';
import { Mail } from '../apps/Mail';
import finderIcon from '../assets/icons/finder.png';
import launchpadIcon from '../assets/icons/launchpad.png';
import safariIcon from '../assets/icons/safari.png';
import terminalIcon from '../assets/icons/terminal.png';
import vscodeIcon from '../assets/icons/vscode.png';
import mailIcon from '../assets/icons/mail.png';
import notesIcon from '../assets/icons/notes.png';
import calculatorIcon from '../assets/icons/calculator.png';
import trashIcon from '../assets/icons/trash.png';

// Placeholder Components
const Notepad = () => <div className="h-full w-full p-4"><textarea className="w-full h-full resize-none bg-transparent outline-none font-mono" placeholder="Type here..." /></div>;
const Calc = () => <div className="h-full w-full flex items-center justify-center bg-gray-100">Calculator Placeholder</div>;
const Explorer = () => <div className="h-full w-full p-4">File Explorer Placeholder</div>;
const VSCode = () => <div className="h-full w-full bg-[#1e1e1e] text-white p-4">VS Code Placeholder</div>;

export const apps: Record<string, AppConfig> = {
  finder: {
    id: 'finder',
    title: 'Finder',
    icon: <img src={finderIcon} alt="Finder" className="w-full h-full object-contain drop-shadow-md" />,
    component: Explorer,
  },
  launchpad: {
    id: 'launchpad',
    title: 'Launchpad',
    icon: <img src={launchpadIcon} alt="Launchpad" className="w-full h-full object-contain drop-shadow-md" />,
    component: () => null,
  },
  safari: {
    id: 'safari',
    title: 'Safari',
    icon: <img src={safariIcon} alt="Safari" className="w-full h-full object-contain drop-shadow-md" />,
    component: Browser,
    width: 1000,
    height: 700,
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    icon: <img src={terminalIcon} alt="Terminal" className="w-full h-full object-contain drop-shadow-md" />,
    component: Terminal,
  },
  vscode: {
    id: 'vscode',
    title: 'VS Code',
    icon: <img src={vscodeIcon} alt="VS Code" className="w-full h-full object-contain drop-shadow-md" />,
    component: VSCode,
    width: 900,
    height: 700,
  },
  mail: {
    id: 'mail',
    title: 'Mail',
    icon: <img src={mailIcon} alt="Mail" className="w-full h-full object-contain drop-shadow-md" />,
    component: Mail,
    width: 800,
    height: 600,
  },
  notes: {
    id: 'notes',
    title: 'Notes',
    icon: <img src={notesIcon} alt="Notes" className="w-full h-full object-contain drop-shadow-md" />,
    component: Notepad,
  },
  calculator: {
    id: 'calculator',
    title: 'Calculator',
    icon: <img src={calculatorIcon} alt="Calculator" className="w-full h-full object-contain drop-shadow-md" />,
    component: Calc,
    width: 300,
    height: 400,
  },
  trash: {
    id: 'trash',
    title: 'Trash',
    icon: <img src={trashIcon} alt="Trash" className="w-full h-full object-contain drop-shadow-md" />,
    component: () => <div className="p-4">Trash is empty</div>,
  },
  resume: {
    id: 'resume',
    title: 'Resume',
    icon: <img src={mailIcon} alt="Resume" className="w-full h-full object-contain drop-shadow-md" />,
    component: Resume,
    width: 900,
    height: 700,
  },
  blog: {
    id: 'blog',
    title: 'Blog',
    icon: <img src={notesIcon} alt="Blog" className="w-full h-full object-contain drop-shadow-md" />,
    component: Blog,
    width: 800,
    height: 600,
  },
};
