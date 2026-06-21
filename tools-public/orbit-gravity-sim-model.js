// Pure orbital-mechanics model. No DOM, no globals. Testable in Node.

export const G_SI = 6.67430e-11; // N·m²/kg²

export const PRESETS = {
  sun: {
    id: "sun",
    massKg: 1.9885e30,
    bodyRadiusM: 6.957e8,
    distanceScaleM: 1.496e11, // 1 AU
    velocityScaleM: 1000,     // 1 km/s
    timeScaleS: 3.15576e7,    // 1 yr
    distanceUnit: "AU",
    velocityUnit: "km/s",
    timeUnit: "yr",
  },
  earth: {
    id: "earth",
    massKg: 5.972e24,
    bodyRadiusM: 6.371e6,
    distanceScaleM: 6.371e6, // 1 Earth radius
    velocityScaleM: 1000,
    timeScaleS: 3600,        // 1 hr
    distanceUnit: "R⊕",
    velocityUnit: "km/s",
    timeUnit: "hr",
  },
};

export const MODES = {
  learn: { id: "learn", label: { en: "Learn", es: "Aprender" } },
  ellipses: { id: "ellipses", label: { en: "Ellipses", es: "Elipses" } },
  deflect: { id: "deflect", label: { en: "Deflect", es: "Desviar" } },
};

export const ORBIT_SHAPES = ["circular", "elliptical", "parabolic", "hyperbolic"];

export const DEFAULT_PARAMS = {
  learn: {
    presetId: "sun",
    orbiterMassKg: 1000,
    distanceDisplay: 1.0,    // AU
    velocityDisplay: 29.8,   // km/s
    prediction: null, // student prediction — starts UNSELECTED so the default can't auto-score 0/5
  },
  ellipses: {
    presetId: "sun",
    orbiterMassKg: 1000,
    distanceDisplay: 1.0,
    velocityDisplay: 25.0,
    targetEccentricity: 0.5,
  },
  deflect: {
    presetId: "earth",
    orbiterMassKg: 1e12,     // asteroid-ish; mass does not affect orbit in F=m*a cancellation
    distanceDisplay: 5.0,    // Earth radii
    velocityDisplay: 3.0,    // km/s
    missThresholdDisplay: 1.0, // Earth radii
  },
};

export function toSI(params) {
  const preset = PRESETS[params.presetId];
  if (!preset) throw new Error("Unknown preset: " + params.presetId);
  return {
    preset,
    centralMassKg: preset.massKg,
    orbiterMassKg: params.orbiterMassKg ?? 1,
    r0: (params.distanceDisplay ?? 1) * preset.distanceScaleM,
    vTan0: (params.velocityDisplay ?? 1) * preset.velocityScaleM,
    bodyRadiusM: preset.bodyRadiusM,
  };
}

export function displayFromSI(valueSI, preset, kind) {
  if (kind === "distance") return valueSI / preset.distanceScaleM;
  if (kind === "velocity") return valueSI / preset.velocityScaleM;
  if (kind === "time") return valueSI / preset.timeScaleS;
  return valueSI;
}

export function formatDistance(displayValue, preset) {
  return `${displayValue.toFixed(2)} ${preset.distanceUnit}`;
}

export function formatVelocity(displayValue, preset) {
  return `${displayValue.toFixed(2)} ${preset.velocityUnit}`;
}

export function formatTime(displayValue, preset) {
  return `${displayValue.toFixed(2)} ${preset.timeUnit}`;
}

// Velocity Verlet integration for F = -G M m / r^3 * r_vec
export function integrate(params, options = {}) {
  const si = toSI(params);
  const { preset, centralMassKg, r0, vTan0, bodyRadiusM } = si;
  const GM = G_SI * centralMassKg;

  // Default: simulate until either maxTime or maxSteps
  const dtBase = params.presetId === "earth" ? 10 : 86400; // s per integration step
  const maxSteps = options.maxSteps ?? 50000;
  const maxTime = options.maxTime ?? (params.presetId === "earth" ? 86400 * 7 : 3.15576e7 * 3); // 1 week / 3 yr
  const sampleEvery = options.sampleEvery ?? Math.max(1, Math.floor(maxSteps / 2000));

  let x = r0;
  let y = 0;
  let vx = 0;
  let vy = vTan0;

  let t = 0;
  const samples = [];

  function accel(px, py) {
    const r2 = px * px + py * py;
    const r = Math.sqrt(r2);
    if (r === 0) return { ax: 0, ay: 0, r: 0 };
    const a = -GM / r2;
    return { ax: a * (px / r), ay: a * (py / r), r };
  }

  function pushSample() {
    const r = Math.sqrt(x * x + y * y);
    const speed = Math.sqrt(vx * vx + vy * vy);
    samples.push({ t, x, y, vx, vy, r, speed });
  }

  let minR = r0;
  let maxR = r0;
  let hit = false;

  pushSample();

  for (let i = 0; i < maxSteps && t < maxTime; i++) {
    const { ax, ay, r } = accel(x, y);
    if (r <= bodyRadiusM) {
      hit = true;
      break;
    }
    minR = Math.min(minR, r);
    maxR = Math.max(maxR, r);

    vx += 0.5 * ax * dtBase;
    vy += 0.5 * ay * dtBase;
    x += vx * dtBase;
    y += vy * dtBase;
    t += dtBase;

    const a2 = accel(x, y);
    vx += 0.5 * a2.ax * dtBase;
    vy += 0.5 * a2.ay * dtBase;

    if (i % sampleEvery === 0) pushSample();
  }

  // Final sample for completeness
  pushSample();

  const summary = summarize(samples, GM, bodyRadiusM);
  return { samples, summary, hit, minR, maxR, t };
}

function summarize(samples, GM, bodyRadiusM) {
  if (!samples.length) return { shape: "none" };

  const minR = Math.min(...samples.map(s => s.r));
  const maxR = Math.max(...samples.map(s => s.r));
  const speeds = samples.map(s => s.speed);
  const minSpeed = Math.min(...speeds);
  const maxSpeed = Math.max(...speeds);

  // Use last sample for specific energy and angular momentum.
  const s0 = samples[0];
  const r0 = s0.r;
  const v0 = s0.speed;
  const h = Math.abs(s0.x * s0.vy - s0.y * s0.vx); // specific angular momentum
  const energy = 0.5 * v0 * v0 - GM / r0;          // specific orbital energy

  let shape = "elliptical";
  let eccentricity = 0;
  let semiMajorAxis = 0;
  let period = null;

  if (minR <= bodyRadiusM) {
    shape = "impact";
  } else if (h === 0) {
    shape = "impact"; // radial fall (degenerate)
  } else if (energy < 0) {
    shape = "elliptical";
    semiMajorAxis = -GM / (2 * energy);
    eccentricity = Math.sqrt(1 + (2 * energy * h * h) / (GM * GM));
    if (eccentricity < 0.05) shape = "circular";
    period = 2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / GM);
  } else if (Math.abs(energy) < 1e-3 * Math.abs(GM / r0)) {
    shape = "parabolic";
    eccentricity = 1;
  } else {
    shape = "hyperbolic";
    eccentricity = Math.sqrt(1 + (2 * energy * h * h) / (GM * GM));
  }

  return {
    shape,
    eccentricity: Math.min(eccentricity, 9.99),
    semiMajorAxis,
    period,
    minR,
    maxR,
    minSpeed,
    maxSpeed,
  };
}

export function scoreLearn(params, result) {
  const predicted = params.prediction;
  if (!predicted || !result.summary) return { score: 0, maxScore: 5, breakdown: "no-prediction:0" };
  const actual = result.summary.shape;
  if (actual === "impact") {
    // If they predicted impact, that's not a standard orbit shape; treat as mismatch unless
    // they picked hyperbolic and it hit on the way out? For simplicity: impact = 0 unless they predicted elliptical and grazing? No.
    return { score: 0, maxScore: 5, breakdown: `predicted:${predicted},actual:impact:0` };
  }
  const match = predicted === actual;
  return {
    score: match ? 5 : 0,
    maxScore: 5,
    breakdown: `predicted:${predicted},actual:${actual}:${match ? 5 : 0}`,
  };
}

export function scoreEllipses(params, result) {
  const target = params.targetEccentricity ?? DEFAULT_PARAMS.ellipses.targetEccentricity;
  if (result.hit || result.summary.shape === "impact" || result.summary.shape === "parabolic" || result.summary.shape === "hyperbolic") {
    return { score: 0, maxScore: 5, breakdown: `shape:${result.summary.shape}:0` };
  }
  const e = result.summary.eccentricity ?? 0;
  const err = Math.abs(e - target);
  let score = 0;
  if (err <= 0.05) score = 5;
  else if (err <= 0.15) score = 3;
  else if (err <= 0.30) score = 1;
  return { score, maxScore: 5, breakdown: `target:${target},actual:${e.toFixed(3)},err:${err.toFixed(3)}:${score}` };
}

export function scoreDeflect(params, result) {
  const preset = PRESETS[params.presetId];
  const missDisplay = displayFromSI(result.minR - preset.bodyRadiusM, preset, "distance");
  const threshold = params.missThresholdDisplay ?? DEFAULT_PARAMS.deflect.missThresholdDisplay;
  if (result.hit) {
    return { score: 0, maxScore: 5, missDisplay, breakdown: "impact:0" };
  }
  let score = 0;
  if (missDisplay >= threshold) score = 5;
  else if (missDisplay >= threshold * 0.5) score = 3;
  else score = 1;
  return { score, maxScore: 5, missDisplay, breakdown: `miss:${missDisplay.toFixed(2)}R⊕,threshold:${threshold}:${score}` };
}

export function computeScore(mode, params, result) {
  if (mode === "ellipses") return scoreEllipses(params, result);
  if (mode === "deflect") return scoreDeflect(params, result);
  return scoreLearn(params, result);
}

export function getModeConfig(mode) {
  return MODES[mode] ?? MODES.learn;
}
