// seed-phys-u4-l02-what-is-a-meteor.cjs — Unit 4 Lesson 2: vocabulary + classification.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l02-what-is-a-meteor.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
// IMAGE PHASE: diagram showing meteoroid → meteor → meteorite sequence and asteroid/comet origins.

const lesson = {
  id: 'phys-u4-l02-what-is-a-meteor',
  title: 'What Is a Meteor?',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 402,
  visible: false,
  dueDate: '2026-10-20', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '☄️', title: 'What Is a Meteor?', subtitle: 'Unit 4 · Lesson 2' }),

    k.objectives([
      'Distinguish meteoroid, meteor, meteorite, asteroid, and comet',
      'Classify space objects by where they are and what they are doing',
      'Connect meteor events to what we can see from New Jersey',
    ]),

    k.text(
      "Yesterday we watched a fireball explode over Russia. Before we can explain *why* it happened, we need to agree on " +
      "*what* we're talking about. The words meteor, meteoroid, and meteorite sound almost the same, but they mean very " +
      "different things — and confusing them will mess up our model later."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Space-Object Vocabulary',
      content:
        "- **Asteroid** — a rocky or metallic object orbiting the Sun, mostly in the asteroid belt between Mars and Jupiter\n" +
        "- **Comet** — a small icy body that releases gas and dust when it nears the Sun, forming a tail\n" +
        "- **Meteoroid** — a small rocky or metallic body traveling through space (smaller than an asteroid)\n" +
        "- **Meteor** — the streak of light produced when a meteoroid enters Earth's atmosphere and heats up\n" +
        "- **Meteorite** — any part of a meteoroid that survives its fall and lands on Earth's surface",
    }),

    // IMAGE PHASE: meteoroid-meteor-meteorite sequence diagram + asteroid belt / comet comparison.

    k.text(
      "**Sorting Activity**\n\n" +
      "Imagine you are given five cards, each describing one object. Your job is to sort them into the correct category. " +
      "Use the definitions above. When you're done, answer the question below."
    ),

    k.mc({
      prompt: 'You see a bright streak flash across the night sky. The next morning, a small rock is found on the ground nearby. Which statement uses the correct terms?',
      options: [
        'The streak is a meteorite and the rock is a meteoroid',
        'The streak is an asteroid and the rock is a comet',
        'The streak is a meteor and the rock is a meteorite',
        'The streak is a meteoroid and the rock is an asteroid',
      ],
      correctIndex: 2,
      explanation:
        'The glowing streak in the sky is a meteor — the visible light from a meteoroid heating up in the atmosphere. ' +
        'Any surviving solid material that reaches the ground is a meteorite.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**From New Jersey skies.**\n\nThe **Perseid meteor shower** is visible every August, and you can sometimes see " +
        "bright meteors from Perth Amboy on a dark night. In your own words, explain why a meteor shower is *not* the same " +
        "as a bunch of meteorites hitting the ground.",
      placeholder: 'A meteor shower is…',
      difficulty: 'apply',
    }),

    k.externalLink({
      icon: '🔭',
      title: 'NASA — What Is a Meteor Shower?',
      description: 'Use this page to check your understanding and find dates for upcoming meteor showers visible from our area.',
      url: 'https://science.nasa.gov/solar-system/meteors-meteorites/',
      buttonLabel: 'Explore',
    }),

    k.cer({
      prompt:
        'How do scientists know that meteorites come from space, not from somewhere here on Earth?',
      claimHint: 'State whether meteorites are Earth rocks or space rocks.',
      evidenceHint: 'Cite at least two pieces of evidence scientists use (for example: composition, temperature history, or orbit tracking).',
      reasoningHint: 'Explain why that evidence is hard to explain if the rock formed on Earth.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
