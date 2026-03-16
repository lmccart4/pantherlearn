const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const sectionIds = ["DacjJ93vUDcwqc260OP3", "M2MVSXrKuVCD9JQfZZyp", "Y9Gdhw5MTY8wMFt6Tlvj", "fUw67wFhAtobWFhjwvZ5"];

  for (const id of sectionIds) {
    const snap = await db.collection("courses").doc(id).collection("biasInvestigations").get();
    console.log(`\n=== ${id} (${snap.size} docs) ===`);
    snap.docs.slice(0, 3).forEach((d) => {
      const data = d.data();
      console.log(`  ${data.studentName}: status=${data.status}, score=${JSON.stringify(data.score)}, clues=${(data.discoveredClues||[]).length}, biases=${(data.biasReport?.identifiedBiases||[]).length}`);
    });
  }
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
