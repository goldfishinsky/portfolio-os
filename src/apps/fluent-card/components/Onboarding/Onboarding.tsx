import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFluentStore, UserLevel } from '../../store/useFluentStore';
import { ChevronRight, Check } from 'lucide-react';

const INTERESTS = [
  { id: 'climbing', label: '🧗 Climbing' },
  { id: 'skiing', label: '🏂 Skiing' },
  { id: 'gaming', label: '🎮 Gaming' },
  { id: 'startup', label: '🚀 Startup' },
  { id: 'movies', label: '🎬 Movies' },
  { id: 'travel', label: '✈️ Travel' },
  { id: 'cooking', label: '🍳 Cooking' },
  { id: 'tech', label: '💻 Tech' },
];

const LEVELS: { id: UserLevel; label: string; desc: string }[] = [
  { id: 'beginner', label: '🌱 Beginner', desc: 'I know a few words' },
  { id: 'intermediate', label: '🌿 Intermediate', desc: 'I can read simple stories' },
  { id: 'advanced', label: '🌳 Advanced', desc: 'I want to read news & novels' },
];

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<UserLevel | null>(null);
  const completeOnboarding = useFluentStore((state) => state.completeOnboarding);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleFinish = () => {
    if (selectedLevel) {
      completeOnboarding(selectedInterests, selectedLevel);
    }
  };

  return (
    <div className="w-full h-full bg-zinc-900 text-white p-6 flex flex-col">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-3xl font-bold mb-2">What are you into?</h2>
            <p className="text-zinc-400 mb-8">Pick at least 3 topics.</p>
            
            <div className="grid grid-cols-2 gap-3">
              {INTERESTS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => toggleInterest(item.id)}
                  className={`p-4 rounded-xl text-left transition-all ${
                    selectedInterests.includes(item.id)
                      ? 'bg-white text-black scale-[1.02]'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <span className="text-lg font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <button
                disabled={selectedInterests.length < 1}
                onClick={() => setStep(2)}
                className="w-full py-4 bg-blue-600 rounded-full font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Next <ChevronRight />
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-3xl font-bold mb-2">How's your English?</h2>
            <p className="text-zinc-400 mb-8">We'll adapt the stories for you.</p>
            
            <div className="flex flex-col gap-4">
              {LEVELS.map((lvl) => (
                <button
                  key={lvl.id}
                  onClick={() => setSelectedLevel(lvl.id)}
                  className={`p-6 rounded-2xl text-left border-2 transition-all ${
                    selectedLevel === lvl.id
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-700'
                  }`}
                >
                  <div className="text-xl font-bold mb-1">{lvl.label}</div>
                  <div className="text-zinc-400">{lvl.desc}</div>
                </button>
              ))}
            </div>

            <div className="mt-auto pt-6">
              <button
                disabled={!selectedLevel}
                onClick={handleFinish}
                className="w-full py-4 bg-white text-black rounded-full font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Start Reading <Check />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
