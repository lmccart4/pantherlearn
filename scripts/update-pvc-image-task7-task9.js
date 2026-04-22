// Swap Task 7 image AND Task 9 Station 1 image to the newly-generated Firebase-hosted PVC stand photo.
// Run: node scripts/update-pvc-image-task7-task9.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE = "physics";
const SLUG = "electrostatics-w31-material-matters";
const NEW_IMG = "https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/w31-pvc-rod-rotating-stand-v2.jpg";
const NEW_CAPTION = "Rotating stand: rub one end of the PVC rod with fur, balance it on the pin, and it swings freely when you bring a magnet or other charged object near.";

// Paths we want to replace — from previous update + existing Task 9 Station 1
const OLD_PATHS = [
  "/images/physics/electrostatics/w31-pvc-rod-rotating-stand.png",
  "/images/physics/electrostatics/w31-station-pvc-rotating.png",
];

async function main() {
  const ref = db.collection("courses").doc(COURSE).collection("lessons").doc(SLUG);
  const snap = await ref.get();
  const data = snap.data();
  const blocks = data.blocks || [];

  let swapped = 0;
  const newBlocks = blocks.map(b => {
    if (b.type === "image" && OLD_PATHS.includes(b.url)) {
      swapped++;
      return { ...b, url: NEW_IMG, caption: NEW_CAPTION };
    }
    return b;
  });

  if (swapped === 0) { console.log("⚠️  No matching image blocks found"); return; }

  const newLesson = { ...data, blocks: newBlocks, updatedAt: new Date() };
  const res = await safeLessonWrite(db, COURSE, SLUG, newLesson);
  console.log(`✅ Swapped ${swapped} image(s) to Firebase-hosted version`);
  console.log(`   ${res.action}  preserved=${res.preserved}`);
  console.log(`   new URL: ${NEW_IMG}`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
