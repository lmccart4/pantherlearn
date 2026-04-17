const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const COURSE_ID = 'DacjJ93vUDcwqc260OP3'; // AI Literacy P5
const LESSON_ID = 'ai-quests-reflection';
const REQ_IDS = [
  'RwvsmjoIbFT88GX1I2UG', // Nashla Cruz Rodriguez
  'swqkEMyrz2VZnenGuOgo', // Evangeline Padilla
  'buTjuqJpQz5CBnfy3SBD', // Hailey Hidalgo
];

async function main() {
  const now = admin.firestore.FieldValue.serverTimestamp();
  let applied = 0;
  for (const reqId of REQ_IDS) {
    const reqRef = db.doc(`courses/${COURSE_ID}/manaRequests/${reqId}`);
    const snap = await reqRef.get();
    if (!snap.exists) { console.log(`  SKIP ${reqId} — not found`); continue; }
    const req = snap.data();
    const uid = req.studentUid;
    const name = req.studentName;
    if (!uid) { console.log(`  SKIP ${reqId} — no studentUid`); continue; }

    const progressRef = db.doc(`progress/${uid}/courses/${COURSE_ID}/lessons/${LESSON_ID}`);
    await progressRef.set({
      exempt: true,
      exemptAt: now,
      exemptBy: 'mana-spell',
      exemptReason: 'Classwork Pass (backfill)',
    }, { merge: true });

    await reqRef.update({
      status: 'fulfilled',
      fulfilledAt: now,
      fulfilledBy: 'backfill-script',
      resolvedLessonId: LESSON_ID,
    });

    console.log(`  ✓ ${name} — exempt set on ${LESSON_ID}; request marked fulfilled`);
    applied++;
  }
  console.log(`\nDone. Applied ${applied}/${REQ_IDS.length}.`);
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
