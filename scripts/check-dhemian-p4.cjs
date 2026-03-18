const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const UID = "qJ5CCFsZvfXo20tS2eTAHuaI1zw2";
const COURSE = "DacjJ93vUDcwqc260OP3";

async function check() {
  const lessons = await db.collection(`courses/${COURSE}/lessons`).get();
  console.log(`Checking ${lessons.size} lessons in Period 4...\n`);

  for (const l of lessons.docs) {
    const p = await db.doc(`courses/${COURSE}/lessons/${l.id}/progress/${UID}`).get();
    if (p.exists) {
      const d = p.data();
      console.log(`✓ ${l.id}`);
      console.log(`  score=${d.score ?? 'none'} writtenScore=${d.writtenScore ?? 'none'} completed=${d.completed ?? false}`);
      if (d.blockScores) console.log(`  blockScores:`, JSON.stringify(d.blockScores));
    }
  }

  // Also check the base ai-literacy course
  const baseLessons = await db.collection(`courses/ai-literacy/lessons`).get();
  for (const l of baseLessons.docs) {
    const p = await db.doc(`courses/ai-literacy/lessons/${l.id}/progress/${UID}`).get();
    if (p.exists) {
      const d = p.data();
      console.log(`\n[base] ✓ ${l.id}: score=${d.score ?? 'none'}`);
    }
  }
}

check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
