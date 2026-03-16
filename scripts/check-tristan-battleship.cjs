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

const uid = "BNX51wposthEWQiJy5KThyPS5ZV2";

async function main() {
  // Check activities under physics and any section courseIds
  const coursesSnap = await db.collection("courses").get();
  const physicsCourseIds = ["physics"];
  coursesSnap.docs.forEach(d => {
    if (d.data().migratedFrom === "physics") physicsCourseIds.push(d.id);
  });

  console.log("Checking courseIds:", physicsCourseIds);

  for (const cid of physicsCourseIds) {
    const activitiesSnap = await db.collection("progress", uid, "courses", cid, "activities").get();
    if (activitiesSnap.empty) {
      console.log(`  ${cid}: no activities`);
    } else {
      activitiesSnap.docs.forEach(d => {
        console.log(`  ${cid}/activities/${d.id}:`, JSON.stringify(d.data()).slice(0, 200));
      });
    }
  }

  // Also check battleship-specific collections
  const battleshipSnap = await db.collection("courses/physics/battleshipAttempts").get().catch(() => ({ empty: true, docs: [] }));
  if (!battleshipSnap.empty) {
    const tristanDoc = battleshipSnap.docs.find(d => d.id === uid || d.data().uid === uid);
    if (tristanDoc) {
      console.log("\nBattleship attempt found:", JSON.stringify(tristanDoc.data()).slice(0, 300));
    } else {
      console.log("\nNo battleship attempt for Tristan in battleshipAttempts (" + battleshipSnap.size + " total)");
    }
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
