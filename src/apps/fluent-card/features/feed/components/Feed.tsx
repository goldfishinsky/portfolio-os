import React from 'react';
import { useFluentStore } from '../../../store/useFluentStore';
import { StoryCard } from '../../story/components/StoryCard';
import { WordSheet } from '../../story/components/WordSheet/WordSheet';
import { GachaMachine } from '../../review/components/GachaMachine';
import { useState } from 'react';

const MOCK_STORIES = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=2003&auto=format&fit=crop',
    text: "The climber looked up at the massive wall. Her hands were chalky and her heart was racing. 'Just one more move,' she whispered to herself.",
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1551818255-e6e10975bc17?q=80&w=1973&auto=format&fit=crop',
    text: "The startup team gathered around the laptop. It was 3 AM, but the code finally compiled. They shared a tired but victorious smile.",
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
    text: "He opened the old laptop and typed his password. The screen flickered to life, revealing a message from ten years ago.",
  }
];

export const Feed: React.FC = () => {
  const { interests, level } = useFluentStore();
  const [selectedWord, setSelectedWord] = useState<{ word: string; context: string } | null>(null);
  const [showGacha, setShowGacha] = useState(false);

  const handleWordClick = (word: string, context: string) => {
    setSelectedWord({ word, context });
  };

  return (
    <div className="w-full h-full bg-black overflow-y-scroll snap-y snap-mandatory scrollbar-hide relative">
      {MOCK_STORIES.map((story) => (
        <div key={story.id} className="w-full h-full snap-start">
          <StoryCard 
            {...story} 
            onWordClick={handleWordClick}
            onNext={() => {}} // Placeholder for Feed
          />
        </div>
      ))}
      
      <WordSheet 
        word={selectedWord?.word ?? null} 
        context={selectedWord?.context ?? null}
        onClose={() => setSelectedWord(null)}
      />

      {/* Floating Finish Button for Demo */}
      <button
        onClick={() => setShowGacha(true)}
        className="absolute top-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white border border-white/20 z-30"
      >
        Finish Session
      </button>

      {showGacha && (
        <div className="absolute inset-0 z-50">
          <GachaMachine />
          <button 
            onClick={() => setShowGacha(false)}
            className="absolute top-4 right-4 text-white z-50"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
