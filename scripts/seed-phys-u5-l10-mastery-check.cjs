// seed-phys-u5-l10-mastery-check.cjs — Unit 5 Lesson 10: mid-unit summative (PS4.A/B, argument).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l10-mastery-check.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u5-l10-mastery-check',
  title: 'Mid-Unit Mastery Check',
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 510,
  visible: false,
  dueDate: '2026-10-17', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📝', title: 'Mid-Unit Mastery Check', subtitle: 'Unit 5 · Lesson 10 — Summative' }),

    k.objectives([
      'Explain the microwave/Bluetooth phenomenon using wave properties',
      'Explain how electromagnetic radiation interacts with matter',
      'Connect wave properties to observable effects',
    ]),

    k.text(
      "This is the middle of Unit 5 — your chance to pull together everything we've built so far. We started with a " +
      "mystery: a Bluetooth speaker stops playing when it is placed inside a closed microwave oven, even though the " +
      "oven is off. Since then we've added wave properties, the electromagnetic spectrum, absorption/reflection/" +
      "transmission, standing waves, and the photon model.",
    ),

    k.text(
      "Your task today is to **explain the microwave/Bluetooth mystery using the physics ideas we've developed**. " +
      "A strong answer will connect the small scale (what the waves and the metal mesh do) to the large scale " +
      "(why the speaker loses its signal). Use evidence, define your terms, and make your reasoning visible.",
    ),

    k.sketch({
      title: 'Model the Microwave/Bluetooth Phenomenon',
      instructions:
        'Draw a cross-section of a microwave oven with a Bluetooth speaker inside. Show the Bluetooth signal, the ' +
        'metal walls, the mesh screen in the door, and explain what happens at each boundary.',
      prompt:
        "Label **wavelength**, **frequency**, and at least one **wave-matter interaction** (absorption, reflection, or " +
        "transmission). Show why the signal does or does not pass through each part of the oven.",
    }),

    k.cer({
      prompt:
        'Explain why a Bluetooth speaker loses its connection when placed inside a closed microwave oven. Use wave properties and EM-matter interactions in your answer.',
      claimHint: 'State, in one sentence, why the Bluetooth signal is blocked.',
      evidenceHint: 'Cite the frequency/wavelength of Bluetooth and microwaves, the behavior of metal, and the mesh screen.',
      reasoningHint: 'Connect those facts to reflection, absorption, and the size of the holes in the mesh relative to wavelength.',
    }),

    k.teacherCheckpoint({
      id: 'phys-u5-l10-cp',
      title: 'Mastery — Teacher Score',
      prompt:
        "Mr. McCarthy will read your model and your written explanation and score them together on the " +
        "3-dimensional rubric below. You're being graded on how well your reasoning connects wave properties and " +
        "EM-matter interactions — not on artistic skill or memorized vocabulary. Make your " +
        "thinking visible.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Mastery Check Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u5-l10-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
