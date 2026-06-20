// seed-phys-u4-l01-fireball-over-russia.cjs — Unit 4 Lesson 1: anchor + pre-assessment.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l01-fireball-over-russia.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u4-l01-fireball-over-russia',
  title: 'The Fireball Over Russia',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 401,
  visible: false,
  dueDate: '2026-10-19', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '☄️', title: 'The Fireball Over Russia', subtitle: 'Unit 4 · Lesson 1 — Our Anchoring Phenomenon' }),

    k.objectives([
      'Observe and ask questions about the Chelyabinsk meteor event of 2013',
      'Build an initial model of what happened and why',
      'Contribute questions to our class Driving Question Board',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u4-l01-fireball-over-russia-hero.jpg',
      alt: 'A blindingly bright meteor fireball streaks across the sky over a snowy Russian city, brighter than the Sun, trailing smoke.',
      caption: 'The Chelyabinsk fireball over Russia, February 15, 2013 — a meteor glowing as it tore through the atmosphere. *(Illustration.)*',
    }),

    k.text(
      "On the morning of **February 15, 2013**, a bright fireball streaked across the sky over Chelyabinsk, Russia. " +
      "A space rock about **20 meters across** and weighing somewhere between **7,000 and 13,000 metric tons** slammed into " +
      "Earth's atmosphere at about **19 kilometers per second** — more than **40,000 miles per hour**. The air in front of it " +
      "compressed and heated so intensely that the object exploded in an **airburst** — an explosion in the air, before " +
      "reaching the ground — high above the city."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u4-l01-fireball-over-russia-vapor-trail.jpg',
      alt: 'A long twisted smoke and vapor trail hangs high in a clear winter sky over a snowy street, left behind after the meteor airburst.',
      caption: 'Minutes after the airburst, a high-altitude dust trail marked the meteor’s path — no crater formed, because the object broke apart in the air. *(Illustration.)*',
    }),

    k.text(
      "The blast released the energy of roughly **440 kilotons of TNT** — about 30 times the power of the Hiroshima atomic bomb. " +
      "Shockwaves shattered windows across the region, damaged more than **7,000 buildings**, and injured about **1,500 people**, " +
      "mostly from flying glass. Yet no large crater was found, because the object broke up and mostly vaporized in the atmosphere."
    ),

    k.callout({
      style: 'question',
      icon: '🎯',
      title: 'Our Driving Question',
      content:
        "**How have collisions with space objects changed Earth, past and future?**\n\n" +
        "This question stays with us for the whole unit. Chelyabinsk is our anchor, but we'll also look at the asteroid belt, " +
        "the Moon's orbit, and what scientists are doing to predict — and possibly prevent — future impacts.",
    }),

    k.text(
      "**Notice & Wonder**\n\n" +
      "Before we explain anything, we observe. Look at the footage, the numbers, and the map of Chelyabinsk, then answer below."
    ),

    k.shortAnswer({
      prompt:
        "**What do you notice?**\n\nList everything you observe about the fireball, the explosion, the damage, or the object's path. " +
        "There are no wrong answers here — just careful observations.",
      placeholder: 'I notice that…',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**What are you wondering?**\n\nWrite at least **three questions** you have — about where this object came from, " +
        "why it hit Earth, what would have happened if it had been bigger, or how we could predict the next one.",
      placeholder: '1.\n2.\n3.',
      difficulty: 'understand',
    }),

    k.sketch({
      title: 'Your Initial Model',
      instructions:
        'Draw a model showing what you think happened from the moment the space object was far from Earth until after the airburst. ' +
        'Include the object, Earth, its atmosphere, and the path the object took.',
      prompt: "Label every part you can — don't worry about being \"right.\" This is your starting model, and we'll revise it as we go.",
    }),

    k.shortAnswer({
      prompt:
        "**Explain your thinking.**\n\nIn your own words, describe what you think caused the Chelyabinsk object to glow, explode, and " +
        "cause damage on the ground. Where did it come from? Why did it hit Earth instead of flying past?",
      placeholder: 'I think the object…',
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
