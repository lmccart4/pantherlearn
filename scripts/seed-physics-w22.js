// seed-physics-w22.js
// Creates the Physics course + Week 22 momentum lessons
// Run: node seed-physics-w22.js
//
// Lesson 1: Slides 1-6 (Disproving m·s, discovering momentum)
// Lesson 2: Slides 7-10 (Momentum transfers, conservation)
// Lesson 3: Slides 11-15 (Car/truck crash investigation)
// Lesson 4: Testing Experiment — Momentum Conservation (lab)

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAlxvGxLIBUrVO3WWmEcslFpSygeYVeHpY",
  authDomain: "pantherlearn-d6f7c.firebaseapp.com",
  projectId: "pantherlearn-d6f7c",
  storageBucket: "pantherlearn-d6f7c.firebasestorage.app",
  messagingSenderId: "293205883325",
  appId: "1:293205883325:web:c0c21ece0b4fc26f673ad4",
  measurementId: "G-5Y6BKF09HF"
};

const MY_TEACHER_UID = "M2sNE8iH1aZ57L8z8Snp1Sj8cFD2";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

const course = {
  title: "Physics",
  description: "College Prep Physics — Motion, Forces, Energy & Momentum",
  icon: "⚡",
  order: 2,
  ownerUid: MY_TEACHER_UID,
  sections: {
    "period-1": { name: "Period 1", enrollCode: `PHYS-${generateCode()}` }
  }
};

// ═══════════════════════════════════════════════════════════════
// LESSON 1: Disproving a Crazy Idea (Slides 1–6, Tasks 1-6)
// ═══════════════════════════════════════════════════════════════

const lesson1 = {
  title: "Disproving a Crazy Idea",
  course: "Physics",
  unit: "Week 22: Momentum",
  unitOrder: 22,
  order: 0,
  blocks: [
    { id: "L1-header", type: "section_header", title: "A Powerful Testing Experiment", subtitle: "Observing and analyzing a process which breaks one of our crazy ideas", icon: "🔬" },
    { id: "L1-objectives", type: "objectives", title: "Learning Objectives", items: [
      "Analyze a velocity vs. time graph for a two-cart collision",
      "Determine which direction the motion detectors call positive",
      "Calculate the total m·s and m·v stored in a system before and after a collision",
      "Determine which crazy idea (CQM = m·v or CQM = m·s) this process disproves"
    ]},
    { id: "L1-context", type: "callout", icon: "💡", style: "insight", content: "**Recall:** We have two \"crazy ideas\" for what the Conserved Quantity of Motion (CQM) might be:\n\n• **CQM = m · v** (mass × velocity)\n• **CQM = m · s** (mass × speed)\n\nToday we're going to observe a collision that will help us figure out which one — if either — is actually conserved." },

    // TASK 1
    { id: "L1-t1-header", type: "section_header", title: "Task 1: Open the Data", subtitle: "Loading the collision data in Graphical Analysis", icon: "📊" },
    { id: "L1-t1-activity", type: "activity", icon: "💻", title: "Load the Collision Data", instructions: "1. Go to our **Google Classroom**\n2. In the **current week** section of the **classwork** tab, find *Two Carts Crash to Zero.gambl*\n3. **Download** the file, then **open** it using **Vernier Graphical Analysis** at [graphicalanalysis.app](https://graphicalanalysis.app)\n\nYou should see a Vvt graph with two colored lines — one for each cart." },
    { id: "L1-t1-text", type: "text", content: "Two carts on a rail are pushed toward each other. They collide and both come to a stop. Motion detectors on each end tracked both carts' velocity throughout the process.\n\nThe **blue line** shows the **silver cart's** velocity, and the **red line** shows the **red cart's** velocity." },

    // TASK 2
    { id: "L1-t2-header", type: "section_header", title: "Task 2: Positive Direction", subtitle: "Understanding the coordinate system", icon: "➡️" },
    { id: "L1-t2-text", type: "text", content: "The **silver cart** (blue line) has a **positive** velocity before the collision — it's moving in the direction the detectors call positive. The **red cart** (red line) has a **negative** velocity — it's moving the opposite way.\n\nUsing the video of the experiment alongside the graph, figure out which physical direction corresponds to positive velocity." },
    { id: "L1-t2-q", type: "question", questionType: "short_answer", prompt: "Which direction are the motion detectors calling the **positive direction**? Explain how you determined this using the graph and the video.", placeholder: "The positive direction is... because on the graph the silver cart..." },

    // TASK 3
    { id: "L1-t3-header", type: "section_header", title: "Task 3: Reading Velocities", subtitle: "Extracting data from the Vvt graph", icon: "📏" },
    { id: "L1-t3-activity", type: "activity", icon: "📈", title: "Determine Cart Velocities", instructions: "Use the Vvt graph to find the velocity of each cart **before** and **after** the collision.\n\n• Look at the flat (constant) portions of each line\n• Pay attention to the **sign**\n• Use the cursor/selection tool for exact values" },
    { id: "L1-t3-q1", type: "question", questionType: "short_answer", prompt: "Velocity of the **silver cart BEFORE** the collision (include sign and units):", placeholder: "e.g., +1.5 m/s" },
    { id: "L1-t3-q2", type: "question", questionType: "short_answer", prompt: "Velocity of the **red cart BEFORE** the collision (include sign and units):", placeholder: "e.g., -1.5 m/s" },
    { id: "L1-t3-q3", type: "question", questionType: "short_answer", prompt: "Velocity of the **silver cart AFTER** the collision (include sign and units):", placeholder: "e.g., 0 m/s" },
    { id: "L1-t3-q4", type: "question", questionType: "short_answer", prompt: "Velocity of the **red cart AFTER** the collision (include sign and units):", placeholder: "e.g., 0 m/s" },
    { id: "L1-t3-callout", type: "callout", icon: "🔑", style: "key-idea", content: "**Key Observation:** Both carts come to a complete stop after the collision. This special case is exactly what we need to test our crazy ideas." },

    // TASK 4
    { id: "L1-t4-header", type: "section_header", title: "Task 4: Calculate m · s", subtitle: "Testing the speed-based crazy idea", icon: "🧮" },
    { id: "L1-t4-text", type: "text", content: "The **system** is: silver cart, red cart, rail, and Earth. Both carts have a measured mass of **0.5 kg** each.\n\n**Speed** is the magnitude (absolute value) of velocity — always positive." },
    { id: "L1-t4-activity", type: "activity", icon: "🧮", title: "Calculate Total m · s", instructions: "**Initial State (before collision):**\n• m·s of silver cart = 0.5 kg × |v_silver|\n• m·s of red cart = 0.5 kg × |v_red|\n• Total = sum\n\n**Final State (after collision):**\n• Both stopped → speed = 0\n• Total = ?" },
    { id: "L1-t4-q1", type: "question", questionType: "short_answer", prompt: "**Total m · s** during the **initial state** (include units):", placeholder: "e.g., 1.5 kg·m/s" },
    { id: "L1-t4-q2", type: "question", questionType: "short_answer", prompt: "**Total m · s** during the **final state** (include units):", placeholder: "e.g., 0 kg·m/s" },

    // TASK 5
    { id: "L1-t5-header", type: "section_header", title: "Task 5: Calculate m · v", subtitle: "Testing the velocity-based crazy idea", icon: "🧮" },
    { id: "L1-t5-text", type: "text", content: "Now test the other idea. **Velocity** includes direction (sign), so m·v values for carts moving in opposite directions will have **opposite signs**." },
    { id: "L1-t5-activity", type: "activity", icon: "🧮", title: "Calculate Total m · v", instructions: "**Initial State:**\n• m·v of silver cart = 0.5 kg × v_silver (keep the sign!)\n• m·v of red cart = 0.5 kg × v_red (keep the sign!)\n• Total = sum\n\n**Final State:**\n• Both stopped → velocity = 0\n• Total = ?" },
    { id: "L1-t5-q1", type: "question", questionType: "short_answer", prompt: "**Total m · v** during the **initial state** (include sign and units):", placeholder: "e.g., 0 kg·m/s" },
    { id: "L1-t5-q2", type: "question", questionType: "short_answer", prompt: "**Total m · v** during the **final state** (include sign and units):", placeholder: "e.g., 0 kg·m/s" },

    // TASK 6
    { id: "L1-t6-header", type: "section_header", title: "Task 6: The Verdict", subtitle: "Which crazy idea survives?", icon: "⚡" },
    { id: "L1-t6-text", type: "text", content: "For a quantity to be **conserved**, the total in an isolated system must stay the **same** before and after a process." },
    { id: "L1-t6-hint", type: "callout", icon: "💡", style: "hint", content: "**Hint:** Either m·v or m·s is being destroyed in our isolated system during this process. Which one?" },
    { id: "L1-t6-q1", type: "question", questionType: "multiple_choice", prompt: "Which crazy idea does this collision **disprove**?", options: [
      "CQM = m · v — because m·v changed during the process",
      "CQM = m · s — because m·s changed during the process",
      "Both are disproved — both quantities changed",
      "Neither is disproved — both stayed the same"
    ], correctIndex: 1, explanation: "The total m·s went from a positive value to zero — it was destroyed! m·s is NOT conserved. Meanwhile, m·v was zero before AND zero after — m·v is conserved." },
    { id: "L1-t6-q2", type: "question", questionType: "short_answer", prompt: "Explain in your own words why this collision disproves one crazy idea and reinforces the other. Use specific numbers.", placeholder: "The total m·s before was... but after it was 0, meaning m·s was destroyed. Meanwhile m·v was..." },
    { id: "L1-def", type: "definition", term: "Momentum (P)", definition: "The quantity m · v = P is called **momentum**. Momentum is a conserved quantity of motion — it can neither be created nor destroyed. It transfers between systems by exerting a force." }
  ]
};

// ═══════════════════════════════════════════════════════════════
// LESSON 2: Momentum Transfers (Slides 7–10, Tasks 7-10)
// ═══════════════════════════════════════════════════════════════

const lesson2 = {
  title: "Momentum Transfers",
  course: "Physics",
  unit: "Week 22: Momentum",
  unitOrder: 22,
  order: 1,
  blocks: [
    { id: "L2-header", type: "section_header", title: "Momentum Is Conserved", subtitle: "Understanding how momentum moves between systems", icon: "🔄" },
    { id: "L2-objectives", type: "objectives", title: "Learning Objectives", items: [
      "Explain how momentum can change within a system without being created or destroyed",
      "Identify the source of momentum when an object starts moving",
      "Apply conservation of momentum to everyday situations"
    ]},
    { id: "L2-big-idea", type: "callout", icon: "⚡", style: "key-idea", content: "**Big Idea:** There exists a quantity (m·v) that describes motion and is conserved in the universe. Like mass, if we see a Δ(m·v) in a system, then either:\n\n1. The m·v **left** the system → entered an outside system, OR\n2. The m·v **entered** the system from an outside system\n\nIn an **isolated system**, the total momentum stays constant." },
    { id: "L2-def", type: "definition", term: "m · v = P (Momentum)", definition: "Momentum is a **quantity of motion** that is **conserved**. It can neither be created nor destroyed. It transfers into systems by exerting a **force**." },

    // TASKS 7 & 8
    { id: "L2-hand-header", type: "section_header", title: "Tasks 7 & 8: The Hand Process", subtitle: "Exploring momentum changes with your own hand", icon: "✋" },
    { id: "L2-hand-activity", type: "activity", icon: "✋", title: "The Hand Process", instructions: "**Process:** Hold your hand out so that it is **still**. Afterwards, move your hand to the **left or right**.\n\n1. Perform this process\n2. **Initial state:** hand is still\n3. **Final state:** hand is moving\n4. **Sketch** both states on your whiteboard — focus on the motion of your hand" },
    { id: "L2-t8-q", type: "question", questionType: "short_answer", prompt: "Is there evidence of a **Δ(m·v)** in the hand during this process? Explain.", placeholder: "Yes/No, because the hand went from... to..." },
    { id: "L2-t8-followup", type: "callout", icon: "🤔", style: "question", content: "**Think about it:** Your hand went from v = 0 to v ≠ 0. The mass didn't change, so the momentum clearly **changed**. But momentum can't be created... so where did it come from?" },

    // TASK 9
    { id: "L2-t9-header", type: "section_header", title: "Task 9: Explain the Change", subtitle: "Where did the momentum come from?", icon: "🔍" },
    { id: "L2-t9-q", type: "question", questionType: "short_answer", prompt: "Since momentum cannot be created or destroyed, explain how the momentum of the hand **changed**.", placeholder: "The momentum of the hand changed because..." },

    // TASK 10
    { id: "L2-t10-header", type: "section_header", title: "Task 10: Conservation in the Universe", subtitle: "The full picture", icon: "🌍" },
    { id: "L2-t10-hint", type: "callout", icon: "💡", style: "hint", content: "**Hint:** The hand is doing a similar motion to the red cart in an explosion process. In that process, no new momentum is created — the silver cart gains equal **negative** momentum as the red cart gains in **positive** momentum. Total system momentum stays **zero**.\n\nWhat is the \"silver cart\" for the hand?" },
    { id: "L2-t10-q1", type: "question", questionType: "short_answer", prompt: "Explain how momentum is still **conserved in the universe** during the hand process, even though it appears new momentum is created inside the hand.", placeholder: "Momentum is conserved because while the hand gains momentum in one direction, the..." },
    { id: "L2-t10-q2", type: "question", questionType: "multiple_choice", prompt: "When you push your hand to the right, what happens to the Earth?", options: [
      "The Earth gains an equal amount of momentum to the left",
      "The Earth doesn't move — new momentum is created",
      "The Earth gains momentum to the right as well",
      "Momentum is destroyed in this process"
    ], correctIndex: 0, explanation: "Just like a cart explosion, when your hand gains momentum rightward, the Earth gains equal momentum leftward. Total stays zero. We don't notice the Earth's motion because its mass is so enormous that the velocity is immeasurably tiny." }
  ]
};

// ═══════════════════════════════════════════════════════════════
// LESSON 3: Crash Investigation (Slides 11–15, Tasks 11-14)
// ═══════════════════════════════════════════════════════════════

const lesson3 = {
  title: "Crash Investigation",
  course: "Physics",
  unit: "Week 22: Momentum",
  unitOrder: 22,
  order: 2,
  blocks: [
    { id: "L3-header", type: "section_header", title: "Special Crash Investigation", subtitle: "Using momentum conservation to analyze a highway collision", icon: "🚗" },
    { id: "L3-objectives", type: "objectives", title: "Learning Objectives", items: [
      "Identify an isolated system for momentum during a collision",
      "Understand that you cannot compare momentum without knowing both mass AND velocity",
      "Calculate and compare momentum of objects in a real-world crash scenario"
    ]},
    { id: "L3-scenario", type: "callout", icon: "🚨", style: "scenario", content: "**Scenario:** Your group is part of the **Special Crash Investigations (SCI)** department. You're investigating a head-on collision between a **car** and a **truck** on a highway.\n\nThe **car** had a dash camera measuring its velocity. The **truck** did not.\n\nThe truck driver claims they were below the **30 m/s** speed limit. Your job: determine if that's true." },
    { id: "L3-given", type: "text", content: "**Known Information:**\n• m_car = **1,200 kg**, m_truck = **36,000 kg**\n• **Initial:** v_car = 30 m/s to the right, v_truck = ? to the left\n• **Final:** v_car = 27 m/s to the left, v_truck = ? to the left\n• Speed limit = 30 m/s" },

    // TASK 11
    { id: "L3-t11-header", type: "section_header", title: "Task 11: Isolated System", subtitle: "Defining the system boundaries", icon: "📦" },
    { id: "L3-t11-text", type: "text", content: "Before using conservation of momentum, we need an **isolated system** — where the net external force is zero. Assume **air** exerts little to no force during the collision." },
    { id: "L3-t11-q", type: "question", questionType: "short_answer", prompt: "What would be an **isolated system for momentum** during this collision? List everything in the system and explain why it's isolated.", placeholder: "The isolated system includes..." },

    // TASK 12
    { id: "L3-t12-header", type: "section_header", title: "Task 12: Comparing Momentum", subtitle: "Can you tell which has more just by looking?", icon: "⚖️" },
    { id: "L3-t12-text", type: "text", content: "Imagine the car moving right and the truck moving left. You can see both are in motion but don't know their exact velocities." },
    { id: "L3-t12-q", type: "question", questionType: "multiple_choice", prompt: "Without knowing exact velocities, which statement best compares the momentum of the car vs. the truck?", options: [
      "The car must have more momentum because it has a positive velocity and the truck has negative.",
      "The car must have more momentum because its velocity is faster than the truck's.",
      "It is impossible to tell which has more momentum without knowing their exact velocities.",
      "The truck must have more momentum because its mass is greater than the car's mass."
    ], correctIndex: 2, explanation: "Momentum depends on BOTH mass AND velocity. Without knowing exact velocities, you can't compare — even though the truck is 30× more massive, it could be barely moving." },

    // TASK 13
    { id: "L3-t13-header", type: "section_header", title: "Task 13: Measuring Momentum", subtitle: "Now we have numbers", icon: "📐" },
    { id: "L3-t13-text", type: "text", content: "Velocities are now measured: the car moves at **30 m/s to the right** and the truck at **1 m/s to the left**." },
    { id: "L3-t13-q1", type: "question", questionType: "short_answer", prompt: "Calculate **P_car** (define rightward as positive). Include units and sign.", placeholder: "P_car = 1200 × (+30) = ..." },
    { id: "L3-t13-q2", type: "question", questionType: "short_answer", prompt: "Calculate **P_truck** (define rightward as positive). Include units and sign.", placeholder: "P_truck = 36000 × (-1) = ..." },
    { id: "L3-t13-q3", type: "question", questionType: "short_answer", prompt: "Which has a greater **magnitude** of momentum? Were you surprised? Explain.", placeholder: "The... has more momentum because..." },

    // TASK 14
    { id: "L3-t14-header", type: "section_header", title: "Task 14: Re-evaluate", subtitle: "Revisiting the comparison", icon: "🔄" },
    { id: "L3-t14-q", type: "question", questionType: "short_answer", prompt: "Re-evaluate the four options from Task 12. Which one **best** compared momentum before we knew the velocities? Explain.", placeholder: "The best answer was... because momentum depends on..." },
    { id: "L3-t14-callout", type: "callout", icon: "🔑", style: "key-idea", content: "**Key Takeaway:** Even though the truck is 30× more massive, the car has more momentum because it's moving 30× faster! P = m × v, so **both** mass and velocity matter equally. You can never compare momenta without knowing exact values of both." },
    { id: "L3-vocab", type: "vocab_list", terms: [
      { term: "Momentum (P)", definition: "P = m × v. A conserved quantity of motion." },
      { term: "Isolated System", definition: "A system where ΣF_ext = 0. Momentum is constant within it." },
      { term: "Conservation of Momentum", definition: "In an isolated system, total momentum before = total momentum after." }
    ]}
  ]
};

// ═══════════════════════════════════════════════════════════════
// LESSON 4: Testing Experiment — Momentum Conservation (Lab)
// ═══════════════════════════════════════════════════════════════

const lesson4 = {
  title: "Testing Experiment: Momentum Conservation",
  course: "Physics",
  unit: "Week 22: Momentum",
  unitOrder: 22,
  order: 3,
  isLab: true,
  blocks: [
    // ABSTRACT
    { id: "L4-header", type: "section_header", title: "Testing Experiment: Momentum Conservation", subtitle: "Is momentum a conserved quantity of motion?", icon: "🔬" },
    { id: "L4-objectives", type: "objectives", title: "Learning Objectives", items: [
      "Identify an isolated system for a marble-and-cart collision",
      "Use conservation of momentum to predict the velocity of a cart after a collision",
      "Compare predicted and measured values to evaluate momentum conservation",
      "Write a CER (Claim-Evidence-Reasoning) conclusion"
    ]},
    { id: "L4-abstract", type: "callout", icon: "📄", style: "abstract", content: "**Abstract:** We test whether momentum is conserved. We decided m × v is our best candidate for the CQM based on crazy ideas A–C. We disproved m × s when two carts collided and stopped. Now we test whether m × v can accurately **predict** the outcome of a new experiment." },

    // MATERIALS & METHOD
    { id: "L4-method-header", type: "section_header", title: "Materials & Method", subtitle: "How we'll run the experiment", icon: "🧰" },
    { id: "L4-method-text", type: "text", content: "We use a **marble launcher** to fire a metal marble into a **cart with clay** on a rail. The marble sticks in the clay (perfectly inelastic collision), transferring its momentum to the cart.\n\nWe predict v_cart using conservation of momentum, then **measure** v_cart with a motion detector to compare." },
    { id: "L4-method-details", type: "text", content: "**Tools:** Platform scale (masses), launcher (muzzle velocity), motion detector (v_cart)\n\n**Assumptions:**\n1. Air exerts zero force on the marble\n2. Earth is not exchanging momentum with any object during the process" },

    // PHASE 1: PREDICTION
    { id: "L4-predict-header", type: "section_header", title: "Phase 1: Prediction", subtitle: "Use momentum conservation to predict the outcome", icon: "🎯" },
    { id: "L4-iso-q", type: "question", questionType: "short_answer", prompt: "**Identify a small Isolated System** for momentum during this process. List everything in the system and defend your selection using the assumptions above.", placeholder: "The isolated system includes... because..." },
    { id: "L4-sketch-activity", type: "activity", icon: "✏️", title: "Sketch Initial & Final States", instructions: "Draw your initial state (marble moving, cart still) and final state (marble embedded in clay, cart moving).\n\nShow: objects in your system, direction of motion, labels for velocities and masses.\n\nSketch on paper/whiteboard." },
    { id: "L4-sketch-q1", type: "question", questionType: "short_answer", prompt: "Describe your **initial state** sketch.", placeholder: "The marble is moving to the right at v_marble and the cart is at rest..." },
    { id: "L4-sketch-q2", type: "question", questionType: "short_answer", prompt: "Describe your **final state** sketch.", placeholder: "The marble is stuck in the clay and the combined system moves to the right at v_cart..." },
    { id: "L4-barchart-text", type: "text", content: "Draw a **momentum bar chart** with:\n• **Initial State:** P_marble bar and P_cart bar\n• **ΔP column** (should be zero for an isolated system)\n• **Final State:** P_marble+cart bar\n\nBars above zero = positive momentum, below zero = negative." },
    { id: "L4-barchart-q", type: "question", questionType: "short_answer", prompt: "Describe your bar chart. Which bars are positive, which are zero?", placeholder: "In the initial state, P_marble is positive and P_cart is zero..." },

    // DATA INPUT
    { id: "L4-data-header", type: "section_header", title: "Data & Calculation", subtitle: "Record measurements and predict v_cart", icon: "🔢" },
    { id: "L4-d-mass-marble", type: "question", questionType: "short_answer", prompt: "Measured **mass of the metal marble** (kg):", placeholder: "e.g., 0.028" },
    { id: "L4-d-mass-cart", type: "question", questionType: "short_answer", prompt: "Measured **mass of the cart with clay** (kg):", placeholder: "e.g., 0.350" },
    { id: "L4-d-v-marble", type: "question", questionType: "short_answer", prompt: "**Muzzle velocity** of the launcher / v_marble (m/s):", placeholder: "e.g., 5.2" },
    { id: "L4-prediction-work", type: "question", questionType: "short_answer", prompt: "**Show your prediction.** Use conservation of momentum to calculate predicted v_cart. Write each step.\n\nP_initial = P_final\nm_marble × v_marble + m_cart × 0 = (m_marble + m_cart) × v_cart", placeholder: "P_initial = ... × ... = ...\n(m_marble + m_cart) = ...\nv_cart = P_initial / (m_marble + m_cart) = ..." },
    { id: "L4-prediction-answer", type: "question", questionType: "short_answer", prompt: "Your **predicted v_cart** (include units):", placeholder: "e.g., 0.39 m/s" },

    // PHASE 2: EXPERIMENT
    { id: "L4-exp-header", type: "section_header", title: "Phase 2: Experiment", subtitle: "Perform the experiment and measure v_cart", icon: "🧪" },
    { id: "L4-exp-activity", type: "activity", icon: "🧪", title: "Perform the Testing Experiment", instructions: "1. Set up launcher aimed at cart with clay on the rail\n2. Position motion detector behind the cart\n3. Fire the marble into the clay\n4. Record **measured v_cart** from the motion detector\n5. Repeat for additional trials if time allows" },
    { id: "L4-m-v1", type: "question", questionType: "short_answer", prompt: "**Trial 1:** Measured v_cart (include units):", placeholder: "e.g., 0.37 m/s" },
    { id: "L4-m-v2", type: "question", questionType: "short_answer", prompt: "**Trial 2** (if performed, otherwise N/A):", placeholder: "e.g., 0.38 m/s" },
    { id: "L4-m-v3", type: "question", questionType: "short_answer", prompt: "**Trial 3** (if performed, otherwise N/A):", placeholder: "e.g., 0.36 m/s" },

    // PHASE 3: ANALYSIS
    { id: "L4-analysis-header", type: "section_header", title: "Phase 3: Analysis", subtitle: "Compare prediction with reality", icon: "📋" },
    { id: "L4-comparison-q", type: "question", questionType: "short_answer", prompt: "Compare your **predicted v_cart** with your **measured v_cart**. How close were they? Calculate percent difference if possible.", placeholder: "Predicted: ... Measured: ... Difference: ..." },
    { id: "L4-result-q", type: "question", questionType: "multiple_choice", prompt: "Based on your comparison, did this experiment **reinforce** or **disprove** the idea that momentum is conserved?", options: [
      "Reinforced — predicted and measured values were close",
      "Disproved — predicted and measured values were very different",
      "Inconclusive"
    ], correctIndex: 0, explanation: "If predicted and measured values are reasonably close (within experimental uncertainty), this reinforces conservation of momentum. Small differences come from friction, air resistance, and measurement limitations." },

    // CER CONCLUSION
    { id: "L4-cer-header", type: "section_header", title: "Conclusion: CER", subtitle: "Write your Claim-Evidence-Reasoning", icon: "✍️" },
    { id: "L4-cer-instructions", type: "callout", icon: "📝", style: "instructions", content: "**Write a CER** answering: *Did you reinforce or disprove the crazy idea that momentum is a conserved quantity for this process?*\n\n**C**laim: Reinforced or disproved?\n**E**vidence: Your specific data (predicted v_cart, measured v_cart, masses)\n**R**easoning: Why does the comparison support your claim?" },
    { id: "L4-cer", type: "question", questionType: "short_answer", prompt: "Write your **CER conclusion** here.", placeholder: "Claim: This experiment [reinforced/disproved] the crazy idea...\n\nEvidence: Our predicted v_cart was... and our measured v_cart was...\n\nReasoning: These values are [close/far apart] because..." },

    // REFLECTION
    { id: "L4-ref-header", type: "section_header", title: "Reflection", subtitle: "Thinking deeper", icon: "💭" },
    { id: "L4-ref-q1", type: "question", questionType: "short_answer", prompt: "If your predicted and measured values differed, what could have caused this? List at least two sources of error.", placeholder: "1. Friction...\n2. ..." },
    { id: "L4-ref-q2", type: "question", questionType: "short_answer", prompt: "How do the assumptions (#1: no air force, #2: Earth not exchanging momentum) affect the prediction? What if they weren't true?", placeholder: "If assumption #1 was not true, then..." }
  ]
};

// ═══════════════════════════════════════════════════════════════
// SEED
// ═══════════════════════════════════════════════════════════════

async function seed() {
  console.log("═══════════════════════════════════════");
  console.log("  Seeding Physics Course + W22 Lessons");
  console.log("═══════════════════════════════════════\n");

  const courseRef = doc(db, "courses", "physics");
  const existing = await getDoc(courseRef);
  if (!existing.exists()) {
    await setDoc(courseRef, course);
    console.log("✅ Created Physics course\n");
    console.log("   Section Enroll Codes:");
    for (const [id, sec] of Object.entries(course.sections)) {
      console.log(`   ${sec.name}: ${sec.enrollCode}`);
    }
    console.log("");
  } else {
    console.log("ℹ️  Physics course already exists — skipping course creation\n");
  }

  const lessons = [
    { id: "w22-disproving-crazy-idea", data: lesson1 },
    { id: "w22-momentum-transfers", data: lesson2 },
    { id: "w22-crash-investigation", data: lesson3 },
    { id: "w22-testing-experiment", data: lesson4 }
  ];

  for (const l of lessons) {
    const ref = doc(db, "courses", "physics", "lessons", l.id);
    await setDoc(ref, l.data);
    console.log(`✅ Seeded: ${l.data.title} (${l.data.blocks.length} blocks)`);
  }

  console.log(`\n✅ Done! ${lessons.length} lessons seeded to courses/physics/lessons/`);
  console.log("   Refresh your app to see the Physics course.\n");
  process.exit(0);
}

seed().catch(err => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
