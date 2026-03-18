const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const doc = await db.doc("courses/digital-literacy/lessons/data-literacy-5-chart-crimes").get();
  const data = doc.data();
  console.log("Title:", data.title);
  data.blocks?.forEach((b, i) => {
    if (b.type === "activity" || b.type === "external_link" || b.type === "callout" ||
        (b.content && b.content.includes("http")) ||
        (b.instructions && b.instructions.includes("http"))) {
      console.log(`\nBlock ${i} (${b.id}, ${b.type}):`);
      if (b.content) console.log("content:", b.content.substring(0, 400));
      if (b.instructions) console.log("instructions:", b.instructions.substring(0, 400));
      if (b.url) console.log("url:", b.url);
    }
  });
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
