// ── Creature Database ───────────────────────────────────────
// Features: [teeth, speed, size, eyePosition]
// teeth: 0.1=flat/grinding → 0.9=sharp/fangs
// speed: 0.1=slow → 0.9=fast  
// size: 0.1=small → 0.9=large
// eyePosition: 0.1=side-facing(prey) → 0.9=front-facing(predator)
// target: 1=carnivore, 0=herbivore

export const CREATURES = [
  {
    id: 'wolf',
    name: 'Shadow Wolf',
    emoji: '🐺',
    inputs: [0.85, 0.80, 0.60, 0.90],
    target: 1,
    desc: 'Sharp fangs, fast hunter, medium-large, forward eyes',
    features: { teeth: 'Sharp fangs', speed: 'Very fast', size: 'Medium-large', eyes: 'Front-facing' },
  },
  {
    id: 'cow',
    name: 'Iron Ox',
    emoji: '🐄',
    inputs: [0.15, 0.20, 0.85, 0.15],
    target: 0,
    desc: 'Flat molars, slow, very large, side-facing eyes',
    features: { teeth: 'Flat molars', speed: 'Slow', size: 'Very large', eyes: 'Side-facing' },
  },
  {
    id: 'hawk',
    name: 'Storm Hawk',
    emoji: '🦅',
    inputs: [0.80, 0.90, 0.25, 0.85],
    target: 1,
    desc: 'Sharp beak/talons, extremely fast, small, forward eyes',
    features: { teeth: 'Sharp beak', speed: 'Extremely fast', size: 'Small', eyes: 'Front-facing' },
  },
  {
    id: 'rabbit',
    name: 'Dust Rabbit',
    emoji: '🐇',
    inputs: [0.10, 0.75, 0.15, 0.20],
    target: 0,
    desc: 'Flat teeth, fast (to escape), very small, side-facing eyes',
    features: { teeth: 'Flat teeth', speed: 'Fast', size: 'Very small', eyes: 'Side-facing' },
  },
  {
    id: 'tiger',
    name: 'Phantom Tiger',
    emoji: '🐯',
    inputs: [0.95, 0.85, 0.80, 0.90],
    target: 1,
    desc: 'Razor fangs, fast, large, forward eyes',
    features: { teeth: 'Razor fangs', speed: 'Very fast', size: 'Large', eyes: 'Front-facing' },
  },
  {
    id: 'deer',
    name: 'Mist Deer',
    emoji: '🦌',
    inputs: [0.10, 0.70, 0.55, 0.15],
    target: 0,
    desc: 'No sharp teeth, fast (to flee), medium, side-facing eyes',
    features: { teeth: 'No fangs', speed: 'Fast', size: 'Medium', eyes: 'Side-facing' },
  },
  {
    id: 'snake',
    name: 'Venom Serpent',
    emoji: '🐍',
    inputs: [0.90, 0.50, 0.10, 0.80],
    target: 1,
    desc: 'Venomous fangs, moderate speed, very small, forward eyes',
    features: { teeth: 'Venom fangs', speed: 'Moderate', size: 'Very small', eyes: 'Front-facing' },
  },
  {
    id: 'elephant',
    name: 'Thunder Elephant',
    emoji: '🐘',
    inputs: [0.10, 0.15, 0.95, 0.20],
    target: 0,
    desc: 'Flat molars, slow, massive, side-facing eyes',
    features: { teeth: 'Flat molars', speed: 'Slow', size: 'Massive', eyes: 'Side-facing' },
  },
];

export const FEATURE_NAMES = ['Teeth', 'Speed', 'Size', 'Eye Position'];
export const FEATURE_DESCRIPTIONS = [
  'Flat/grinding → Sharp/fangs',
  'Slow → Fast',
  'Small → Large',
  'Side-facing (prey) → Front-facing (predator)',
];

// ── Pixel Grid Shapes for Stage 1 ──────────────────────────
// 5x5 grids. 1 = filled, 0 = empty
export const PIXEL_SHAPES = [
  {
    name: 'Circle',
    label: 'O',
    grid: [
      [0,1,1,1,0],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [0,1,1,1,0],
    ],
  },
  {
    name: 'Square',
    label: '□',
    grid: [
      [1,1,1,1,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,0,0,0,1],
      [1,1,1,1,1],
    ],
  },
  {
    name: 'Triangle',
    label: '△',
    grid: [
      [0,0,1,0,0],
      [0,1,0,1,0],
      [0,1,0,1,0],
      [1,0,0,0,1],
      [1,1,1,1,1],
    ],
  },
  {
    name: 'X',
    label: 'X',
    grid: [
      [1,0,0,0,1],
      [0,1,0,1,0],
      [0,0,1,0,0],
      [0,1,0,1,0],
      [1,0,0,0,1],
    ],
  },
  {
    name: 'Arrow',
    label: '→',
    grid: [
      [0,0,1,0,0],
      [0,0,0,1,0],
      [1,1,1,1,1],
      [0,0,0,1,0],
      [0,0,1,0,0],
    ],
  },
];

// Generate a mask that hides certain pixels
export function createMask(gridSize, visibleCount) {
  const total = gridSize * gridSize;
  const indices = Array.from({ length: total }, (_, i) => i);
  // Shuffle
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const visible = new Set(indices.slice(0, visibleCount));
  return visible;
}

// Get top half mask
export function topHalfMask(gridSize) {
  const visible = new Set();
  for (let r = 0; r < Math.ceil(gridSize / 2); r++) {
    for (let c = 0; c < gridSize; c++) {
      visible.add(r * gridSize + c);
    }
  }
  return visible;
}

// Get bottom half mask
export function bottomHalfMask(gridSize) {
  const visible = new Set();
  for (let r = Math.ceil(gridSize / 2); r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      visible.add(r * gridSize + c);
    }
  }
  return visible;
}
