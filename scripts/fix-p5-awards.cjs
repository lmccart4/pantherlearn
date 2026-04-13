/**
 * Fix the bogus P5 award writes — the previous script wrote a literal top-level
 * field "answers.embed-quiz-..." instead of nesting it under answers.{blockId}.
 * This script:
 *   1. Deletes the bogus top-level field on all P5 progress docs
 *   2. Writes the correct nested shape using updateDoc + dotted path
 *   3. Verifies the result
 *
 * Run: node scripts/fix-p5-awards.cjs
 */
const admin = require("firebase-admin");
const { FieldPath, FieldValue } = require("firebase-admin/firestore");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const P5 = "DacjJ93vUDcwqc260OP3";
const LESSON = "real-vs-ai-quiz";
const BLOCK = "embed-quiz-1773624055951";
const BOGUS_KEY = `answers.${BLOCK}`;

(async () => {
  const enr = await db.collection("enrollments").where("courseId", "==", P5).get();
  const uids = [];
  for (const d of enr.docs) {
    const data = d.data();
    if (data.isTestStudent) continue;
    const uid = data.uid || data.studentUid;
    if (uid) uids.push(uid);
  }
  console.log(`P5 roster: ${uids.length} students\n`);

  let fixed = 0;
  for (const uid of uids) {
    const ref = db.doc(`progress/${uid}/courses/${P5}/lessons/${LESSON}`);
    const snap = await ref.get();
    if (!snap.exists) continue;
    const data = snap.data();
    const bogus = data[BOGUS_KEY]; // literal top-level key
    if (!bogus) continue;

    // 1. Delete bogus literal key using FieldPath (raw field name)
    await ref.update(new FieldPath(BOGUS_KEY), FieldValue.delete());

    // 2. Write the correct nested answer with updateDoc dotted path
    await ref.update({
      [`answers.${BLOCK}.score`]: bogus.score,
      [`answers.${BLOCK}.maxScore`]: bogus.maxScore,
      [`answers.${BLOCK}.writtenScore`]: bogus.writtenScore,
      [`answers.${BLOCK}.submitted`]: bogus.submitted,
      [`answers.${BLOCK}.completedAt`]: bogus.completedAt,
      [`answers.${BLOCK}.manuallyAwarded`]: bogus.manuallyAwarded,
      [`answers.${BLOCK}.awardedReason`]: bogus.awardedReason,
      [`answers.${BLOCK}.awardedAt`]: bogus.awardedAt,
    });

    fixed++;
    console.log(`  ✅ ${uid} — bogus field deleted, nested answer written`);
  }

  // Verify
  console.log(`\nVerification:`);
  let correct = 0;
  for (const uid of uids) {
    const snap = await db.doc(`progress/${uid}/courses/${P5}/lessons/${LESSON}`).get();
    if (!snap.exists) continue;
    const data = snap.data();
    const nested = data.answers?.[BLOCK];
    const bogus = data[BOGUS_KEY];
    if (nested?.writtenScore != null && !bogus) correct++;
  }
  console.log(`  ${correct} docs correctly shaped after fix`);
  console.log(`\nFixed: ${fixed} docs`);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
