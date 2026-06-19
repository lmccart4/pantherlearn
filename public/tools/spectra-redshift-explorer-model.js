// Pure spectra / redshift model. No DOM, no globals. Testable in Node.

export const ELEMENTS = ["H", "He", "Na", "Ca"];

export const REFERENCE_LINES = {
  H:  [410.0, 434.0, 486.0, 656.3],
  He: [447.0, 471.0, 492.0, 501.0, 587.0, 667.0],
  Na: [589.0, 589.6],
  Ca: [422.7, 430.2, 559.8, 616.2],
};

export const ELEMENT_LABELS = {
  H:  { en: "Hydrogen",  es: "Hidrógeno" },
  He: { en: "Helium",    es: "Helio" },
  Na: { en: "Sodium",    es: "Sodio" },
  Ca: { en: "Calcium",   es: "Calcio" },
};

export const SPECTRUM_RANGE = { min: 400, max: 700 };
export const SPEED_OF_LIGHT_KMS = 300000; // km/s

// Deterministic pseudo-random generator (mulberry32).
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateIdentifyStars(seed = 12345) {
  const rng = mulberry32(seed);
  const pool = [
    ["H"],
    ["H", "Na"],
    ["H", "Ca"],
    ["He", "H"],
    ["Na", "Ca"],
    ["He", "Na"],
    ["H", "He", "Ca"],
  ];
  const chosen = [];
  for (let i = 0; i < 5; i++) {
    const idx = Math.floor(rng() * pool.length);
    const elements = pool[idx].slice().sort();
    chosen.push({
      id: `star-${i}`,
      elements,
      lines: elements.flatMap((el) =>
        REFERENCE_LINES[el].map((wavelength) => ({ wavelength, element: el }))
      ),
    });
  }
  return chosen;
}

export function generateRedshiftGalaxies(seed = 67890) {
  const rng = mulberry32(seed);
  const baseLines = [656.3, 486.0, 434.0, 589.0]; // H-alpha, H-beta, H-gamma, Na-D
  const galaxies = [];
  for (let i = 0; i < 5; i++) {
    const restWavelength = baseLines[i % baseLines.length];
    const z = 0.03 + rng() * 0.12; // z between ~0.03 and ~0.15
    const observedWavelength = restWavelength * (1 + z);
    galaxies.push({
      id: `galaxy-${i}`,
      restWavelength: Math.round(restWavelength * 10) / 10,
      observedWavelength: Math.round(observedWavelength * 10) / 10,
      z: Math.round(z * 1000) / 1000,
    });
  }
  return galaxies;
}

export function scoreIdentify(star, selected) {
  const expected = new Set(star.elements);
  const actual = new Set(selected);
  if (expected.size !== actual.size) return false;
  for (const el of expected) if (!actual.has(el)) return false;
  return true;
}

export function scoreRedshift(galaxy, measuredWavelength, inferredZ, inferredVelocity, toleranceZ = 0.005) {
  const zMeasured = (measuredWavelength - galaxy.restWavelength) / galaxy.restWavelength;
  const zOk = Math.abs(zMeasured - galaxy.z) <= toleranceZ;
  const correctVelocity = Math.round(galaxy.z * SPEED_OF_LIGHT_KMS);
  const velocityTolerance = Math.max(100, Math.round(toleranceZ * SPEED_OF_LIGHT_KMS));
  const vOk = Math.abs(inferredVelocity - correctVelocity) <= velocityTolerance;
  return {
    zOk,
    vOk,
    correctZ: galaxy.z,
    correctV: correctVelocity,
    measuredZ: Math.round(zMeasured * 1000) / 1000,
  };
}

export function scoreIdentifyState(stars, selections) {
  let score = 0;
  const breakdown = [];
  for (const star of stars) {
    const selected = selections[star.id] || [];
    const ok = scoreIdentify(star, selected);
    if (ok) score += 1;
    breakdown.push({ id: star.id, ok, selected, expected: star.elements });
  }
  return { score, maxScore: stars.length, breakdown };
}

export function scoreRedshiftState(galaxies, measurements) {
  let score = 0;
  const breakdown = [];
  for (const galaxy of galaxies) {
    const m = measurements[galaxy.id] || {};
    const r = scoreRedshift(
      galaxy,
      m.measuredWavelength || 0,
      m.inferredZ || 0,
      m.inferredVelocity || 0
    );
    const ok = r.zOk && r.vOk;
    if (ok) score += 1;
    breakdown.push({ id: galaxy.id, ok, ...r });
  }
  return { score, maxScore: galaxies.length, breakdown };
}
