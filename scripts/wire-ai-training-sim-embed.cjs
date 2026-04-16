// Re-wire the ai-training-sim lesson's activity block from the external-link
// ExternalActivityBlock (type: ai_training_sim) to a proper scored embed
// (type: embed, scored: true, weight: 5) pointing at the new iframe-ready
// activity at https://ai-training-sim-paps.web.app.
//
// Run: node scripts/wire-ai-training-sim-embed.cjs

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
  type: "embed",
  url: "https://ai-training-sim-paps.web.app",
  caption: "AI Training Simulator",
  scored: true,
  weight: 5,
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
      if (b.id === "activity-block") return NEW_BLOCK;
      return b;
    });
    const result = await safeLessonWrite(db, courseId, LESSON_ID, { ...data, blocks });
    console.log(`  ${courseId}: ${result.action} (${result.preserved} preserved)`);
  }
  console.log("\nDone. Block id 'activity-block' now type:embed with scored:true weight:5.");
  process.exit(0);
})();
