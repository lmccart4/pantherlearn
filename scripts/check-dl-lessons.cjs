const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const lessonIds = [
    "data-literacy-2-getting-hands-dirty",
    "data-literacy-3-let-computer-do-math",
    "data-literacy-4-cleaning-crime-scene"
  ];
  
  for (const id of lessonIds) {
    const doc = await db.doc("courses/digital-literacy/lessons/" + id).get();
    if (!doc.exists) { console.log(id + ": NOT FOUND"); continue; }
    const data = doc.data();
    console.log("\n=== " + data.title + " ===");
    if (data.blocks) {
      data.blocks.forEach(b => {
        if (b.type === "external_link" || (b.content && b.content.includes("docs.google.com")) || (b.url && b.url.includes("docs.google.com"))) {
          console.log("  BLOCK:", JSON.stringify(b, null, 2));
        }
      });
    }
  }
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
