import { useState, useEffect, useRef } from 'react';
import { Play, Square, Settings, Volume2, Music2, Activity, Triangle, Drum, Bell } from 'lucide-react';

// --- Types ---
type SoundType = 'click' | 'woodblock' | 'beep' | 'cowbell' | 'shaker' | 'triangle' | 'drum';

interface MetronomeProps {
  onClose?: () => void; // Optional now
  className?: string;
  isVisible: boolean; // For optimization if needed, though we primarily rely on AudioContext
}

// --- Audio Engine ---
class MetronomeEngine {
  audioCtx: AudioContext | null = null;
  nextNoteTime: number = 0.0;
  timerID: number | null = null;
  isRunning: boolean = false;
  bpm: number = 120;
  beatsPerBar: number = 4;
  lookahead: number = 25.0; // ms
  scheduleAheadTime: number = 0.1; // s
  soundType: SoundType = 'click';
  onBeat?: (beatNumber: number) => void;
  beatNumber: number = 0;

  constructor() {
    this.scheduler = this.scheduler.bind(this);
  }

  ensureContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  start() {
    if (this.isRunning) return;
    this.ensureContext();
    if (!this.audioCtx) return;

    this.isRunning = true;
    this.nextNoteTime = this.audioCtx.currentTime + 0.05;
    this.beatNumber = 0;
    this.scheduler();
  }

  stop() {
    this.isRunning = false;
    if (this.timerID !== null) {
      window.clearTimeout(this.timerID);
      this.timerID = null;
    }
    // Reset beat number slightly so restart feels fresh? 
    // Usually standard to reset to 0
    this.beatNumber = 0;
  }

  setBpm(bpm: number) { this.bpm = bpm; }
  setSoundType(type: SoundType) { this.soundType = type; }
  setBeatsPerBar(beats: number) { this.beatsPerBar = beats; }

  scheduler() {
    if (!this.audioCtx) return;

    while (this.nextNoteTime < this.audioCtx.currentTime + this.scheduleAheadTime) {
      this.scheduleNote(this.beatNumber, this.nextNoteTime);
      this.nextNote();
    }

    if (this.isRunning) {
      this.timerID = window.setTimeout(this.scheduler, this.lookahead);
    }
  }

  nextNote() {
    const secondsPerBeat = 60.0 / this.bpm;
    this.nextNoteTime += secondsPerBeat;
    this.beatNumber++;
    if (this.beatNumber >= this.beatsPerBar) {
      this.beatNumber = 0;
    }
  }

  scheduleNote(beatNumber: number, time: number) {
    if (!this.audioCtx) return;

    // Visual callback
    if (this.onBeat) {
       const delay = Math.max(0, (time - this.audioCtx.currentTime) * 1000);
       setTimeout(() => this.onBeat?.(beatNumber), delay);
    }

    const ctx = this.audioCtx;
    const isAccent = beatNumber === 0;

    // --- Sound Synthesis ---
    
    if (this.soundType === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = isAccent ? 1200 : 800;
        gain.gain.setValueAtTime(1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.start(time);
        osc.stop(time + 0.1);
    } 
    else if (this.soundType === 'woodblock') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.value = isAccent ? 1000 : 750;
        osc.type = 'sine'; // Approximate
        gain.gain.setValueAtTime(1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
        osc.start(time);
        osc.stop(time + 0.1);
    }
    else if (this.soundType === 'beep') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'square';
        osc.frequency.value = isAccent ? 440 : 220;
        gain.gain.setValueAtTime(0.05, time); // Lower gain for square
        gain.gain.linearRampToValueAtTime(0, time + 0.05);
        osc.start(time);
        osc.stop(time + 0.05);
    }
    else if (this.soundType === 'cowbell') {
        // Two square waves for metallic sound
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'square';
        osc2.type = 'square';
        osc1.frequency.value = isAccent ? 800 : 560; // Standard cowbell freqs
        osc2.frequency.value = isAccent ? 1200 : 840; 
        
        filter.type = 'bandpass';
        filter.frequency.value = 1000;

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

        osc1.start(time);
        osc2.start(time);
        osc1.stop(time + 0.3);
        osc2.stop(time + 0.3);
    }
    else if (this.soundType === 'shaker') {
        // White noise
        const bufferSize = ctx.sampleRate * 2.0; // 2 seconds
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        
        filter.type = 'highpass';
        filter.frequency.value = 5000;
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        gain.gain.setValueAtTime(isAccent ? 0.2 : 0.1, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
        
        noise.start(time);
        noise.stop(time + 0.05);
    }
    else if (this.soundType === 'triangle') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.value = isAccent ? 1760 : 880; 
        gain.gain.setValueAtTime(0.3, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
        osc.start(time);
        osc.stop(time + 0.2);
    }
    else if (this.soundType === 'drum') {
        if (isAccent) {
            // Kick
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.frequency.setValueAtTime(150, time);
            osc.frequency.exponentialRampToValueAtTime(0.001, time + 0.5);
            
            gain.gain.setValueAtTime(1, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
            
            osc.start(time);
            osc.stop(time + 0.5);
        } else {
            // Snare-ish (Noise + Tone)
            const noise = ctx.createBufferSource();
            const buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < ctx.sampleRate; i++) data[i] = Math.random() * 2 - 1;
            noise.buffer = buffer;
            
            const noiseFilter = ctx.createBiquadFilter();
            noiseFilter.type = 'highpass';
            noiseFilter.frequency.value = 1000;
            
            const noiseGain = ctx.createGain();
            
            noise.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            
            noiseGain.gain.setValueAtTime(0.6, time);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
            noise.start(time);
            noise.stop(time + 0.2);
        }
    }
  }
}

// --- Component ---

export const Metronome = ({ className = '', isVisible }: MetronomeProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [soundType, setSoundType] = useState<SoundType>('click');
  const [activeBeat, setActiveBeat] = useState(-1);
  const [beatsPerBar, setBeatsPerBar] = useState(4);

  // Tap Tempo State
  const tapTimesRef = useRef<number[]>([]);

  // Engine Ref
  // Using a ref ensures the engine persists across re-renders
  const engineRef = useRef<MetronomeEngine | null>(null);

  // Initialize Engine ONCE
  useEffect(() => {
    if (!engineRef.current) {
        engineRef.current = new MetronomeEngine();
        engineRef.current.onBeat = (beat) => {
            setActiveBeat(beat);
            // Don't auto-reset immediately or it flickers too fast at high BPM,
            // but we need to reset to allow re-trigger animation if we were using CSS animations.
            // For simple state highlighting, this is fine.
        };
    }
    // Cleanup only on unmount (page close)
    return () => {
      engineRef.current?.stop();
    };
  }, []);

  // Sync Props to Engine
  useEffect(() => {
    if (engineRef.current) engineRef.current.setBpm(bpm);
  }, [bpm]);

  useEffect(() => {
    if (engineRef.current) engineRef.current.setSoundType(soundType);
  }, [soundType]);

  useEffect(() => {
      if (engineRef.current) engineRef.current.setBeatsPerBar(beatsPerBar);
  }, [beatsPerBar]);

  const togglePlay = () => {
    if (!engineRef.current) return;
    if (isPlaying) {
      engineRef.current.stop();
      setIsPlaying(false);
      setActiveBeat(-1);
    } else {
      engineRef.current.start();
      setIsPlaying(true);
    }
  };

  const handleTap = () => {
    const now = Date.now();
    const times = tapTimesRef.current;
    if (times.length > 0 && now - times[times.length - 1] > 2000) {
      tapTimesRef.current = [now];
      return;
    }
    times.push(now);
    if (times.length > 5) times.shift();
    tapTimesRef.current = times;

    if (times.length >= 2) {
       let intervals = 0;
       for (let i = 1; i < times.length; i++) intervals += (times[i] - times[i-1]);
       const avgInterval = intervals / (times.length - 1);
       if (avgInterval > 0) {
           const newBpm = Math.round(60000 / avgInterval);
           if (newBpm >= 30 && newBpm <= 300) setBpm(newBpm);
       }
    }
  };

  return (
    <div className={`h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-[#121212] p-8 ${className}`}>
        
        {/* Main Card */}
        <div className="bg-white dark:bg-[#1e1e1e] p-8 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl flex flex-col gap-8">
            
            {/* Header / Info */}
            <div className="flex justify-between items-center text-gray-500">
                <div className="flex items-center gap-2">
                    <Activity size={24} className="text-orange-500" />
                    <span className="font-bold text-xl text-gray-800 dark:text-white">Metronome</span>
                </div>
                <div className="text-sm font-medium bg-gray-100 dark:bg-[#2a2a2a] px-3 py-1 rounded-full">
                    {beatsPerBar} / 4 Time
                </div>
            </div>

            {/* Visual Beat Indicator */}
            <div className="flex justify-center gap-4 py-4">
                {[...Array(beatsPerBar)].map((_, i) => (
                    <div 
                        key={i}
                        className={`
                            w-6 h-12 rounded-full transition-all duration-75
                            ${activeBeat === i 
                                ? (i === 0 ? 'bg-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.6)] scale-110' : 'bg-orange-300 dark:bg-orange-700 shadow-[0_0_10px_rgba(249,115,22,0.4)]')
                                : 'bg-gray-200 dark:bg-gray-700'}
                        `} 
                    />
                ))}
            </div>

            {/* BPM Master Control */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <input 
                        type="number" 
                        value={bpm}
                        onChange={(e) => setBpm(Math.max(30, Math.min(300, parseInt(e.target.value) || 120)))}
                        className="text-8xl font-black bg-transparent text-center w-64 outline-none text-gray-800 dark:text-gray-100"
                    />
                    <span className="absolute -right-8 top-8 font-bold text-gray-400">BPM</span>
                </div>
                
                <input 
                    type="range"
                    min="30"
                    max="300"
                    value={bpm}
                    onChange={(e) => setBpm(parseInt(e.target.value))}
                    className="w-full max-w-md h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-orange-500"
                />
            </div>

            {/* Primary Actions */}
            <div className="flex items-center justify-center gap-4">
                 <button
                    onClick={handleTap} 
                    className="w-32 py-4 bg-gray-100 dark:bg-[#2a2a2a] rounded-2xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#333] transition-colors shadow-sm"
                >
                    TAP
                </button>
                
                <button 
                    onClick={togglePlay}
                    className={`
                        w-48 py-4 rounded-2xl flex items-center justify-center gap-3 font-bold text-xl transition-all text-white shadow-xl hover:scale-105 active:scale-95
                        ${isPlaying 
                            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' 
                            : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'}
                    `}
                >
                    {isPlaying ? <Square size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                    {isPlaying ? 'STOP' : 'START'}
                </button>
            </div>

            <div className="h-px bg-gray-100 dark:bg-gray-800 w-full" />

            {/* Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Time Signature */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Beats Per Bar</label>
                    <div className="flex flex-wrap gap-2">
                        {[2, 3, 4, 5, 6, 7, 8].map(num => (
                            <button
                                key={num}
                                onClick={() => setBeatsPerBar(num)}
                                className={`
                                    w-10 h-10 rounded-lg font-bold transition-all
                                    ${beatsPerBar === num 
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' 
                                        : 'bg-gray-100 dark:bg-[#2a2a2a] text-gray-500 hover:bg-gray-200 dark:hover:bg-[#333]'}
                                `}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sounds */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 uppercase tracking-wider">Sound</label>
                    <div className="grid grid-cols-4 gap-2">
                         {[
                             { id: 'click', icon: Settings, label: 'Click' },
                             { id: 'woodblock', icon: Music2, label: 'Wood' },
                             { id: 'beep', icon: Volume2, label: 'Beep' },
                             { id: 'cowbell', icon: Bell, label: 'Bell' },
                             { id: 'shaker', icon: Activity, label: 'Shaker' },
                             { id: 'triangle', icon: Triangle, label: 'Tri' },
                             { id: 'drum', icon: Drum, label: 'Drum' },
                         ].map((item) => (
                             <button
                                 key={item.id}
                                 onClick={() => setSoundType(item.id as SoundType)}
                                 className={`
                                     flex flex-col items-center justify-center p-2 rounded-lg gap-1 transition-all h-20 border
                                     ${soundType === item.id 
                                         ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400' 
                                         : 'bg-gray-50 dark:bg-[#2a2a2a] border-transparent text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333]'}
                                 `}
                             >
                                  <item.icon size={20} />
                                  <span className="text-[10px] font-bold uppercase">{item.label}</span>
                             </button>
                         ))}
                    </div>
                </div>
            </div>

        </div>
    </div>
  );
};
