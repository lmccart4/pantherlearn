const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const ids = ["DacjJ93vUDcwqc260OP3", "M2MVSXrKuVCD9JQfZZyp", "Y9Gdhw5MTY8wMFt6Tlvj", "fUw67wFhAtobWFhjwvZ5"];
  for (const id of ids) {
    const doc = await db.collection("courses").doc(id).get();
    if (doc.exists) {
      const data = doc.data();
      console.log(`${id}: ${data.title || data.name || "?"} | section: ${data.section || "?"} | parentCourse: ${data.parentCourseId || "?"}`);
    } else {
      console.log(`${id}: NOT FOUND as a course doc`);
    }

    // Sample a biasInvestigation to see student names
    const biasSnap = await db.collection("courses").doc(id).collection("biasInvestigations").get();
    const names = biasSnap.docs.slice(0, 3).map((d) => d.data().studentName || "?");
    console.log(`  Sample students: ${names.join(", ")}`);
    console.log(`  Total: ${biasSnap.size}`);
  }
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
