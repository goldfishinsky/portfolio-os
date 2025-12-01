import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, Check } from 'lucide-react';

export const Gacha: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [opened, setOpened] = useState(false);
  const [rewards, setRewards] = useState<string[]>([]);

  const handleOpen = () => {
    setOpened(true);
    // Mock rewards
    setRewards(['climb', 'wall', 'racing']);
  };

  return (
    <div className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-6 text-center backdrop-blur-md">
      {!opened ? (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Session Complete!</h2>
          <button
            onClick={handleOpen}
            className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 animate-bounce"
          >
            <Gift size={48} className="text-white" />
          </button>
          <p className="text-gray-400 mt-8">Tap to open your rewards</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold text-white mb-6">You collected 3 words!</h2>
          
          <div className="grid gap-3 mb-8">
            {rewards.map((word, i) => (
              <motion.div
                key={word}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-gray-800 p-4 rounded-xl flex items-center justify-between border border-gray-700"
              >
                <span className="text-lg font-bold text-white capitalize">{word}</span>
                <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">+10 XP</span>
              </motion.div>
            ))}
          </div>

          <button
            onClick={onFinish}
            className="w-full py-4 bg-white text-black rounded-full font-bold text-lg flex items-center justify-center gap-2"
          >
            Continue <Check />
          </button>
        </motion.div>
      )}
    </div>
  );
};
