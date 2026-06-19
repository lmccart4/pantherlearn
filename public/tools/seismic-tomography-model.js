export const EARTH_RADIUS_KM = 6371;
export const MAX_WAVE_SPEED = 14;

const P_WAVE_PROFILE = [
  { d: 0, s: 6.0 },
  { d: 35, s: 7.0 },
  { d: 100, s: 8.0 },
  { d: 400, s: 9.0 },
  { d: 670, s: 10.0 },
  { d: 1000, s: 10.5 },
  { d: 2000, s: 11.5 },
  { d: 2889.9, s: 13.7 },
  { d: 2890.1, s: 8.0 },
  { d: 3000, s: 8.3 },
  { d: 4000, s: 9.5 },
  { d: 5149.9, s: 10.3 },
  { d: 5150.1, s: 11.0 },
  { d: 5500, s: 11.1 },
  { d: 6000, s: 11.2 },
  { d: 6371, s: 11.3 },
];

const S_WAVE_PROFILE = [
  { d: 0, s: 3.5 },
  { d: 35, s: 4.5 },
  { d: 100, s: 4.6 },
  { d: 400, s: 4.9 },
  { d: 670, s: 5.6 },
  { d: 1000, s: 5.9 },
  { d: 2000, s: 6.7 },
  { d: 2889.9, s: 7.3 },
  { d: 2890.1, s: 0 },
  { d: 3000, s: 0 },
  { d: 4000, s: 0 },
  { d: 5149.9, s: 0 },
  { d: 5150.1, s: 3.5 },
  { d: 5500, s: 3.6 },
  { d: 6000, s: 3.65 },
  { d: 6371, s: 3.7 },
];

function interp(profile, depth) {
  if (depth <= profile[0].d) return profile[0].s;
  if (depth >= profile[profile.length - 1].d) return profile[profile.length - 1].s;
  for (let i = 0; i < profile.length - 1; i++) {
    const a = profile[i];
    const b = profile[i + 1];
    if (depth >= a.d && depth <= b.d) {
      if (b.d === a.d) return b.s;
      const t = (depth - a.d) / (b.d - a.d);
      return a.s + (b.s - a.s) * t;
    }
  }
  return profile[profile.length - 1].s;
}

export function getWaveSpeeds(depth) {
  return { p: interp(P_WAVE_PROFILE, depth), s: interp(S_WAVE_PROFILE, depth) };
}

export function sampleWaveData(steps = 120) {
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const depth = (EARTH_RADIUS_KM * i) / steps;
    out.push({ depth, ...getWaveSpeeds(depth) });
  }
  return out;
}

export const REGIONS = [
  {
    id: "crustBand",
    expectedLabel: "crust",
    depthMin: 0,
    depthMax: 35,
    color: "#94a3b8",
  },
  {
    id: "mantleBand",
    expectedLabel: "mantle",
    depthMin: 35,
    depthMax: 2890,
    color: "#f97316",
  },
  {
    id: "outerCoreBand",
    expectedLabel: "outerCore",
    depthMin: 2890,
    depthMax: 5150,
    color: "#38bdf8",
  },
  {
    id: "innerCoreBand",
    expectedLabel: "innerCore",
    depthMin: 5150,
    depthMax: 6371,
    color: "#fbbf24",
  },
];

export const LABEL_OPTIONS = [
  { id: "crust", label: { en: "Crust", es: "Corteza" } },
  { id: "mantle", label: { en: "Mantle", es: "Manto" } },
  { id: "outerCore", label: { en: "Outer Core", es: "Núcleo Externo" } },
  { id: "innerCore", label: { en: "Inner Core", es: "Núcleo Interno" } },
];

export const REASONING_QUESTIONS = [
  {
    id: "materialState",
    correct: "liquid",
    prompt: {
      en: "S-waves do not travel in the outer core. What does this evidence tell us?",
      es: "Las ondas S no viajan en el núcleo externo. ¿Qué nos dice esta evidencia?",
    },
    options: [
      { id: "solid", label: { en: "It is solid", es: "Es sólido" } },
      { id: "liquid", label: { en: "It is liquid", es: "Es líquido" } },
      { id: "gas", label: { en: "It is gas", es: "Es gas" } },
    ],
  },
  {
    id: "fastestP",
    correct: "mantle",
    prompt: {
      en: "Looking at the P-wave graph, where do P-waves travel fastest?",
      es: "Mirando la gráfica de ondas P, ¿dónde viajan las ondas P más rápido?",
    },
    options: [
      { id: "crust", label: { en: "Crust", es: "Corteza" } },
      { id: "mantle", label: { en: "Mantle", es: "Manto" } },
      { id: "outerCore", label: { en: "Outer Core", es: "Núcleo Externo" } },
      { id: "innerCore", label: { en: "Inner Core", es: "Núcleo Interno" } },
    ],
  },
];

export function emptyState() {
  return {
    labels: {
      crustBand: null,
      mantleBand: null,
      outerCoreBand: null,
      innerCoreBand: null,
    },
    reasoning: {
      materialState: null,
      fastestP: null,
    },
  };
}

export function scoreState(state) {
  let score = 0;
  const breakdown = [];
  for (const r of REGIONS) {
    const ok = state.labels[r.id] === r.expectedLabel;
    if (ok) score += 1;
    breakdown.push(`${r.id}:${ok ? 1 : 0}`);
  }
  const matOk = state.reasoning.materialState === "liquid";
  if (matOk) score += 0.5;
  breakdown.push(`materialState:${matOk ? 0.5 : 0}`);
  const fastOk = state.reasoning.fastestP === "mantle";
  if (fastOk) score += 0.5;
  breakdown.push(`fastestP:${fastOk ? 0.5 : 0}`);
  return {
    score: Math.round(score * 100) / 100,
    maxScore: 5,
    breakdown,
  };
}
