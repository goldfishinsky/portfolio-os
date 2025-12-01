import React from 'react';
import { useStoryStore, CHAPTER_1 } from '../store/useStoryStore';
import { useGachaStore } from '../../review/store/useGachaStore';
import { StoryCard } from '../components/StoryCard'; // We need to update StoryCard to handle choices
import { AnimatePresence, motion } from 'framer-motion';

export const StoryFeed: React.FC = () => {
  const { currentCardId, nextCard } = useStoryStore();
  const { addPendingWord } = useGachaStore();
  const card = CHAPTER_1.cards[currentCardId];

  if (!card) return <div className="text-white">End of Chapter</div>;

  return (
    <div className="w-full h-full bg-black relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={card.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="w-full h-full"
        >
          <StoryCard 
            id={card.id}
            image={card.image || ''}
            text={card.text || ''}
            choices={card.choices} // Pass choices to card
            onWordClick={(word, context) => {
              console.log('Captured:', word);
              addPendingWord(word, context);
            }}
            onNext={(choiceId) => nextCard(choiceId)}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
