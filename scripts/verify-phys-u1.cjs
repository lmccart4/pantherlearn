// verify-phys-u1.cjs — whole-unit verifier. Run AFTER all 14 lessons are seeded.
// Asserts: 14 lessons present, order coverage, visible:false, dueDate strings, no dup block IDs,
// embed wiring (scored + correct mode at L7/L13), rubric↔checkpoint linkage on summatives, MC balance.
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const COURSE_ID = 'physics-2026';
const EXPECT = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114];

(async () => {
  const snap = await db.collection('courses').doc(COURSE_ID).collection('lessons').where('unit', '==', 'Unit 1: Energy & the Grid').get();
  const lessons = snap.docs.map(d => d.data()).sort((a, b) => a.order - b.order);
  let ok = true;
  console.log(`Found ${lessons.length} Unit 1 lessons (expect 14).`);
  if (lessons.length !== 14) ok = false;

  // order coverage
  const orders = lessons.map(l => l.order);
  EXPECT.forEach(o => { if (!orders.includes(o)) { console.log(`MISSING order ${o}`); ok = false; } });

  // every lesson: visible:false, dueDate string, blocks present, no dup block IDs
  for (const l of lessons) {
    if (l.visible !== false) { console.log(`⚠️ ${l.id} visible=${l.visible} (want false)`); ok = false; }
    if (typeof l.dueDate !== 'string') { console.log(`⚠️ ${l.id} dueDate not string`); ok = false; }
    const ids = (l.blocks || []).map(b => b.id);
    if (new Set(ids).size !== ids.length) { console.log(`⚠️ ${l.id} DUP block IDs`); ok = false; }
  }

  // embed wiring: scored embeds present + correct mode at L7/L13
  const byOrder = Object.fromEntries(lessons.map(l => [l.order, l]));
  const embedAt = (order, must) => {
    const e = (byOrder[order]?.blocks || []).find(b => b.type === 'embed');
    if (!e) { console.log(`⚠️ order ${order}: no embed`); ok = false; return; }
    if (!e.scored || e.weight !== 5) { console.log(`⚠️ order ${order}: embed not scored/weight5`); ok = false; }
    if (must && !e.url.includes(must)) { console.log(`⚠️ order ${order}: embed url missing ${must}`); ok = false; }
  };
  embedAt(102, 'energy-flow-tracer'); embedAt(103, 'energy-flow-tracer');
  embedAt(106, 'induction-visualizer');
  embedAt(107, 'mode=learn'); embedAt(113, 'mode=design');

  // rubric↔checkpoint linkage on summatives
  [110, 113, 114].forEach(o => {
    const blocks = byOrder[o]?.blocks || [];
    const rub = blocks.find(b => b.type === 'rubric');
    const cp = blocks.find(b => b.type === 'teacher_checkpoint');
    if (!rub || !cp || rub.linkedBlockId !== cp.id) { console.log(`⚠️ order ${o}: rubric/checkpoint not linked`); ok = false; }
  });

  // MC distribution across the unit
  const mcs = lessons.flatMap(l => (l.blocks || []).filter(b => b.type === 'question' && b.questionType === 'multiple_choice'));
  const dist = [0, 0, 0, 0]; mcs.forEach(q => { if (typeof q.correctIndex === 'number') dist[q.correctIndex]++; });
  console.log(`MC correct-position distribution A/B/C/D: ${dist.join('/')} of ${mcs.length}`);
  const maxPct = Math.max(...dist) / Math.max(1, mcs.length);
  if (maxPct > 0.35) { console.log(`⚠️ MC position imbalance: ${(maxPct * 100).toFixed(0)}% on one letter (>35%)`); ok = false; }

  console.log(ok ? '\n✅ Unit 1 verification PASSED' : '\n❌ Unit 1 verification FAILED');
  process.exit(ok ? 0 : 1);
})().catch(e => { console.error(e.message); process.exit(1); });
