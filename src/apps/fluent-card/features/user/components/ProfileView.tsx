import React from 'react';
import { useGachaStore } from '../../review/store/useGachaStore';
import { useFluentStore } from '../../../store/useFluentStore';
import { Trophy, Flame, Book } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { collection, energy } = useGachaStore();
  const { level, interests } = useFluentStore();

  return (
    <div className="w-full h-full bg-black text-white p-6 overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold">
          H
        </div>
        <div>
          <h1 className="text-2xl font-bold">Henry</h1>
          <p className="text-gray-400 capitalize">{level} Explorer</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-2 text-yellow-500 mb-2">
            <Flame size={20} />
            <span className="font-bold">Streak</span>
          </div>
          <div className="text-3xl font-bold">3 Days</div>
        </div>
        <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <Book size={20} />
            <span className="font-bold">Words</span>
          </div>
          <div className="text-3xl font-bold">{collection.length}</div>
        </div>
      </div>

      {/* Collection Preview */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Trophy className="text-purple-500" />
        Collection
      </h2>
      
      <div className="grid gap-3">
        {collection.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-zinc-900/50 rounded-xl border border-dashed border-zinc-800">
            No words collected yet.
            <br />
            Go read some stories!
          </div>
        ) : (
          collection.map((item) => (
            <div key={item.id} className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
              <div>
                <div className="font-bold text-lg">{item.word}</div>
                <div className="text-xs text-gray-500">{item.context}</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
