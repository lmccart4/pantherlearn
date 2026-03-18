// patch-chart-crimes-lesson.cjs
// Inserts image blocks into the chart-crimes lesson so students can see actual charts.
// Uses safeLessonWrite to preserve existing student progress block IDs.

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const LESSON_PATH = "courses/digital-literacy/lessons/data-literacy-5-chart-crimes";

async function patch() {
  const doc = await db.doc(LESSON_PATH).get();
  const data = doc.data();
  const blocks = [...data.blocks];

  // Check if already patched
  if (blocks.some(b => b.id === "img-chart-a")) {
    console.log("Already patched — image blocks already exist.");
    process.exit(0);
  }

  // Build new blocks to insert:
  // 1. After b2 (index 2): insert two image blocks (Chart A, Chart B) + a caption text
  // 2. After b10 (index of b10): insert the terrible pie chart image

  const b2idx = blocks.findIndex(b => b.id === "b2");
  const b10idx = blocks.findIndex(b => b.id === "b10");

  if (b2idx === -1 || b10idx === -1) {
    console.error("Could not find b2 or b10 — aborting.");
    process.exit(1);
  }

  // Image blocks for the two-chart comparison
  const imgChartA = {
    id: "img-chart-a",
    type: "image",
    url: "/images/chart-crimes/chart-a.svg",
    alt: "Chart A: line chart with y-axis starting at $8 million — growth looks dramatic",
    caption: "Chart A — y-axis truncated to start at $8M",
    width: 620,
    height: 400,
  };

  const imgChartB = {
    id: "img-chart-b",
    type: "image",
    url: "/images/chart-crimes/chart-b.svg",
    alt: "Chart B: same line chart with y-axis starting at $0 — growth looks modest",
    caption: "Chart B — honest zero baseline",
    width: 620,
    height: 400,
  };

  // Image block for the terrible pie chart
  const imgPie = {
    id: "img-pie-crimes",
    type: "image",
    url: "/images/chart-crimes/pie-crimes.svg",
    alt: "A terrible 3D exploding pie chart with 10 gaudy-colored slices, no labels, no legend, and the title Q3 Survey Results",
    caption: "The chart described above — count the crimes",
    width: 620,
    height: 420,
  };

  // Insert after b2 (the two line charts come right after the text description)
  blocks.splice(b2idx + 1, 0, imgChartA, imgChartB);

  // b10 index has shifted by 2 now
  const b10idxNew = blocks.findIndex(b => b.id === "b10");
  blocks.splice(b10idxNew + 1, 0, imgPie);

  // Write back
  await db.doc(LESSON_PATH).update({ blocks });
  console.log(`✓ Patched ${LESSON_PATH}`);
  console.log(`  Inserted: img-chart-a after b2`);
  console.log(`  Inserted: img-chart-b after img-chart-a`);
  console.log(`  Inserted: img-pie-crimes after b10`);
  console.log(`  Total blocks: ${blocks.length}`);
}

patch().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
