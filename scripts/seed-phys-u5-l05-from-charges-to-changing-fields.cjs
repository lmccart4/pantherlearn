// seed-phys-u5-l05-from-charges-to-changing-fields.cjs — Unit 5 Lesson 5: charges, fields, and EM waves.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l05-from-charges-to-changing-fields.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u5-l05-from-charges-to-changing-fields',
  title: 'From Charges to Changing Fields',
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 505,
  visible: false,
  dueDate: '2026-10-24', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🧲', title: 'From Charges to Changing Fields', subtitle: 'Unit 5 · Lesson 5' }),

    k.objectives([
      'Explain that moving charges produce magnetic fields',
      'Describe how changing electric and magnetic fields travel as electromagnetic waves',
      'Connect the wave model to the idea of radiation',
    ]),

    k.text(
      "Mechanical waves need a medium: a string, water, or air. But light, Bluetooth signals, and microwaves all travel " +
      "through empty space. How is that possible?\n\n" +
      "The answer comes from the connection between electricity and magnetism. In Unit 1 we saw that an electric current " +
      "in a wire produces a magnetic field around the wire. Today we'll push that idea further: **a changing electric " +
      "field creates a changing magnetic field, and a changing magnetic field creates a changing electric field.** " +
      "Together they can travel through space as an electromagnetic wave.\n\n" +
      "One key detail: a charge moving at a steady rate makes a steady field. It's a charge that **accelerates** — " +
      "speeds up, slows down, or wiggles back and forth — that launches an electromagnetic wave. That's exactly how " +
      "an antenna works: it drives charges back and forth to send out a signal."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'From Currents to Waves',
      content:
        "- A **moving electric charge** produces a **magnetic field**\n" +
        "- A **changing magnetic field** creates a **changing electric field**\n" +
        "- A **changing electric field** creates a **changing magnetic field**\n" +
        "- Once started, these linked fields can travel through space as an **electromagnetic wave**",
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u5-l05-from-charges-to-changing-fields-em-wave.jpg',
      alt: 'An electromagnetic wave from an accelerating charge, with the electric field oscillating vertically and the magnetic field oscillating perpendicular to it, both at right angles to the direction of travel.',
      caption: 'An accelerating charge launches an electromagnetic wave: the electric (E) and magnetic (B) fields oscillate perpendicular to each other and to the direction of travel. *(Diagram.)*',
    }),

    k.text(
      "**Classroom demo:** Mr. McCarthy will connect a coil of wire to a battery and a compass. When current flows, the " +
      "compass needle deflects, showing that the current produces a magnetic field. Then he'll move a magnet near a " +
      "second coil connected to a meter. When the magnet moves, the meter shows a current — a changing magnetic field " +
      "induced an electric field that pushed charges in the wire.\n\n" +
      "The **system** we'll consider is the coil, the magnet, and the space around them. Energy is transferred into " +
      "the system when the magnet moves or the current changes, and it can leave the system as induced current or as " +
      "radiation that escapes into the surrounding space."
    ),

    k.mc({
      prompt: 'Which of the following produces a magnetic field?',
      options: [
        'A stationary positive charge',
        'A moving electric charge',
        'A neutral atom at rest',
        'A stationary magnet near a wire',
      ],
      correctIndex: 1,
      explanation:
        'A magnetic field is produced by moving electric charges (electric current). Stationary charges produce only an ' +
        'electric field, and a neutral atom at rest produces no significant field. A stationary magnet has its own field, ' +
        'but it does not produce a new one by being near a wire.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**Connect the demos.**\n\nExplain how the two demonstrations together support the idea that electric and " +
        "magnetic fields are linked. Use the words *current*, *magnetic field*, and *changing* in your answer.",
      placeholder: 'In the first demo… In the second demo…',
      difficulty: 'apply',
    }),

    k.sketch({
      title: 'Model an Electromagnetic Wave',
      instructions:
        'Draw a simplified electromagnetic wave traveling to the right. Show one set of electric-field vectors pointing ' +
        'up and down, and one set of magnetic-field vectors pointing in and out of the page.',
      prompt: 'Label which field is electric and which is magnetic.',
    }),

    k.cer({
      prompt:
        'A classmate says, "Electromagnetic waves can\'t be real waves because they don\'t need air or water to travel." Use what you learned today to respond.',
      claimHint: 'State whether the classmate is correct about EM waves being real waves.',
      evidenceHint: 'Use the demonstrations and the electric/magnetic field relationship.',
      reasoningHint: 'Explain what carries the energy if there is no medium.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
