const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const UID = "qJ5CCFsZvfXo20tS2eTAHuaI1zw2";

async function check() {
  // Check all progress docs for this user across all AI literacy courses
  const courseIds = ["Y9Gdhw5MTY8wMFt6Tlvj", "DacjJ93vUDcwqc260OP3", "M2MVSXrKuVCD9JQfZZyp", "fUw67wFhAtobWFhjwvZ5"];

  for (const cid of courseIds) {
    const lessons = await db.collection(`courses/${cid}/lessons`).get();
    const progDocs = [];
    for (const l of lessons.docs) {
      const p = await db.doc(`courses/${cid}/lessons/${l.id}/progress/${UID}`).get();
      if (p.exists) progDocs.push({ lesson: l.id, data: p.data() });
    }
    if (progDocs.length > 0) {
      console.log(`\n=== Course ${cid} ===`);
      progDocs.forEach(p => {
        const d = p.data;
        console.log(`  ${p.lesson}: score=${d.score ?? 'none'} writtenScore=${d.writtenScore ?? 'none'} completed=${d.completed ?? false}`);
      });
    }
  }

  // Also check enrollments to confirm which period
  const enrollments = await db.collection("enrollments").where("studentId", "==", UID).get();
  console.log("\n=== Enrollments ===");
  enrollments.docs.forEach(d => console.log(" ", d.id, JSON.stringify(d.data())));
}

check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
