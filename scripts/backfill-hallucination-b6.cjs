// Backfill b6 embed scores for all students who completed the hallucination lab
// but didn't get a b6 score (due to the manual submit button bug).
// Gives 5/5 (writtenScore: 1) to any student with progress on the lesson but no b6.
// Run: node scripts/backfill-hallucination-b6.cjs

const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const saPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (fs.existsSync(saPath)) {
  admin.initializeApp({ credential: admin.credential.cert(require(saPath)) });
} else {
  admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
}
const db = admin.firestore();

const COURSE_IDS = [
  "DacjJ93vUDcwqc260OP3", // Period 5
  "M2MVSXrKuVCD9JQfZZyp", // Period 7
  "Y9Gdhw5MTY8wMFt6Tlvj", // Period 4
  "fUw67wFhAtobWFhjwvZ5", // Period 9
];

async function main() {
  let updated = 0, skipped = 0, noProgress = 0;

  for (const courseId of COURSE_IDS) {
    const enrollSnap = await db.collection("enrollments").get();
    const uids = [];
    enrollSnap.docs.forEach(d => {
      const data = d.data();
      if (data.courseId === courseId && data.uid) uids.push(data.uid);
    });

    console.log(`\n--- ${courseId} (${uids.length} enrolled) ---`);

    for (const uid of uids) {
      const progRef = db.collection("progress").doc(uid)
        .collection("courses").doc(courseId)
        .collection("lessons").doc("hallucination-lab");

      const progDoc = await progRef.get();
      if (!progDoc.exists) {
        noProgress++;
        continue;
      }

      const answers = progDoc.data().answers || {};
      const hasAnyAnswer = Object.keys(answers).length > 0;

      if (!hasAnyAnswer) {
        noProgress++;
        continue;
      }

      // Already has 5/5 — skip
      if (answers.b6 && answers.b6.writtenScore === 1) {
        skipped++;
        continue;
      }

      // Set b6 to 5/5 for everyone (whether they had a lower score or no score)
      await progRef.update({
        "answers.b6": {
          score: 100,
          maxScore: 100,
          writtenScore: 1,
          submitted: true,
          completedAt: new Date().toISOString(),
          backfilled: true, // flag so we know this was a backfill
        },
        lastUpdated: new Date(),
      });
      updated++;
      console.log(`  ${uid}: backfilled b6 = 5/5`);
    }
  }

  console.log(`\nDone: ${updated} backfilled, ${skipped} already had b6, ${noProgress} no progress`);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
