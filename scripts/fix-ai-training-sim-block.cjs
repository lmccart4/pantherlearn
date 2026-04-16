// Fix the "Training AI: Who Decides What It Learns?" lesson across all 4 AI Lit
// sections. The activity block was seeded as the generic `activity` type (text
// only — instructions said "your teacher will share the link"). Re-route it to
// `ai_training_sim` so ExternalActivityBlock renders the actual link button to
// https://ai-training-sim-paps.firebaseapp.com.
//
// Run: node scripts/fix-ai-training-sim-block.cjs

const admin = require("firebase-admin");
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const COURSES = [
  "Y9Gdhw5MTY8wMFt6Tlvj", // P4
  "DacjJ93vUDcwqc260OP3", // P5
  "M2MVSXrKuVCD9JQfZZyp", // P7
  "fUw67wFhAtobWFhjwvZ5", // P9
];
const LESSON_ID = "ai-training-sim";

const NEW_BLOCK = {
  id: "activity-block",
  type: "ai_training_sim",
  title: "AI Training Simulator",
  icon: "🧠",
  url: "https://ai-training-sim-paps.firebaseapp.com",
  instructions: "Train an AI model step by step. Pay close attention to: (1) what data you select and what you leave out, (2) how you label examples and whether those labels are clear, (3) how the model performs after training — where it succeeds and where it fails. Complete all stages of the simulation before moving on to the reflection.",
};

(async () => {
  for (const courseId of COURSES) {
    const ref = db.collection("courses").doc(courseId).collection("lessons").doc(LESSON_ID);
    const doc = await ref.get();
    if (!doc.exists) {
      console.log(`  ${courseId}: lesson missing — skipping`);
      continue;
    }
    const data = doc.data();
    const blocks = (data.blocks || []).map((b) => {
      if (b.id === "activity-block" || (b.type === "activity" && /Training Simulator/i.test(b.title || ""))) {
        return NEW_BLOCK;
      }
      return b;
    });
    const result = await safeLessonWrite(db, courseId, LESSON_ID, { ...data, blocks });
    console.log(`  ${courseId}: ${result.action} (${result.preserved} preserved)`);
  }
  console.log("\nDone.");
  process.exit(0);
})();
