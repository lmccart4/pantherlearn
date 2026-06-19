// seed-phys-u2-l11-mid-unit-mastery-check.cjs — Unit 2 Lesson 11: mid-unit summative (forces, energy transfer, Earth's interior).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u2-l11-mid-unit-mastery-check.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u2-l11-mid-unit-mastery-check',
  title: 'Mid-Unit Mastery Check',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 211,
  visible: false,
  dueDate: '2026-10-17', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📝', title: 'Mid-Unit Mastery Check', subtitle: 'Unit 2 · Lesson 11 — Summative' }),

    k.objectives([
      'Explain the Afar rift using forces, energy transfer, and Earth\'s interior structure',
      'Connect seismic evidence, radioactive decay, convection, and plate boundaries into one model',
      'Use the 3-dimensional rubric to show science ideas, a practice, and a crosscutting lens',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u2-l11-mid-unit-afar-recap-hero.jpg',
      alt: 'A wide view of the Afar rift fissure cutting across the Ethiopian desert toward distant volcanic hills at golden hour.',
      caption: 'Our anchor phenomenon: the Afar rift. Today you explain it using everything we have built. *(Illustration.)*',
    }),

    k.text(
      "We've spent the last five lessons building the inside of the story: Earth's layers from seismic waves, the heat " +
      "engine of radioactive decay, the slow circulation of mantle convection, the forces at plate boundaries, and the way " +
      "vectors show that direction matters. Today you pull it all together to explain the Afar rift.\n\n" +
      "This isn't a memorization test. Your job is to build a model-based explanation that runs from deep inside Earth all " +
      "the way up to the crack in the desert. Use the physics ideas we've developed and make your reasoning visible."
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "In this summative, the **system** is the Afar region: the crust, the upper mantle directly beneath it, and the " +
        "convection currents that interact with it. The **surroundings** are Earth's deeper interior, neighboring plates, the " +
        "atmosphere, and the surface. Energy and forces cross these boundaries throughout your explanation.",
    }),

    k.sketch({
      title: 'Your Mid-Unit Model',
      instructions:
        'Draw a cross-section of the Afar region showing everything that causes the rift: Earth\'s layers, radioactive heat, ' +
        'mantle convection, forces at the boundary, and the crack at the surface.',
      prompt:
        "Label each part and use arrows to show the direction of forces and energy transfer. Show how the small scale " +
        "(decay, convection) connects to the large scale (the rift).",
    }),

    k.cer({
      prompt:
        'Write one explanation that answers our driving question for this lesson set: **How do forces inside Earth shape what ' +
        'happens on the surface?** Use the Afar rift as your example.',
      claimHint: 'State how forces inside Earth caused the Afar rift.',
      evidenceHint: 'Cite seismic evidence, radioactive decay, convection, and boundary forces.',
      reasoningHint: 'Explain how energy transfer and unbalanced forces lead to the crack at the surface.',
    }),

    k.shortAnswer({
      prompt:
        "**Scale check.** Explain how one piece of evidence we could *not* see directly (seismic waves or radioactive decay) " +
        "still gives us reliable information about the cause of the rift.",
      placeholder: 'We cannot see… but we know… because…',
      difficulty: 'evaluate',
    }),

    k.teacherCheckpoint({
      id: 'phys-u2-l11-cp',
      title: 'Mastery — Teacher Score',
      prompt:
        "Mr. McCarthy will read your model and your written explanation and score them together on the " +
        "**3-dimensional rubric below**. You're being graded on how well your reasoning connects Earth's interior to the " +
        "surface — the science ideas, the modeling practice, and the systems lens — not on artistic skill or memorized " +
        "vocabulary. Make your thinking visible.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Mid-Unit Mastery Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u2-l11-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
