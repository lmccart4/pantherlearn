// seed-phys-u6-l09-mid-unit-mastery.cjs — Unit 6 Lesson 9: Mid-Unit Mastery Check (SUMMATIVE).
// Standards: HS-ESS1-1, HS-PS1-8. Summative on fusion, stellar evolution, and nucleosynthesis.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l09-mid-unit-mastery.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u6-l09-mid-unit-mastery',
  title: 'Mid-Unit Mastery Check',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 609,
  visible: false,
  dueDate: '2027-05-19', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📝', title: 'Mid-Unit Mastery Check', subtitle: 'Unit 6 · Lesson 9 — Summative' }),

    k.objectives([
      'Explain why stars shine using fusion and energy conservation',
      'Describe how a star evolves from nebula to final stage, including how mass affects its fate',
      'Use nucleosynthesis to explain where the elements around us came from',
    ]),

    k.text(
      "We've reached the middle of the unit. So far you've figured out what starlight tells us, how stars change over time, " +
      "and where the elements come from. Today you pull those ideas together into one coherent explanation.\n\n" +
      "This is a summative check, but it is **not a memorization test**. I want to see you *reason* with the science ideas: " +
      "fusion, the life cycle of stars, and nucleosynthesis. Use the model you've been building. Make your thinking visible."
    ),

    k.sketch({
      title: 'Model the Life of a Star',
      instructions:
        'Draw the full life cycle of a **massive star** (much more massive than the Sun). Label the stages and show where ' +
        'fusion builds elements up to iron, where fusion stops, and what happens to the material after the star dies.',
      prompt:
        'Include: nebula → protostar → main sequence → red giant/supergiant → supernova → remnant. Show which elements are ' +
        'made at each stage and how those elements get recycled into new stars and planets.',
    }),

    k.cer({
      prompt:
        'Write one explanation that answers the unit driving question for everything we have studied so far: **Why do stars ' +
        'shine, how do they change over time, and where do the elements in our world come from?**',
      claimHint: 'State, in one or two sentences, the big idea that connects all three questions.',
      evidenceHint:
        'Cite evidence from this unit: spectral fingerprints, fusion equations, the H-R diagram pattern, stellar life-cycle ' +
        'stages, and/or the origin of elements.',
      reasoningHint:
        'Explain how each piece of evidence supports your claim. Connect the small scale (nuclei fusing) to the large scale ' +
        '(stars, galaxies, and the atoms in our bodies).',
    }),

    k.teacherCheckpoint({
      id: 'phys-u6-l09-cp',
      title: 'Mastery — Teacher Score',
      prompt:
        "Mr. McCarthy will read your model and your written explanation and score them together on the 3-dimensional rubric " +
        "below. He is looking for accurate science ideas, clear reasoning, and evidence drawn from the unit — not perfect " +
        "drawings or memorized vocabulary. Make your thinking visible.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Mid-Unit Mastery Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u6-l09-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
