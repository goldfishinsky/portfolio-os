import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, Loader2 } from 'lucide-react';

interface WordSheetProps {
  word: string | null;
  context: string | null;
  onClose: () => void;
}

interface WordDefinition {
  word: string;
  definition: string;
  translation: string;
  example: string;
}

export const WordSheet: React.FC<WordSheetProps> = ({ word, context, onClose }) => {
  const [definition, setDefinition] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (word && context) {
      setLoading(true);
      setDefinition(null);
      
      // Simulate AI delay
      setTimeout(() => {
        setDefinition({
          word: word,
          definition: "To move or go up (something) using your feet and often your hands.",
          translation: "攀登",
          example: "She climbed the mountain with ease."
        });
        setLoading(false);
      }, 800);
    }
  }, [word, context]);

  return (
    <AnimatePresence>
      {word && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 z-40 backdrop-blur-sm"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-0 left-0 right-0 bg-[#1c1c1e] rounded-t-3xl z-50 p-6 pb-12 border-t border-white/10"
          >
            <div className="w-12 h-1 bg-gray-600 rounded-full mx-auto mb-6" />
            
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold text-white mb-1">{word}</h2>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <span>/klaɪm/</span>
                  <button className="p-1 hover:text-white"><Volume2 size={16} /></button>
                </div>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8 text-blue-500">
                <Loader2 className="animate-spin" size={32} />
              </div>
            ) : definition ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Meaning</h3>
                  <p className="text-lg text-gray-200 leading-relaxed">{definition.definition}</p>
                  <p className="text-blue-400 mt-1">{definition.translation}</p>
                </div>

                <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Example</h3>
                  <p className="text-gray-300 italic">"{definition.example}"</p>
                </div>
                
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-colors">
                  Add to Collection
                </button>
              </div>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
