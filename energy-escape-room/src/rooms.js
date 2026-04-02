/**
 * Energy Escape Room — Puzzle Data
 *
 * 5 rooms, 12 puzzles each (students see 1 per room per playthrough = 12^5 = 248,832 unique combos).
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
        options: ["100 J", "50 J", "20 J", "200 J"],
        correctIndex: 0,
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
        options: ["40 J", "80 J", "320 J", "160 J"],
        correctIndex: 3,
        explanation:
          "KE = ½mv² = ½ × 5 × 8² = ½ × 5 × 64 = 160 J",
        hint: "KE = ½mv². 8² = 64. Then 5 × 64 = 320. Then halve it.",
        codeDigit: "9",
      },
      {
        id: "ke-4",
        setup:
          "A 3 kg ball rolls across the vault floor at 4 m/s. The door panel demands its kinetic energy.",
        question: "What is the kinetic energy of the ball?",
        options: ["12 J", "24 J", "48 J", "6 J"],
        correctIndex: 1,
        explanation:
          "KE = ½mv² = ½ × 3 × 4² = ½ × 3 × 16 = 24 J",
        hint: "KE = ½mv². Square 4 first (= 16), multiply by 3 (= 48), then halve it.",
        codeDigit: "4",
      },
      {
        id: "ke-5",
        setup:
          "A 0.5 kg arrow flies across the vault at 20 m/s. The lock scans for its kinetic energy.",
        question: "What is the kinetic energy of the arrow?",
        options: ["100 J", "200 J", "50 J", "10 J"],
        correctIndex: 0,
        explanation:
          "KE = ½mv² = ½ × 0.5 × 20² = ½ × 0.5 × 400 = 100 J",
        hint: "KE = ½mv². 20² = 400. Then 0.5 × 400 = 200. Then halve it.",
        codeDigit: "6",
      },
      {
        id: "ke-6",
        setup:
          "A security robot (mass 10 kg) charges at you at 3 m/s. The override panel needs its kinetic energy.",
        question: "What is the kinetic energy of the robot?",
        options: ["30 J", "90 J", "15 J", "45 J"],
        correctIndex: 3,
        explanation:
          "KE = ½mv² = ½ × 10 × 3² = ½ × 10 × 9 = 45 J",
        hint: "KE = ½mv². 3² = 9. Then 10 × 9 = 90. Then halve it.",
        codeDigit: "1",
      },
      {
        id: "ke-7",
        setup:
          "A 2 kg object in the vault has 64 J of kinetic energy. The door asks for the object's speed.",
        question: "What is the speed of the object?",
        options: ["4 m/s", "6 m/s", "8 m/s", "32 m/s"],
        correctIndex: 2,
        explanation:
          "KE = ½mv² → v² = 2×KE/m = 2×64/2 = 64 → v = √64 = 8 m/s",
        hint: "Rearrange KE = ½mv² to v = √(2×KE/m). Plug in KE = 64 and m = 2.",
        codeDigit: "0",
      },
      {
        id: "ke-8",
        setup:
          "A 50 kg cart rolls through the vault at 2 m/s. The exit panel needs its kinetic energy to unlock.",
        question: "What is the kinetic energy of the cart?",
        options: ["50 J", "200 J", "100 J", "25 J"],
        correctIndex: 2,
        explanation:
          "KE = ½mv² = ½ × 50 × 2² = ½ × 50 × 4 = 100 J",
        hint: "KE = ½mv². 2² = 4. Then 50 × 4 = 200. Then halve it.",
        codeDigit: "5",
      },
      {
        id: "ke-9",
        setup:
          "A 8 kg object has 100 J of kinetic energy. The vault console demands the object's speed.",
        question: "What is the speed of the object?",
        options: ["12.5 m/s", "25 m/s", "5 m/s", "3.5 m/s"],
        correctIndex: 2,
        explanation:
          "KE = ½mv² → v² = 2×KE/m = 2×100/8 = 25 → v = √25 = 5 m/s",
        hint: "Rearrange to v = √(2×KE/m). 2×100 = 200. 200/8 = 25. √25 = 5.",
        codeDigit: "2",
      },
      {
        id: "ke-10",
        setup:
          "A 1 kg projectile launches at 12 m/s across the vault. The display flashes, demanding its KE.",
        question: "What is the kinetic energy of the projectile?",
        options: ["144 J", "72 J", "12 J", "6 J"],
        correctIndex: 1,
        explanation:
          "KE = ½mv² = ½ × 1 × 12² = ½ × 144 = 72 J",
        hint: "KE = ½mv². With m = 1, it simplifies to ½ × v². 12² = 144, halved = 72.",
        codeDigit: "8",
      },
      {
        id: "ke-11",
        setup:
          "A drone with 200 J of kinetic energy has a mass of 4 kg. The lock needs its speed to open.",
        question: "What is the speed of the drone?",
        options: ["5 m/s", "10 m/s", "50 m/s", "25 m/s"],
        correctIndex: 1,
        explanation:
          "KE = ½mv² → v² = 2×KE/m = 2×200/4 = 100 → v = √100 = 10 m/s",
        hint: "Rearrange to v = √(2×KE/m). 2×200 = 400. 400/4 = 100. √100 = 10.",
        codeDigit: "3",
      },
      {
        id: "ke-12",
        setup:
          "A 100 kg security bot trundles at 4 m/s. The vault demands its kinetic energy to calibrate the door.",
        question: "What is the kinetic energy of the security bot?",
        options: ["400 J", "200 J", "1,600 J", "800 J"],
        correctIndex: 3,
        explanation:
          "KE = ½mv² = ½ × 100 × 4² = ½ × 100 × 16 = 800 J",
        hint: "KE = ½mv². 4² = 16. Then 100 × 16 = 1,600. Halve it = 800.",
        codeDigit: "6",
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
      {
        id: "gpe-4",
        setup:
          "A 50 kg supply crate hangs 10 m above the shaft floor. (g = 10 m/s²)",
        question: "What is the crate's gravitational potential energy?",
        options: ["500 J", "50,000 J", "2,500 J", "5,000 J"],
        correctIndex: 3,
        explanation:
          "GPE = mgh = 50 × 10 × 10 = 5,000 J",
        hint: "GPE = mgh. With g = 10, this is just 50 × 10 × 10.",
        codeDigit: "3",
      },
      {
        id: "gpe-5",
        setup:
          "A 4 kg sensor probe is mounted 10 m up inside the shaft. (g = 9.8 m/s²). The terminal needs its GPE.",
        question: "What is the probe's gravitational potential energy?",
        options: ["392 J", "196 J", "40 J", "3,920 J"],
        correctIndex: 0,
        explanation:
          "GPE = mgh = 4 × 9.8 × 10 = 392 J",
        hint: "GPE = mgh. 4 × 9.8 = 39.2. Then 39.2 × 10 = 392.",
        codeDigit: "7",
      },
      {
        id: "gpe-6",
        setup:
          "An object has 392 J of GPE and a mass of 4 kg. (g = 9.8 m/s²). The terminal asks how high it is.",
        question: "How high above the shaft floor is the object?",
        options: ["5 m", "10 m", "20 m", "15 m"],
        correctIndex: 1,
        explanation:
          "GPE = mgh → h = GPE/(mg) = 392/(4 × 9.8) = 392/39.2 = 10 m",
        hint: "Rearrange GPE = mgh to h = GPE/(mg). Divide 392 by (4 × 9.8).",
        codeDigit: "4",
      },
      {
        id: "gpe-7",
        setup:
          "A 20 kg counterweight sits 30 m above the shaft floor. (g = 10 m/s²)",
        question: "What is the counterweight's gravitational potential energy?",
        options: ["600 J", "3,000 J", "6,000 J", "60,000 J"],
        correctIndex: 2,
        explanation:
          "GPE = mgh = 20 × 10 × 30 = 6,000 J",
        hint: "GPE = mgh. 20 × 10 = 200. Then 200 × 30 = 6,000.",
        codeDigit: "1",
      },
      {
        id: "gpe-8",
        setup:
          "A 60 kg engineer stands on a platform 5 m up. (g = 9.8 m/s²). The panel needs the GPE.",
        question: "What is the engineer's gravitational potential energy?",
        options: ["2,940 J", "300 J", "1,470 J", "5,880 J"],
        correctIndex: 0,
        explanation:
          "GPE = mgh = 60 × 9.8 × 5 = 2,940 J",
        hint: "GPE = mgh. 60 × 9.8 = 588. Then 588 × 5 = 2,940.",
        codeDigit: "9",
      },
      {
        id: "gpe-9",
        setup:
          "An object with 1,960 J of GPE has a mass of 10 kg. (g = 9.8 m/s²). The terminal demands the height.",
        question: "How high is the object?",
        options: ["10 m", "196 m", "20 m", "2 m"],
        correctIndex: 2,
        explanation:
          "GPE = mgh → h = GPE/(mg) = 1,960/(10 × 9.8) = 1,960/98 = 20 m",
        hint: "Rearrange to h = GPE/(mg). 10 × 9.8 = 98. Then 1,960 / 98.",
        codeDigit: "0",
      },
      {
        id: "gpe-10",
        setup:
          "A 5 kg toolbox sits on a ledge 40 m above the shaft floor. (g = 10 m/s²)",
        question: "What is the toolbox's gravitational potential energy?",
        options: ["200 J", "500 J", "2,000 J", "4,000 J"],
        correctIndex: 2,
        explanation:
          "GPE = mgh = 5 × 10 × 40 = 2,000 J",
        hint: "GPE = mgh. 5 × 10 = 50. Then 50 × 40 = 2,000.",
        codeDigit: "6",
      },
      {
        id: "gpe-11",
        setup:
          "A crate has 4,900 J of GPE and sits 5 m up. (g = 9.8 m/s²). The terminal wants to know its mass.",
        question: "What is the mass of the crate?",
        options: ["50 kg", "100 kg", "200 kg", "25 kg"],
        correctIndex: 1,
        explanation:
          "GPE = mgh → m = GPE/(gh) = 4,900/(9.8 × 5) = 4,900/49 = 100 kg",
        hint: "Rearrange to m = GPE/(g×h). Compute 9.8 × 5 first, then divide.",
        codeDigit: "2",
      },
      {
        id: "gpe-12",
        setup:
          "A 25 kg emergency pack is 8 m above the shaft floor. (g = 9.8 m/s²)",
        question: "What is the pack's gravitational potential energy?",
        options: ["980 J", "4,900 J", "245 J", "1,960 J"],
        correctIndex: 3,
        explanation:
          "GPE = mgh = 25 × 9.8 × 8 = 1,960 J",
        hint: "GPE = mgh. 25 × 9.8 = 245. Then 245 × 8 = 1,960.",
        codeDigit: "5",
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
          "About 45 m/s",
          "About 15 m/s",
          "About 30 m/s",
        ],
        correctIndex: 3,
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
          "About 10 m/s",
          "About 14 m/s",
          "About 7 m/s",
          "About 5 m/s",
        ],
        correctIndex: 0,
        explanation:
          "v = √(2gh) = √(2 × 9.8 × 5) = √(98) ≈ 9.9 m/s ≈ 10 m/s",
        hint: "v = √(2gh). 2 × 9.8 × 5 = 98. √98 ≈ 9.9.",
        codeDigit: "6",
      },
      {
        id: "con-4",
        setup:
          "A ball is dropped from 80 m with no friction. (g = 10 m/s²)",
        question:
          "What speed does the ball reach just before impact? (Use v = √(2gh))",
        options: [
          "About 20 m/s",
          "About 80 m/s",
          "About 40 m/s",
          "About 60 m/s",
        ],
        correctIndex: 2,
        explanation:
          "v = √(2gh) = √(2 × 10 × 80) = √(1,600) = 40 m/s. Mass cancels — it doesn't matter!",
        hint: "v = √(2gh). 2 × 10 × 80 = 1,600. √1,600 = 40.",
        codeDigit: "8",
      },
      {
        id: "con-5",
        setup:
          "A 7 kg weight falls from 31.25 m. No friction. (g = 10 m/s²)",
        question:
          "What speed does it reach just before impact? (Use v = √(2gh))",
        options: [
          "About 20 m/s",
          "About 30 m/s",
          "About 25 m/s",
          "About 15 m/s",
        ],
        correctIndex: 2,
        explanation:
          "v = √(2gh) = √(2 × 10 × 31.25) = √(625) = 25 m/s",
        hint: "v = √(2gh). 2 × 10 × 31.25 = 625. √625 = 25.",
        codeDigit: "3",
      },
      {
        id: "con-6",
        setup:
          "An object hits the pressure plate at 14 m/s after falling from rest. No friction. (g = 9.8 m/s²)",
        question:
          "From what height was it dropped? (Use h = v²/(2g))",
        options: [
          "About 5 m",
          "About 20 m",
          "About 7 m",
          "About 10 m",
        ],
        correctIndex: 3,
        explanation:
          "h = v²/(2g) = 14²/(2 × 9.8) = 196/19.6 = 10 m",
        hint: "Rearrange v = √(2gh) to h = v²/(2g). 14² = 196. 2 × 9.8 = 19.6. Divide.",
        codeDigit: "9",
      },
      {
        id: "con-7",
        setup:
          "A ball is dropped from 20 m with no friction. (g = 10 m/s²)",
        question:
          "What speed does the ball reach just before impact? (Use v = √(2gh))",
        options: [
          "About 10 m/s",
          "About 20 m/s",
          "About 40 m/s",
          "About 30 m/s",
        ],
        correctIndex: 1,
        explanation:
          "v = √(2gh) = √(2 × 10 × 20) = √(400) = 20 m/s",
        hint: "v = √(2gh). 2 × 10 × 20 = 400. √400 = 20.",
        codeDigit: "5",
      },
      {
        id: "con-8",
        setup:
          "A 3 kg ball falls from 125 m. No friction. (g = 10 m/s²)",
        question:
          "What speed does the ball reach just before impact? (Use v = √(2gh))",
        options: [
          "About 50 m/s",
          "About 25 m/s",
          "About 75 m/s",
          "About 100 m/s",
        ],
        correctIndex: 0,
        explanation:
          "v = √(2gh) = √(2 × 10 × 125) = √(2,500) = 50 m/s",
        hint: "v = √(2gh). 2 × 10 × 125 = 2,500. √2,500 = 50.",
        codeDigit: "7",
      },
      {
        id: "con-9",
        setup:
          "An object strikes the plate at 28 m/s after a frictionless fall. (g = 9.8 m/s²)",
        question:
          "From what height did it fall? (Use h = v²/(2g))",
        options: [
          "About 40 m",
          "About 60 m",
          "About 20 m",
          "About 80 m",
        ],
        correctIndex: 0,
        explanation:
          "h = v²/(2g) = 28²/(2 × 9.8) = 784/19.6 = 40 m",
        hint: "h = v²/(2g). 28² = 784. 2 × 9.8 = 19.6. 784/19.6 = 40.",
        codeDigit: "2",
      },
      {
        id: "con-10",
        setup:
          "A ball is dropped from 45 m. No friction. (g = 10 m/s²)",
        question:
          "What speed does the ball reach just before impact? (Use v = √(2gh))",
        options: [
          "About 20 m/s",
          "About 45 m/s",
          "About 15 m/s",
          "About 30 m/s",
        ],
        correctIndex: 3,
        explanation:
          "v = √(2gh) = √(2 × 10 × 45) = √(900) = 30 m/s",
        hint: "v = √(2gh). 2 × 10 × 45 = 900. √900 = 30.",
        codeDigit: "0",
      },
      {
        id: "con-11",
        setup:
          "An object hits the plate at 7 m/s after falling from rest. No friction. (g = 9.8 m/s²)",
        question:
          "From what height was it dropped? (Use h = v²/(2g))",
        options: [
          "About 5 m",
          "About 2.5 m",
          "About 7 m",
          "About 10 m",
        ],
        correctIndex: 1,
        explanation:
          "h = v²/(2g) = 7²/(2 × 9.8) = 49/19.6 = 2.5 m",
        hint: "h = v²/(2g). 7² = 49. 2 × 9.8 = 19.6. 49/19.6 = 2.5.",
        codeDigit: "4",
      },
      {
        id: "con-12",
        setup:
          "A 12 kg ball falls from 50 m. No friction. (g = 9.8 m/s²)",
        question:
          "What speed does the ball reach just before impact? (Use v = √(2gh))",
        options: [
          "About 50 m/s",
          "About 22 m/s",
          "About 31 m/s",
          "About 44 m/s",
        ],
        correctIndex: 2,
        explanation:
          "v = √(2gh) = √(2 × 9.8 × 50) = √(980) ≈ 31.3 m/s ≈ 31 m/s. Mass cancels!",
        hint: "v = √(2gh). 2 × 9.8 × 50 = 980. √980 ≈ 31.3.",
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
      {
        id: "work-4",
        setup:
          "You hold a 20 kg box perfectly still at waist height for 30 seconds. The screen asks how much work you did on the box.",
        question: "How much work did you do on the box?",
        options: ["600 J", "196 J", "0 J", "5,880 J"],
        correctIndex: 2,
        explanation:
          "W = Fd. The box didn't move (d = 0), so W = F × 0 = 0 J. No displacement means no work!",
        hint: "Work requires displacement. If the object doesn't move, no work is done — no matter how hard you push.",
        codeDigit: "5",
      },
      {
        id: "work-5",
        setup:
          "You need to do 2,000 J of work on a crate, and you can push with 400 N of force.",
        question: "How far must you push the crate?",
        options: ["2 m", "5 m", "10 m", "8 m"],
        correctIndex: 1,
        explanation:
          "W = Fd → d = W/F = 2,000/400 = 5 m",
        hint: "Rearrange W = Fd to d = W/F. Divide the work by the force.",
        codeDigit: "9",
      },
      {
        id: "work-6",
        setup:
          "A forklift does 12,000 J of work pushing a pallet 15 m down the corridor.",
        question: "What force did the forklift apply?",
        options: ["800 N", "1,200 N", "600 N", "180,000 N"],
        correctIndex: 0,
        explanation:
          "W = Fd → F = W/d = 12,000/15 = 800 N",
        hint: "Rearrange W = Fd to F = W/d. Divide work by distance.",
        codeDigit: "4",
      },
      {
        id: "work-7",
        setup:
          "A robot applies 150 N of force and pushes a box 20 m down the corridor.",
        question: "How much work does the robot do?",
        options: ["1,500 J", "170 J", "7.5 J", "3,000 J"],
        correctIndex: 3,
        explanation: "W = Fd = 150 × 20 = 3,000 J",
        hint: "W = Fd. 150 × 20. Straightforward multiplication.",
        codeDigit: "1",
      },
      {
        id: "work-8",
        setup:
          "You push a crate with 600 N of force across 3.5 m.",
        question: "How much work do you do?",
        options: ["2,100 J", "1,800 J", "171 J", "603 J"],
        correctIndex: 0,
        explanation: "W = Fd = 600 × 3.5 = 2,100 J",
        hint: "W = Fd. 600 × 3.5. Be careful with the decimal.",
        codeDigit: "8",
      },
      {
        id: "work-9",
        setup:
          "It takes 7,500 J of work to slide a heavy safe 25 m across the corridor.",
        question: "What force was applied?",
        options: ["375 N", "250 N", "300 N", "187,500 N"],
        correctIndex: 2,
        explanation:
          "W = Fd → F = W/d = 7,500/25 = 300 N",
        hint: "Rearrange to F = W/d. 7,500 ÷ 25.",
        codeDigit: "6",
      },
      {
        id: "work-10",
        setup:
          "You need to do exactly 10,000 J of work. You can push with 250 N.",
        question: "How far must you push?",
        options: ["20 m", "25 m", "40 m", "50 m"],
        correctIndex: 2,
        explanation:
          "W = Fd → d = W/F = 10,000/250 = 40 m",
        hint: "d = W/F. 10,000 ÷ 250.",
        codeDigit: "2",
      },
      {
        id: "work-11",
        setup:
          "A motor pulls a cart with 1,000 N of force for 4.5 m along the corridor.",
        question: "How much work does the motor do?",
        options: ["4,500 J", "222 J", "1,004 J", "9,000 J"],
        correctIndex: 0,
        explanation: "W = Fd = 1,000 × 4.5 = 4,500 J",
        hint: "W = Fd. 1,000 × 4.5.",
        codeDigit: "3",
      },
      {
        id: "work-12",
        setup:
          "You push a box 10 m with a force of 75 N. Then you push it another 10 m with 75 N.",
        question: "What is the total work done?",
        options: ["750 J", "150 J", "7,500 J", "1,500 J"],
        correctIndex: 3,
        explanation:
          "Total W = Fd + Fd = (75 × 10) + (75 × 10) = 750 + 750 = 1,500 J. Or equivalently, 75 N × 20 m = 1,500 J.",
        hint: "Add the work from each segment, or realize it's the same force over the total distance (20 m).",
        codeDigit: "0",
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
      {
        id: "pow-4",
        setup:
          "A 100 W motor runs for 30 seconds to charge the exit system.",
        question: "How much work does the motor do?",
        options: ["3.3 J", "130 J", "3,000 J", "30,000 J"],
        correctIndex: 2,
        explanation:
          "P = W/t → W = P × t = 100 × 30 = 3,000 J",
        hint: "Rearrange P = W/t to W = P × t. Multiply power by time.",
        codeDigit: "4",
      },
      {
        id: "pow-5",
        setup:
          "A 500 W engine needs to do 10,000 J of work to activate the exit.",
        question: "How long will it take?",
        options: ["10 s", "20 s", "50 s", "5 s"],
        correctIndex: 1,
        explanation:
          "P = W/t → t = W/P = 10,000/500 = 20 s",
        hint: "t = W/P. 10,000 ÷ 500.",
        codeDigit: "7",
      },
      {
        id: "pow-6",
        setup:
          "The generator does 24,000 J of work in 60 seconds.",
        question: "What is the generator's power output?",
        options: ["400 W", "2,400 W", "1,440,000 W", "240 W"],
        correctIndex: 0,
        explanation:
          "P = W/t = 24,000/60 = 400 W",
        hint: "P = W/t. 24,000 ÷ 60.",
        codeDigit: "1",
      },
      {
        id: "pow-7",
        setup:
          "A motor rated at 200 W runs for 45 seconds to charge a capacitor bank.",
        question: "How much work does the motor do?",
        options: ["4.4 J", "245 J", "1,000 J", "9,000 J"],
        correctIndex: 3,
        explanation:
          "W = P × t = 200 × 45 = 9,000 J",
        hint: "W = P × t. 200 × 45.",
        codeDigit: "6",
      },
      {
        id: "pow-8",
        setup:
          "The backup system delivers 36,000 J in 2 minutes (120 seconds).",
        question: "What is the power output?",
        options: ["300 W", "600 W", "18,000 W", "72,000 W"],
        correctIndex: 0,
        explanation:
          "P = W/t = 36,000/120 = 300 W. Remember to convert minutes to seconds first!",
        hint: "P = W/t. Use seconds, not minutes. 2 min = 120 s.",
        codeDigit: "9",
      },
      {
        id: "pow-9",
        setup:
          "A 1,500 W generator runs for 8 seconds in an emergency burst.",
        question: "How much work does it do?",
        options: ["187.5 J", "1,508 J", "12,000 J", "6,000 J"],
        correctIndex: 2,
        explanation:
          "W = P × t = 1,500 × 8 = 12,000 J",
        hint: "W = P × t. 1,500 × 8.",
        codeDigit: "3",
      },
      {
        id: "pow-10",
        setup:
          "The exit requires 5,000 J of work. The generator produces 250 W.",
        question: "How long will it take to power the exit?",
        options: ["10 s", "20 s", "25 s", "50 s"],
        correctIndex: 1,
        explanation:
          "t = W/P = 5,000/250 = 20 s",
        hint: "t = W/P. 5,000 ÷ 250.",
        codeDigit: "0",
      },
      {
        id: "pow-11",
        setup:
          "A motor does 8,400 J of work in 12 seconds to power a laser grid.",
        question: "What is the motor's power output?",
        options: ["700 W", "100,800 W", "840 W", "350 W"],
        correctIndex: 0,
        explanation:
          "P = W/t = 8,400/12 = 700 W",
        hint: "P = W/t. 8,400 ÷ 12.",
        codeDigit: "8",
      },
      {
        id: "pow-12",
        setup:
          "The final override needs 20,000 J. Your generator outputs 800 W.",
        question: "How many seconds until the door opens?",
        options: ["20 s", "30 s", "15 s", "25 s"],
        correctIndex: 3,
        explanation:
          "t = W/P = 20,000/800 = 25 s",
        hint: "t = W/P. 20,000 ÷ 800.",
        codeDigit: "5",
      },
    ],
  },
];

/**
 * Select one puzzle per room, avoiding previously used IDs.
 * With 12 puzzles per room × 5 rooms = 12^5 = 248,832 unique combinations.
 */
export function buildPuzzleSet(usedIds = []) {
  return ROOMS.map((room) => {
    const available = room.puzzles.filter((p) => !usedIds.includes(p.id));
    const pool = available.length > 0 ? available : room.puzzles;
    const puzzle = pool[Math.floor(Math.random() * pool.length)];
    return { room, puzzle };
  });
}
