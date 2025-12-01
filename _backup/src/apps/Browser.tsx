import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Lock, Star } from 'lucide-react';
import { WebResume } from './WebResume';
import { userConfig } from '../config/userConfig';

export const Browser: React.FC = () => {
  const [url, setUrl] = useState(userConfig.social.github);
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="h-full w-full flex flex-col bg-white">
      {/* Browser Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200">
        <div className="flex gap-1">
          <button 
            className="p-1.5 rounded-full hover:bg-gray-200 disabled:opacity-30"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
          >
            <ArrowLeft size={14} className="text-gray-600" />
          </button>
          <button 
            className="p-1.5 rounded-full hover:bg-gray-200 disabled:opacity-30"
            disabled={currentIndex === history.length - 1}
            onClick={() => setCurrentIndex(prev => prev + 1)}
          >
            <ArrowRight size={14} className="text-gray-600" />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-200">
            <RotateCw size={14} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-full px-3 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-400 focus-within:border-transparent transition-all">
          <Lock size={12} className="text-green-600 mr-2" />
          <input 
            type="text" 
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-gray-700 font-normal"
          />
          <Star size={14} className="text-gray-400 ml-2 hover:text-yellow-400 cursor-pointer" />
        </div>

        <div className="flex gap-2">
           <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">
             {userConfig.profile.initials}
           </div>
        </div>
      </div>

      {/* Browser Content */}
      <div className="flex-1 overflow-hidden relative">
        {/* We only have one "page" for now which is the Web Resume */}
        <WebResume />
      </div>
    </div>
  );
};
