// Pure stellar life-cycle model. No DOM, no globals. Testable in Node.

export const STAGES = [
  { id: "nebula", label: { en: "Nebula", es: "Nebulosa" } },
  { id: "protostar", label: { en: "Protostar", es: "Protostrella" } },
  { id: "main-sequence", label: { en: "Main-Sequence Star", es: "Estrella de secuencia principal" } },
  { id: "red-giant", label: { en: "Red Giant", es: "Gigante roja" } },
  { id: "planetary-nebula", label: { en: "Planetary Nebula", es: "Nebulosa planetaria" } },
  { id: "white-dwarf", label: { en: "White Dwarf", es: "Enana blanca" } },
  { id: "supernova", label: { en: "Supernova", es: "Supernova" } },
  { id: "neutron-star", label: { en: "Neutron Star", es: "Estrella de neutrones" } },
  { id: "black-hole", label: { en: "Black Hole", es: "Agujero negro" } },
];

export const FINAL_OPTIONS = [
  { id: "white-dwarf", label: { en: "White dwarf", es: "Enana blanca" } },
  { id: "neutron-star", label: { en: "Neutron star", es: "Estrella de neutrones" } },
  { id: "black-hole", label: { en: "Black hole", es: "Agujero negro" } },
];

export const TRACKS = [
  {
    id: "low",
    title: { en: "Low-Mass Star", es: "Estrella de poca masa" },
    subtitle: { en: "About the mass of our Sun or smaller", es: "Aproximadamente la masa de nuestro Sol o menor" },
    stagePool: ["nebula", "protostar", "main-sequence", "red-giant", "planetary-nebula", "white-dwarf"],
    sequenceLength: 6,
    correctOrder: ["nebula", "protostar", "main-sequence", "red-giant", "planetary-nebula", "white-dwarf"],
    acceptedFinals: ["white-dwarf"],
  },
  {
    id: "medium",
    title: { en: "Medium-Mass Star", es: "Estrella de masa mediana" },
    subtitle: { en: "A few times the mass of our Sun", es: "Algunas veces la masa de nuestro Sol" },
    stagePool: ["nebula", "protostar", "main-sequence", "red-giant", "planetary-nebula", "white-dwarf"],
    sequenceLength: 6,
    correctOrder: ["nebula", "protostar", "main-sequence", "red-giant", "planetary-nebula", "white-dwarf"],
    acceptedFinals: ["white-dwarf"],
  },
  {
    id: "high",
    title: { en: "High-Mass Star", es: "Estrella de gran masa" },
    subtitle: { en: "Much more massive than our Sun", es: "Mucho más masiva que nuestro Sol" },
    stagePool: ["nebula", "protostar", "main-sequence", "red-giant", "supernova", "neutron-star", "black-hole"],
    sequenceLength: 6,
    correctOrder: ["nebula", "protostar", "main-sequence", "red-giant", "supernova", null],
    acceptedFinals: ["neutron-star", "black-hole"],
  },
];

export function stageLabel(id) {
  const s = STAGES.find((x) => x.id === id);
  return s ? s.label : { en: "", es: "" };
}

export function emptyState() {
  const state = {};
  for (const t of TRACKS) {
    state[t.id] = { sequence: Array(t.sequenceLength).fill(null), finalStage: null };
  }
  return state;
}

export function isComplete(state) {
  for (const t of TRACKS) {
    const s = state[t.id];
    if (!s) return false;
    if (s.sequence.some((x) => !x)) return false;
    if (!s.finalStage) return false;
  }
  return true;
}

function sequenceCorrect(track, seq) {
  for (let i = 0; i < track.correctOrder.length; i++) {
    const expected = track.correctOrder[i];
    const actual = seq[i];
    if (expected === null) {
      if (!track.acceptedFinals.includes(actual)) return false;
    } else if (actual !== expected) {
      return false;
    }
  }
  return true;
}

export function scoreState(state) {
  let sequenceScore = 0;
  const breakdown = [];

  for (const t of TRACKS) {
    const s = state[t.id] || {};
    const seq = s.sequence || [];
    const seqOk = sequenceCorrect(t, seq);
    if (seqOk) sequenceScore += 1;
    breakdown.push(`${t.id}:sequence:${seqOk ? 1 : 0}`);

    const finalOk = t.acceptedFinals.includes(s.finalStage);
    breakdown.push(`${t.id}:final:${finalOk ? 1 : 0}`);
  }

  const lowFinal = (state.low?.finalStage) === "white-dwarf";
  const medFinal = (state.medium?.finalStage) === "white-dwarf";
  const highFinal = TRACKS.find((t) => t.id === "high").acceptedFinals.includes(state.high?.finalStage);

  let fateScore = 0;
  if (lowFinal && medFinal) fateScore += 1;
  if (highFinal) fateScore += 1;

  const score = sequenceScore + fateScore;
  return {
    score: Math.round(score * 100) / 100,
    maxScore: 5,
    sequenceScore,
    fateScore,
    breakdown,
  };
}
