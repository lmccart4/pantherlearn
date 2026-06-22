// patch-psa-day2-day-refs.cjs
// Targeted, ID-preserving fix for PSA Sprint Day 2: Day 1 was YESTERDAY (Tue 5/19),
// not before a weekend, and production day is tomorrow (not "Wednesday").
// In-place edit of two block content strings — does NOT touch any other block,
// so prior date patches (e.g. "Thu 5/21" on callout-due) are preserved.
// Run: GOOGLE_APPLICATION_CREDENTIALS=~/.config/firebase/pantherlearn-admin.json node scripts/patch-psa-day2-day-refs.cjs

const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.applicationDefault(), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const COURSE_ID = "digital-literacy";
const LESSON_ID = "psa-day2-storyboard-design";

const EDITS = [
  {
    id: "q-warmup",
    field: "prompt",
    find: "Has anything changed over the weekend?",
    replace: "Has anything changed since yesterday?",
  },
  {
    id: "b-checkoff",
    field: "content",
    find: "letting it eat your whole Wednesday.",
    replace: "letting it eat your whole production day tomorrow.",
  },
];

(async () => {
  const ref = db.collection("courses").doc(COURSE_ID).collection("lessons").doc(LESSON_ID);
  const snap = await ref.get();
  if (!snap.exists) throw new Error("Lesson not found");
  const blocks = snap.data().blocks || [];

  let applied = 0;
  for (const edit of EDITS) {
    const block = blocks.find((b) => b.id === edit.id);
    if (!block) { console.warn(`  ! block ${edit.id} not found`); continue; }
    const before = block[edit.field] || "";
    if (!before.includes(edit.find)) { console.warn(`  ! text not found in ${edit.id} (${edit.field}) — already patched?`); continue; }
    block[edit.field] = before.replace(edit.find, edit.replace);
    applied++;
    console.log(`  ✓ ${edit.id}.${edit.field}`);
  }

  // Write back the full blocks array — all IDs and order preserved (in-place string edits only)
  await ref.update({ blocks, updatedAt: new Date() });
  console.log(`Patched ${applied}/${EDITS.length} blocks in ${COURSE_ID}/${LESSON_ID}`);
})().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
