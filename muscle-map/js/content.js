// Hotspot polygons are normalized (0..1) over the figure image.
// PLACEHOLDER polygons (small boxes) — replaced by calibration output in a later task.
function box(cx, cy, w = 0.08, h = 0.05) {
  return [[cx - w, cy - h], [cx + w, cy - h], [cx + w, cy + h], [cx - w, cy + h]];
}

export const MUSCLES = {
  // ----- FRONT -----
  pectorals:   { name: 'Pectorals',           view: 'front', polygon: box(0.42, 0.30) },
  deltoids:    { name: 'Deltoids',            view: 'front', polygon: box(0.30, 0.27) },
  biceps:      { name: 'Biceps',              view: 'front', polygon: box(0.26, 0.36) },
  forearms:    { name: 'Forearms',            view: 'front', polygon: box(0.22, 0.46) },
  abdominals:  { name: 'Abdominals',          view: 'front', polygon: box(0.42, 0.42) },
  obliques:    { name: 'Obliques',            view: 'front', polygon: box(0.34, 0.44) },
  quadriceps:  { name: 'Quadriceps',          view: 'front', polygon: box(0.40, 0.62) },
  adductors:   { name: 'Adductors',           view: 'front', polygon: box(0.46, 0.60) },
  tibialis:    { name: 'Tibialis Anterior',   view: 'front', polygon: box(0.40, 0.82) },
  sternocleido:{ name: 'Sternocleidomastoid', view: 'front', polygon: box(0.42, 0.18) },
  serratus:    { name: 'Serratus Anterior',   view: 'front', polygon: box(0.36, 0.36) },
  brachialis:  { name: 'Brachialis',          view: 'front', polygon: box(0.24, 0.40) },
  // ----- BACK -----
  trapezius:   { name: 'Trapezius',           view: 'back',  polygon: box(0.50, 0.22) },
  triceps:     { name: 'Triceps',             view: 'back',  polygon: box(0.30, 0.36) },
  latissimus:  { name: 'Latissimus Dorsi',    view: 'back',  polygon: box(0.42, 0.40) },
  rhomboids:   { name: 'Rhomboids',           view: 'back',  polygon: box(0.46, 0.32) },
  gluteals:    { name: 'Gluteals',            view: 'back',  polygon: box(0.44, 0.54) },
  hamstrings:  { name: 'Hamstrings',          view: 'back',  polygon: box(0.42, 0.66) },
  gastrocnemius:{ name: 'Gastrocnemius (Calf)',view: 'back', polygon: box(0.42, 0.80) },
  soleus:      { name: 'Soleus',              view: 'back',  polygon: box(0.42, 0.86) },
  // ----- HARD: individual heads (front) -----
  'deltoid-anterior':  { name: 'Anterior Deltoid',  view: 'front', polygon: box(0.31, 0.26) },
  'deltoid-lateral':   { name: 'Lateral Deltoid',   view: 'front', polygon: box(0.28, 0.27) },
  'biceps-long':       { name: 'Biceps (Long Head)',view: 'front', polygon: box(0.27, 0.35) },
  'biceps-short':      { name: 'Biceps (Short Head)',view:'front', polygon: box(0.25, 0.36) },
  'rectus-femoris':    { name: 'Rectus Femoris',    view: 'front', polygon: box(0.41, 0.60) },
  'vastus-lateralis':  { name: 'Vastus Lateralis',  view: 'front', polygon: box(0.37, 0.62) },
  'vastus-medialis':   { name: 'Vastus Medialis',   view: 'front', polygon: box(0.45, 0.66) },
  // ----- HARD: individual heads (back) -----
  'deltoid-posterior': { name: 'Posterior Deltoid', view: 'back',  polygon: box(0.31, 0.27) },
  'triceps-long':      { name: 'Triceps (Long Head)',view:'back',  polygon: box(0.31, 0.35) },
  'triceps-lateral':   { name: 'Triceps (Lateral Head)',view:'back',polygon: box(0.29, 0.37) },
  'gastroc-medial':    { name: 'Gastrocnemius (Medial)', view: 'back', polygon: box(0.44, 0.80) },
  'gastroc-lateral':   { name: 'Gastrocnemius (Lateral)',view: 'back', polygon: box(0.40, 0.80) }
};

export const TIERS = {
  easy: [
    'pectorals', 'biceps', 'triceps', 'deltoids', 'abdominals',
    'quadriceps', 'hamstrings', 'gluteals', 'gastrocnemius',
    'trapezius', 'latissimus', 'forearms'
  ],
  medium: [
    'pectorals', 'biceps', 'triceps', 'deltoids', 'abdominals',
    'quadriceps', 'hamstrings', 'gluteals', 'gastrocnemius',
    'trapezius', 'latissimus', 'forearms',
    'obliques', 'soleus', 'rhomboids', 'adductors',
    'tibialis', 'serratus', 'brachialis', 'sternocleido'
  ],
  hard: [
    'pectorals', 'abdominals', 'obliques', 'serratus', 'forearms', 'brachialis',
    'sternocleido', 'trapezius', 'latissimus', 'rhomboids', 'gluteals',
    'hamstrings', 'adductors', 'tibialis', 'soleus',
    'deltoid-anterior', 'deltoid-lateral', 'deltoid-posterior',
    'biceps-long', 'biceps-short', 'triceps-long', 'triceps-lateral',
    'rectus-femoris', 'vastus-lateralis', 'vastus-medialis',
    'gastroc-medial', 'gastroc-lateral'
  ]
};
