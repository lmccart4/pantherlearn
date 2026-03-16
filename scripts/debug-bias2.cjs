const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const snap = await db.collection("courses").doc("ai-literacy").collection("biasInvestigations").get();
  console.log("Total biasInvestigations docs:", snap.size);

  const byStudent = {};
  snap.docs.forEach((d) => {
    const data = d.data();
    const name = data.studentName || data.studentId || "unknown";
    const status = data.status || "?";
    if (!byStudent[name]) byStudent[name] = [];
    byStudent[name].push({ id: d.id, status, score: data.score, caseId: data.caseId });
  });

  for (const [name, entries] of Object.entries(byStudent)) {
    console.log(`\n${name}:`);
    entries.forEach((e) => console.log(`  ${e.caseId} | status: ${e.status} | score: ${e.score}`));
  }
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
