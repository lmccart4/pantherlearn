const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  // Check all courses for biasInvestigations
  const courses = await db.collection("courses").get();
  for (const c of courses.docs) {
    const snap = await db.collection("courses").doc(c.id).collection("biasInvestigations").get();
    if (snap.size > 0) console.log(`${c.id}: ${snap.size} biasInvestigations`);
  }

  // Check top-level collection
  try {
    const topSnap = await db.collection("biasInvestigations").get();
    if (topSnap.size > 0) console.log(`TOP-LEVEL: ${topSnap.size} biasInvestigations`);
    else console.log("TOP-LEVEL: 0");
  } catch (e) {
    console.log("TOP-LEVEL: error -", e.message);
  }

  // Check if BiasDetective data might be in a different collection name
  // Look for any collection with "bias" in the name at the root
  console.log("\nDone checking.");
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
