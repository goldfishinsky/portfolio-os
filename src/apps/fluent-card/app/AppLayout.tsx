import React, { useState } from 'react';
import { Home, Compass, BookOpen, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoryFeed } from '../features/story/components/StoryFeed';
import { GachaMachine } from '../features/review/components/GachaMachine';
import { ProfileView } from '../features/user/components/ProfileView';

// Placeholder Views
const HomeView = () => <StoryFeed />;
const ExploreView = () => <div className="flex-1 bg-zinc-900 flex items-center justify-center">Explore</div>;
const ReviewView = () => <GachaMachine />;

export const AppLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'review' | 'profile'>('home');

  return (
    <div className="w-full h-full bg-black flex flex-col relative overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div key="home" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <HomeView />
            </motion.div>
          )}
          {activeTab === 'explore' && (
            <motion.div key="explore" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ExploreView />
            </motion.div>
          )}
          {activeTab === 'review' && (
            <motion.div key="review" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ReviewView />
            </motion.div>
          )}
          {activeTab === 'profile' && (
            <motion.div key="profile" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProfileView />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Tab Bar */}
      <div className="h-16 bg-black/90 backdrop-blur-md border-t border-white/10 flex items-center justify-around px-2 z-50">
        <TabButton 
          active={activeTab === 'home'} 
          onClick={() => setActiveTab('home')} 
          icon={<Home size={24} />} 
          label="Home" 
        />
        <TabButton 
          active={activeTab === 'explore'} 
          onClick={() => setActiveTab('explore')} 
          icon={<Compass size={24} />} 
          label="Explore" 
        />
        <TabButton 
          active={activeTab === 'review'} 
          onClick={() => setActiveTab('review')} 
          icon={<BookOpen size={24} />} 
          label="Review" 
        />
        <TabButton 
          active={activeTab === 'profile'} 
          onClick={() => setActiveTab('profile')} 
          icon={<User size={24} />} 
          label="Profile" 
        />
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-16 h-full transition-colors ${active ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
  >
    <div className={`mb-1 transition-transform ${active ? 'scale-110' : 'scale-100'}`}>
      {icon}
    </div>
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);
