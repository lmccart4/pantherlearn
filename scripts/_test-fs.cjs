const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

(async () => {
  // Simple direct read first
  try {
    const c = await db.collection("courses").limit(2).get();
    console.log("courses query:", c.size, "docs");
    c.forEach(d => console.log(" -", d.id, "title:", d.data().title || d.data().name));
  } catch (e) {
    console.log("ERR courses:", e.message);
  }
  // Try a known doc
  try {
    const doc = await db.doc("courses/Y9Gdhw5MTY8wMFt6Tlvj").get();
    console.log("\nP4 course doc exists:", doc.exists, "title:", doc.data()?.title || doc.data()?.name);
  } catch (e) {
    console.log("ERR P4:", e.message);
  }
})();
