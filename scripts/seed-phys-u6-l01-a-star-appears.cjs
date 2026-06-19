// seed-phys-u6-l01-a-star-appears.cjs — Unit 6 Lesson 1: A Star Where There Wasn't One (anchor).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l01-a-star-appears.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const IMG_BASE = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics';

const lesson = {
  id: 'phys-u6-l01-a-star-appears',
  title: 'A Star Where There Wasn\'t One',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 601,
  visible: false,
  dueDate: '2026-09-29', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⭐', title: 'A Star Where There Wasn\'t One', subtitle: 'Unit 6 · Lesson 1' }),

    k.objectives([
      'Use historical records of "new stars" to launch a unit-long investigation',
      'Draft an initial model explaining why a star might suddenly appear and fade',
      'Contribute observations and questions to the Driving Question Board',
    ]),

    k.image({
      url: `${IMG_BASE}/phys-u6-l01-a-star-appears-hero.jpg`,
      alt: 'Three panels: a 1572 star map marking Tycho\'s "new star," the modern Crab Nebula remnant cloud, and a light curve rising to a peak then fading.',
      caption: 'For centuries, astronomers recorded "new stars" that flared up and faded — leaving behind expanding clouds of gas. *(Diagram.)*',
    }),

    k.text(
      "People used to call them **'new stars'** — bright points of light that appeared where no star had been seen before, " +
      "then slowly faded. In 1572, Tycho Brahe watched one stay visible for months. A thousand years earlier, Chinese and " +
      "Japanese astronomers recorded another so bright it could be seen in daylight. Today we know these events as " +
      "**supernovae**, but at the time they were a mystery: how can a star just show up?"
    ),

    k.callout({
      style: 'info',
      icon: '🧭',
      title: 'The Unit Driving Question',
      content: "**Why do stars shine and will they shine forever?**\n\nEverything we do for the next three weeks connects back to that question.",
    }),

    k.image({
      url: `${IMG_BASE}/phys-u6-l01-a-star-appears-tycho-vs-crab.jpg`,
      alt: 'On the left, an antique sepia sketch of a night sky with one bright "new star"; on the right, the colorful modern Crab Nebula remnant cloud.',
      caption: 'The same kind of event, seen across time: a "new star" in an old sketch (left) and the glowing remnant cloud we see today (right). *(Illustration.)*',
    }),

    k.text(
      "Look at the evidence in front of you. The historical drawings show a single bright point. The modern image shows " +
      "a glowing cloud of gas expanding where the 'new star' once sat. Something dramatic happened there.\n\n" +
      "Before we read what scientists eventually figured out, Mr. McCarthy wants your **initial model**: what could make " +
      "a star suddenly brighten and then fade? You don't have to be right — you just have to use the evidence you see."
    ),

    k.sketch({
      title: 'Initial Model: A Star Appears',
      instructions: 'Draw what you think is happening when a "new star" suddenly appears and then fades. Label the parts of your model.',
      prompt: 'What could cause a star to brighten suddenly and then fade over months? Include at least two labeled parts in your sketch.',
    }),

    k.shortAnswer({
      prompt: '**Notice & Wonder:** List one thing you notice and one thing you wonder about the "new star" records.',
      placeholder: 'I notice…\nI wonder…',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'Why are historical drawings and modern images of the same "new star" event useful together?',
      options: [
        'They show how the same location looked long ago and now',
        'They prove the star is still shining today',
        'They tell us exactly what caused the explosion',
        'They replace the need for any other evidence',
      ],
      correctIndex: 0,
      explanation: 'Historical records give us a snapshot of the event when it happened; modern images show the long-term aftermath. Together they let us compare past and present views of the same location.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'A "new star" fades over months. What does that observation suggest about the event?',
      options: [
        'The star is getting physically smaller',
        'The event is a temporary process, not permanent',
        'The star is moving farther away each night',
        'The telescope used to view it is breaking down',
      ],
      correctIndex: 1,
      explanation: 'A gradual fade means the brightening is a temporary process. Permanent changes would not disappear over a few months.',
      difficulty: 'understand',
    }),

    k.cer({
      prompt: 'What is your current best explanation for why a "new star" appears and fades?',
      claimHint: 'State what you think is happening.',
      evidenceHint: 'Point to specific details from the records or images.',
      reasoningHint: 'Explain why that evidence supports your claim.',
    }),

    k.shortAnswer({
      prompt: 'Add one question to the Driving Question Board that could help us explain "new stars."',
      placeholder: 'My question: …',
      difficulty: 'apply',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
