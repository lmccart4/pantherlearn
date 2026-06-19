// Pure plate-boundary model. No DOM, no globals. Testable in Node.

export const SCENARIOS = [
  {
    id: "divergent",
    title: { en: "Divergent Boundary", es: "Frontera Divergente" },
    subtitle: { en: "Plates move apart", es: "Las placas se separan" },
    leftLabel: { en: "Left plate", es: "Placa izquierda" },
    rightLabel: { en: "Right plate", es: "Placa derecha" },
    expected: {
      leftForce: "left",
      rightForce: "right",
      boundaryType: "divergent",
      netForce: "unbalanced",
      hazard: "rift-volcanoes",
    },
  },
  {
    id: "convergent",
    title: { en: "Convergent Boundary", es: "Frontera Convergente" },
    subtitle: { en: "Plates move together", es: "Las placas chocan" },
    leftLabel: { en: "Left plate", es: "Placa izquierda" },
    rightLabel: { en: "Right plate", es: "Placa derecha" },
    expected: {
      leftForce: "right",
      rightForce: "left",
      boundaryType: "convergent",
      netForce: "unbalanced",
      hazard: "mountains-volcanoes",
    },
  },
  {
    id: "transform",
    title: { en: "Transform Boundary", es: "Frontera Transformante" },
    subtitle: { en: "Plates slide past each other", es: "Las placas se deslizan una al lado de la otra" },
    leftLabel: { en: "Left plate", es: "Placa izquierda" },
    rightLabel: { en: "Right plate", es: "Placa derecha" },
    expected: {
      leftForce: "up",
      rightForce: "down",
      boundaryType: "transform",
      netForce: "unbalanced",
      hazard: "earthquakes",
    },
  },
];

export const FORCE_OPTIONS = [
  { id: "left", symbol: "←", label: { en: "Push left", es: "Empujar izquierda" } },
  { id: "right", symbol: "→", label: { en: "Push right", es: "Empujar derecha" } },
  { id: "up", symbol: "↑", label: { en: "Push up", es: "Empujar arriba" } },
  { id: "down", symbol: "↓", label: { en: "Push down", es: "Empujar abajo" } },
];

export const BOUNDARY_OPTIONS = [
  { id: "divergent", label: { en: "Divergent", es: "Divergente" } },
  { id: "convergent", label: { en: "Convergent", es: "Convergente" } },
  { id: "transform", label: { en: "Transform", es: "Transformante" } },
];

export const NET_FORCE_OPTIONS = [
  { id: "balanced", label: { en: "Balanced", es: "Equilibrado" } },
  { id: "unbalanced", label: { en: "Unbalanced", es: "Desequilibrado" } },
];

export const HAZARD_OPTIONS = {
  divergent: [
    { id: "rift-volcanoes", label: { en: "Rift opens / volcanoes / earthquakes", es: "Se abre una fisura / volcanes / terremotos" } },
    { id: "mountains", label: { en: "Mountains form", es: "Se forman montañas" } },
    { id: "slide", label: { en: "Plates slide past each other", es: "Las placas se deslizan" } },
    { id: "nothing", label: { en: "Nothing happens", es: "No pasa nada" } },
  ],
  convergent: [
    { id: "mountains-volcanoes", label: { en: "Mountains / volcanoes / earthquakes", es: "Montañas / volcanes / terremotos" } },
    { id: "rift", label: { en: "Rift opens", es: "Se abre una fisura" } },
    { id: "slide", label: { en: "Plates slide past each other", es: "Las placas se deslizan" } },
    { id: "nothing", label: { en: "Nothing happens", es: "No pasa nada" } },
  ],
  transform: [
    { id: "earthquakes", label: { en: "Earthquakes along the fault", es: "Terremotos a lo largo de la falla" } },
    { id: "rift", label: { en: "Rift opens", es: "Se abre una fisura" } },
    { id: "mountains", label: { en: "Mountains form", es: "Se forman montañas" } },
    { id: "nothing", label: { en: "Nothing happens", es: "No pasa nada" } },
  ],
};

export function emptyState() {
  const state = {};
  for (const s of SCENARIOS) {
    state[s.id] = {
      leftForce: null,
      rightForce: null,
      boundaryType: null,
      netForce: null,
      hazard: null,
    };
  }
  return state;
}

export function scoreScenarios(state) {
  const breakdown = [];
  let vectorScore = 0;
  let typeScore = 0;
  let netScore = 0;
  let hazardScore = 0;

  let allTypesCorrect = true;
  let allNetCorrect = true;
  let allHazardCorrect = true;

  for (const sc of SCENARIOS) {
    const st = state[sc.id] || {};
    const vectorsCorrect =
      st.leftForce === sc.expected.leftForce &&
      st.rightForce === sc.expected.rightForce;
    const typeCorrect = st.boundaryType === sc.expected.boundaryType;
    const netCorrect = st.netForce === sc.expected.netForce;
    const hazardCorrect = st.hazard === sc.expected.hazard;

    if (vectorsCorrect) vectorScore += 1;
    if (!typeCorrect) allTypesCorrect = false;
    if (!netCorrect) allNetCorrect = false;
    if (!hazardCorrect) allHazardCorrect = false;

    breakdown.push(`${sc.id}:vectors:${vectorsCorrect ? 1 : 0}`);
    breakdown.push(`${sc.id}:type:${typeCorrect ? 1 : 0}`);
    breakdown.push(`${sc.id}:net:${netCorrect ? 1 : 0}`);
    breakdown.push(`${sc.id}:hazard:${hazardCorrect ? 1 : 0}`);
  }

  if (allTypesCorrect) typeScore = 1;
  if (allNetCorrect) netScore = 0.5;
  if (allHazardCorrect) hazardScore = 0.5;

  const score = vectorScore + typeScore + netScore + hazardScore;

  return {
    score: Math.round(score * 100) / 100,
    maxScore: 5,
    vectorScore,
    typeScore,
    netScore,
    hazardScore,
    breakdown,
  };
}
