// Hotspot polygons are normalized (0..1) over the figure image.
// Authored on the figure's LEFT half (or spanning the midline for central
// muscles); judgeClick mirrors clicks across x=0.5 so the bilateral right side
// also registers. First pass — fine-tune interactively via ?calibrate.

export const MUSCLES = {
  // ----- FRONT -----
  pectorals:   { name: 'Pectorals',           view: 'front', polygon: [[0.40,0.21],[0.50,0.21],[0.50,0.29],[0.40,0.28]] },
  deltoids:    { name: 'Deltoids',            view: 'front', polygon: [[0.31,0.19],[0.40,0.20],[0.40,0.26],[0.31,0.25]] },
  biceps:      { name: 'Biceps',              view: 'front', polygon: [[0.29,0.26],[0.37,0.27],[0.36,0.35],[0.28,0.34]] },
  forearms:    { name: 'Forearms',            view: 'front', polygon: [[0.25,0.38],[0.33,0.39],[0.31,0.47],[0.23,0.46]] },
  abdominals:  { name: 'Abdominals',          view: 'front', polygon: [[0.44,0.29],[0.56,0.29],[0.56,0.42],[0.44,0.42]] },
  obliques:    { name: 'Obliques',            view: 'front', polygon: [[0.40,0.31],[0.44,0.31],[0.44,0.43],[0.40,0.41]] },
  quadriceps:  { name: 'Quadriceps',          view: 'front', polygon: [[0.40,0.51],[0.49,0.51],[0.48,0.66],[0.41,0.66]] },
  adductors:   { name: 'Adductors',           view: 'front', polygon: [[0.46,0.50],[0.50,0.50],[0.50,0.61],[0.46,0.61]] },
  tibialis:    { name: 'Tibialis Anterior',   view: 'front', polygon: [[0.43,0.71],[0.48,0.71],[0.48,0.87],[0.44,0.87]] },
  sternocleido:{ name: 'Sternocleidomastoid', view: 'front', polygon: [[0.47,0.14],[0.53,0.14],[0.52,0.19],[0.48,0.19]] },
  serratus:    { name: 'Serratus Anterior',   view: 'front', polygon: [[0.37,0.27],[0.41,0.27],[0.41,0.32],[0.37,0.32]] },
  brachialis:  { name: 'Brachialis',          view: 'front', polygon: [[0.28,0.34],[0.35,0.35],[0.34,0.39],[0.27,0.38]] },
  // ----- BACK -----
  trapezius:   { name: 'Trapezius',           view: 'back',  polygon: [[0.44,0.17],[0.56,0.17],[0.57,0.26],[0.50,0.28],[0.43,0.26]] },
  triceps:     { name: 'Triceps',             view: 'back',  polygon: [[0.29,0.26],[0.38,0.27],[0.37,0.35],[0.29,0.34]] },
  latissimus:  { name: 'Latissimus Dorsi',    view: 'back',  polygon: [[0.40,0.30],[0.48,0.31],[0.47,0.40],[0.40,0.39]] },
  rhomboids:   { name: 'Rhomboids',           view: 'back',  polygon: [[0.45,0.27],[0.55,0.27],[0.55,0.32],[0.45,0.32]] },
  gluteals:    { name: 'Gluteals',            view: 'back',  polygon: [[0.41,0.46],[0.50,0.46],[0.50,0.55],[0.42,0.55]] },
  hamstrings:  { name: 'Hamstrings',          view: 'back',  polygon: [[0.40,0.55],[0.49,0.55],[0.48,0.67],[0.41,0.67]] },
  gastrocnemius:{ name: 'Gastrocnemius (Calf)',view: 'back', polygon: [[0.41,0.69],[0.48,0.69],[0.48,0.80],[0.42,0.80]] },
  soleus:      { name: 'Soleus',              view: 'back',  polygon: [[0.42,0.80],[0.48,0.80],[0.47,0.88],[0.43,0.88]] },
  // ----- HARD: individual heads (front) -----
  'deltoid-anterior':  { name: 'Anterior Deltoid',  view: 'front', polygon: [[0.37,0.20],[0.42,0.21],[0.41,0.26],[0.37,0.25]] },
  'deltoid-lateral':   { name: 'Lateral Deltoid',   view: 'front', polygon: [[0.31,0.20],[0.37,0.20],[0.37,0.26],[0.31,0.25]] },
  'biceps-long':       { name: 'Biceps (Long Head)',view: 'front', polygon: [[0.28,0.27],[0.32,0.27],[0.32,0.35],[0.28,0.34]] },
  'biceps-short':      { name: 'Biceps (Short Head)',view:'front', polygon: [[0.32,0.27],[0.37,0.27],[0.36,0.35],[0.32,0.35]] },
  'rectus-femoris':    { name: 'Rectus Femoris',    view: 'front', polygon: [[0.43,0.52],[0.47,0.52],[0.47,0.64],[0.43,0.64]] },
  'vastus-lateralis':  { name: 'Vastus Lateralis',  view: 'front', polygon: [[0.39,0.53],[0.43,0.53],[0.43,0.64],[0.40,0.63]] },
  'vastus-medialis':   { name: 'Vastus Medialis',   view: 'front', polygon: [[0.45,0.59],[0.49,0.59],[0.49,0.66],[0.45,0.66]] },
  // ----- HARD: individual heads (back) -----
  'deltoid-posterior': { name: 'Posterior Deltoid', view: 'back',  polygon: [[0.31,0.20],[0.39,0.21],[0.39,0.26],[0.31,0.25]] },
  'triceps-long':      { name: 'Triceps (Long Head)',view:'back',  polygon: [[0.33,0.27],[0.38,0.27],[0.37,0.35],[0.33,0.34]] },
  'triceps-lateral':   { name: 'Triceps (Lateral Head)',view:'back',polygon: [[0.29,0.27],[0.33,0.27],[0.33,0.35],[0.29,0.34]] },
  'gastroc-medial':    { name: 'Gastrocnemius (Medial)', view: 'back', polygon: [[0.45,0.69],[0.48,0.69],[0.48,0.80],[0.45,0.80]] },
  'gastroc-lateral':   { name: 'Gastrocnemius (Lateral)',view: 'back', polygon: [[0.41,0.69],[0.45,0.69],[0.45,0.80],[0.42,0.80]] }
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
