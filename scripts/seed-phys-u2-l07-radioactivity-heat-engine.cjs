// seed-phys-u2-l07-radioactivity-heat-engine.cjs — Unit 2 Lesson 7: radioactive decay as Earth's heat engine.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u2-l07-radioactivity-heat-engine.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
// IMAGE PHASE: diagram of radioactive decay releasing heat in Earth's mantle and core (Gemini, JSON-first).

const lesson = {
  id: 'phys-u2-l07-radioactivity-heat-engine',
  title: 'Radioactivity: The Heat Engine',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 207,
  visible: false,
  dueDate: '2026-10-13', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'Radioactivity: The Heat Engine', subtitle: 'Unit 2 · Lesson 7' }),

    k.objectives([
      'Explain that radioactive decay releases thermal energy',
      'Connect Earth\'s internal heat to the energy that drives mantle convection',
      'Use conservation of energy to trace the source of forces in the crust',
    ]),

    k.text(
      "We know Earth's interior is hot enough to keep the mantle slowly moving. But where does that heat come from? Some of " +
      "it is leftover from Earth's formation. A large and continuous source comes from **radioactive decay** — the process " +
      "by which unstable atomic nuclei break apart and release energy."
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "In this lesson, the **system** is Earth's interior, especially the mantle and core. The **surroundings** include " +
        "radioactive isotopes such as uranium-238, thorium-232, and potassium-40 that release energy as they decay. Energy " +
        "crosses into the system as heat from these nuclear processes.",
    }),

    k.text(
      "**Decay → heat → motion**\n\n" +
      "When a radioactive nucleus decays, a small amount of mass is converted into a large amount of energy. That energy " +
      "heats the surrounding rock. Over geologic time, this heat builds up and sets up temperature differences in the mantle. " +
      "Hot rock rises; cooler rock sinks. That circulation is **convection**, and it drags on the plates above.\n\n" +
      "The total energy in this process is conserved. The nuclear energy released by decay becomes thermal energy, then " +
      "mechanical work as the mantle moves and the crust is pulled apart."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Key Ideas',
      content:
        "- **Radioactive decay** — unstable nuclei break apart and release energy\n" +
        "- **Nuclear energy → thermal energy** — the decay process heats surrounding rock\n" +
        "- **Thermal energy → mechanical work** — convection currents exert forces that move plates\n" +
        "- **Conservation of energy** — energy is not created or destroyed, only transferred and transformed",
    }),

    k.shortAnswer({
      prompt:
        "**Trace the energy chain.** Starting with radioactive decay, describe the path energy takes to become a force that " +
        "can move a tectonic plate.",
      placeholder: 'Radioactive decay releases…',
      difficulty: 'analyze',
    }),

    k.mc({
      prompt: 'Which statement best describes the role of radioactive decay inside Earth?',
      options: [
        'Decay releases thermal energy that powers mantle convection',
        'Decay removes heat from the mantle and cools the core',
        'Decay creates new tectonic plates at Earth\'s surface over time',
        'Decay only happens in the crust and has no effect on the mantle',
      ],
      correctIndex: 0,
      explanation:
        'Radioactive decay releases energy that heats the mantle. This thermal energy drives convection, which exerts forces ' +
        'on tectonic plates.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**Scale check.** The heat from radioactive decay is released very slowly, yet Earth has stayed geologically active " +
        "for billions of years. Why does a small rate of heating still matter over geologic time?",
      placeholder: 'Even a small rate of heating…',
      difficulty: 'analyze',
    }),

    k.cer({
      prompt:
        'Use conservation of energy to explain how nuclear processes deep inside Earth can lead to a crack forming at the surface in Afar.',
      claimHint: 'State how energy from decay becomes a surface force.',
      evidenceHint: 'Cite the energy transfers and transformations involved.',
      reasoningHint: 'Explain why energy conservation means the heat cannot just disappear; it must do work somewhere.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
