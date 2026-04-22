const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

(async () => {
  // Known-live lesson with expected activity
  const known = "data-literacy-5-chart-crimes";
  const prog = await db.collection(`courses/digital-literacy/lessons/${known}/progress`).get();
  console.log(`${known} progress subcoll: ${prog.size}`);

  // Try alternate: studentProgress collectionGroup by lessonId
  try {
    const cg = await db.collectionGroup("progress").where("lessonId","==","algorithm-how-it-works").limit(10).get();
    console.log(`collectionGroup(progress) for algorithm-how-it-works: ${cg.size}`);
  } catch(e){ console.log("cg err:", e.message); }

  // Check root progress collection
  try {
    const root = await db.collection("studentProgress").limit(3).get();
    console.log(`root studentProgress exists, ${root.size} samples`);
    root.forEach(d => console.log(" sample id:", d.id, "keys:", Object.keys(d.data()).slice(0,8)));
  } catch(e){}

  // Look for any doc referencing algorithm-how-it-works anywhere via collectionGroup on common names
  for (const name of ["lessonProgress","userProgress","scores","submissions"]) {
    try {
      const cg = await db.collectionGroup(name).where("lessonId","==","algorithm-how-it-works").limit(5).get();
      if (cg.size) console.log(`cg(${name}): ${cg.size} hits`);
    } catch(e){}
  }
})().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
