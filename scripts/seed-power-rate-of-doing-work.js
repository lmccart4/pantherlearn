// seed-power-rate-of-doing-work.js
// Physics — Energy Unit, Lesson 9 (order: 8)
// "Power: The Rate of Doing Work"
// Run from your pantherlearn directory: node scripts/seed-power-rate-of-doing-work.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE_ID = "physics";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const blocks = [

  // ─── WARM UP ─────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "⚡",
    title: "Warm Up",
    subtitle: "~5 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Define power as the rate at which work is done (P = W / t)",
      "Calculate power in real-world scenarios using P = W / t and P = F × v",
      "Compare power outputs of everyday machines, athletes, and animals",
      "Explain why two systems can do the same work but have different power ratings",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** A horse and a crane both lift a 500 kg beam to the top of a 10-meter building. The horse takes 2 minutes; the crane takes 10 seconds. They do the same work — so what's actually different?",
  },

  {
    id: uid(), type: "text",
    content: "Last class you learned that **work = force × displacement** (W = Fd). You measured work in the weight room. But there's something W = Fd doesn't capture:\n\n**Speed.**\n\nTwo students can do the exact same work — lift the same weight the same distance — but one does it in 2 seconds and the other takes 20 seconds. The physics work is identical. But something is clearly different.\n\nToday you'll learn what that something is called.",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "Two students both carry a 10 kg backpack up a flight of stairs. One sprints. One walks. Who did more work? Who would you describe as 'more powerful'? Why?",
    difficulty: "understand",
  },

  // ─── WHAT IS POWER? ────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔋",
    title: "What is Power?",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Power** measures how fast work is done. The equation is simple:\n\n## P = W / t\n\nWhere:\n- **P** = power (watts, W)\n- **W** = work done (joules, J)\n- **t** = time to do the work (seconds, s)\n\nSame work, less time = more power. That's it.\n\nThe unit is the **watt (W)**, named after James Watt. He invented the term while trying to sell steam engines — he needed a way to compare his engines to the horses they were replacing.",
  },

  {
    id: uid(), type: "definition",
    term: "Power",
    definition: "The rate at which work is done or energy is transferred. P = W / t. Measured in watts (W). 1 watt = 1 joule per second. More power means the same work gets done faster.",
  },

  {
    id: uid(), type: "definition",
    term: "Watt (W)",
    definition: "The SI unit of power. 1 watt = 1 joule of work done per second. Named after James Watt, who compared his steam engines to horses — leading to the unit 'horsepower.' 1 hp = 746 watts.",
  },

  {
    id: uid(), type: "definition",
    term: "Horsepower (hp)",
    definition: "A traditional unit of power. 1 horsepower = 746 watts. James Watt defined it as the rate at which a strong draft horse could do work — about 550 ft·lbs per second. Still used for cars and motors today.",
  },

  {
    id: "q-basic-power", type: "question",
    questionType: "multiple_choice",
    prompt: "Athlete A lifts 200 J worth of weight in 4 seconds. Athlete B lifts the same 200 J in 10 seconds. Which statement is correct?",
    difficulty: "apply",
    options: [
      "Athlete A has more power (50 W vs. 20 W)",
      "Athlete B has more power because they worked longer",
      "Both have the same power since they did the same work",
      "Not enough information to compare",
    ],
    correctIndex: 0,
    explanation: "P = W / t. Athlete A: 200 J / 4 s = 50 W. Athlete B: 200 J / 10 s = 20 W. Same work, but Athlete A did it faster — so Athlete A is more powerful.",
  },

  // ─── ALTERNATE FORMULA: P = Fv ─────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🚗",
    title: "The Speed Formula: P = F × v",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "There's a second power equation that's incredibly useful for anything moving at constant speed:\n\n## P = F × v\n\nWhere:\n- **P** = power (watts)\n- **F** = force (newtons)\n- **v** = velocity (m/s)\n\n**Where does this come from?** Watch:\n\nP = W / t = (F × d) / t = F × (d / t) = F × v\n\nSince d/t is just velocity, we can skip the work calculation entirely.\n\nThis is the formula engineers use for vehicles, conveyor belts, escalators — anything exerting a constant force while moving at steady speed.",
  },

  {
    id: "q-fv-derivation", type: "question",
    questionType: "multiple_choice",
    prompt: "A car engine exerts 3,000 N of force to maintain a constant speed of 20 m/s on the highway. What is the engine's power output?",
    difficulty: "apply",
    options: [
      "150 W",
      "60,000 W (60 kW)",
      "3,020 W",
      "Not enough info — we need the distance",
    ],
    correctIndex: 1,
    explanation: "P = F × v = 3,000 N × 20 m/s = 60,000 W = 60 kW. That's about 80 horsepower. Notice you don't need distance or time — just force and speed.",
  },

  // ─── POWER IN THE REAL WORLD ───────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🌍",
    title: "Power in the Real World",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Power shows up everywhere. Here's where you fall on the scale:\n\n| System | Power | Notes |\n|--------|-------|-------|\n| Human body at rest | ~100 W | Just keeping you alive |\n| Walking upstairs | ~200 W | Lifting your own weight |\n| Sprinting upstairs | ~700 W | Same work, way faster |\n| Pro cyclist (sustained) | ~400 W | Tour de France riders |\n| Usain Bolt (peak) | ~2,600 W | For about 1 second |\n| Horse (sustained) | ~750 W | Literally 1 horsepower |\n| Car engine | ~150,000 W | ~200 hp |\n| Locomotive | ~3,000,000 W | ~4,000 hp |\n| Space Shuttle engines | ~12,000,000,000 W | 12 GW at liftoff |\n\nNotice: Usain Bolt's peak power exceeds a horse's sustained power. But he can only maintain it for ~1 second. Power and endurance are different things.",
  },

  {
    id: "q-comparison", type: "question",
    questionType: "multiple_choice",
    prompt: "A Tesla Model 3 has a 283 hp motor. Approximately how many watts is that?",
    difficulty: "apply",
    options: [
      "About 2,830 W",
      "About 28,300 W",
      "About 211,000 W",
      "About 2,110,000 W",
    ],
    correctIndex: 2,
    explanation: "1 hp = 746 W. So 283 × 746 = 211,118 W ≈ 211 kW. Now you know what car specs actually mean — a 283 hp car transfers about 211,000 joules of energy every second at full power.",
  },

  {
    id: uid(), type: "question",
    questionType: "short_answer",
    prompt: "Your phone charger is probably labeled somewhere between 5W and 20W. A microwave is about 1,000W. How many phone chargers would it take to match the power of one microwave? What does this tell you about the energy demands of heating food vs. charging a battery?",
    difficulty: "analyze",
  },

  // ─── STAIRCASE POWER LAB ───────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔬",
    title: "Staircase Power Lab",
    subtitle: "~15 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Time to measure YOUR power output. You'll climb a flight of stairs twice — once walking, once fast — and calculate your power each time.\n\nThe key insight: **you do the same work both times** (same weight, same height). But different power.",
  },

  {
    id: uid(), type: "activity",
    icon: "📋",
    title: "Lab Setup",
    instructions: "**Before leaving the classroom:**\n1. Step on the bathroom scale → record weight in pounds\n2. Convert to newtons: weight (lbs) × 4.45 = weight (N)\n3. Check the board for the staircase height (measured by Mr. McCarthy)\n\n**At the staircase:**\n1. Partner A climbs, Partner B times with a stopwatch\n2. **Round 1:** Walk up the stairs at normal speed. Record time.\n3. **Round 2:** Go up as fast as safely possible. Record time.\n4. Swap roles.\n\n**Safety:** No running. Move quickly but under control. Use the handrail.",
  },

  {
    id: uid(), type: "calculator",
    title: "Step 1: Calculate Your Weight in Newtons",
    description: "Convert your weight from pounds to newtons.\n\nWeight (N) = Weight (lbs) × 4.45",
    formula: "weight_lbs * 4.45",
    showFormula: true,
    inputs: [
      { name: "weight_lbs", label: "Your weight", unit: "lbs" },
    ],
    output: { label: "Your Weight", unit: "N", decimals: 1 },
  },

  {
    id: uid(), type: "calculator",
    title: "Step 2: Calculate Work Done",
    description: "Work = Force × distance. Here, the force is your weight (gravity pulls you down, you push yourself up) and the distance is the vertical height of the stairs.\n\nW = Weight (N) × height (m)",
    formula: "weight_n * height",
    showFormula: true,
    inputs: [
      { name: "weight_n", label: "Your weight (from Step 1)", unit: "N" },
      { name: "height", label: "Staircase height", unit: "m" },
    ],
    output: { label: "Work Done", unit: "J", decimals: 1 },
  },

  {
    id: uid(), type: "calculator",
    title: "Step 3: Calculate Power (Walking)",
    description: "Power = Work / Time. Use your walking time.\n\nP = W / t",
    formula: "work / time",
    showFormula: true,
    inputs: [
      { name: "work", label: "Work done (from Step 2)", unit: "J" },
      { name: "time", label: "Walking time", unit: "s" },
    ],
    output: { label: "Walking Power", unit: "W", decimals: 1 },
  },

  {
    id: uid(), type: "calculator",
    title: "Step 4: Calculate Power (Fast)",
    description: "Same work, less time. Calculate your fast-climbing power.\n\nP = W / t",
    formula: "work / time",
    showFormula: true,
    inputs: [
      { name: "work", label: "Work done (same as Step 2)", unit: "J" },
      { name: "time", label: "Fast climbing time", unit: "s" },
    ],
    output: { label: "Fast Power", unit: "W", decimals: 1 },
  },

  {
    id: "q-lab-data", type: "question",
    questionType: "short_answer",
    prompt: "Record your full lab data:\n- Weight: ___ lbs = ___ N\n- Staircase height: ___ m\n- Work done: ___ J\n- Walking time: ___ s → Power: ___ W\n- Fast time: ___ s → Power: ___ W\n\nHow many times more powerful were you going fast vs. walking? Show the ratio.",
    difficulty: "apply",
  },

  {
    id: "q-lab-insight", type: "question",
    questionType: "multiple_choice",
    prompt: "Your walking power was lower than your fast-climbing power. What changed between the two trials?",
    difficulty: "understand",
    options: [
      "You exerted more force going fast",
      "You climbed a greater height going fast",
      "You did more work going fast",
      "You did the same work in less time",
    ],
    correctIndex: 3,
    explanation: "Same force (your weight didn't change). Same distance (same staircase). Same work (W = Fd is identical). The ONLY thing that changed was time — and since P = W/t, less time means more power.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Where do you rank?** Compare your staircase power to the table from earlier. Most students fall between 200-700 W depending on speed. That's roughly 0.3 to 1 horsepower. If you sustained your fast-climbing power for an entire hour, you could power a few lightbulbs — and you'd be absolutely exhausted.",
  },

  // ─── CHECK YOUR UNDERSTANDING ──────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "✅",
    title: "Check Your Understanding",
    subtitle: "~8 minutes",
  },

  {
    id: "q-check1", type: "question",
    questionType: "multiple_choice",
    prompt: "A forklift does 10,000 J of work in 5 seconds. A person does the same 10,000 J in 100 seconds. Which statement is correct?",
    difficulty: "apply",
    options: [
      "The forklift did more work",
      "The person did more work",
      "The forklift had more power (2,000 W vs. 100 W)",
      "They had the same power since they did the same work",
    ],
    correctIndex: 2,
    explanation: "Same work (10,000 J both). Forklift: P = 10,000/5 = 2,000 W. Person: P = 10,000/100 = 100 W. The forklift is 20× more powerful — not because it does more work, but because it does it 20× faster.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "A 70 kg student climbs a 5 m rope in 8 seconds. What is their power output? (g = 9.8 m/s²)",
    difficulty: "apply",
    options: [
      "43.75 W",
      "428.75 W",
      "3,430 W",
      "2,744 W",
    ],
    correctIndex: 1,
    explanation: "W = mgh = 70 × 9.8 × 5 = 3,430 J. P = W/t = 3,430 / 8 = 428.75 W. That's more than half a horsepower — serious output for 8 seconds of effort!",
  },

  {
    id: "q-check3", type: "question",
    questionType: "multiple_choice",
    prompt: "A truck pulls a trailer with 8,000 N of force at a constant 25 m/s. What is the truck's power output?",
    difficulty: "apply",
    options: [
      "320 W",
      "200,000 W (200 kW)",
      "8,025 W",
      "Not enough info — need the distance",
    ],
    correctIndex: 1,
    explanation: "P = F × v = 8,000 N × 25 m/s = 200,000 W = 200 kW ≈ 268 hp. This is the alternate power formula — perfect for constant-speed problems where you know force and velocity.",
  },

  {
    id: "q-check4", type: "question",
    questionType: "short_answer",
    prompt: "If a 60 kg person climbs a 3 m staircase in 4 seconds, could they power a 100 W lightbulb? Show your calculation and explain.",
    difficulty: "evaluate",
  },

  // ─── WRAP UP ───────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎬",
    title: "Wrap Up",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "**Two equations, one idea:**\n\n**P = W / t** — Power is the rate of doing work. Same work done faster = more power.\n\n**P = F × v** — For constant-speed situations. More force or more speed = more power.\n\n**Units:** watts (W) = joules per second. 1 horsepower = 746 watts.\n\nPower isn't about how much work you do — it's about how fast you do it. That's why a crane and a horse can do the same work, but nobody hires a horse to build a skyscraper.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:** A horse and a crane both lift a 500 kg beam 10 meters. Same work: W = mgh = 500 × 9.81 × 10 = 49,050 J.\n\n- Horse (2 min): P = 49,050 / 120 = **409 W ≈ 0.55 hp**\n- Crane (10 s): P = 49,050 / 10 = **4,905 W ≈ 6.6 hp**\n\nThe crane is 12× more powerful. Same work. Very different power.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Look back at your warm-up answer. You said the sprinter and walker did the same work — were you right? Now add power to the picture: which one was more powerful, and by how much would you estimate?",
    difficulty: "evaluate",
    linkedBlockId: "q-warmup",
  },

  // ─── VOCABULARY ────────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📖",
    title: "Key Vocabulary",
    subtitle: "",
  },

  {
    id: uid(), type: "vocab_list",
    terms: [
      { term: "Power", definition: "The rate at which work is done or energy is transferred. P = W / t. Measured in watts (W). 1 watt = 1 joule per second." },
      { term: "Watt (W)", definition: "The SI unit of power. 1 W = 1 J/s. Named after James Watt. A human at rest produces about 100 W of thermal power." },
      { term: "Horsepower (hp)", definition: "A traditional unit of power. 1 hp = 746 W. Defined by James Watt as the rate a strong draft horse could sustain work. Still used for cars and motors." },
      { term: "Work", definition: "Energy transferred when a force causes displacement in the direction of the force. W = F × d. Measured in joules (J)." },
      { term: "Joule (J)", definition: "The SI unit of work and energy. 1 J = 1 N × 1 m = 1 W × 1 s." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("power-rate-of-doing-work");

  const data = {
    title: "Power: The Rate of Doing Work",
    questionOfTheDay: "A horse and a crane both lift a 500 kg beam to the top of a 10-meter building. The horse takes 2 minutes; the crane takes 10 seconds. They do the same work — so what's actually different?",
    course: "Physics",
    unit: "Energy",
    order: 8,
    visible: false,
    dueDate: "2026-03-17",
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded successfully!`);
  console.log(`   Title: "${data.title}"`);
  console.log(`   Path:  courses/${COURSE_ID}/lessons/power-rate-of-doing-work`);
  console.log(`   Blocks: ${blocks.length}`);
  console.log(`   Order:  ${data.order}`);
  console.log(`\n   View at: https://pantherlearn.web.app/course/${COURSE_ID}/lesson/power-rate-of-doing-work`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
