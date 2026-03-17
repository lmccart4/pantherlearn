const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const doc = await db.doc("courses/digital-literacy/lessons/data-literacy-4-cleaning-crime-scene").get();
  const data = doc.data();
  console.log("Title:", data.title);
  console.log("Blocks count:", data.blocks?.length);
  data.blocks?.forEach((b, i) => {
    console.log("\n--- Block", i, "---");
    console.log("id:", b.id, "type:", b.type);
    if (b.content) console.log("content:", b.content.substring(0, 200));
    if (b.url) console.log("url:", b.url);
    if (b.label) console.log("label:", b.label);
  });
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
