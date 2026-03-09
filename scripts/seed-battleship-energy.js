// seed-battleship-energy.js
// Creates the "Battleship: Energy Review" lesson in the Physics course.
// Uses Firebase Admin SDK (bypasses Firestore rules).
//
// Run: node scripts/seed-battleship-energy.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Battleship: Energy Review",
  course: "Physics",
  unit: "Energy",
  order: 2,
  visible: false,
  blocks: [

    // ═══════════════════════════════════════════
    // BRIEFING
    // ═══════════════════════════════════════════
    {
      id: "section-briefing",
      type: "section_header",
      icon: "🚢",
      title: "Mission Briefing",
      subtitle: "~2 minutes"
    },
    {
      id: "text-intro",
      type: "text",
      content: "You've learned about energy types, transfers, and systems. You've explored the 'abilities' in the Ability Architect and taken a quiz on the fundamentals.\n\nNow it's time to put all of that knowledge to the test in a high-stakes naval battle. **Operation Red Tide** is a battleship game where your physics knowledge is your ammunition — answer energy questions correctly to fire on enemy ships.\n\n**How it works:**\n- Place your fleet on the grid\n- Answer energy questions to earn the right to fire\n- Correct answers = you attack the enemy\n- Wrong answers = the enemy attacks YOU\n- Sink the entire enemy fleet for a decisive victory"
    },
    {
      id: "objectives",
      type: "objectives",
      title: "What You're Reviewing",
      items: [
        "Identifying energy types (kinetic, gravitational PE, elastic PE, thermal, chemical, etc.)",
        "Recognizing energy transfers and transformations in real-world systems",
        "Defining systems and identifying what's inside vs. outside the system boundary",
        "Applying conservation of energy reasoning to everyday scenarios"
      ]
    },

    // ═══════════════════════════════════════════
    // THE GAME
    // ═══════════════════════════════════════════
    {
      id: "section-game",
      type: "section_header",
      icon: "⚔️",
      title: "Operation Red Tide",
      subtitle: "~30 minutes"
    },
    {
      id: "embed-battleship",
      type: "embed",
      url: "https://battleship-energy-paps.web.app",
      caption: "Battleship: Energy Review — answer energy questions to fire on enemy ships",
      height: 820
    },

    // ═══════════════════════════════════════════
    // DEBRIEF
    // ═══════════════════════════════════════════
    {
      id: "section-debrief",
      type: "section_header",
      icon: "📋",
      title: "Mission Debrief",
      subtitle: "~5 minutes"
    },
    {
      id: "q-debrief-1",
      type: "question",
      questionType: "short_answer",
      prompt: "Which energy concept gave you the most trouble during the game? Was there a question type (identifying energy, transfers, systems, conservation) that you got wrong more than once? Be specific.",
      difficulty: "evaluate"
    },
    {
      id: "q-debrief-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick one question you got wrong and explain: what was the correct answer, and WHY is it correct? Use the vocabulary from our earlier lessons (energy types, transfers, transformations, systems).",
      difficulty: "evaluate"
    },
    {
      id: "text-transition",
      type: "text",
      content: "**Coming up next:** You've reviewed the energy foundations. Now you'll go deeper into a specific type of stored energy — **elastic potential energy** — and meet the formula that describes how springs and rubber bands store energy: **EPE = ½kx²**."
    }
  ]
};

async function seed() {
  try {
    await db.collection('courses').doc('physics')
      .collection('lessons').doc('battleship-energy')
      .set(lesson);
    console.log('✅ Lesson "Battleship: Energy Review" seeded successfully!');
    console.log('   Path: courses/physics/lessons/battleship-energy');
    console.log('   Blocks:', lesson.blocks.length);
    console.log('   Order: 2 (review activity before Elastic PE)');
    console.log('   Visible: false (publish via Lesson Editor when ready)');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
