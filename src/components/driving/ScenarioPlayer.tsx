import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import type { ScenarioConfig, CarConfig } from '../../data/drivingData';
import { Play, RotateCcw } from 'lucide-react';

interface ScenarioPlayerProps {
  scenario: ScenarioConfig;
}

export const ScenarioPlayer: React.FC<ScenarioPlayerProps> = ({ scenario }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [key, setKey] = useState(0); // Force re-render to reset

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-video bg-[#e5e7eb] rounded-lg overflow-hidden border border-gray-300 shadow-sm">
        {/* Background Layer */}
        <div className="absolute inset-0 bg-[#d1d5db]" />

        {/* Road Layer */}
        <div className="absolute inset-0 flex items-center justify-center">
          <RoadLayer type={scenario.type} />
        </div>

        {/* Cars Layer */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {scenario.cars.map((car) => (
            <RealisticCar 
              key={`${car.id}-${key}`} 
              car={car} 
              isPlaying={isPlaying} 
            />
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div>
           <h3 className="font-bold text-gray-900">{scenario.title}</h3>
           <p className="text-sm text-gray-500">{scenario.description}</p>
        </div>
        <button
          onClick={isPlaying ? handleReset : handlePlay}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-sm"
        >
          {isPlaying ? <RotateCcw size={18} /> : <Play size={18} />}
          {isPlaying ? 'Reset' : 'Play'}
        </button>
      </div>
    </div>
  );
};

const RoadLayer: React.FC<{ type: ScenarioConfig['type'] }> = ({ type }) => {
  if (type === 'intersection') {
    return (
      <>
        <div className="absolute w-full h-32 bg-[#374151]" />
        <div className="absolute h-full w-32 bg-[#374151]" />
        <div className="absolute w-32 h-32 bg-[#374151]" />
        <div className="absolute w-full h-0.5 border-t-2 border-dashed border-yellow-400" />
        <div className="absolute h-full w-0.5 border-l-2 border-dashed border-yellow-400" />
        <div className="absolute w-32 h-32 border-4 border-transparent">
           <div className="absolute -top-1 left-0 w-full h-1 bg-white" />
           <div className="absolute -bottom-1 left-0 w-full h-1 bg-white" />
           <div className="absolute top-0 -left-1 w-1 h-full bg-white" />
           <div className="absolute top-0 -right-1 w-1 h-full bg-white" />
        </div>
      </>
    );
  }
  if (type === 'cul-de-sac') {
    return (
      <div className="relative w-full h-full flex items-center justify-center">
         <div className="absolute w-32 h-full bg-[#374151] right-0" />
         <div className="absolute w-64 h-64 rounded-full bg-[#374151] left-1/4" />
         <div className="absolute w-40 h-40 rounded-full bg-[#d1d5db] left-[calc(25%+12px)] border border-gray-400" />
      </div>
    );
  }
  // Default generic road
  return <div className="absolute w-full h-32 bg-[#374151]" />;
};

const RealisticCar: React.FC<{ car: CarConfig; isPlaying: boolean }> = ({ car, isPlaying }) => {
  const x = useMotionValue(car.start.x);
  const y = useMotionValue(car.start.y);
  const rotation = useMotionValue(car.rotation);
  const [signal, setSignal] = useState<'left' | 'right' | 'none'>('none');

  useEffect(() => {
    if (!isPlaying) return;

    const sequence = async () => {
      let currentX = car.start.x;
      let currentY = car.start.y;


      for (const segment of car.path) {
        // Handle delay
        if (segment.delay) {
          await new Promise(resolve => setTimeout(resolve, segment.delay! * 1000));
        }

        // Set signal
        if (segment.signals) setSignal(segment.signals);

        if (segment.type === 'straight') {
          // Linear interpolation for straight lines
          await animate(x, segment.end.x, { duration: segment.duration, ease: "easeInOut" });
          // Parallel animation for Y if needed (though usually one axis moves or both linearly)
          // For simplicity in this engine, we assume straight lines update X/Y linearly
          // We need to animate both X and Y simultaneously
          
          // Animate X and Y simultaneously for straight lines
          await Promise.all([
            animate(x, segment.end.x, { duration: segment.duration, ease: "easeInOut" }),
            animate(y, segment.end.y, { duration: segment.duration, ease: "easeInOut" })
          ]);
          
          currentX = segment.end.x;
          currentY = segment.end.y;
        } else if (segment.type === 'bezier' && segment.control1 && segment.control2) {
          // Cubic Bezier Animation
          // We manually calculate points along the curve
          const startP = { x: currentX, y: currentY };
          const p1 = segment.control1;
          const p2 = segment.control2;
          const endP = segment.end;

          await animate(0, 1, {
            duration: segment.duration,
            ease: "easeInOut",
            onUpdate: (t) => {
              // Cubic Bezier formula
              const oneMinusT = 1 - t;
              const bx = Math.pow(oneMinusT, 3) * startP.x + 
                         3 * Math.pow(oneMinusT, 2) * t * p1.x + 
                         3 * oneMinusT * Math.pow(t, 2) * p2.x + 
                         Math.pow(t, 3) * endP.x;
              
              const by = Math.pow(oneMinusT, 3) * startP.y + 
                         3 * Math.pow(oneMinusT, 2) * t * p1.y + 
                         3 * oneMinusT * Math.pow(t, 2) * p2.y + 
                         Math.pow(t, 3) * endP.y;

              // Calculate tangent for rotation
              // Derivative of Cubic Bezier
              const tx = 3 * Math.pow(oneMinusT, 2) * (p1.x - startP.x) +
                         6 * oneMinusT * t * (p2.x - p1.x) +
                         3 * Math.pow(t, 2) * (endP.x - p2.x);
              
              const ty = 3 * Math.pow(oneMinusT, 2) * (p1.y - startP.y) +
                         6 * oneMinusT * t * (p2.y - p1.y) +
                         3 * Math.pow(t, 2) * (endP.y - p2.y);
              
              const angle = Math.atan2(ty, tx) * (180 / Math.PI);
              
              x.set(bx);
              y.set(by);
              rotation.set(angle);
            }
          });
          
          currentX = endP.x;
          currentY = endP.y;
        }
      }
      setSignal('none');
    };

    sequence();
  }, [isPlaying, car]);

  return (
    <motion.div
      style={{ x, y, rotate: rotation, backgroundColor: car.color }}
      className="absolute w-12 h-20 rounded-lg shadow-md z-10 flex flex-col items-center justify-between py-1 border border-black/10"
    >
      {/* Windshield */}
      <div className="w-10 h-4 bg-sky-900/40 rounded-sm mt-1" />
      {/* Roof */}
      <div className="w-10 h-6 bg-black/10 rounded-sm" />
      {/* Rear window */}
      <div className="w-10 h-3 bg-sky-900/40 rounded-sm mb-1" />

      {/* Signals */}
      {signal === 'left' && (
        <motion.div 
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="absolute -left-1 top-2 w-1.5 h-3 bg-amber-400 rounded-l-sm" 
        />
      )}
      {signal === 'right' && (
        <motion.div 
           animate={{ opacity: [0, 1, 0] }}
           transition={{ repeat: Infinity, duration: 0.5 }}
           className="absolute -right-1 top-2 w-1.5 h-3 bg-amber-400 rounded-r-sm" 
        />
      )}
    </motion.div>
  );
};
