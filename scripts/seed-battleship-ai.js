// seed-battleship-ai.js
// Creates the "Battleship: AI Literacy Review" lesson in all AI Literacy course periods.
// Uses Firebase Admin SDK (bypasses Firestore rules).
//
// Run: node scripts/seed-battleship-ai.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Battleship: AI Literacy Review",
  course: "Exploring Generative AI",
  unit: "Foundations of Generative AI",
  order: 9,
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
      content: "You've covered a lot of ground in AI Literacy — from how generative AI predicts text, to bias in training data, to how neural networks actually learn.\n\nNow it's time to put all of that knowledge to the test in a high-stakes naval battle. **Operation Red Tide** is a battleship game where your AI literacy knowledge is your ammunition — answer questions correctly to fire on enemy ships.\n\n**How it works:**\n- Place your fleet on the grid\n- Answer AI literacy questions to earn the right to fire\n- Correct answers = you attack the enemy\n- Wrong answers = the enemy attacks YOU\n- Sink the entire enemy fleet for a decisive victory"
    },
    {
      id: "objectives",
      type: "objectives",
      title: "What You're Reviewing",
      items: [
        "How generative AI predicts text (probability and patterns, not understanding)",
        "AI strengths, limitations, and hallucination",
        "Tokenization and training data — what goes in shapes what comes out",
        "Four types of bias: stereotypes, assumed identity, left-out perspectives, non-inclusive language",
        "Proxy discrimination and data labeling subjectivity",
        "Prompt engineering: specificity, constraints, context, iteration",
        "Embeddings: turning words into numbers that capture meaning",
        "Neural networks: weights, layers, and backpropagation"
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
      url: "https://battleship-ai-paps.web.app",
      caption: "Battleship: AI Literacy Review — answer AI questions to fire on enemy ships",
      height: 820,
      scored: true
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
      prompt: "Which AI literacy concept gave you the most trouble during the game? Was there a topic (bias, embeddings, neural networks, prompt engineering, etc.) that you got wrong more than once? Be specific.",
      difficulty: "evaluate"
    },
    {
      id: "q-debrief-2",
      type: "question",
      questionType: "short_answer",
      prompt: "Pick one question you got wrong and explain: what was the correct answer, and WHY is it correct? Use vocabulary from our earlier lessons.",
      difficulty: "evaluate"
    },
    {
      id: "text-transition",
      type: "text",
      content: "**Nice work, Commander.** You've reviewed the core foundations of generative AI — from how language models work under the hood, to the biases they inherit from training data, to the mathematical structures (embeddings and neural networks) that make it all possible.\n\nThese concepts will keep coming back as we explore more advanced AI topics ahead."
    }
  ]
};

async function seed() {
  const targets = [
    { courseId: "ai-literacy",            label: "ai-literacy (source)" },
    { courseId: "Y9Gdhw5MTY8wMFt6Tlvj",  label: "Period 4" },
    { courseId: "DacjJ93vUDcwqc260OP3",  label: "Period 5" },
    { courseId: "M2MVSXrKuVCD9JQfZZyp",  label: "Period 7" },
    { courseId: "fUw67wFhAtobWFhjwvZ5",  label: "Period 9" },
  ];

  for (const { courseId, label } of targets) {
    await db.collection('courses').doc(courseId).collection('lessons').doc('battleship-ai').set(lesson);
    console.log(`✅ Seeded → ${label} (${courseId})`);
  }

  console.log('\n✅ Lesson "Battleship: AI Literacy Review" seeded to all courses!');
  console.log('   Path: courses/{courseId}/lessons/battleship-ai');
  console.log('   Blocks:', lesson.blocks.length);
  console.log('   Order: 9 (after Neural Networks at order 8)');
  console.log('   Visible: false (publish via Lesson Editor when ready)');
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Error seeding lesson:', err);
  process.exit(1);
});
