const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");
const saPath = path.join(__dirname, "..", "serviceAccountKey.json");
if (fs.existsSync(saPath)) {
  admin.initializeApp({ credential: admin.credential.cert(require(saPath)) });
} else {
  admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
}
const db = admin.firestore();

async function main() {
  const showcase = await db.doc("courses/digital-literacy/lessons/gaming-showcase-day").get();
  const refine = await db.doc("courses/digital-literacy/lessons/gaming-refine-review").get();

  console.log("=== SHOWCASE DAY ===");
  console.log("Title:", showcase.data().title);
  console.log("Blocks:", showcase.data().blocks?.length);
  showcase.data().blocks?.forEach((b, i) => console.log(`  ${i}: [${b.type}] ${b.title || b.prompt?.slice(0, 60) || b.content?.slice(0, 60) || b.id}`));

  console.log("\n=== REFINE & REVIEW ===");
  console.log("Title:", refine.data().title);
  console.log("Blocks:", refine.data().blocks?.length);
  refine.data().blocks?.forEach((b, i) => console.log(`  ${i}: [${b.type}] ${b.title || b.prompt?.slice(0, 60) || b.content?.slice(0, 60) || b.id}`));
}
main().then(() => process.exit(0));
