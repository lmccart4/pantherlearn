const admin = require('firebase-admin');
const fs = require('fs');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

const SECTIONS = [
  { id: 'Y9Gdhw5MTY8wMFt6Tlvj', label: 'P4', skipDeleteAndEnhance: true }, // already done
  { id: 'DacjJ93vUDcwqc260OP3', label: 'P5' },
  { id: 'M2MVSXrKuVCD9JQfZZyp', label: 'P7' },
  { id: 'fUw67wFhAtobWFhjwvZ5', label: 'P9' },
];

const DELETE_IDS = [
  'ai-and-your-career',
  'ai-policy-lab',
  'final-project-launch',
  'final-project-presentations',
  'cb1e0c38',
  'baa8f813',
  'ai-values-corporate-power',
];

const ENHANCEMENT_FILES = [
  '/tmp/unit5-enhancements.json',
  '/tmp/unit6-enhancements.json',
  '/tmp/unit7-enhancements.json',
];

// Canonical unit labels for the April 8 lessons
const APRIL8_UNIT_MAP = {
  'ai-everywhere-edtech': 'AI in the Real World',
  'ai-agents-from-chatbots': 'Hands-On AI Workshop',
  'ai-when-should-ai-think': 'Futures & Choices',
  'ai-dead-classroom': 'Futures & Choices',
};

function addId(block) {
  return { ...block, id: 'b-' + Math.random().toString(36).slice(2, 10) + '-' + Date.now().toString(36).slice(-4) };
}

function applyEnhancement(oldBlocks, enh) {
  const blocks = oldBlocks.map(b => ({ ...b }));
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
  const inserts = (enh.new_blocks_after_index || []).map((ins, i) => ({ ...ins, origIdx: i }));
  const result = [];
  for (let i = 0; i < blocks.length; i++) {
    result.push(blocks[i]);
    const matching = inserts.filter(ins => ins.after === i);
    for (const ins of matching) result.push(addId(ins.block));
  }
  const tail = inserts
    .filter(ins => ins.after >= blocks.length)
    .sort((a, b) => (a.after - b.after) || (a.origIdx - b.origIdx));
  for (const ins of tail) result.push(addId(ins.block));
  return { blocks: result, filledTitles, addedBlocks: inserts.length };
}

async function checkNoProgress(courseId, lessonId) {
  const enrollSnap = await db.collection('enrollments').where('courseId', '==', courseId).get();
  for (const doc of enrollSnap.docs) {
    const uid = doc.data().uid || doc.data().studentUid;
    if (!uid) continue;
    const progSnap = await db.collection('progress').doc(uid)
      .collection('courses').doc(courseId)
      .collection('lessons').doc(lessonId).get();
    if (progSnap.exists) {
      const d = progSnap.data();
      if (d.completed || (d.answers && Object.keys(d.answers).length > 0) || (d.scores && Object.keys(d.scores).length > 0)) {
        return false;
      }
    }
  }
  return true;
}

async function processSection(section) {
  console.log('\n════════════════════════════════════════════');
  console.log('SECTION: ' + section.label + ' (' + section.id + ')');
  console.log('════════════════════════════════════════════');
  const courseId = section.id;

  if (!section.skipDeleteAndEnhance) {
    // 1. Delete 7 lessons (with progress check)
    console.log('\n-- Deletions --');
    for (const lessonId of DELETE_IDS) {
      const ref = db.doc('courses/' + courseId + '/lessons/' + lessonId);
      const doc = await ref.get();
      if (!doc.exists) { console.log('  SKIP (not found): ' + lessonId); continue; }
      const d = doc.data();
      if (d.visible === true) {
        console.log('  REFUSED (visible=true): ' + lessonId);
        continue;
      }
      const safe = await checkNoProgress(courseId, lessonId);
      if (!safe) {
        console.log('  REFUSED (student progress exists): ' + lessonId);
        continue;
      }
      await ref.delete();
      console.log('  DELETED: ' + lessonId + ' — ' + (d.title || ''));
    }

    // 2. Apply enhancement JSONs
    console.log('\n-- Enhancements --');
    let addedTotal = 0;
    let titleTotal = 0;
    for (const file of ENHANCEMENT_FILES) {
      const data = JSON.parse(fs.readFileSync(file, 'utf8'));
      const unitName = data.unit;
      for (const [lessonId, enh] of Object.entries(data.lessons)) {
        const ref = db.doc('courses/' + courseId + '/lessons/' + lessonId);
        const snap = await ref.get();
        if (!snap.exists) { console.log('  SKIP (not found): ' + lessonId); continue; }
        const current = snap.data();
        const oldCount = (current.blocks || []).length;
        const { blocks: newBlocks, filledTitles, addedBlocks } = applyEnhancement(current.blocks || [], enh);
        const updated = {
          ...current,
          blocks: newBlocks,
          unit: unitName,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };
        const res = await safeLessonWrite(db, courseId, lessonId, updated);
        console.log('  ' + lessonId + ': ' + oldCount + ' → ' + newBlocks.length + ' (+' + addedBlocks + ', ' + filledTitles + ' titles) [' + res.action + ']');
        addedTotal += addedBlocks;
        titleTotal += filledTitles;
      }
    }
    console.log('  Section totals — blocks added: ' + addedTotal + ', titles filled: ' + titleTotal);
  } else {
    console.log('\n-- Skipping deletions + enhancements (already done) --');
  }

  // 3. Normalize April 8 unit labels
  console.log('\n-- April 8 unit normalization --');
  for (const [lessonId, targetUnit] of Object.entries(APRIL8_UNIT_MAP)) {
    const ref = db.doc('courses/' + courseId + '/lessons/' + lessonId);
    const doc = await ref.get();
    if (!doc.exists) { console.log('  SKIP (not found): ' + lessonId); continue; }
    const d = doc.data();
    if (d.unit === targetUnit) {
      console.log('  ALREADY OK: ' + lessonId + ' = "' + targetUnit + '"');
      continue;
    }
    await ref.update({ unit: targetUnit, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    console.log('  UPDATED: ' + lessonId + ': "' + (d.unit || 'none') + '" → "' + targetUnit + '"');
  }
}

async function main() {
  for (const section of SECTIONS) {
    await processSection(section);
  }
  console.log('\n════════════════════════════════════════════');
  console.log('DONE — all sections processed');
  console.log('════════════════════════════════════════════');
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
