// Pure stopping-distance model. No DOM, no globals. Testable in Node.
//
// Physics (matches the Unit 3 L03 reference table exactly):
//   reactionDistance = speed(mph) * FT_PER_S_PER_MPH * reactionTime(s)   -> linear in speed
//   brakingDistance  = K * speed^2                                       -> quadratic in speed
//   totalDistance    = reactionDistance + brakingDistance
//
// FT_PER_S_PER_MPH = 1.46667 (1 mph = 1.46667 ft/s).
// K = 0.05 ft/mph^2 reproduces braking 20->20, 30->45, 40->80, 50->125, 60->180 ft.

export const FT_PER_S_PER_MPH = 1.46667;
export const K = 0.05; // braking-distance constant, ft per (mph)^2

export const PARAMS = {
  speed: { min: 20, max: 80, step: 5, default: 40, unit: "mph" },
  reactionTime: { min: 1.0, max: 3.0, step: 0.1, default: 1.5, unit: "s" },
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
    speed: clampRound(initial.speed, PARAMS.speed),
    reactionTime: clampRound(initial.reactionTime, PARAMS.reactionTime),
  };
}

// Reaction distance: linear in speed, linear in reaction time. Feet.
export function reactionDistance(state) {
  const d = state.speed * FT_PER_S_PER_MPH * state.reactionTime;
  return Math.round(d * 10) / 10;
}

// Braking distance: proportional to speed squared. Feet.
export function brakingDistance(state) {
  const d = K * state.speed * state.speed;
  return Math.round(d * 10) / 10;
}

// Total stopping distance = reaction + braking. Feet.
export function totalDistance(state) {
  return Math.round((reactionDistance(state) + brakingDistance(state)) * 10) / 10;
}

function close(a, b, tol) {
  const n = Number(a);
  if (!Number.isFinite(n)) return false;
  return Math.abs(n - b) <= tol;
}

function filled(v) {
  return v !== null && v !== undefined && String(v).trim() !== "";
}

// All five scored questions answered? (drives one-shot auto-send)
export function answersComplete(answers = {}) {
  return (
    filled(answers.predDoubleSpeed) &&
    filled(answers.predBiggerPart) &&
    filled(answers.predDoubleReaction) &&
    filled(answers.totalCalc) &&
    filled(answers.reactionCalc)
  );
}

// Score the 5 questions against the current explorer state.
// Two numeric items are graded against the live tool values (tolerance), so
// they only resolve once the student sets the matching slider state.
export function scoreQuestions(state, answers = {}) {
  const breakdown = [];
  let score = 0;

  // Q1 (conceptual): double speed -> braking distance ~quadruples.
  const q1 = answers.predDoubleSpeed === "quadruples";
  if (q1) score += 1;
  breakdown.push(`predDoubleSpeed:${q1 ? 1 : 0}`);

  // Q2 (conceptual): at highway speed, braking is the bigger part of stopping.
  const q2 = answers.predBiggerPart === "braking";
  if (q2) score += 1;
  breakdown.push(`predBiggerPart:${q2 ? 1 : 0}`);

  // Q3 (conceptual): double reaction time -> reaction distance doubles.
  const q3 = answers.predDoubleReaction === "doubles";
  if (q3) score += 1;
  breakdown.push(`predDoubleReaction:${q3 ? 1 : 0}`);

  // Q4 (numeric): total stopping distance for the CURRENT tool state. +-4 ft.
  const q4 = close(answers.totalCalc, totalDistance(state), 4);
  if (q4) score += 1;
  breakdown.push(`totalCalc:${q4 ? 1 : 0}`);

  // Q5 (numeric): reaction distance for the CURRENT tool state. +-3 ft.
  const q5 = close(answers.reactionCalc, reactionDistance(state), 3);
  if (q5) score += 1;
  breakdown.push(`reactionCalc:${q5 ? 1 : 0}`);

  // 5 questions -> score out of 5 (already 1 pt each here); keep the (correct/total)*5 shape explicit.
  const total = 5;
  const scaled = Math.round((score / total) * 5 * 100) / 100;
  return { score: scaled, maxScore: 5, correct: score, total, breakdown };
}
