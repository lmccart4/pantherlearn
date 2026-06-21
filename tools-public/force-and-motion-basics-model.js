// Pure force-and-motion model for Newton's 2nd law (a = F/m). No DOM, no globals. Testable in Node.

export const PARAMS = {
  force: { min: 0, max: 20, step: 1, default: 8, unit: "N" },
  mass: { min: 1, max: 10, step: 1, default: 2, unit: "kg" },
};

function clampRound(v, spec) {
  const n = Number(v);
  if (!Number.isFinite(n)) return spec.default;
  const raw = Math.max(spec.min, Math.min(spec.max, n));
  const rounded = Math.round(raw / spec.step) * spec.step;
  return Math.round(rounded * 100) / 100;
}

export function createState(initial = {}) {
  return {
    force: clampRound(initial.force, PARAMS.force),
    mass: clampRound(initial.mass, PARAMS.mass),
  };
}

// Newton's second law: a = F / m. Guard mass > 0 (never divide by zero).
export function acceleration(force, mass) {
  const F = Number(force);
  const m = Number(mass);
  if (!Number.isFinite(F) || !Number.isFinite(m) || m <= 0) return 0;
  return Math.round((F / m) * 100) / 100;
}

export function stateAcceleration(state) {
  return acceleration(state.force, state.mass);
}

function close(a, b, tol) {
  const n = Number(a);
  if (!Number.isFinite(n)) return false;
  return Math.abs(n - b) <= tol;
}

// The five scored prediction questions (correct ids fixed for the lesson).
// q1 double force, same mass -> acceleration doubles
// q2 double mass, same force -> acceleration halves
// q3 same push, cart vs loaded truck -> cart (less mass) accelerates more
// q4 numeric: a for F=12 N, m=3 kg -> 4 m/s^2
// q5 the relationship a = F/m means a is ... to mass -> inversely proportional
export const QUESTIONS = [
  { id: "doubleForce", correct: "doubles" },
  { id: "doubleMass", correct: "halves" },
  { id: "cartVsTruck", correct: "cart" },
  { id: "numericA", correct: 4, numeric: true, tol: 0.1 },
  { id: "massRelation", correct: "inverse" },
];

export function answersComplete(answers = {}) {
  const filled = (v) => v !== null && v !== undefined && String(v).trim() !== "";
  return QUESTIONS.every((q) => filled(answers[q.id]));
}

export function scoreQuestions(state, answers = {}) {
  const breakdown = [];
  let correct = 0;

  for (const q of QUESTIONS) {
    const given = answers[q.id];
    let ok;
    if (q.numeric) {
      ok = close(given, q.correct, q.tol);
    } else {
      ok = given === q.correct;
    }
    if (ok) correct += 1;
    breakdown.push(`${q.id}:${ok ? 1 : 0}`);
  }

  const total = QUESTIONS.length;
  const score = Math.round((correct / total) * 5 * 100) / 100;
  return { score, maxScore: 5, correct, total, breakdown };
}
