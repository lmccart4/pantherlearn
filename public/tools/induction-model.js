// Pure model of electromagnetic induction in a rotating coil. No DOM.
// EMF ∝ N·ω·B (Faraday); current here is in relative units (K scales to readable numbers).
const K = 0.02;

export function inducedPeak(rpm, coils, field = 1) {
  const omega = (rpm * 2 * Math.PI) / 60; // rad/s
  return K * coils * omega * field;
}

export function currentAt(angleDeg, rpm, coils, field = 1) {
  return inducedPeak(rpm, coils, field) * Math.cos((angleDeg * Math.PI) / 180);
}

export function waveform(rpm, coils, field = 1, samples = 24) {
  const out = [];
  for (let i = 0; i < samples; i++) {
    const angle = (360 / samples) * i;
    out.push({ angle, current: currentAt(angle, rpm, coils, field) });
  }
  return out;
}

// Five conceptual predictions about what changes the induced current.
export const PREDICTION_KEY = [
  { prompt: "Spin the magnet faster. The current…", answer: "up" },
  { prompt: "Add more coils. The current…", answer: "up" },
  { prompt: "Stop the magnet (hold it still). The current…", answer: "down" },
  { prompt: "Use a stronger magnet. The current…", answer: "up" },
  { prompt: "Keep everything the same. The current…", answer: "same" },
];

export function scorePredictions(answers) {
  let score = 0;
  PREDICTION_KEY.forEach((p, i) => { if (answers[i] === p.answer) score += 1; });
  return { score, maxScore: PREDICTION_KEY.length };
}
