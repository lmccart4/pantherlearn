// Pure mantle-convection model. No DOM, no globals. Testable in Node.

export const DEFAULTS = {
  nx: 48,
  nz: 32,
  particleCount: 420,
  baseSpeed: 0.35,
  diffusion: 0.0015,
  dt: 0.012,
};

export const QUESTIONS = [
  {
    id: "qHeat",
    prompt: {
      en: "If you increase the heat source at the core-mantle boundary, what happens to mantle circulation?",
      es: "Si aumentas la fuente de calor en el límite núcleo-manto, ¿qué le sucede a la circulación del manto?",
    },
    options: [
      { id: "speeds-up", label: { en: "It speeds up", es: "Se acelera" } },
      { id: "slows-down", label: { en: "It slows down", es: "Se desacelera" } },
      { id: "no-change", label: { en: "It stays the same", es: "Permanece igual" } },
      { id: "reverses", label: { en: "It reverses direction", es: "Invierte su dirección" } },
    ],
    correct: "speeds-up",
  },
  {
    id: "qViscosity",
    prompt: {
      en: "If mantle viscosity increases (the mantle becomes thicker/stiffer), what happens to circulation?",
      es: "Si aumenta la viscosidad del manto (el manto se vuelve más espeso/rígido), ¿qué le sucede a la circulación?",
    },
    options: [
      { id: "speeds-up", label: { en: "It speeds up", es: "Se acelera" } },
      { id: "slows-down", label: { en: "It slows down", es: "Se desacelera" } },
      { id: "no-change", label: { en: "It stays the same", es: "Permanece igual" } },
      { id: "reverses", label: { en: "It reverses direction", es: "Invierte su dirección" } },
    ],
    correct: "slows-down",
  },
  {
    id: "qDrag",
    prompt: {
      en: "How does mantle convection drag the surface plates?",
      es: "¿Cómo arrastra la convección del manto a las placas de la superficie?",
    },
    options: [
      { id: "push-only", label: { en: "Rising mantle pushes plates apart only", es: "Solo el manto ascendente empuja las placas" } },
      { id: "pull-only", label: { en: "Sinking mantle pulls plates only", es: "Solo el manto descendente jala las placas" } },
      { id: "both", label: { en: "Both rising and sinking mantle drag plates", es: "Tanto el manto ascendente como el descendente arrastran las placas" } },
      { id: "none", label: { en: "Convection does not affect plates", es: "La convección no afecta las placas" } },
    ],
    correct: "both",
  },
  {
    id: "qUpwelling",
    prompt: {
      en: "What surface feature often forms above a strong mantle upwelling?",
      es: "¿Qué característica de la superficie suele formarse sobre una fuerte ascendencia del manto?",
    },
    options: [
      { id: "ridge", label: { en: "A mid-ocean ridge / rift", es: "Una dorsal oceánica / fisura" } },
      { id: "trench", label: { en: "A deep-ocean trench", es: "Una fosa oceánica profunda" } },
      { id: "mountains", label: { en: "A mountain belt", es: "Un cinturón montañoso" } },
      { id: "none", label: { en: "No special feature", es: "Ninguna característica especial" } },
    ],
    correct: "ridge",
  },
  {
    id: "qStop",
    prompt: {
      en: "If mantle convection stopped, what would happen to plate motion over time?",
      es: "Si la convección del manto se detuviera, ¿qué le sucedería al movimiento de las placas con el tiempo?",
    },
    options: [
      { id: "keep-moving", label: { en: "Plates keep moving forever", es: "Las placas seguirían moviéndose para siempre" } },
      { id: "slow-stop", label: { en: "Plates would slow and stop", es: "Las placas se desacelerarían y se detendrían" } },
      { id: "speed-up", label: { en: "Plates would speed up", es: "Las placas se acelerarían" } },
      { id: "reverse", label: { en: "Plates would reverse direction", es: "Las placas invertirían su dirección" } },
    ],
    correct: "slow-stop",
  },
];

export function emptyAnswers() {
  const a = {};
  for (const q of QUESTIONS) a[q.id] = null;
  return a;
}

export function createModel(opts = {}) {
  const model = {
    nx: opts.nx ?? DEFAULTS.nx,
    nz: opts.nz ?? DEFAULTS.nz,
    particleCount: opts.particleCount ?? DEFAULTS.particleCount,
    baseSpeed: opts.baseSpeed ?? DEFAULTS.baseSpeed,
    diffusion: opts.diffusion ?? DEFAULTS.diffusion,
    dt: opts.dt ?? DEFAULTS.dt,
    heat: opts.heat ?? 0.55,
    viscosity: opts.viscosity ?? 1.0,
    time: 0,
    T: [],
    particles: [],
  };
  resetModel(model);
  return model;
}

export function resetModel(model) {
  const { nx, nz, particleCount } = model;
  model.T = new Array(nz).fill(0).map((_, z) =>
    new Array(nx).fill(0).map((_, x) => {
      // Initial linear gradient, slightly perturbed by horizontal position
      const base = 1 - z / (nz - 1);
      return Math.max(0, Math.min(1, base + 0.04 * Math.sin((2 * Math.PI * x) / (nx - 1))));
    })
  );
  model.particles = [];
  for (let i = 0; i < particleCount; i++) {
    model.particles.push({
      x: Math.random(),
      z: Math.random(),
      age: Math.random() * 100,
    });
  }
  model.time = 0;
}

export function setHeat(model, value) {
  model.heat = clamp(value, 0, 1);
}

export function setViscosity(model, value) {
  model.viscosity = clamp(value, 0.5, 5.0);
}

// Incompressible streamfunction for a single convection cell:
// ψ = (V/π) sin(2πx) sin(πz)
// vx = ∂ψ/∂z = V sin(2πx) cos(πz)
// vz = -∂ψ/∂x = -2V cos(2πx) sin(πz)
export function flowAt(model, x, z) {
  const V = (model.baseSpeed * model.heat) / Math.max(0.5, model.viscosity);
  const sx = Math.sin(2 * Math.PI * x);
  const cx = Math.cos(2 * Math.PI * x);
  const cz = Math.cos(Math.PI * z);
  const sz = Math.sin(Math.PI * z);
  const vx = V * sx * cz;
  const vz = -2 * V * cx * sz;
  return { vx, vz, speed: Math.hypot(vx, vz) };
}

export function stepModel(model) {
  updateTemperature(model);
  updateParticles(model);
  model.time += model.dt;
}

function updateTemperature(model) {
  const { nx, nz, T, dt, diffusion, heat } = model;
  const Tnew = T.map((row) => [...row]);

  // Boundary: hot bottom, cold top
  for (let x = 0; x < nx; x++) {
    T[0][x] = heat;
    T[nz - 1][x] = 0.0;
  }

  for (let z = 1; z < nz - 1; z++) {
    for (let x = 0; x < nx; x++) {
      const xv = x / (nx - 1);
      const zv = z / (nz - 1);
      const { vx, vz } = flowAt(model, xv, zv);

      const xl = x === 0 ? nx - 1 : x - 1;
      const xr = x === nx - 1 ? 0 : x + 1;
      const dTdx = (T[z][xr] - T[z][xl]) / 2;
      const dTdz = T[z + 1][x] - T[z - 1][x];

      // Upwind-ish advection on a unit grid
      const adv = dt * (vx * (vx > 0 ? T[z][x] - T[z][xl] : T[z][xr] - T[z][x]) +
                        vz * (vz > 0 ? T[z][x] - T[z - 1][x] : T[z + 1][x] - T[z][x]));

      const lap = T[z][xl] + T[z][xr] + T[z + 1][x] + T[z - 1][x] - 4 * T[z][x];
      Tnew[z][x] = T[z][x] - adv + diffusion * lap;
      Tnew[z][x] = clamp(Tnew[z][x], 0, 1);
    }
  }

  // Sides wrap slightly to keep a closed cell; this is a stylized model
  for (let z = 0; z < nz; z++) {
    Tnew[z][0] = Tnew[z][1];
    Tnew[z][nx - 1] = Tnew[z][nx - 2];
  }

  for (let z = 0; z < nz; z++) {
    for (let x = 0; x < nx; x++) {
      T[z][x] = Tnew[z][x];
    }
  }
}

function updateParticles(model) {
  const { dt, particles } = model;
  for (const p of particles) {
    const f = flowAt(model, p.x, p.z);
    // RK2
    const x1 = p.x + dt * f.vx;
    const z1 = p.z + dt * f.vz;
    const f2 = flowAt(model, clamp(x1, 0, 1), clamp(z1, 0, 1));
    p.x = clamp(p.x + dt * 0.5 * (f.vx + f2.vx), 0, 1);
    p.z = clamp(p.z + dt * 0.5 * (f.vz + f2.vz), 0, 1);
    p.age += 1;

    // Keep particles away from exact boundaries so they don't clump
    if (p.z < 0.02) p.z = 0.02 + Math.random() * 0.02;
    if (p.z > 0.98) p.z = 0.98 - Math.random() * 0.02;
  }
}

export function getSurfaceMetrics(model) {
  const samples = 24;
  let leftSpeed = 0;
  let rightSpeed = 0;
  let leftCount = 0;
  let rightCount = 0;
  const zTop = 0.92;
  for (let i = 0; i <= samples; i++) {
    const x = i / samples;
    const f = flowAt(model, x, zTop);
    if (x < 0.5) {
      leftSpeed += Math.max(0, -f.vx); // leftward magnitude
      leftCount++;
    } else {
      rightSpeed += Math.max(0, f.vx); // rightward magnitude
      rightCount++;
    }
  }
  return {
    leftPlateSpeed: leftCount ? leftSpeed / leftCount : 0,
    rightPlateSpeed: rightCount ? rightSpeed / rightCount : 0,
    surfaceFlowSpeed: (leftSpeed + rightSpeed) / (leftCount + rightCount || 1),
    active: model.heat > 0.05,
  };
}

export function scoreAnswers(answers) {
  let score = 0;
  const breakdown = [];
  for (const q of QUESTIONS) {
    const correct = answers[q.id] === q.correct;
    if (correct) score += 1;
    breakdown.push(`${q.id}:${correct ? 1 : 0}`);
  }
  return {
    score,
    maxScore: 5,
    breakdown,
  };
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
