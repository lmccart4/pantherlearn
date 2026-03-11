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
    const ref = db.doc(`courses/${cid}/lessons/attention-visualizer`);
    const doc = await ref.get();
    if (!doc.exists) {
      console.log(`  SKIP ${cid} — lesson not found`);
      continue;
    }
    const blocks = doc.data().blocks;
    const embed = blocks.find(b => b.id === "b7" && b.type === "embed");
    if (!embed) {
      console.log(`  SKIP ${cid} — no embed block b7`);
      continue;
    }

    // Add scored flag and remove template placeholders from URL
    // (EmbedBlock already injects studentId/courseId params automatically)
    embed.scored = true;
    embed.url = "https://attention-visualizer-paps.web.app";

    await ref.update({ blocks });
    console.log(`  Updated ${cid} — embed b7 now scored:true`);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
