import React from 'react';
import { drivingData } from '../../data/drivingData';
import { BookOpen, AlertTriangle, Map } from 'lucide-react';

interface DrivingSidebarProps {
  selectedCategory: string;
  selectedTopic: string;
  onSelectCategory: (id: string) => void;
  onSelectTopic: (id: string) => void;
}

export const DrivingSidebar: React.FC<DrivingSidebarProps> = ({
  selectedCategory,
  selectedTopic,
  onSelectCategory,
  onSelectTopic,
}) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'rules': return BookOpen;
      case 'signs': return AlertTriangle;
      case 'scenarios': return Map;
      default: return BookOpen;
    }
  };



  return (
    <div className="w-64 bg-gray-900/50 border-r border-white/10 flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          🚗 BC Driving
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Categories */}
        <div className="p-2 space-y-1">
          {drivingData.map((category) => {
            const Icon = getIcon(category.id);
            return (
              <div key={category.id}>
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  {category.title}
                </button>
                
                {/* Topics (only if category active) */}
                {selectedCategory === category.id && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-2">
                    {category.topics.map((topic) => (
                      <button
                        key={topic.id}
                        onClick={() => onSelectTopic(topic.id)}
                        className={`w-full text-left px-3 py-1.5 rounded-md text-xs transition-all ${
                          selectedTopic === topic.id
                            ? 'bg-white/10 text-white'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                      >
                        {topic.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
