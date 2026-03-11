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

const courseIds = [
  "Y9Gdhw5MTY8wMFt6Tlvj", // Period 4
  "DacjJ93vUDcwqc260OP3", // Period 5
  "M2MVSXrKuVCD9JQfZZyp", // Period 7
  "fUw67wFhAtobWFhjwvZ5", // Period 9
];

const BONUS = 3; // points to add (out of 100)

async function main() {
  // Enrollments are a flat collection with courseId field
  const enrollSnap = await db.collection("enrollments").get();
  const courseStudents = {};
  for (const cid of courseIds) courseStudents[cid] = new Set();

  enrollSnap.forEach((d) => {
    const data = d.data();
    if (courseIds.includes(data.courseId) && data.uid) {
      courseStudents[data.courseId].add(data.uid);
    }
  });

  let updated = 0;
  for (const cid of courseIds) {
    const uids = courseStudents[cid];
    console.log(`\n=== Course ${cid} (${uids.size} enrolled) ===`);

    for (const uid of uids) {
      const progRef = db.doc(`progress/${uid}/courses/${cid}/lessons/attention-visualizer`);
      const progDoc = await progRef.get();
      if (!progDoc.exists) continue;

      const data = progDoc.data();
      const answers = data.answers || {};
      const b7 = answers.b7;
      if (!b7 || !b7.submitted || b7.score == null) continue;

      const oldScore = b7.score;
      const maxScore = b7.maxScore || 100;
      const newScore = Math.min(oldScore + BONUS, maxScore);
      const newWrittenScore = Math.min(newScore / maxScore, 1);

      console.log(`  ${uid}: ${oldScore} → ${newScore} (writtenScore: ${b7.writtenScore?.toFixed(4)} → ${newWrittenScore.toFixed(4)})`);

      await progRef.update({
        "answers.b7.score": newScore,
        "answers.b7.writtenScore": newWrittenScore,
      });
      updated++;
    }
  }
  console.log(`\nDone. Updated ${updated} student scores.`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
