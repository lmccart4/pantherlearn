/**
 * One-off: move the "connected domains" image in ai-real-world-synthesis
 * from after Part 1 header to right after the Warm Up header.
 * Preserves the image block's existing ID — no grade impact (image isn't scored).
 */
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const COURSE_IDS = [
  'Y9Gdhw5MTY8wMFt6Tlvj',
  'DacjJ93vUDcwqc260OP3',
  'M2MVSXrKuVCD9JQfZZyp',
  'fUw67wFhAtobWFhjwvZ5',
];

const LESSON_ID = 'ai-real-world-synthesis';
const IMAGE_FILENAME = 'ai-literacy-synthesis-connected-domains.jpg';
const WARMUP_HEADER_ID = 'sh-warmup';

async function move(courseId) {
  const ref = db.collection('courses').doc(courseId).collection('lessons').doc(LESSON_ID);
  const snap = await ref.get();
  if (!snap.exists) { console.log(`  SKIP — not found: ${courseId}`); return; }

  const blocks = [...(snap.data().blocks || [])];
  const imgIdx = blocks.findIndex(b => (b.type === 'image' || b.url) && typeof b.url === 'string' && b.url.includes(IMAGE_FILENAME));
  const warmupIdx = blocks.findIndex(b => b.id === WARMUP_HEADER_ID);

  if (imgIdx < 0) { console.log(`  SKIP — image not found in ${courseId}`); return; }
  if (warmupIdx < 0) { console.log(`  SKIP — warm-up header not found in ${courseId}`); return; }

  if (imgIdx === warmupIdx + 1) {
    console.log(`  ✓ Already in place: ${courseId}`);
    return;
  }

  const [imgBlock] = blocks.splice(imgIdx, 1);
  const newWarmupIdx = blocks.findIndex(b => b.id === WARMUP_HEADER_ID);
  blocks.splice(newWarmupIdx + 1, 0, imgBlock);

  await ref.update({ blocks });
  console.log(`  ✓ Moved in ${courseId} (image id: ${imgBlock.id})`);
}

(async () => {
  for (const c of COURSE_IDS) await move(c);
  console.log('Done.');
  process.exit(0);
})();
