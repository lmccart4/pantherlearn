import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════
// BATTLESHIP QUIZ FRAMEWORK — "OPERATION RED TIDE"
// Cold War Naval Command Center Aesthetic
// Reusable quiz engine: swap questions JSON for any subject
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// ENERGY TYPES & TRANSFERS — REAL-WORLD SYSTEMS
// Swap this array for any subject to reuse the framework.
// ═══════════════════════════════════════════════════════════════
const SAMPLE_QUESTIONS = [
  // ── IDENTIFYING ENERGY TYPES ──────────────────────────────
  {
    id: "e1",
    type: "multiple_choice",
    prompt: "A skateboarder standing at the top of a half-pipe has maximum _____ energy.",
    options: [
      "Kinetic",
      "Gravitational potential",
      "Elastic potential",
      "Thermal"
    ],
    correctIndex: 1,
    explanation: "At the top of the ramp, the skateboarder is high up and stationary — all of their mechanical energy is stored as gravitational potential energy (GPE = mgh)."
  },
  {
    id: "e2",
    type: "multiple_choice",
    prompt: "When you stretch a rubber band, what type of energy are you storing?",
    options: [
      "Chemical energy",
      "Kinetic energy",
      "Elastic potential energy",
      "Nuclear energy"
    ],
    correctIndex: 2,
    explanation: "Stretching or compressing an elastic object stores elastic potential energy. When you release the rubber band, that stored energy converts into kinetic energy."
  },
  {
    id: "e3",
    type: "true_false",
    prompt: "A battery sitting on a shelf has no energy because it isn't doing anything.",
    correctAnswer: false,
    explanation: "A battery stores chemical energy in the bonds of its internal chemicals. It doesn't need to be 'doing' anything — stored energy is still energy. It transfers to electrical energy when connected to a circuit."
  },
  {
    id: "e4",
    type: "multiple_choice",
    prompt: "The food you eat stores energy in molecular bonds. What type of energy is this?",
    options: [
      "Thermal energy",
      "Nuclear energy",
      "Chemical energy",
      "Electromagnetic energy"
    ],
    correctIndex: 2,
    explanation: "Food stores chemical energy in molecular bonds (carbohydrates, fats, proteins). Your body breaks those bonds during digestion and cellular respiration to fuel everything you do."
  },
  {
    id: "e5",
    type: "true_false",
    prompt: "Sound is a form of kinetic energy because it involves particles moving back and forth.",
    correctAnswer: true,
    explanation: "Sound is mechanical kinetic energy — air molecules vibrate and transfer energy from particle to particle as a longitudinal wave. No particle travels far, but the energy moves through the medium."
  },
  {
    id: "e6",
    type: "multiple_choice",
    prompt: "A glowing lightbulb is primarily converting electrical energy into:",
    options: [
      "Only light energy",
      "Light energy and thermal energy",
      "Only thermal energy",
      "Chemical energy and sound energy"
    ],
    correctIndex: 1,
    explanation: "Lightbulbs convert electrical energy into both light (radiant/electromagnetic) energy AND thermal energy. In fact, traditional incandescent bulbs waste about 90% of their energy as heat!"
  },

  // ── ENERGY TRANSFERS IN REAL SYSTEMS ──────────────────────
  {
    id: "e7",
    type: "multiple_choice",
    prompt: "When a car brakes to a stop, its kinetic energy is primarily converted into:",
    options: [
      "Gravitational potential energy",
      "Chemical energy stored in the brakes",
      "Thermal energy from friction in the brake pads",
      "Sound energy only"
    ],
    correctIndex: 2,
    explanation: "Brake pads squeeze against the rotors, creating friction. This friction converts the car's kinetic energy into thermal energy — that's why brakes get extremely hot after heavy use."
  },
  {
    id: "e8",
    type: "multiple_choice",
    prompt: "In a hydroelectric dam, what is the correct energy transfer chain?",
    options: [
      "Chemical → Electrical → Light",
      "Gravitational potential → Kinetic → Electrical",
      "Nuclear → Thermal → Electrical",
      "Elastic potential → Kinetic → Sound"
    ],
    correctIndex: 1,
    explanation: "Water stored at height has gravitational potential energy. As it falls, that converts to kinetic energy. The moving water spins turbines connected to generators, converting kinetic energy into electrical energy."
  },
  {
    id: "e9",
    type: "true_false",
    prompt: "When you rub your hands together to warm them up, you are converting kinetic energy into thermal energy.",
    correctAnswer: true,
    explanation: "The kinetic energy of your moving hands is converted into thermal energy through friction between your skin surfaces. This is one of the most direct everyday examples of energy transfer through friction."
  },
  {
    id: "e10",
    type: "multiple_choice",
    prompt: "A phone charging on a wireless pad involves which energy transfer?",
    options: [
      "Chemical → Sound → Electrical",
      "Electrical → Electromagnetic → Electrical → Chemical",
      "Thermal → Electrical → Chemical",
      "Nuclear → Electrical → Light"
    ],
    correctIndex: 1,
    explanation: "The charger converts electrical energy into an electromagnetic field. Your phone's coil absorbs that field and converts it back to electrical energy, which is then stored as chemical energy in the battery."
  },
  {
    id: "e11",
    type: "multiple_choice",
    prompt: "When a musician plucks a guitar string, what energy transfer occurs?",
    options: [
      "Chemical → Elastic potential → Sound",
      "Kinetic → Elastic potential → Sound (kinetic energy of air)",
      "Thermal → Kinetic → Electromagnetic",
      "Gravitational potential → Elastic potential → Light"
    ],
    correctIndex: 1,
    explanation: "Your finger's kinetic energy stretches the string (elastic potential). When released, the string vibrates rapidly, pushing air molecules back and forth — creating sound waves (kinetic energy of air particles)."
  },
  {
    id: "e12",
    type: "true_false",
    prompt: "A microwave oven heats food by transferring thermal energy from hot metal coils to the food.",
    correctAnswer: false,
    explanation: "Microwaves don't use heating coils. They convert electrical energy into electromagnetic radiation (microwaves) that causes water molecules in food to vibrate rapidly, generating thermal energy within the food itself."
  },

  // ── CONSERVATION OF ENERGY ────────────────────────────────
  {
    id: "e13",
    type: "multiple_choice",
    prompt: "A ball is thrown straight up. At the very top of its path, which statement is true?",
    options: [
      "All energy has been destroyed",
      "Kinetic energy is at maximum",
      "Gravitational potential energy is at maximum, kinetic energy is zero",
      "Both kinetic and potential energy are zero"
    ],
    correctIndex: 2,
    explanation: "At the top, the ball momentarily stops (KE = 0) and is at maximum height (GPE = max). Energy wasn't lost — it was fully converted from kinetic to gravitational potential. It converts back to KE as the ball falls."
  },
  {
    id: "e14",
    type: "true_false",
    prompt: "If you drop a bouncy ball and it doesn't bounce back to its original height, energy has been destroyed.",
    correctAnswer: false,
    explanation: "Energy is NEVER destroyed — that's the Law of Conservation of Energy. The 'missing' energy was converted into thermal energy (the ball and floor warm up slightly) and sound energy (the bounce makes noise)."
  },
  {
    id: "e15",
    type: "multiple_choice",
    prompt: "A roller coaster reaches the bottom of a big drop going much faster than at the top. What happened to its energy?",
    options: [
      "New energy was created by gravity",
      "Gravitational potential energy was converted into kinetic energy",
      "The coaster's mass increased",
      "Air pushed the coaster faster"
    ],
    correctIndex: 1,
    explanation: "As the coaster descends, its height decreases (losing GPE) and its speed increases (gaining KE). The total mechanical energy stays roughly the same — it just shifts form. GPE → KE."
  },
  {
    id: "e16",
    type: "multiple_choice",
    prompt: "Why does a perpetual motion machine (a machine that runs forever without energy input) violate physics?",
    options: [
      "Machines always create extra energy",
      "Energy transfers always involve some waste (usually thermal), so the system runs down",
      "Gravity eventually stops all machines",
      "Machines need light to operate"
    ],
    correctIndex: 1,
    explanation: "Every real energy transfer converts some energy into thermal energy through friction, air resistance, or electrical resistance. This 'waste' energy dissipates, so the machine gradually loses usable energy and stops."
  },

  // ── REAL-WORLD ENERGY SYSTEMS ─────────────────────────────
  {
    id: "e17",
    type: "multiple_choice",
    prompt: "In a coal power plant, what is the primary energy transfer chain?",
    options: [
      "Chemical → Thermal → Kinetic → Electrical",
      "Nuclear → Thermal → Electrical",
      "Gravitational potential → Kinetic → Electrical",
      "Chemical → Electrical (direct conversion)"
    ],
    correctIndex: 0,
    explanation: "Coal stores chemical energy. Burning it releases thermal energy, which boils water into steam. Steam spins turbines (kinetic energy), and generators convert that into electrical energy. Every step wastes some energy as heat."
  },
  {
    id: "e18",
    type: "multiple_choice",
    prompt: "Solar panels on a rooftop convert:",
    options: [
      "Thermal energy → Electrical energy",
      "Electromagnetic (light) energy → Electrical energy",
      "Chemical energy → Electromagnetic energy",
      "Nuclear energy → Kinetic energy"
    ],
    correctIndex: 1,
    explanation: "Photovoltaic solar panels absorb photons (electromagnetic/light energy from the Sun) and convert them directly into electrical energy using semiconductor materials. No moving parts or heat engine needed."
  },
  {
    id: "e19",
    type: "true_false",
    prompt: "The Sun produces energy through chemical reactions, like burning hydrogen gas.",
    correctAnswer: false,
    explanation: "The Sun produces energy through NUCLEAR fusion, not chemical burning. Hydrogen nuclei are fused together under extreme pressure and temperature to form helium, converting a tiny amount of mass into enormous amounts of energy (E = mc²)."
  },
  {
    id: "e20",
    type: "multiple_choice",
    prompt: "An electric car's regenerative braking system captures energy by:",
    options: [
      "Storing heat in a thermal battery",
      "Converting kinetic energy back into chemical energy stored in the battery",
      "Absorbing sound waves from the road",
      "Using gravity to recharge while going uphill"
    ],
    correctIndex: 1,
    explanation: "Regenerative braking reverses the motor — instead of using electricity to spin the wheels, the spinning wheels generate electricity. This electrical energy is converted to chemical energy and stored in the battery. It's like a hydroelectric dam, but with wheels."
  },
  {
    id: "e21",
    type: "multiple_choice",
    prompt: "When you charge your phone and it gets warm, the warmth represents:",
    options: [
      "Energy being created by the battery",
      "Wasted energy — electrical energy lost as thermal energy during charging",
      "The phone working harder to charge faster",
      "Chemical energy leaving the battery"
    ],
    correctIndex: 1,
    explanation: "No energy transfer is 100% efficient. Some electrical energy is converted to unwanted thermal energy due to resistance in the circuits and chemical processes in the battery. That heat is 'wasted' energy that doesn't end up stored."
  },
  {
    id: "e22",
    type: "true_false",
    prompt: "Wind turbines convert the kinetic energy of moving air into electrical energy.",
    correctAnswer: true,
    explanation: "Wind (moving air) has kinetic energy. The turbine blades capture some of that kinetic energy and spin a generator, which converts it into electrical energy. The wind slows down after passing through — it literally gave some of its energy to the turbine."
  },

  // ── THERMAL ENERGY & HEAT TRANSFER ────────────────────────
  {
    id: "e23",
    type: "multiple_choice",
    prompt: "When you hold a hot cup of coffee, thermal energy transfers to your hand by:",
    options: [
      "Radiation only",
      "Convection through your skin",
      "Conduction — direct contact between the cup and your hand",
      "The coffee's chemical energy"
    ],
    correctIndex: 2,
    explanation: "Conduction is thermal energy transfer through direct physical contact. The fast-vibrating molecules in the hot cup bump into the slower molecules in your cooler hand, transferring kinetic energy and warming your skin."
  },
  {
    id: "e24",
    type: "multiple_choice",
    prompt: "Why does a metal spoon in hot soup get hot faster than a wooden spoon?",
    options: [
      "Metal has more chemical energy",
      "Metal is a better conductor — it transfers thermal energy faster",
      "Wood absorbs all the heat",
      "Metal is heavier, so it holds more heat"
    ],
    correctIndex: 1,
    explanation: "Metals are excellent thermal conductors because their free electrons transfer kinetic energy rapidly. Wood is an insulator — its tightly bound molecules transfer energy much more slowly."
  },
  {
    id: "e25",
    type: "true_false",
    prompt: "Thermal energy always flows from cooler objects to warmer objects.",
    correctAnswer: false,
    explanation: "Thermal energy naturally flows from WARMER to COOLER objects — never the other way around (Second Law of Thermodynamics). Heat flows 'downhill' in temperature until both objects reach thermal equilibrium."
  },

  // ── EFFICIENCY & WASTE ────────────────────────────────────
  {
    id: "e26",
    type: "multiple_choice",
    prompt: "An incandescent lightbulb converts about 10% of electrical energy into light. The other 90% becomes:",
    options: [
      "Sound energy",
      "Chemical energy",
      "Thermal energy (heat)",
      "It disappears"
    ],
    correctIndex: 2,
    explanation: "Incandescent bulbs are only ~10% efficient at producing light. The remaining 90% of electrical energy is 'wasted' as thermal energy — that's why they're so hot to touch and why LEDs (which waste far less) are replacing them."
  },
  {
    id: "e27",
    type: "multiple_choice",
    prompt: "Which device is the MOST efficient at converting energy to its intended output?",
    options: [
      "A gasoline car engine (~25% efficient)",
      "An incandescent lightbulb (~10% efficient)",
      "An electric motor (~90% efficient)",
      "A coal power plant (~33% efficient)"
    ],
    correctIndex: 2,
    explanation: "Electric motors are remarkably efficient — about 90% of electrical energy becomes useful kinetic energy. By comparison, a gas engine wastes ~75% of its chemical energy as heat. This is one reason electric vehicles are gaining popularity."
  },
  {
    id: "e28",
    type: "true_false",
    prompt: "An energy-efficient appliance uses less total energy than an inefficient one doing the same job.",
    correctAnswer: true,
    explanation: "Efficiency means more of the input energy goes toward the useful output and less is wasted (usually as heat). An efficient washing machine needs less total electrical energy to wash the same load of clothes because it wastes less."
  },

  // ── CONNECTING SYSTEMS & SYNTHESIS ────────────────────────
  {
    id: "e29",
    type: "multiple_choice",
    prompt: "Trace the energy: Sunlight → Plant → You eating the plant → Running a mile. What's the full chain?",
    options: [
      "Electromagnetic → Chemical → Chemical → Kinetic + Thermal",
      "Nuclear → Chemical → Thermal → Sound",
      "Electromagnetic → Kinetic → Chemical → Gravitational potential",
      "Thermal → Chemical → Electrical → Kinetic"
    ],
    correctIndex: 0,
    explanation: "Sunlight (electromagnetic energy) is absorbed by the plant and stored as chemical energy via photosynthesis. You eat the plant and store that chemical energy. When you run, your muscles convert chemical energy into kinetic energy (motion) and thermal energy (body heat)."
  },
  {
    id: "e30",
    type: "multiple_choice",
    prompt: "Your body temperature is 98.6°F even on a cold day. Where does that thermal energy come from?",
    options: [
      "Sunlight absorbed through your skin",
      "Friction from your blood flowing",
      "Chemical energy released by cellular respiration (breaking down food molecules)",
      "Electrical energy from your nervous system"
    ],
    correctIndex: 2,
    explanation: "Your cells constantly break down glucose (from food) through cellular respiration, releasing chemical energy. Some powers your body's functions, but a significant amount is released as thermal energy — keeping your body warm as a 'waste' product that's actually essential for survival."
  },
  {
    id: "e31",
    type: "true_false",
    prompt: "A parked car at the top of a steep hill has zero energy because it is not moving.",
    correctAnswer: false,
    explanation: "The car has gravitational potential energy due to its elevated position (GPE = mgh). It also has chemical energy stored in its fuel. 'Not moving' only means zero kinetic energy — objects can store multiple types of energy simultaneously."
  },
  {
    id: "e32",
    type: "multiple_choice",
    prompt: "When a firecracker explodes, which energy types are produced?",
    options: [
      "Only sound energy",
      "Only light and thermal energy",
      "Sound, light (electromagnetic), thermal, and kinetic energy",
      "Only chemical and nuclear energy"
    ],
    correctIndex: 2,
    explanation: "The chemical energy stored in the firecracker's gunpowder is rapidly converted into multiple forms: thermal energy (heat), electromagnetic energy (the flash of light), sound energy (the bang), and kinetic energy (fragments flying outward). One input, many outputs."
  },
  {
    id: "e33",
    type: "multiple_choice",
    prompt: "A student says: 'My phone ran out of energy.' What actually happened?",
    options: [
      "The phone's energy was destroyed",
      "The chemical energy in the battery was fully converted to other forms (light, sound, thermal, electromagnetic)",
      "The energy leaked out through the charging port",
      "Gravity pulled all the energy out"
    ],
    correctIndex: 1,
    explanation: "Energy is never 'used up' or destroyed. The battery's chemical energy was converted into the screen's light, the speaker's sound, the processor's thermal energy, and the Wi-Fi antenna's electromagnetic waves. The energy still exists — just not in a form the phone can use."
  },
  {
    id: "e34",
    type: "true_false",
    prompt: "Plugging a fan into a wall outlet involves at least 3 energy transfers before the air starts moving.",
    correctAnswer: true,
    explanation: "At minimum: (1) Chemical/nuclear energy at the power plant → (2) Electrical energy through the grid → (3) Electrical energy in the motor → Kinetic energy of the fan blades → Kinetic energy of the air. There are actually even more sub-steps depending on the power source!"
  },
  {
    id: "e35",
    type: "multiple_choice",
    prompt: "Why do electric cars have a longer range in warm weather than in cold weather?",
    options: [
      "Cold air is heavier and creates more drag",
      "The battery must use extra chemical energy to heat itself and the cabin, leaving less for driving",
      "Tires freeze and create more friction",
      "Electricity moves slower in the cold"
    ],
    correctIndex: 1,
    explanation: "In cold weather, the battery's chemical energy must be diverted to heating the battery (for efficiency) and the cabin (for comfort). This means less chemical energy is available to convert into kinetic energy for driving, reducing the car's range."
  }
];

// ── SHIP DEFINITIONS ────────────────────────────────────────
const SHIPS = [
  { name: "Carrier", size: 5, code: "CV" },
  { name: "Battleship", size: 4, code: "BB" },
  { name: "Cruiser", size: 3, code: "CA" },
  { name: "Submarine", size: 3, code: "SS" },
  { name: "Patrol Boat", size: 2, code: "PT" },
];

const GRID_SIZE = 10;
const LETTERS = "ABCDEFGHIJ";

// ── UTILITY FUNCTIONS ───────────────────────────────────────
function createEmptyGrid() {
  return Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(null));
}

function canPlaceShip(grid, row, col, size, horizontal) {
  for (let i = 0; i < size; i++) {
    const r = horizontal ? row : row + i;
    const c = horizontal ? col + i : col;
    if (r >= GRID_SIZE || c >= GRID_SIZE || grid[r][c] !== null) return false;
  }
  return true;
}

function placeShipsRandomly() {
  const grid = createEmptyGrid();
  const placements = [];
  for (const ship of SHIPS) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 500) {
      const horizontal = Math.random() > 0.5;
      const row = Math.floor(Math.random() * GRID_SIZE);
      const col = Math.floor(Math.random() * GRID_SIZE);
      if (canPlaceShip(grid, row, col, ship.size, horizontal)) {
        const cells = [];
        for (let i = 0; i < ship.size; i++) {
          const r = horizontal ? row : row + i;
          const c = horizontal ? col + i : col;
          grid[r][c] = ship.code;
          cells.push([r, c]);
        }
        placements.push({ ...ship, cells, hits: 0 });
        placed = true;
      }
      attempts++;
    }
  }
  return { grid, placements };
}

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── SOUND EFFECTS (Web Audio API) ───────────────────────────
const AudioCtx = typeof window !== "undefined" ? (window.AudioContext || window.webkitAudioContext) : null;
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx && AudioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}

function playPing() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.setValueAtTime(1200, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0.12, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.4);
  } catch(e) {}
}

function playHit() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
    }
    const source = ctx.createBufferSource(); source.buffer = buffer;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.25, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 600;
    source.connect(lp); lp.connect(g); g.connect(ctx.destination);
    source.start(); source.stop(ctx.currentTime + 0.3);
  } catch(e) {}
}

function playSplash() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const bufferSize = ctx.sampleRate * 0.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 3);
    const source = ctx.createBufferSource(); source.buffer = buffer;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.08, ctx.currentTime);
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2000;
    source.connect(hp); hp.connect(g); g.connect(ctx.destination);
    source.start(); source.stop(ctx.currentTime + 0.2);
  } catch(e) {}
}

function playSunk() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.connect(g); g.connect(ctx.destination);
    o.frequency.setValueAtTime(400, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.8);
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    o.type = "sawtooth";
    o.start(ctx.currentTime); o.stop(ctx.currentTime + 0.8);
  } catch(e) {}
}

function playVictory() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
      g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + i * 0.15 + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 0.4);
      o.start(ctx.currentTime + i * 0.15); o.stop(ctx.currentTime + i * 0.15 + 0.4);
    });
  } catch(e) {}
}

// ── CSS KEYFRAMES & STYLES ──────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Rajdhani:wght@400;500;600;700&display=swap');

  :root {
    --crt-green: #39ff14;
    --crt-green-dim: #1a7a0a;
    --crt-green-glow: rgba(57, 255, 20, 0.3);
    --radar-green: #00ff41;
    --ocean-dark: #0a0e14;
    --ocean-mid: #0d1520;
    --ocean-grid: #132030;
    --hit-red: #ff2a2a;
    --hit-glow: rgba(255, 42, 42, 0.5);
    --miss-blue: #1a4a6e;
    --soviet-red: #cc0000;
    --soviet-gold: #ffcc00;
    --steel: #3a4a5c;
    --panel-bg: rgba(10, 16, 24, 0.92);
    --panel-border: rgba(57, 255, 20, 0.15);
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--ocean-dark);
    color: var(--crt-green);
    font-family: 'Share Tech Mono', monospace;
    overflow-x: hidden;
    min-height: 100vh;
  }

  @keyframes radarSweep {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes scanline {
    0% { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }

  @keyframes ping {
    0% { transform: scale(0); opacity: 0.8; }
    100% { transform: scale(3); opacity: 0; }
  }

  @keyframes hitFlash {
    0%, 100% { background: rgba(255, 42, 42, 0.0); }
    10% { background: rgba(255, 42, 42, 0.15); }
    30% { background: rgba(255, 42, 42, 0.05); }
  }

  @keyframes explosionPulse {
    0% { transform: scale(0.5); opacity: 1; box-shadow: 0 0 20px var(--hit-red), 0 0 40px var(--hit-glow); }
    50% { transform: scale(1.3); opacity: 0.8; }
    100% { transform: scale(0.8); opacity: 0; box-shadow: none; }
  }

  @keyframes ripple {
    0% { transform: scale(0.5); opacity: 0.6; border-width: 2px; }
    100% { transform: scale(2.5); opacity: 0; border-width: 0px; }
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes typewriter {
    from { width: 0; }
    to { width: 100%; }
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  @keyframes glowPulse {
    0%, 100% { text-shadow: 0 0 4px var(--crt-green-glow); }
    50% { text-shadow: 0 0 12px var(--crt-green), 0 0 24px var(--crt-green-glow); }
  }

  @keyframes sunkSink {
    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
    60% { transform: translateY(4px) rotate(3deg); opacity: 0.7; }
    100% { transform: translateY(8px) rotate(5deg); opacity: 0.4; }
  }

  @keyframes warningPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @keyframes sonarRing {
    0% { transform: scale(0); opacity: 0.5; border-color: var(--crt-green); }
    100% { transform: scale(4); opacity: 0; border-color: transparent; }
  }

  @keyframes slideInLeft {
    from { transform: translateX(-40px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  @keyframes victoryGlow {
    0%, 100% { filter: brightness(1); }
    50% { filter: brightness(1.5); }
  }

  .crt-overlay {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9999;
    background: repeating-linear-gradient(
      0deg,
      rgba(0, 0, 0, 0.08) 0px,
      rgba(0, 0, 0, 0.08) 1px,
      transparent 1px,
      transparent 3px
    );
  }

  .crt-overlay::after {
    content: '';
    position: fixed;
    inset: 0;
    background: linear-gradient(
      180deg,
      transparent 0%,
      rgba(57, 255, 20, 0.03) 50%,
      transparent 100%
    );
    height: 100px;
    animation: scanline 4s linear infinite;
  }

  .vignette {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 9998;
    background: radial-gradient(
      ellipse at center,
      transparent 50%,
      rgba(0, 0, 0, 0.5) 100%
    );
  }

  .app-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px;
    position: relative;
    z-index: 1;
  }

  /* ── HEADER ─────────────────────────── */
  .header {
    text-align: center;
    padding: 20px 0 12px;
    border-bottom: 1px solid var(--panel-border);
    margin-bottom: 16px;
    position: relative;
  }

  .header-classification {
    font-family: 'Rajdhani', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 6px;
    text-transform: uppercase;
    color: var(--soviet-red);
    background: rgba(204, 0, 0, 0.1);
    border: 1px solid rgba(204, 0, 0, 0.3);
    display: inline-block;
    padding: 2px 16px;
    margin-bottom: 8px;
    animation: warningPulse 2s ease-in-out infinite;
  }

  .header h1 {
    font-family: 'Rajdhani', sans-serif;
    font-size: clamp(24px, 4vw, 40px);
    font-weight: 700;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--crt-green);
    text-shadow: 0 0 10px var(--crt-green-glow), 0 0 30px rgba(57, 255, 20, 0.15);
    animation: glowPulse 3s ease-in-out infinite;
    line-height: 1.1;
  }

  .header-subtitle {
    font-size: 11px;
    color: var(--crt-green-dim);
    letter-spacing: 3px;
    margin-top: 4px;
  }

  /* ── STATUS BAR ─────────────────────── */
  .status-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: var(--panel-bg);
    border: 1px solid var(--panel-border);
    border-radius: 2px;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 8px;
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
  }

  .status-label {
    color: var(--crt-green-dim);
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 9px;
  }

  .status-value {
    color: var(--crt-green);
    font-size: 14px;
    font-weight: bold;
  }

  .status-value.warning { color: var(--soviet-red); }

  .status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--crt-green);
    box-shadow: 0 0 6px var(--crt-green);
    animation: blink 1.5s step-end infinite;
  }

  /* ── MAIN LAYOUT ────────────────────── */
  .main-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 16px;
    align-items: start;
  }

  @media (max-width: 900px) {
    .main-layout {
      grid-template-columns: 1fr;
    }
  }

  /* ── GRID PANEL ─────────────────────── */
  .grid-panel {
    background: var(--panel-bg);
    border: 1px solid var(--panel-border);
    border-radius: 2px;
    padding: 16px;
    position: relative;
    overflow: hidden;
  }

  .grid-panel-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--crt-green-dim);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .grid-panel-title::before {
    content: '◆';
    color: var(--crt-green);
    font-size: 8px;
  }

  /* ── BATTLE GRID ────────────────────── */
  .grid-wrapper {
    position: relative;
    display: inline-block;
    width: 100%;
  }

  .battle-grid {
    display: grid;
    grid-template-columns: 28px repeat(10, 1fr);
    grid-template-rows: 28px repeat(10, 1fr);
    gap: 1px;
    background: rgba(57, 255, 20, 0.06);
    border: 1px solid rgba(57, 255, 20, 0.12);
    aspect-ratio: 11 / 11;
    width: 100%;
    max-width: 520px;
    margin: 0 auto;
  }

  .grid-label {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: var(--crt-green-dim);
    font-family: 'Share Tech Mono', monospace;
    user-select: none;
  }

  .grid-corner { background: transparent; }

  .grid-cell {
    background: var(--ocean-grid);
    border: 1px solid rgba(57, 255, 20, 0.04);
    cursor: crosshair;
    position: relative;
    transition: background 0.15s, border-color 0.15s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .grid-cell:hover:not(.cell-hit):not(.cell-miss):not(.cell-sunk):not(.disabled) {
    background: rgba(57, 255, 20, 0.08);
    border-color: rgba(57, 255, 20, 0.2);
    box-shadow: inset 0 0 12px rgba(57, 255, 20, 0.05);
  }

  .grid-cell.disabled {
    cursor: default;
  }

  .grid-cell.cell-hit {
    background: rgba(255, 42, 42, 0.25);
    border-color: rgba(255, 42, 42, 0.4);
    cursor: default;
  }

  .grid-cell.cell-hit::after {
    content: '✕';
    color: var(--hit-red);
    font-size: clamp(10px, 2vw, 16px);
    font-weight: bold;
    text-shadow: 0 0 8px var(--hit-glow);
  }

  .grid-cell.cell-miss {
    background: rgba(26, 74, 110, 0.2);
    border-color: rgba(26, 74, 110, 0.3);
    cursor: default;
  }

  .grid-cell.cell-miss::after {
    content: '•';
    color: var(--miss-blue);
    font-size: 14px;
  }

  .grid-cell.cell-sunk {
    background: rgba(255, 42, 42, 0.35);
    border-color: rgba(255, 42, 42, 0.6);
    cursor: default;
    animation: sunkSink 0.6s ease-out forwards;
  }

  .grid-cell.cell-sunk::after {
    content: '✕';
    color: #ff6666;
    font-size: clamp(10px, 2vw, 16px);
    font-weight: bold;
  }

  .grid-cell.cell-targeting {
    background: rgba(57, 255, 20, 0.15);
    border-color: var(--crt-green);
    box-shadow: 0 0 8px var(--crt-green-glow), inset 0 0 12px rgba(57, 255, 20, 0.1);
  }

  /* ── EXPLOSION OVERLAY ──────────────── */
  .explosion-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 10;
  }

  .explosion-ring {
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid;
    animation: sonarRing 0.8s ease-out forwards;
  }

  .explosion-ring.hit { border-color: var(--hit-red); }
  .explosion-ring.miss { border-color: var(--miss-blue); }

  /* ── RADAR OVERLAY ──────────────────── */
  .radar-overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    z-index: 5;
  }

  .radar-sweep {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150%;
    height: 150%;
    transform-origin: 0 0;
    background: conic-gradient(
      from 0deg,
      transparent 0deg,
      rgba(57, 255, 20, 0.06) 15deg,
      transparent 30deg
    );
    animation: radarSweep 6s linear infinite;
  }

  /* ── SONAR RINGS ────────────────────── */
  .sonar-container {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 4;
    overflow: hidden;
  }

  .sonar-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(57, 255, 20, 0.1);
    border-radius: 50%;
    animation: sonarRing 4s linear infinite;
  }

  /* ── SIDEBAR ────────────────────────── */
  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* ── INTEL PANEL ────────────────────── */
  .intel-panel {
    background: var(--panel-bg);
    border: 1px solid var(--panel-border);
    border-radius: 2px;
    padding: 14px;
  }

  .intel-title {
    font-family: 'Rajdhani', sans-serif;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: var(--crt-green-dim);
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .intel-title::before {
    content: '▪';
    color: var(--crt-green);
    font-size: 6px;
  }

  /* ── FLEET STATUS ───────────────────── */
  .ship-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 0;
    border-bottom: 1px solid rgba(57, 255, 20, 0.05);
  }

  .ship-row:last-child { border-bottom: none; }

  .ship-name {
    font-size: 11px;
    color: var(--crt-green);
    min-width: 80px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 500;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .ship-name.sunk {
    color: var(--soviet-red);
    text-decoration: line-through;
  }

  .ship-cells {
    display: flex;
    gap: 2px;
  }

  .ship-cell-indicator {
    width: 14px;
    height: 8px;
    background: var(--crt-green-dim);
    border: 1px solid rgba(57, 255, 20, 0.3);
    transition: all 0.3s;
  }

  .ship-cell-indicator.damaged {
    background: var(--hit-red);
    border-color: var(--hit-red);
    box-shadow: 0 0 4px var(--hit-glow);
  }

  .ship-cell-indicator.sunk-cell {
    background: rgba(255, 42, 42, 0.3);
    border-color: rgba(255, 42, 42, 0.2);
  }

  /* ── QUESTION PANEL ─────────────────── */
  .question-panel {
    background: var(--panel-bg);
    border: 1px solid var(--panel-border);
    border-radius: 2px;
    padding: 16px;
    animation: fadeInUp 0.4s ease-out;
  }

  .question-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .question-number {
    font-family: 'Rajdhani', sans-serif;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--crt-green-dim);
  }

  .question-type-badge {
    font-size: 9px;
    padding: 2px 8px;
    border: 1px solid var(--crt-green-dim);
    color: var(--crt-green-dim);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .question-prompt {
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #d0e8d0;
    line-height: 1.4;
    margin-bottom: 16px;
  }

  .option-btn {
    display: block;
    width: 100%;
    padding: 10px 14px;
    margin-bottom: 6px;
    background: rgba(57, 255, 20, 0.04);
    border: 1px solid rgba(57, 255, 20, 0.12);
    color: var(--crt-green);
    font-family: 'Share Tech Mono', monospace;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
    transition: all 0.15s;
    border-radius: 1px;
    position: relative;
  }

  .option-btn:hover:not(:disabled) {
    background: rgba(57, 255, 20, 0.1);
    border-color: rgba(57, 255, 20, 0.3);
    padding-left: 18px;
  }

  .option-btn:disabled { cursor: default; }

  .option-btn.correct {
    background: rgba(57, 255, 20, 0.15);
    border-color: var(--crt-green);
    color: var(--crt-green);
    box-shadow: 0 0 8px var(--crt-green-glow);
  }

  .option-btn.incorrect {
    background: rgba(255, 42, 42, 0.1);
    border-color: rgba(255, 42, 42, 0.4);
    color: var(--hit-red);
  }

  .option-btn.reveal-correct {
    background: rgba(57, 255, 20, 0.08);
    border-color: rgba(57, 255, 20, 0.3);
  }

  .option-letter {
    display: inline-block;
    width: 20px;
    font-weight: bold;
    color: var(--crt-green-dim);
  }

  .tf-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .tf-btn {
    padding: 12px;
    background: rgba(57, 255, 20, 0.04);
    border: 1px solid rgba(57, 255, 20, 0.12);
    color: var(--crt-green);
    font-family: 'Rajdhani', sans-serif;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .tf-btn:hover:not(:disabled) {
    background: rgba(57, 255, 20, 0.1);
    border-color: rgba(57, 255, 20, 0.3);
  }

  .tf-btn:disabled { cursor: default; }
  .tf-btn.correct {
    background: rgba(57, 255, 20, 0.15);
    border-color: var(--crt-green);
    box-shadow: 0 0 8px var(--crt-green-glow);
  }
  .tf-btn.incorrect {
    background: rgba(255, 42, 42, 0.1);
    border-color: rgba(255, 42, 42, 0.4);
    color: var(--hit-red);
  }

  .explanation-box {
    margin-top: 12px;
    padding: 10px 12px;
    background: rgba(57, 255, 20, 0.04);
    border-left: 2px solid var(--crt-green-dim);
    font-size: 12px;
    color: #8ab88a;
    line-height: 1.5;
    animation: fadeInUp 0.3s ease-out;
  }

  .result-banner {
    text-align: center;
    padding: 8px;
    margin-top: 10px;
    font-family: 'Rajdhani', sans-serif;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 2px;
    text-transform: uppercase;
    animation: fadeInUp 0.3s ease-out;
  }

  .result-banner.hit-banner {
    color: var(--hit-red);
    background: rgba(255, 42, 42, 0.08);
    border: 1px solid rgba(255, 42, 42, 0.2);
  }

  .result-banner.miss-banner {
    color: var(--miss-blue);
    background: rgba(26, 74, 110, 0.15);
    border: 1px solid rgba(26, 74, 110, 0.3);
  }

  .result-banner.sunk-banner {
    color: var(--soviet-red);
    background: rgba(204, 0, 0, 0.1);
    border: 1px solid rgba(204, 0, 0, 0.3);
  }

  .continue-btn {
    display: block;
    width: 100%;
    margin-top: 12px;
    padding: 10px;
    background: rgba(57, 255, 20, 0.08);
    border: 1px solid rgba(57, 255, 20, 0.25);
    color: var(--crt-green);
    font-family: 'Rajdhani', sans-serif;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 3px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .continue-btn:hover {
    background: rgba(57, 255, 20, 0.15);
    border-color: var(--crt-green);
    box-shadow: 0 0 12px var(--crt-green-glow);
  }

  /* ── TARGETING READOUT ──────────────── */
  .target-readout {
    text-align: center;
    padding: 8px;
    font-size: 12px;
    color: var(--crt-green-dim);
    letter-spacing: 2px;
  }

  .target-readout .coord {
    color: var(--crt-green);
    font-size: 16px;
    font-weight: bold;
    text-shadow: 0 0 6px var(--crt-green-glow);
  }

  /* ── MESSAGE LOG ────────────────────── */
  .message-log {
    max-height: 140px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--crt-green-dim) transparent;
  }

  .message-log::-webkit-scrollbar { width: 4px; }
  .message-log::-webkit-scrollbar-track { background: transparent; }
  .message-log::-webkit-scrollbar-thumb { background: var(--crt-green-dim); }

  .log-entry {
    font-size: 11px;
    padding: 3px 0;
    border-bottom: 1px solid rgba(57, 255, 20, 0.03);
    color: var(--crt-green-dim);
    animation: slideInLeft 0.3s ease-out;
  }

  .log-entry .log-time {
    color: rgba(57, 255, 20, 0.25);
    margin-right: 6px;
  }

  .log-entry.log-hit { color: var(--hit-red); }
  .log-entry.log-miss { color: var(--miss-blue); }
  .log-entry.log-sunk { color: var(--soviet-red); font-weight: bold; }
  .log-entry.log-system { color: var(--crt-green); }

  /* ── GAME OVER / INTRO ──────────────── */
  .overlay-screen {
    position: fixed;
    inset: 0;
    background: rgba(5, 8, 12, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fadeInUp 0.5s ease-out;
  }

  .overlay-content {
    text-align: center;
    max-width: 500px;
    padding: 40px;
  }

  .overlay-content h2 {
    font-family: 'Rajdhani', sans-serif;
    font-size: clamp(28px, 5vw, 48px);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 4px;
    margin-bottom: 16px;
    line-height: 1.1;
  }

  .overlay-content.victory h2 {
    color: var(--crt-green);
    text-shadow: 0 0 20px var(--crt-green-glow), 0 0 40px rgba(57, 255, 20, 0.2);
    animation: victoryGlow 1.5s ease-in-out infinite;
  }

  .overlay-content.defeat h2 {
    color: var(--soviet-red);
    text-shadow: 0 0 20px rgba(204, 0, 0, 0.4);
  }

  .overlay-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin: 24px 0;
    text-align: center;
  }

  .overlay-stat {
    padding: 12px;
    background: rgba(57, 255, 20, 0.04);
    border: 1px solid var(--panel-border);
  }

  .overlay-stat-value {
    font-family: 'Rajdhani', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: var(--crt-green);
  }

  .overlay-stat-label {
    font-size: 9px;
    color: var(--crt-green-dim);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-top: 4px;
  }

  .start-btn {
    display: inline-block;
    padding: 14px 40px;
    background: rgba(57, 255, 20, 0.1);
    border: 2px solid var(--crt-green);
    color: var(--crt-green);
    font-family: 'Rajdhani', sans-serif;
    font-size: 18px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 4px;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 16px;
  }

  .start-btn:hover {
    background: rgba(57, 255, 20, 0.2);
    box-shadow: 0 0 20px var(--crt-green-glow), 0 0 40px rgba(57, 255, 20, 0.1);
    transform: scale(1.02);
  }

  /* ── ACCURACY METER ─────────────────── */
  .accuracy-bar-container {
    margin-top: 8px;
  }

  .accuracy-bar-bg {
    height: 4px;
    background: rgba(57, 255, 20, 0.08);
    border: 1px solid rgba(57, 255, 20, 0.1);
    position: relative;
    overflow: hidden;
  }

  .accuracy-bar-fill {
    height: 100%;
    background: var(--crt-green);
    box-shadow: 0 0 6px var(--crt-green-glow);
    transition: width 0.5s ease-out;
  }

  /* ── OCEAN BACKGROUND ───────────────── */
  .ocean-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(10, 40, 60, 0.4) 0%, transparent 60%),
      radial-gradient(ellipse at 80% 20%, rgba(15, 30, 50, 0.3) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 80%, rgba(5, 20, 40, 0.3) 0%, transparent 60%),
      var(--ocean-dark);
  }

  /* ── PHASE INDICATOR ────────────────── */
  .phase-indicator {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .phase-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  .phase-dot.targeting {
    background: var(--crt-green);
    box-shadow: 0 0 8px var(--crt-green);
    animation: blink 1s step-end infinite;
  }

  .phase-dot.answering {
    background: var(--soviet-gold);
    box-shadow: 0 0 8px rgba(255, 204, 0, 0.5);
    animation: blink 0.7s step-end infinite;
  }

  .phase-dot.resolving {
    background: var(--hit-red);
    box-shadow: 0 0 8px var(--hit-glow);
  }

  /* ── ENEMY FIRE PHASE ───────────────── */
  .enemy-fire-overlay {
    animation: hitFlash 1.5s ease-out;
  }

  .enemy-fire-msg {
    text-align: center;
    padding: 16px;
    font-family: 'Rajdhani', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--soviet-red);
    text-transform: uppercase;
    letter-spacing: 2px;
    animation: warningPulse 0.5s ease-in-out 3;
  }

  /* ── PLAYER GRID (mini) ─────────────── */
  .mini-grid {
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    gap: 1px;
    background: rgba(57, 255, 20, 0.04);
    border: 1px solid var(--panel-border);
  }

  .mini-cell {
    aspect-ratio: 1;
    background: var(--ocean-grid);
    border: 1px solid rgba(57, 255, 20, 0.02);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5px;
  }

  .mini-cell.has-ship { background: rgba(57, 255, 20, 0.12); }
  .mini-cell.mini-hit {
    background: rgba(255, 42, 42, 0.4);
  }
  .mini-cell.mini-hit::after {
    content: '✕';
    color: var(--hit-red);
    font-size: 7px;
  }
  .mini-cell.mini-miss {
    background: rgba(26, 74, 110, 0.3);
  }

  .hammer-star {
    display: inline-block;
    color: var(--soviet-red);
    font-size: 18px;
    margin: 0 4px;
    filter: drop-shadow(0 0 4px rgba(204, 0, 0, 0.5));
  }

  .score-display {
    font-family: 'Rajdhani', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: var(--crt-green);
    text-shadow: 0 0 8px var(--crt-green-glow);
  }

  /* Scrollbar for the whole page */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--ocean-dark); }
  ::-webkit-scrollbar-thumb { background: var(--crt-green-dim); border-radius: 3px; }
`;

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

function CRTOverlay() {
  return (
    <>
      <div className="ocean-bg" />
      <div className="vignette" />
      <div className="crt-overlay" />
    </>
  );
}

function Header({ turnNumber, totalQuestions }) {
  return (
    <div className="header">
      <div className="header-classification">⚠ TOP SECRET // OPERATION RED TIDE</div>
      <h1>BATTLESHIP<br />COMMAND</h1>
      <div className="header-subtitle">
        NORTH ATLANTIC THEATRE — ENERGY SYSTEMS INTELLIGENCE DIVISION
      </div>
    </div>
  );
}

function StatusBar({ phase, turnNumber, score, accuracy, questionsLeft, totalQuestions }) {
  const phaseName = phase === "targeting" ? "SELECT TARGET" : phase === "answering" ? "INTEL CHECK" : "RESOLVING";
  const phaseClass = phase;

  return (
    <div className="status-bar">
      <div className="status-item">
        <div className="status-dot" />
        <div>
          <div className="status-label">Status</div>
          <div className="phase-indicator">
            <span className={`phase-dot ${phaseClass}`} />
            <span style={{ color: phase === "answering" ? "var(--soviet-gold)" : "var(--crt-green)" }}>{phaseName}</span>
          </div>
        </div>
      </div>
      <div className="status-item">
        <div>
          <div className="status-label">Turn</div>
          <div className="status-value">{turnNumber}</div>
        </div>
      </div>
      <div className="status-item">
        <div>
          <div className="status-label">Score</div>
          <div className="score-display">{score}</div>
        </div>
      </div>
      <div className="status-item">
        <div>
          <div className="status-label">Accuracy</div>
          <div className="status-value">{accuracy}%</div>
        </div>
      </div>
      <div className="status-item">
        <div>
          <div className="status-label">Intel Remaining</div>
          <div className={`status-value ${questionsLeft <= 5 ? "warning" : ""}`}>{questionsLeft}/{totalQuestions}</div>
        </div>
      </div>
    </div>
  );
}

function BattleGrid({ enemyGrid, shots, targetCell, onCellClick, onCellHover, disabled, explosions }) {
  return (
    <div className="grid-wrapper">
      <div className="battle-grid">
        {/* Corner */}
        <div className="grid-label grid-corner" />
        {/* Column headers */}
        {Array.from({ length: 10 }, (_, i) => (
          <div key={`ch-${i}`} className="grid-label">{i + 1}</div>
        ))}
        {/* Rows */}
        {Array.from({ length: 10 }, (_, row) => (
          <React.Fragment key={`row-${row}`}>
            <div className="grid-label">{LETTERS[row]}</div>
            {Array.from({ length: 10 }, (_, col) => {
              const shot = shots.find(s => s.row === row && s.col === col);
              const isTarget = targetCell && targetCell.row === row && targetCell.col === col;
              let cellClass = "grid-cell";
              if (shot) {
                if (shot.sunk) cellClass += " cell-sunk";
                else if (shot.hit) cellClass += " cell-hit";
                else cellClass += " cell-miss";
              } else if (isTarget) {
                cellClass += " cell-targeting";
              }
              if (disabled || shot) cellClass += " disabled";

              return (
                <div
                  key={`cell-${row}-${col}`}
                  className={cellClass}
                  onClick={() => !disabled && !shot && onCellClick(row, col)}
                  onMouseEnter={() => !disabled && !shot && onCellHover(row, col)}
                  onMouseLeave={() => onCellHover(null, null)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      {/* Radar sweep */}
      <div className="radar-overlay">
        <div className="radar-sweep" />
      </div>
      {/* Sonar rings */}
      <div className="sonar-container">
        {[1, 2, 3].map(i => (
          <div key={i} className="sonar-ring" style={{
            width: `${i * 33}%`,
            height: `${i * 33}%`,
            animationDelay: `${i * 1.3}s`,
          }} />
        ))}
      </div>
      {/* Explosion effects */}
      <div className="explosion-overlay">
        {explosions.map((e, i) => (
          <div
            key={i}
            className={`explosion-ring ${e.hit ? "hit" : "miss"}`}
            style={{
              left: `${(e.col + 1) / 11 * 100}%`,
              top: `${(e.row + 1) / 11 * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function TargetReadout({ targetCell }) {
  if (!targetCell) return (
    <div className="target-readout">
      AWAITING TARGET COORDINATES...
    </div>
  );
  return (
    <div className="target-readout">
      TARGET LOCKED: <span className="coord">{LETTERS[targetCell.row]}{targetCell.col + 1}</span>
      <span style={{ marginLeft: 12, fontSize: 10, opacity: 0.5 }}>CLICK TO FIRE</span>
    </div>
  );
}

function QuestionPanel({ question, questionIndex, totalQuestions, onAnswer, answered, selectedAnswer, wasCorrect }) {
  if (!question) return null;

  const ismc = question.type === "multiple_choice";
  const istf = question.type === "true_false";

  return (
    <div className="question-panel">
      <div className="question-header">
        <div className="question-number">Intel Intercept #{questionIndex + 1}</div>
        <div className="question-type-badge">{ismc ? "Multiple Choice" : "True / False"}</div>
      </div>
      <div className="question-prompt">{question.prompt}</div>

      {ismc && (
        <div>
          {question.options.map((opt, i) => {
            let cls = "option-btn";
            if (answered) {
              if (i === question.correctIndex) cls += " correct";
              else if (i === selectedAnswer && !wasCorrect) cls += " incorrect";
              else cls += " reveal-correct";
            }
            return (
              <button
                key={i}
                className={cls}
                onClick={() => !answered && onAnswer(i)}
                disabled={answered}
              >
                <span className="option-letter">{String.fromCharCode(65 + i)}.</span> {opt}
              </button>
            );
          })}
        </div>
      )}

      {istf && (
        <div className="tf-buttons">
          {[true, false].map(val => {
            let cls = "tf-btn";
            if (answered) {
              if (val === question.correctAnswer) cls += " correct";
              else if (val === selectedAnswer && !wasCorrect) cls += " incorrect";
            }
            return (
              <button
                key={String(val)}
                className={cls}
                onClick={() => !answered && onAnswer(val)}
                disabled={answered}
              >
                {val ? "TRUE" : "FALSE"}
              </button>
            );
          })}
        </div>
      )}

      {answered && question.explanation && (
        <div className="explanation-box">
          <strong style={{ color: "var(--crt-green)" }}>INTEL: </strong>{question.explanation}
        </div>
      )}
    </div>
  );
}

function FleetStatus({ placements }) {
  return (
    <div className="intel-panel">
      <div className="intel-title">Enemy Fleet Status</div>
      {placements.map(ship => {
        const isSunk = ship.hits >= ship.size;
        return (
          <div key={ship.code} className="ship-row">
            <div className={`ship-name ${isSunk ? "sunk" : ""}`}>{ship.name}</div>
            <div className="ship-cells">
              {Array.from({ length: ship.size }, (_, i) => (
                <div
                  key={i}
                  className={`ship-cell-indicator ${isSunk ? "sunk-cell" : i < ship.hits ? "damaged" : ""}`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PlayerFleetMini({ playerGrid, playerShots }) {
  return (
    <div className="intel-panel">
      <div className="intel-title">Your Fleet</div>
      <div className="mini-grid">
        {Array.from({ length: 10 }, (_, row) =>
          Array.from({ length: 10 }, (_, col) => {
            const hasShip = playerGrid[row][col] !== null;
            const shot = playerShots.find(s => s.row === row && s.col === col);
            let cls = "mini-cell";
            if (shot && shot.hit) cls += " mini-hit";
            else if (shot) cls += " mini-miss";
            else if (hasShip) cls += " has-ship";
            return <div key={`${row}-${col}`} className={cls} />;
          })
        )}
      </div>
    </div>
  );
}

function MessageLog({ messages }) {
  const logRef = useRef(null);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="intel-panel">
      <div className="intel-title">Combat Log</div>
      <div className="message-log" ref={logRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`log-entry log-${msg.type}`}>
            <span className="log-time">{msg.time}</span>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

function IntroScreen({ onStart }) {
  return (
    <div className="overlay-screen">
      <CRTOverlay />
      <div className="overlay-content" style={{ zIndex: 101 }}>
        <div className="header-classification" style={{ marginBottom: 16 }}>⚠ EYES ONLY // CINCLANTFLT</div>
        <h2 style={{ color: "var(--crt-green)", textShadow: "0 0 20px var(--crt-green-glow)", animation: "glowPulse 3s ease-in-out infinite" }}>
          OPERATION<br />RED TIDE
        </h2>
        <p style={{ color: "var(--crt-green-dim)", fontSize: 13, lineHeight: 1.7, margin: "16px 0", maxWidth: 420, marginInline: "auto" }}>
          COMINT has detected a Soviet naval formation in the North Atlantic.
          Your mission: locate and destroy all enemy vessels.
          <br /><br />
          To authorize each strike, you must correctly decode intercepted
          intelligence on <span style={{ color: "var(--crt-green)" }}>energy systems, transfers, and conservation</span>.
          Incorrect answers forfeit your attack and give the enemy an opening.
        </p>
        <div style={{ margin: "20px 0", display: "flex", justifyContent: "center", gap: 4 }}>
          {SHIPS.map(s => (
            <div key={s.code} style={{ textAlign: "center", padding: "6px 10px" }}>
              <div style={{ display: "flex", gap: 2, justifyContent: "center", marginBottom: 4 }}>
                {Array.from({ length: s.size }, (_, i) => (
                  <div key={i} style={{ width: 12, height: 8, background: "var(--crt-green-dim)", border: "1px solid rgba(57,255,20,0.3)" }} />
                ))}
              </div>
              <div style={{ fontSize: 9, color: "var(--crt-green-dim)", letterSpacing: 1, textTransform: "uppercase" }}>{s.name}</div>
            </div>
          ))}
        </div>
        <button className="start-btn" onClick={onStart}>
          BEGIN OPERATION
        </button>
      </div>
    </div>
  );
}

function GameOverScreen({ victory, stats, onRestart }) {
  return (
    <div className="overlay-screen">
      <CRTOverlay />
      <div className={`overlay-content ${victory ? "victory" : "defeat"}`} style={{ zIndex: 101 }}>
        {victory ? (
          <>
            <div className="header-classification" style={{ borderColor: "var(--crt-green)", color: "var(--crt-green)", background: "rgba(57,255,20,0.1)" }}>
              ✦ MISSION COMPLETE ✦
            </div>
            <h2>ENEMY FLEET<br />DESTROYED</h2>
          </>
        ) : (
          <>
            <div className="header-classification">☭ MISSION FAILED</div>
            <h2>FLEET<br />COMPROMISED</h2>
            <p style={{ color: "var(--soviet-red)", fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
              Enemy vessels have escaped the theatre of operations.
            </p>
          </>
        )}
        <div className="overlay-stats">
          <div className="overlay-stat">
            <div className="overlay-stat-value">{stats.score}</div>
            <div className="overlay-stat-label">Final Score</div>
          </div>
          <div className="overlay-stat">
            <div className="overlay-stat-value">{stats.accuracy}%</div>
            <div className="overlay-stat-label">Accuracy</div>
          </div>
          <div className="overlay-stat">
            <div className="overlay-stat-value">{stats.shipsSunk}/{SHIPS.length}</div>
            <div className="overlay-stat-label">Ships Sunk</div>
          </div>
          <div className="overlay-stat">
            <div className="overlay-stat-value">{stats.turns}</div>
            <div className="overlay-stat-label">Turns Taken</div>
          </div>
        </div>
        <button className="start-btn" onClick={onRestart}>
          NEW OPERATION
        </button>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// MAIN GAME COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function BattleshipQuiz({ questions = SAMPLE_QUESTIONS }) {
  const [gameState, setGameState] = useState("intro"); // intro | playing | gameover
  const [enemyGrid, setEnemyGrid] = useState(null);
  const [enemyPlacements, setEnemyPlacements] = useState([]);
  const [playerGrid, setPlayerGrid] = useState(null);
  const [playerPlacements, setPlayerPlacements] = useState([]);

  const [shots, setShots] = useState([]); // player shots on enemy grid
  const [playerShots, setPlayerShots] = useState([]); // enemy shots on player grid

  const [phase, setPhase] = useState("targeting"); // targeting | answering | resolving
  const [targetCell, setTargetCell] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);

  const [questionQueue, setQuestionQueue] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [shotResult, setShotResult] = useState(null); // { hit, sunk, shipName }

  const [score, setScore] = useState(0);
  const [turnNumber, setTurnNumber] = useState(1);
  const [messages, setMessages] = useState([]);
  const [explosions, setExplosions] = useState([]);

  const [enemyFireMsg, setEnemyFireMsg] = useState(null);

  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
  const allSunk = enemyPlacements.length > 0 && enemyPlacements.every(s => s.hits >= s.size);
  const questionsLeft = questionQueue.length - currentQuestionIdx;

  const addMessage = useCallback((text, type = "system") => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setMessages(prev => [...prev.slice(-50), { text, type, time }]);
  }, []);

  // ── INITIALIZE GAME ───────────────────
  const startGame = useCallback(() => {
    const enemy = placeShipsRandomly();
    const player = placeShipsRandomly();
    setEnemyGrid(enemy.grid);
    setEnemyPlacements(enemy.placements);
    setPlayerGrid(player.grid);
    setPlayerPlacements(player.placements);
    setShots([]);
    setPlayerShots([]);
    setPhase("targeting");
    setTargetCell(null);
    setHoverCell(null);
    setQuestionQueue(shuffleArray(questions));
    setCurrentQuestionIdx(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setWasCorrect(false);
    setShotResult(null);
    setScore(0);
    setTurnNumber(1);
    setMessages([]);
    setExplosions([]);
    setEnemyFireMsg(null);
    setGameState("playing");
    addMessage("OPERATION RED TIDE initiated. Locate and destroy all enemy vessels.", "system");
    addMessage("Select a target on the grid to begin your attack.", "system");
  }, [questions, addMessage]);

  // ── CELL CLICK (targeting phase) ──────
  const handleCellClick = useCallback((row, col) => {
    if (phase !== "targeting") return;
    // If clicking the targeted cell, fire
    if (targetCell && targetCell.row === row && targetCell.col === col) {
      playPing();
      setPhase("answering");
      addMessage(`Targeting ${LETTERS[row]}${col + 1} — awaiting intel verification...`, "system");
    } else {
      setTargetCell({ row, col });
    }
  }, [phase, targetCell, addMessage]);

  const handleCellHover = useCallback((row, col) => {
    if (row === null) setHoverCell(null);
    else setHoverCell({ row, col });
  }, []);

  // ── ANSWER QUESTION ───────────────────
  const handleAnswer = useCallback((answer) => {
    const q = questionQueue[currentQuestionIdx];
    let correct = false;
    if (q.type === "multiple_choice") {
      correct = answer === q.correctIndex;
    } else {
      correct = answer === q.correctAnswer;
    }
    setSelectedAnswer(answer);
    setWasCorrect(correct);
    setAnswered(true);
    setQuestionsAnswered(prev => prev + 1);
    if (correct) {
      setCorrectAnswers(prev => prev + 1);
    }
  }, [questionQueue, currentQuestionIdx]);

  // ── CONTINUE AFTER ANSWER ─────────────
  const handleContinue = useCallback(() => {
    if (!targetCell || !enemyGrid) return;

    const { row, col } = targetCell;

    if (wasCorrect) {
      // Fire at enemy grid
      const cellValue = enemyGrid[row][col];
      const hit = cellValue !== null;

      let sunkShip = null;
      const newPlacements = enemyPlacements.map(ship => {
        if (hit && ship.code === cellValue) {
          const updated = { ...ship, hits: ship.hits + 1 };
          if (updated.hits >= updated.size) sunkShip = updated;
          return updated;
        }
        return ship;
      });

      const shotRecord = { row, col, hit, sunk: !!sunkShip };
      setShots(prev => [...prev, shotRecord]);
      setEnemyPlacements(newPlacements);
      setExplosions(prev => [...prev, { row, col, hit }]);
      setTimeout(() => setExplosions(prev => prev.filter(e => e.row !== row || e.col !== col)), 1000);

      if (hit) {
        playHit();
        if (sunkShip) {
          playSunk();
          addMessage(`DIRECT HIT on ${LETTERS[row]}${col + 1}! ${sunkShip.name} SUNK!`, "sunk");
          setScore(prev => prev + 200);
          // Mark all ship cells as sunk
          setShots(prev => prev.map(s => {
            if (sunkShip.cells.some(c => c[0] === s.row && c[1] === s.col)) {
              return { ...s, sunk: true };
            }
            return s;
          }));
        } else {
          addMessage(`DIRECT HIT at ${LETTERS[row]}${col + 1}!`, "hit");
          setScore(prev => prev + 100);
        }
      } else {
        playSplash();
        addMessage(`Miss at ${LETTERS[row]}${col + 1}. No contact.`, "miss");
        setScore(prev => prev + 25);
      }

      // Check win
      const totalSunk = newPlacements.every(s => s.hits >= s.size);
      if (totalSunk) {
        playVictory();
        setGameState("gameover");
        return;
      }
    } else {
      // Wrong answer — enemy fires
      addMessage(`Intel verification FAILED. Attack cancelled.`, "miss");
      fireEnemyShot();
    }

    // Next turn
    setCurrentQuestionIdx(prev => prev + 1);
    setPhase("targeting");
    setTargetCell(null);
    setAnswered(false);
    setSelectedAnswer(null);
    setWasCorrect(false);
    setShotResult(null);
    setTurnNumber(prev => prev + 1);

    // Check if out of questions
    if (currentQuestionIdx + 1 >= questionQueue.length) {
      addMessage("No more intel available. Operation concluding.", "system");
      setTimeout(() => setGameState("gameover"), 1500);
    }
  }, [wasCorrect, targetCell, enemyGrid, enemyPlacements, currentQuestionIdx, questionQueue, addMessage]);

  // ── ENEMY AI FIRE ─────────────────────
  const fireEnemyShot = useCallback(() => {
    if (!playerGrid) return;
    let row, col;
    let attempts = 0;
    do {
      row = Math.floor(Math.random() * GRID_SIZE);
      col = Math.floor(Math.random() * GRID_SIZE);
      attempts++;
    } while (playerShots.some(s => s.row === row && s.col === col) && attempts < 200);

    const hit = playerGrid[row][col] !== null;
    setPlayerShots(prev => [...prev, { row, col, hit }]);

    if (hit) {
      addMessage(`⚠ INCOMING! Enemy hit at ${LETTERS[row]}${col + 1}!`, "hit");
    } else {
      addMessage(`Enemy fired at ${LETTERS[row]}${col + 1}. Missed.`, "miss");
    }
  }, [playerGrid, playerShots, addMessage]);

  // ── RENDER ────────────────────────────
  if (gameState === "intro") {
    return (
      <>
        <style>{STYLES}</style>
        <IntroScreen onStart={startGame} />
      </>
    );
  }

  if (gameState === "gameover") {
    const victory = enemyPlacements.every(s => s.hits >= s.size);
    return (
      <>
        <style>{STYLES}</style>
        <GameOverScreen
          victory={victory}
          stats={{
            score,
            accuracy,
            shipsSunk: enemyPlacements.filter(s => s.hits >= s.size).length,
            turns: turnNumber,
          }}
          onRestart={startGame}
        />
      </>
    );
  }

  const currentQuestion = questionQueue[currentQuestionIdx];
  const displayTarget = phase === "targeting" ? (hoverCell || targetCell) : targetCell;

  return (
    <>
      <style>{STYLES}</style>
      <CRTOverlay />
      <div className="app-container">
        <Header turnNumber={turnNumber} totalQuestions={questionQueue.length} />
        <StatusBar
          phase={phase}
          turnNumber={turnNumber}
          score={score}
          accuracy={accuracy}
          questionsLeft={questionsLeft}
          totalQuestions={questionQueue.length}
        />

        <div className="main-layout">
          {/* LEFT: Grid + Question */}
          <div>
            <div className="grid-panel">
              <div className="grid-panel-title">
                Enemy Waters — Tactical Display
              </div>
              <BattleGrid
                enemyGrid={enemyGrid}
                shots={shots}
                targetCell={displayTarget}
                onCellClick={handleCellClick}
                onCellHover={handleCellHover}
                disabled={phase !== "targeting"}
                explosions={explosions}
              />
              <TargetReadout targetCell={displayTarget} />
            </div>

            {phase === "answering" && currentQuestion && (
              <div style={{ marginTop: 12 }}>
                <QuestionPanel
                  question={currentQuestion}
                  questionIndex={currentQuestionIdx}
                  totalQuestions={questionQueue.length}
                  onAnswer={handleAnswer}
                  answered={answered}
                  selectedAnswer={selectedAnswer}
                  wasCorrect={wasCorrect}
                />
                {answered && (
                  <>
                    {wasCorrect ? (
                      <div className="result-banner hit-banner">
                        ✦ INTEL VERIFIED — STRIKE AUTHORIZED ✦
                      </div>
                    ) : (
                      <div className="result-banner miss-banner">
                        ✕ INTEL FAILED — ATTACK CANCELLED — ENEMY RETALIATES ✕
                      </div>
                    )}
                    <button className="continue-btn" onClick={handleContinue}>
                      {wasCorrect ? "FIRE!" : "CONTINUE"}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Sidebar */}
          <div className="sidebar">
            <FleetStatus placements={enemyPlacements} />
            {playerGrid && <PlayerFleetMini playerGrid={playerGrid} playerShots={playerShots} />}
            <MessageLog messages={messages} />

            {/* Accuracy meter */}
            <div className="intel-panel">
              <div className="intel-title">Intel Accuracy</div>
              <div className="accuracy-bar-container">
                <div className="accuracy-bar-bg">
                  <div className="accuracy-bar-fill" style={{ width: `${accuracy}%` }} />
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                <span style={{ fontSize: 10, color: "var(--crt-green-dim)" }}>{correctAnswers}/{questionsAnswered} correct</span>
                <span style={{ fontSize: 10, color: "var(--crt-green-dim)" }}>{accuracy}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
