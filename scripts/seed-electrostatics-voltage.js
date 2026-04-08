// seed-electrostatics-voltage.js
// Creates the "Electric Potential & Voltage" lesson in the Physics Electrostatics unit.
// Uses Firebase Admin SDK (bypasses Firestore rules).
//
// Run: node scripts/seed-electrostatics-voltage.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Electric Potential & Voltage",
  questionOfTheDay: "A battery is labeled '9V.' What does that actually mean? What is a 'volt'?",
  course: "Physics",
  unit: "Electrostatics",
  order: 4,
  visible: false,
  dueDate: null,
  blocks: [

    // ═══════════════════════════════════════════
    // WARM UP
    // ═══════════════════════════════════════════
    {
      id: "section-warmup",
      type: "section_header",
      icon: "🌅",
      title: "Warm Up",
      subtitle: "~5 minutes"
    },
    {
      id: "qotd",
      type: "callout",
      style: "question",
      icon: "❓",
      content: "**Question of the Day:** A battery is labeled '9V.' What does that actually mean? What is a 'volt'?"
    },
    {
      id: "text-warmup-connect",
      type: "text",
      content: "Think back to the Energy unit. You learned that objects at a height have **gravitational potential energy** — the formula was **GPE = mgh**. A ball on a shelf has stored energy *because of its position*.\n\nToday's big idea: **charged particles in electric fields have potential energy too** — because of their *electrical position*. And the concept that describes that electrical position? It's called **voltage**."
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "You pick up a ball and hold it above the ground. It now has gravitational PE. What gave it that energy? Now imagine pushing a positive charge toward another positive charge — what gives THAT system energy? What's similar about these two situations?",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // OBJECTIVES
    // ═══════════════════════════════════════════
    {
      id: "objectives",
      type: "objectives",
      title: "Learning Objectives",
      items: [
        "Define electric potential energy and electric potential (voltage)",
        "Calculate voltage as energy per charge (V = EPE/q)",
        "Connect voltage to energy concepts from the previous unit",
        "Explain why voltage is the 'push' that drives current (bridge to circuits)"
      ]
    },

    // ═══════════════════════════════════════════
    // SECTION 1: ELECTRIC POTENTIAL ENERGY
    // ═══════════════════════════════════════════
    {
      id: "section-epe",
      type: "section_header",
      icon: "⚡",
      title: "Electric Potential Energy",
      subtitle: "~10 minutes"
    },
    {
      id: "text-epe-intro",
      type: "text",
      content: "A charged particle sitting in an electric field has **electric potential energy (EPE)** — stored energy due to its position in the field, just like a ball on a shelf has gravitational PE due to its height.\n\nThe formula for EPE between two point charges is:\n\n> **EPE = kq₁q₂ / r**\n\nWhere:\n- **k** = 8.99 × 10⁹ N·m²/C² (same Coulomb constant)\n- **q₁, q₂** = the two charges\n- **r** = distance between them"
    },
    {
      id: "text-epe-high-low",
      type: "text",
      content: "### When is EPE High vs. Low?\n\n**Like charges close together = HIGH EPE.** Two positive charges pushed near each other are like a compressed spring — they *want* to fly apart. That \"wanting\" is stored energy.\n\n**Opposite charges close together = LOW EPE.** A positive and negative charge near each other have already \"fallen\" toward each other. Their energy is low (actually negative) because you'd have to *add* energy to pull them apart.\n\nThis is exactly like gravity:\n- Ball high up = high GPE (wants to fall)\n- Ball on the ground = low GPE (already fell)"
    },
    {
      id: "callout-analogy",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**The Hill Analogy:** Gravity PE depends on height (mgh). Electrical PE depends on electrical \"height\" — which we call **voltage**. A ball rolls downhill. A positive charge \"rolls\" from high voltage to low voltage. A battery builds an electrical hill for charges to roll down."
    },
    {
      id: "q-epe-concept",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Two positive charges are held 5 cm apart and then released. What happens to their electric potential energy as they fly apart?",
      options: [
        "EPE increases as they separate",
        "EPE decreases and converts to kinetic energy",
        "EPE stays the same",
        "EPE becomes negative"
      ],
      correctIndex: 1,
      explanation: "Like charges close together have HIGH EPE. As they repel and fly apart, EPE decreases and converts to kinetic energy — just like a ball rolling downhill converts GPE to KE. Energy is conserved!",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // SECTION 2: VOLTAGE (ELECTRIC POTENTIAL)
    // ═══════════════════════════════════════════
    {
      id: "section-voltage",
      type: "section_header",
      icon: "🔋",
      title: "Voltage: Electric Potential",
      subtitle: "~10 minutes"
    },
    {
      id: "text-voltage-def",
      type: "text",
      content: "Electric potential energy is useful, but it depends on *which charge* you're talking about. A charge of 2C at a certain spot has twice the EPE of a charge of 1C at the same spot.\n\nWe need a quantity that describes the **location itself**, not the charge. That quantity is **voltage** (also called electric potential):\n\n> **V = EPE / q**\n\nWhere:\n- **V** = voltage (volts, V)\n- **EPE** = electric potential energy (joules, J)\n- **q** = charge (coulombs, C)\n\nUnits: **1 volt = 1 joule per coulomb (J/C)**\n\nVoltage tells you: *\"How much energy would each coulomb of charge have at this position?\"*"
    },
    {
      id: "text-voltage-height",
      type: "text",
      content: "### Voltage as \"Electrical Height\"\n\nThink of voltage as the electrical version of height:\n\n| Gravity | Electricity |\n|---------|-------------|\n| Height (m) | Voltage (V) |\n| GPE = mgh | EPE = qV |\n| Ball rolls downhill | + charge moves from high V to low V |\n| Higher = more PE | Higher voltage = more EPE per charge |\n\nA point with **high voltage** is like the top of a hill — a positive charge placed there has lots of potential energy and will \"roll downhill\" to lower voltage."
    },
    {
      id: "q-voltage-meaning",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A point in space has a voltage of 50 V. What does this mean?",
      options: [
        "There are 50 charges at that point",
        "The electric field is 50 N/C",
        "Each coulomb of charge at that point has 50 joules of electric potential energy",
        "The force on any charge there is 50 N"
      ],
      correctIndex: 2,
      explanation: "Voltage = EPE per unit charge (V = EPE/q). So 50 V means each coulomb of charge at that location has 50 J of electric potential energy. That's what 'volts' measure — joules per coulomb.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // SECTION 3: VOLTAGE DIFFERENCE & BATTERIES
    // ═══════════════════════════════════════════
    {
      id: "section-delta-v",
      type: "section_header",
      icon: "🔌",
      title: "Voltage Difference & Batteries",
      subtitle: "~10 minutes"
    },
    {
      id: "text-delta-v",
      type: "text",
      content: "In practice, what matters isn't the voltage at one spot — it's the **voltage difference (ΔV)** between two spots. Just like what matters for a waterfall isn't the absolute height, but the *drop*.\n\n> **ΔV = V_high − V_low**\n\nThe work done on a charge moving through a voltage difference is:\n\n> **W = qΔV**\n\nWhere:\n- **W** = work or energy transferred (joules)\n- **q** = charge (coulombs)\n- **ΔV** = voltage difference (volts)"
    },
    {
      id: "text-battery",
      type: "text",
      content: "### What a Battery Really Does\n\nA **9V battery** creates a **9-volt difference** between its two terminals. That means:\n- Each coulomb of charge that passes through the battery gains **9 joules** of energy\n- The battery is like a **pump** that lifts charges to the top of a 9V hill\n- The charges then \"roll downhill\" through the circuit, delivering that energy to light bulbs, motors, etc.\n\nThis is the bridge to circuits! **Voltage is the push that drives current.** Without a voltage difference, charges have no reason to move — just like water doesn't flow on flat ground."
    },
    {
      id: "callout-pump",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Battery = Water Pump.** A water pump lifts water to a height so it can flow downhill through pipes and do work (turn a waterwheel). A battery lifts charges to a high voltage so they can flow through wires and do work (light a bulb). The pump doesn't create water — it just gives it energy. The battery doesn't create charge — it just gives charges energy."
    },
    {
      id: "text-energy-conservation",
      type: "text",
      content: "### Energy Conservation with Voltage\n\nJust like in the Energy unit: **total energy is conserved**.\n\nWhen a charge moves from high voltage to low voltage:\n- EPE **decreases**\n- KE **increases** (the charge speeds up)\n\nWhen a charge moves from low voltage to high voltage (pushed by a battery):\n- EPE **increases**\n- The battery supplies the energy\n\n> **EPE + KE = constant** (in the absence of other forces)\n\nA charge accelerating through a voltage drop is *exactly* like a ball speeding up as it falls — GPE converts to KE."
    },

    // ═══════════════════════════════════════════
    // SECTION 4: GUIDED PRACTICE
    // ═══════════════════════════════════════════
    {
      id: "section-practice",
      type: "section_header",
      icon: "📝",
      title: "Guided Practice",
      subtitle: "~10 minutes"
    },
    {
      id: "q-practice-1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A charge of 3 C is at a point where the voltage is 20 V. What is its electric potential energy?",
      options: ["6.67 J", "23 J", "60 J", "0.15 J"],
      correctIndex: 2,
      explanation: "EPE = qV = 3 C × 20 V = 60 J. Each coulomb has 20 J of energy, and there are 3 coulombs.",
      difficulty: "apply"
    },
    {
      id: "q-practice-2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "How much work is done when 0.5 C of charge moves through a voltage difference of 12 V?",
      options: ["0.042 J", "6 J", "12.5 J", "24 J"],
      correctIndex: 1,
      explanation: "W = qΔV = 0.5 C × 12 V = 6 J. The charge gains (or loses) 6 joules of energy moving through that 12 V difference.",
      difficulty: "apply"
    },
    {
      id: "q-practice-3",
      type: "question",
      questionType: "short_answer",
      prompt: "A proton (charge = 1.6 × 10⁻¹⁹ C) is released from rest and accelerates through a voltage difference of 500 V. How much kinetic energy does it gain? (Hint: the KE gained equals the EPE lost, which equals W = qΔV.)",
      difficulty: "apply"
    },
    {
      id: "q-practice-4",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A positive charge is released from rest in an electric field. It accelerates from Point A to Point B. Which point has higher voltage?",
      options: [
        "Point A (where it started) — it rolled 'downhill' to B",
        "Point B (where it ended up) — it gained energy climbing 'uphill'",
        "Both points have equal voltage",
        "Not enough information"
      ],
      correctIndex: 0,
      explanation: "A positive charge naturally moves from high voltage to low voltage (like a ball rolling downhill). Since it accelerated from A to B, Point A must be at higher voltage — the charge converted EPE to KE as it 'fell' to lower voltage.",
      difficulty: "analyze"
    },
    {
      id: "q-connection",
      type: "question",
      questionType: "short_answer",
      prompt: "We said a battery is like a water pump. Extend this analogy: What would a light bulb be in the water analogy? What about the wires? What about the current (flow of charge)?",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // WRAP UP
    // ═══════════════════════════════════════════
    {
      id: "section-wrapup",
      type: "section_header",
      icon: "🎯",
      title: "Wrap Up",
      subtitle: "~5 minutes"
    },
    {
      id: "text-wrapup",
      type: "text",
      content: "### Returning to Our Question of the Day\n\n**What does \"9V\" on a battery mean?**\n\nNow you know: a 9V battery maintains a **9-volt difference** between its terminals. That means every coulomb of charge that passes through gets **9 joules of energy**. The volt is a unit of **energy per charge** (J/C).\n\nThe battery doesn't create charge — it creates a voltage difference, an electrical \"hill,\" that pushes charges through the circuit. This voltage difference is what makes current flow, lights turn on, and motors spin.\n\n**Coming up next:** We'll use everything from this unit — charge, force, fields, and voltage — to build our first circuits."
    },
    {
      id: "q-exit-ticket",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A 12V car battery pushes 5 C of charge through the starter motor. How much energy is delivered?",
      options: ["2.4 J", "17 J", "60 J", "0.42 J"],
      correctIndex: 2,
      explanation: "W = qΔV = 5 C × 12 V = 60 J. The battery delivers 60 joules of energy to the starter motor. That's the beauty of voltage — it tells you exactly how much energy each coulomb gets.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // VOCABULARY
    // ═══════════════════════════════════════════
    {
      id: "section-vocab",
      type: "section_header",
      icon: "📖",
      title: "Key Vocabulary",
      subtitle: ""
    },
    {
      id: "vocab",
      type: "vocab_list",
      terms: [
        { term: "Electric Potential Energy (EPE)", definition: "Energy stored due to a charge's position in an electric field. Analogous to gravitational PE. EPE = kq₁q₂/r for point charges, or EPE = qV." },
        { term: "Voltage (Electric Potential)", definition: "Electric potential energy per unit charge at a point. V = EPE/q. Units: volts (V) = joules per coulomb (J/C)." },
        { term: "Volt", definition: "The SI unit of voltage. 1 volt = 1 joule per coulomb. Named after Alessandro Volta, inventor of the first battery." },
        { term: "Voltage Difference (ΔV)", definition: "The difference in voltage between two points. Determines how much energy a charge gains or loses moving between those points. W = qΔV." },
        { term: "Electron Volt (eV)", definition: "A tiny unit of energy: the energy gained by one electron moving through 1 V. Equal to 1.6 × 10⁻¹⁹ J. Used in atomic and nuclear physics." }
      ]
    }
  ]
};

async function seed() {
  try {
    await safeLessonWrite(db, "physics", "electrostatics-voltage", lesson);
    console.log('✅ Lesson "Electric Potential & Voltage" seeded successfully!');
    console.log("   Path: courses/physics/lessons/electrostatics-voltage");
    console.log("   Blocks:", lesson.blocks.length);
    console.log("   Order:", lesson.order);
    console.log("   Visible: false (publish via Lesson Editor when ready)");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding lesson:", err);
    process.exit(1);
  }
}
seed();
