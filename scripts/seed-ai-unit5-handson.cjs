// Seed script: AI Literacy Unit 5 hands-on activity upgrades.
// Augments 8 existing hidden lessons across P4/P5/P7/P9 with new activity blocks
// and/or swapped sorting-block items. All lessons stay visible:false.
//
// Uses safeLessonWrite to preserve student block IDs if any progress exists.

const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');

const COURSES = [
  { id: 'Y9Gdhw5MTY8wMFt6Tlvj', label: 'AI Literacy P4' },
  { id: 'DacjJ93vUDcwqc260OP3', label: 'AI Literacy P5' },
  { id: 'M2MVSXrKuVCD9JQfZZyp', label: 'AI Literacy P7' },
  { id: 'fUw67wFhAtobWFhjwvZ5', label: 'AI Literacy P9' },
];

const LESSONS = [
  { slug: 'ai-in-healthcare',        module: './handson-blocks/healthcare-triage-line.cjs' },
  { slug: 'ai-in-law',               module: './handson-blocks/law-score-defendant.cjs' },
  { slug: 'ai-in-art',               module: './handson-blocks/art-gallery.cjs' },
  { slug: 'ai-in-climate',           module: './handson-blocks/climate-carbon-ledger.cjs' },
  { slug: 'ai-in-hiring',            module: './handson-blocks/hiring-resume-shuffle.cjs' },
  { slug: 'ai-in-policing',          module: './handson-blocks/policing-feedback-map.cjs' },
  { slug: 'ai-in-education',         module: './handson-blocks/education-classroom-designer.cjs' },
  { slug: 'ai-real-world-synthesis', module: './handson-blocks/synthesis-four-questions.cjs' },
];

const IMAGE_BASE = 'https://firebasestorage.googleapis.com/v0/b/pantherlearn-d6f7c.firebasestorage.app/o/';
const IMAGE_PATH = 'lesson-images/ai-literacy/unit5-art-gallery/';

function imageUrlFor(slug) {
  const filename = `${slug}.jpg`;
  const encoded = encodeURIComponent(IMAGE_PATH + filename);
  return `${IMAGE_BASE}${encoded}?alt=media`;
}

function applyHandsOn(existingBlocks, mod) {
  let blocks = [...existingBlocks];

  if (mod.replacesFinalSortingItems) {
    const sortIdx = blocks.findIndex(b => b.type === 'sorting');
    if (sortIdx === -1) {
      throw new Error('Expected sorting block not found in lesson');
    }
    const items = mod.newSortingItems.map(it => ({
      text: it.text,
      correct: it.correct,
      ...(it.imageSlug ? { imageUrl: imageUrlFor(it.imageSlug) } : {}),
    }));
    blocks[sortIdx] = {
      ...blocks[sortIdx],
      title: mod.newSortingTitle || blocks[sortIdx].title,
      instructions: mod.newSortingInstructions || blocks[sortIdx].instructions,
      leftLabel: mod.newSortingLeftLabel || blocks[sortIdx].leftLabel,
      rightLabel: mod.newSortingRightLabel || blocks[sortIdx].rightLabel,
      items,
    };
  }

  if (mod.blocks && mod.blocks.length) {
    const finalIdx = blocks.findIndex(b => b.type === 'sorting' || b.type === 'chatbot');
    const insertAt = finalIdx === -1 ? blocks.length : finalIdx;
    blocks = [...blocks.slice(0, insertAt), ...mod.blocks, ...blocks.slice(insertAt)];
  }

  return blocks;
}

(async () => {
  const results = [];
  for (const course of COURSES) {
    for (const lesson of LESSONS) {
      const ref = db.doc(`courses/${course.id}/lessons/${lesson.slug}`);
      const snap = await ref.get();
      if (!snap.exists) {
        results.push(`SKIP ${course.label}/${lesson.slug} (not found)`);
        continue;
      }

      const mod = require(lesson.module);
      const current = snap.data();
      const newBlocks = applyHandsOn(current.blocks || [], mod);
      const newLesson = { ...current, blocks: newBlocks, visible: false };

      try {
        const res = await safeLessonWrite(db, course.id, lesson.slug, newLesson);
        results.push(`${res.action} ${course.label}/${lesson.slug} (preserved ${res.preserved})`);
      } catch (err) {
        results.push(`ERROR ${course.label}/${lesson.slug}: ${err.message}`);
      }
    }
  }
  console.log(results.join('\n'));
  process.exit(0);
})();
