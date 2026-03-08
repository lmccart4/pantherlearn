// Pre-computed word data with 2D coordinates and 3D vectors
// Coordinates are in [0,1] range for plotting
// Vectors are simplified 3-dimensional for teaching purposes

export const WORD_DATABASE = {
  // ── Animals ──────────────────────────────────────────
  dog:      { x: 0.82, y: 0.75, category: 'animal',  vec: [0.91, 0.12, 0.85] },
  cat:      { x: 0.78, y: 0.72, category: 'animal',  vec: [0.88, 0.10, 0.82] },
  fish:     { x: 0.70, y: 0.68, category: 'animal',  vec: [0.80, 0.08, 0.45] },
  bird:     { x: 0.74, y: 0.80, category: 'animal',  vec: [0.84, 0.09, 0.60] },
  horse:    { x: 0.85, y: 0.70, category: 'animal',  vec: [0.90, 0.11, 0.70] },
  snake:    { x: 0.65, y: 0.62, category: 'animal',  vec: [0.75, 0.07, 0.20] },
  elephant: { x: 0.88, y: 0.65, category: 'animal',  vec: [0.93, 0.14, 0.55] },
  puppy:    { x: 0.81, y: 0.77, category: 'animal',  vec: [0.90, 0.13, 0.90] },
  kitten:   { x: 0.79, y: 0.74, category: 'animal',  vec: [0.87, 0.11, 0.88] },
  hamster:  { x: 0.76, y: 0.73, category: 'animal',  vec: [0.86, 0.10, 0.86] },
  rabbit:   { x: 0.77, y: 0.76, category: 'animal',  vec: [0.85, 0.10, 0.84] },
  wolf:     { x: 0.80, y: 0.60, category: 'animal',  vec: [0.89, 0.15, 0.30] },
  lion:     { x: 0.83, y: 0.58, category: 'animal',  vec: [0.92, 0.16, 0.25] },
  tiger:    { x: 0.84, y: 0.57, category: 'animal',  vec: [0.91, 0.15, 0.22] },
  bear:     { x: 0.86, y: 0.62, category: 'animal',  vec: [0.92, 0.14, 0.40] },
  penguin:  { x: 0.72, y: 0.78, category: 'animal',  vec: [0.82, 0.08, 0.65] },
  dolphin:  { x: 0.71, y: 0.70, category: 'animal',  vec: [0.81, 0.09, 0.55] },
  shark:    { x: 0.68, y: 0.55, category: 'animal',  vec: [0.78, 0.10, 0.15] },

  // ── Vehicles ─────────────────────────────────────────
  car:        { x: 0.20, y: 0.30, category: 'vehicle', vec: [0.10, 0.85, 0.15] },
  bicycle:    { x: 0.25, y: 0.38, category: 'vehicle', vec: [0.12, 0.78, 0.20] },
  airplane:   { x: 0.15, y: 0.22, category: 'vehicle', vec: [0.08, 0.92, 0.10] },
  bus:        { x: 0.22, y: 0.28, category: 'vehicle', vec: [0.11, 0.88, 0.12] },
  train:      { x: 0.18, y: 0.25, category: 'vehicle', vec: [0.09, 0.90, 0.11] },
  motorcycle: { x: 0.23, y: 0.33, category: 'vehicle', vec: [0.11, 0.82, 0.18] },
  truck:      { x: 0.21, y: 0.27, category: 'vehicle', vec: [0.10, 0.87, 0.13] },
  skateboard: { x: 0.28, y: 0.42, category: 'vehicle', vec: [0.14, 0.72, 0.25] },
  helicopter: { x: 0.16, y: 0.20, category: 'vehicle', vec: [0.08, 0.91, 0.09] },
  boat:       { x: 0.19, y: 0.32, category: 'vehicle', vec: [0.10, 0.84, 0.16] },
  rocket:     { x: 0.13, y: 0.18, category: 'vehicle', vec: [0.07, 0.95, 0.08] },
  scooter:    { x: 0.26, y: 0.36, category: 'vehicle', vec: [0.13, 0.76, 0.22] },

  // ── Emotions ─────────────────────────────────────────
  happy:    { x: 0.45, y: 0.88, category: 'emotion', vec: [0.50, 0.50, 0.92] },
  sad:      { x: 0.42, y: 0.15, category: 'emotion', vec: [0.48, 0.48, 0.10] },
  angry:    { x: 0.38, y: 0.12, category: 'emotion', vec: [0.45, 0.52, 0.08] },
  excited:  { x: 0.48, y: 0.90, category: 'emotion', vec: [0.52, 0.48, 0.95] },
  scared:   { x: 0.35, y: 0.18, category: 'emotion', vec: [0.42, 0.55, 0.15] },
  joyful:   { x: 0.47, y: 0.89, category: 'emotion', vec: [0.51, 0.49, 0.93] },
  calm:     { x: 0.50, y: 0.60, category: 'emotion', vec: [0.52, 0.45, 0.65] },
  nervous:  { x: 0.37, y: 0.20, category: 'emotion', vec: [0.43, 0.54, 0.18] },
  love:     { x: 0.46, y: 0.85, category: 'emotion', vec: [0.50, 0.48, 0.88] },
  proud:    { x: 0.49, y: 0.84, category: 'emotion', vec: [0.53, 0.47, 0.87] },
  confused: { x: 0.40, y: 0.35, category: 'emotion', vec: [0.46, 0.50, 0.38] },
  bored:    { x: 0.43, y: 0.30, category: 'emotion', vec: [0.49, 0.49, 0.32] },
  grateful: { x: 0.46, y: 0.86, category: 'emotion', vec: [0.50, 0.47, 0.89] },
  lonely:   { x: 0.41, y: 0.17, category: 'emotion', vec: [0.47, 0.49, 0.12] },
  hopeful:  { x: 0.48, y: 0.82, category: 'emotion', vec: [0.52, 0.46, 0.85] },

  // ── Sports ───────────────────────────────────────────
  basketball: { x: 0.60, y: 0.45, category: 'sport', vec: [0.65, 0.70, 0.50] },
  soccer:     { x: 0.58, y: 0.42, category: 'sport', vec: [0.63, 0.72, 0.48] },
  tennis:     { x: 0.62, y: 0.48, category: 'sport', vec: [0.67, 0.68, 0.52] },
  swimming:   { x: 0.55, y: 0.50, category: 'sport', vec: [0.60, 0.65, 0.55] },
  running:    { x: 0.57, y: 0.52, category: 'sport', vec: [0.62, 0.63, 0.56] },
  baseball:   { x: 0.61, y: 0.44, category: 'sport', vec: [0.66, 0.71, 0.49] },
  football:   { x: 0.59, y: 0.43, category: 'sport', vec: [0.64, 0.73, 0.47] },
  volleyball: { x: 0.60, y: 0.46, category: 'sport', vec: [0.65, 0.69, 0.51] },
  hockey:     { x: 0.58, y: 0.41, category: 'sport', vec: [0.63, 0.74, 0.46] },
  golf:       { x: 0.63, y: 0.50, category: 'sport', vec: [0.68, 0.66, 0.54] },
  wrestling:  { x: 0.56, y: 0.40, category: 'sport', vec: [0.61, 0.75, 0.45] },
  boxing:     { x: 0.55, y: 0.39, category: 'sport', vec: [0.60, 0.76, 0.44] },
  gymnastics: { x: 0.57, y: 0.48, category: 'sport', vec: [0.62, 0.67, 0.53] },

  // ── Food ─────────────────────────────────────────────
  pizza:     { x: 0.30, y: 0.60, category: 'food', vec: [0.35, 0.30, 0.65] },
  burger:    { x: 0.32, y: 0.58, category: 'food', vec: [0.37, 0.32, 0.62] },
  salad:     { x: 0.28, y: 0.65, category: 'food', vec: [0.33, 0.28, 0.70] },
  sushi:     { x: 0.26, y: 0.62, category: 'food', vec: [0.31, 0.26, 0.68] },
  taco:      { x: 0.31, y: 0.59, category: 'food', vec: [0.36, 0.31, 0.63] },
  pasta:     { x: 0.29, y: 0.61, category: 'food', vec: [0.34, 0.29, 0.66] },
  ice_cream: { x: 0.33, y: 0.70, category: 'food', vec: [0.38, 0.33, 0.75] },
  cake:      { x: 0.34, y: 0.72, category: 'food', vec: [0.39, 0.34, 0.77] },
  chocolate: { x: 0.35, y: 0.71, category: 'food', vec: [0.40, 0.35, 0.76] },
  cookie:    { x: 0.34, y: 0.69, category: 'food', vec: [0.39, 0.34, 0.74] },
  rice:      { x: 0.27, y: 0.58, category: 'food', vec: [0.32, 0.27, 0.63] },
  soup:      { x: 0.28, y: 0.57, category: 'food', vec: [0.33, 0.28, 0.62] },
  sandwich:  { x: 0.31, y: 0.60, category: 'food', vec: [0.36, 0.31, 0.65] },
  fries:     { x: 0.32, y: 0.62, category: 'food', vec: [0.37, 0.32, 0.67] },
  donut:     { x: 0.34, y: 0.68, category: 'food', vec: [0.39, 0.34, 0.73] },

  // ── Technology ───────────────────────────────────────
  computer: { x: 0.12, y: 0.50, category: 'tech', vec: [0.15, 0.90, 0.55] },
  phone:    { x: 0.14, y: 0.55, category: 'tech', vec: [0.17, 0.88, 0.58] },
  robot:    { x: 0.10, y: 0.48, category: 'tech', vec: [0.13, 0.92, 0.52] },
  internet: { x: 0.11, y: 0.52, category: 'tech', vec: [0.14, 0.91, 0.56] },
  laptop:   { x: 0.13, y: 0.51, category: 'tech', vec: [0.16, 0.89, 0.55] },
  tablet:   { x: 0.14, y: 0.53, category: 'tech', vec: [0.17, 0.87, 0.57] },
  wifi:     { x: 0.11, y: 0.54, category: 'tech', vec: [0.14, 0.90, 0.58] },
  keyboard: { x: 0.13, y: 0.49, category: 'tech', vec: [0.16, 0.89, 0.53] },
  mouse:    { x: 0.14, y: 0.48, category: 'tech', vec: [0.17, 0.88, 0.52] },
  camera:   { x: 0.15, y: 0.56, category: 'tech', vec: [0.18, 0.86, 0.60] },

  // ── People / Roles ───────────────────────────────────
  king:     { x: 0.50, y: 0.30, category: 'person', vec: [0.55, 0.40, 0.35] },
  queen:    { x: 0.52, y: 0.32, category: 'person', vec: [0.57, 0.38, 0.37] },
  doctor:   { x: 0.45, y: 0.40, category: 'person', vec: [0.50, 0.45, 0.45] },
  teacher:  { x: 0.47, y: 0.42, category: 'person', vec: [0.52, 0.43, 0.47] },
  student:  { x: 0.48, y: 0.44, category: 'person', vec: [0.53, 0.42, 0.48] },
  nurse:    { x: 0.46, y: 0.41, category: 'person', vec: [0.51, 0.44, 0.46] },
  chef:     { x: 0.44, y: 0.45, category: 'person', vec: [0.49, 0.42, 0.50] },
  artist:   { x: 0.43, y: 0.50, category: 'person', vec: [0.48, 0.40, 0.55] },
  athlete:  { x: 0.52, y: 0.45, category: 'person', vec: [0.57, 0.45, 0.50] },
  scientist:{ x: 0.44, y: 0.38, category: 'person', vec: [0.49, 0.46, 0.43] },
  prince:   { x: 0.51, y: 0.31, category: 'person', vec: [0.56, 0.39, 0.36] },
  princess: { x: 0.53, y: 0.33, category: 'person', vec: [0.58, 0.37, 0.38] },

  // ── Nature ───────────────────────────────────────────
  ocean:    { x: 0.68, y: 0.20, category: 'nature', vec: [0.72, 0.25, 0.22] },
  mountain: { x: 0.72, y: 0.25, category: 'nature', vec: [0.76, 0.28, 0.27] },
  forest:   { x: 0.70, y: 0.30, category: 'nature', vec: [0.74, 0.30, 0.32] },
  river:    { x: 0.67, y: 0.22, category: 'nature', vec: [0.71, 0.26, 0.24] },
  sun:      { x: 0.75, y: 0.35, category: 'nature', vec: [0.78, 0.32, 0.38] },
  moon:     { x: 0.73, y: 0.33, category: 'nature', vec: [0.77, 0.30, 0.35] },
  rain:     { x: 0.66, y: 0.24, category: 'nature', vec: [0.70, 0.27, 0.26] },
  snow:     { x: 0.65, y: 0.26, category: 'nature', vec: [0.69, 0.28, 0.28] },
  beach:    { x: 0.69, y: 0.21, category: 'nature', vec: [0.73, 0.26, 0.23] },
  desert:   { x: 0.74, y: 0.18, category: 'nature', vec: [0.78, 0.24, 0.20] },
  lake:     { x: 0.67, y: 0.23, category: 'nature', vec: [0.71, 0.27, 0.25] },
  volcano:  { x: 0.73, y: 0.15, category: 'nature', vec: [0.77, 0.22, 0.17] },
  star:     { x: 0.76, y: 0.38, category: 'nature', vec: [0.79, 0.34, 0.40] },
  cloud:    { x: 0.66, y: 0.28, category: 'nature', vec: [0.70, 0.29, 0.30] },
  flower:   { x: 0.71, y: 0.35, category: 'nature', vec: [0.75, 0.30, 0.37] },
  tree:     { x: 0.69, y: 0.32, category: 'nature', vec: [0.73, 0.29, 0.34] },

  // ── Music ────────────────────────────────────────────
  guitar:   { x: 0.40, y: 0.70, category: 'music', vec: [0.45, 0.42, 0.75] },
  piano:    { x: 0.42, y: 0.68, category: 'music', vec: [0.47, 0.44, 0.73] },
  drums:    { x: 0.38, y: 0.72, category: 'music', vec: [0.43, 0.40, 0.77] },
  singing:  { x: 0.44, y: 0.75, category: 'music', vec: [0.49, 0.43, 0.80] },
  violin:   { x: 0.41, y: 0.67, category: 'music', vec: [0.46, 0.43, 0.72] },
  trumpet:  { x: 0.39, y: 0.69, category: 'music', vec: [0.44, 0.41, 0.74] },
  flute:    { x: 0.40, y: 0.66, category: 'music', vec: [0.45, 0.42, 0.71] },
  concert:  { x: 0.43, y: 0.73, category: 'music', vec: [0.48, 0.44, 0.78] },
  song:     { x: 0.44, y: 0.74, category: 'music', vec: [0.49, 0.43, 0.79] },
  dance:    { x: 0.45, y: 0.72, category: 'music', vec: [0.50, 0.44, 0.77] },
  rap:      { x: 0.43, y: 0.71, category: 'music', vec: [0.48, 0.43, 0.76] },

  // ── School ───────────────────────────────────────────
  homework:   { x: 0.48, y: 0.46, category: 'school', vec: [0.53, 0.42, 0.50] },
  test:       { x: 0.47, y: 0.43, category: 'school', vec: [0.52, 0.43, 0.47] },
  classroom:  { x: 0.49, y: 0.45, category: 'school', vec: [0.54, 0.41, 0.49] },
  textbook:   { x: 0.46, y: 0.44, category: 'school', vec: [0.51, 0.44, 0.48] },
  graduation: { x: 0.50, y: 0.48, category: 'school', vec: [0.55, 0.40, 0.52] },
  recess:     { x: 0.52, y: 0.52, category: 'school', vec: [0.57, 0.38, 0.56] },
  backpack:   { x: 0.47, y: 0.47, category: 'school', vec: [0.52, 0.42, 0.51] },
  pencil:     { x: 0.46, y: 0.45, category: 'school', vec: [0.51, 0.43, 0.49] },
};

export const CATEGORY_COLORS = {
  animal:  '#f59e0b',
  vehicle: '#3b82f6',
  emotion: '#ec4899',
  sport:   '#10b981',
  food:    '#f97316',
  tech:    '#6366f1',
  person:  '#8b5cf6',
  nature:  '#14b8a6',
  music:   '#e11d48',
  school:  '#84cc16',
  unknown: '#888888',
};

export const CATEGORY_LABELS = {
  animal:  'Animals',
  vehicle: 'Vehicles',
  emotion: 'Emotions',
  sport:   'Sports',
  food:    'Food',
  tech:    'Technology',
  person:  'People',
  nature:  'Nature',
  music:   'Music',
  school:  'School',
};

// ── Utility functions ──────────────────────────────────
export function euclideanDist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function vecDist(a, b) {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - b[i]) ** 2, 0));
}

export function generatePseudoEmbedding(word) {
  let hash = 0;
  for (let i = 0; i < word.length; i++) {
    hash = (hash << 5) - hash + word.charCodeAt(i);
    hash |= 0;
  }
  const x = ((Math.abs(hash) % 1000) / 1000) * 0.6 + 0.2;
  const y = ((Math.abs(hash >> 8) % 1000) / 1000) * 0.6 + 0.2;
  return { x, y, category: 'unknown', vec: [x, y, (x + y) / 2] };
}

export function getWordData(word) {
  const key = word.toLowerCase().trim().replace(/\s+/g, '_');
  return WORD_DATABASE[key] || generatePseudoEmbedding(key);
}
