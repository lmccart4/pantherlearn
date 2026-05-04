const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function main() {
  // Find one progress doc to inspect structure
  const snap = await db.collectionGroup("lessons")
    .where("submitted", "==", true).limit(3).get();
  if (snap.empty) {
    console.log("No submitted lesson progress found");
    return;
  }
  for (const d of snap.docs) {
    console.log("\n=== path:", d.ref.path);
    const data = d.data();
    console.log(JSON.stringify(data, null, 2).slice(0, 1500));
  }
}
main().then(() => process.exit(0)).catch(e => { console.error(e.message); process.exit(1); });
