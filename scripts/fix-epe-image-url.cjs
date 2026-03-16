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
  const ref = db.collection("courses").doc("physics").collection("lessons").doc("elastic-potential-energy");
  const doc = await ref.get();
  const blocks = doc.data().blocks;
  const imgBlock = blocks.find(b => b.id === "img-displacement");

  // Try absolute URL
  imgBlock.url = "https://pantherlearn.web.app/images/physics/Elastic-Potential-Energy.jpg";

  await ref.update({ blocks });
  console.log("Updated image URL to absolute:", imgBlock.url);
}
main().then(() => process.exit(0));
