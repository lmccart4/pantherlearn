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

async function main() {
  for (const cid of courseIds) {
    console.log(`\n=== Course ${cid} ===`);

    // Check lesson exists
    const lessonRef = db.doc(`courses/${cid}/lessons/attention-visualizer`);
    const lessonDoc = await lessonRef.get();
    if (!lessonDoc.exists) {
      console.log("  Lesson not found!");
      continue;
    }
    const blocks = lessonDoc.data().blocks || [];
    const embedBlock = blocks.find(b => b.id === "b7");
    console.log("  Embed block b7:", embedBlock ? `scored=${embedBlock.scored}, url=${embedBlock.url}` : "NOT FOUND");

    // Check enrolled students
    const enrollSnap = await db.collection(`courses/${cid}/enrollments`).get();
    console.log(`  Enrolled students: ${enrollSnap.size}`);

    let found = 0;
    for (const enrollDoc of enrollSnap.docs) {
      const uid = enrollDoc.data().uid || enrollDoc.id;
      const progRef = db.doc(`progress/${uid}/courses/${cid}/lessons/attention-visualizer`);
      const progDoc = await progRef.get();
      if (progDoc.exists) {
        const data = progDoc.data();
        const answers = data.answers || {};
        const b7 = answers.b7;
        if (b7) {
          found++;
          console.log(`  ${uid}: score=${b7.score}/${b7.maxScore} writtenScore=${b7.writtenScore} submitted=${b7.submitted}`);
        }
      }
    }
    if (found === 0) console.log("  No attention visualizer scores found yet");
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
