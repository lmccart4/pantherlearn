// seed-phys-u1-l01-night-lights.cjs — Unit 1 Lesson 1: anchor + pre-assessment.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l01-night-lights.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
// IMAGE PHASE: hero = rights-cleared Sandy NJ photo (data pack §7); inserted after content is approved.

const lesson = {
  id: 'phys-u1-l01-night-lights',
  title: 'The Night the Lights Went Out',
  unit: 'Unit 1: Energy & the Grid',
  order: 101,
  visible: false,
  dueDate: '2026-09-08', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'The Night the Lights Went Out', subtitle: 'Unit 1 · Lesson 1 — Our Anchoring Phenomenon' }),

    k.objectives([
      'Observe and ask questions about the Superstorm Sandy blackout in New Jersey',
      'Build an initial model of how electricity reaches our community',
      'Contribute your questions to our class Driving Question Board',
    ]),

    k.text(
      "On the evening of **October 29, 2012**, Superstorm Sandy made landfall near Brigantine, New Jersey. " +
      "It was the largest Atlantic hurricane ever recorded by size — its winds stretched more than 1,000 miles across.\n\n" +
      "When the storm passed, **about 2.7 million** New Jersey homes and businesses had no electricity. It was the " +
      "largest blackout in the history of our state. A full **week later, around 775,000 people were still in the dark**. " +
      "Repair crews had to cut down more than **93,000 trees** and replace over **2,400 power poles** before the lights " +
      "could come back on."
    ),

    k.text(
      "This wasn't just something that happened far away. Right here in **Perth Amboy**, the storm surge pushed the " +
      "Raritan River over its banks, flooding the waterfront, destroying the marina, and forcing people from their homes. " +
      "For days, families had no heat, no refrigeration, no way to charge a phone, and no way to know when it would end."
    ),

    k.callout({
      style: 'question',
      icon: '🎯',
      title: 'Our Driving Question',
      content:
        "**How can we design a more reliable energy system for our community?**\n\n" +
        "This question stays with us for the whole unit. Every lesson, we'll learn one more piece of the answer — " +
        "and by the end, *you* will redesign the grid yourself.",
    }),

    k.text(
      "**Notice & Wonder**\n\n" +
      "Before we explain anything, we observe. Scientists start by noticing carefully and asking good questions. " +
      "Look closely at the photos and the numbers about Sandy, then answer below."
    ),

    k.shortAnswer({
      prompt:
        "**What do you notice?**\n\nList everything you observe about the storm, the power outage, and how people were " +
        "affected. There are no wrong answers here — just careful observations.",
      placeholder: 'I notice that…',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**What are you wondering?**\n\nWrite at least **three questions** you have — about how electricity normally " +
        "reaches your home, or about why the power went out and stayed out for so long.",
      placeholder: '1.\n2.\n3.',
      difficulty: 'understand',
    }),

    k.sketch({
      title: 'Your Initial Model',
      instructions:
        'Draw a model showing how you think electricity normally travels from a power plant all the way to a device ' +
        'in your home. Then circle or label the place(s) you think failed during Sandy.',
      prompt: "Label every part you can — don't worry about being \"right.\" This is your starting point, and we'll come back to it.",
    }),

    k.shortAnswer({
      prompt:
        "**Explain your thinking.**\n\nIn your own words, describe **everything you currently think happens** between a " +
        "power plant and your phone charger. What has to work for your phone to charge?",
      placeholder: 'When I plug in my phone…',
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
