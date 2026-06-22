// Pure model for Impulse & Crumple-Zone Explorer. No DOM, no globals. Testable in Node.

export const BARRIER_PRESETS = [
  {
    id: "stiff-wall",
    label: { en: "Stiff wall", es: "Pared rígida" },
    description: { en: "Very little crumple — short collision time.", es: "Muy poco aplastamiento — tiempo de colisión corto." },
    deltaT: 0.05,
    shape: "triangle",
    color: "#f87171",
  },
  {
    id: "moderate-crumple",
    label: { en: "Moderate crumple zone", es: "Zona de aplastamiento moderada" },
    description: { en: "Front end crumples — longer collision time.", es: "La parte frontal se aplasta — tiempo de colisión más largo." },
    deltaT: 0.15,
    shape: "sine",
    color: "#fbbf24",
  },
  {
    id: "heavy-crumple",
    label: { en: "Heavy crumple zone", es: "Zona de aplastamiento grande" },
    description: { en: "Long controlled crush — longest collision time.", es: "Aplastamiento largo y controlado — tiempo de colisión más largo." },
    deltaT: 0.30,
    shape: "square",
    color: "#34d399",
  },
];

export const SHAPE_PEAK_FACTOR = {
  triangle: 2.0,
  sine: Math.PI / 2,
  square: 1.0,
};

export const INJURY_THRESHOLD_N = 40000; // 40 kN

export function computeDeltaP(mass, velocity) {
  // velocity in m/s; car comes to rest, so Δp = m·v
  return mass * velocity;
}

// Build a force-vs-time profile sampled at n points over [0, deltaT].
// Area under the curve equals deltaP.
export function computeForceProfile(deltaP, deltaT, shape = "triangle", n = 120) {
  if (deltaT <= 0 || deltaP <= 0) {
    return { points: [], fAvg: 0, fPeak: 0, deltaP: 0, deltaT: 0 };
  }
  const fAvg = deltaP / deltaT;
  const peakFactor = SHAPE_PEAK_FACTOR[shape] ?? 2.0;
  const fPeak = fAvg * peakFactor;
  const points = [];
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * deltaT;
    let f = 0;
    if (shape === "triangle") {
      f = t <= deltaT / 2 ? (fPeak * 2 * t) / deltaT : (fPeak * 2 * (deltaT - t)) / deltaT;
    } else if (shape === "sine") {
      f = fPeak * Math.sin((Math.PI * t) / deltaT);
    } else if (shape === "square") {
      f = fPeak;
    }
    points.push({ t, f });
  }
  return { points, fAvg, fPeak, deltaP, deltaT };
}

export function barrierById(id) {
  return BARRIER_PRESETS.find((b) => b.id === id) || BARRIER_PRESETS[0];
}

// Evaluate a crash configuration.
export function evaluateCrash({ mass, velocity, barrierId }) {
  const barrier = barrierById(barrierId);
  const deltaP = computeDeltaP(mass, velocity);
  const profile = computeForceProfile(deltaP, barrier.deltaT, barrier.shape);
  const belowThreshold = profile.fPeak <= INJURY_THRESHOLD_N;
  return {
    mass,
    velocity,
    barrierId,
    barrierLabel: barrier.label,
    barrierColor: barrier.color,
    deltaP,
    ...profile,
    belowThreshold,
  };
}

export function emptyState() {
  return {
    mass: 1500, // kg
    velocity: 13.4, // m/s (~30 mph)
    barrierId: BARRIER_PRESETS[0].id,
    testsRun: [],
    insightConfirmed: false,
  };
}

export function scoreExploration(state) {
  const tests = state.testsRun || [];
  const uniqueBarrierIds = [...new Set(tests.map((t) => t.barrierId))];
  const uniqueDeltas = [...new Set(tests.map((t) => Math.round(t.deltaT * 1000)))].sort((a, b) => a - b);

  let score = 0;
  const breakdown = [];

  // Up to 2 points for running multiple distinct collision times.
  const varietyScore = Math.min(2, uniqueBarrierIds.length >= 2 ? uniqueBarrierIds.length - 1 : 0);
  score += varietyScore;
  breakdown.push(`variety:${varietyScore}/2`);

  // 1 point if the longest-tested crumple produces the lowest peak force.
  let relationshipHolds = false;
  if (tests.length >= 2) {
    const sorted = [...tests].sort((a, b) => a.deltaT - b.deltaT);
    relationshipHolds = sorted.every((t, i) => i === 0 || t.fPeak <= sorted[i - 1].fPeak);
  }
  const relationshipScore = relationshipHolds ? 1 : 0;
  score += relationshipScore;
  breakdown.push(`relationship:${relationshipScore}/1`);

  // 1 point for confirming the insight in words.
  const insightScore = state.insightConfirmed ? 1 : 0;
  score += insightScore;
  breakdown.push(`insight:${insightScore}/1`);

  // 1 point for finding a configuration that keeps peak force below the injury threshold.
  const safeScore = tests.some((t) => t.fPeak <= INJURY_THRESHOLD_N) ? 1 : 0;
  score += safeScore;
  breakdown.push(`safeDesign:${safeScore}/1`);

  return {
    score: Math.round(score * 100) / 100,
    maxScore: 5,
    breakdown,
    uniqueDeltas,
    uniqueBarrierIds,
    relationshipHolds,
  };
}
