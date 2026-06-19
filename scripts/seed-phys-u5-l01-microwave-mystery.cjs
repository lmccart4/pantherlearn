// seed-phys-u5-l01-microwave-mystery.cjs — Unit 5 Lesson 1: anchor + pre-assessment.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l01-microwave-mystery.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u5-l01-microwave-mystery',
  title: 'The Microwave Mystery',
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 501,
  visible: false,
  dueDate: '2026-10-20', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📡', title: 'The Microwave Mystery', subtitle: 'Unit 5 · Lesson 1 — Our Anchoring Phenomenon' }),

    k.objectives([
      'Observe the microwave/Bluetooth demo and record what happens',
      'Build an initial model of waves and radiation',
      'Contribute questions to the class Driving Question Board',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u5-l01-microwave-mystery-hero.jpg',
      alt: 'A Bluetooth speaker sits inside an open, switched-off microwave oven while a phone on the counter plays music, its signal blocked at the metal door.',
      caption: 'Our anchoring mystery: a Bluetooth speaker loses its signal inside a closed — but completely **off** — microwave. *(Illustration.)*',
    }),

    k.text(
      "Mr. McCarthy is going to play music from a small Bluetooth speaker. Then he'll put that speaker inside a " +
      "microwave oven and **close the door** — but the microwave will stay **off**. Predict what you think will happen " +
      "to the music, then watch carefully.\n\n" +
      "When the speaker is outside the microwave, the sound is clear. When it's inside with the door closed, the " +
      "connection drops or the music cuts out. The microwave is not running; there's no heat, no fan, no power being " +
      "used to cook anything. Something about the metal box itself is changing how the signal reaches the speaker. " +
      "That's the mystery we'll solve this unit."
    ),

    k.callout({
      style: 'question',
      icon: '🎯',
      title: 'Our Driving Question',
      content:
        "**How do we use radiation in our lives, and is it safe?**\n\n" +
        "This question stays with us for the whole unit. We'll figure out what electromagnetic radiation is, how it " +
        "carries energy and information, and how different frequencies interact with matter — including the metal mesh " +
        "in a microwave door.",
    }),

    k.text(
      "**Notice & Wonder**\n\n" +
      "Before we explain the demo, we observe. Scientists start by noticing carefully and asking good questions. " +
      "What did you see and hear? What questions does it raise?"
    ),

    k.shortAnswer({
      prompt:
        "**What do you notice?**\n\nList everything you observe about the Bluetooth speaker, the microwave, and what " +
        "happened when the speaker went inside. There are no wrong answers here — just careful observations.",
      placeholder: 'I notice that…',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**What are you wondering?**\n\nWrite at least **three questions** you have about the demo. What do you want " +
        "to know about waves, signals, or radiation?",
      placeholder: '1.\n2.\n3.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**Initial prediction.**\n\nIn your own words, explain what you think happened and why. Why might the Bluetooth " +
        "signal have trouble passing through the closed microwave?",
      placeholder: 'I think the signal…',
      difficulty: 'apply',
    }),

    k.sketch({
      title: 'Your Initial Model',
      instructions:
        'Draw a model showing how you think the Bluetooth signal travels from the phone to the speaker. Then show what ' +
        'you think changes when the speaker is inside the closed microwave.',
      prompt: "Label every part you can — don't worry about being 'right.' This is your starting point, and we'll come back to it.",
    }),

    k.callout({
      style: 'info',
      icon: '📌',
      title: 'About the Driving Question Board',
      content:
        "Mr. McCarthy will post your questions on our class **Driving Question Board**. As we work through this unit, " +
        "we'll come back to your questions and check off the ones we can answer. This first model is **not graded for " +
        "being correct** — it's graded for honest effort. It's the 'before' picture of your thinking.",
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
