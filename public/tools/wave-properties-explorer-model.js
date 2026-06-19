// Pure wave-properties model. No DOM, no globals. Testable in Node.

export const PARAMS = {
  amplitude: { min: 0.5, max: 3.0, step: 0.1, default: 1.5, unit: "m" },
  wavelength: { min: 1.0, max: 8.0, step: 0.2, default: 4.0, unit: "m" },
  frequency: { min: 0.2, max: 2.0, step: 0.1, default: 1.0, unit: "Hz" },
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
    amplitude: clampRound(initial.amplitude, PARAMS.amplitude),
    wavelength: clampRound(initial.wavelength, PARAMS.wavelength),
    frequency: clampRound(initial.frequency, PARAMS.frequency),
  };
}

export function waveY(x, state, time = 0) {
  const { amplitude, wavelength, frequency } = state;
  return amplitude * Math.sin(2 * Math.PI * (x / wavelength - frequency * time));
}

export function waveSpeed(state) {
  return Math.round(state.frequency * state.wavelength * 100) / 100;
}

export function wavePeriod(state) {
  return Math.round((1 / state.frequency) * 100) / 100;
}

export function sampleWave(state, opts = {}) {
  const { xMin = 0, xMax = 12, steps = 240, time = 0 } = opts;
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + (xMax - xMin) * (i / steps);
    pts.push({ x, y: waveY(x, state, time) });
  }
  return pts;
}

function close(a, b, tol) {
  const n = Number(a);
  if (!Number.isFinite(n)) return false;
  return Math.abs(n - b) <= tol;
}

export function checkAnswers(state, answers = {}) {
  const speed = waveSpeed(state);
  const breakdown = [];
  let score = 0;

  const ampOk = close(answers.amplitudeRead, state.amplitude, 0.2);
  if (ampOk) score += 1;
  breakdown.push(`amplitudeRead:${ampOk ? 1 : 0}`);

  const lambdaOk = close(answers.wavelengthRead, state.wavelength, 0.3);
  if (lambdaOk) score += 1;
  breakdown.push(`wavelengthRead:${lambdaOk ? 1 : 0}`);

  const speedOk = close(answers.speedCalc, speed, 0.3);
  if (speedOk) score += 1;
  breakdown.push(`speedCalc:${speedOk ? 1 : 0}`);

  const doubleFOk = answers.predDoubleF === "doubles";
  if (doubleFOk) score += 1;
  breakdown.push(`predDoubleF:${doubleFOk ? 1 : 0}`);

  const lambdaUpOk = answers.predLambdaUp === "increases";
  if (lambdaUpOk) score += 1;
  breakdown.push(`predLambdaUp:${lambdaUpOk ? 1 : 0}`);

  return { score, maxScore: 5, breakdown };
}
