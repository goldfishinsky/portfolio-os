import React from 'react';
import { userConfig } from '../config/userConfig';

export const Resume: React.FC = () => {
  const resumeUrl = `/${userConfig.system.resumeFilename}`;

  return (
    <div className="h-full w-full bg-gray-800 flex flex-col">
      <iframe 
        src={resumeUrl} 
        className="w-full h-full border-none"
        title="Resume"
      />
    </div>
  );
};
