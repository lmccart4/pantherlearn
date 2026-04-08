// seed-electrostatics-electric-fields.js
// Creates the "Electric Fields" lesson in the Physics Electrostatics unit.
// Uses Firebase Admin SDK (bypasses Firestore rules).
//
// Run: node scripts/seed-electrostatics-electric-fields.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Electric Fields",
  questionOfTheDay: "You can't see gravity, but you know it's there because things fall. Electric force is invisible too — so how could you 'map' where the electric force exists around a charged object?",
  course: "Physics",
  unit: "Electrostatics",
  order: 3,
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
      content: "**Question of the Day:** You can't see gravity, but you know it's there because things fall. Electric force is invisible too — so how could you 'map' where the electric force exists around a charged object?"
    },
    {
      id: "q-warmup",
      type: "question",
      questionType: "short_answer",
      prompt: "Imagine you have a tiny positive charge on a string. You bring it near a large positive object. What happens? Now imagine moving that tiny charge to different spots around the object — how could you use its behavior to create a 'map' of the electric force?",
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
        "Define electric field as force per unit charge (E = F/q)",
        "Sketch electric field lines for single charges and charge pairs",
        "Predict the direction of force on a charge placed in an electric field",
        "Explain why electric field lines never cross"
      ]
    },

    // ═══════════════════════════════════════════
    // SECTION 1: WHAT IS AN ELECTRIC FIELD?
    // ═══════════════════════════════════════════
    {
      id: "section-field-concept",
      type: "section_header",
      icon: "⚡",
      title: "What is an Electric Field?",
      subtitle: "~10 minutes"
    },
    {
      id: "text-field-intro",
      type: "text",
      content: "Last lesson, you used Coulomb's Law to calculate the force between two charges. But think about this: a charged object sitting alone on a table — is it doing *anything*?\n\nThe answer is **yes**. A charged object creates an invisible **electric field** in the space around it. The field exists whether or not another charge is nearby to feel it. It's like how the Sun creates a gravitational field — the field is there even if no planets existed.\n\nAn **electric field** is a region around a charged object where another charge would experience a force. The field is the *mechanism* by which charges push and pull on each other — they don't need to touch."
    },
    {
      id: "text-field-equation",
      type: "text",
      content: "### The Electric Field Equation\n\nWe define electric field strength as the **force per unit charge**:\n\n> **E = F / q**\n\nWhere:\n- **E** = electric field strength (N/C — newtons per coulomb)\n- **F** = electric force experienced (N)\n- **q** = the charge feeling the force (C)\n\nThe direction of **E** is defined as the direction a **positive test charge** would be pushed. This is a convention — we always ask: *\"Which way would a tiny positive charge move here?\"*"
    },
    {
      id: "callout-test-charge",
      type: "callout",
      style: "insight",
      icon: "💡",
      content: "**Why a positive test charge?** It's just a convention physicists agreed on. We imagine placing a tiny positive charge at every point in space and asking \"which way does it get pushed?\" That direction IS the field direction. A negative charge would feel force in the *opposite* direction of the field."
    },
    {
      id: "text-point-charge-field",
      type: "text",
      content: "### Field from a Point Charge\n\nFor a single point charge **Q** creating a field, the field strength at distance **r** is:\n\n> **E = kQ / r²**\n\nSame inverse-square relationship as Coulomb's Law! Double the distance → field drops to ¼. This makes sense — the field gets weaker as you move farther from the charge that creates it."
    },
    {
      id: "q-field-calc",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A charge experiences a force of 0.006 N in an electric field. The charge is 0.002 C. What is the electric field strength?",
      options: ["0.003 N/C", "0.012 N/C", "3 N/C", "12 N/C"],
      correctIndex: 2,
      explanation: "E = F/q = 0.006 N ÷ 0.002 C = 3 N/C. The field strength is the force felt per coulomb of charge.",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SECTION 2: ELECTRIC FIELD LINES
    // ═══════════════════════════════════════════
    {
      id: "section-field-lines",
      type: "section_header",
      icon: "📐",
      title: "Electric Field Lines",
      subtitle: "~10 minutes"
    },
    {
      id: "text-field-line-rules",
      type: "text",
      content: "We can't see electric fields, but we can **draw** them using **field lines**. These are imaginary lines that show the direction and strength of the field at every point.\n\n### Rules for Drawing Field Lines\n\n1. **Lines point AWAY from positive charges** (a positive test charge would be repelled)\n2. **Lines point TOWARD negative charges** (a positive test charge would be attracted)\n3. **Lines NEVER cross** — at any point in space, the field can only point in ONE direction\n4. **Closer lines = stronger field** — where lines are packed together, the force is intense\n5. **Lines start on positive charges and end on negative charges** — they don't just float in space"
    },
    {
      id: "callout-never-cross",
      type: "callout",
      style: "warning",
      icon: "⚠️",
      content: "**Why can't field lines cross?** If they did, a charge at that point would be pushed in TWO directions at once — which is impossible. A force can only point one way at one location. If lines tried to cross, the actual field there would be a single combined direction."
    },
    {
      id: "text-common-patterns",
      type: "text",
      content: "### Common Field Line Patterns\n\n**Single positive charge (+):** Lines radiate outward in all directions, like a starburst. The field pushes positive test charges away.\n\n**Single negative charge (−):** Lines point inward from all directions, like a drain. The field pulls positive test charges in.\n\n**Dipole (+ and − near each other):** Lines curve from the positive charge to the negative charge. This is one of the most important patterns in all of physics — molecules, antennas, and magnets all create dipole fields.\n\n**Two positive charges (+ and +):** Lines radiate from each charge but curve AWAY from the other charge. There's a dead zone in the middle where the fields cancel.\n\n**Parallel plates (+ plate and − plate):** Lines go straight from the positive plate to the negative plate. The field between the plates is **uniform** — same strength and direction everywhere. This is the simplest field to work with."
    },
    {
      id: "q-field-direction",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A positive test charge is placed between a positive charge on the left and a negative charge on the right (a dipole). Which way does the electric field point at that location?",
      options: ["To the left (toward the +)", "To the right (toward the −)", "Upward", "The field is zero there"],
      correctIndex: 1,
      explanation: "The positive charge pushes the test charge to the right (away from +). The negative charge pulls the test charge to the right (toward −). Both effects point right, so the field points from + toward −.",
      difficulty: "understand"
    },
    {
      id: "q-field-strength",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In a diagram of field lines around a charge, you notice the lines are very close together near the charge and spread far apart farther away. What does this tell you?",
      options: [
        "The field is stronger far from the charge",
        "The field is uniform everywhere",
        "The field is stronger near the charge and weaker far away",
        "The charge is negative"
      ],
      correctIndex: 2,
      explanation: "Closer field lines = stronger field. The field follows an inverse-square law (E = kQ/r²), so it's strongest near the charge and weakens with distance.",
      difficulty: "understand"
    },

    // ═══════════════════════════════════════════
    // SECTION 3: PhET SIMULATION ACTIVITY
    // ═══════════════════════════════════════════
    {
      id: "section-phet",
      type: "section_header",
      icon: "🔬",
      title: "PhET: Charges and Fields",
      subtitle: "~15 minutes"
    },
    {
      id: "text-phet-intro",
      type: "text",
      content: "Time to SEE electric fields in action. Open the **PhET \"Charges and Fields\"** simulation and follow the steps below. For each setup, observe the field lines and then **sketch the pattern** on paper or in your notebook.\n\n🔗 [Open the simulation](https://phet.colorado.edu/sims/html/charges-and-fields/latest/charges-and-fields_en.html)\n\nMake sure to check the **\"Electric Field\"** box and **\"Direction only\"** to see the field arrows."
    },
    {
      id: "text-phet-step1",
      type: "text",
      content: "### Step 1: Single Positive Charge\nPlace a single **red (+)** charge in the center of the screen. Observe the field arrows around it.\n- What direction do the arrows point?\n- What happens to arrow size as you look farther from the charge?"
    },
    {
      id: "text-phet-step2",
      type: "text",
      content: "### Step 2: Single Negative Charge\nClear the screen. Place a single **blue (−)** charge in the center.\n- How does the pattern compare to the positive charge?\n- What's the same? What's different?"
    },
    {
      id: "text-phet-step3",
      type: "text",
      content: "### Step 3: Dipole\nPlace a **+** charge on the left and a **−** charge on the right, separated by a few cm.\n- Watch how the field lines curve from + to −.\n- Where is the field strongest? Where is it weakest?"
    },
    {
      id: "text-phet-step4",
      type: "text",
      content: "### Step 4: Two Positive Charges\nClear the screen. Place two **+** charges side by side.\n- What happens to the field between them?\n- Is there a spot where the field is approximately zero?"
    },
    {
      id: "text-phet-step5",
      type: "text",
      content: "### Step 5: Parallel Plates\nLine up several **+** charges in a vertical row on the left and several **−** charges in a vertical row on the right.\n- What does the field look like between the \"plates\"?\n- How is this different from the other patterns?"
    },
    {
      id: "q-sketch",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick THREE of the five arrangements you just explored. For each one, describe the pattern of the electric field lines: Where do they start? Where do they end? Where is the field strongest? (You should also sketch these on paper.)",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SECTION 4: CHECK YOUR UNDERSTANDING
    // ═══════════════════════════════════════════
    {
      id: "section-check",
      type: "section_header",
      icon: "✅",
      title: "Check Your Understanding",
      subtitle: "~5 minutes"
    },
    {
      id: "q-why-no-cross",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Why can electric field lines never cross each other?",
      options: [
        "Because like charges repel",
        "Because field lines are always straight",
        "Because at any point in space, the force can only point in one direction",
        "Because positive and negative charges attract"
      ],
      correctIndex: 2,
      explanation: "If field lines crossed, a charge at the crossing point would have two different force directions simultaneously, which is physically impossible. The net force at any point has exactly one direction.",
      difficulty: "understand"
    },
    {
      id: "q-strongest-field",
      type: "question",
      questionType: "short_answer",
      prompt: "Look at your dipole sketch from the simulation. Where is the electric field strongest — between the two charges, or off to the sides? How can you tell from the field lines?",
      difficulty: "analyze"
    },
    {
      id: "q-negative-in-field",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A negative charge is placed in an electric field that points to the right. Which way does the force on the negative charge point?",
      options: [
        "To the right (same as the field)",
        "To the left (opposite the field)",
        "Upward",
        "There is no force on a negative charge"
      ],
      correctIndex: 1,
      explanation: "The electric field direction is defined for a POSITIVE test charge. A negative charge feels force in the OPPOSITE direction of the field. Field points right → force on negative charge points left.",
      difficulty: "apply"
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
      content: "### Returning to Our Question of the Day\n\nHow could you map where the electric force exists around a charged object?\n\nNow you know the answer: **imagine placing a tiny positive test charge at every point in space and draw an arrow showing which way it gets pushed.** Those arrows trace out the electric field lines.\n\n- Near a **+** charge, the arrows point outward.\n- Near a **−** charge, the arrows point inward.\n- The arrows are **longer** (field is stronger) where the force is more intense — close to the charge.\n\nThis mapping technique is exactly what physicists do. The field is invisible, but the *pattern* of force is real and predictable."
    },
    {
      id: "q-exit-ticket",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Electric field lines around a negative charge point:",
      options: [
        "Away from the charge",
        "Toward the charge",
        "In circles around the charge",
        "In random directions"
      ],
      correctIndex: 1,
      explanation: "A positive test charge would be attracted TOWARD a negative charge, so the electric field lines point inward — toward the negative charge.",
      difficulty: "remember"
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
        { term: "Electric Field", definition: "A region around a charged object where another charge would experience a force. Measured in N/C." },
        { term: "Field Lines", definition: "Imaginary lines drawn to represent the direction and strength of an electric field. Closer lines mean a stronger field." },
        { term: "Test Charge", definition: "An imaginary small positive charge used to define the direction of the electric field at any point." },
        { term: "Dipole", definition: "A pair of equal and opposite charges separated by a distance. Creates a characteristic curved field pattern." },
        { term: "Uniform Field", definition: "An electric field with the same strength and direction at every point, such as between parallel plates." },
        { term: "Parallel Plates", definition: "Two flat conducting plates with opposite charges that create a uniform electric field between them." }
      ]
    }
  ]
};

async function seed() {
  try {
    await safeLessonWrite(db, "physics", "electrostatics-electric-fields", lesson);
    console.log('✅ Lesson "Electric Fields" seeded successfully!');
    console.log("   Path: courses/physics/lessons/electrostatics-electric-fields");
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
