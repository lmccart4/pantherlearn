// seed-phys-u4-l07-why-moon-doesnt-fall.cjs — Unit 4 Lesson 7: orbital motion simulator.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l07-why-moon-doesnt-fall.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)
// IMAGE PHASE: Newton's cannon diagram showing projectile paths at increasing speeds.

const lesson = {
  id: 'phys-u4-l07-why-moon-doesnt-fall',
  title: 'Why Doesn\'t the Moon Fall Down?',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 407,
  visible: false,
  dueDate: '2026-10-27', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌙', title: 'Why Doesn\'t the Moon Fall Down?', subtitle: 'Unit 4 · Lesson 7' }),

    k.objectives([
      'Explain orbital motion as a combination of tangential velocity and gravitational acceleration',
      'Use a simulation to discover the conditions that produce a stable orbit',
      'Predict how changing speed or distance affects an orbit',
    ]),

    k.text(
      "If you hold a rock and let go, it falls. So why doesn't the Moon fall into Earth? The short answer: **it is falling** — " +
      "but it is also moving sideways so fast that it keeps missing. An orbit is just a fall that never lands."
    ),

    k.text(
      "Imagine throwing a baseball horizontally. Gravity pulls it downward, so it curves toward the ground and lands some " +
      "distance away. Now imagine throwing it so fast that, as it falls, the ground curves away beneath it at exactly the " +
      "same rate. The ball would keep falling toward Earth and missing it — forever. That's an orbit."
    ),

    // IMAGE PHASE: Newton's cannon diagram: straight down → parabola → elliptical orbit → escape trajectory.

    k.embed({
      url: `${TOOLS_BASE}/orbit-gravity-sim.html`,
      caption: '🌌 **Orbit / Gravity Simulator** — Set a small object’s distance and sideways velocity near a planet or star. Find the speed that produces a stable circular orbit, then explore what happens when you change it.',
      height: 750,
    }),

    k.mc({
      prompt: 'In the simulator, you launch a small satellite from the same starting distance but give it a larger sideways speed. What happens to its orbit?',
      options: [
        'It falls straight down toward the planet much faster',
        'It spirals inward and crashes into the planet',
        'It stops moving and hovers at the starting distance',
        'It enters a larger orbit or escapes the planet entirely',
      ],
      correctIndex: 3,
      explanation:
        'A higher sideways speed means the satellite travels farther while falling the same vertical distance. With enough ' +
        'speed, the falling path matches a larger ellipse or becomes an open escape trajectory.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        "**Prediction check.**\n\nBefore you ran the simulator, what did you think would happen if you gave the object " +
        "more sideways speed? Did the result match your prediction? Explain any difference.",
      placeholder: 'I predicted… The simulator showed…',
      difficulty: 'understand',
    }),

    k.dataTable({
      title: 'Orbit Trials',
      preset: 'numeric',
      rows: [
        { key: 'trial1', label: 'Trial 1' },
        { key: 'trial2', label: 'Trial 2' },
        { key: 'trial3', label: 'Trial 3' },
      ],
      columns: [
        { key: 'distance', label: 'Starting distance (units)' },
        { key: 'speed', label: 'Sideways speed (units)' },
        { key: 'orbit', label: 'Orbit shape (circle / ellipse / crash / escape)' },
      ],
    }),

    k.cer({
      prompt:
        'Use the ideas of tangential velocity and gravitational force to explain why the Moon orbits Earth instead of falling straight down.',
      claimHint: 'State that the Moon is both falling and moving sideways at the same time.',
      evidenceHint: 'Describe what you observed in the simulator when an object had just the right sideways speed.',
      reasoningHint: 'Connect Newton’s law of gravitation to the curved path of the Moon.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
