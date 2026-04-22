const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
(async () => {
  const snap = await db.collection("courses/digital-literacy/lessons").get();
  const rows = [];
  snap.forEach(d => {
    const x = d.data();
    rows.push({ id: d.id, order: x.order ?? 999, unit: x.unit||"", visible: x.visible, title: x.title });
  });
  rows.sort((a,b)=>a.order-b.order);
  rows.forEach(r => console.log(`${String(r.order).padStart(3)} vis=${r.visible?"T":"F"} ${r.id}  [${r.unit}]  ${r.title}`));
  console.log(`\nTotal: ${rows.length}`);
})().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
