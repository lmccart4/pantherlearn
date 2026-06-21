// Pure 1D collision model. No DOM, no globals. Testable in Node.

export const DEFAULT_MASS = 1500; // kg
export const DEFAULT_VELOCITY = 10; // m/s
export const DIRECTIONS = ["right", "left"];

export const COLLISION_TYPES = [
  { id: "elastic", label: { en: "Elastic (vehicles bounce)", es: "Elástica (rebotan)" } },
  { id: "inelastic", label: { en: "Inelastic (vehicles stick)", es: "Inelástica (se pegan)" } },
];

export function emptyState() {
  return {
    v1: { mass: DEFAULT_MASS, velocity: DEFAULT_VELOCITY, direction: "right" },
    v2: { mass: 2000, velocity: 8, direction: "left" },
    collisionType: "elastic",
    predictions: { v1Final: "", v2Final: "", pTotalFinal: "" },
    reasoning: "",
    ran: false,
  };
}

export function signedVelocity(vehicle) {
  const v = Number(vehicle.velocity) || 0;
  return vehicle.direction === "left" ? -v : v;
}

export function momentum(mass, velocity) {
  return mass * velocity;
}

export function totalMomentum(state) {
  return momentum(state.v1.mass, signedVelocity(state.v1)) +
         momentum(state.v2.mass, signedVelocity(state.v2));
}

export function kineticEnergy(mass, velocity) {
  return 0.5 * mass * velocity * velocity;
}

export function totalKineticEnergy(state) {
  return kineticEnergy(state.v1.mass, signedVelocity(state.v1)) +
         kineticEnergy(state.v2.mass, signedVelocity(state.v2));
}

export function solveCollision(state) {
  const m1 = Number(state.v1.mass) || 0;
  const m2 = Number(state.v2.mass) || 0;
  const u1 = signedVelocity(state.v1);
  const u2 = signedVelocity(state.v2);
  const pTotal = m1 * u1 + m2 * u2;
  const keBefore = 0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2;

  let v1Final, v2Final, keAfter;
  if (state.collisionType === "inelastic") {
    const vFinal = pTotal / (m1 + m2);
    v1Final = vFinal;
    v2Final = vFinal;
    keAfter = 0.5 * (m1 + m2) * vFinal * vFinal;
  } else {
    // Elastic: 1D velocity formulas derived from conservation of momentum + kinetic energy.
    const M = m1 + m2;
    v1Final = ((m1 - m2) * u1 + 2 * m2 * u2) / M;
    v2Final = (2 * m1 * u1 + (m2 - m1) * u2) / M;
    keAfter = 0.5 * m1 * v1Final * v1Final + 0.5 * m2 * v2Final * v2Final;
  }

  return {
    v1Final,
    v2Final,
    pTotal,
    pTotalAfter: pTotal,
    keBefore,
    keAfter,
  };
}

function withinTolerance(actual, predicted, relTol = 0.1, absTol = 0.5) {
  if (predicted === "" || predicted == null || Number.isNaN(Number(predicted))) return false;
  const p = Number(predicted);
  const diff = Math.abs(p - actual);
  const threshold = Math.max(absTol, Math.abs(actual) * relTol);
  return diff <= threshold;
}

export function scorePrediction(state) {
  const result = solveCollision(state);
  const pred = state.predictions || {};

  const v1Ok = withinTolerance(result.v1Final, pred.v1Final);
  const v2Ok = withinTolerance(result.v2Final, pred.v2Final);
  const pOk = withinTolerance(result.pTotal, pred.pTotalFinal, 0.1, 100);

  let score = 0;
  if (v1Ok) score += 2;
  if (v2Ok) score += 2;
  if (pOk) score += 1;

  return {
    score,
    maxScore: 5,
    v1Ok,
    v2Ok,
    pOk,
    actual: result,
    breakdown: [`v1':${v1Ok ? 2 : 0}`, `v2':${v2Ok ? 2 : 0}`, `pTotal:${pOk ? 1 : 0}`],
  };
}

export function formatNumber(n, digits = 2) {
  if (n === null || n === undefined || Number.isNaN(n)) return "—";
  const rounded = Number(n).toFixed(digits);
  return rounded;
}
