const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();
(async () => {
  const snap = await db.collection("courses/digital-literacy/lessons").get();
  const rows = [];
  snap.forEach(d => {
    const x = d.data();
    rows.push({ id: d.id, order: x.order ?? 999, unit: x.unit || "", visible: x.visible, title: x.title, dueDate: x.dueDate || "", publishDate: x.publishDate || "" });
  });
  rows.sort((a,b)=> (a.dueDate||"z").localeCompare(b.dueDate||"z"));
  rows.filter(r => (r.dueDate >= "2026-04-20" && r.dueDate <= "2026-04-27") || (r.publishDate >= "2026-04-20" && r.publishDate <= "2026-04-27")).forEach(r => {
    console.log(`due=${r.dueDate} pub=${r.publishDate} vis=${r.visible?"T":"F"} ${r.id} [${r.unit}] ${r.title}`);
  });
})().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
