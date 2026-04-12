const admin = require('firebase-admin');
const fs = require('fs');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

const COURSE_ID = 'Y9Gdhw5MTY8wMFt6Tlvj';
const FILES = [
  '/tmp/unit5-enhancements.json',
  '/tmp/unit6-enhancements.json',
  '/tmp/unit7-enhancements.json',
];

function addId(block) {
  return { ...block, id: 'b-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36).slice(-4) };
}

function applyEnhancement(oldBlocks, enh) {
  const blocks = oldBlocks.map(b => ({ ...b }));

  // 1. Fill empty section_header titles left-to-right
  const titles = enh.section_header_titles || [];
  let titleIdx = 0;
  let filledTitles = 0;
  for (const b of blocks) {
    if (b.type === 'section_header' && (!b.title || String(b.title).trim() === '')) {
      if (titleIdx < titles.length) {
        b.title = titles[titleIdx];
        titleIdx++;
        filledTitles++;
      }
    }
  }

  // 2. Walk blocks, insert matching new blocks after each index
  const inserts = (enh.new_blocks_after_index || []).map((ins, origIdx) => ({ ...ins, origIdx }));
  const result = [];
  for (let i = 0; i < blocks.length; i++) {
    result.push(blocks[i]);
    const matching = inserts.filter(ins => ins.after === i);
    for (const ins of matching) {
      result.push(addId(ins.block));
    }
  }

  // 3. Append any inserts with after >= blocks.length (e.g., 99) in order
  const tail = inserts
    .filter(ins => ins.after >= blocks.length)
    .sort((a, b) => (a.after - b.after) || (a.origIdx - b.origIdx));
  for (const ins of tail) {
    result.push(addId(ins.block));
  }

  return { blocks: result, filledTitles, addedBlocks: inserts.length };
}

async function main() {
  let totalLessons = 0;
  let totalAddedBlocks = 0;
  let totalFilledTitles = 0;
  const report = [];

  for (const file of FILES) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const unitName = data.unit;
    console.log('\n========================================');
    console.log('APPLYING ' + file + ' (unit: ' + unitName + ')');
    console.log('========================================');

    for (const [lessonId, enh] of Object.entries(data.lessons)) {
      const ref = db.doc('courses/' + COURSE_ID + '/lessons/' + lessonId);
      const snap = await ref.get();
      if (!snap.exists) {
        console.log('  SKIP (not found): ' + lessonId);
        continue;
      }
      const current = snap.data();
      const oldCount = (current.blocks || []).length;
      const { blocks: newBlocks, filledTitles, addedBlocks } = applyEnhancement(current.blocks || [], enh);

      const updatedLesson = {
        ...current,
        blocks: newBlocks,
        unit: unitName,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      const res = await safeLessonWrite(db, COURSE_ID, lessonId, updatedLesson);
      const newCount = newBlocks.length;
      console.log('  ' + lessonId + ': ' + oldCount + ' → ' + newCount + ' blocks (+' + addedBlocks + ' added, ' + filledTitles + ' titles filled) [' + res.action + ']');
      report.push({ lessonId, old: oldCount, new: newCount, added: addedBlocks, titles: filledTitles, unit: unitName });
      totalLessons++;
      totalAddedBlocks += addedBlocks;
      totalFilledTitles += filledTitles;
    }
  }

  console.log('\n========================================');
  console.log('SUMMARY');
  console.log('========================================');
  console.log('Lessons enhanced: ' + totalLessons);
  console.log('Blocks added:     ' + totalAddedBlocks);
  console.log('Titles filled:    ' + totalFilledTitles);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
