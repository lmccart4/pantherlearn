// seed-work-power-calories-lab.js
// Creates the "Work, Power, and Calories: The Weight Room Lab" lesson
// in the Physics course.
//
// Run: node scripts/seed-work-power-calories-lab.js
// Uses Firebase Admin SDK (bypasses Firestore rules)

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";

const blocks = [

  // ─── WARM UP ─────────────────────────────────────────────

  {
    id: "header-warmup", type: "section_header",
    icon: "🏋️",
    title: "Warm Up",
    subtitle: "~5 minutes",
  },

  {
    id: "text-warmup-intro", type: "text",
    content: "You've spent the last few classes learning about energy — how it's stored (GPE, KE, EPE), how it transforms between forms, and how it's always conserved. Today you'll learn how to **measure** the exact amount of energy transferred when you lift a weight — and connect it to the food you eat.",
  },

  {
    id: "callout-qotd", type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** How many Calories do you think you burn doing 50 bicep curls with a 10-pound dumbbell? Take a guess — we'll calculate the real answer by the end of class.",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "When someone at the gym \"does work,\" what do you think that means in everyday language? Now think like a physicist — what do you think *work* means in physics? Are they the same thing?",
    difficulty: "remember",
  },

  // ─── LEARNING OBJECTIVES ─────────────────────────────────

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Define work and calculate it using W = F × d",
      "Explain why holding a weight still is NOT doing work in physics",
      "Define power and calculate it using P = W / t",
      "Convert between joules and food Calories (1 Cal = 4,184 J)",
      "Measure real work and power by lifting weights in the lab",
      "Estimate Calories burned during a weight-lifting exercise",
    ],
  },

  // ─── WHAT IS WORK? ───────────────────────────────────────

  {
    id: "header-work", type: "section_header",
    icon: "⚙️",
    title: "What is Work?",
    subtitle: "~10 minutes",
  },

  {
    id: "text-work-definition", type: "text",
    content: "In everyday life, \"work\" means anything that takes effort — studying, running errands, even *thinking*. In physics, the definition is much more specific:\n\n**Work is done only when a force causes an object to move in the direction of that force.**\n\nRemember from the Ability Architect? Every energy change followed the same pattern: **Force × Displacement**. Today you'll see that pattern has a name: **Work**.\n\n**W = F × d**\n\nWhere:\n- **W** = work (joules, J)\n- **F** = force applied in the direction of motion (newtons, N)\n- **d** = distance the object moves (meters, m)\n\nIf there's no movement — or the force is perpendicular to the movement — **no work is done.**",
  },

  {
    id: "def-work", type: "definition",
    term: "Work",
    definition: "The transfer of energy when a force causes an object to move in the direction of the force. W = F × d. Measured in joules (J). 1 joule = 1 newton × 1 meter.",
  },

  {
    id: "def-joule", type: "definition",
    term: "Joule (J)",
    definition: "The SI unit of work and energy. 1 joule = the work done when a force of 1 newton moves an object 1 meter in the direction of the force. Named after physicist James Prescott Joule.",
  },

  {
    id: "callout-misconception", type: "callout",
    icon: "⚠️", style: "warning",
    content: "**Common Misconception:** If you hold a 20-pound dumbbell perfectly still for 10 minutes, you feel exhausted — but in physics, you did **zero work**. Work requires *displacement* in the direction of the force. No movement = no work. (Your muscles are doing internal work, but the dumbbell goes nowhere!)",
  },

  {
    id: "sorting-work", type: "sorting",
    icon: "⚙️",
    title: "Work or No Work?",
    instructions: "In physics, work requires a force AND displacement in the direction of the force. Classify each scenario — does it involve **work** in the physics sense? Swipe left for Work Done, right for No Work Done.",
    leftLabel: "Work Done ✅",
    rightLabel: "No Work Done ❌",
    items: [
      { text: "Lifting a dumbbell from the floor to your shoulder", correct: "left" },
      { text: "Holding a barbell perfectly still overhead for 30 seconds", correct: "right" },
      { text: "Pushing a sled across a turf field", correct: "left" },
      { text: "A wall that doesn't move when you push against it", correct: "right" },
      { text: "Carrying a backpack horizontally across a room", correct: "right" },
      { text: "Doing a pull-up (moving your body upward)", correct: "left" },
      { text: "A shopping cart rolling freely after you let go", correct: "right" },
      { text: "Lowering a box slowly to the floor", correct: "left" },
      { text: "Standing on a scale — not moving", correct: "right" },
      { text: "Doing a squat with a barbell on your shoulders", correct: "left" },
    ],
  },

  {
    id: "q-work-mc1", type: "question",
    questionType: "multiple_choice",
    prompt: "A student lifts a 5 kg dumbbell straight up 0.5 meters. The force of gravity on the dumbbell is 49 N downward, and the student pushes up with 49 N. How much work does the student do on the dumbbell?",
    difficulty: "apply",
    options: [
      "0 J — the net force is zero so no work is done",
      "24.5 J — using W = F × d = 49 × 0.5",
      "245 J — using the weight in pounds",
      "49 J — force equals work",
    ],
    correctIndex: 1,
    explanation: "W = F × d = 49 N × 0.5 m = 24.5 J. The student exerts 49 N upward over 0.5 m of displacement. Even though the net force on the dumbbell may be ~0 (constant velocity), the student does 24.5 J of work ON the dumbbell.",
  },

  // ─── WHAT IS POWER? ──────────────────────────────────────

  {
    id: "header-power", type: "section_header",
    icon: "⚡",
    title: "What is Power?",
    subtitle: "~5 minutes",
  },

  {
    id: "text-power-definition", type: "text",
    content: "Two students both lift the same dumbbell the same distance. They do the same amount of **work**. But one does it in 2 seconds and the other takes 10 seconds.\n\nWho's more *powerful*?\n\n**Power** measures how *fast* work is done:\n\n**P = W / t**\n\nWhere:\n- **P** = power (watts, W)\n- **W** = work done (joules, J)\n- **t** = time to do the work (seconds, s)\n\nA person who lifts the same weight faster is more powerful. Power is about *rate*, not just effort.",
  },

  {
    id: "def-power", type: "definition",
    term: "Power",
    definition: "The rate at which work is done. P = W / t. Measured in watts (W). 1 watt = 1 joule per second. A more powerful engine or athlete does the same work in less time.",
  },

  {
    id: "def-watt", type: "definition",
    term: "Watt (W)",
    definition: "The SI unit of power. 1 watt = 1 joule of work done per second. Named after James Watt, inventor of the steam engine. Your body at rest radiates about 80–100 watts of thermal power.",
  },

  {
    id: "q-power-mc1", type: "question",
    questionType: "multiple_choice",
    prompt: "Athlete A lifts 200 J worth of weight in 4 seconds. Athlete B lifts the same 200 J in 10 seconds. Which athlete has more power, and what is their power output?",
    difficulty: "apply",
    options: [
      "Athlete A: 50 W — they do the same work faster",
      "Athlete B: 20 W — they spend more time and therefore work harder",
      "Both have 200 W — they did the same work",
      "It's impossible to compare without knowing their weights",
    ],
    correctIndex: 0,
    explanation: "P = W / t. Athlete A: P = 200 J / 4 s = 50 W. Athlete B: P = 200 J / 10 s = 20 W. Athlete A is more powerful because they complete the same work in less time.",
  },

  // ─── ENERGY AND CALORIES ─────────────────────────────────

  {
    id: "header-calories", type: "section_header",
    icon: "🍎",
    title: "Connecting Work to Calories",
    subtitle: "~5 minutes",
  },

  {
    id: "text-calories", type: "text",
    content: "When you lift weights, your muscles do work — and that work requires **chemical energy** from the food you eat. That energy is measured in **Calories**.\n\nBut here's where it gets confusing:\n\n- A **calorie** (lowercase c) is the amount of heat needed to raise 1 gram of water by 1°C.\n- A **food Calorie** (uppercase C, also called a kilocalorie or kcal) = **1,000 small calories** = **4,184 joules**.\n\nSo when a granola bar says it has 250 Calories, that's 250 × 4,184 = **over one million joules** of stored chemical energy!\n\nYou can now calculate the Calories burned from any physical activity using:\n\n**Calories burned ≈ W (joules) ÷ 4,184**\n\n*(Note: This is a simplified estimate. Your body is not 100% efficient — it burns extra energy as heat. Real Calorie burn is higher.)*",
  },

  {
    id: "def-calorie", type: "definition",
    term: "Calorie (food Calorie / kcal)",
    definition: "A unit of energy used in nutrition. 1 food Calorie (Cal) = 1 kilocalorie = 4,184 joules. The Calories listed on food packaging represent the chemical energy stored in that food.",
  },

  {
    id: "callout-conversion", type: "callout",
    icon: "💡", style: "insight",
    content: "**Quick conversion to remember:**\n\n**1 food Calorie = 4,184 joules**\n\nA single grape (~3 Calories) contains about **12,552 joules** of chemical energy. That's enough energy to lift a 1 kg weight about 1,278 meters into the air — if your body were perfectly efficient!",
  },

  // ─── LAB PART 1: MEASURING WORK ──────────────────────────

  {
    id: "header-lab1", type: "section_header",
    icon: "🔬",
    title: "Lab Part 1: Measuring Work",
    subtitle: "~15 minutes",
  },

  {
    id: "activity-setup", type: "activity",
    icon: "🏋️",
    title: "Setup: Choose Your Exercise",
    instructions: "Pick ONE of the following exercises for your lab measurements:\n\n**Option A — Bicep Curl:** Hold a dumbbell at your side, curl it up to shoulder height.\n**Option B — Shoulder Press:** Start with dumbbell at shoulder height, press it overhead.\n**Option C — Squat:** Use a dumbbell or weight plate held at chest, squat down and stand back up.\n\n**Before you begin, measure and record:**\n1. The mass of your weight in kilograms (1 lb ≈ 0.454 kg)\n2. The distance the weight travels in one rep (use a ruler or tape measure, in meters)\n3. Calculate the gravitational force: F = m × 9.8 m/s²",
  },

  {
    id: "checklist-materials", type: "checklist",
    title: "Lab Materials Checklist",
    items: [
      "Dumbbell or weight plate (check the labeled weight in lbs or kg)",
      "Meter stick or measuring tape",
      "Stopwatch or phone timer",
      "Calculator (or use the ones below)",
      "Partner to count reps and run the timer",
    ],
  },

  {
    id: "calc-force", type: "calculator",
    title: "Step 1: Calculate the Lifting Force",
    description: "First, convert your weight's mass to the gravitational force (weight force) pulling it down. This is the force you must exert to lift it.\n\nF = mass × g",
    formula: "mass * 9.81",
    showFormula: true,
    inputs: [
      { name: "mass", label: "Mass of weight", unit: "kg" },
    ],
    output: { label: "Lifting Force (F)", unit: "N", decimals: 2 },
  },

  {
    id: "calc-work-per-rep", type: "calculator",
    title: "Step 2: Calculate Work Per Rep",
    description: "Now calculate the work done in a single rep (one lift). Use the force from Step 1 and the distance the weight travels upward.\n\nW = F × d",
    formula: "force * distance",
    showFormula: true,
    inputs: [
      { name: "force", label: "Lifting force (from Step 1)", unit: "N" },
      { name: "distance", label: "Distance weight travels per rep", unit: "m" },
    ],
    output: { label: "Work per Rep", unit: "J", decimals: 2 },
  },

  {
    id: "calc-total-work", type: "calculator",
    title: "Step 3: Calculate Total Work for All Reps",
    description: "Multiply the work per rep by the total number of reps you performed.\n\nW_total = W_per_rep × reps",
    formula: "work_per_rep * reps",
    showFormula: true,
    inputs: [
      { name: "work_per_rep", label: "Work per rep (from Step 2)", unit: "J" },
      { name: "reps", label: "Total number of reps", unit: "reps" },
    ],
    output: { label: "Total Work Done", unit: "J", decimals: 1 },
  },

  {
    id: "q-work-data", type: "question",
    questionType: "short_answer",
    prompt: "Record your lab data: Which exercise did you choose? What was the mass of your weight (kg), lifting distance (m), force (N), work per rep (J), number of reps, and total work (J)? Show how you calculated the total.",
    difficulty: "apply",
  },

  {
    id: "evidence-upload", type: "evidence_upload",
    icon: "📷",
    title: "Upload Lab Evidence",
    instructions: "Take a photo showing: (1) the weight you used with its label visible, (2) your partner measuring the distance of one rep with a ruler, OR a short video of you performing one rep.",
    reflectionPrompt: "Describe your exercise setup. What weight did you use? How did you measure the rep distance? Did anything make it tricky to measure accurately?",
  },

  // ─── LAB PART 2: MEASURING POWER ─────────────────────────

  {
    id: "header-lab2", type: "section_header",
    icon: "⚡",
    title: "Lab Part 2: Measuring Power",
    subtitle: "~15 minutes",
  },

  {
    id: "activity-timed-rounds", type: "activity",
    icon: "⏱️",
    title: "Timed Exercise Rounds",
    instructions: "Now you'll measure your power output at different speeds.\n\n**Round 1 — Slow and Steady:** Perform 10 reps at a slow, controlled pace. Have your partner time how long it takes.\n\n**Round 2 — As Fast As Possible:** Perform 10 reps as quickly as you can (safely!). Record the time.\n\n**Calculate power for both rounds:** P = W_total / t\n\nRemember: same work, different time = different power!",
  },

  {
    id: "calc-power", type: "calculator",
    title: "Calculate Your Power Output",
    description: "Enter your total work (from Part 1, calculated for 10 reps) and the time for each round.\n\nP = W / t",
    formula: "work / time",
    showFormula: true,
    inputs: [
      { name: "work", label: "Total work for 10 reps", unit: "J" },
      { name: "time", label: "Time to complete 10 reps", unit: "s" },
    ],
    output: { label: "Power Output", unit: "W", decimals: 2 },
  },

  {
    id: "q-power-data", type: "question",
    questionType: "short_answer",
    prompt: "Record both rounds: What was your power output (W) for Round 1 (slow) and Round 2 (fast)? How much more powerful were you in Round 2? What does this tell you about the relationship between speed and power?",
    difficulty: "analyze",
  },

  {
    id: "q-power-mc2", type: "question",
    questionType: "multiple_choice",
    prompt: "You calculated different power values for slow vs. fast reps. The total work for 10 reps was the same both times. What changed to give you more power in the fast round?",
    difficulty: "understand",
    options: [
      "You lifted more force in the fast round",
      "The distance was greater in the fast round",
      "You did the same work in less time, so W/t was larger",
      "Your muscles generated more joules in the fast round",
    ],
    correctIndex: 2,
    explanation: "Power = W / t. If W is the same but t is smaller (faster reps), then P is larger. Power is about the *rate* of doing work, not the total amount. Going faster = more power.",
  },

  // ─── LAB PART 3: CALORIES BURNED ─────────────────────────

  {
    id: "header-lab3", type: "section_header",
    icon: "🔥",
    title: "Lab Part 3: Calories Burned",
    subtitle: "~10 minutes",
  },

  {
    id: "text-calories-intro", type: "text",
    content: "Now let's answer the Question of the Day — how many Calories does your exercise actually burn?\n\nRemember: **1 food Calorie = 4,184 joules**\n\nSo: **Calories burned = total work (J) ÷ 4,184**\n\n⚠️ *Important caveat:* This gives the **mechanical work** your muscles actually did on the weight. Your body is only about **25% mechanically efficient** — you actually burn roughly **4× more Calories** than the mechanical work alone, because your body generates heat and runs many internal processes. So a more realistic estimate is:\n\n**Estimated Calories burned ≈ (W × 4) ÷ 4,184**",
  },

  {
    id: "calc-calories", type: "calculator",
    title: "Estimate Calories Burned",
    description: "Use your total work from the lab to estimate Calories burned. This formula accounts for ~25% mechanical efficiency.\n\nCalories ≈ (W × 4) ÷ 4,184",
    formula: "(work * 4) / 4184",
    showFormula: true,
    inputs: [
      { name: "work", label: "Total mechanical work done", unit: "J" },
    ],
    output: { label: "Estimated Calories Burned", unit: "Cal", decimals: 4 },
  },

  {
    id: "q-oreo-comparison", type: "question",
    questionType: "short_answer",
    prompt: "How many Calories did you burn doing your exercise? Now compare: a single Oreo cookie has about 53 Calories. How many reps would you need to do to \"burn off\" one Oreo? Show your calculation. Does this surprise you?",
    difficulty: "evaluate",
  },

  {
    id: "callout-reality-check", type: "callout",
    icon: "💡", style: "insight",
    content: "**Reality Check:** Exercise burns far fewer Calories than most people think. A 150-lb person burns roughly 200-300 Calories per hour of moderate weight training. That's about one medium apple. This is why nutrition and diet have a much bigger impact on body composition than exercise alone — both matter, but in different ways.",
  },

  {
    id: "q-100-calories", type: "question",
    questionType: "short_answer",
    prompt: "Based on your calculations, how long would you need to continuously do your exercise to burn 100 Calories? Use your measured power output and the Calorie conversion to estimate. Show your work.",
    difficulty: "analyze",
  },

  // ─── CHECK YOUR UNDERSTANDING ─────────────────────────────

  {
    id: "header-check", type: "section_header",
    icon: "✅",
    title: "Check Your Understanding",
    subtitle: "~8 minutes",
  },

  {
    id: "q-check-mc1", type: "question",
    questionType: "multiple_choice",
    prompt: "A construction worker carries a 50 kg bag of cement horizontally across a flat floor for 10 meters at a constant height. How much work does the worker do on the bag?",
    difficulty: "apply",
    options: [
      "4,900 J — F = mg = 490 N, d = 10 m",
      "500 J — using F = 50 N × 10 m",
      "0 J — the force (upward to support the bag) is perpendicular to the motion (horizontal)",
      "50 J — mass × distance = 50 × 10",
    ],
    correctIndex: 2,
    explanation: "Work = F × d, but only the component of force in the direction of motion counts. The worker supports the bag with an upward force, but moves horizontally. Since force is perpendicular to displacement, W = 0 J. This is a classic misconception — carrying something sideways does no mechanical work on it, even though it's tiring!",
  },

  {
    id: "q-check-mc2", type: "question",
    questionType: "multiple_choice",
    prompt: "A 60 kg student does 20 pull-ups, raising their body 0.4 m each rep, in 40 seconds. What is their average power output? (g = 9.8 m/s²)",
    difficulty: "apply",
    options: [
      "117.6 W",
      "4,704 W",
      "235.2 W",
      "58.8 W",
    ],
    correctIndex: 0,
    explanation: "Step 1: F = mg = 60 × 9.8 = 588 N. Step 2: Work per rep = 588 × 0.4 = 235.2 J. Step 3: Total work = 235.2 × 20 = 4,704 J. Step 4: P = W/t = 4,704 / 40 = 117.6 W. That's about the same as a household light bulb!",
  },

  {
    id: "q-check-mc3", type: "question",
    questionType: "multiple_choice",
    prompt: "A fitness tracker says you burned 300 Calories during a workout. How many joules of energy did your body use?",
    difficulty: "understand",
    options: [
      "300 J",
      "71.7 J",
      "1,255,200 J",
      "300,000 J",
    ],
    correctIndex: 2,
    explanation: "1 food Calorie = 4,184 J. So 300 Cal × 4,184 J/Cal = 1,255,200 J ≈ 1.26 MJ (megajoules). This is an enormous amount of energy — more than enough to heat a liter of water from freezing to boiling nearly 150 times!",
  },

  {
    id: "q-design-challenge", type: "question",
    questionType: "short_answer",
    prompt: "Design a 30-second exercise challenge that would maximize power output. What exercise would you choose, how would you do it, and why? Use what you know about the formulas W = F × d and P = W / t to justify your design.",
    difficulty: "create",
  },

  // ─── WRAP UP ─────────────────────────────────────────────

  {
    id: "header-wrapup", type: "section_header",
    icon: "🎬",
    title: "Wrap Up",
    subtitle: "~5 minutes",
  },

  {
    id: "text-wrapup", type: "text",
    content: "Today you connected physics to something real: the gym.\n\n**Work (W = F × d)** — energy transferred when a force moves an object. Lifting a weight up does work; holding it still does not.\n\n**Power (P = W / t)** — the rate of doing work. Going faster doesn't change how much work you do, but it dramatically increases your power output.\n\n**Calories** — food energy measured in joules. 1 food Calorie = 4,184 J. Exercise burns fewer Calories than most people expect, but it requires real, measurable physics work.\n\nThe equations aren't just abstract — every time you lift a weight, your muscles are solving W = F × d in real time.",
  },

  {
    id: "callout-return-qotd", type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** How many Calories do you burn doing 50 bicep curls with a 10-pound dumbbell?\n\nNow that you have the formulas, calculate it. Compare with your original guess from the warm-up. Were you surprised?",
  },

  {
    id: "q-wrapup-linked", type: "question",
    questionType: "linked",
    prompt: "Look back at your warm-up answer about what 'work' means. How has your definition changed? What's the most surprising thing you learned today — either from the math or from doing the actual lab?",
    difficulty: "evaluate",
    linkedBlockId: "q-warmup",
  },

  // ─── VOCABULARY ───────────────────────────────────────────

  {
    id: "header-vocab", type: "section_header",
    icon: "📖",
    title: "Key Vocabulary",
    subtitle: "",
  },

  {
    id: "vocab-list", type: "vocab_list",
    terms: [
      { term: "Work", definition: "The transfer of energy that occurs when a force causes an object to move in the direction of the force. W = F × d. Measured in joules (J)." },
      { term: "Joule (J)", definition: "The SI unit of work and energy. 1 J = 1 N × 1 m. The work done lifting a small apple (≈100 g) by about 1 meter." },
      { term: "Newton (N)", definition: "The SI unit of force. 1 N ≈ the weight force of a 100 g object. F = ma." },
      { term: "Power", definition: "The rate at which work is done. P = W / t. Measured in watts (W). A more powerful athlete does the same work in less time." },
      { term: "Watt (W)", definition: "The SI unit of power. 1 W = 1 J/s. A human at rest produces about 80 W of thermal power; a sprint can exceed 1,000 W." },
      { term: "Calorie (Cal / kcal)", definition: "A unit of food energy. 1 food Calorie = 1 kilocalorie = 4,184 joules. Calories in food represent stored chemical energy your body can convert to work and heat." },
      { term: "Mechanical Efficiency", definition: "The fraction of input energy that becomes useful mechanical work. The human body is roughly 25% mechanically efficient — the rest is released as heat." },
      { term: "Force", definition: "A push or pull on an object. In weight-lifting, the key force is gravity: F = mg, where m is mass (kg) and g = 9.81 m/s²." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const data = {
    title: "Work, Power, and Calories: The Weight Room Lab",
    course: "Physics",
    unit: "Energy",
    order: 6,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await safeLessonWrite(db, COURSE_ID, "work-power-calories-lab", data);
  console.log(`✅ Lesson seeded successfully!`);
  console.log(`   Title: "${data.title}"`);
  console.log(`   Path:  courses/${COURSE_ID}/lessons/work-power-calories-lab`);
  console.log(`   Blocks: ${blocks.length}`);
  console.log(`   Order:  ${data.order}`);
  console.log(`\n   View at: https://pantherlearn.web.app/course/${COURSE_ID}/lesson/work-power-calories-lab`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
