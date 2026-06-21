// Pure vector-addition model. No DOM, no globals. Testable in Node.
// Intro-level qualitative vector addition of COLLINEAR forces on a tectonic plate.
// Convention: East = positive, West = negative. Net force = signed sum.
// Balanced iff net === 0. Direction of acceleration = sign of net.

// Each force: { id, label (DICT key), magnitude (positive units), dir: "east" | "west" }.
// Each scenario asks the student two things:
//   1) directionChoice: "east" | "west" | "none"   (which way the plate accelerates)
//   2) balanceChoice:   "balanced" | "unbalanced"  (is the net force zero?)
export const SCENARIOS = [
  {
    id: "s1",
    titleKey: "s1Title",
    forces: [
      { id: "ridge", label: "fRidgePush", magnitude: 6, dir: "east" },
      { id: "drag", label: "fMantleDrag", magnitude: 6, dir: "west" },
    ],
  },
  {
    id: "s2",
    titleKey: "s2Title",
    forces: [
      { id: "ridge", label: "fRidgePush", magnitude: 6, dir: "east" },
      { id: "slab", label: "fSlabPull", magnitude: 4, dir: "east" },
      { id: "drag", label: "fMantleDrag", magnitude: 8, dir: "west" },
    ],
  },
  {
    id: "s3",
    titleKey: "s3Title",
    forces: [
      { id: "slab", label: "fSlabPull", magnitude: 9, dir: "east" },
      { id: "drag", label: "fMantleDrag", magnitude: 5, dir: "west" },
    ],
  },
  {
    id: "s4",
    titleKey: "s4Title",
    forces: [
      { id: "ridge", label: "fRidgePush", magnitude: 3, dir: "west" },
      { id: "collide", label: "fCollision", magnitude: 7, dir: "west" },
      { id: "drag", label: "fMantleDrag", magnitude: 4, dir: "east" },
    ],
  },
];

// Signed value of a single force: East positive, West negative.
export function signedForce(force) {
  const sign = force.dir === "west" ? -1 : 1;
  return sign * Math.abs(Number(force.magnitude) || 0);
}

// Net of collinear forces = signed sum. Returns { net, magnitude, direction, balanced }.
export function netForce(scenario) {
  const net = scenario.forces.reduce((sum, f) => sum + signedForce(f), 0);
  const direction = net > 0 ? "east" : net < 0 ? "west" : "none";
  return {
    net,
    magnitude: Math.abs(net),
    direction,
    balanced: net === 0,
  };
}

// Correct answers for a scenario's two questions.
export function correctAnswer(scenario) {
  const nf = netForce(scenario);
  return {
    direction: nf.direction, // "east" | "west" | "none"
    balance: nf.balanced ? "balanced" : "unbalanced",
  };
}

// A scenario answer is complete when both questions are answered.
function scenarioAnswered(a) {
  return !!a && !!a.directionChoice && !!a.balanceChoice;
}

// All scenarios answered → the natural "done" state for auto-send.
export function answersComplete(state = {}) {
  const answers = state.answers || {};
  return SCENARIOS.every((s) => scenarioAnswered(answers[s.id]));
}

// A scenario is correct only if BOTH the direction AND the balanced/unbalanced
// classification match. (One point per scenario, all-or-nothing.)
export function isScenarioCorrect(scenario, answer) {
  if (!scenarioAnswered(answer)) return false;
  const correct = correctAnswer(scenario);
  return (
    answer.directionChoice === correct.direction &&
    answer.balanceChoice === correct.balance
  );
}

// Score = (correct scenarios / total) * 5, rounded to 2 decimals, clamped to [0,5].
export function scoreScenarios(state = {}) {
  const answers = state.answers || {};
  const total = SCENARIOS.length;
  let correct = 0;
  const breakdown = [];
  for (const s of SCENARIOS) {
    const ok = isScenarioCorrect(s, answers[s.id]);
    if (ok) correct += 1;
    breakdown.push(`${s.id}:${ok ? 1 : 0}`);
  }
  const raw = total > 0 ? (correct / total) * 5 : 0;
  const score = Math.min(5, Math.max(0, Math.round(raw * 100) / 100));
  return { score, maxScore: 5, correct, total, breakdown };
}
