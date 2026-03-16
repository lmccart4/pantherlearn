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
  const doc = await db.collection("courses").doc("physics").collection("lessons").doc("elastic-potential-energy").get();
  const blocks = doc.data().blocks;
  const imgBlock = blocks.find(b => b.id === "img-displacement");
  console.log("Image block:", JSON.stringify(imgBlock, null, 2));
}
main().then(() => process.exit(0));
