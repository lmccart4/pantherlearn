// seed-magnetism-assessment.js
// Creates "Magnetism Assessment" lesson (Magnetism Unit, Lesson 4)
// Run: node scripts/seed-magnetism-assessment.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Magnetism Assessment",
  course: "Physics",
  unit: "Magnetism",
  order: 4,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // INTRO
    // ═══════════════════════════════════════════
    {
      id: "section-intro",
      type: "section_header",
      icon: "📝",
      title: "Magnetism Unit Assessment",
      subtitle: "~40 minutes"
    },
    {
      id: "b-intro",
      type: "text",
      content: "This assessment covers all three lessons in the Magnetism unit:\n- Lesson 1: Magnets & Magnetic Fields\n- Lesson 2: Electromagnetism — Current Creates Magnetism\n- Lesson 3: Motors, Generators & Induction\n\nRead each question carefully. For multiple choice, select the best answer. For written responses, use specific vocabulary and explain your reasoning."
    },
    {
      id: "callout-instructions",
      type: "callout",
      style: "tip",
      icon: "✅",
      content: "**Tips:** Use vocabulary from the unit. Show your reasoning. If you're unsure, eliminate wrong answers first. There is a bonus question at the end."
    },

    // ═══════════════════════════════════════════
    // SECTION 1: MAGNETS & FIELDS (~25%)
    // ═══════════════════════════════════════════
    {
      id: "section-1",
      type: "section_header",
      icon: "🧲",
      title: "Section 1: Magnets & Fields",
      subtitle: "4 questions · ~25%"
    },
    {
      id: "q1",
      type: "question",
      questionType: "multiple_choice",
      prompt: "What happens when you break a bar magnet in half?",
      options: [
        "You get one north piece and one south piece",
        "Both pieces become non-magnetic",
        "Each piece becomes a complete magnet with its own north and south poles",
        "Only the larger piece remains magnetic"
      ],
      correctIndex: 2,
      explanation: "Magnetic poles always come in pairs — there are no magnetic monopoles. Breaking a magnet in half creates two smaller magnets, each with its own north and south pole.",
      difficulty: "remember"
    },
    {
      id: "q2",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Magnetic field lines around a bar magnet:",
      options: [
        "Start at the south pole and end at the north pole",
        "Form closed loops — exiting the north pole and entering the south pole",
        "Radiate outward in all directions equally",
        "Only exist inside the magnet"
      ],
      correctIndex: 1,
      explanation: "Magnetic field lines exit the north pole, curve through space, and enter the south pole. Inside the magnet, they continue from south to north, forming complete closed loops. This is different from electric field lines, which start and end on charges.",
      difficulty: "remember"
    },
    {
      id: "q3",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A magnet sticks to a steel paper clip but NOT to an aluminum can. This is because:",
      options: [
        "Aluminum is too light to be attracted by magnets",
        "Steel is a better conductor of electricity than aluminum",
        "Steel contains iron, which has magnetic domains that can align with the external field; aluminum does not",
        "Aluminum has a protective oxide layer that blocks magnetic fields"
      ],
      correctIndex: 2,
      explanation: "Ferromagnetic materials (iron, nickel, cobalt) have magnetic domains — microscopic regions where atomic magnets align. An external magnetic field causes these domains to align, creating attraction. Aluminum atoms don't form alignable domains.",
      difficulty: "understand"
    },
    {
      id: "q4",
      type: "question",
      questionType: "short_answer",
      prompt: "Explain one key similarity AND one key difference between electric fields and magnetic fields. Use specific vocabulary from both units.",
      placeholder: "Similarity: ... Difference: ...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // SECTION 2: ELECTROMAGNETISM (~25%)
    // ═══════════════════════════════════════════
    {
      id: "section-2",
      type: "section_header",
      icon: "⚡",
      title: "Section 2: Electromagnetism",
      subtitle: "4 questions · ~25%"
    },
    {
      id: "q5",
      type: "question",
      questionType: "multiple_choice",
      prompt: "In 1820, Hans Christian Oersted discovered that:",
      options: [
        "Magnets can generate electricity",
        "Electric current creates a magnetic field around the wire",
        "The Earth has a magnetic field",
        "Breaking a magnet creates two new magnets"
      ],
      correctIndex: 1,
      explanation: "Oersted noticed that a compass needle deflected when he turned on a nearby electric circuit. This was the first evidence that electricity and magnetism are connected — every current-carrying wire produces a circular magnetic field around it.",
      difficulty: "remember"
    },
    {
      id: "q6",
      type: "question",
      questionType: "multiple_choice",
      prompt: "To make an electromagnet STRONGER, you should:",
      options: [
        "Use fewer coils and less current",
        "Replace the iron core with a wooden core",
        "Increase the current, add more coils, or use an iron core",
        "Reverse the direction of current flow"
      ],
      correctIndex: 2,
      explanation: "Electromagnet strength depends on: (1) number of coils — more coils = more field lines adding up, (2) current — more current = stronger field per coil, (3) iron core — concentrates the magnetic field. Reversing current only changes field direction, not strength.",
      difficulty: "understand"
    },
    {
      id: "q7",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Using the right-hand rule: if current flows upward through a straight wire, the magnetic field around the wire circles:",
      options: [
        "Upward along the wire",
        "Downward along the wire",
        "Counterclockwise when viewed from above",
        "The field doesn't form circles — it radiates outward"
      ],
      correctIndex: 2,
      explanation: "The right-hand rule: point your thumb in the direction of current (upward). Your fingers curl in the direction of the magnetic field — counterclockwise when viewed from above. The field forms circular loops around the wire.",
      difficulty: "apply"
    },
    {
      id: "q8",
      type: "question",
      questionType: "short_answer",
      prompt: "Compare permanent magnets and electromagnets. Give one advantage of each.",
      placeholder: "Permanent magnet advantage: ... Electromagnet advantage: ...",
      difficulty: "analyze"
    },

    // ═══════════════════════════════════════════
    // SECTION 3: INDUCTION & APPLICATIONS (~30%)
    // ═══════════════════════════════════════════
    {
      id: "section-3",
      type: "section_header",
      icon: "🔄",
      title: "Section 3: Induction & Applications",
      subtitle: "5 questions · ~30%"
    },
    {
      id: "q9",
      type: "question",
      questionType: "multiple_choice",
      prompt: "Faraday's Law of Induction states that:",
      options: [
        "A constant magnetic field produces a constant current",
        "A changing magnetic field induces a voltage (and current) in a conductor",
        "Moving charges always create magnetic fields",
        "Magnets lose their strength over time"
      ],
      correctIndex: 1,
      explanation: "The key word is CHANGING. A static magnetic field does nothing. Only when the magnetic field through a conductor changes (by moving a magnet, changing current in a nearby coil, or rotating a loop in a field) does an electric current get induced.",
      difficulty: "remember"
    },
    {
      id: "q10",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An electric motor converts:",
      options: [
        "Mechanical energy → electrical energy",
        "Electrical energy → mechanical energy",
        "Magnetic energy → thermal energy",
        "Chemical energy → magnetic energy"
      ],
      correctIndex: 1,
      explanation: "A motor uses electric current flowing through a coil in a magnetic field to produce a force and rotation — converting electrical energy to mechanical energy. A generator does the reverse.",
      difficulty: "remember"
    },
    {
      id: "q11",
      type: "question",
      questionType: "multiple_choice",
      prompt: "A generator and a motor are fundamentally:",
      options: [
        "Completely different devices with no connection",
        "The same device running in reverse — one converts electrical→mechanical, the other mechanical→electrical",
        "Both convert electrical energy to heat",
        "Only a generator uses magnets; a motor does not"
      ],
      correctIndex: 1,
      explanation: "A motor and generator are essentially the same device. A motor takes electrical current and produces rotation. A generator takes rotation and produces electrical current. Same parts, opposite energy conversion direction.",
      difficulty: "understand"
    },
    {
      id: "q12",
      type: "question",
      questionType: "multiple_choice",
      prompt: "To increase the voltage induced in a generator, you could:",
      options: [
        "Slow down the rotation",
        "Use fewer coils of wire",
        "Rotate the coil faster or use more loops of wire",
        "Replace the magnets with plastic"
      ],
      correctIndex: 2,
      explanation: "Faraday's Law (qualitative): induced voltage increases with (1) faster rate of change of the magnetic field — spin faster, and (2) more coils of wire — each loop contributes to the total voltage.",
      difficulty: "apply"
    },
    {
      id: "q13",
      type: "question",
      questionType: "short_answer",
      prompt: "Your phone charges wirelessly when placed on a charging pad — no wires connect the pad to the phone. Using what you know about electromagnetic induction, explain how this works.",
      placeholder: "Wireless charging works because...",
      difficulty: "apply"
    },

    // ═══════════════════════════════════════════
    // SECTION 4: CONNECTIONS & REASONING (~20%)
    // ═══════════════════════════════════════════
    {
      id: "section-4",
      type: "section_header",
      icon: "🧠",
      title: "Section 4: Connections & Reasoning",
      subtitle: "3 questions · ~20%"
    },
    {
      id: "q14",
      type: "question",
      questionType: "short_answer",
      prompt: "This unit ties together concepts from the whole year. Explain the chain: charges (electrostatics) → current (circuits) → magnetism → induction. How does each concept connect to the next?",
      placeholder: "Charges relate to current because... Current creates... Changing fields cause...",
      difficulty: "analyze"
    },
    {
      id: "q15",
      type: "question",
      questionType: "multiple_choice",
      prompt: "An electromagnet currently uses 2 amps of current. If the current is doubled to 4 amps, what happens to the magnetic field strength?",
      options: [
        "It stays the same",
        "It doubles (directly proportional)",
        "It quadruples (squared)",
        "It halves (inversely proportional)"
      ],
      correctIndex: 1,
      explanation: "The magnetic field of an electromagnet is directly proportional to the current (B ∝ I). Double the current → double the field strength. This is a direct proportion — the same proportional reasoning you learned in Unit 1.",
      difficulty: "apply"
    },
    {
      id: "q16",
      type: "question",
      questionType: "short_answer",
      prompt: "Earth's magnetic field protects us from the solar wind. Mars doesn't have a significant magnetic field. What happened to Mars as a result, and why does this matter for future space exploration?",
      placeholder: "Without a magnetic field, Mars...",
      difficulty: "evaluate"
    },

    // ═══════════════════════════════════════════
    // BONUS
    // ═══════════════════════════════════════════
    {
      id: "section-bonus",
      type: "section_header",
      icon: "⭐",
      title: "Bonus Question",
      subtitle: "+5%"
    },
    {
      id: "q-bonus",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick ONE real-world device that uses electromagnetism (examples: MRI machine, electric vehicle motor, guitar pickup, induction cooktop, maglev train). Explain HOW it uses the principles of electromagnetism from this unit — be specific about which concepts apply.",
      placeholder: "Device: ... How it uses electromagnetism: ...",
      difficulty: "create"
    }
  ]
};

async function seed() {
  try {
    await db.collection("courses").doc("physics")
      .collection("lessons").doc("magnetism-assessment")
      .set(lesson);
    console.log('✅ Lesson "Magnetism Assessment" seeded successfully!');
    console.log("   Path: courses/physics/lessons/magnetism-assessment");
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
