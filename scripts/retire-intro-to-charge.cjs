// retire-intro-to-charge.cjs
// Retires the legacy "Introduction to Electric Charge" lesson by marking it
// archived and retitling it. Uses update() (not set()) to preserve block IDs
// in case any progress records exist. Keeps visible:false.
const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

(async () => {
  const ref = db.collection("courses").doc("physics").collection("lessons").doc("intro-to-charge");
  const snap = await ref.get();
  if (!snap.exists) {
    console.log("⚠  intro-to-charge not found — nothing to retire.");
    process.exit(0);
  }
  const cur = snap.data();
  const newTitle = cur.title.startsWith("[RETIRED]") ? cur.title : `[RETIRED] ${cur.title}`;
  await ref.update({
    title: newTitle,
    archived: true,
    visible: false,
    order: 999,
    retiredAt: admin.firestore.FieldValue.serverTimestamp(),
    retiredReason: "Replaced by Week 30 discovery-pedagogy lessons (electrostatics-w30-*)",
  });
  console.log("✅ Retired: intro-to-charge");
  console.log(`   Title → ${newTitle}`);
  console.log(`   visible: false  |  archived: true  |  order: 999`);
  console.log("   (block IDs preserved — used update(), not set())");
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
