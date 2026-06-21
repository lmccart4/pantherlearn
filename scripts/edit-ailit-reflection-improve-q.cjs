// Edit AI Lit course-reflection-synthesis across all 4 period sections:
//  1. Replace the "5-year message to yourself" question (id 7813998c) with a
//     course-improvement question.
//  2. Make it the LAST question (after the "advice to next year's student" Q,
//     id 1ec6ae08) but still BEFORE the sorting activity.
//  3. Drop the "Last one:" lead-in from 1ec6ae08 since it's no longer last.
// Safe: lesson is visible:false with 0 student responses in every section.
// Preserves all block IDs; reorders only within the blocks array; updateDoc (not set).

const admin = require("firebase-admin");
admin.initializeApp({ credential: admin.credential.cert(require("/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json")) });
const db = admin.firestore();

const COURSES = {
  "AI Lit P4": "Y9Gdhw5MTY8wMFt6Tlvj",
  "AI Lit P5": "DacjJ93vUDcwqc260OP3",
  "AI Lit P7": "M2MVSXrKuVCD9JQfZZyp",
  "AI Lit P9": "fUw67wFhAtobWFhjwvZ5",
};
const LESSON = "course-reflection-synthesis";
const IMPROVE_ID = "7813998c"; // was the 5-year-message question
const ADVICE_ID = "1ec6ae08";  // "advice to next year's student"

const IMPROVE_TEXT =
  "One last reflection — and this one actually shapes the class. If you were in charge, what is **one thing you would change about this course** to make it better for next year's students? It could be a topic, an activity, the pace, the tools, or how something was taught. Be specific, and explain *why* that change would help. Honest, constructive answers genuinely influence how this course gets taught — so tell me the truth.";

const ADVICE_TEXT =
  "What advice would you give to a student who's about to start this course next year? What should they know going in?";

(async () => {
  for (const [label, cid] of Object.entries(COURSES)) {
    const ref = db.doc(`courses/${cid}/lessons/${LESSON}`);
    const snap = await ref.get();
    if (!snap.exists) { console.log(`SKIP ${label}: lesson missing`); continue; }
    const data = snap.data();
    const resp = await ref.collection("responses").get();
    if (resp.size > 0) { console.log(`ABORT ${label}: ${resp.size} responses — not touching`); continue; }

    const blocks = data.blocks.slice();
    const iImp = blocks.findIndex(b => b.id === IMPROVE_ID);
    const iAdv = blocks.findIndex(b => b.id === ADVICE_ID);
    const iSort = blocks.findIndex(b => b.type === "sorting");
    if (iImp < 0 || iAdv < 0 || iSort < 0) { console.log(`SKIP ${label}: expected blocks not found (imp=${iImp} adv=${iAdv} sort=${iSort})`); continue; }
    const SORT_ID = blocks[iSort].id;

    // 1. rewrite content (preserve id/type/questionType/everything else)
    blocks[iImp] = { ...blocks[iImp], content: IMPROVE_TEXT, prompt: IMPROVE_TEXT };
    blocks[iAdv] = { ...blocks[iAdv], content: ADVICE_TEXT, prompt: ADVICE_TEXT };

    // 2. reorder: pull improve block out, reinsert it immediately before the sorting block
    const improveBlock = blocks.splice(iImp, 1)[0];
    const sortIdxNow = blocks.findIndex(b => b.id === SORT_ID);
    blocks.splice(sortIdxNow, 0, improveBlock);

    // sanity: improve must now sit right before sorting, and after advice
    const fImp = blocks.findIndex(b => b.id === IMPROVE_ID);
    const fAdv = blocks.findIndex(b => b.id === ADVICE_ID);
    const fSort = blocks.findIndex(b => b.id === SORT_ID);
    if (!(fAdv < fImp && fImp === fSort - 1)) {
      console.log(`ABORT ${label}: order check failed (adv=${fAdv} imp=${fImp} sort=${fSort})`); continue;
    }
    if (blocks.length !== data.blocks.length) { console.log(`ABORT ${label}: block count changed`); continue; }

    await ref.update({ blocks });
    console.log(`OK ${label}: improve-Q rewritten + moved to last (idx ${fImp}, before sorting ${fSort}); advice lead-in trimmed`);
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
