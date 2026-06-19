// seed-phys-u2-l01-day-earth-cracked.cjs — Unit 2 Lesson 1: anchor + pre-assessment.
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u2-l01-day-earth-cracked',
  title: 'The Day the Earth Cracked Open',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 201,
  visible: false,
  dueDate: '2026-10-05', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'The Day the Earth Cracked Open', subtitle: 'Unit 2 · Lesson 1 — Our Anchoring Phenomenon' }),

    k.objectives([
      'Observe and ask questions about the 2005 Afar rift in Ethiopia',
      'Build an initial model of what might have cracked the ground open',
      'Contribute your questions to our class Driving Question Board',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u2-l01-day-earth-cracked-afar-rift-hero.jpg',
      alt: 'A long fissure splits the dry Afar desert in Ethiopia, with a distant volcanic cone emitting a thin ash plume.',
      caption: 'The 2005 Afar rift in Ethiopia — the ground split open over just a few days. *(Illustration.)*',
    }),

    k.text(
      "In **September 2005**, the ground in the **Afar desert of Ethiopia** split open almost without warning. Over just a " +
      "few days, a crack formed that stretched for about **60 kilometers** (roughly 37 miles) and was up to **8 meters** wide " +
      "in places. The event was accompanied by **earthquakes** and a **volcanic eruption** that sent ash and lava into the air."
    ),

    k.text(
      "This isn't ancient history — scientists watched it happen with satellites. The landscape changed so quickly that " +
      "herders had to move their animals, and researchers rushed to the area to measure the new crack before erosion " +
      "began to fill it in."
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "In this lesson, the **system** is the region of Earth's crust and upper mantle in the Afar area. The **surroundings** " +
        "include the atmosphere, neighboring rocks, and Earth's deeper interior. We will track forces and energy transfers " +
        "across this system boundary.",
    }),

    k.callout({
      style: 'question',
      icon: '🎯',
      title: 'Our Driving Question',
      content:
        "**How do forces inside Earth shape what happens on the surface?**\n\n" +
        "This question stays with us for the whole unit. Every lesson, we'll add one more piece to our model — and by the " +
        "end, *you* will explain how a rift like Afar could form.",
    }),

    k.text(
      "**Notice & Wonder**\n\n" +
      "Before we explain the rift, we observe. Scientists start by noticing carefully and asking questions. Look at the " +
      "satellite images and read the descriptions, then answer below."
    ),

    k.shortAnswer({
      prompt:
        "**What do you notice?**\n\nList everything you observe about the rift, the earthquakes, and the volcano. There are " +
        "no wrong answers here — just careful observations.",
      placeholder: 'I notice that…',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**What are you wondering?**\n\nWrite at least **three questions** you have — about what caused the crack, where the " +
        "forces came from, or why it happened so fast.",
      placeholder: '1.\n2.\n3.',
      difficulty: 'understand',
    }),

    k.sketch({
      title: 'Your Initial Model',
      instructions:
        'Draw a model showing what you think caused the ground to crack open in Afar. Include what might be below the ' +
        'surface, what forces could be acting, and the direction they point.',
      prompt:
        "Label every part you can — don't worry about being \"right.\" This is your starting point, and we'll come back to it.",
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

    k.externalLink({
      icon: '🛰️',
      title: 'NASA Earth Observatory — Dabbahu Rift',
      description: 'Satellite images and background on the 2005 Afar rift event.',
      url: 'https://earthobservatory.nasa.gov/images/7055/dabbahu-rift',
      buttonLabel: 'Explore',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
