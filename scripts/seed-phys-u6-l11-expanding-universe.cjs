// seed-phys-u6-l11-expanding-universe.cjs — Unit 6 Lesson 11: An Expanding Universe.
// Standards: HS-ESS1-2. Redshift implies expansion; run the clock backward to Big Bang.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l11-expanding-universe.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u6-l11-expanding-universe',
  title: 'An Expanding Universe',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 611,
  visible: false,
  dueDate: '2027-05-21', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🎈', title: 'An Expanding Universe', subtitle: 'Unit 6 · Lesson 11' }),

    k.objectives([
      'Use redshift data to argue that the universe is expanding',
      'Run the expansion backward to reason about the early universe',
      'Distinguish "expansion of space" from objects moving through space',
    ]),

    k.text(
      "Yesterday you measured redshifts and concluded that galaxies are moving away from us. But here's the deeper puzzle: " +
      "**almost every galaxy is moving away from almost every other galaxy**. That isn't what happens in an ordinary " +
      "explosion, where debris flies away from one center. Galaxies aren't racing away from a special point in space. " +
      "Instead, **space itself is stretching**."
    ),

    k.callout({
      style: 'info',
      icon: '🧠',
      title: 'The Key Idea',
      content:
        "**The universe is not expanding into empty space.** Space itself is getting bigger. Galaxies are mostly sitting " +
        "still relative to the space around them, but the space between them stretches, so the distance grows.",
    }),

    k.text(
      "Think of a balloon with dots drawn on it. As you inflate the balloon, every dot moves away from every other dot. " +
      "No dot is at the center, and none of them is crawling across the rubber — the rubber itself is stretching. " +
      "The dots are galaxies; the rubber is space.\n\n" +
      "Now run the film backward. If space is stretching today, then yesterday it was a little smaller. A year ago, smaller " +
      "still. Keep going, and the entire observable universe was once **incredibly small, hot, and dense**. That moment — " +
      "the beginning of the expansion — is what we call the **Big Bang**."
    ),

    // IMAGE PHASE: balloon expansion analogy sequence (inflating balloon with galaxy dots)

    k.mc({
      prompt: 'If we run the expansion of the universe backward in time, what do we conclude?',
      options: [
        'The universe was once smaller, hotter, and denser than it is today',
        'All galaxies must have started at the exact same location in space',
        'The universe will eventually collapse back into a single black hole',
        'The Milky Way is the oldest galaxy and everything expanded from it',
      ],
      correctIndex: 0,
      explanation:
        'Running expansion backward means the universe was smaller and denser in the past, and hotter because the same energy ' +
        'was packed into a smaller volume. This points to a hot, dense early state — not a single point in today\'s space.',
      difficulty: 'understand',
    }),

    k.mdTable({
      lead: '**Analogies for Expanding Space**',
      headers: ['Analogy', 'What represents space', 'What represents galaxies'],
      rows: [
        ['Raisin bread rising', 'The dough', 'The raisins'],
        ['Inflating balloon', 'The rubber surface', 'The dots'],
        ['Stretching rubber band', 'The band itself', 'Ink marks on the band'],
      ],
      note: 'All analogies are imperfect; use them to reason about the idea, not to prove it.',
    }),

    k.mc({
      prompt: 'In the raisin-bread model of the expanding universe, raisins move apart because:',
      options: [
        'Raisins are being pushed outward by hot air trapped inside the dough',
        'Raisins are chemically reacting and drifting apart over time',
        'The dough between the raisins is expanding, carrying them with it',
        'Gravity between raisins is weaker than gravity between galaxies',
      ],
      correctIndex: 2,
      explanation:
        'In the analogy, the dough represents space and the raisins represent galaxies. The dough expands everywhere, so every ' +
        'raisin moves away from every other raisin without any raisin being at the center.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'Use the balloon analogy to explain why more distant galaxies have **larger** redshifts than nearby galaxies.',
      placeholder: 'In the balloon model, distance matters because…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'A classmate says, "The Big Bang was an explosion that sent galaxies flying outward from one point in space." Use ' +
        'evidence from redshift and the expanding-space model to evaluate that claim.',
      claimHint: 'State whether your classmate\'s explanation is correct, partially correct, or incorrect.',
      evidenceHint: 'Describe what redshift tells us and what the balloon/raisin-bread analogy shows.',
      reasoningHint: 'Explain why "expansion of space" is a better model than "explosion in space" for the Big Bang.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
