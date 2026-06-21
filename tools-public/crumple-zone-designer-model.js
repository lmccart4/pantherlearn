// Pure model for Crumple-Zone Designer. No DOM, no globals. Testable in Node.

export const CAR_PARAMS = {
  massKg: 1200,       // small passenger car
  speedMs: 8.0,       // ~18 mph fixed crash speed
};

export const MATERIALS = {
  aluminum: {
    id: "aluminum",
    label: { en: "Aluminum honeycomb", es: "Panal de aluminio" },
    costPerM: 350,    // $ per meter of crumple zone
    weightPerM: 10,   // kg per meter
    forceFactor: 1.0, // baseline crumple resistance
    color: "#94a3b8",
  },
  steel: {
    id: "steel",
    label: { en: "Steel rails", es: "Rieles de acero" },
    costPerM: 200,
    weightPerM: 30,
    forceFactor: 1.25,
    color: "#64748b",
  },
  carbon: {
    id: "carbon",
    label: { en: "Carbon fiber", es: "Fibra de carbono" },
    costPerM: 800,
    weightPerM: 7,
    forceFactor: 0.75,
    color: "#38bdf8",
  },
  foam: {
    id: "foam",
    label: { en: "Polymer foam", es: "Espuma de polímero" },
    costPerM: 120,
    weightPerM: 4,
    forceFactor: 1.1,
    color: "#fbbf24",
  },
};

export const PATTERNS = {
  straight: {
    id: "straight",
    label: { en: "Straight tube", es: "Tubo recto" },
    description: { en: "Crushes evenly from front to back.", es: "Se aplasta uniformemente de adelante hacia atrás." },
    peakMultiplier: 1.0,
  },
  tapered: {
    id: "tapered",
    label: { en: "Tapered front", es: "Frente ahusado" },
    description: { en: "Front folds first, lowering the initial force spike.", es: "La parte frontal se dobla primero, reduciendo el pico inicial de fuerza." },
    peakMultiplier: 0.85,
  },
  accordion: {
    id: "accordion",
    label: { en: "Segmented accordion", es: "Acordeón segmentado" },
    description: { en: "Progressive collapse keeps force steady and low.", es: "El colapso progresivo mantiene la fuerza estable y baja." },
    peakMultiplier: 0.75,
  },
  reinforced: {
    id: "reinforced",
    label: { en: "Reinforced front", es: "Frente reforzado" },
    description: { en: "Strong initial resistance, then sudden collapse.", es: "Resistencia inicial fuerte, luego colapso repentino." },
    peakMultiplier: 1.3,
  },
};

export const DEFAULT_CRITERIA = {
  forceThresholdN: 60000, // 60 kN peak force limit on passenger cell
  costBudget: 500,        // dollars
  weightBudget: 25,       // kg
};

// Kinetic energy that must be dissipated by the crumple zone.
export function kineticEnergyJ({ massKg, speedMs }) {
  return 0.5 * massKg * speedMs * speedMs;
}

// Average force during a uniform crush over length L.
// F_avg * L = work = kinetic energy, so F_avg = KE / L.
export function averageForceN(design) {
  const mat = MATERIALS[design.materialId] || MATERIALS.aluminum;
  const ke = kineticEnergyJ(CAR_PARAMS);
  return ke / Math.max(0.05, design.lengthM);
}

// Peak force on the passenger cell = average force adjusted by material and crumple pattern.
export function peakForceN(design) {
  const mat = MATERIALS[design.materialId] || MATERIALS.aluminum;
  const pat = PATTERNS[design.patternId] || PATTERNS.straight;
  return averageForceN(design) * mat.forceFactor * pat.peakMultiplier;
}

export function designCost(design) {
  const mat = MATERIALS[design.materialId] || MATERIALS.aluminum;
  return Math.round(mat.costPerM * design.lengthM);
}

export function designWeight(design) {
  const mat = MATERIALS[design.materialId] || MATERIALS.aluminum;
  return Math.round(mat.weightPerM * design.lengthM * 10) / 10;
}

// Collision time for a uniform deceleration from speedMs to 0 over lengthM.
export function collisionTimeS(design) {
  return (2 * Math.max(0.05, design.lengthM)) / CAR_PARAMS.speedMs;
}

export function evaluateDesign(design, criteria = DEFAULT_CRITERIA) {
  const pf = peakForceN(design);
  const cost = designCost(design);
  const weight = designWeight(design);
  const deltaP = CAR_PARAMS.massKg * CAR_PARAMS.speedMs;
  const deltaT = collisionTimeS(design);

  const passesForce = pf <= criteria.forceThresholdN;
  const withinCost = cost <= criteria.costBudget;
  const withinWeight = weight <= criteria.weightBudget;
  const passesAll = passesForce && withinCost && withinWeight;

  return {
    design,
    peakForceN: Math.round(pf),
    averageForceN: Math.round(averageForceN(design)),
    deltaP,
    deltaT: Math.round(deltaT * 1000) / 1000, // seconds
    cost,
    weight,
    passesForce,
    withinCost,
    withinWeight,
    passesAll,
  };
}

export function emptyDesign() {
  return {
    materialId: "aluminum",
    patternId: "straight",
    lengthM: 0.4,
    rationale: { en: "", es: "" },
    iterations: [],
  };
}

// Score: 5 = passes force threshold within both budgets.
// Partial credit for close attempts so students see progress.
export function scoreDesign(evaluation, criteria = DEFAULT_CRITERIA) {
  const { passesForce, withinCost, withinWeight, peakForceN: pf, cost, weight } = evaluation;
  const forceRatio = pf / criteria.forceThresholdN;
  const costRatio = cost / criteria.costBudget;
  const weightRatio = weight / criteria.weightBudget;
  const breakdown = [];

  let score = 0;

  if (passesForce && withinCost && withinWeight) {
    score = 5;
    breakdown.push("passes-all:+5");
  } else if (passesForce && (!withinCost || !withinWeight)) {
    score = 3;
    breakdown.push("safe-but-over-budget:+3");
  } else if (forceRatio <= 1.15 && withinCost && withinWeight) {
    score = 2;
    breakdown.push("close-to-threshold-within-budget:+2");
  } else {
    score = 1;
    breakdown.push("attempted:+1");
  }

  breakdown.push(`peakForce:${Math.round(pf)}N`);
  breakdown.push(`cost:$${cost}`);
  breakdown.push(`weight:${weight}kg`);

  return {
    score,
    maxScore: 5,
    breakdown,
    forceRatio: Math.round(forceRatio * 100) / 100,
    costRatio: Math.round(costRatio * 100) / 100,
    weightRatio: Math.round(weightRatio * 100) / 100,
  };
}

export function materialById(id) {
  return MATERIALS[id] || MATERIALS.aluminum;
}

export function patternById(id) {
  return PATTERNS[id] || PATTERNS.straight;
}
