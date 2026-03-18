/**
 * Add a scored short_answer block to Ability Architect (Period 1)
 *
 * The lesson teaches: energy types (gravitational PE, elastic PE, kinetic energy),
 * energy transfer through force and displacement, and the role of force direction.
 *
 * Adds a single question block at the END of the lesson so existing students
 * see it as new content without disturbing their prior completion.
 *
 * Uses direct Firestore update (appending to blocks array) — does NOT overwrite
 * the existing blocks. Block IDs are never changed.
 */

const admin = require('firebase-admin');
const { randomUUID } = require('crypto');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const COURSE_ID = 'physics';
const LESSON_ID = '61c57995';

const NEW_BLOCK = {
  id: randomUUID(),
  type: 'question',
  questionType: 'short_answer',
  scored: true,
  prompt: 'Think about the four types of energy you explored in The Ability Architect. Choose **two** of them and describe a real-world scenario where energy transforms from one type to the other. Identify what force is applied and how the direction of that force affects the energy transfer.',
  placeholder: 'For example: When a person lifts a box, they apply an upward force over a vertical displacement, transferring energy into...',
  aiBaselines: [
    {
      provider: 'gemini',
      generatedAt: new Date().toISOString(),
      text: 'One example involves **elastic potential energy transforming into kinetic energy**. When you stretch a rubber band (or compress a spring), you apply a force over a displacement in the direction of the stretch. This work done against the elastic force stores energy as elastic potential energy. When released, that stored energy converts into kinetic energy — the band snaps forward and the object it launches accelerates. The direction of the applied force matters: pulling perpendicular to the band\'s motion would not store energy the same way.\n\nA second example involves **gravitational potential energy transforming into kinetic energy**. Lifting an object requires applying an upward force (opposite to gravity) over an upward displacement. That work is stored as gravitational potential energy — the higher the object, the more is stored (GPE = mgh). When the object is released and falls, gravity pulls it downward and that stored energy converts to kinetic energy. If the force and displacement are in the same direction (e.g., carrying a box horizontally), no gravitational PE is added because the displacement has no vertical component — showing how force direction is critical to which type of energy changes.'
    }
  ]
};

async function main() {
  const lessonRef = db.collection('courses').doc(COURSE_ID).collection('lessons').doc(LESSON_ID);
  const snap = await lessonRef.get();

  if (!snap.exists) {
    console.error('Lesson not found:', LESSON_ID);
    process.exit(1);
  }

  const d = snap.data();
  const currentBlocks = d.blocks || [];

  // Safety check — make sure we're not adding a duplicate
  const alreadyHasScored = currentBlocks.some(b => b.scored === true);
  if (alreadyHasScored) {
    console.log('Lesson already has a scored block. No change needed.');
    console.log('Existing scored blocks:', currentBlocks.filter(b => b.scored).map(b => b.id));
    process.exit(0);
  }

  const updatedBlocks = [...currentBlocks, NEW_BLOCK];

  await lessonRef.update({ blocks: updatedBlocks });

  console.log('Done. Added scored block to Ability Architect (Period 1)');
  console.log('Block ID:', NEW_BLOCK.id);
  console.log('Block JSON:');
  console.log(JSON.stringify(NEW_BLOCK, null, 2));
  console.log('\nLesson now has', updatedBlocks.length, 'blocks:');
  updatedBlocks.forEach((b, i) => {
    console.log(' ', i, '| type:', b.type, '| id:', b.id, b.scored ? '| SCORED' : '');
  });
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
