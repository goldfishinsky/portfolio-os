export interface Point {
  x: number;
  y: number;
}

export interface PathSegment {
  type: 'straight' | 'bezier';
  end: Point;
  control1?: Point; // For bezier
  control2?: Point; // For bezier
  duration: number; // Seconds for this segment
  delay?: number; // Wait before starting this segment
  signals?: 'left' | 'right' | 'none'; // Signal state during this segment
}

export interface CarConfig {
  id: string;
  start: Point;
  rotation: number; // Initial rotation in degrees
  color: string;
  path: PathSegment[];
}

export interface ScenarioConfig {
  id: string;
  title: string;
  description: string;
  type: 'intersection' | 'roundabout' | 'highway' | 'parking' | 'generic' | 'cul-de-sac';
  cars: CarConfig[];
  roadMarkings?: 'dashed' | 'solid' | 'double-solid' | 'none';
}

export interface Topic {
  id: string;
  title: string;
  content: string;
  scenario?: ScenarioConfig;
  tips?: string[];
  warnings?: string[];
}

export interface Category {
  id: string;
  title: string;
  topics: Topic[];
}

export const drivingData: Category[] = [
  {
    id: 'turns',
    title: 'Turns & Intersections',
    topics: [
      {
        id: 'right-turn-red',
        title: 'Right Turn on Red',
        content: 'Unless prohibited by a sign, you may turn right on a red light after coming to a complete stop. You must yield to all cross traffic and pedestrians.',
        tips: ['Stop completely behind the line.', 'Creep forward to check visibility.', 'Turn only when safe.'],
        scenario: {
          id: 'right-red-sim',
          title: 'Right Turn on Red',
          description: 'Blue car stops, checks, and turns when safe.',
          type: 'intersection',
          cars: [
            {
              id: 'car-turning',
              start: { x: -40, y: 150 },
              rotation: 0,
              color: '#3b82f6',
              path: [
                { type: 'straight', end: { x: -40, y: 50 }, duration: 1.5, signals: 'right' }, // Approach stop
                { type: 'straight', end: { x: -40, y: 50 }, duration: 1.5, delay: 0, signals: 'right' }, // STOP
                { type: 'straight', end: { x: -40, y: 40 }, duration: 1, signals: 'right' }, // Creep
                { 
                  type: 'bezier', 
                  end: { x: 50, y: -40 }, 
                  control1: { x: -40, y: -20 }, 
                  control2: { x: 0, y: -40 }, 
                  duration: 2,
                  signals: 'right'
                }, // Turn
                { type: 'straight', end: { x: 200, y: -40 }, duration: 2, signals: 'none' } // Drive away
              ]
            },
            {
              id: 'car-cross',
              start: { x: -200, y: -80 },
              rotation: 90,
              color: '#ef4444',
              path: [
                { type: 'straight', end: { x: 200, y: -80 }, duration: 3, signals: 'none' }
              ]
            }
          ]
        }
      },
      {
        id: 'left-turn-unprotected',
        title: 'Unprotected Left Turn',
        content: 'At a green light without an arrow, you must yield to oncoming traffic. Move into the intersection (establish yourself) and wait for a gap or the yellow light to clear the intersection.',
        scenario: {
          id: 'left-unprotected-sim',
          title: 'S-Turn Positioning',
          description: 'Blue car enters intersection, waits for Red car, then turns.',
          type: 'intersection',
          cars: [
            {
              id: 'car-left',
              start: { x: -40, y: 150 },
              rotation: 0,
              color: '#3b82f6',
              path: [
                { type: 'straight', end: { x: -40, y: 50 }, duration: 1.5, signals: 'left' }, // Approach
                { type: 'straight', end: { x: -20, y: 10 }, duration: 1.5, signals: 'left' }, // Establish (S-turn)
                { type: 'straight', end: { x: -20, y: 10 }, duration: 1.5, signals: 'left' }, // Wait
                { 
                  type: 'bezier', 
                  end: { x: -150, y: -40 }, 
                  control1: { x: -20, y: -40 }, 
                  control2: { x: -60, y: -40 }, 
                  duration: 2,
                  signals: 'left'
                } // Turn
              ]
            },
            {
              id: 'car-oncoming',
              start: { x: 40, y: -200 },
              rotation: 180,
              color: '#ef4444',
              path: [
                { type: 'straight', end: { x: 40, y: 200 }, duration: 3, delay: 1, signals: 'none' }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'maneuvers',
    title: 'Complex Maneuvers',
    topics: [
      {
        id: 'cul-de-sac',
        title: 'Cul-de-sac U-Turn',
        content: 'Drive along the right side of the curve. Do not cut straight across the middle.',
        scenario: {
          id: 'culdesac-sim',
          title: 'Proper Cul-de-sac Path',
          description: 'Follow the curb around the outside.',
          type: 'cul-de-sac',
          cars: [
            {
              id: 'car-u',
              start: { x: 40, y: 150 },
              rotation: 0,
              color: '#3b82f6',
              path: [
                { type: 'straight', end: { x: 40, y: 50 }, duration: 1.5, signals: 'none' },
                { 
                  type: 'bezier', 
                  end: { x: -40, y: 50 }, 
                  control1: { x: 40, y: -100 }, 
                  control2: { x: -40, y: -100 }, 
                  duration: 4,
                  signals: 'none'
                }, // U-turn
                { type: 'straight', end: { x: -40, y: 150 }, duration: 1.5, signals: 'none' }
              ]
            }
          ]
        }
      },
      {
        id: 'backing-up',
        title: 'Backing Up',
        content: 'When backing up, turn your body to look out the rear window. Do not rely only on mirrors. Back up slowly.',
        scenario: {
          id: 'backup-sim',
          title: 'Straight Line Backing',
          description: 'Reversing straight along the curb.',
          type: 'generic',
          cars: [
            {
              id: 'car-reverse',
              start: { x: 0, y: -100 },
              rotation: 0,
              color: '#3b82f6',
              path: [
                { type: 'straight', end: { x: 0, y: 100 }, duration: 4, signals: 'none' } // Reverse
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'zones',
    title: 'Special Zones',
    topics: [
      {
        id: 'school-zone',
        title: 'School Zone',
        content: 'Speed limit is 30km/h between 8am-5pm on school days. Watch for children.',
        warnings: ['Fines for speeding in school zones are doubled.']
      },
      {
        id: 'playground-zone',
        title: 'Playground Zone',
        content: 'Speed limit is 30km/h from dawn to dusk every day.',
      }
    ]
  }
];
