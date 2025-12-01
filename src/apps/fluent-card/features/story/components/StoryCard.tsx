import React from 'react';
import { Volume2, ThumbsUp, Frown, Meh } from 'lucide-react';

interface StoryCardProps {
  id: string;
  image: string;
  text: string;
  choices?: { id: string; text: string }[];
  onWordClick: (word: string, context: string) => void;
  onNext: (choiceId?: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ id, image, text, choices, onWordClick, onNext }) => {
  // Split text into sentences, then words
  // This is a naive implementation; for production, use a proper tokenizer
  const renderText = () => {
    const words = text.split(/(\s+)/);
    return words.map((word, index) => {
      if (word.match(/^\s+$/)) return <span key={index}>{word}</span>;
      
      // Clean word for lookup (remove punctuation)
      const cleanWord = word.replace(/[.,!?;:()"']/g, '');
      if (!cleanWord) return <span key={index}>{word}</span>;

      return (
        <span
          key={index}
          onClick={(e) => {
            e.stopPropagation();
            onWordClick(cleanWord, text);
          }}
          className="cursor-pointer hover:bg-blue-500/30 hover:text-blue-200 rounded px-0.5 transition-colors"
        >
          {word}
        </span>
      );
    });
  };

  return (
    <div className="w-full h-full flex flex-col bg-black snap-start shrink-0 relative">
      {/* Image Section */}
      <div className="flex-1 relative">
        <img src={image} alt="Story" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Text Section */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-24 bg-gradient-to-t from-black via-black/80 to-transparent">
        <p className="text-xl leading-relaxed font-serif text-gray-100 mb-4">
          {renderText()}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between mt-4">
          <button 
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(text);
              utterance.lang = 'en-US';
              window.speechSynthesis.speak(utterance);
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <Volume2 size={20} />
          </button>
          
          <div className="flex gap-4">
            <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
              <ThumbsUp size={20} />
              <span className="text-[10px]">Easy</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
              <Meh size={20} />
              <span className="text-[10px]">Okay</span>
            </button>
            <button className="flex flex-col items-center gap-1 text-gray-400 hover:text-white">
              <Frown size={20} />
              <span className="text-[10px]">Hard</span>
            </button>
          </div>
        </div>

        {/* Choices or Next Button */}
        <div className="mt-6 space-y-3">
          {choices ? (
            choices.map(choice => (
              <button
                key={choice.id}
                onClick={() => onNext(choice.id)}
                className="w-full py-3 bg-blue-600/20 border border-blue-500/50 rounded-xl text-blue-200 font-bold hover:bg-blue-600 hover:text-white transition-all"
              >
                {choice.text}
              </button>
            ))
          ) : (
            <button
              onClick={() => onNext()}
              className="w-full py-4 bg-white/10 rounded-xl text-gray-400 text-sm animate-pulse"
            >
              Tap to continue...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
