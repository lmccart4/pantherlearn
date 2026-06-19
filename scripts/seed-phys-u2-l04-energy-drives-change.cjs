// seed-phys-u2-l04-energy-drives-change.cjs — Unit 2 Lesson 4: energy transfer accompanies forces.
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u2-l04-energy-drives-change',
  title: 'Energy Transfer Drives Change',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 204,
  visible: false,
  dueDate: '2026-10-08', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'Energy Transfer Drives Change', subtitle: 'Unit 2 · Lesson 4' }),

    k.objectives([
      'Explain how energy transfer accompanies forces in Earth\'s interior',
      'Connect thermal energy and mechanical work in the mantle and crust',
      'Use an energy-to-force reasoning map to explain the Afar rift',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u2-l04-energy-drives-change-heat-convection-crust.jpg',
      alt: 'A cross-section of Earth with a hot core at the bottom, mantle convection loops above it, and a crust layer at the top being pulled apart, with a heat arrow rising from core to crust.',
      caption: 'Heat from the core rises through the mantle as convection, driving forces that move and crack the crust above. *(Diagram.)*',
    }),

    k.text(
      "We now know that forces can change shape. But where do the forces come from? In Earth, the ultimate source is " +
      "**energy transfer** deep inside the planet.\n\n" +
      "Earth's interior is hot. That thermal energy comes partly from the planet's formation and partly from " +
      "**radioactive decay**. The heat moves outward, warming the mantle. When hot mantle rock rises and cooler rock sinks, " +
      "it creates a circulation pattern called **convection**."
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "In this lesson, the **system** is Earth's mantle plus the overlying crust in the Afar region. The **surroundings** " +
        "are the hot core below (energy source), the cold surface above (energy sink), and neighboring plates. Energy " +
        "crosses the system boundary as heat; forces cross it as the mantle pushes and pulls on the crust.",
    }),

    k.text(
      "**From energy to force**\n\n" +
      "Convection currents in the mantle exert **drag forces** on the plates above them. Where the mantle rises and spreads, " +
      "it pulls the crust apart. Where it sinks, it drags a plate downward. The work done by these forces changes the shape " +
      "of the crust over millions of years.\n\n" +
      "We describe mechanical work with the relationship $W = Fd$ — work is a force acting over a distance. In Afar, the " +
      "force from the stretching mantle did work over many kilometers, cracking the crust open."
    ),

    k.shortAnswer({
      prompt:
        "**Trace the energy.** Describe the path from radioactive heat in Earth's interior to a force that can crack the " +
        "crust. Use the words *thermal energy*, *convection*, and *mechanical work*.",
      placeholder: 'Heat from radioactive decay…',
      difficulty: 'analyze',
    }),

    k.mc({
      prompt: 'Which correctly links energy transfer and forces in Earth\'s interior?',
      options: [
        'The crust cools the mantle by absorbing all its kinetic energy',
        'Earth\'s interior energy disappears before it can reach the surface',
        'Rocks store energy forever because forces cannot move them',
        'Thermal energy from the mantle can create forces that move crust',
      ],
      correctIndex: 3,
      explanation:
        'Thermal energy from Earth\'s interior drives mantle convection. The moving mantle exerts forces on the crust, ' +
        'which can open rifts, build mountains, or drive plate motion.',
      difficulty: 'understand',
    }),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Key Ideas',
      content:
        "- **Thermal energy transfer** — heat moving from hot regions to cooler regions\n" +
        "- **Convection** — circulation driven by hot material rising and cool material sinking\n" +
        "- **Mechanical work** — a force acting over a distance ($W = Fd$), changing the shape or motion of a system",
    }),

    k.cer({
      prompt:
        'Use energy transfer and forces to explain why the Afar rift opened. Your answer should connect radioactive heat, ' +
        'mantle convection, and the crack in the crust.',
      claimHint: 'State how energy transfer and forces caused the rift.',
      evidenceHint: 'Cite observations from the Afar event or from the energy-to-force reasoning map.',
      reasoningHint: 'Explain how thermal energy becomes mechanical work that changes the crust.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
