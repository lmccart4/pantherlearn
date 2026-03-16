// Add displacement diagram image to the Elastic Potential Energy lesson
// Inserts before the calculator in "Crunching the Numbers" section

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
  if (!doc.exists) {
    console.error("Lesson not found!");
    process.exit(1);
  }

  const blocks = doc.data().blocks || [];

  // Find the index of the calculator block (id: "calc-epe")
  const calcIndex = blocks.findIndex((b) => b.id === "calc-epe");
  if (calcIndex === -1) {
    console.error("Calculator block not found!");
    process.exit(1);
  }

  // Insert image + explanation text before the calculator
  const newBlocks = [
    {
      id: "img-displacement",
      type: "image",
      url: "/images/physics/Elastic-Potential-Energy.jpg",
      alt: "Diagram showing displacement (delta x) measured from a spring's natural length",
      caption: "The displacement (Δx) is measured from the natural length of the spring — its length when no elastic energy is stored."
    },
    {
      id: "text-displacement",
      type: "text",
      content: "Notice in the diagram above: **Δx (displacement)** is always measured from the **natural length** of the system — that's the length the spring would be if no force was applied and no elastic energy was stored in it. Whether the spring is stretched OR compressed, Δx measures how far it's moved from that equilibrium position. This is the **x** in EPE = ½kx²."
    }
  ];

  blocks.splice(calcIndex, 0, ...newBlocks);
  await ref.update({ blocks });
  console.log("Added displacement diagram image and text before calculator block.");
  console.log("Total blocks now:", blocks.length);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
