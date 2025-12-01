import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGachaStore, CollectedWord } from '../store/useGachaStore';
import { Battery, Zap, Gift } from 'lucide-react';

export const GachaMachine: React.FC = () => {
  const { energy, pullGacha } = useGachaStore();
  const [rewards, setRewards] = useState<CollectedWord[] | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePull = () => {
    if (energy < 10) return;
    setIsAnimating(true);
    
    setTimeout(() => {
      const result = pullGacha();
      setRewards(result);
      setIsAnimating(false);
    }, 2000); // Animation duration
  };

  return (
    <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Energy Bar */}
      <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/10">
        <Zap className="text-yellow-400 fill-yellow-400" size={16} />
        <span className="font-bold font-mono text-yellow-400">{energy}</span>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-600 mb-8 tracking-tighter">
          MEMORY CAPSULE
        </h1>

        {/* The Machine */}
        <div className="relative w-64 h-64 mb-12">
          <motion.div 
            animate={isAnimating ? { rotate: [0, -5, 5, -5, 5, 0], scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
            className="w-full h-full bg-gradient-to-b from-purple-900/50 to-purple-900/20 rounded-full border-4 border-purple-500/30 flex items-center justify-center shadow-[0_0_50px_rgba(168,85,247,0.4)]"
          >
            <Gift size={80} className="text-purple-400" />
          </motion.div>
        </div>

        {/* Pull Button */}
        <button
          disabled={energy < 10 || isAnimating}
          onClick={handlePull}
          className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            PULL (10 <Zap size={16} className="fill-black" />)
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Rewards Overlay */}
      <AnimatePresence>
        {rewards && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-8"
          >
            <h2 className="text-3xl font-bold text-white mb-8">Capsule Opened!</h2>
            <div className="grid gap-4 w-full max-w-md">
              {rewards.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.2 }}
                  className="bg-zinc-800 p-4 rounded-xl border border-white/10 flex justify-between items-center"
                >
                  <div>
                    <div className="text-xl font-bold text-white">{item.word}</div>
                    <div className="text-xs text-zinc-500 truncate max-w-[200px]">{item.context}</div>
                  </div>
                  <div className="text-green-400 font-mono text-xs">+XP</div>
                </motion.div>
              ))}
            </div>
            <button 
              onClick={() => setRewards(null)}
              className="mt-12 px-8 py-3 bg-white text-black rounded-full font-bold"
            >
              Collect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
