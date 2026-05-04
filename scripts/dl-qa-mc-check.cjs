// Check MC answer position distribution
const admin = require("firebase-admin");
const KEY_PATH = `${process.env.HOME}/.config/firebase/pantherlearn-admin.json`;
admin.initializeApp({ credential: admin.credential.cert(require(KEY_PATH)), projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const LESSONS = [
  "brand-kit-day1-vibe-check","brand-kit-day2-logo-color-font","brand-kit-day3-instagram-guide-showcase",
  "photo-essay-day1-theme-composition","photo-essay-day2-curate-sequence","photo-essay-day3-layout-showcase",
  "infographic-day1-topic-data","infographic-day2-design","infographic-day3-polish-showcase",
  "short-form-video-day1-deconstruction","short-form-video-day2-script-shoot","short-form-video-day3-edit-capcut","short-form-video-day4-polish-showcase",
  "psa-day1-topic-research","psa-day2-storyboard-design","psa-day3-production","psa-day4-polish-showcase",
];

(async () => {
  const positions = {0:0,1:0,2:0,3:0};
  let total = 0;
  let bad = [];
  for (const id of LESSONS) {
    const snap = await db.doc("courses/digital-literacy/lessons/" + id).get();
    if (!snap.exists) continue;
    const blocks = snap.data().blocks || [];
    for (const b of blocks) {
      if (b.questionType === "multiple_choice" && Array.isArray(b.options)) {
        const correct = b.correctIndex ?? b.correctAnswer;
        let idx = -1;
        if (typeof correct === "number") idx = correct;
        else if (typeof correct === "string") idx = b.options.indexOf(correct);
        if (idx >= 0 && idx <= 3) {
          positions[idx]++;
          total++;
        } else {
          bad.push({lesson: id, prompt: b.prompt?.slice(0,80), correct, options: b.options.length});
        }
      }
    }
  }
  console.log("Total MC questions:", total);
  console.log("Position distribution:");
  for (const [p, n] of Object.entries(positions)) {
    const pct = total ? (n/total*100).toFixed(1) : 0;
    console.log(`  ${["A","B","C","D"][p]} (idx ${p}): ${n} (${pct}%)`);
  }
  if (bad.length) console.log("\nProblematic MC items:", bad);
})().then(()=>process.exit(0)).catch(e=>{console.error(e);process.exit(1);});
