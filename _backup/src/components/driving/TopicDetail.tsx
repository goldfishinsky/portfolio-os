import React from 'react';
import type { Topic } from '../../data/drivingData';
import { ScenarioPlayer } from './ScenarioPlayer';
import { Info, AlertTriangle } from 'lucide-react';

interface TopicDetailProps {
  topic: Topic;
}

export const TopicDetail: React.FC<TopicDetailProps> = ({ topic }) => {
  return (
    <div className="flex-1 h-full overflow-y-auto bg-white text-gray-900 font-serif">
      <div className="max-w-4xl mx-auto p-12 space-y-8">
        {/* Header */}
        <div className="border-b border-gray-200 pb-6">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">{topic.title}</h1>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
          <p>{topic.content}</p>
        </div>

        {/* Tips & Warnings */}
        <div className="grid gap-6 my-8">
          {topic.tips?.map((tip, idx) => (
            <div key={idx} className="flex gap-4 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
              <Info className="text-blue-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-blue-900 mb-1">Driving Tip</h4>
                <p className="text-blue-800">{tip}</p>
              </div>
            </div>
          ))}

          {topic.warnings?.map((warning, idx) => (
            <div key={idx} className="flex gap-4 p-6 bg-amber-50 border-l-4 border-amber-500 rounded-r-lg">
              <AlertTriangle className="text-amber-600 shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-amber-900 mb-1">Warning</h4>
                <p className="text-amber-800">{warning}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Simulation */}
        {topic.scenario && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-900 text-white text-sm">
                ▶
              </span>
              Scenario Demonstration
            </h2>
            <div className="bg-gray-100 p-2 rounded-xl border border-gray-200 shadow-inner">
              <ScenarioPlayer scenario={topic.scenario} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
