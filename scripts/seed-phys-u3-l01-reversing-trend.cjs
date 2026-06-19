// seed-phys-u3-l01-reversing-trend.cjs — Unit 3 Lesson 1: anchor + pre-assessment.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l01-reversing-trend.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u3-l01-reversing-trend',
  title: 'The Reversing Trend',
  unit: 'Unit 3: Collisions & Momentum',
  order: 301,
  visible: false,
  dueDate: '2026-10-13', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🚗', title: 'The Reversing Trend', subtitle: 'Unit 3 · Lesson 1 — Our Anchoring Phenomenon' }),

    k.objectives([
      'Analyze U.S. and New Jersey traffic-fatality data and notice patterns',
      'Build an initial model of what makes driving risky',
      'Contribute questions to our class Driving Question Board',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u3-l01-reversing-trend-fatality-chart.jpg',
      alt: 'A line chart of U.S. yearly traffic deaths from 2019 to 2024 that declines for years, jumps sharply to a peak in 2021, stays flat through 2022, then falls again through 2023 and 2024.',
      caption: 'After a long decline, U.S. traffic deaths spiked to a peak around 2021 and have only recently started falling again. *(Diagram.)*',
    }),

    k.text(
      "For decades, driving in the United States kept getting safer. Cars got better brakes, stronger frames, and airbags. " +
      "Roads were redesigned. Traffic fatalities fell year after year. Then, around **2020, the trend reversed** — " +
      "crash deaths started climbing again, even though cars are safer than ever.\n\n" +
      "In **New Jersey**, more than **600 people** die in motor-vehicle crashes in a typical year. " +
      "Thousands more are injured. Nationally, more than **40,000 people** die on U.S. roads each year. " +
      "That's the equivalent of a small city vanishing annually. Why is the number going back up?"
    ),

    k.callout({
      style: 'question',
      icon: '🎯',
      title: 'Our Driving Question',
      content:
        "**What can we do to make driving safer for everyone?**\n\n" +
        "This question stays with us for the whole unit. Every lesson adds one piece of the answer — " +
        "and by the end, *you* will design a safer collision.",
    }),

    k.text(
      "**Notice & Wonder**\n\n" +
      "Before we explain anything, we observe. Look at the data and the trend. Scientists start by noticing carefully " +
      "and asking good questions."
    ),

    k.shortAnswer({
      prompt:
        "**What do you notice?**\n\nList everything you observe about the traffic-fatality trend, the numbers, " +
        "or anything else that stands out. There are no wrong answers here — just careful observations.",
      placeholder: 'I notice that…',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**What are you wondering?**\n\nWrite at least **three questions** you have about why driving has become more " +
        "dangerous and what could be done about it.",
      placeholder: '1.\n2.\n3.',
      difficulty: 'understand',
    }),

    k.sketch({
      title: 'Your Initial Model',
      instructions:
        'Draw a model of a car crash. Label the objects involved, the forces you think act during the crash, and the ' +
        'changes in motion you observe. Use arrows to show direction.',
      prompt: "Label every part you can — don't worry about being \"right.\" This is your starting point, and we'll come back to it.",
    }),

    k.shortAnswer({
      prompt:
        "**Explain your thinking.**\n\nIn your own words, describe what you think makes driving dangerous and why " +
        "crash deaths might be rising again.",
      placeholder: 'I think driving is dangerous because…',
      difficulty: 'analyze',
    }),

    k.callout({
      style: 'info',
      icon: '📌',
      title: 'About the Driving Question Board',
      content:
        "Mr. McCarthy will post your questions on our class **Driving Question Board**. As we work through this unit, " +
        "we'll come back to your questions and check off the ones we can answer. This first model is **not graded for " +
        "being correct** — it's graded for honest effort. It's the \"before\" picture of your thinking.",
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
