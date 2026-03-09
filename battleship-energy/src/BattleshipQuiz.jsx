import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { SchematicFleet, ShipSchematicPanel, ShipSilhouette, ShipOverlay } from "./ShipSchematics";

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
    prompt: "A [skateboarder + Earth] system at the top of a half-pipe has maximum _____ energy.",
    options: [
      "Kinetic",
      "Gravitational potential",
      "Elastic potential",
      "Thermal"
    ],
    correctIndex: 1,
    explanation: "At the top of the ramp, the [skateboarder + Earth] system is high up and stationary — all of its mechanical energy is stored as gravitational potential energy (GPE = mgh)."
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
    prompt: "When you rub your hands together on a cold day, kinetic energy is transformed into thermal energy.",
    correctAnswer: true,
    explanation: "Rubbing your hands together is an energy transformation. The kinetic energy of your moving hands is converted into thermal energy through friction, which is why your hands feel warmer."
  },

  // ── DEFINING SYSTEMS & ENERGY IN/OUT ──────────────────────
  {
    id: "e13",
    type: "multiple_choice",
    prompt: "A student defines 'the system' as ONLY the basketball during a free throw. As the ball rises toward the hoop, which best describes the energy change WITHIN this system?",
    options: [
      "Kinetic energy is entering the system from the player's hand",
      "The ball's kinetic energy is decreasing as it rises",
      "Gravitational potential energy is being created inside the ball",
      "No energy change — the ball has the same energy the whole time"
    ],
    correctIndex: 1,
    explanation: "If the system is only the ball (after it leaves the hand), its kinetic energy decreases as it rises and slows. Gravity is an outside force doing work on the system. The key is that your system choice changes what counts as 'inside' vs 'outside.'"
  },
  {
    id: "e14",
    type: "true_false",
    prompt: "If you define your system as a ball + the Earth, gravity is a force WITHIN the system, not an outside force acting on it.",
    correctAnswer: true,
    explanation: "When both the ball and Earth are inside your system, the gravitational interaction happens between two things inside the system. Gravitational potential energy belongs to the ball-Earth system. If you only define the ball as the system, gravity becomes an external force."
  },
  {
    id: "e15",
    type: "multiple_choice",
    prompt: "A book slides across a rough table and stops. If the system is ONLY the book, what happened to the book's kinetic energy?",
    options: [
      "It was destroyed when the book stopped",
      "It transferred OUT of the system as thermal energy due to friction with the table",
      "It turned into gravitational potential energy",
      "It stayed in the system as stored elastic potential energy"
    ],
    correctIndex: 1,
    explanation: "The book's kinetic energy didn't vanish — friction between the book and table transferred energy OUT of the book system as thermal energy. The table (which is outside this system) warmed up. Energy left the system through the friction interaction."
  },
  {
    id: "e16",
    type: "multiple_choice",
    prompt: "You push a shopping cart across a parking lot. If the system is the cart, what type of energy is entering the system?",
    options: [
      "Chemical energy from the cart's wheels",
      "Elastic potential energy from the handle",
      "Kinetic energy — your push transfers energy into the cart system",
      "Thermal energy from your hands"
    ],
    correctIndex: 2,
    explanation: "Your push is a force applied from OUTSIDE the cart system. That force does work on the cart, transferring kinetic energy INTO the system. The energy source is ultimately the chemical energy in your muscles, but what enters the cart system is kinetic energy via the push."
  },
  {
    id: "e17",
    type: "true_false",
    prompt: "If you define your system as a wind turbine + the electrical grid, the wind is an energy source OUTSIDE the system transferring energy IN.",
    correctAnswer: true,
    explanation: "The moving air (wind) is not part of the turbine+grid system. Wind carries kinetic energy that enters the system when air pushes the turbine blades. Your system boundary determines what counts as an external energy input vs. an internal transfer."
  },
  {
    id: "e18",
    type: "multiple_choice",
    prompt: "A hot cup of coffee sits on a kitchen counter. System = the coffee. Over 30 minutes, what is happening to the energy in this system?",
    options: [
      "Energy is entering the system from the counter",
      "Thermal energy is leaving the system — transferring to the cup, air, and counter",
      "The coffee's chemical energy is increasing",
      "No energy change — the coffee just sits there"
    ],
    correctIndex: 1,
    explanation: "The coffee (system) is warmer than its surroundings (outside the system). Thermal energy flows OUT of the system into the cooler cup, air, and counter through conduction and convection. That's why the coffee cools down — it's losing energy to its environment."
  },
  {
    id: "e19",
    type: "multiple_choice",
    prompt: "A student heats a pot of water on a gas stove. System = the water. Which correctly describes energy flow?",
    options: [
      "Chemical energy is entering the water from the gas",
      "Thermal energy is entering the water system from the flame beneath it",
      "The water is creating its own thermal energy",
      "Kinetic energy is entering from the burner"
    ],
    correctIndex: 1,
    explanation: "The gas flame (outside the system) transfers thermal energy INTO the water system through the pot. The chemical → thermal conversion happens in the flame (outside), but what crosses the system boundary into the water is thermal energy."
  },

  // ── IDENTIFYING TRANSFORMATIONS IN SCENARIOS ──────────────
  {
    id: "e20",
    type: "multiple_choice",
    prompt: "A kid jumps on a trampoline and goes up into the air. At the moment they leave the trampoline surface going upward, what transformation JUST occurred?",
    options: [
      "Gravitational potential → Kinetic",
      "Elastic potential → Kinetic",
      "Chemical → Elastic potential",
      "Thermal → Kinetic"
    ],
    correctIndex: 1,
    explanation: "The stretched trampoline surface stores elastic potential energy. As it snaps back to shape, that elastic PE converts into kinetic energy of the jumper launching upward. The trampoline acts like a spring — compressed/stretched = stored energy, released = motion."
  },
  {
    id: "e21",
    type: "multiple_choice",
    prompt: "A drag racer burns fuel and accelerates from 0 to 100 mph. What is the primary energy transformation?",
    options: [
      "Kinetic → Chemical",
      "Thermal → Gravitational potential",
      "Chemical → Thermal → Kinetic",
      "Elastic potential → Kinetic"
    ],
    correctIndex: 2,
    explanation: "The fuel stores chemical energy in molecular bonds. Combustion breaks those bonds and releases thermal energy (hot expanding gases). That thermal energy of expanding gases pushes pistons, creating kinetic energy that drives the wheels."
  },
  {
    id: "e22",
    type: "true_false",
    prompt: "When an archer pulls back a bowstring and holds it, energy has already been transferred — from the archer's muscles (chemical) to the bow (elastic potential).",
    correctAnswer: true,
    explanation: "The archer's muscles converted chemical energy into kinetic energy (arm motion), which did work stretching the bow. That energy is now stored as elastic potential energy in the bent bow and stretched string — even though nothing is moving. Release the string and it converts to kinetic energy of the arrow."
  },
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

  // ── SYSTEM BOUNDARIES & MULTI-STEP TRANSFERS ──────────────
  {
    id: "e26",
    type: "multiple_choice",
    prompt: "A solar-powered calculator sits on a desk. System = the calculator. What energy is entering the system, and what does it become?",
    options: [
      "Thermal energy enters → becomes electrical energy",
      "Electromagnetic (light) energy enters → becomes electrical energy",
      "Chemical energy enters → becomes light energy",
      "Kinetic energy enters → becomes sound energy"
    ],
    correctIndex: 1,
    explanation: "Light (electromagnetic energy) from the room enters the calculator system through the solar cell, which converts it to electrical energy that powers the circuits and display. The energy source is outside the system; the conversion happens inside."
  },
  {
    id: "e27",
    type: "multiple_choice",
    prompt: "A spring-loaded toy car is wound up and released on a flat table. What is the energy transformation sequence?",
    options: [
      "Chemical → Kinetic → Thermal",
      "Gravitational potential → Kinetic → Sound",
      "Elastic potential → Kinetic → Thermal (from friction)",
      "Kinetic → Elastic potential → Gravitational potential"
    ],
    correctIndex: 2,
    explanation: "Winding the car stores elastic potential energy in the spring. When released, the spring uncoils and converts that stored energy into kinetic energy (the car moves). As the car rolls, friction between the wheels and table gradually transfers kinetic energy into thermal energy, slowing the car."
  },
  {
    id: "e28",
    type: "true_false",
    prompt: "If you define the system as a person + a bicycle, the chemical energy in the rider's muscles is INSIDE the system.",
    correctAnswer: true,
    explanation: "Since the rider is part of the system, their internal chemical energy (stored in muscles from food) is inside the system. The chemical → kinetic transformation that powers pedaling happens entirely within the system boundaries. Food energy entered the system earlier when the rider ate."
  },
  {
    id: "e29",
    type: "multiple_choice",
    prompt: "A student drops a textbook from a shelf. System = the book only. Which describes the energy change?",
    options: [
      "Chemical energy converts to kinetic energy inside the system",
      "Gravity (outside force) transfers energy INTO the system, increasing the book's kinetic energy",
      "The book's thermal energy converts to kinetic energy",
      "No energy enters or leaves — the book already had kinetic energy"
    ],
    correctIndex: 1,
    explanation: "With only the book as the system, gravity is an external force doing work on the system. As the book falls, gravity transfers energy into the book system, increasing its kinetic energy. The book started with zero KE and gains more as it accelerates downward."
  },
  {
    id: "e30",
    type: "multiple_choice",
    prompt: "You clap your hands together loudly. What energy transformation occurs?",
    options: [
      "Sound → Kinetic → Thermal",
      "Kinetic → Sound + Thermal",
      "Chemical → Gravitational potential → Sound",
      "Elastic potential → Kinetic → Light"
    ],
    correctIndex: 1,
    explanation: "Your hands have kinetic energy as they swing together. When they collide, that kinetic energy converts into sound energy (the clap you hear) and thermal energy (your palms warm up slightly from the impact). Multiple outputs from one input."
  },
  {
    id: "e31",
    type: "true_false",
    prompt: "A [car + Earth] system with the car parked at the top of a steep hill has zero energy because the car is not moving.",
    correctAnswer: false,
    explanation: "The [car + Earth] system has gravitational potential energy due to the car's elevated position (GPE = mgh). The car also has chemical energy stored in its fuel. 'Not moving' only means zero kinetic energy — a system can store multiple types of energy simultaneously."
  },
  {
    id: "e32",
    type: "multiple_choice",
    prompt: "A [pendulum + Earth] system swings back and forth. At the very bottom of its swing, what types of energy does the system have?",
    options: [
      "Maximum gravitational potential energy, zero kinetic energy",
      "Maximum kinetic energy, minimum gravitational potential energy",
      "Equal amounts of kinetic and gravitational potential energy",
      "Zero energy — it's about to change direction"
    ],
    correctIndex: 1,
    explanation: "At the lowest point, the [pendulum + Earth] system is at its minimum height (minimum GPE) and the pendulum is moving at its maximum speed (maximum KE). The energy that was stored as GPE at the top of the swing has been transferred into KE at the bottom."
  },
  {
    id: "e33",
    type: "multiple_choice",
    prompt: "A campfire burns a log. System = the log. What is happening to the energy in this system?",
    options: [
      "Energy is entering the log from the air",
      "The log's chemical energy is leaving the system as thermal and light energy",
      "The log's kinetic energy is converting to chemical energy",
      "Gravitational potential energy is being released"
    ],
    correctIndex: 1,
    explanation: "The log stores chemical energy in its molecular bonds. As it burns, those bonds break and the chemical energy converts to thermal energy (heat) and electromagnetic energy (light) that radiate AWAY from the log — energy is leaving the system."
  },
  {
    id: "e34",
    type: "true_false",
    prompt: "When a ball rolls to a stop on a flat surface, the kinetic energy is 'used up' and no longer exists anywhere.",
    correctAnswer: false,
    explanation: "The kinetic energy wasn't used up — it was transferred to thermal energy through friction. The ball, the surface, and the surrounding air all warmed up by a tiny amount. The energy still exists, just in a less organized form (thermal) that's hard to see or measure without sensitive instruments."
  },
  {
    id: "e35",
    type: "multiple_choice",
    prompt: "A student lifts a barbell overhead and holds it still. System = [barbell + Earth]. While being lifted, what energy entered the system?",
    options: [
      "Chemical energy from the student's muscles entered the system",
      "The student's force transferred energy into the [barbell + Earth] system, increasing its gravitational potential energy",
      "Thermal energy entered the system from the student's hands",
      "No energy entered — the system created its own potential energy"
    ],
    correctIndex: 1,
    explanation: "The student (outside the [barbell + Earth] system) applied an upward force over a distance, doing work on the system. This transferred energy INTO the [barbell + Earth] system. That energy is now stored as gravitational potential energy due to the barbell's increased height."
  }
];

// ── SHIP DEFINITIONS ────────────────────────────────────────
const SHIPS = [
  { name: "Carrier", size: 5, code: "CV", bonus: 500 },
  { name: "Battleship", size: 4, code: "BB", bonus: 400 },
  { name: "Cruiser", size: 3, code: "CA", bonus: 300 },
  { name: "Submarine", size: 3, code: "SS", bonus: 300 },
  { name: "Patrol Boat", size: 2, code: "PT", bonus: 200 },
];

const GRID_SIZE = 8;
const LETTERS = "ABCDEFGH";

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
        placements.push({ ...ship, cells, hits: 0, horizontal });
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

// Shuffle MC option order so correct answer isn't always in the same position
function shuffleQuestionOptions(questions) {
  return questions.map(q => {
    if (q.type !== "multiple_choice") return q;
    const indices = q.options.map((_, i) => i);
    const shuffled = shuffleArray(indices);
    return {
      ...q,
      options: shuffled.map(i => q.options[i]),
      correctIndex: shuffled.indexOf(q.correctIndex),
    };
  });
}

// ── ENEMY AI (Hunt/Target) ──────────────────────────────────
// Tracks: mode (hunt = random, target = finishing a hit ship),
// hitStack for adjacent cells to check, and all previous shots.
function createEnemyAI() {
  return {
    mode: "hunt", // "hunt" or "target"
    hitStack: [],  // cells to try next when targeting
    allShots: [],  // [{row,col}]
    firstHit: null,
    direction: null,
  };
}

function enemyAIFire(ai, playerGrid, playerPlacements) {
  const alreadyShot = (r, c) => ai.allShots.some(s => s.row === r && s.col === c);
  const inBounds = (r, c) => r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];

  let row, col;

  if (ai.mode === "target" && ai.hitStack.length > 0) {
    // Try cells from the hit stack
    let found = false;
    while (ai.hitStack.length > 0) {
      const next = ai.hitStack.pop();
      if (inBounds(next.row, next.col) && !alreadyShot(next.row, next.col)) {
        row = next.row;
        col = next.col;
        found = true;
        break;
      }
    }
    if (!found) {
      ai.mode = "hunt";
      ai.firstHit = null;
      ai.direction = null;
    }
  }

  if (ai.mode === "hunt" || row === undefined) {
    // Checkerboard pattern for efficiency — only target cells where (r+c) % 2 === 0 first
    const candidates = [];
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (!alreadyShot(r, c)) {
          candidates.push({ row: r, col: c, priority: (r + c) % 2 === 0 ? 1 : 0 });
        }
      }
    }
    // Prefer checkerboard cells, but fall back to any
    const preferred = candidates.filter(c => c.priority === 1);
    const pool = preferred.length > 0 ? preferred : candidates;
    if (pool.length === 0) return null; // no cells left
    const pick = pool[Math.floor(Math.random() * pool.length)];
    row = pick.row;
    col = pick.col;
  }

  ai.allShots.push({ row, col });
  const cellValue = playerGrid[row][col];
  const hit = cellValue !== null;

  let sunkShip = null;
  if (hit) {
    // Update placements
    const updatedPlacements = playerPlacements.map(ship => {
      if (ship.code === cellValue) {
        const updated = { ...ship, hits: ship.hits + 1 };
        if (updated.hits >= updated.size) sunkShip = updated;
        return updated;
      }
      return ship;
    });

    // Switch to target mode
    if (!ai.firstHit) ai.firstHit = { row, col };
    ai.mode = "target";

    // Add adjacent cells to hit stack
    for (const [dr, dc] of dirs) {
      const nr = row + dr;
      const nc = col + dc;
      if (inBounds(nr, nc) && !alreadyShot(nr, nc)) {
        ai.hitStack.push({ row: nr, col: nc });
      }
    }

    if (sunkShip) {
      // Ship sunk — clear hit stack for that ship, go back to hunt if nothing left
      ai.hitStack = [];
      ai.firstHit = null;
      ai.direction = null;
      // Check if there are other un-sunk hits to follow up on
      const unsunkHits = ai.allShots.filter(s => {
        const val = playerGrid[s.row][s.col];
        if (!val) return false;
        const ship = updatedPlacements.find(sh => sh.code === val);
        return ship && ship.hits < ship.size;
      });
      if (unsunkHits.length > 0) {
        ai.mode = "target";
        for (const h of unsunkHits) {
          for (const [dr, dc] of dirs) {
            const nr = h.row + dr;
            const nc = h.col + dc;
            if (inBounds(nr, nc) && !alreadyShot(nr, nc)) {
              ai.hitStack.push({ row: nr, col: nc });
            }
          }
        }
      } else {
        ai.mode = "hunt";
      }
    }

    return { row, col, hit: true, sunkShip, updatedPlacements };
  }

  return { row, col, hit: false, sunkShip: null, updatedPlacements: null };
}


// ── SOUND EFFECTS (Web Audio API) ───────────────────────────
// Layered synthesis for a cinematic Cold War naval warfare feel
const AudioCtx = typeof window !== "undefined" ? (window.AudioContext || window.webkitAudioContext) : null;
let audioCtx = null;
let masterGain = null;
function getAudioCtx() {
  if (!audioCtx && AudioCtx) audioCtx = new AudioCtx();
  return audioCtx;
}
function getMasterGain(ctx) {
  if (!masterGain && ctx) {
    masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    // Restore saved volume
    const saved = localStorage.getItem("battleship-volume");
    const muted = localStorage.getItem("battleship-muted") === "true";
    masterGain.gain.value = muted ? 0 : (saved !== null ? Number(saved) / 100 : 0.5);
  }
  return masterGain;
}

// Helper: white noise buffer
function noiseBuffer(ctx, duration) {
  const len = ctx.sampleRate * duration;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

// SONAR PING — targeting lock confirmed
// Two-tone descending sonar ping with metallic reverb tail
function playPing() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const dest = getMasterGain(ctx);
    const t = ctx.currentTime;
    // Primary ping tone
    const o1 = ctx.createOscillator(); const g1 = ctx.createGain();
    o1.type = "sine";
    o1.frequency.setValueAtTime(1600, t);
    o1.frequency.exponentialRampToValueAtTime(1200, t + 0.08);
    g1.gain.setValueAtTime(0.2, t);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    o1.connect(g1); g1.connect(dest);
    o1.start(t); o1.stop(t + 0.5);
    // Echo ping (delayed, quieter)
    const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
    o2.type = "sine";
    o2.frequency.setValueAtTime(1200, t + 0.12);
    o2.frequency.exponentialRampToValueAtTime(900, t + 0.2);
    g2.gain.setValueAtTime(0, t);
    g2.gain.setValueAtTime(0.08, t + 0.12);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    o2.connect(g2); g2.connect(dest);
    o2.start(t + 0.12); o2.stop(t + 0.7);
  } catch(e) {}
}

// EXPLOSION HIT — shell strikes steel (layered: thud + crunch + fire crackle)
function playHit() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const dest = getMasterGain(ctx);
    const t = ctx.currentTime;
    // 1) Deep impact thud (low sine burst)
    const thud = ctx.createOscillator(); const gThud = ctx.createGain();
    thud.type = "sine";
    thud.frequency.setValueAtTime(90, t);
    thud.frequency.exponentialRampToValueAtTime(30, t + 0.4);
    gThud.gain.setValueAtTime(0.35, t);
    gThud.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    thud.connect(gThud); gThud.connect(dest);
    thud.start(t); thud.stop(t + 0.5);
    // 2) Metal crunch (filtered noise burst)
    const nSrc = ctx.createBufferSource(); nSrc.buffer = noiseBuffer(ctx, 0.5);
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 800; bp.Q.value = 2;
    const gN = ctx.createGain();
    gN.gain.setValueAtTime(0.3, t);
    gN.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    nSrc.connect(bp); bp.connect(gN); gN.connect(dest);
    nSrc.start(t); nSrc.stop(t + 0.5);
    // 3) Fire crackle (high noise tail)
    const nSrc2 = ctx.createBufferSource(); nSrc2.buffer = noiseBuffer(ctx, 0.8);
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 3000;
    const gN2 = ctx.createGain();
    gN2.gain.setValueAtTime(0, t);
    gN2.gain.setValueAtTime(0.06, t + 0.1);
    gN2.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
    nSrc2.connect(hp); hp.connect(gN2); gN2.connect(dest);
    nSrc2.start(t + 0.05); nSrc2.stop(t + 0.8);
  } catch(e) {}
}

// SPLASH — shell hits open water (deep plunge + spray hiss)
function playSplash() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const dest = getMasterGain(ctx);
    const t = ctx.currentTime;
    // 1) Water plunge (low thump)
    const plunge = ctx.createOscillator(); const gP = ctx.createGain();
    plunge.type = "sine";
    plunge.frequency.setValueAtTime(120, t);
    plunge.frequency.exponentialRampToValueAtTime(40, t + 0.25);
    gP.gain.setValueAtTime(0.12, t);
    gP.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    plunge.connect(gP); gP.connect(dest);
    plunge.start(t); plunge.stop(t + 0.3);
    // 2) Spray hiss (shaped noise)
    const nSrc = ctx.createBufferSource(); nSrc.buffer = noiseBuffer(ctx, 0.6);
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 2500;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.setValueAtTime(8000, t);
    lp.frequency.exponentialRampToValueAtTime(2000, t + 0.5);
    const gN = ctx.createGain();
    gN.gain.setValueAtTime(0, t);
    gN.gain.linearRampToValueAtTime(0.12, t + 0.04);
    gN.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
    nSrc.connect(hp); hp.connect(lp); lp.connect(gN); gN.connect(dest);
    nSrc.start(t); nSrc.stop(t + 0.6);
  } catch(e) {}
}

// SHIP SUNK — massive hull breach & sinking (deep groan + explosion + bubbles)
function playSunk() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const dest = getMasterGain(ctx);
    const t = ctx.currentTime;
    // 1) Deep hull groan (descending sawtooth)
    const groan = ctx.createOscillator(); const gG = ctx.createGain();
    groan.type = "sawtooth";
    groan.frequency.setValueAtTime(200, t);
    groan.frequency.exponentialRampToValueAtTime(35, t + 1.2);
    gG.gain.setValueAtTime(0.18, t);
    gG.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
    const lpG = ctx.createBiquadFilter(); lpG.type = "lowpass"; lpG.frequency.value = 400;
    groan.connect(lpG); lpG.connect(gG); gG.connect(dest);
    groan.start(t); groan.stop(t + 1.2);
    // 2) Explosion burst (noise + low sine)
    const boom = ctx.createOscillator(); const gB = ctx.createGain();
    boom.type = "sine";
    boom.frequency.setValueAtTime(60, t);
    boom.frequency.exponentialRampToValueAtTime(20, t + 0.6);
    gB.gain.setValueAtTime(0.3, t);
    gB.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    boom.connect(gB); gB.connect(dest);
    boom.start(t); boom.stop(t + 0.6);
    const nSrc = ctx.createBufferSource(); nSrc.buffer = noiseBuffer(ctx, 0.8);
    const bp = ctx.createBiquadFilter(); bp.type = "bandpass"; bp.frequency.value = 500; bp.Q.value = 1;
    const gN = ctx.createGain();
    gN.gain.setValueAtTime(0.25, t);
    gN.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    nSrc.connect(bp); bp.connect(gN); gN.connect(dest);
    nSrc.start(t); nSrc.stop(t + 0.8);
    // 3) Sinking bubbles (modulated sine)
    const bub = ctx.createOscillator(); const gBub = ctx.createGain();
    bub.type = "sine";
    bub.frequency.setValueAtTime(300, t + 0.5);
    bub.frequency.setValueAtTime(400, t + 0.6);
    bub.frequency.setValueAtTime(250, t + 0.7);
    bub.frequency.setValueAtTime(350, t + 0.8);
    bub.frequency.setValueAtTime(200, t + 0.9);
    bub.frequency.exponentialRampToValueAtTime(100, t + 1.4);
    gBub.gain.setValueAtTime(0, t);
    gBub.gain.setValueAtTime(0.06, t + 0.5);
    gBub.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
    bub.connect(gBub); gBub.connect(dest);
    bub.start(t + 0.5); bub.stop(t + 1.4);
  } catch(e) {}
}

// ALARM — enemy incoming fire (urgent klaxon, two pulses)
function playAlarm() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const dest = getMasterGain(ctx);
    const t = ctx.currentTime;
    // Two-pulse klaxon
    for (let p = 0; p < 2; p++) {
      const offset = p * 0.22;
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "square";
      o.frequency.setValueAtTime(380, t + offset);
      o.frequency.linearRampToValueAtTime(520, t + offset + 0.08);
      o.frequency.linearRampToValueAtTime(380, t + offset + 0.16);
      g.gain.setValueAtTime(0.14, t + offset);
      g.gain.setValueAtTime(0.14, t + offset + 0.14);
      g.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.2);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1500;
      o.connect(lp); lp.connect(g); g.connect(dest);
      o.start(t + offset); o.stop(t + offset + 0.2);
    }
    // Impact rumble underneath
    const nSrc = ctx.createBufferSource(); nSrc.buffer = noiseBuffer(ctx, 0.6);
    const lp2 = ctx.createBiquadFilter(); lp2.type = "lowpass"; lp2.frequency.value = 200;
    const gN = ctx.createGain();
    gN.gain.setValueAtTime(0.15, t + 0.1);
    gN.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
    nSrc.connect(lp2); lp2.connect(gN); gN.connect(dest);
    nSrc.start(t + 0.1); nSrc.stop(t + 0.6);
  } catch(e) {}
}

// VICTORY — fleet destroyed (triumphant brass fanfare + war drums)
function playVictory() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return;
    const dest = getMasterGain(ctx);
    const t = ctx.currentTime;
    // Brass-like fanfare (stacked oscillators with harmonics)
    const fanfare = [
      { freq: 262, time: 0, dur: 0.3 },    // C4
      { freq: 330, time: 0.15, dur: 0.3 },  // E4
      { freq: 392, time: 0.3, dur: 0.35 },  // G4
      { freq: 523, time: 0.5, dur: 0.6 },   // C5 (held)
    ];
    fanfare.forEach(({ freq, time, dur }) => {
      // Fundamental
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "sawtooth";
      o.frequency.value = freq;
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = freq * 3;
      g.gain.setValueAtTime(0, t + time);
      g.gain.linearRampToValueAtTime(0.12, t + time + 0.04);
      g.gain.setValueAtTime(0.12, t + time + dur - 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
      o.connect(lp); lp.connect(g); g.connect(dest);
      o.start(t + time); o.stop(t + time + dur);
      // Octave above (brightness)
      const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
      o2.type = "triangle";
      o2.frequency.value = freq * 2;
      g2.gain.setValueAtTime(0, t + time);
      g2.gain.linearRampToValueAtTime(0.04, t + time + 0.04);
      g2.gain.exponentialRampToValueAtTime(0.001, t + time + dur);
      o2.connect(g2); g2.connect(dest);
      o2.start(t + time); o2.stop(t + time + dur);
    });
    // War drum hits (4 beats)
    [0, 0.15, 0.3, 0.5].forEach((time) => {
      const nSrc = ctx.createBufferSource(); nSrc.buffer = noiseBuffer(ctx, 0.15);
      const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 150;
      const gD = ctx.createGain();
      gD.gain.setValueAtTime(0.2, t + time);
      gD.gain.exponentialRampToValueAtTime(0.001, t + time + 0.15);
      nSrc.connect(lp); lp.connect(gD); gD.connect(dest);
      nSrc.start(t + time); nSrc.stop(t + time + 0.15);
    });
  } catch(e) {}
}


// ── BACKGROUND MUSIC (Web Audio API) ────────────────────────
// Ambient Cold War submarine tension: drone + sonar sweeps + filtered noise pad
// Returns a handle with a stop() method for cleanup
function startMusic() {
  try {
    const ctx = getAudioCtx(); if (!ctx) return null;
    const dest = getMasterGain(ctx);
    const nodes = []; // track all nodes for cleanup

    // --- 1) SUBMARINE DRONE: two detuned sawtooth oscillators through lowpass ---
    const droneGain = ctx.createGain();
    droneGain.gain.value = 0.06;
    const droneLp = ctx.createBiquadFilter();
    droneLp.type = "lowpass"; droneLp.frequency.value = 120; droneLp.Q.value = 2;

    const drone1 = ctx.createOscillator();
    drone1.type = "sawtooth"; drone1.frequency.value = 55; // A1
    const drone2 = ctx.createOscillator();
    drone2.type = "sawtooth"; drone2.frequency.value = 55.8; // slightly detuned for beating

    drone1.connect(droneLp); drone2.connect(droneLp);
    droneLp.connect(droneGain); droneGain.connect(dest);
    drone1.start(); drone2.start();
    nodes.push(drone1, drone2);

    // Slow sub-bass LFO to modulate drone volume (breathing effect)
    const droneLfo = ctx.createOscillator();
    droneLfo.type = "sine"; droneLfo.frequency.value = 0.15; // one cycle every ~7s
    const droneLfoGain = ctx.createGain();
    droneLfoGain.gain.value = 0.025; // subtle modulation depth
    droneLfo.connect(droneLfoGain);
    droneLfoGain.connect(droneGain.gain);
    droneLfo.start();
    nodes.push(droneLfo);

    // --- 2) SONAR SWEEP: periodic ping that fades in/out every ~8s ---
    const sonarGain = ctx.createGain();
    sonarGain.gain.value = 0;
    const sonarBp = ctx.createBiquadFilter();
    sonarBp.type = "bandpass"; sonarBp.frequency.value = 1000; sonarBp.Q.value = 12;
    const sonarOsc = ctx.createOscillator();
    sonarOsc.type = "sine"; sonarOsc.frequency.value = 900;

    // Slow frequency LFO for sweep (800-1200 Hz range)
    const sonarFreqLfo = ctx.createOscillator();
    sonarFreqLfo.type = "sine"; sonarFreqLfo.frequency.value = 0.08;
    const sonarFreqDepth = ctx.createGain();
    sonarFreqDepth.gain.value = 200;
    sonarFreqLfo.connect(sonarFreqDepth);
    sonarFreqDepth.connect(sonarOsc.frequency);

    // Amplitude LFO — makes the sonar fade in/out periodically
    const sonarAmpLfo = ctx.createOscillator();
    sonarAmpLfo.type = "sine"; sonarAmpLfo.frequency.value = 0.12; // ~8s cycle
    const sonarAmpDepth = ctx.createGain();
    sonarAmpDepth.gain.value = 0.025;
    sonarAmpLfo.connect(sonarAmpDepth);
    sonarAmpDepth.connect(sonarGain.gain);

    sonarOsc.connect(sonarBp); sonarBp.connect(sonarGain); sonarGain.connect(dest);
    sonarOsc.start(); sonarFreqLfo.start(); sonarAmpLfo.start();
    nodes.push(sonarOsc, sonarFreqLfo, sonarAmpLfo);

    // --- 3) TENSION PAD: filtered noise with slow amplitude modulation ---
    // Use a ScriptProcessorNode replacement: looping noise buffer
    const padDuration = 8; // seconds of noise buffer (loops)
    const padBuf = noiseBuffer(ctx, padDuration);
    const padSrc = ctx.createBufferSource();
    padSrc.buffer = padBuf; padSrc.loop = true;

    const padLp = ctx.createBiquadFilter();
    padLp.type = "lowpass"; padLp.frequency.value = 400; padLp.Q.value = 1;
    const padHp = ctx.createBiquadFilter();
    padHp.type = "highpass"; padHp.frequency.value = 80;
    const padGain = ctx.createGain();
    padGain.gain.value = 0.035;

    // Slow amplitude modulation for eerie breathing effect
    const padLfo = ctx.createOscillator();
    padLfo.type = "sine"; padLfo.frequency.value = 0.1; // ~10s cycle
    const padLfoDepth = ctx.createGain();
    padLfoDepth.gain.value = 0.015;
    padLfo.connect(padLfoDepth);
    padLfoDepth.connect(padGain.gain);

    padSrc.connect(padHp); padHp.connect(padLp); padLp.connect(padGain); padGain.connect(dest);
    padSrc.start(); padLfo.start();
    nodes.push(padSrc, padLfo);

    // --- 4) LOW HEARTBEAT: very subtle rhythmic pulse ---
    const heartOsc = ctx.createOscillator();
    heartOsc.type = "sine"; heartOsc.frequency.value = 40; // sub-bass thump
    const heartGain = ctx.createGain();
    heartGain.gain.value = 0;
    const heartLfo = ctx.createOscillator();
    heartLfo.type = "square"; heartLfo.frequency.value = 0.8; // ~48 bpm
    const heartLfoGain = ctx.createGain();
    heartLfoGain.gain.value = 0.04;
    heartLfo.connect(heartLfoGain);
    heartLfoGain.connect(heartGain.gain);

    const heartLp = ctx.createBiquadFilter();
    heartLp.type = "lowpass"; heartLp.frequency.value = 80;
    heartOsc.connect(heartLp); heartLp.connect(heartGain); heartGain.connect(dest);
    heartOsc.start(); heartLfo.start();
    nodes.push(heartOsc, heartLfo);

    return {
      nodes,
      gains: [droneGain, sonarGain, padGain, heartGain],
      stop() {
        // Fade out over 1.5s then disconnect
        const t = ctx.currentTime;
        [droneGain, sonarGain, padGain, heartGain].forEach(g => {
          try { g.gain.cancelScheduledValues(t); g.gain.setValueAtTime(g.gain.value, t); g.gain.linearRampToValueAtTime(0, t + 1.5); } catch(e) {}
        });
        setTimeout(() => {
          nodes.forEach(n => { try { n.stop(); } catch(e) {} });
          nodes.forEach(n => { try { n.disconnect(); } catch(e) {} });
          [droneGain, sonarGain, padGain, heartGain, droneLp, sonarBp, padLp, padHp, heartLp, droneLfoGain, sonarFreqDepth, sonarAmpDepth, padLfoDepth, heartLfoGain].forEach(n => { try { n.disconnect(); } catch(e) {} });
        }, 1600);
      },
    };
  } catch(e) { return null; }
}


// ── SHIP DRAWING (Canvas) ───────────────────────────────────
// Draws top-down ship silhouettes in CRT green style
function drawShip(ctx, x, y, cellSize, size, horizontal, code, isHit, isSunk) {
  const color = isSunk ? "rgba(255, 42, 42, 0.4)" : isHit ? "rgba(255, 42, 42, 0.6)" : "rgba(57, 255, 20, 0.5)";
  const borderColor = isSunk ? "rgba(255, 42, 42, 0.5)" : isHit ? "rgba(255, 42, 42, 0.7)" : "rgba(57, 255, 20, 0.7)";
  const glowColor = isSunk ? "rgba(255, 42, 42, 0.15)" : "rgba(57, 255, 20, 0.15)";

  ctx.save();

  const totalW = horizontal ? cellSize * size : cellSize;
  const totalH = horizontal ? cellSize : cellSize * size;
  const pad = 3;

  // Glow
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 8;

  // Hull shape — pointed bow
  ctx.beginPath();
  if (horizontal) {
    // Points right
    ctx.moveTo(x + pad, y + pad + 4);
    ctx.lineTo(x + totalW - pad - 6, y + pad);
    ctx.lineTo(x + totalW - pad, y + totalH / 2);
    ctx.lineTo(x + totalW - pad - 6, y + totalH - pad);
    ctx.lineTo(x + pad, y + totalH - pad - 4);
    ctx.quadraticCurveTo(x + pad - 2, y + totalH / 2, x + pad, y + pad + 4);
  } else {
    // Points up
    ctx.moveTo(x + pad + 4, y + pad);
    ctx.lineTo(x + totalW - pad - 4, y + pad);
    ctx.quadraticCurveTo(x + totalW / 2, y + pad - 2, x + pad + 4, y + pad);
    ctx.moveTo(x + pad + 4, y + pad);
    ctx.lineTo(x + pad, y + pad + 6);
    ctx.lineTo(x + pad, y + totalH - pad - 6);
    ctx.lineTo(x + totalW / 2, y + totalH - pad);
    ctx.lineTo(x + totalW - pad, y + totalH - pad - 6);
    ctx.lineTo(x + totalW - pad, y + pad + 6);
    ctx.lineTo(x + totalW - pad - 4, y + pad);
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Bridge / superstructure detail
  const bridgeColor = isSunk ? "rgba(255, 42, 42, 0.3)" : "rgba(57, 255, 20, 0.35)";
  if (horizontal) {
    const bx = x + cellSize * Math.floor(size / 2) + cellSize * 0.2;
    const by = y + totalH * 0.25;
    ctx.fillStyle = bridgeColor;
    ctx.fillRect(bx, by, cellSize * 0.6, totalH * 0.5);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(bx, by, cellSize * 0.6, totalH * 0.5);
  } else {
    const bx = x + totalW * 0.25;
    const by = y + cellSize * Math.floor(size / 2) + cellSize * 0.2;
    ctx.fillStyle = bridgeColor;
    ctx.fillRect(bx, by, totalW * 0.5, cellSize * 0.6);
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 0.5;
    ctx.strokeRect(bx, by, totalW * 0.5, cellSize * 0.6);
  }

  // Ship code label
  ctx.font = `bold ${Math.max(8, cellSize * 0.28)}px 'Share Tech Mono', monospace`;
  ctx.fillStyle = isSunk ? "rgba(255, 42, 42, 0.6)" : "rgba(57, 255, 20, 0.8)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(code, x + totalW / 2, y + totalH / 2);

  ctx.restore();
}


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

function Header({ subtitle }) {
  return (
    <div className="header">
      <div className="header-classification">⚠ TOP SECRET // OPERATION RED TIDE</div>
      <h1>BATTLESHIP<br />COMMAND</h1>
      <div className="header-subtitle">{subtitle || "NORTH ATLANTIC THEATRE — ENERGY SYSTEMS & TRANSFERS DIVISION"}</div>
    </div>
  );
}

function VolumeSlider({ volume, onVolumeChange, muted, onToggleMute }) {
  const icon = muted || volume === 0 ? "\u{1F507}" : volume > 50 ? "\u{1F50A}" : "\u{1F509}";
  return (
    <div className="status-item volume-control">
      <button className="volume-icon" onClick={onToggleMute} title={muted ? "Unmute" : "Mute"}>{icon}</button>
      <input type="range" className="volume-slider" min={0} max={100}
        value={muted ? 0 : volume}
        onChange={e => onVolumeChange(Number(e.target.value))} />
    </div>
  );
}

function StatusBar({ phase, turnNumber, score, accuracy, questionsLeft, totalQuestions, volume, onVolumeChange, muted, onToggleMute }) {
  const phaseName = phase === "targeting" ? "SELECT TARGET" : phase === "answering" ? "INTEL CHECK" : "RESOLVING";
  return (
    <div className="status-bar">
      <div className="status-item">
        <div className="status-dot" />
        <div>
          <div className="status-label">Status</div>
          <div className="phase-indicator">
            <span className={`phase-dot ${phase}`} />
            <span style={{ color: phase === "answering" ? "var(--soviet-gold)" : "var(--crt-green)" }}>{phaseName}</span>
          </div>
        </div>
      </div>
      <div className="status-item"><div><div className="status-label">Turn</div><div className="status-value">{turnNumber}</div></div></div>
      <div className="status-item"><div><div className="status-label">Score</div><div className="score-display">{score}</div></div></div>
      <div className="status-item"><div><div className="status-label">Accuracy</div><div className="status-value">{accuracy}%</div></div></div>
      <div className="status-item"><div><div className="status-label">Intel Remaining</div><div className={`status-value ${questionsLeft <= 5 ? "warning" : ""}`}>{questionsLeft}/{totalQuestions}</div></div></div>
      <VolumeSlider volume={volume} onVolumeChange={onVolumeChange} muted={muted} onToggleMute={onToggleMute} />
    </div>
  );
}

function generateBlipPool() {
  const pool = [];
  const used = new Set();
  while (pool.length < 3) {
    const row = Math.floor(Math.random() * 8);
    const col = Math.floor(Math.random() * 8);
    const k = `${row}-${col}`;
    if (used.has(k)) continue;
    used.add(k);
    const bx = (col + 1.5) / 9 * 100 - 50;
    const by = (row + 1.5) / 9 * 100 - 50;
    const angle = (Math.atan2(by, bx) * 180 / Math.PI + 360) % 360;
    pool.push({ row, col, angle, k });
  }
  return pool;
}

function RadarBlips() {
  const [activeBlips, setActiveBlips] = useState([]);
  const mountTime = useRef(Date.now());
  const poolRef = useRef(generateBlipPool());
  const triggeredRef = useRef(new Set());
  const lastAngleRef = useRef(0);
  const lastRotationRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = Date.now() - mountTime.current;
      const sweepAngle = (elapsed % 6000) / 6000 * 360;
      const rotation = Math.floor(elapsed / 6000);
      const last = lastAngleRef.current;

      // Refresh blip pool every 2 rotations
      if (rotation !== lastRotationRef.current && rotation % 2 === 0) {
        poolRef.current = generateBlipPool();
        triggeredRef.current.clear();
      }
      lastRotationRef.current = rotation;

      poolRef.current.forEach(blip => {
        const tk = `${blip.k}-${rotation}`;
        if (triggeredRef.current.has(tk)) return;

        let crossed;
        if (sweepAngle >= last) {
          crossed = blip.angle >= last && blip.angle < sweepAngle;
        } else {
          crossed = blip.angle >= last || blip.angle < sweepAngle;
        }

        if (crossed) {
          triggeredRef.current.add(tk);
          setActiveBlips(prev => [
            ...prev.filter(b => Date.now() - b.at < 5500),
            { row: blip.row, col: blip.col, at: Date.now(), id: `${Date.now()}-${blip.k}` },
          ]);
        }
      });

      lastAngleRef.current = sweepAngle;
    }, 80);

    return () => clearInterval(id);
  }, []);

  return (
    <>
      {activeBlips.map(b => (
        <div
          key={b.id}
          className="radar-blip"
          style={{
            left: `${(b.col + 1.5) / 9 * 100}%`,
            top: `${(b.row + 1.5) / 9 * 100}%`,
          }}
        />
      ))}
    </>
  );
}

function BattleGrid({ gridData, shots, targetCell, onCellClick, onCellHover, disabled, explosions, showShips, shipPlacements, shipCanvas }) {
  return (
    <div className="grid-wrapper">
      <div className="battle-grid">
        <div className="grid-label grid-corner" />
        {Array.from({ length: GRID_SIZE }, (_, i) => <div key={`ch-${i}`} className="grid-label">{i + 1}</div>)}
        {Array.from({ length: GRID_SIZE }, (_, row) => (
          <React.Fragment key={`row-${row}`}>
            <div className="grid-label">{LETTERS[row]}</div>
            {Array.from({ length: GRID_SIZE }, (_, col) => {
              const shot = shots.find(s => s.row === row && s.col === col);
              const hasShip = showShips && gridData && gridData[row][col] !== null;
              let cellClass = "grid-cell";
              if (shot) {
                if (shot.sunk) cellClass += " cell-sunk";
                else if (shot.hit) cellClass += " cell-hit";
                else cellClass += " cell-miss";
              } else if (hasShip && showShips) {
                // Check if this ship is sunk
                const shipCode = gridData[row][col];
                const ship = shipPlacements?.find(s => s.code === shipCode);
                if (ship && ship.hits >= ship.size) cellClass += " cell-ship-sunk";
                else cellClass += " cell-ship";
              }
              if (targetCell && targetCell.row === row && targetCell.col === col && !shot) cellClass += " cell-targeting";
              if (disabled || shot) cellClass += " disabled";
              return (
                <div key={`cell-${row}-${col}`} className={cellClass}
                  onClick={() => !disabled && !shot && onCellClick && onCellClick(row, col)}
                  onMouseEnter={() => !disabled && !shot && onCellHover && onCellHover(row, col)}
                  onMouseLeave={() => onCellHover && onCellHover(null, null)} />
              );
            })}
          </React.Fragment>
        ))}
        {/* Sunk ship image overlays — in separate container */}
        <div className="ship-overlay-container">
          {showShips && shipPlacements?.filter(s => s.hits >= s.size).map(ship => (
            <ShipOverlay key={`overlay-${ship.code}`}
              shipCode={ship.code}
              row={ship.cells[0][0]}
              col={ship.cells[0][1]}
              size={ship.size}
              horizontal={ship.horizontal}
              isSunk
              noLabels
            />
          ))}
        </div>
      </div>
      <div className="radar-scope" />
      <div className="radar-overlay"><div className="radar-sweep" /></div>
      <div className="sonar-container">
        <RadarBlips />
      </div>
      <div className="explosion-overlay">
        {(explosions || []).map((e, i) => (
          <div key={i} className={`explosion-ring ${e.hit ? "hit" : "miss"}`}
            style={{ left: `${(e.col+1)/(GRID_SIZE+1)*100}%`, top: `${(e.row+1)/(GRID_SIZE+1)*100}%`, transform: "translate(-50%, -50%)" }} />
        ))}
      </div>
    </div>
  );
}

function TargetReadout({ targetCell }) {
  if (!targetCell) return <div className="target-readout">AWAITING TARGET COORDINATES...</div>;
  return (
    <div className="target-readout target-locked">
      <div className="target-locked-coord">
        TARGET LOCKED: <span className="coord">{LETTERS[targetCell.row]}{targetCell.col + 1}</span>
      </div>
      <div className="target-confirm-msg">▼ CLICK AGAIN TO FIRE ▼</div>
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
      {ismc && <div>
        {question.options.map((opt, i) => {
          let cls = "option-btn";
          if (answered) {
            if (i === question.correctIndex) cls += " correct";
            else if (i === selectedAnswer && !wasCorrect) cls += " incorrect";
            else cls += " reveal-correct";
          }
          return <button key={i} className={cls} onClick={() => !answered && onAnswer(i)} disabled={answered}>
            <span className="option-letter">{String.fromCharCode(65 + i)}.</span> {opt}
          </button>;
        })}
      </div>}
      {istf && <div className="tf-buttons">
        {[true, false].map(val => {
          let cls = "tf-btn";
          if (answered) {
            if (val === question.correctAnswer) cls += " correct";
            else if (val === selectedAnswer && !wasCorrect) cls += " incorrect";
          }
          return <button key={String(val)} className={cls} onClick={() => !answered && onAnswer(val)} disabled={answered}>
            {val ? "TRUE" : "FALSE"}
          </button>;
        })}
      </div>}
      {answered && question.explanation && (
        <div className="explanation-box"><strong style={{ color: "var(--crt-green)" }}>INTEL: </strong>{question.explanation}</div>
      )}
    </div>
  );
}

function FleetStatus({ placements, label }) {
  return (
    <div className="intel-panel">
      <div className="intel-title">{label || "Enemy Fleet Status"}</div>
      {placements.map(ship => {
        const isSunk = ship.hits >= ship.size;
        return (
          <div key={ship.code + ship.name} className="ship-row">
            <ShipSilhouette shipCode={ship.code} isSunk={isSunk} />
            <div className={`ship-name ${isSunk ? "sunk" : ""}`}>{ship.name}</div>
            <div className="ship-cells">
              {Array.from({ length: ship.size }, (_, i) => (
                <div key={i} className={`ship-cell-indicator ${isSunk ? "sunk-cell" : i < ship.hits ? "damaged" : ""}`} />
              ))}
            </div>
            {isSunk && <span style={{ fontSize: 9, color: "var(--soviet-red)", letterSpacing: 1 }}>SUNK</span>}
          </div>
        );
      })}
    </div>
  );
}

function GridLegend() {
  return (
    <div className="intel-panel">
      <div className="intel-title">Grid Legend</div>
      <div className="legend-row"><div className="legend-swatch swatch-empty" /><span>Unexplored</span></div>
      <div className="legend-row"><div className="legend-swatch swatch-hit">✕</div><span style={{ color: "#ff4444" }}>Hit — Enemy ship detected</span></div>
      <div className="legend-row"><div className="legend-swatch swatch-miss">●</div><span style={{ color: "#5eaad4" }}>Miss — Open water</span></div>
      <div className="legend-row"><div className="legend-swatch swatch-sunk">☠</div><span style={{ color: "#ff6a3d" }}>Sunk — Ship destroyed</span></div>
    </div>
  );
}

function MessageLog({ messages }) {
  const logRef = useRef(null);
  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [messages]);
  return (
    <div className="intel-panel">
      <div className="intel-title">Combat Log</div>
      <div className="message-log" ref={logRef}>
        {messages.map((msg, i) => (
          <div key={i} className={`log-entry log-${msg.type}`}>
            <span className="log-time">{msg.time}</span>{msg.text}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── INTRO SCREEN ────────────────────────────────────────────
function IntroScreen({ onStart, user, authError, onSignIn, onSignOut }) {
  return (
    <div className="overlay-screen">
      <CRTOverlay />
      <div className="overlay-content" style={{ zIndex: 101 }}>
        <div className="header-classification" style={{ marginBottom: 16 }}>⚠ EYES ONLY // CINCLANTFLT</div>
        <h2 style={{ color: "var(--crt-green)", textShadow: "0 0 20px var(--crt-green-glow)", animation: "glowPulse 3s ease-in-out infinite" }}>
          OPERATION<br />RED TIDE
        </h2>
        <p style={{ color: "var(--crt-green-dim)", fontSize: 13, lineHeight: 1.7, margin: "16px 0", maxWidth: 460, marginInline: "auto" }}>
          COMINT has detected a Soviet naval formation in the North Atlantic.
          Your mission: locate and destroy all enemy vessels before they sink your fleet.
          <br /><br />
          Each turn, you select a target and decode intercepted intelligence on{" "}
          <span style={{ color: "var(--crt-green)" }}>energy types, systems, and transfers</span>.
          Correct intel authorizes your strike. Wrong answers cancel your attack.
          <br /><br />
          <span style={{ color: "var(--soviet-red)" }}>WARNING:</span> The enemy returns fire every turn regardless. Protect your fleet.
        </p>

        {/* Auth section */}
        {!user ? (
          <div className="auth-section">
            <button className="google-sign-in-btn" onClick={onSignIn}>
              Sign In with Google
            </button>
            {authError && (
              <div className="auth-error">{authError}</div>
            )}
            <div className="auth-hint">Use your @paps.net school account</div>
          </div>
        ) : (
          <div className="auth-section">
            <div className="auth-status">
              <span className="auth-user">{user.displayName || user.email}</span>
              <button className="auth-signout" onClick={onSignOut}>Sign Out</button>
            </div>
          </div>
        )}

        <SchematicFleet ships={SHIPS} currentShipIdx={-1} placements={[]} compact />
        <button className="start-btn" onClick={onStart} disabled={!user}>BEGIN OPERATION</button>
      </div>
    </div>
  );
}


// ── PLACEMENT PHASE ─────────────────────────────────────────
function PlacementPhase({ onComplete }) {
  const [grid, setGrid] = useState(createEmptyGrid);
  const [placements, setPlacements] = useState([]);
  const [currentShipIdx, setCurrentShipIdx] = useState(0);
  const [horizontal, setHorizontal] = useState(true);
  const [hoverCells, setHoverCells] = useState([]);

  const currentShip = currentShipIdx < SHIPS.length ? SHIPS[currentShipIdx] : null;
  const allPlaced = placements.length === SHIPS.length;

  // Keyboard shortcuts: H = horizontal, V = vertical, R = toggle
  useEffect(() => {
    const handler = (e) => {
      if (allPlaced) return;
      const k = e.key.toLowerCase();
      if (k === "h") setHorizontal(true);
      else if (k === "v") setHorizontal(false);
      else if (k === "r") setHorizontal(h => !h);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [allPlaced]);

  const handleCellHover = useCallback((row, col) => {
    if (!currentShip || allPlaced) { setHoverCells([]); return; }
    const cells = [];
    let valid = true;
    for (let i = 0; i < currentShip.size; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
      if (r >= GRID_SIZE || c >= GRID_SIZE || grid[r][c] !== null) { valid = false; break; }
      cells.push([r, c]);
    }
    setHoverCells(valid ? cells : []);
  }, [currentShip, horizontal, grid, allPlaced]);

  const handleCellClick = useCallback((row, col) => {
    if (!currentShip || allPlaced) return;
    if (!canPlaceShip(grid, row, col, currentShip.size, horizontal)) return;

    const newGrid = grid.map(r => [...r]);
    const cells = [];
    for (let i = 0; i < currentShip.size; i++) {
      const r = horizontal ? row : row + i;
      const c = horizontal ? col + i : col;
      newGrid[r][c] = currentShip.code;
      cells.push([r, c]);
    }
    setGrid(newGrid);
    setPlacements(prev => [...prev, { ...currentShip, cells, hits: 0, horizontal }]);
    setCurrentShipIdx(prev => prev + 1);
    setHoverCells([]);
  }, [currentShip, horizontal, grid, allPlaced]);

  const handleRandomize = useCallback(() => {
    const { grid: newGrid, placements: newPlacements } = placeShipsRandomly();
    setGrid(newGrid);
    setPlacements(newPlacements);
    setCurrentShipIdx(SHIPS.length);
    setHoverCells([]);
  }, []);

  const handleReset = useCallback(() => {
    setGrid(createEmptyGrid());
    setPlacements([]);
    setCurrentShipIdx(0);
    setHoverCells([]);
  }, []);

  return (
    <>
      <CRTOverlay />
      <div className="app-container">
        <Header subtitle="FLEET DEPLOYMENT — POSITION YOUR VESSELS" />
        <div className="placement-layout">
          {/* Left column: Ship schematics */}
          <SchematicFleet
            ships={SHIPS}
            currentShipIdx={currentShipIdx}
            placements={placements}
            onSelect={(idx) => {
              if (idx < placements.length || idx > placements.length) return;
              setCurrentShipIdx(idx);
            }}
          />

          {/* Right column: Controls + Grid */}
          <div className="placement-main">
            <div style={{ margin: "12px 0", color: "var(--crt-green-dim)", fontSize: 13, letterSpacing: 1 }}>
              {currentShip ? (
                <>Deploying: <span style={{ color: "var(--crt-green)", fontWeight: "bold" }}>{currentShip.name} ({currentShip.size} cells)</span> — Click grid to place</>
              ) : allPlaced ? (
                <span style={{ color: "var(--crt-green)" }}>All vessels deployed. Ready for combat.</span>
              ) : null}
            </div>

            <div className="placement-controls">
              <button className="placement-action-btn" onClick={() => setHorizontal(h => !h)} disabled={allPlaced}>
                ↻ ROTATE (R)
              </button>
              <button className="placement-action-btn" onClick={handleRandomize}>Random</button>
              <button className="placement-action-btn" onClick={handleReset}>Reset</button>
            </div>

            <div className="grid-panel" style={{ display: "inline-block" }}>
              <div className="grid-panel-title">Your Fleet — Deployment Grid</div>
              <div className="battle-grid">
                <div className="grid-label grid-corner" />
                {Array.from({ length: GRID_SIZE }, (_, i) => <div key={`ch-${i}`} className="grid-label">{i + 1}</div>)}
                {Array.from({ length: GRID_SIZE }, (_, row) => (
                  <React.Fragment key={`row-${row}`}>
                    <div className="grid-label">{LETTERS[row]}</div>
                    {Array.from({ length: GRID_SIZE }, (_, col) => {
                      const hasShip = grid[row][col] !== null;
                      const isHover = hoverCells.some(([r, c]) => r === row && c === col);
                      let cls = "grid-cell";
                      if (hasShip) cls += " cell-ship";
                      return (
                        <div key={`cell-${row}-${col}`} className={cls}
                          style={isHover ? { background: "rgba(57,255,20,0.2)", borderColor: "rgba(57,255,20,0.4)" } : {}}
                          onClick={() => handleCellClick(row, col)}
                          onMouseEnter={() => handleCellHover(row, col)}
                          onMouseLeave={() => setHoverCells([])}
                        />
                      );
                    })}
                  </React.Fragment>
                ))}
                {/* Ship image overlays — in separate container to avoid disrupting grid auto-placement */}
                <div className="ship-overlay-container">
                  {placements.map(ship => (
                    <ShipOverlay key={ship.code}
                      shipCode={ship.code}
                      row={ship.cells[0][0]}
                      col={ship.cells[0][1]}
                      size={ship.size}
                      horizontal={ship.horizontal}
                      noLabels
                    />
                  ))}
                </div>
              </div>
            </div>

            {allPlaced && (
              <div style={{ marginTop: 20 }}>
                <button className="start-btn" onClick={() => onComplete(grid, placements)}>
                  COMMENCE OPERATION
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}


// ── GAME OVER SCREEN ────────────────────────────────────────
function GameOverScreen({ stats, user, onRestart }) {
  const { outcome } = stats;
  const isVictory = outcome === "decisive_victory" || outcome === "attrition_victory";

  const outcomeConfig = {
    decisive_victory: {
      badge: "✦ MISSION COMPLETE ✦",
      badgeStyle: { borderColor: "var(--crt-green)", color: "var(--crt-green)", background: "rgba(57,255,20,0.1)" },
      title: "ENEMY FLEET\nDESTROYED",
      subtitle: null,
      className: "victory",
    },
    attrition_victory: {
      badge: "✦ TACTICAL VICTORY ✦",
      badgeStyle: { borderColor: "var(--soviet-gold)", color: "var(--soviet-gold)", background: "rgba(255,204,0,0.1)" },
      title: "VICTORY BY\nATTRITION",
      subtitle: "All intel exhausted. Fleet command has assessed the engagement — enemy losses exceed our own. Tactical victory declared.",
      className: "victory",
    },
    withdrawal: {
      badge: "OPERATION CONCLUDED",
      badgeStyle: {},
      title: "FLEET\nWITHDRAWING",
      subtitle: "Ammunition depleted. Fleet withdrawing to regroup with main formation. Enemy remains operational.",
      className: "defeat",
    },
    defeat: {
      badge: "☭ MISSION FAILED",
      badgeStyle: {},
      title: "FLEET\nDESTROYED",
      subtitle: "Your fleet has been sunk. The enemy escapes.",
      className: "defeat",
    },
  };

  const cfg = outcomeConfig[outcome];

  return (
    <div className="overlay-screen">
      <CRTOverlay />
      <div className={`overlay-content ${cfg.className}`} style={{ zIndex: 101 }}>
        <div className="header-classification" style={cfg.badgeStyle}>{cfg.badge}</div>
        {user && (
          <div style={{ fontSize: 11, color: "var(--crt-green-dim)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>
            OPERATOR: {user.displayName || user.email}
          </div>
        )}
        <h2>{cfg.title.split("\n").map((line, i) => <span key={i}>{line}<br /></span>)}</h2>
        {cfg.subtitle && (
          <p style={{ color: isVictory ? "var(--crt-green-dim)" : "var(--soviet-red)", fontSize: 12, opacity: 0.7, marginBottom: 8, maxWidth: 400, marginInline: "auto", lineHeight: 1.6 }}>
            {cfg.subtitle}
          </p>
        )}

        {/* Damage comparison */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, margin: "16px 0", fontSize: 12 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--crt-green)", fontSize: 24, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>{stats.playerHitsDealt}</div>
            <div style={{ color: "var(--crt-green-dim)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>Hits Dealt</div>
          </div>
          <div style={{ textAlign: "center", alignSelf: "center", color: "var(--crt-green-dim)", fontSize: 11 }}>vs</div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--soviet-red)", fontSize: 24, fontFamily: "'Rajdhani', sans-serif", fontWeight: 700 }}>{stats.enemyHitsDealt}</div>
            <div style={{ color: "var(--crt-green-dim)", fontSize: 9, letterSpacing: 2, textTransform: "uppercase" }}>Hits Received</div>
          </div>
        </div>

        <div className="overlay-stats" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <div className="overlay-stat">
            <div className="overlay-stat-value">{stats.accuracy}%</div>
            <div className="overlay-stat-label">Intel Accuracy</div>
          </div>
          <div className="overlay-stat">
            <div className="overlay-stat-value">{stats.enemyShipsSunk}/{SHIPS.length}</div>
            <div className="overlay-stat-label">Enemy Sunk</div>
          </div>
          <div className="overlay-stat">
            <div className="overlay-stat-value">{stats.playerShipsSurvived}/{SHIPS.length}</div>
            <div className="overlay-stat-label">Your Fleet Survived</div>
          </div>
        </div>

        {/* Score breakdown */}
        <div style={{ background: "rgba(57,255,20,0.04)", border: "1px solid var(--panel-border)", padding: 16, margin: "12px 0", textAlign: "left" }}>
          <div style={{ fontSize: 10, color: "var(--crt-green-dim)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Score Breakdown</div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--crt-green-dim)", padding: "4px 0" }}>
            <span>Combat Points</span><span style={{ color: "var(--crt-green)" }}>{stats.combatScore}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--crt-green-dim)", padding: "4px 0" }}>
            <span>Fleet Survival Bonus</span><span style={{ color: "var(--crt-green)" }}>+{stats.survivalBonus}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--crt-green-dim)", padding: "4px 0" }}>
            <span>{outcome === "decisive_victory" ? "Decisive Victory Bonus" : outcome === "attrition_victory" ? "Attrition Victory Bonus" : "Victory Bonus"}</span>
            <span style={{ color: stats.victoryBonus > 0 ? "var(--soviet-gold)" : "var(--crt-green-dim)" }}>+{stats.victoryBonus}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, color: "var(--crt-green)", fontWeight: "bold", padding: "8px 0 0", borderTop: "1px solid var(--panel-border)", marginTop: 4 }}>
            <span>TOTAL SCORE</span><span>{stats.totalScore}</span>
          </div>
        </div>

        {/* Grade bracket */}
        {(() => {
          const t = stats.totalScore;
          const grade = t >= 2500 ? { pct: "100%", label: "REFINING", color: "var(--crt-green)" }
            : t >= 1800 ? { pct: "85%", label: "DEVELOPING", color: "var(--crt-green)" }
            : t >= 1200 ? { pct: "75%", label: "APPROACHING", color: "var(--soviet-gold)" }
            : t >= 600 ? { pct: "65%", label: "EMERGING", color: "var(--soviet-gold)" }
            : { pct: "55%", label: "MISSING", color: "var(--soviet-red)" };
          return (
            <div style={{ textAlign: "center", margin: "12px 0 4px", padding: "12px 16px", background: "rgba(57,255,20,0.04)", border: `1px solid ${grade.color}33` }}>
              <div style={{ fontSize: 9, color: "var(--crt-green-dim)", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>Mission Grade</div>
              <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 36, fontWeight: 700, color: grade.color, lineHeight: 1 }}>{grade.pct}</div>
              <div style={{ fontSize: 10, color: grade.color, letterSpacing: 3, textTransform: "uppercase", marginTop: 4 }}>{grade.label}</div>
            </div>
          );
        })()}

        <button className="start-btn" onClick={onRestart}>NEW OPERATION</button>
      </div>
    </div>
  );
}


// ═══════════════════════════════════════════════════════════════
// MAIN GAME COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function BattleshipQuiz({ questions = SAMPLE_QUESTIONS, onGameOver, user, authError, onSignIn, onSignOut }) {
  const [gameState, setGameState] = useState("intro"); // intro | placement | playing | enemyAttack | gameover
  const [enemyGrid, setEnemyGrid] = useState(null);
  const [enemyPlacements, setEnemyPlacements] = useState([]);
  const [playerGrid, setPlayerGrid] = useState(null);
  const [playerPlacements, setPlayerPlacements] = useState([]);

  const [shots, setShots] = useState([]); // player shots on enemy grid
  const [playerShots, setPlayerShots] = useState([]); // enemy shots on player grid

  const [phase, setPhase] = useState("targeting"); // targeting | answering
  const [targetCell, setTargetCell] = useState(null);
  const [hoverCell, setHoverCell] = useState(null);

  const [questionQueue, setQuestionQueue] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [wasCorrect, setWasCorrect] = useState(false);

  const [score, setScore] = useState(0);
  const [turnNumber, setTurnNumber] = useState(1);
  const [messages, setMessages] = useState([]);
  const [explosions, setExplosions] = useState([]);

  const [enemyAttackResult, setEnemyAttackResult] = useState(null);
  const enemyAIRef = useRef(null);

  // ── AUDIO: volume + music ──
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("battleship-volume");
    return saved !== null ? Number(saved) : 50;
  });
  const [muted, setMuted] = useState(() => localStorage.getItem("battleship-muted") === "true");
  const musicRef = useRef(null);

  // Sync master gain whenever volume/muted changes
  useEffect(() => {
    if (masterGain) {
      masterGain.gain.value = muted ? 0 : volume / 100;
    }
    localStorage.setItem("battleship-volume", String(volume));
    localStorage.setItem("battleship-muted", String(muted));
  }, [volume, muted]);

  // Start music when battle begins, stop on game over or unmount
  useEffect(() => {
    if (gameState === "playing" && !musicRef.current) {
      // Small delay so audio context is active (user gesture already happened)
      const id = setTimeout(() => { musicRef.current = startMusic(); }, 300);
      return () => clearTimeout(id);
    }
    if (gameState === "gameover" || gameState === "intro") {
      if (musicRef.current) { musicRef.current.stop(); musicRef.current = null; }
    }
  }, [gameState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => { if (musicRef.current) { musicRef.current.stop(); musicRef.current = null; } };
  }, []);

  const handleVolumeChange = useCallback((v) => { setVolume(v); if (v > 0) setMuted(false); }, []);
  const handleToggleMute = useCallback(() => setMuted(m => !m), []);

  const accuracy = questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0;
  const questionsLeft = questionQueue.length - currentQuestionIdx;

  const addMessage = useCallback((text, type = "system") => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    setMessages(prev => [...prev.slice(-50), { text, type, time }]);
  }, []);

  // ── START GAME (from intro) ────────
  const goToPlacement = useCallback(() => {
    setGameState("placement");
  }, []);

  // ── PLACEMENT COMPLETE ─────────────
  const handlePlacementComplete = useCallback((pGrid, pPlacements) => {
    const enemy = placeShipsRandomly();
    setEnemyGrid(enemy.grid);
    setEnemyPlacements(enemy.placements);
    setPlayerGrid(pGrid);
    setPlayerPlacements(pPlacements);
    setShots([]);
    setPlayerShots([]);
    setPhase("targeting");
    setTargetCell(null);
    setHoverCell(null);
    setQuestionQueue(shuffleQuestionOptions(shuffleArray(questions)));
    setCurrentQuestionIdx(0);
    setQuestionsAnswered(0);
    setCorrectAnswers(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setWasCorrect(false);
    setScore(0);
    setTurnNumber(1);
    setMessages([]);
    setExplosions([]);
    setEnemyAttackResult(null);
    enemyAIRef.current = createEnemyAI();
    setGameState("playing");
    setTimeout(() => {
      addMessage("OPERATION RED TIDE initiated. Locate and destroy all enemy vessels.", "system");
      addMessage("⚠ Enemy fleet will return fire every turn. Protect your ships.", "system");
      addMessage("Select a target on the grid to begin.", "system");
    }, 100);
  }, [questions, addMessage]);

  // ── CELL CLICK (targeting) ─────────
  const handleCellClick = useCallback((row, col) => {
    if (phase !== "targeting") return;
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

  // ── ANSWER QUESTION ────────────────
  const handleAnswer = useCallback((answer) => {
    const q = questionQueue[currentQuestionIdx];
    let correct = false;
    if (q.type === "multiple_choice") correct = answer === q.correctIndex;
    else correct = answer === q.correctAnswer;
    setSelectedAnswer(answer);
    setWasCorrect(correct);
    setAnswered(true);
    setQuestionsAnswered(prev => prev + 1);
    if (correct) setCorrectAnswers(prev => prev + 1);
  }, [questionQueue, currentQuestionIdx]);

  // ── ENEMY FIRES ────────────────────
  const doEnemyFire = useCallback(() => {
    if (!playerGrid || !enemyAIRef.current) return;
    const result = enemyAIFire(enemyAIRef.current, playerGrid, playerPlacements);
    if (!result) return;

    setPlayerShots(prev => [...prev, { row: result.row, col: result.col, hit: result.hit }]);

    if (result.updatedPlacements) {
      setPlayerPlacements(result.updatedPlacements);
    }

    if (result.hit) {
      playAlarm();
      if (result.sunkShip) {
        addMessage(`☭ ENEMY SUNK YOUR ${result.sunkShip.name.toUpperCase()} at ${LETTERS[result.row]}${result.col + 1}!`, "sunk");
      } else {
        addMessage(`⚠ INCOMING! Enemy hit at ${LETTERS[result.row]}${result.col + 1}!`, "enemy");
      }
    } else {
      addMessage(`Enemy fired at ${LETTERS[result.row]}${result.col + 1}. Missed.`, "miss");
    }

    setEnemyAttackResult(result);
    setTimeout(() => setEnemyAttackResult(null), 1500);

    // Check if all player ships sunk
    const plc = result.updatedPlacements || playerPlacements;
    const allPlayerSunk = plc.every(s => s.hits >= s.size);
    if (allPlayerSunk) {
      setTimeout(() => setGameState("gameover"), 1800);
    }
  }, [playerGrid, playerPlacements, addMessage]);

  // ── CONTINUE AFTER ANSWER ──────────
  const handleContinue = useCallback(() => {
    if (!targetCell || !enemyGrid) return;
    const { row, col } = targetCell;

    if (wasCorrect) {
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
          setShots(prev => prev.map(s => {
            if (sunkShip.cells.some(c => c[0] === s.row && c[1] === s.col)) return { ...s, sunk: true };
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
      const allEnemySunk = newPlacements.every(s => s.hits >= s.size);
      if (allEnemySunk) {
        playVictory();
        // Still do enemy fire before ending
        setTimeout(() => {
          doEnemyFire();
          setTimeout(() => setGameState("gameover"), 1500);
        }, 800);
        setCurrentQuestionIdx(prev => prev + 1);
        setPhase("targeting");
        setTargetCell(null);
        setAnswered(false);
        setSelectedAnswer(null);
        setWasCorrect(false);
        setTurnNumber(prev => prev + 1);
        return;
      }
    } else {
      addMessage(`Intel verification FAILED. Attack cancelled.`, "miss");
    }

    // Enemy fires every turn
    setTimeout(() => doEnemyFire(), 600);

    // Advance turn
    setCurrentQuestionIdx(prev => prev + 1);
    setPhase("targeting");
    setTargetCell(null);
    setAnswered(false);
    setSelectedAnswer(null);
    setWasCorrect(false);
    setTurnNumber(prev => prev + 1);

    // Check if out of questions
    if (currentQuestionIdx + 1 >= questionQueue.length) {
      // Determine if attrition victory or withdrawal
      const pHits = enemyPlacements.reduce((sum, s) => sum + s.hits, 0);
      const eHits = playerPlacements.reduce((sum, s) => sum + s.hits, 0);
      if (pHits > eHits) {
        addMessage("All intel exhausted. Damage assessment favors our forces — tactical victory.", "system");
      } else {
        addMessage("Ammunition depleted. Fleet withdrawing to regroup with main formation.", "system");
      }
      setTimeout(() => setGameState("gameover"), 2500);
    }
  }, [wasCorrect, targetCell, enemyGrid, enemyPlacements, currentQuestionIdx, questionQueue, addMessage, doEnemyFire]);

  // ── COMPUTE FINAL STATS ────────────
  const computeStats = useCallback(() => {
    const enemyShipsSunk = enemyPlacements.filter(s => s.hits >= s.size).length;
    const playerShipsSurvived = playerPlacements.filter(s => s.hits < s.size).length;
    const playerAllSunk = playerPlacements.every(s => s.hits >= s.size);
    const allEnemySunk = enemyPlacements.every(s => s.hits >= s.size);
    const survivalBonus = playerPlacements.filter(s => s.hits < s.size).reduce((sum, s) => sum + s.bonus, 0);

    // Count total hits dealt vs received
    const playerHitsDealt = enemyPlacements.reduce((sum, s) => sum + s.hits, 0);
    const enemyHitsDealt = playerPlacements.reduce((sum, s) => sum + s.hits, 0);

    // Determine outcome
    let outcome; // "decisive_victory" | "attrition_victory" | "withdrawal" | "defeat"
    let victoryBonus = 0;
    if (allEnemySunk) {
      outcome = "decisive_victory";
      victoryBonus = 500;
    } else if (playerAllSunk) {
      outcome = "defeat";
      victoryBonus = 0;
    } else if (playerHitsDealt > enemyHitsDealt) {
      outcome = "attrition_victory";
      victoryBonus = 250;
    } else {
      outcome = "withdrawal";
      victoryBonus = 0;
    }

    return {
      combatScore: score,
      survivalBonus,
      victoryBonus,
      totalScore: score + survivalBonus + victoryBonus,
      accuracy,
      enemyShipsSunk,
      playerShipsSurvived,
      playerAllSunk,
      playerHitsDealt,
      enemyHitsDealt,
      outcome,
      turns: turnNumber,
    };
  }, [score, accuracy, enemyPlacements, playerPlacements, turnNumber]);

  // ── REPORT SCORE ON GAME OVER ──────
  useEffect(() => {
    if (gameState === "gameover" && onGameOver) {
      onGameOver(computeStats());
    }
  }, [gameState]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── RENDER ─────────────────────────
  if (gameState === "intro") {
    return (<IntroScreen onStart={goToPlacement} user={user} authError={authError} onSignIn={onSignIn} onSignOut={onSignOut} />);
  }

  if (gameState === "placement") {
    return (<PlacementPhase onComplete={handlePlacementComplete} />);
  }

  if (gameState === "gameover") {
    const stats = computeStats();
    return (
      <GameOverScreen stats={stats} user={user} onRestart={() => setGameState("intro")} />
    );
  }

  const currentQuestion = questionQueue[currentQuestionIdx];
  const displayTarget = phase === "targeting" ? (hoverCell || targetCell) : targetCell;

  return (
    <>
      <CRTOverlay />
      {enemyAttackResult && enemyAttackResult.hit && (
        <div className="enemy-attack-overlay">
          <div className="enemy-attack-msg">
            <h3 style={{ color: enemyAttackResult.sunkShip ? "var(--soviet-red)" : "var(--soviet-gold)" }}>
              {enemyAttackResult.sunkShip ? `☭ ${enemyAttackResult.sunkShip.name} SUNK!` : "⚠ INCOMING HIT!"}
            </h3>
            <p>{LETTERS[enemyAttackResult.row]}{enemyAttackResult.col + 1} — {enemyAttackResult.sunkShip ? "Your vessel has been destroyed" : "Your fleet is under fire"}</p>
          </div>
        </div>
      )}
      <div className="app-container">
        <Header />
        <StatusBar phase={phase} turnNumber={turnNumber} score={score} accuracy={accuracy} questionsLeft={questionsLeft} totalQuestions={questionQueue.length} volume={volume} onVolumeChange={handleVolumeChange} muted={muted} onToggleMute={handleToggleMute} />

        {phase === "answering" && currentQuestion && (
          <div style={{ marginBottom: 12 }}>
            <QuestionPanel question={currentQuestion} questionIndex={currentQuestionIdx}
              totalQuestions={questionQueue.length} onAnswer={handleAnswer}
              answered={answered} selectedAnswer={selectedAnswer} wasCorrect={wasCorrect} />
            {answered && (
              <>
                <div className={`result-banner ${wasCorrect ? "hit-banner" : "miss-banner"}`}>
                  {wasCorrect ? "✦ INTEL VERIFIED — STRIKE AUTHORIZED ✦" : "✕ INTEL FAILED — ATTACK CANCELLED ✕"}
                </div>
                <button className="continue-btn" onClick={handleContinue}>
                  {wasCorrect ? "FIRE!" : "CONTINUE"}
                </button>
              </>
            )}
          </div>
        )}

        <div className="main-layout">
          <div>
            <div className="grid-panel">
              <div className="grid-panel-title">Enemy Waters — Tactical Display</div>
              <BattleGrid gridData={enemyGrid} shots={shots} targetCell={displayTarget}
                onCellClick={handleCellClick} onCellHover={handleCellHover}
                disabled={phase !== "targeting"} explosions={explosions} showShips={false} />
              <TargetReadout targetCell={displayTarget} />
            </div>
          </div>

          <div className="sidebar">
            <GridLegend />
            <FleetStatus placements={enemyPlacements} label="Enemy Fleet Status" />

            {/* Player fleet with live damage */}
            <div className="intel-panel">
              <div className="intel-title">Your Fleet</div>
              {/* Mini grid showing player ships and hits */}
              <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gridTemplateRows: "repeat(8, 1fr)", aspectRatio: "1", gap: 1, background: "rgba(57,255,20,0.04)", border: "1px solid var(--panel-border)", marginBottom: 8, overflow: "hidden" }}>
                {Array.from({ length: GRID_SIZE }, (_, row) =>
                  Array.from({ length: GRID_SIZE }, (_, col) => {
                    const hasShip = playerGrid && playerGrid[row][col] !== null;
                    const shot = playerShots.find(s => s.row === row && s.col === col);
                    const isSunkShip = hasShip && playerPlacements.find(s => s.code === playerGrid[row][col])?.hits >= playerPlacements.find(s => s.code === playerGrid[row][col])?.size;
                    let bg = "var(--ocean-grid)";
                    let content = null;
                    if (shot && shot.hit) {
                      bg = isSunkShip ? "rgba(255,42,42,0.2)" : "rgba(255,42,42,0.4)";
                      content = <span style={{ fontSize: 7, color: "var(--hit-red)" }}>✕</span>;
                    } else if (shot) {
                      bg = "rgba(26,74,110,0.3)";
                    }
                    return (
                      <div key={`${row}-${col}`} style={{ aspectRatio: "1", background: bg, border: "1px solid rgba(57,255,20,0.02)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 5, opacity: isSunkShip && !shot ? 0.3 : 1 }}>
                        {content}
                      </div>
                    );
                  })
                )}
                {/* Ship image overlays — in separate container */}
                <div className="ship-overlay-container mini-overlay">
                  {playerPlacements.map(ship => {
                    const isSunk = ship.hits >= ship.size;
                    return (
                      <ShipOverlay key={`mini-${ship.code}`}
                        shipCode={ship.code}
                        row={ship.cells[0][0]}
                        col={ship.cells[0][1]}
                        size={ship.size}
                        horizontal={ship.horizontal}
                        isSunk={isSunk}
                        isHit={ship.hits > 0 && !isSunk}
                        mini
                        noLabels
                      />
                    );
                  })}
                </div>
              </div>
              {/* Ship list with survival bonus values */}
              {playerPlacements.map(ship => {
                const isSunk = ship.hits >= ship.size;
                return (
                  <div key={ship.code} className="ship-row">
                    <ShipSilhouette shipCode={ship.code} isSunk={isSunk} />
                    <div className={`ship-name ${isSunk ? "sunk" : ""}`}>{ship.name}</div>
                    <div className="ship-cells">
                      {Array.from({ length: ship.size }, (_, i) => (
                        <div key={i} className={`ship-cell-indicator ${isSunk ? "sunk-cell" : i < ship.hits ? "damaged" : ""}`} />
                      ))}
                    </div>
                    <span style={{ fontSize: 9, color: isSunk ? "rgba(255,42,42,0.4)" : "var(--crt-green-dim)", letterSpacing: 1, minWidth: 40, textAlign: "right" }}>
                      {isSunk ? "LOST" : `+${ship.bonus}`}
                    </span>
                  </div>
                );
              })}
            </div>

            <MessageLog messages={messages} />

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
