const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  // Check the ai-literacy course doc
  const aiDoc = await db.doc("courses/ai-literacy").get();
  if (aiDoc.exists) {
    const data = aiDoc.data();
    console.log("ai-literacy:", JSON.stringify({ title: data.title, sections: Object.keys(data.sections || {}) }, null, 2));
  }

  // Check a section course doc
  const secDoc = await db.doc("courses/DacjJ93vUDcwqc260OP3").get();
  if (secDoc.exists) {
    const data = secDoc.data();
    const keys = Object.keys(data);
    console.log("\nSection doc keys:", keys);
    console.log("Title:", data.title);
    console.log("Has lessons subcollection?");
    const lessonsSnap = await db.collection("courses/DacjJ93vUDcwqc260OP3/lessons").get();
    console.log("  Lessons:", lessonsSnap.size);
  }
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
