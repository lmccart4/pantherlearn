// Update Task 7 in physics "Is It Magnetism? + Material Matters" lesson.
// Swaps balloon-vs-magnet test for charged-PVC-rod-on-rotating-stand test with both magnet poles.
//
// Run: node scripts/update-is-it-magnetism-task7.js

import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const COURSE = "physics";
const SLUG = "electrostatics-w31-material-matters";

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

async function main() {
  const ref = db.collection("courses").doc(COURSE).collection("lessons").doc(SLUG);
  const snap = await ref.get();
  if (!snap.exists) { console.error(`❌ ${SLUG} not found`); process.exit(1); }

  const data = snap.data();
  const blocks = data.blocks || [];

  // Find Task 7 section_header
  const t7Idx = blocks.findIndex(b => b.type === "section_header" && /Task 7/i.test(b.title || ""));
  if (t7Idx < 0) { console.error("❌ Could not find Task 7 section header"); process.exit(1); }

  // Find the next section_header (Task 8) so we know where Task 7 ends
  const t8Idx = blocks.findIndex((b, i) => i > t7Idx && b.type === "section_header");
  if (t8Idx < 0) { console.error("❌ Could not find end of Task 7"); process.exit(1); }

  console.log(`Replacing blocks [${t7Idx}..${t8Idx - 1}] (${t8Idx - t7Idx} blocks)`);
  console.log("Old Task 7 content:");
  blocks.slice(t7Idx, t8Idx).forEach((b, i) => {
    const txt = b.prompt || b.title || b.content || b.url || "";
    console.log(`  [${t7Idx + i}] ${b.type}  ${String(txt).slice(0, 80)}`);
  });

  const newTask7 = [
    {
      id: blocks[t7Idx].id, type: "section_header",
      title: "Task 7 — Charged PVC Rod vs. Both Magnet Poles",
    },
    {
      id: uid(), type: "image",
      url: "/images/physics/electrostatics/w31-pvc-rod-rotating-stand.png",
      caption: "Rotating stand: rub one end of the PVC rod with fur, balance it on the pin, and it can swing freely toward or away from whatever you bring near it.",
    },
    {
      id: uid(), type: "text",
      content: "**Procedure:**\n\n1. Rub **one end** of a PVC rod thoroughly with the fur (give it 10+ hard strokes).\n2. Balance the rod on the rotating stand with the charged end pointing outward, so it can swing freely.\n3. Slowly bring the **N pole** of a bar magnet near the charged end. Don't touch it — just approach. Watch carefully.\n4. Reset if needed. Re-charge if the rod has drifted.\n5. Slowly bring the **S pole** near the charged end. Again — approach, don't touch. Watch carefully.\n6. Record what you see for each pole. Be specific: *attract / repel / nothing / weak / strong.*",
    },
    {
      id: uid(), type: "callout", style: "info",
      content: "**Think about what you know:** If this charge-from-rubbing effect were actually magnetism, the rod should behave like a magnet — meaning one pole of the bar magnet should attract it and the other should repel it (from Task 6's rules).",
    },
    {
      id: uid(), type: "question", questionType: "short_answer",
      prompt: "Record your observations.\n\n• **N pole near the charged end:** what happened?\n• **S pole near the charged end:** what happened?\n\nThen make a claim: **Is the force caused by rubbing the PVC with fur magnetic?** Use the rules you wrote in Task 6 (same poles ___, opposite poles ___) as your reasoning. If it were magnetic, you'd expect one pole to attract and the other to repel — what did you actually see?",
    },
  ];

  const newBlocks = [
    ...blocks.slice(0, t7Idx),
    ...newTask7,
    ...blocks.slice(t8Idx),
  ];

  const newLesson = { ...data, blocks: newBlocks, updatedAt: new Date() };
  const res = await safeLessonWrite(db, COURSE, SLUG, newLesson);
  console.log(`\n✅ ${res.action}  preserved=${res.preserved}`);
  console.log(`   ${newBlocks.length} blocks total (was ${blocks.length})`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
