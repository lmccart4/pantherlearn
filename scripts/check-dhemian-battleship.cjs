const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  // Find Dhemian's student record
  const users = await db.collection("users").get();
  const matches = users.docs.filter(d => {
    const data = d.data();
    const name = (data.displayName || data.name || data.email || "").toLowerCase();
    return name.includes("dhemian") || name.includes("dhemi");
  });

  if (matches.length === 0) {
    console.log("No user found with name containing 'dhemian'");
    // Try enrollments
    const enrollments = await db.collection("enrollments").get();
    enrollments.docs.forEach(d => {
      const data = d.data();
      if ((data.studentName || data.displayName || data.email || "").toLowerCase().includes("dhemi")) {
        console.log("Found in enrollments:", d.id, JSON.stringify(data));
      }
    });
    return;
  }

  for (const u of matches) {
    const data = u.data();
    console.log("Found user:", u.id, "name:", data.displayName || data.name, "email:", data.email);

    // Check progress across AI Literacy course IDs
    const courseIds = ["Y9Gdhw5MTY8wMFt6Tlvj", "DacjJ93vUDcwqc260OP3", "M2MVSXrKuVCD9JQfZZyp", "fUw67wFhAtobWFhjwvZ5", "ai-literacy"];
    for (const cid of courseIds) {
      const lessons = await db.collection(`courses/${cid}/lessons`).get();
      for (const l of lessons.docs) {
        if (!l.id.includes("battleship")) continue;
        const progress = await db.doc(`courses/${cid}/lessons/${l.id}/progress/${u.id}`).get();
        if (progress.exists) {
          console.log(`\nProgress in ${cid}/${l.id}:`);
          console.log(JSON.stringify(progress.data(), null, 2));
        } else {
          console.log(`No progress doc: ${cid}/${l.id}/progress/${u.id}`);
        }
      }
    }
  }
}

check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
