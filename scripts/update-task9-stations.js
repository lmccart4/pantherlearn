// Task 9 edits: rewrite Station 1 (no gray PVC), delete Station 3 entirely, renumber Station 4 → 3,
// update Task 9 header count from "4" to "3".
// Run: node scripts/update-task9-stations.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE = "physics";
const SLUG = "electrostatics-w31-material-matters";

async function main() {
  const ref = db.collection("courses").doc(COURSE).collection("lessons").doc(SLUG);
  const snap = await ref.get();
  const data = snap.data();
  const blocks = data.blocks || [];

  const t9 = blocks.findIndex(b => b.type === "section_header" && /Task 9/i.test(b.title || ""));
  const t10 = blocks.findIndex((b, i) => i > t9 && b.type === "section_header" && /Task 10/i.test(b.title || ""));
  if (t9 < 0 || t10 < 0) { console.error("❌ Could not locate Task 9"); process.exit(1); }

  const newBlocks = blocks.map((b, i) => ({ ...b }));

  // 1. Update Task 9 header — "4" → "3" rotation stations
  if (/4 Rotation Stations/i.test(newBlocks[t9].title || "")) {
    newBlocks[t9].title = newBlocks[t9].title.replace(/4 Rotation Stations/i, "3 Rotation Stations");
  }

  // 2. Rewrite Station 1 text (block [25] in current state)
  const s1Idx = newBlocks.findIndex((b, i) => i > t9 && i < t10 && b.type === "text" && /Station 1/i.test(b.content || ""));
  if (s1Idx >= 0) {
    newBlocks[s1Idx].content = "**Station 1 — Rotating Stand.** Rub the **large white PVC** with fur. Bring it near the **metal-coated PVC** that's balanced on the rotating stand. Observe — does the stand-mounted PVC swing toward it, away from it, or nothing? Now replace the metal-coated PVC with the **regular PVC** on the stand (still rub the large white PVC with fur between trials). Repeat the approach. Which one responds more dramatically — and which way?";
  } else {
    console.error("❌ Station 1 text block not found");
    process.exit(1);
  }

  // 3. Delete Station 3 — find the image + text pair
  const s3TextIdx = newBlocks.findIndex((b, i) => i > t9 && i < t10 && b.type === "text" && /Station 3/i.test(b.content || ""));
  if (s3TextIdx < 0) { console.error("❌ Station 3 text not found"); process.exit(1); }
  // Station 3's image sits right before its text (per current layout)
  const s3ImageIdx = s3TextIdx - 1;
  if (newBlocks[s3ImageIdx].type !== "image") {
    console.error("❌ Expected image block immediately before Station 3 text, got:", newBlocks[s3ImageIdx].type);
    process.exit(1);
  }

  // 4. Renumber Station 4 → Station 3
  const s4TextIdx = newBlocks.findIndex((b, i) => i > t9 && i < t10 && b.type === "text" && /Station 4/i.test(b.content || ""));
  if (s4TextIdx >= 0) {
    newBlocks[s4TextIdx].content = newBlocks[s4TextIdx].content.replace(/\*\*Station 4/i, "**Station 3");
  }

  // Build final block list by removing Station 3's image + text
  const blocksMinusS3 = newBlocks.filter((_, i) => i !== s3ImageIdx && i !== s3TextIdx);

  const newLesson = { ...data, blocks: blocksMinusS3, updatedAt: new Date() };
  const res = await safeLessonWrite(db, COURSE, SLUG, newLesson);
  console.log(`✅ ${res.action}  preserved=${res.preserved}`);
  console.log(`   blocks: ${blocks.length} → ${blocksMinusS3.length}  (deleted 2: S3 image + text)`);
  console.log(`   Station 1 rewritten (no gray PVC)`);
  console.log(`   Station 4 renumbered → Station 3`);
  console.log(`   Task 9 header: "4 Rotation Stations" → "3 Rotation Stations"`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
