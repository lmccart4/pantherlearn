// seed-phys-u4-l10-gravitational-energy-transfer.cjs — Unit 4 Lesson 10: gravitational PE and speed changes in orbit.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l10-gravitational-energy-transfer.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u4-l10-gravitational-energy-transfer',
  title: 'Gravitational Energy Transfer',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 410,
  visible: false,
  dueDate: '2026-10-17', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚖️', title: 'Gravitational Energy Transfer', subtitle: 'Unit 4 · Lesson 10' }),

    k.objectives([
      'Explain why an orbiting object speeds up as it falls toward the Sun and slows down as it moves away',
      'Use gravitational potential energy and kinetic energy ideas to describe energy transfer in a two-body system',
      'Connect energy changes to the shape of an elliptical orbit',
    ]),

    k.text(
      "Yesterday you saw that orbits have shapes. Today we ask: **why does the speed change** around that shape?\n\n" +
      "Think about the **system** as the Sun plus an orbiting asteroid. Gravity is the only interaction doing work between " +
      "the two bodies. As the asteroid moves closer to the Sun, the gravitational force pulls it along the direction of " +
      "motion and speeds it up. As it moves away, gravity pulls opposite to the motion and slows it down. The total energy " +
      "of the system stays constant if we ignore tiny effects like solar radiation pressure."
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "**System:** the Sun and the orbiting object. **Surroundings:** everything else (other planets, solar radiation, " +
        "outgassing). For today we treat the system as isolated, so energy only moves between gravitational potential " +
        "energy and kinetic energy within the system.",
    }),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Gravitational Energy in Words',
      content:
        "- **Gravitational potential energy ($GPE$)** is energy stored in the relative position of two masses. It increases " +
        "(becomes less negative) as the objects move farther apart.\n" +
        "- **Kinetic energy ($KE$)** is energy of motion, $\frac{1}{2}mv^2$.\n" +
        "- In an isolated orbit: $KE + GPE = \text{constant}$. Close to the Sun: low $GPE$, high $KE$, so fast. Far from the " +
        "Sun: high $GPE$, low $KE$, so slow.",
    }),

    k.mdTable({
      lead: '**Energy and speed around an elliptical orbit**',
      headers: ['Location', 'Distance from Sun', 'Gravitational PE', 'Kinetic energy / speed'],
      rows: [
        ['Perihelion (closest)', 'Smallest', 'Lowest (most negative)', 'Highest speed'],
        ['Aphelion (farthest)', 'Largest', 'Highest (least negative)', 'Lowest speed'],
      ],
      note: 'The total mechanical energy of the isolated Sun-object system stays the same.',
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u4-l10-gravitational-energy-transfer-bar-charts.jpg',
      alt: 'Energy bar charts for an orbiting object at perihelion and aphelion: high kinetic and low potential energy when close, low kinetic and high potential energy when far, with equal totals.',
      caption: 'As an object orbits, kinetic and gravitational potential energy trade back and forth — but the total stays constant. *(Diagram.)*',
    }),

    k.shortAnswer({
      prompt:
        "**Use the energy idea.** A comet is moving away from the Sun toward the outer solar system. Describe what is " +
        "happening to its gravitational potential energy, its kinetic energy, and its speed, and explain why.",
      placeholder: 'As the comet moves away from the Sun…',
      difficulty: 'apply',
    }),

    k.mc({
      prompt: 'An asteroid moves from aphelion (far from the Sun) to perihelion (close to the Sun). Which energy statement is correct?',
      options: [
        'Both kinetic and gravitational potential energy stay the same',
        'Kinetic energy increases and gravitational potential energy decreases',
        'Kinetic energy decreases and gravitational potential energy increases',
        'Total energy increases because the asteroid is speeding up',
      ],
      correctIndex: 1,
      explanation:
        'As the asteroid falls toward the Sun, GPE is converted into KE. Total energy in the isolated system stays constant.',
      difficulty: 'understand',
    }),

    k.cer({
      prompt:
        'Use energy transfer to explain why an asteroid that starts far from the Sun and falls inward can become dangerous ' +
        'by the time it reaches Earth\'s neighborhood.',
      claimHint: 'State how falling inward changes the asteroid\'s kinetic energy and speed.',
      evidenceHint: 'Describe the energy transfer between gravitational potential energy and kinetic energy.',
      reasoningHint:
        'Connect the energy change to the impact threat: why does a faster asteroid transfer more energy on impact?',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
