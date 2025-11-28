import React, { useState } from 'react';
import { DrivingSidebar } from '../components/driving/DrivingSidebar';
import { TopicDetail } from '../components/driving/TopicDetail';
import { drivingData } from '../data/drivingData';

export const DrivingTest: React.FC = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(drivingData[0].id);
  const [selectedTopicId, setSelectedTopicId] = useState(drivingData[0].topics[0].id);

  const activeCategory = drivingData.find(c => c.id === selectedCategoryId);
  const activeTopic = activeCategory?.topics.find(t => t.id === selectedTopicId);

  const handleCategorySelect = (id: string) => {
    setSelectedCategoryId(id);
    // Auto-select first topic of new category
    const newCategory = drivingData.find(c => c.id === id);
    if (newCategory && newCategory.topics.length > 0) {
      setSelectedTopicId(newCategory.topics[0].id);
    }
  };

  return (
    <div className="flex h-full w-full bg-gray-900 text-white overflow-hidden font-sans">
      <DrivingSidebar
        selectedCategory={selectedCategoryId}
        selectedTopic={selectedTopicId}
        onSelectCategory={handleCategorySelect}
        onSelectTopic={setSelectedTopicId}
      />
      
      {activeTopic ? (
        <TopicDetail topic={activeTopic} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a topic to begin
        </div>
      )}
    </div>
  );
};
