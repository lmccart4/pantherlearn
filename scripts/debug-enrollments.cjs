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

async function main() {
  const cid = "Y9Gdhw5MTY8wMFt6Tlvj";

  // Check enrollment structure
  const snap = await db.collection(`courses/${cid}/enrollments`).limit(3).get();
  console.log("Enrollment docs:");
  snap.docs.forEach(d => console.log("  id:", d.id, "keys:", Object.keys(d.data())));

  // Check if progress docs exist at all for these students
  for (const d of snap.docs) {
    const uid = d.data().uid || d.id;
    console.log(`\n  Checking progress for uid=${uid}...`);
    const progRef = db.doc(`progress/${uid}/courses/${cid}/lessons/attention-visualizer`);
    const progDoc = await progRef.get();
    console.log("    exists:", progDoc.exists);
    if (progDoc.exists) {
      const answers = progDoc.data().answers || {};
      console.log("    answer keys:", Object.keys(answers));
      if (answers.b7) console.log("    b7:", JSON.stringify(answers.b7));
    }
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
