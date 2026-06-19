// seed-phys-u3-l11-mid-unit-mastery-check.cjs — Unit 3 Lesson 11: mid-unit summative (momentum, impulse, force).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l11-mid-unit-mastery-check.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u3-l11-mid-unit-mastery-check',
  title: 'Mid-Unit Mastery Check',
  unit: 'Unit 3: Collisions & Momentum',
  order: 311,
  visible: false,
  dueDate: '2026-11-12', // PLACEHOLDER
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📝', title: 'Mid-Unit Mastery Check', subtitle: 'Unit 3 · Lesson 11 — Summative' }),

    k.objectives([
      'Explain a collision using momentum, impulse, and force ideas',
      'Solve a 1D momentum conservation problem',
      'Connect mathematical reasoning to a physical explanation of what happens in a crash',
    ]),

    k.text(
      "We've spent this unit building a model of collisions: momentum as mass-times-velocity, conservation of momentum " +
      "in an isolated system, the difference between elastic and inelastic crashes, and impulse as the link between force, " +
      "time, and momentum change.\\n\\n" +
      "Today is your chance to pull those ideas together. Show me that you can **calculate** with momentum and also " +
      "**explain** what the numbers mean physically. A good answer doesn't just get the right number — it tells the story " +
      "of the crash in words and diagrams."
    ),

    k.sketch({
      title: 'Model the Collision',
      instructions:
        'A 1200 kg car moving east at $15\\text{ m/s}$ rear-ends a 1000 kg car moving east at $8\\text{ m/s}$. The two cars ' +
        'lock together. Draw the situation before and after the collision. Label masses, velocities with directions, and ' +
        'the system you chose.',
      prompt:
        'Your sketch should make it possible to see conservation of momentum at a glance. Include velocity arrows with ' +
        'reasonable relative lengths.',
    }),

    k.shortAnswer({
      prompt:
        '**Solve for the velocity of the two cars just after the collision.** Show your momentum-conservation equation, ' +
        'substitute values with units, and state the final speed and direction.',
      placeholder: 'm₁v₁,i + m₂v₂,i = (m₁ + m₂)v_f\\n\\n…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Explain the same collision in physical terms. Use momentum, impulse, and force ideas to describe why the ' +
        'passengers in the leading car feel a jolt, and why modern cars are designed with crumple zones.',
      claimHint: 'State what determines how much force the passengers experience during the collision.',
      evidenceHint: 'Cite the masses, speeds, and collision time from the problem and from what you know about crumple zones.',
      reasoningHint:
        'Connect the total momentum of the system to the final velocity, then use impulse ($F_{avg}\\Delta t = \\Delta p$) ' +
        'to explain how crumple zones change the force on passengers.',
    }),

    k.teacherCheckpoint({
      id: 'phys-u3-l11-cp',
      title: 'Mastery — Teacher Score',
      prompt:
        "Mr. McCarthy will review your sketch, calculation, and written explanation together and score them on the " +
        "3-dimensional rubric below. He is looking for correct use of momentum and impulse ideas, clear mathematical " +
        "reasoning, and a physical explanation that connects the numbers to what happens to the cars and the people inside.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Mastery Check Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u3-l11-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
