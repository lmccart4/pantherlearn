// Remove empty vocab_list blocks (and their preceding Key Vocabulary section_header)
// across all Digital Literacy lessons. Non-scored blocks, grade-safe.
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

(async () => {
  const snap = await db.collection('courses').doc('digital-literacy').collection('lessons').get();
  let fixed = 0;

  for (const doc of snap.docs) {
    const x = doc.data();
    const blocks = x.blocks || [];

    // Identify indices to remove
    const removeIdx = new Set();
    blocks.forEach((b, i) => {
      if (b.type === 'vocab_list' && (!b.items || b.items.length === 0)) {
        removeIdx.add(i);
        // Also remove an immediately-preceding section_header whose title mentions vocab
        const prev = blocks[i - 1];
        if (prev && prev.type === 'section_header' && /vocab|vocabulary/i.test(prev.title || '')) {
          removeIdx.add(i - 1);
        }
      }
    });

    if (removeIdx.size === 0) continue;

    const newBlocks = blocks.filter((_, i) => !removeIdx.has(i));
    await doc.ref.update({ blocks: newBlocks });
    console.log(`  ${doc.id}: removed ${removeIdx.size} block(s) (${blocks.length} → ${newBlocks.length})`);
    fixed++;
  }

  console.log(`\n✅ Fixed ${fixed} lessons`);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
