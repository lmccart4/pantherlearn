// seed-gravitational-potential-energy.js
// Physics — Energy Unit, Lesson 6 (order: 5)
// "Gravitational Potential Energy"
// Run from your pantherlearn directory: node scripts/seed-gravitational-potential-energy.js

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
    icon: "🏔️",
    title: "Warm Up",
    subtitle: "~5 minutes",
  },

  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Calculate gravitational potential energy using GPE = mgh",
      "Predict how changing mass, gravity, or height affects GPE",
      "Apply GPE calculations to real-world scenarios",
      "Connect GPE to the conservation of energy framework",
    ],
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Question of the Day:** You're standing on the roof of the school holding a bowling ball and a tennis ball at the same height. Which one has more gravitational potential energy — and how much more?",
  },

  {
    id: uid(), type: "text",
    content: "You already know that an object high off the ground has **gravitational potential energy** — energy stored because of its position. You've seen it in bar charts: a ball at the top of a ramp has a tall GPE bar.\n\nBut *how much* energy? Today you'll learn to calculate it exactly.",
  },

  {
    id: "q-warmup", type: "question",
    questionType: "short_answer",
    prompt: "Mr. McCarthy holds a tennis ball at desk height, then raises it overhead. He just gave the ball more energy. Where did that energy come from? Where is it stored now? How could you prove it has more energy?",
    difficulty: "understand",
  },

  // ─── THE EQUATION ──────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📐",
    title: "The GPE Equation",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Gravitational potential energy depends on three things:\n\n1. **Mass** — heavier objects store more energy at the same height\n2. **Gravity** — stronger gravitational pull means more stored energy\n3. **Height** — higher up means more energy stored\n\nThe equation combines all three:\n\n## GPE = mgh\n\nWhere:\n- **GPE** = gravitational potential energy (joules, J)\n- **m** = mass of the object (kilograms, kg)\n- **g** = acceleration due to gravity (9.8 m/s² on Earth)\n- **h** = height above the reference point (meters, m)\n\nThis equation tells you exactly how much energy an object gains when you lift it — or how much it releases when it falls.",
  },

  {
    id: uid(), type: "definition",
    term: "Gravitational Potential Energy (GPE)",
    definition: "The energy stored in an object due to its height above a reference point. GPE = mgh. Measured in joules (J). The higher or heavier the object, the more gravitational potential energy it has.",
  },

  {
    id: uid(), type: "definition",
    term: "Reference Point",
    definition: "The position you measure height from — usually the ground or floor. GPE = 0 at the reference point. You get to choose where the reference point is, but you must be consistent throughout a problem.",
  },

  {
    id: uid(), type: "callout",
    icon: "💡", style: "insight",
    content: "**Why does GPE = mgh look like W = Fd?**\n\nBecause it IS work. To lift an object, you apply a force equal to its weight (mg) through a distance equal to the height (h). So:\n\nWork done lifting = F × d = mg × h = mgh = GPE gained\n\nThe energy you put IN by lifting becomes the energy stored AS gravitational PE.",
  },

  {
    id: "q-basic-gpe", type: "question",
    questionType: "multiple_choice",
    prompt: "A 5 kg cat is sitting on a shelf 2 meters above the floor. What is its gravitational potential energy relative to the floor? (g = 9.8 m/s²)",
    difficulty: "apply",
    options: [
      "10 J",
      "98 J",
      "49 J",
      "19.6 J",
    ],
    correctIndex: 1,
    explanation: "GPE = mgh = 5 kg × 9.8 m/s² × 2 m = 98 J. That's 98 joules of stored energy — if the cat falls, all of it converts to kinetic energy on the way down.",
  },

  // ─── PROPORTIONAL REASONING ────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "📊",
    title: "What Happens When You Change m, g, or h?",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "GPE = mgh is a **direct proportion** — every variable is multiplied.\n\nThis means:\n- **Double the mass** → GPE doubles\n- **Double the height** → GPE doubles\n- **Double both** → GPE quadruples\n- **Cut height in half** → GPE cuts in half\n\nNo squares, no inverse relationships. It's the simplest energy equation you'll see.",
  },

  {
    id: uid(), type: "sorting",
    icon: "📊",
    title: "GPE Increases or Decreases?",
    instructions: "For each change, decide whether GPE **increases** or **decreases**. Assume only the stated variable changes — everything else stays the same.",
    leftLabel: "GPE Increases ⬆️",
    rightLabel: "GPE Decreases ⬇️",
    items: [
      { text: "You carry a box to a higher shelf", correct: "left" },
      { text: "A parachutist descends toward the ground", correct: "right" },
      { text: "You replace a bowling ball with a tennis ball at the same height", correct: "right" },
      { text: "An elevator goes from the 1st floor to the 10th floor", correct: "left" },
      { text: "A roller coaster goes down the first drop", correct: "right" },
      { text: "You move from Earth to Jupiter (stronger gravity)", correct: "left" },
      { text: "A crane lifts a steel beam higher", correct: "left" },
      { text: "Water flows downhill through a pipe", correct: "right" },
      { text: "You stack a second brick on top of the first (more mass, same height)", correct: "left" },
      { text: "A hot air balloon deflates and sinks", correct: "right" },
    ],
  },

  {
    id: "q-proportional", type: "question",
    questionType: "multiple_choice",
    prompt: "Object A has a mass of 4 kg and sits at 3 m. Object B has a mass of 2 kg and sits at 6 m. Compare their gravitational potential energies.",
    difficulty: "analyze",
    options: [
      "A has more GPE because it's heavier",
      "B has more GPE because it's higher",
      "They have equal GPE",
      "Not enough information to compare",
    ],
    correctIndex: 2,
    explanation: "GPE_A = 4 × 9.8 × 3 = 117.6 J. GPE_B = 2 × 9.8 × 6 = 117.6 J. They're equal! Mass and height trade off — double one, halve the other, same result. This is what 'direct proportion' means in practice.",
  },

  // ─── GPE CALCULATOR LAB ────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🧮",
    title: "GPE Calculator Lab",
    subtitle: "~10 minutes",
  },

  {
    id: uid(), type: "text",
    content: "Use the calculators below to find the GPE of real objects at real heights. After each calculation, think about what the number *means* — how much energy is that, really?",
  },

  {
    id: uid(), type: "calculator",
    title: "GPE Calculator",
    description: "Enter the mass and height of any object to find its gravitational potential energy.\n\nGPE = m × g × h",
    formula: "mass * 9.8 * height",
    showFormula: true,
    inputs: [
      { name: "mass", label: "Mass", unit: "kg" },
      { name: "height", label: "Height above ground", unit: "m" },
    ],
    output: { label: "Gravitational PE", unit: "J", decimals: 1 },
  },

  {
    id: "q-calc-1", type: "question",
    questionType: "short_answer",
    prompt: "Use the calculator to find the GPE of each object. Record your answers:\n\n1. A 0.5 kg water bottle on your desk (0.75 m high)\n2. A 70 kg person standing on the school roof (~12 m high)\n3. A 2,000 kg car at the top of a parking garage (~15 m high)\n4. A 0.145 kg baseball thrown to a height of 30 m\n\nWhich one surprised you most? Why?",
    difficulty: "apply",
  },

  {
    id: uid(), type: "question",
    questionType: "multiple_choice",
    prompt: "A 50 kg student is standing on the second floor of the school (4 m above ground). They walk up to the fourth floor (12 m above ground). How much GPE did they GAIN?",
    difficulty: "apply",
    options: [
      "1,960 J (used full height of 4th floor)",
      "3,920 J (only the height gained: 12 - 4 = 8 m)",
      "5,880 J (used full height of 12 m)",
      "7,840 J (added both heights together)",
    ],
    correctIndex: 1,
    explanation: "The student gained GPE only for the height they CHANGED — from 4 m to 12 m, that's 8 m gained. ΔGPE = mgΔh = 50 × 9.8 × 8 = 3,920 J. Their total GPE at the 4th floor is 5,880 J, but they only gained 3,920 J by walking up.",
  },

  // ─── REAL WORLD GPE ────────────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🎢",
    title: "GPE in the Real World",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "GPE isn't just a textbook formula — it's the reason roller coasters work, hydroelectric dams generate electricity, and dropped objects can cause damage.\n\n| Object & Situation | Mass | Height | GPE |\n|---|---|---|---|\n| Phone falling off a table | 0.2 kg | 0.8 m | 1.6 J |\n| You on a roller coaster | 70 kg | 40 m | 27,440 J |\n| Water behind Hoover Dam | 1 kg (of water) | 221 m | 2,166 J |\n| Skydiver before jumping | 80 kg | 4,000 m | 3,136,000 J |\n\nThat skydiver has over **3 million joules** of stored energy. All of it converts to kinetic energy (and then thermal energy via air resistance) during the fall.",
  },

  {
    id: uid(), type: "question",
    questionType: "short_answer",
    prompt: "A hydroelectric dam works by converting GPE of water into electricity. If 1,000 kg of water falls 100 m through a turbine, how much GPE does it release? If the turbine is 90% efficient, how many joules of electricity does it produce? (Hint: 90% of the GPE becomes electrical energy.)",
    difficulty: "analyze",
  },

  // ─── CONNECTING GPE TO KE ──────────────────────────────────

  {
    id: uid(), type: "section_header",
    icon: "🔄",
    title: "GPE ↔ KE: The Energy Trade",
    subtitle: "~5 minutes",
  },

  {
    id: uid(), type: "text",
    content: "You've seen this in bar charts: when an object falls, GPE decreases and KE increases. Now you can put **numbers** on it.\n\nIf no energy is lost to friction:\n\n**GPE lost = KE gained**\n\nmgh = ½mv²\n\nNotice that **mass cancels out**:\n\ngh = ½v²\n\nv = √(2gh)\n\nThis means the speed an object reaches when falling depends ONLY on the height it fell from — not its mass. A bowling ball and a tennis ball dropped from the same height hit the ground at the same speed (ignoring air resistance).\n\nGalileo figured this out 400 years ago by rolling balls down ramps. You just proved it with algebra.",
  },

  {
    id: uid(), type: "calculator",
    title: "Speed from Height (No Friction)",
    description: "If an object falls from rest with no friction, all GPE converts to KE. What speed does it reach?\n\nv = √(2 × g × h)",
    formula: "Math.sqrt(2 * 9.8 * height)",
    showFormula: true,
    inputs: [
      { name: "height", label: "Height fallen", unit: "m" },
    ],
    output: { label: "Speed at bottom", unit: "m/s", decimals: 2 },
  },

  {
    id: "q-speed", type: "question",
    questionType: "multiple_choice",
    prompt: "A roller coaster starts from rest at the top of a 50 m hill. Ignoring friction, approximately how fast is it going at the bottom?",
    difficulty: "apply",
    options: [
      "About 10 m/s (22 mph)",
      "About 22 m/s (49 mph)",
      "About 31 m/s (70 mph)",
      "About 50 m/s (112 mph)",
    ],
    correctIndex: 2,
    explanation: "v = √(2gh) = √(2 × 9.8 × 50) = √(980) ≈ 31.3 m/s ≈ 70 mph. That's a realistic speed for a major roller coaster. And notice — we didn't need to know the coaster's mass!",
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
    prompt: "A 2 kg book is on a shelf 3 meters above the floor. What is its gravitational potential energy relative to the floor? (g = 9.8 m/s²)",
    difficulty: "apply",
    options: [
      "6 J",
      "29.4 J",
      "58.8 J",
      "19.6 J",
    ],
    correctIndex: 2,
    explanation: "GPE = mgh = 2 × 9.8 × 3 = 58.8 J. Straightforward plug-and-chug — make sure your units are kg, m/s², and m.",
  },

  {
    id: "q-check2", type: "question",
    questionType: "multiple_choice",
    prompt: "Two rocks are on a cliff. Rock A is 10 kg at 5 m high. Rock B is 5 kg at 10 m high. Which has more GPE?",
    difficulty: "analyze",
    options: [
      "Rock A — it's heavier",
      "Rock B — it's higher",
      "They have the same GPE",
      "Can't tell without knowing g",
    ],
    correctIndex: 2,
    explanation: "Rock A: GPE = 10 × 9.8 × 5 = 490 J. Rock B: GPE = 5 × 9.8 × 10 = 490 J. Equal! When mass × height is the same, GPE is the same. This is the proportional relationship in action.",
  },

  {
    id: "q-check3", type: "question",
    questionType: "multiple_choice",
    prompt: "An object has 1,000 J of GPE. If you triple its height (keeping mass the same), what is its new GPE?",
    difficulty: "understand",
    options: [
      "1,000 J — height doesn't matter",
      "3,000 J — GPE triples when height triples",
      "9,000 J — GPE increases with height squared",
      "333 J — GPE decreases when height increases",
    ],
    correctIndex: 1,
    explanation: "GPE = mgh. Since m and g stay the same, GPE is directly proportional to h. Triple h → triple GPE. No squares, no tricks — it's linear.",
  },

  {
    id: "q-check4", type: "question",
    questionType: "short_answer",
    prompt: "A 0.5 kg ball is dropped from a 20 m building. Calculate: (a) its GPE at the top, (b) its KE just before hitting the ground (assume no air resistance), and (c) its speed just before impact using v = √(2gh). Show all work.",
    difficulty: "apply",
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
    content: "**One equation, three variables:**\n\n**GPE = mgh**\n\n- More mass → more GPE\n- More height → more GPE\n- Stronger gravity → more GPE\n- All proportional — double any one, GPE doubles\n\nThis is the energy that roller coasters, waterfalls, and falling objects all run on. And when GPE converts to KE, the mass cancels — everything falls at the same speed from the same height (in a vacuum).\n\nNext class, you'll learn what happens when you DO work on a system — how force × distance connects to the energy changes you've been charting.",
  },

  {
    id: uid(), type: "callout",
    icon: "❓", style: "question",
    content: "**Return to the Question of the Day:**\n\n- Bowling ball (~6 kg) at 10 m: GPE = 6 × 9.8 × 10 = **588 J**\n- Tennis ball (~0.058 kg) at 10 m: GPE = 0.058 × 9.8 × 10 = **5.7 J**\n\nThe bowling ball has about **103× more GPE** than the tennis ball. Same height — mass is the difference. That's why getting hit by one of these is considerably worse than the other.",
  },

  {
    id: uid(), type: "question",
    questionType: "linked",
    prompt: "Look back at your warm-up answer about where the energy came from when Mr. McCarthy lifted the ball. Now explain it using the equation: what specifically changed in GPE = mgh to give the ball more energy?",
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
      { term: "Gravitational Potential Energy (GPE)", definition: "Energy stored in an object due to its height above a reference point. GPE = mgh. Measured in joules (J)." },
      { term: "Mass (m)", definition: "The amount of matter in an object, measured in kilograms (kg). More mass = more GPE at the same height." },
      { term: "Acceleration due to gravity (g)", definition: "The rate at which gravity accelerates objects near Earth's surface: 9.8 m/s². Different on other planets (Moon: 1.6 m/s², Jupiter: 24.8 m/s²)." },
      { term: "Height (h)", definition: "The vertical distance above the reference point, measured in meters (m). Always measure vertically — not along a ramp or slope." },
      { term: "Reference Point", definition: "The position where GPE = 0. Usually the ground or floor. You choose it, but stay consistent within a problem." },
      { term: "Joule (J)", definition: "The SI unit of energy. 1 J = 1 kg × 1 m/s² × 1 m. A 1 kg object lifted 1 meter gains 9.8 J of GPE." },
    ],
  },
];

// ─── Main ──────────────────────────────────────────────────

async function main() {
  const lessonRef = db
    .collection("courses")
    .doc(COURSE_ID)
    .collection("lessons")
    .doc("gravitational-potential-energy");

  const data = {
    title: "Gravitational Potential Energy",
    questionOfTheDay: "You're standing on the roof of the school holding a bowling ball and a tennis ball at the same height. Which one has more gravitational potential energy — and how much more?",
    course: "Physics",
    unit: "Energy",
    order: 5,
    visible: false,
    blocks,
    updatedAt: new Date(),
  };

  await lessonRef.set(data);
  console.log(`✅ Lesson seeded successfully!`);
  console.log(`   Title: "${data.title}"`);
  console.log(`   Path:  courses/${COURSE_ID}/lessons/gravitational-potential-energy`);
  console.log(`   Blocks: ${blocks.length}`);
  console.log(`   Order:  ${data.order}`);
  console.log(`\n   View at: https://pantherlearn.web.app/course/${COURSE_ID}/lesson/gravitational-potential-energy`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
