// shuffle-mc-lesson9.js
// Shuffles the multiple choice answer positions for "Who's Making the Choices?"
// for periods 5, 7, and 9 only. Period 4 is left untouched.
//
// Run: node scripts/shuffle-mc-lesson9.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const MC_BLOCK_IDS = ["b14", "b15", "b16", "b23"];

// Each period gets a different shuffle pattern so answers differ across sections.
// Pattern = array of new positions for each question's correct answer.
const periodShuffles = {
  DacjJ93vUDcwqc260OP3: { label: "Period 5", shifts: [2, 3, 0, 2] },
  M2MVSXrKuVCD9JQfZZyp: { label: "Period 7", shifts: [3, 0, 2, 3] },
  fUw67wFhAtobWFhjwvZ5: { label: "Period 9", shifts: [0, 2, 3, 0] },
};

function shuffleOptions(options, oldCorrectIndex, newCorrectIndex) {
  const correctAnswer = options[oldCorrectIndex];
  const rest = options.filter((_, i) => i !== oldCorrectIndex);
  // Insert correct answer at the new position
  rest.splice(newCorrectIndex, 0, correctAnswer);
  return rest;
}

async function run() {
  for (const [courseId, { label, shifts }] of Object.entries(periodShuffles)) {
    const ref = db.collection("courses").doc(courseId).collection("lessons").doc("whos-making-choices");
    const snap = await ref.get();
    if (!snap.exists) {
      console.log(`⚠️  Lesson not found for ${label} — skipping`);
      continue;
    }

    const lesson = snap.data();
    const blocks = [...lesson.blocks];
    let changed = 0;

    for (let qi = 0; qi < MC_BLOCK_IDS.length; qi++) {
      const blockId = MC_BLOCK_IDS[qi];
      const newCorrectIndex = shifts[qi];
      const blockIdx = blocks.findIndex((b) => b.id === blockId);
      if (blockIdx === -1) continue;

      const block = { ...blocks[blockIdx] };
      const oldCorrectIndex = block.correctIndex;

      if (oldCorrectIndex === newCorrectIndex) {
        console.log(`  ${blockId}: already at index ${newCorrectIndex}, skipping`);
        continue;
      }

      block.options = shuffleOptions([...block.options], oldCorrectIndex, newCorrectIndex);
      block.correctIndex = newCorrectIndex;
      blocks[blockIdx] = block;
      changed++;
      console.log(`  ${blockId}: moved correct answer from index ${oldCorrectIndex} → ${newCorrectIndex}`);
    }

    if (changed > 0) {
      await ref.update({ blocks });
      console.log(`✅ ${label} — ${changed} questions shuffled\n`);
    } else {
      console.log(`⏭️  ${label} — no changes needed\n`);
    }
  }

  console.log("Done! Period 4 was not touched.");
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});
