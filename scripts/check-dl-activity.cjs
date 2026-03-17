const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const ids = [
    "data-literacy-2-getting-hands-dirty",
    "data-literacy-3-let-computer-do-math",
    "data-literacy-4-cleaning-crime-scene"
  ];
  
  for (const id of ids) {
    const doc = await db.doc("courses/digital-literacy/lessons/" + id).get();
    const data = doc.data();
    console.log("\n\n===== " + data.title + " =====");
    data.blocks?.forEach((b, i) => {
      if (b.type === "activity") {
        console.log("\n  Activity Block (id:", b.id + "):");
        console.log(JSON.stringify(b, null, 2).substring(0, 2000));
      }
    });
  }
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
