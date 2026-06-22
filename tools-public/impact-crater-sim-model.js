// Pure impact-energy / crater-diameter model. No DOM, no globals. Testable in Node.

export const TARGETS = [
  { id: "rocky", label: { en: "Rocky surface", es: "Superficie rocosa" }, factor: 0.4 },
  { id: "regolith", label: { en: "Loose regolith", es: "Regolito suelto" }, factor: 0.7 },
  { id: "ice", label: { en: "Ice or snow", es: "Hielo o nieve" }, factor: 1.0 },
  { id: "atmosphere", label: { en: "Atmosphere (airburst)", es: "Atmósfera (explosión aérea)" }, factor: 0 },
];

export const MASS_OPTIONS = [
  { id: "pebble", label: { en: "Pebble (1 kg)", es: "Guijarro (1 kg)" }, kg: 1 },
  { id: "basketball", label: { en: "Basketball-size (5 kg)", es: "Tamaño de balón (5 kg)" }, kg: 5 },
  { id: "boulder", label: { en: "Boulder (1,000 kg)", es: "Roca (1,000 kg)" }, kg: 1000 },
  { id: "car", label: { en: "Car-size (10,000 kg)", es: "Tamaño de carro (10,000 kg)" }, kg: 10000 },
  { id: "chelyabinsk", label: { en: "Chelyabinsk object (~11,000,000 kg)", es: "Objeto de Cheliábinsk (~11,000,000 kg)" }, kg: 1.1e7 },
  { id: "small-asteroid", label: { en: "Small asteroid (1 billion kg)", es: "Asteroide pequeño (1,000 millones kg)" }, kg: 1e9 },
  { id: "large-asteroid", label: { en: "Large asteroid (1 trillion kg)", es: "Asteroide grande (1 billón kg)" }, kg: 1e12 },
  { id: "chicxulub", label: { en: "Chicxulub object (~1 quadrillion kg)", es: "Objeto de Chicxulub (~1 cuatrillón kg)" }, kg: 1e15 },
];

export const VELOCITY_OPTIONS = [
  { id: "slow", label: { en: "Slow impact (5 km/s)", es: "Impacto lento (5 km/s)" }, mps: 5000 },
  { id: "meteor", label: { en: "Meteor speed (13 km/s)", es: "Velocidad de meteoro (13 km/s)" }, mps: 13000 },
  { id: "chelyabinsk-v", label: { en: "Chelyabinsk speed (19 km/s)", es: "Velocidad de Cheliábinsk (19 km/s)" }, mps: 19000 },
  { id: "chicxulub-v", label: { en: "Chicxulub speed (20 km/s)", es: "Velocidad de Chicxulub (20 km/s)" }, mps: 20000 },
  { id: "fast", label: { en: "Fast asteroid (35 km/s)", es: "Asteroide rápido (35 km/s)" }, mps: 35000 },
  { id: "very-fast", label: { en: "Very fast (50 km/s)", es: "Muy rápido (50 km/s)" }, mps: 50000 },
  { id: "hyper", label: { en: "Hypervelocity (70 km/s)", es: "Hipervelocidad (70 km/s)" }, mps: 70000 },
];

export const ENERGY_CATEGORIES = [
  { id: "tiny", label: { en: "Tiny (< 1 GJ)", es: "Minúscula (< 1 GJ)" } },
  { id: "small", label: { en: "Small (1 GJ – 1 TJ)", es: "Pequeña (1 GJ – 1 TJ)" } },
  { id: "medium", label: { en: "Medium (1 TJ – 1 PJ)", es: "Mediana (1 TJ – 1 PJ)" } },
  { id: "large", label: { en: "Large (1 PJ – 1 EJ)", es: "Grande (1 PJ – 1 EJ)" } },
  { id: "cataclysmic", label: { en: "Cataclysmic (> 1 EJ)", es: "Cataclísmica (> 1 EJ)" } },
];

export const CRATER_CATEGORIES = [
  { id: "none", label: { en: "None — airburst", es: "Ninguno — explosión aérea" } },
  { id: "small", label: { en: "Small (< 100 m)", es: "Pequeño (< 100 m)" } },
  { id: "medium", label: { en: "Medium (100 m – 1 km)", es: "Mediano (100 m – 1 km)" } },
  { id: "large", label: { en: "Large (1 km – 50 km)", es: "Grande (1 km – 50 km)" } },
  { id: "cataclysmic", label: { en: "Cataclysmic (> 50 km)", es: "Cataclísmico (> 50 km)" } },
];

export const SCENARIOS = [
  {
    id: "chelyabinsk",
    title: { en: "Chelyabinsk, 2013", es: "Cheliábinsk, 2013" },
    subtitle: {
      en: "A small asteroid broke up over Siberia, Russia. Predict the energy and crater.",
      es: "Un asteroide pequeño se desintegró sobre Siberia, Rusia. Predice la energía y el cráter.",
    },
    massId: "chelyabinsk",
    velocityId: "chelyabinsk-v",
    targetId: "atmosphere",
    expectedEnergy: "large",
    expectedCrater: "none",
  },
  {
    id: "arizona",
    title: { en: "Meteor Crater, Arizona", es: "Cráter Meteórico, Arizona" },
    subtitle: {
      en: "An iron impactor struck the Colorado Plateau ~50,000 years ago.",
      es: "Un impactador de hierro golpeó la Meseta del Colorado hace ~50,000 años.",
    },
    massId: "small-asteroid",
    velocityId: "meteor",
    targetId: "rocky",
    expectedEnergy: "large",
    expectedCrater: "medium",
  },
  {
    id: "chicxulub",
    title: { en: "Chicxulub, 66 million years ago", es: "Chicxulub, hace 66 millones de años" },
    subtitle: {
      en: "The impact linked to the end-Cretaceous mass extinction.",
      es: "El impacto vinculado a la extinción masiva del Cretácico.",
    },
    massId: "chicxulub",
    velocityId: "chicxulub-v",
    targetId: "rocky",
    expectedEnergy: "cataclysmic",
    expectedCrater: "large",
  },
];

const ENERGY_TON_TNT = 4.184e9; // 1 ton TNT = 4.184 GJ

export function getEnergyCategory(joules) {
  if (joules < 1e9) return "tiny";
  if (joules < 1e12) return "small";
  if (joules < 1e15) return "medium";
  if (joules < 1e18) return "large";
  return "cataclysmic";
}

export function getCraterCategory(diameterM) {
  if (diameterM < 1) return "none";
  if (diameterM < 100) return "small";
  if (diameterM < 1000) return "medium";
  if (diameterM < 50000) return "large";
  return "cataclysmic";
}

// Simplified educational scaling: D (m) ∝ m^(1/3) * v^0.8 * surfaceFactor.
export function computeImpact(massKg, velocityMps, targetId) {
  const target = TARGETS.find((t) => t.id === targetId) || TARGETS[0];
  const joules = 0.5 * massKg * velocityMps * velocityMps;
  const tntTonnes = joules / ENERGY_TON_TNT;
  let diameterM = 0;
  if (target.id !== "atmosphere") {
    diameterM = 0.06 * Math.cbrt(massKg) * Math.pow(velocityMps / 1000, 0.8) * target.factor;
  }
  return {
    massKg,
    velocityMps,
    targetId: target.id,
    joules,
    tntTonnes,
    diameterM,
    energyCategory: getEnergyCategory(joules),
    craterCategory: getCraterCategory(diameterM),
    target,
  };
}

export function emptyState() {
  return {
    activeTab: "explore",
    explore: { massId: "boulder", velocityId: "meteor", targetId: "regolith", revealed: false },
    scenarios: {
      chelyabinsk: { energyPred: null, craterPred: null, revealed: false },
      arizona: { energyPred: null, craterPred: null, revealed: false },
      chicxulub: { energyPred: null, craterPred: null, revealed: false },
    },
  };
}

export function scoreScenarios(state) {
  let correct = 0;
  const breakdown = [];
  for (const sc of SCENARIOS) {
    const st = state.scenarios[sc.id] || {};
    const mass = (MASS_OPTIONS.find((m) => m.id === sc.massId) || MASS_OPTIONS[0]).kg;
    const velocity = (VELOCITY_OPTIONS.find((v) => v.id === sc.velocityId) || VELOCITY_OPTIONS[0]).mps;
    const actual = computeImpact(mass, velocity, sc.targetId);
    const energyCorrect = st.energyPred === actual.energyCategory;
    const craterCorrect = st.craterPred === actual.craterCategory;
    if (energyCorrect) correct += 1;
    if (craterCorrect) correct += 1;
    breakdown.push(`${sc.id}:energy:${energyCorrect ? 1 : 0}`);
    breakdown.push(`${sc.id}:crater:${craterCorrect ? 1 : 0}`);
  }
  const score = Math.round((correct / 6) * 5 * 100) / 100;
  return { score, maxScore: 5, correct, total: 6, breakdown };
}
