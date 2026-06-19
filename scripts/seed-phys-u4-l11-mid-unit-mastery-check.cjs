// seed-phys-u4-l11-mid-unit-mastery-check.cjs — Unit 4 Lesson 11: mid-unit summative (gravity, orbits, energy).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l11-mid-unit-mastery-check.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u4-l11-mid-unit-mastery-check',
  title: 'Mid-Unit Mastery Check',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 411,
  visible: false,
  dueDate: '2026-10-20', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📝', title: 'Mid-Unit Mastery Check', subtitle: 'Unit 4 · Lesson 11 — Summative' }),

    k.objectives([
      'Explain the full path of an object from the asteroid belt to a possible Earth impact',
      'Connect gravity, orbital shape, and energy transfer into one coherent story',
      'Use the 3-dimensional rubric to show science ideas, modeling practice, and systems thinking',
    ]),

    k.text(
      "We've spent this unit building a model of why objects in space sometimes collide with Earth. We started with the " +
      "Chelyabinsk fireball, met Newton\'s universal gravitation, explored orbital motion, derived Kepler\'s laws from data, " +
      "and traced how gravitational energy turns into kinetic energy as an object falls toward the Sun.\n\n" +
      "Today is your chance to **pull the whole story together**. Show me that you can trace an object\'s path from the " +
      "asteroid belt all the way to a possible impact — and explain each step using gravity, orbits, and energy. A strong " +
      "answer will connect the small-scale physics to the large-scale path."
    ),

    k.sketch({
      title: 'Model the Path',
      instructions:
        'Draw and label the path of an asteroid from the asteroid belt to a near-Earth approach. Show the Sun, Earth, the ' +
        'asteroid belt, and the asteroid\'s elliptical orbit. Label perihelion and aphelion, and show where Earth might be ' +
        'when the orbits cross.',
      prompt:
        "Your sketch should make it possible to see why the asteroid can start far away and still hit Earth. Include arrows " +
        "or notes showing where the asteroid is moving fastest and slowest, and why.",
    }),

    k.shortAnswer({
      prompt:
        "**Explain the speed changes.** At two points on your sketch — aphelion (far from the Sun) and perihelion (close to " +
        "the Sun) — describe the asteroid\'s speed and energy. Use gravitational potential energy and kinetic energy in " +
        "your answer.",
      placeholder: 'At aphelion…\n\nAt perihelion…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Explain the full story: **How can an asteroid that has been orbiting safely in the asteroid belt for billions of ' +
        'years end up colliding with Earth?** Use gravity, orbital shape, and energy transfer in your explanation.',
      claimHint:
        'State, in one or two sentences, why an asteroid can leave the asteroid belt and eventually hit Earth.',
      evidenceHint:
        'Include at least two pieces of evidence: how gravity shapes the orbit, and how energy changes as the asteroid moves.',
      reasoningHint:
        'Connect each piece of evidence to the next step in the story. Explain *why* gravity makes the path curve, *why* the ' +
        'orbit can cross Earth\'s, and *why* the impact transfers so much energy.',
    }),

    k.teacherCheckpoint({
      id: 'phys-u4-l11-cp',
      title: 'Mastery — Teacher Score',
      prompt:
        "Mr. McCarthy will review your sketch, speed explanation, and written CER together and score them on the " +
        "3-dimensional rubric below. He is looking for correct use of gravity, orbital motion, and energy ideas; a clear " +
        "model that shows the path; and reasoning that connects the physics to the impact threat.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Mastery Check Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u4-l11-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
