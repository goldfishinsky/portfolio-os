'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Tone from 'tone';
import { Settings, Volume2, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

// --- Audio Engine ---

type InstrumentType = 'grand-piano' | 'electric-piano' | 'synth';

class AudioEngine {
  private sampler: Tone.Sampler | null = null;
  private synth: Tone.PolySynth | null = null;
  private reverb: Tone.Reverb;
  private chorus: Tone.Chorus;
  private currentInstrument: InstrumentType = 'grand-piano';
  private isInitialized = false;
  public onLoaded: () => void = () => {};

  constructor() {
    this.reverb = new Tone.Reverb({ decay: 2.5, preDelay: 0.1 }).toDestination();
    this.chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination().start();
    this.reverb.wet.value = 0.2;
    this.chorus.wet.value = 0;
  }

  async init() {
    if (this.isInitialized) return;
    await Tone.start();

    // Initialize Sampler (Grand Piano)
    // Using Salamander Piano samples from a reliable CDN
    this.sampler = new Tone.Sampler({
      urls: {
        "A0": "A0.mp3",
        "C1": "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        "A1": "A1.mp3",
        "C2": "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        "A2": "A2.mp3",
        "C3": "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        "A3": "A3.mp3",
        "C4": "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        "A4": "A4.mp3",
        "C5": "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        "A5": "A5.mp3",
        "C6": "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        "A6": "A6.mp3",
        "C7": "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        "A7": "A7.mp3",
        "C8": "C8.mp3"
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => {
        this.onLoaded();
      }
    }).connect(this.reverb);

    // Initialize Synth (Fallback / Other instruments)
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 }
    }).connect(this.reverb);

    this.isInitialized = true;
  }

  setInstrument(type: InstrumentType) {
    this.currentInstrument = type;
    
    if (type === 'grand-piano') {
      // Reset synth to a basic piano-like tone for fallback
      this.synth?.set({
        oscillator: { type: 'triangle' },
        envelope: { attack: 0.005, decay: 0.3, sustain: 0.1, release: 1 }
      });
      this.chorus.wet.value = 0;
      this.reverb.wet.value = 0.2;
    } else if (type === 'electric-piano') {
      // FM Synth style
      this.synth?.set({
        oscillator: { type: 'fmsine', modulationType: 'sine', modulationIndex: 3, harmonicity: 3.4 },
        envelope: { attack: 0.001, decay: 0.1, sustain: 0.1, release: 1.2 }
      });
      this.chorus.wet.value = 0.3;
      this.reverb.wet.value = 0.3;
    } else if (type === 'synth') {
      // Sawtooth lead
      this.synth?.set({
        oscillator: { type: 'sawtooth' },
        envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.5 }
      });
      this.chorus.wet.value = 0.1;
      this.reverb.wet.value = 0.4;
    }
  }

  triggerAttack(note: string) {
    if (!this.isInitialized) this.init();
    
    if (this.currentInstrument === 'grand-piano' && this.sampler?.loaded) {
      this.sampler.triggerAttack(note);
    } else {
      this.synth?.triggerAttack(note);
    }
  }

  triggerRelease(note: string) {
    if (this.currentInstrument === 'grand-piano' && this.sampler?.loaded) {
      this.sampler.triggerRelease(note);
    } else {
      this.synth?.triggerRelease(note);
    }
  }
}

const audioEngine = new AudioEngine();

// --- Components ---

interface KeyProps {
  note: string;
  octave: number;
  isBlack: boolean;
  isPressed: boolean;
  label?: string;
  onMouseDown: () => void;
  onMouseUp: () => void;
  onMouseEnter: () => void;
}

const PianoKey: React.FC<KeyProps> = ({ note, octave, isBlack, isPressed, label, onMouseDown, onMouseUp, onMouseEnter }) => {
  return (
    <div
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseEnter={onMouseEnter}
      className={`
        relative flex items-end justify-center pb-2 select-none cursor-pointer transition-transform duration-75 flex-shrink-0
        ${isBlack 
          ? 'z-10 w-8 h-24 -mx-4 rounded-b-md shadow-lg bg-gradient-to-b from-black to-gray-800 border-x border-b border-black' 
          : 'z-0 w-10 h-36 bg-white rounded-b-md shadow-md border border-gray-300 bg-gradient-to-b from-white to-gray-100'}
        ${isPressed ? (isBlack ? 'bg-gray-700 scale-[0.98] translate-y-1' : 'bg-gray-200 scale-[0.99] translate-y-1') : ''}
      `}
    >
      {/* Gloss/Reflection for Black Keys */}
      {isBlack && (
        <div className="absolute top-0 left-1 right-1 h-16 bg-gradient-to-b from-white/20 to-transparent rounded-b-sm pointer-events-none" />
      )}
      
      {/* Label */}
      <span className={`text-[8px] font-bold pointer-events-none ${isBlack ? 'text-gray-400 mb-1' : 'text-gray-400 mb-1'}`}>
        {label}
      </span>
    </div>
  );
};

export const Piano: React.FC = () => {
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [instrument, setInstrument] = useState<InstrumentType>('grand-piano');
  const [baseOctave, setBaseOctave] = useState(3); // C3 as start
  const [numOctaves, setNumOctaves] = useState(3);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMouseDown = useRef(false);

  // Initialize Audio Engine
  useEffect(() => {
    const initAudio = async () => {
      audioEngine.onLoaded = () => setIsLoaded(true);
      await audioEngine.init();
      // Check if already loaded (e.g. hot reload)
      // We can't easily check internal Tone.Sampler state without exposing it, 
      // but the callback handles the async load.
      // If using fallback synth, we are "loaded" immediately for practical purposes
      // but we want to show loading for samples.
    };
    const handleInteraction = () => {
       initAudio();
       window.removeEventListener('click', handleInteraction);
       window.removeEventListener('keydown', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  // Handle Instrument Change
  useEffect(() => {
    audioEngine.setInstrument(instrument);
  }, [instrument]);

  // Responsive Octave Count
  useEffect(() => {
    const updateOctaves = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        // Approx width of one octave (7 white keys * 40px = 280px)
        const octaveWidth = 280; 
        const possibleOctaves = Math.floor((width - 40) / octaveWidth); // -40 for padding/extra key
        setNumOctaves(Math.max(2, possibleOctaves));
      }
    };

    const observer = new ResizeObserver(updateOctaves);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    updateOctaves(); // Initial check

    return () => observer.disconnect();
  }, []);

  const playNote = useCallback((note: string, octave: number) => {
    const fullNote = `${note}${octave}`;
    audioEngine.triggerAttack(fullNote);
    setActiveNotes(prev => new Set(prev).add(fullNote));
  }, []);

  const stopNote = useCallback((note: string, octave: number) => {
    const fullNote = `${note}${octave}`;
    audioEngine.triggerRelease(fullNote);
    setActiveNotes(prev => {
      const next = new Set(prev);
      next.delete(fullNote);
      return next;
    });
  }, []);

  // Keyboard Mapping (FL Studio Style - 2 Tiers)
  useEffect(() => {
    // Tier 1 (Lower Octave): Z X C V B N M , . / (White) | S D G H J L ; (Black)
    // Tier 2 (Upper Octave): Q W E R T Y U I O P [ ] (White) | 2 3 5 6 7 9 0 = (Black)
    
    const keyMap: Record<string, { note: string, offset: number }> = {
      // Lower Octave (Base)
      'z': { note: 'C', offset: 0 },
      's': { note: 'C#', offset: 0 },
      'x': { note: 'D', offset: 0 },
      'd': { note: 'D#', offset: 0 },
      'c': { note: 'E', offset: 0 },
      'v': { note: 'F', offset: 0 },
      'g': { note: 'F#', offset: 0 },
      'b': { note: 'G', offset: 0 },
      'h': { note: 'G#', offset: 0 },
      'n': { note: 'A', offset: 0 },
      'j': { note: 'A#', offset: 0 },
      'm': { note: 'B', offset: 0 },
      ',': { note: 'C', offset: 1 }, // Overlap start
      'l': { note: 'C#', offset: 1 },
      '.': { note: 'D', offset: 1 },
      ';': { note: 'D#', offset: 1 },
      '/': { note: 'E', offset: 1 },

      // Upper Octave (Base + 1)
      'q': { note: 'C', offset: 1 },
      '2': { note: 'C#', offset: 1 },
      'w': { note: 'D', offset: 1 },
      '3': { note: 'D#', offset: 1 },
      'e': { note: 'E', offset: 1 },
      'r': { note: 'F', offset: 1 },
      '5': { note: 'F#', offset: 1 },
      't': { note: 'G', offset: 1 },
      '6': { note: 'G#', offset: 1 },
      'y': { note: 'A', offset: 1 },
      '7': { note: 'A#', offset: 1 },
      'u': { note: 'B', offset: 1 },
      'i': { note: 'C', offset: 2 },
      '9': { note: 'C#', offset: 2 },
      'o': { note: 'D', offset: 2 },
      '0': { note: 'D#', offset: 2 },
      'p': { note: 'E', offset: 2 },
      '[': { note: 'F', offset: 2 },
      '=': { note: 'F#', offset: 2 },
      ']': { note: 'G', offset: 2 },
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      
      // Octave Shifting (Shift Base)
      // Use Arrow Keys or specific keys if Z/X are taken? 
      // Z/X are now notes. Let's use Left/Right Arrows or Minus/Plus
      if (e.key === 'ArrowLeft' || e.key === '-') {
        setBaseOctave(prev => Math.max(1, prev - 1));
        return;
      }
      if (e.key === 'ArrowRight' || e.key === '=' || e.key === '+') {
        setBaseOctave(prev => Math.min(6, prev + 1));
        return;
      }

      const mapping = keyMap[e.key.toLowerCase()];
      if (mapping) {
        playNote(mapping.note, baseOctave + mapping.offset);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const mapping = keyMap[e.key.toLowerCase()];
      if (mapping) {
        stopNote(mapping.note, baseOctave + mapping.offset);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playNote, stopNote, baseOctave]);

  // Render Keys
  const renderOctave = (octaveIndex: number) => {
    const octave = baseOctave + octaveIndex;
    
    // Helper to get label
    const getLabel = (note: string) => {
      // Lower Octave
      if (octaveIndex === 0) {
        if (note === 'C') return 'Z';
        if (note === 'C#') return 'S';
        if (note === 'D') return 'X';
        if (note === 'D#') return 'D';
        if (note === 'E') return 'C';
        if (note === 'F') return 'V';
        if (note === 'F#') return 'G';
        if (note === 'G') return 'B';
        if (note === 'G#') return 'H';
        if (note === 'A') return 'N';
        if (note === 'A#') return 'J';
        if (note === 'B') return 'M';
      }
      // Upper Octave
      if (octaveIndex === 1) {
        if (note === 'C') return 'Q';
        if (note === 'C#') return '2';
        if (note === 'D') return 'W';
        if (note === 'D#') return '3';
        if (note === 'E') return 'E';
        if (note === 'F') return 'R';
        if (note === 'F#') return '5';
        if (note === 'G') return 'T';
        if (note === 'G#') return '6';
        if (note === 'A') return 'Y';
        if (note === 'A#') return '7';
        if (note === 'B') return 'U';
      }
      return '';
    };

    const notes = [
      { note: 'C', isBlack: false },
      { note: 'C#', isBlack: true },
      { note: 'D', isBlack: false },
      { note: 'D#', isBlack: true },
      { note: 'E', isBlack: false },
      { note: 'F', isBlack: false },
      { note: 'F#', isBlack: true },
      { note: 'G', isBlack: false },
      { note: 'G#', isBlack: true },
      { note: 'A', isBlack: false },
      { note: 'A#', isBlack: true },
      { note: 'B', isBlack: false },
    ];

    return notes.map((n) => (
      <PianoKey
        key={`${n.note}${octave}`}
        note={n.note}
        octave={octave}
        isBlack={n.isBlack}
        isPressed={activeNotes.has(`${n.note}${octave}`)}
        label={getLabel(n.note)}
        onMouseDown={() => playNote(n.note, octave)}
        onMouseUp={() => stopNote(n.note, octave)}
        onMouseEnter={() => {
          if (isMouseDown.current) playNote(n.note, octave);
        }}
      />
    ));
  };

  return (
    <div 
      className="flex flex-col items-center gap-6 p-8 bg-[#1e1e1e] rounded-xl shadow-2xl border-t-4 border-gray-800 select-none w-full h-full"
      onMouseDown={() => { isMouseDown.current = true; }}
      onMouseUp={() => { isMouseDown.current = false; }}
      onMouseLeave={() => { isMouseDown.current = false; }}
    >
      {/* Controls */}
      <div className="flex items-center gap-6 w-full px-4">
        <div className="flex items-center gap-2 bg-black/40 p-1 rounded-lg border border-gray-700">
           <button 
             onClick={() => setInstrument('grand-piano')}
             className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-2 ${instrument === 'grand-piano' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
           >
             Grand Piano
             {instrument === 'grand-piano' && !isLoaded && (
               <Loader2 size={12} className="animate-spin" />
             )}
           </button>
           <button 
             onClick={() => setInstrument('electric-piano')}
             className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${instrument === 'electric-piano' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
           >
             E-Piano
           </button>
           <button 
             onClick={() => setInstrument('synth')}
             className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${instrument === 'synth' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
           >
             Synth
           </button>
        </div>

        <div className="flex items-center gap-4 ml-auto">
           <div className="flex flex-col items-center">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Octave</span>
              <div className="flex items-center gap-2 bg-black/40 px-2 py-1 rounded border border-gray-700">
                 <button onClick={() => setBaseOctave(o => Math.max(1, o - 1))} className="text-gray-400 hover:text-white"><ChevronDown size={14} /></button>
                 <span className="text-orange-500 font-mono font-bold w-4 text-center">{baseOctave}</span>
                 <button onClick={() => setBaseOctave(o => Math.min(6, o + 1))} className="text-gray-400 hover:text-white"><ChevronUp size={14} /></button>
              </div>
           </div>
        </div>
      </div>

      {/* Keyboard Container */}
      <div 
        ref={containerRef}
        className="relative flex-1 w-full flex items-center justify-center bg-black rounded-lg shadow-inner border border-gray-700 overflow-hidden"
      >
        {/* Felt Strip */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-red-900/50 z-0" />
        
        <div className="flex relative z-10">
          {[...Array(numOctaves)].map((_, i) => (
            <React.Fragment key={i}>
              {renderOctave(i)}
            </React.Fragment>
          ))}
          
          {/* One extra C for closure */}
          <PianoKey
             note="C"
             octave={baseOctave + numOctaves}
             isBlack={false}
             isPressed={activeNotes.has(`C${baseOctave + numOctaves}`)}
             label={numOctaves === 2 ? 'I' : ''} // 'I' is mapped to C(base+2)
             onMouseDown={() => playNote('C', baseOctave + numOctaves)}
             onMouseUp={() => stopNote('C', baseOctave + numOctaves)}
             onMouseEnter={() => { if (isMouseDown.current) playNote('C', baseOctave + numOctaves); }}
          />
        </div>
      </div>
      
      <div className="flex gap-8 text-xs text-gray-500 font-medium">
         <span><strong className="text-gray-300">← / →</strong> to shift octave</span>
         <span><strong className="text-gray-300">Z-M</strong> Lower Octave</span>
         <span><strong className="text-gray-300">Q-P</strong> Upper Octave</span>
      </div>
    </div>
  );
};
