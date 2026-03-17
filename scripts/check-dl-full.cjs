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
      if (b.type === "external_link" || b.type === "activity" || 
          (b.content && (b.content.includes("http") || b.content.includes("google"))) ||
          b.url || b.href) {
        console.log("\n  Block", i, "(id:", b.id + ", type:", b.type + "):");
        console.log("  content:", b.content?.substring(0, 300) || "(none)");
        if (b.url) console.log("  url:", b.url);
        if (b.href) console.log("  href:", b.href);
        if (b.steps) console.log("  steps:", JSON.stringify(b.steps).substring(0, 300));
      }
    });
  }
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
