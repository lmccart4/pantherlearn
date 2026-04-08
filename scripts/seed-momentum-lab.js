// seed-momentum-lab.js
// Creates the "Testing Experiment: Momentum Conservation" lesson
// in the Physics course with 33 interactive blocks.
//
// Run: node scripts/seed-momentum-lab.js
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
  // ─── INTRODUCTION ────────────────────────────────────────

  // Block 1: Title
  {
    id: "header-intro", type: "section_header",
    icon: "🔬",
    title: "Testing Experiment: Momentum Conservation",
    subtitle: "Is momentum (m × v) a conserved quantity of motion?",
  },

  // Block 2: Learning Objectives
  {
    id: "objectives", type: "objectives",
    title: "Learning Objectives",
    items: [
      "Identify an isolated system for momentum in a marble-cart collision",
      "Select initial and final states and sketch both states",
      "Draw a momentum bar chart tracking momentum before and after collision",
      "Use p = m × v to predict the cart velocity after collision",
      "Compare predicted and measured values to evaluate conservation of momentum",
      "Write a CER (Claim-Evidence-Reasoning) conclusion",
    ],
  },

  // Block 3: Abstract
  {
    id: "callout-abstract", type: "callout",
    icon: "📄", style: "insight",
    content: "**Abstract:** We test whether momentum is conserved by predicting the outcome of a new experiment. We chose **m × v** as our best candidate for the \"conserved quantity of motion.\" We previously disproved **m × s** when two carts collided and stopped — m × s was destroyed while m × v was not. Now we design an experiment where we **predict** the result using conservation of momentum, then **measure** to see if reality matches.",
  },

  // Block 4: Divider
  { id: "divider-1", type: "divider" },

  // Block 5: Materials & Method Header
  {
    id: "header-materials", type: "section_header",
    icon: "🧰",
    title: "Materials & Method",
    subtitle: "How we will run the experiment",
  },

  // Block 6: Setup Description
  {
    id: "text-setup", type: "text",
    content: "We use a **marble launcher** to fire a metal marble into a **cart with clay** sitting on a rail. The marble sticks in the clay (a **perfectly inelastic collision**), transferring its momentum to the cart. The combined marble+cart system then moves along the rail.\n\nWe will **predict** the cart's velocity using conservation of momentum, then **measure** it with a motion detector to compare.",
  },

  // Block 7: Tools & Assumptions
  {
    id: "text-tools", type: "text",
    content: "**Tools:**\n- Platform scale (to measure masses)\n- Launcher with known muzzle velocity (to determine v_marble)\n- Motion detector (to measure v_cart after collision)\n\n**Assumptions:**\n1. Air exerts **zero force** on the marble during its flight\n2. Earth is **not exchanging momentum** with any object during the collision process",
  },

  // Block 8: Divider
  { id: "divider-2", type: "divider" },

  // ─── PHASE 1: PREDICTION ─────────────────────────────────

  // Block 9: Prediction Header
  {
    id: "header-prediction", type: "section_header",
    icon: "🎯",
    title: "Phase 1: Prediction",
    subtitle: "Use momentum conservation to predict the outcome before experimenting",
  },

  // Block 10: Task 1 - Isolated System
  {
    id: "activity-isolated-system", type: "activity",
    icon: "📦",
    title: "Task 1: Identify the Isolated System",
    instructions: "An **isolated system** for momentum is one where no external force transfers momentum in or out. Using the two assumptions above (air exerts zero force, Earth not exchanging momentum), identify a **small** isolated system for this collision.\n\n**You must:**\n1. List everything included in your isolated system\n2. Defend why the system boundary makes sense given the assumptions",
  },

  // Block 11: Written Response - Isolated System
  {
    id: "q-isolated-system", type: "question",
    questionType: "short_answer",
    prompt: "Identify a small Isolated System for momentum during the marble-cart collision. List everything in the system and defend your selection using the two assumptions provided above.",
    difficulty: "analyze",
  },

  // Block 12: Task 2 - Sketch States
  {
    id: "activity-sketch-states", type: "activity",
    icon: "✏️",
    title: "Task 2: Sketch Initial and Final States",
    instructions: "Choose the **initial state** and **final state** for this process:\n\n- **Initial state:** The moment just before the marble enters the clay\n- **Final state:** The moment just after the marble is embedded and the cart+marble system moves together\n\nSketch **both states** below. Show all objects in your isolated system, label masses and velocities, and indicate the direction of motion with arrows.",
  },

  // Block 13: Sketch - Initial State
  {
    id: "sketch-initial", type: "sketch",
    title: "Initial State Sketch",
    instructions: "Draw the initial state: marble moving toward the stationary cart. Label the marble (mass m_marble, velocity v_marble) and the cart with clay (mass m_cart, velocity = 0). Show the direction of motion with an arrow.",
    canvasHeight: 350,
  },

  // Block 14: Sketch - Final State
  {
    id: "sketch-final", type: "sketch",
    title: "Final State Sketch",
    instructions: "Draw the final state: marble embedded in the clay, cart+marble system moving together. Label the combined mass (m_marble + m_cart) and the unknown velocity v_cart. Show the direction of motion.",
    canvasHeight: 350,
  },

  // Block 15: Task 3 - Bar Chart Instructions
  {
    id: "activity-bar-chart", type: "activity",
    icon: "📊",
    title: "Task 3: Momentum Bar Chart",
    instructions: "Draw a **momentum bar chart** tracking the momentum stored in your isolated system.\n\n**Initial State (green):** Create bars for P_marble and P_cart\n**Delta column (blue):** Should represent the net change in momentum (zero for an isolated system)\n**Final State (red):** Create bars for P_marble+cart (combined)\n\n- Bars above the axis = positive momentum (moving right)\n- Bars below the axis = negative momentum (moving left)\n- Click the **+ label** button to add a label to each bar (e.g., label: \"P\", subscript: \"marble\")\n- **Drag bars** up or down to set their relative heights\n- **Ctrl/Cmd+click** a bar to type an exact value",
  },

  // Block 16: Bar Chart (Interactive)
  {
    id: "bar-chart-momentum", type: "bar_chart",
    title: "Momentum Bar Chart",
    barCount: 2,
    initialLabel: "Initial State",
    finalLabel: "Final State",
  },

  // Block 17: Bar Chart Hint
  {
    id: "callout-bar-chart-hint", type: "callout",
    icon: "💡", style: "insight",
    content: "**Think about it:** In the initial state, only the marble has momentum (the cart is at rest, so P_cart = 0). In the final state, the marble and cart move as one combined object. Since the system is isolated, the **total momentum must be the same** in both states. Does your bar chart reflect this?",
  },

  // Block 18: Divider
  { id: "divider-3", type: "divider" },

  // ─── DATA & CALCULATION ──────────────────────────────────

  // Block 19: Data Header
  {
    id: "header-data", type: "section_header",
    icon: "🔢",
    title: "Task 4: Data & Prediction Calculation",
    subtitle: "Record your measurements and predict v_cart",
  },

  // Block 20: Measurement Checklist
  {
    id: "checklist-measurements", type: "checklist",
    title: "Measurement Steps",
    items: [
      "Measure the mass of the metal marble using the platform scale (kg)",
      "Measure the mass of the cart with clay using the platform scale (kg)",
      "Record the muzzle velocity of your launcher (m/s) — this is v_marble",
    ],
  },

  // Block 21: Calculator - Predict v_cart
  {
    id: "calc-predict-vcart", type: "calculator",
    title: "Predict v_cart Using Conservation of Momentum",
    description: "Enter your measured values. This calculator uses conservation of momentum:\n\nP_initial = P_final\nm_marble × v_marble = (m_marble + m_cart) × v_cart\n\nSolving for v_cart:",
    formula: "(m_marble * v_marble) / (m_marble + m_cart)",
    showFormula: true,
    inputs: [
      { name: "m_marble", label: "Mass of marble", unit: "kg" },
      { name: "m_cart", label: "Mass of cart + clay", unit: "kg" },
      { name: "v_marble", label: "Muzzle velocity (v_marble)", unit: "m/s" },
    ],
    output: { label: "Predicted v_cart", unit: "m/s", decimals: 4 },
  },

  // Block 22: Show Your Work
  {
    id: "q-show-work", type: "question",
    questionType: "short_answer",
    prompt: "Show your prediction work step by step. Write out the equation P_initial = P_final, substitute your measured values, and solve for v_cart. Does the calculator result match your hand calculation?",
    difficulty: "apply",
  },

  // Block 23: Divider
  { id: "divider-4", type: "divider" },

  // ─── PHASE 2: EXPERIMENT ─────────────────────────────────

  // Block 24: Experiment Header
  {
    id: "header-experiment", type: "section_header",
    icon: "🧪",
    title: "Phase 2: Experiment",
    subtitle: "Perform the collision and measure v_cart",
  },

  // Block 25: Experimental Procedure
  {
    id: "activity-experiment", type: "activity",
    icon: "🧪",
    title: "Perform the Testing Experiment",
    instructions: "1. Set up the marble launcher aimed at the cart with clay on the rail\n2. Position the motion detector behind the cart (facing the direction it will move)\n3. Start the motion detector recording\n4. Fire the marble into the clay\n5. Record the **measured v_cart** from the motion detector\n6. Repeat for additional trials if time allows",
  },

  // Block 26: Evidence Upload
  {
    id: "evidence-upload", type: "evidence_upload",
    icon: "📷",
    title: "Upload Lab Evidence",
    instructions: "Take photos of your experimental setup: the launcher, cart with clay, motion detector, and the velocity reading on the motion detector screen after a trial.",
    reflectionPrompt: "Describe your experimental setup and any observations during the collision. Did the marble fully embed in the clay? Did the cart move in a straight line?",
  },

  // Block 27: Data Table (Momentum Preset)
  {
    id: "data-table-momentum", type: "data_table",
    preset: "momentum",
    title: "Experimental Momentum Data",
    trials: 1,
    labelA: "Marble",
    labelB: "Cart + Clay",
  },

  // Block 28: Divider
  { id: "divider-5", type: "divider" },

  // ─── PHASE 3: ANALYSIS & CONCLUSION ──────────────────────

  // Block 29: Conclusion Header
  {
    id: "header-analysis", type: "section_header",
    icon: "📋",
    title: "Phase 3: Analysis & Conclusion",
    subtitle: "Compare prediction with measurement and write your CER",
  },

  // Block 30: Compare Predicted vs Measured
  {
    id: "q-compare-values", type: "question",
    questionType: "short_answer",
    prompt: "Compare your **predicted v_cart** (from the calculator) with your **measured v_cart** (from the motion detector). How close were they? Calculate the percent difference:\n\n% difference = |predicted − measured| / predicted × 100%",
    difficulty: "evaluate",
  },

  // Block 31: Multiple Choice - Reinforce or Disprove
  {
    id: "q-reinforce-disprove", type: "question",
    questionType: "multiple_choice",
    prompt: "Based on your comparison of predicted and measured v_cart values, did this experiment reinforce or disprove the idea that momentum (m × v) is conserved?",
    difficulty: "evaluate",
    options: [
      "Reinforced — predicted and measured values were reasonably close",
      "Disproved — predicted and measured values were very different",
      "Inconclusive — cannot determine from this data",
    ],
    correctIndex: 0,
    explanation: "If the predicted and measured values are reasonably close (typically within 10-15%), this reinforces conservation of momentum. Small differences are expected due to friction, air resistance, measurement error, and incomplete embedding of the marble.",
  },

  // Block 32: CER Framework
  {
    id: "callout-cer", type: "callout",
    icon: "✍️", style: "insight",
    content: "**Write a CER** answering: *Did you reinforce or disprove the crazy idea that momentum is a conserved quantity of motion?*\n\n**C**laim: State whether the experiment reinforced or disproved momentum conservation\n**E**vidence: Cite specific data — your predicted v_cart, measured v_cart, the masses, and the percent difference\n**R**easoning: Explain **why** the comparison of predicted and measured values supports your claim. Reference the assumptions and any sources of error.",
  },

  // Block 33: CER Written Response
  {
    id: "q-cer-conclusion", type: "question",
    questionType: "short_answer",
    prompt: "Write your CER conclusion. Address whether momentum was conserved, cite your specific numerical evidence (predicted v_cart, measured v_cart, percent difference), and explain your reasoning. Consider the assumptions and potential sources of error.",
    difficulty: "create",
  },
];

// ─── Main ───────────────────────────────────────────────────

async function main() {
  const lessonId = "momentum-conservation-lab";

  // Count existing lessons to set order
  const lessonsSnap = await db.collection("courses").doc(COURSE_ID).collection("lessons").get();
  const order = lessonsSnap.size;

  const data = {
    title: "Testing Experiment: Momentum Conservation",
    unit: "Momentum",
    dueDate: null,
    visible: false,
    blocks,
    order,
    updatedAt: new Date(),
  };

  await safeLessonWrite(db, COURSE_ID, lessonId, data);
  console.log(`✅ Lesson created: courses/${COURSE_ID}/lessons/${lessonId}`);
  console.log(`   Title: "${data.title}"`);
  console.log(`   Blocks: ${blocks.length}`);
  console.log(`   Order: ${order}`);
  console.log(`\n   View at: https://pantherlearn.web.app/course/${COURSE_ID}/lesson/${lessonId}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
