/**
 * Energy Escape Room — Puzzle Data
 *
 * 5 rooms, 3 puzzles each (students see 1 per playthrough = 3x content pool).
 * Each puzzle has: narrative, question, options, correctIndex, explanation, hint, codeDigit.
 *
 * Rooms:
 *   1. Kinetic Energy (KE = ½mv²)
 *   2. Gravitational PE (GPE = mgh)
 *   3. Conservation of Energy (GPE ↔ KE)
 *   4. Work (W = Fd)
 *   5. Power (P = W/t)
 */

export const ROOMS = [
  {
    id: "ke",
    name: "The Velocity Vault",
    icon: "💨",
    color: "#f59e0b",
    narrative:
      "You're trapped in a vault with a reinforced door. A display reads: 'To unlock, calculate the kinetic energy of the security drone.' A small drone zips back and forth across the room.",
    puzzles: [
      {
        id: "ke-1",
        setup:
          "The drone has a mass of 4 kg and is flying at 6 m/s. The lock requires the drone's kinetic energy in joules.",
        question: "What is the kinetic energy of the drone?",
        options: ["24 J", "72 J", "144 J", "48 J"],
        correctIndex: 1,
        explanation:
          "KE = ½mv² = ½ × 4 × 6² = ½ × 4 × 36 = 72 J",
        hint: "KE = ½mv². Don't forget to square the velocity first, then multiply by mass, then halve it.",
        codeDigit: "7",
      },
      {
        id: "ke-2",
        setup:
          "The drone has a mass of 2 kg and is flying at 10 m/s. A keypad on the door glows, waiting for input.",
        question: "What is the kinetic energy of the drone?",
        options: ["20 J", "50 J", "100 J", "200 J"],
        correctIndex: 2,
        explanation:
          "KE = ½mv² = ½ × 2 × 10² = ½ × 2 × 100 = 100 J",
        hint: "KE = ½mv². Square the velocity (10² = 100), multiply by mass, then divide by 2.",
        codeDigit: "3",
      },
      {
        id: "ke-3",
        setup:
          "The drone has a mass of 5 kg and is flying at 8 m/s. Solve to deactivate the vault lock.",
        question: "What is the kinetic energy of the drone?",
        options: ["40 J", "80 J", "160 J", "320 J"],
        correctIndex: 2,
        explanation:
          "KE = ½mv² = ½ × 5 × 8² = ½ × 5 × 64 = 160 J",
        hint: "KE = ½mv². 8² = 64. Then 5 × 64 = 320. Then halve it.",
        codeDigit: "9",
      },
    ],
  },
  {
    id: "gpe",
    name: "The Gravity Shaft",
    icon: "🏔️",
    color: "#10b981",
    narrative:
      "The vault door opens into a vertical shaft. An elevator platform sits at the top. A terminal reads: 'Calculate the gravitational potential energy to set the correct descent speed.'",
    puzzles: [
      {
        id: "gpe-1",
        setup:
          "The elevator platform has a mass of 200 kg and sits 15 m above the bottom of the shaft. (g = 9.8 m/s²)",
        question: "What is the platform's gravitational potential energy?",
        options: ["3,000 J", "29,400 J", "14,700 J", "2,940 J"],
        correctIndex: 1,
        explanation:
          "GPE = mgh = 200 × 9.8 × 15 = 29,400 J",
        hint: "GPE = mgh. Multiply all three: mass × gravity × height.",
        codeDigit: "2",
      },
      {
        id: "gpe-2",
        setup:
          "The platform has a mass of 150 kg and is 20 m above the shaft floor. (g = 9.8 m/s²)",
        question: "What is the platform's gravitational potential energy?",
        options: ["29,400 J", "15,000 J", "3,000 J", "1,470 J"],
        correctIndex: 0,
        explanation:
          "GPE = mgh = 150 × 9.8 × 20 = 29,400 J",
        hint: "GPE = mgh. 150 × 9.8 = 1,470. Then × 20.",
        codeDigit: "5",
      },
      {
        id: "gpe-3",
        setup:
          "The platform has a mass of 80 kg and is 25 m above the shaft floor. (g = 9.8 m/s²)",
        question: "What is the platform's gravitational potential energy?",
        options: ["2,000 J", "9,800 J", "19,600 J", "39,200 J"],
        correctIndex: 2,
        explanation:
          "GPE = mgh = 80 × 9.8 × 25 = 19,600 J",
        hint: "GPE = mgh. 80 × 25 = 2,000. Then × 9.8.",
        codeDigit: "8",
      },
    ],
  },
  {
    id: "conservation",
    name: "The Freefall Chamber",
    icon: "🔄",
    color: "#6366f1",
    narrative:
      "You reach a chamber where a heavy ball sits on a ledge above a pressure plate. A sign reads: 'If all GPE converts to KE, what speed will the ball hit the plate? Enter correctly or the floor resets.'",
    puzzles: [
      {
        id: "con-1",
        setup:
          "A 10 kg ball sits 20 m above the pressure plate. If it falls with no friction, all GPE converts to KE. (g = 9.8 m/s²)",
        question:
          "What speed does the ball reach just before hitting the plate? (Use v = √(2gh))",
        options: [
          "About 14 m/s",
          "About 20 m/s",
          "About 28 m/s",
          "About 10 m/s",
        ],
        correctIndex: 1,
        explanation:
          "v = √(2gh) = √(2 × 9.8 × 20) = √(392) ≈ 19.8 m/s ≈ 20 m/s. Mass cancels out!",
        hint: "Set GPE = KE: mgh = ½mv². Mass cancels. Solve for v: v = √(2gh). Plug in g = 9.8 and h = 20.",
        codeDigit: "4",
      },
      {
        id: "con-2",
        setup:
          "A 5 kg ball sits 45 m above the pressure plate. No friction. (g = 9.8 m/s²)",
        question:
          "What speed does the ball reach just before impact? (Use v = √(2gh))",
        options: [
          "About 21 m/s",
          "About 30 m/s",
          "About 45 m/s",
          "About 15 m/s",
        ],
        correctIndex: 1,
        explanation:
          "v = √(2gh) = √(2 × 9.8 × 45) = √(882) ≈ 29.7 m/s ≈ 30 m/s",
        hint: "v = √(2gh). Plug in: 2 × 9.8 × 45 = 882. √882 ≈ 29.7.",
        codeDigit: "1",
      },
      {
        id: "con-3",
        setup:
          "A 15 kg ball sits 5 m above the plate. No friction. (g = 9.8 m/s²)",
        question:
          "What speed does the ball reach just before impact? (Use v = √(2gh))",
        options: [
          "About 7 m/s",
          "About 10 m/s",
          "About 14 m/s",
          "About 5 m/s",
        ],
        correctIndex: 1,
        explanation:
          "v = √(2gh) = √(2 × 9.8 × 5) = √(98) ≈ 9.9 m/s ≈ 10 m/s",
        hint: "v = √(2gh). 2 × 9.8 × 5 = 98. √98 ≈ 9.9.",
        codeDigit: "6",
      },
    ],
  },
  {
    id: "work",
    name: "The Force Corridor",
    icon: "⚙️",
    color: "#ef4444",
    narrative:
      "A long corridor stretches ahead. A heavy crate blocks the exit. A screen on the wall reads: 'Calculate the work required to push the crate to the end. Only the correct answer opens the exit hatch.'",
    puzzles: [
      {
        id: "work-1",
        setup:
          "You push the 50 kg crate with a constant force of 200 N across 8 meters of smooth floor.",
        question: "How much work do you do on the crate?",
        options: ["400 J", "1,600 J", "2,500 J", "800 J"],
        correctIndex: 1,
        explanation: "W = Fd = 200 N × 8 m = 1,600 J",
        hint: "W = Force × distance. Both are given directly — just multiply.",
        codeDigit: "0",
      },
      {
        id: "work-2",
        setup:
          "You push the crate with 350 N of force across 12 meters to reach the exit.",
        question: "How much work do you do on the crate?",
        options: ["3,500 J", "4,200 J", "1,750 J", "700 J"],
        correctIndex: 1,
        explanation: "W = Fd = 350 N × 12 m = 4,200 J",
        hint: "W = Fd. Multiply force (in newtons) by distance (in meters).",
        codeDigit: "3",
      },
      {
        id: "work-3",
        setup:
          "You push with 500 N of force, but the crate only moves 6 meters before reaching the exit.",
        question: "How much work do you do on the crate?",
        options: ["500 J", "3,000 J", "6,000 J", "1,500 J"],
        correctIndex: 1,
        explanation: "W = Fd = 500 N × 6 m = 3,000 J",
        hint: "W = Fd. Force × distance. Don't overthink it.",
        codeDigit: "7",
      },
    ],
  },
  {
    id: "power",
    name: "The Generator Room",
    icon: "⚡",
    color: "#8b5cf6",
    narrative:
      "The final room. A backup generator needs to be activated to open the main exit. The control panel demands: 'Calculate the power output to calibrate the generator.'",
    puzzles: [
      {
        id: "pow-1",
        setup:
          "The generator does 6,000 J of work in 12 seconds to power the exit mechanism.",
        question: "What is the generator's power output?",
        options: ["72,000 W", "500 W", "250 W", "6,000 W"],
        correctIndex: 1,
        explanation: "P = W/t = 6,000 J / 12 s = 500 W",
        hint: "P = W / t. Divide the work (in joules) by the time (in seconds).",
        codeDigit: "5",
      },
      {
        id: "pow-2",
        setup:
          "The generator must do 10,000 J of work in 25 seconds to open the blast door.",
        question: "What power output is needed?",
        options: ["250 W", "400 W", "2,500 W", "100 W"],
        correctIndex: 1,
        explanation: "P = W/t = 10,000 J / 25 s = 400 W",
        hint: "P = W / t. 10,000 divided by 25.",
        codeDigit: "8",
      },
      {
        id: "pow-3",
        setup:
          "The generator produces 750 W. You need 15,000 J of work to fully power the exit.",
        question: "How many seconds will it take?",
        options: ["10 s", "15 s", "20 s", "25 s"],
        correctIndex: 2,
        explanation:
          "P = W/t → t = W/P = 15,000 J / 750 W = 20 s",
        hint: "Rearrange P = W/t to solve for time: t = W / P.",
        codeDigit: "2",
      },
    ],
  },
];

/**
 * Select one puzzle per room, avoiding previously used IDs.
 */
export function buildPuzzleSet(usedIds = []) {
  return ROOMS.map((room) => {
    const available = room.puzzles.filter((p) => !usedIds.includes(p.id));
    const pool = available.length > 0 ? available : room.puzzles;
    const puzzle = pool[Math.floor(Math.random() * pool.length)];
    return { room, puzzle };
  });
}
