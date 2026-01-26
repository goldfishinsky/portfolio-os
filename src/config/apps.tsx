import type { AppConfig } from '../types';
import { Blog } from '../apps/Blog';
import { Terminal } from '../apps/Terminal';
import { Browser } from '../apps/Browser';
import { Finder } from '../apps/Finder';
import { Launchpad } from '../components/Launchpad';
import mailIcon from '../assets/icons/mail.png';
import { Calculator } from '../apps/Calculator';
import { VideoPlayer } from '../apps/VideoPlayer';
import { TimeQuadrant } from '../apps/TimeQuadrant';
import { Resume } from '../apps/Resume';
import { FeedReader } from '../apps/FeedReader';
import { Guitar } from '../apps/Guitar';
import { MusicPlayer } from '../apps/MusicPlayer';
import { MoodBoardApp } from '../apps/MoodBoard/MoodBoardApp';
import PracticeHub from '../apps/PracticeHub/PracticeHub';


import videoPlayerIcon from '../assets/icons/video-player.png';
import finderMorandiIcon from '../assets/icons/finder-morandi.png';

// Placeholder Components
const Notepad = () => <div className="h-full w-full p-4"><textarea className="w-full h-full resize-none bg-transparent outline-none font-mono" placeholder="Type here..." /></div>;

import { 
  TerminalIcon, 
  CalculatorIcon, 
  NotesIcon, 
  SafariIcon, 
  MailIcon, 
  LaunchpadIcon, 
  TimeQuadrantIcon,
  TrashIcon,
  PreviewIcon,
  FeedIcon,
  GuitarIcon,
  MusicFileIcon,
  MoodBoardIcon,
  PracticeHubIcon
} from '../components/AppIcons';

export const apps: Record<string, AppConfig> = {
  finder: {
    id: 'finder',
    title: 'Finder',
    icon: <img src={finderMorandiIcon.src} alt="Finder" className="w-full h-full object-cover rounded-[22%] drop-shadow-md" />,
    component: Finder,
    width: 800,
    height: 600,
  },
  launchpad: {
    id: 'launchpad',
    title: 'Launchpad',
    icon: <LaunchpadIcon />,
    component: Launchpad,
  },
  safari: {
    id: 'safari',
    title: 'Safari',
    icon: <SafariIcon />,
    component: Browser,
    width: 1024,
    height: 768,
  },
  mail: {
    id: 'mail',
    title: 'Mail',
    icon: <MailIcon originalIcon={mailIcon.src} />,
    component: Notepad, // Placeholder
    width: 800,
    height: 600,
  },
  notes: {
    id: 'notes',
    title: 'Notes',
    icon: <NotesIcon />,
    component: Notepad,
    width: 800,
    height: 600,
  },


  blog: {
    id: 'blog',
    title: 'Blog',
    icon: <NotesIcon />, // Reusing Notes icon for Blog for now
    component: Blog,
    width: 800,
    height: 600,
  },
  'video-player': {
    id: 'video-player',
    title: 'Videos',
    icon: <img src={videoPlayerIcon.src} alt="Videos" className="w-full h-full object-cover rounded-[22%] drop-shadow-md" />,
    component: VideoPlayer,
    width: 900,
    height: 600,
  },
  'time-quadrant': {
    id: 'time-quadrant',
    title: 'Time Quadrant',
    icon: <TimeQuadrantIcon />,
    component: TimeQuadrant,
    width: 1000,
    height: 700,
  },

  feed: {
    id: 'feed',
    title: 'Feed',
    icon: <FeedIcon />,
    component: FeedReader,
    width: 1000,
    height: 700,
  },
  guitar: {
    id: 'guitar',
    title: 'Guitar',
    icon: <GuitarIcon />,
    component: Guitar,
    width: 1000,
    height: 700,
  },
  'music-player': {
    id: 'music-player',
    title: 'Music',
    icon: <MusicFileIcon />,
    component: MusicPlayer,
    width: 400,
    height: 600,
  },
  'mood-board': {
    id: 'mood-board',
    title: 'Mood Board',
    icon: <MoodBoardIcon />,
    component: MoodBoardApp,
    width: 1000,
    height: 700,
  },
  'practice-hub': {
    id: 'practice-hub',
    title: 'Practice Hub',
    icon: <PracticeHubIcon />,
    component: PracticeHub,
    width: 1200,
    height: 800,
  },



};
