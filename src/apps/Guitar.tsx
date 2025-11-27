import { useState, useMemo } from 'react';
import { Music, Grid, List, Filter } from 'lucide-react';

// --- Data Structures ---

type Note = string;

type Chord = {
  name: string;
  key: string; // Root note (e.g., "C", "F#")
  suffix: string; // Quality (e.g., "Major", "m", "7")
  frets: number[]; // -1 for mute, 0 for open, >0 for fret
  fingers: number[]; // 0 for open/mute, 1-4 for fingers
};

type Scale = {
  name: string;
  notes: Note[];
  pattern: string; // Description of the pattern (e.g., "Mi-shape")
};

const NOTES: Note[] = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const STRINGS = ['E', 'B', 'G', 'D', 'A', 'E']; // High E to Low E (indices 0-5)

// Helper to get note at specific string/fret
const getNoteAt = (stringIndex: number, fret: number): Note => {
  if (fret === -1) return '';
  const openNote = STRINGS[stringIndex];
  const openNoteIndex = NOTES.indexOf(openNote);
  return NOTES[(openNoteIndex + fret) % 12];
};

// Helper to get all notes in a chord
const getChordNotes = (chord: Chord): Note[] => {
  const notes = new Set<Note>();
  chord.frets.forEach((fret, stringIndex) => {
    if (fret !== -1) {
      notes.add(getNoteAt(stringIndex, fret));
    }
  });
  // Sort notes starting from root if possible, or just standard order
  // For simplicity, let's return unique notes
  return Array.from(notes);
};

const CHORDS: Chord[] = [
  // C Chords
  { name: 'C Major', key: 'C', suffix: 'Major', frets: [0, 1, 0, 2, 3, -1], fingers: [0, 1, 0, 2, 3, 0] }, // Open
  { name: 'C Major (Barre)', key: 'C', suffix: 'Major', frets: [3, 5, 5, 5, 3, -1], fingers: [1, 3, 3, 3, 1, 0] }, // A-shape barre at 3rd
  { name: 'C Major (Barre 8)', key: 'C', suffix: 'Major', frets: [8, 8, 9, 10, 10, 8], fingers: [1, 1, 2, 4, 3, 1] }, // E-shape barre at 8th
  { name: 'Cm', key: 'C', suffix: 'Minor', frets: [3, 4, 5, 5, 3, -1], fingers: [1, 2, 4, 3, 1, 0] }, // Am-shape barre at 3rd
  { name: 'C7', key: 'C', suffix: '7', frets: [0, 1, 3, 2, 3, -1], fingers: [0, 1, 4, 2, 3, 0] },

  // D Chords
  { name: 'D Major', key: 'D', suffix: 'Major', frets: [2, 3, 2, 0, -1, -1], fingers: [2, 3, 1, 0, 0, 0] },
  { name: 'D Major (Barre)', key: 'D', suffix: 'Major', frets: [5, 7, 7, 7, 5, -1], fingers: [1, 3, 3, 3, 1, 0] },
  { name: 'Dm', key: 'D', suffix: 'Minor', frets: [1, 3, 2, 0, -1, -1], fingers: [1, 3, 2, 0, 0, 0] },
  { name: 'Dm (Barre)', key: 'D', suffix: 'Minor', frets: [5, 6, 7, 7, 5, -1], fingers: [1, 2, 4, 3, 1, 0] },
  { name: 'D7', key: 'D', suffix: '7', frets: [2, 1, 2, 0, -1, -1], fingers: [3, 1, 2, 0, 0, 0] },

  // E Chords
  { name: 'E Major', key: 'E', suffix: 'Major', frets: [0, 0, 1, 2, 2, 0], fingers: [0, 0, 1, 3, 2, 0] },
  { name: 'E Major (Barre)', key: 'E', suffix: 'Major', frets: [7, 9, 9, 9, 7, -1], fingers: [1, 3, 3, 3, 1, 0] },
  { name: 'Em', key: 'E', suffix: 'Minor', frets: [0, 0, 0, 2, 2, 0], fingers: [0, 0, 0, 3, 2, 0] },
  { name: 'Em (Barre)', key: 'E', suffix: 'Minor', frets: [7, 8, 9, 9, 7, -1], fingers: [1, 2, 4, 3, 1, 0] },
  { name: 'E7', key: 'E', suffix: '7', frets: [0, 3, 1, 0, 2, 0], fingers: [0, 4, 1, 0, 2, 0] },

  // F Chords
  { name: 'F Major', key: 'F', suffix: 'Major', frets: [1, 1, 2, 3, 3, 1], fingers: [1, 1, 2, 4, 3, 1] },
  { name: 'Fm', key: 'F', suffix: 'Minor', frets: [1, 1, 1, 3, 3, 1], fingers: [1, 1, 1, 4, 3, 1] },
  { name: 'F7', key: 'F', suffix: '7', frets: [1, 1, 2, 1, 3, 1], fingers: [1, 1, 2, 1, 3, 1] },

  // G Chords
  { name: 'G Major', key: 'G', suffix: 'Major', frets: [3, 0, 0, 0, 2, 3], fingers: [4, 0, 0, 0, 1, 2] },
  { name: 'G Major (Barre)', key: 'G', suffix: 'Major', frets: [3, 3, 4, 5, 5, 3], fingers: [1, 1, 2, 4, 3, 1] },
  { name: 'Gm', key: 'G', suffix: 'Minor', frets: [3, 3, 3, 5, 5, 3], fingers: [1, 1, 1, 4, 3, 1] },
  { name: 'G7', key: 'G', suffix: '7', frets: [1, 0, 0, 0, 2, 3], fingers: [1, 0, 0, 0, 2, 3] },

  // A Chords
  { name: 'A Major', key: 'A', suffix: 'Major', frets: [0, 2, 2, 2, 0, -1], fingers: [0, 3, 2, 1, 0, 0] },
  { name: 'A Major (Barre)', key: 'A', suffix: 'Major', frets: [5, 5, 6, 7, 7, 5], fingers: [1, 1, 2, 4, 3, 1] },
  { name: 'Am', key: 'A', suffix: 'Minor', frets: [0, 1, 2, 2, 0, -1], fingers: [0, 1, 3, 2, 0, 0] },
  { name: 'Am (Barre)', key: 'A', suffix: 'Minor', frets: [5, 5, 5, 7, 7, 5], fingers: [1, 1, 1, 4, 3, 1] },
  { name: 'A7', key: 'A', suffix: '7', frets: [0, 2, 0, 2, 0, -1], fingers: [0, 2, 0, 1, 0, 0] },

  // B Chords
  { name: 'B Major', key: 'B', suffix: 'Major', frets: [2, 4, 4, 4, 2, -1], fingers: [1, 3, 3, 3, 1, 0] },
  { name: 'Bm', key: 'B', suffix: 'Minor', frets: [2, 3, 4, 4, 2, -1], fingers: [1, 2, 4, 3, 1, 0] },
  { name: 'B7', key: 'B', suffix: '7', frets: [2, 0, 2, 1, 2, -1], fingers: [4, 0, 3, 1, 2, 0] },
];

const SCALES: Scale[] = [
  { name: 'C Major (Mi Shape)', notes: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], pattern: 'Mi Shape (Pattern 1)' },
  { name: 'A Minor Pentatonic (La Shape)', notes: ['A', 'C', 'D', 'E', 'G'], pattern: 'La Shape (Pattern 1)' },
  { name: 'G Major (Sol Shape)', notes: ['G', 'A', 'B', 'C', 'D', 'E', 'F#'], pattern: 'Sol Shape' },
];

// --- Components ---

const Fretboard = ({ showNotes = true, highlightNotes = [] as string[] }) => {
  const frets = 12;

  return (
    <div className="w-full overflow-x-auto p-4 bg-[#2c2c2c] rounded-lg shadow-inner border border-gray-700">
      <div className="relative min-w-[800px] select-none">
        {/* Frets */}
        <div className="flex border-b-4 border-gray-400">
           <div className="w-12 border-r-4 border-gray-500 bg-[#3a3a3a] flex items-center justify-center text-gray-400 text-xs font-bold">Nut</div>
           {[...Array(frets)].map((_, i) => (
             <div key={i} className="flex-1 h-8 border-r-2 border-gray-500 flex items-center justify-center relative">
                <span className="absolute -top-6 text-gray-500 text-xs">{i + 1}</span>
                {[3, 5, 7, 9].includes(i + 1) && <div className="w-3 h-3 rounded-full bg-gray-600/50" />}
                {[12].includes(i + 1) && (
                  <div className="flex gap-1">
                    <div className="w-3 h-3 rounded-full bg-gray-600/50" />
                    <div className="w-3 h-3 rounded-full bg-gray-600/50" />
                  </div>
                )}
             </div>
           ))}
        </div>

        {/* Strings */}
        <div className="relative">
          {STRINGS.map((string, stringIndex) => (
            <div key={stringIndex} className="flex h-10 items-center relative">
              {/* String Line */}
              <div 
                className="absolute left-0 right-0 bg-[#e0c090] shadow-sm z-0" 
                style={{ height: `${Math.max(1, 4 - stringIndex * 0.5)}px`, top: '50%', transform: 'translateY(-50%)' }} 
              />
              
              {/* Nut Note */}
              <div className="w-12 flex-shrink-0 z-10 flex items-center justify-center bg-[#2c2c2c] h-full border-r-4 border-gray-500">
                 <span className={`text-sm font-bold ${highlightNotes.includes(string) ? 'text-yellow-400' : 'text-gray-400'}`}>{string}</span>
              </div>

              {/* Fret Notes */}
              {[...Array(frets)].map((_, fretIndex) => {
                const note = getNoteAt(stringIndex, fretIndex + 1);
                const isHighlighted = highlightNotes.includes(note);
                return (
                  <div key={fretIndex} className="flex-1 flex items-center justify-center z-10 border-r-2 border-gray-500/30 h-full">
                    {(showNotes || isHighlighted) && (
                      <div className={`
                        w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all
                        ${isHighlighted 
                          ? 'bg-yellow-500 text-black scale-110 ring-2 ring-yellow-200' 
                          : 'bg-gray-700 text-gray-300 opacity-60 hover:opacity-100'}
                      `}>
                        {note}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ChordCard = ({ chord }: { chord: Chord }) => {
  // Calculate necessary frets
  const maxFret = Math.max(...chord.frets.filter(f => f > 0), 0);
  const minFret = Math.min(...chord.frets.filter(f => f > 0));
  
  // Determine start fret (for higher voicings)
  const startFret = maxFret > 4 ? minFret : 1;
  const numFrets = Math.max(4, maxFret - startFret + 1); // Show at least 4 frets
  
  // SVG Dimensions
  const width = 140;
  const height = 120 + (numFrets * 22);
  const margin = { top: 40, right: 25, bottom: 30, left: 25 };
  const gridWidth = width - margin.left - margin.right;
  const gridHeight = height - margin.top - margin.bottom;
  
  const numStrings = 6;
  
  const stringSpacing = gridWidth / (numStrings - 1);
  const fretSpacing = gridHeight / numFrets;

  const notes = getChordNotes(chord);

  return (
    <div className="bg-white dark:bg-[#1e1e1e] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col items-center gap-3 hover:shadow-md transition-shadow">
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{chord.name}</h3>
        <div className="flex gap-1 justify-center mt-1">
            {notes.map((note, i) => (
                <span key={i} className="text-xs font-medium px-1.5 py-0.5 bg-gray-100 dark:bg-[#2a2a2a] rounded text-gray-600 dark:text-gray-400">
                    {note}
                </span>
            ))}
        </div>
      </div>
      
      <div className="relative bg-white p-2 rounded">
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Fret Numbers if shifted */}
          {startFret > 1 && (
             <text x={margin.left - 8} y={margin.top + fretSpacing / 2 + 4} fontSize="10" fontWeight="bold" textAnchor="end" fill="#333">
                {startFret}fr
             </text>
          )}

          {/* Frets (Horizontal Lines) */}
          {[...Array(numFrets + 1)].map((_, i) => {
            const y = margin.top + i * fretSpacing;
            return (
              <line 
                key={`fret-${i}`}
                x1={margin.left} 
                y1={y} 
                x2={width - margin.right} 
                y2={y} 
                stroke="#333" 
                strokeWidth={i === 0 && startFret === 1 ? 4 : 1} // Nut is thicker only if starting at 1
              />
            );
          })}

          {/* Strings (Vertical Lines) */}
          {[...Array(numStrings)].map((_, i) => {
            const x = margin.left + i * stringSpacing;
            return (
              <line 
                key={`string-${i}`}
                x1={x} 
                y1={margin.top} 
                x2={x} 
                y2={height - margin.bottom} 
                stroke="#333" 
                strokeWidth={1} 
              />
            );
          })}

          {/* Dots and Indicators */}
          {chord.frets.map((fret, i) => {
            const stringIndex = 5 - i; // Map array index to visual string index (0=Left/LowE)
            const x = margin.left + stringIndex * stringSpacing;

            if (fret === -1) {
              // Mute (x)
              return (
                <text 
                  key={`mute-${i}`} 
                  x={x} 
                  y={margin.top - 8} 
                  textAnchor="middle" 
                  fontSize="12" 
                  fill="#666"
                  fontWeight="bold"
                >
                  x
                </text>
              );
            } else if (fret === 0) {
              // Open (o) - Only if startFret is 1
              if (startFret === 1) {
                  return (
                    <text 
                      key={`open-${i}`} 
                      x={x} 
                      y={margin.top - 8} 
                      textAnchor="middle" 
                      fontSize="12" 
                      fill="#666"
                      fontWeight="bold"
                    >
                      o
                    </text>
                  );
              }
            } 
            
            if (fret > 0) {
              // Fretted Note
              // Adjust fret position based on startFret
              const relativeFret = fret - startFret + 1;
              if (relativeFret >= 1 && relativeFret <= numFrets) {
                  const y = margin.top + (relativeFret - 0.5) * fretSpacing;
                  return (
                    <g key={`note-${i}`}>
                      <circle cx={x} cy={y} r={7} fill="black" />
                      {chord.fingers[i] > 0 && (
                        <text 
                          x={x} 
                          y={y + 3} 
                          textAnchor="middle" 
                          fontSize="10" 
                          fill="white" 
                          fontWeight="bold"
                        >
                          {chord.fingers[i]}
                        </text>
                      )}
                    </g>
                  );
              }
            }
            return null;
          })}
        </svg>
      </div>
    </div>
  );
};

export const Guitar = () => {
  const [activeTab, setActiveTab] = useState<'chords' | 'scales' | 'fretboard'>('chords');
  const [selectedScale, setSelectedScale] = useState<Scale>(SCALES[0]);
  
  // Filters
  const [selectedKey, setSelectedKey] = useState<string>('All');
  const [selectedSuffix, setSelectedSuffix] = useState<string>('All');

  const keys = ['All', ...Array.from(new Set(CHORDS.map(c => c.key))).sort()];
  const suffixes = ['All', ...Array.from(new Set(CHORDS.map(c => c.suffix))).sort()];

  const filteredChords = useMemo(() => {
    return CHORDS.filter(chord => {
        const keyMatch = selectedKey === 'All' || chord.key === selectedKey;
        const suffixMatch = selectedSuffix === 'All' || chord.suffix === selectedSuffix;
        return keyMatch && suffixMatch;
    });
  }, [selectedKey, selectedSuffix]);

  return (
    <div className="h-full w-full bg-gray-50 dark:bg-[#121212] flex flex-col text-gray-900 dark:text-gray-100">
      {/* Header */}
      <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 justify-between bg-white dark:bg-[#1a1a1a]">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                <Music size={18} />
            </div>
            <h1 className="font-bold text-lg">Guitar Pro</h1>
        </div>
        <div className="flex bg-gray-100 dark:bg-[#2a2a2a] p-1 rounded-lg">
            {[
                { id: 'chords', label: 'Chords', icon: Grid },
                { id: 'scales', label: 'Scales', icon: List },
                { id: 'fretboard', label: 'Fretboard', icon: Music },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                        px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all
                        ${activeTab === tab.id 
                            ? 'bg-white dark:bg-[#3a3a3a] shadow-sm text-orange-600 dark:text-orange-400' 
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}
                    `}
                >
                    <tab.icon size={14} />
                    {tab.label}
                </button>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'chords' && (
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold">Chord Library</h2>
                        <span className="text-sm text-gray-500">Explore chords by key and type</span>
                    </div>
                    
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                            <Filter size={14} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-500">Key:</span>
                            <select 
                                value={selectedKey}
                                onChange={(e) => setSelectedKey(e.target.value)}
                                className="bg-transparent outline-none text-sm font-bold min-w-[40px]"
                            >
                                {keys.map(k => <option key={k} value={k}>{k}</option>)}
                            </select>
                        </div>
                        
                        <div className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                            <Filter size={14} className="text-gray-400" />
                            <span className="text-sm font-medium text-gray-500">Type:</span>
                            <select 
                                value={selectedSuffix}
                                onChange={(e) => setSelectedSuffix(e.target.value)}
                                className="bg-transparent outline-none text-sm font-bold min-w-[60px]"
                            >
                                {suffixes.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {filteredChords.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                        <Music size={48} className="mb-4 opacity-20" />
                        <p>No chords found for this combination.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {filteredChords.map((chord, i) => (
                            <ChordCard key={`${chord.name}-${i}`} chord={chord} />
                        ))}
                    </div>
                )}
            </div>
        )}

        {activeTab === 'scales' && (
            <div className="space-y-6 h-full flex flex-col">
                 <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Scale Patterns</h2>
                    <select 
                        value={selectedScale.name}
                        onChange={(e) => setSelectedScale(SCALES.find(s => s.name === e.target.value) || SCALES[0])}
                        className="bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
                    >
                        {SCALES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                    </select>
                </div>
                
                <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex-1 flex flex-col gap-6">
                    <div>
                        <h3 className="text-lg font-bold text-orange-500">{selectedScale.name}</h3>
                        <p className="text-gray-500">{selectedScale.pattern} • Notes: {selectedScale.notes.join(', ')}</p>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <Fretboard showNotes={true} highlightNotes={selectedScale.notes} />
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'fretboard' && (
            <div className="space-y-6 h-full flex flex-col">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Full Fretboard</h2>
                    <span className="text-sm text-gray-500">Reference for all notes</span>
                </div>
                <div className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl border border-gray-200 dark:border-gray-800 flex-1 flex items-center justify-center">
                    <Fretboard showNotes={true} />
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
