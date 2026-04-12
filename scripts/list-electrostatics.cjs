// list-electrostatics.cjs — list every lesson in the Physics / Electrostatics unit
const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

(async () => {
  const snap = await db.collection("courses").doc("physics").collection("lessons")
    .where("unit", "==", "Electrostatics").get();

  const rows = snap.docs.map(d => {
    const x = d.data();
    return {
      id: d.id,
      title: x.title,
      order: x.order ?? "?",
      visible: x.visible === true,
      blocks: (x.blocks || []).length,
    };
  }).sort((a, b) => (a.order || 0) - (b.order || 0) || a.id.localeCompare(b.id));

  console.log(`\nFound ${rows.length} lessons in Physics / Electrostatics:\n`);
  console.log("order  vis  blocks  id / title");
  console.log("-----  ---  ------  ----------");
  rows.forEach(r => {
    const vis = r.visible ? "✅ " : "🔒 ";
    console.log(`  ${String(r.order).padStart(2)}    ${vis}   ${String(r.blocks).padStart(3)}    ${r.id}\n            ${r.title}`);
  });
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
