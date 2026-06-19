// seed-phys-u2-l08-mantle-convection.cjs — Unit 2 Lesson 8: convection currents in the mantle.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u2-l08-mantle-convection.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)
// IMAGE PHASE: cross-section of mantle convection cells with rising hot plumes and sinking cool slabs (Gemini, JSON-first).

const lesson = {
  id: 'phys-u2-l08-mantle-convection',
  title: 'Convection in the Mantle',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 208,
  visible: false,
  dueDate: '2026-10-14', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'Convection in the Mantle', subtitle: 'Unit 2 · Lesson 8' }),

    k.objectives([
      'Explain how convection works in Earth\'s mantle',
      'Connect rising and sinking mantle rock to forces on tectonic plates',
      'Use the convection model to predict where plates move apart or together',
    ]),

    k.text(
      "Heat from radioactive decay warms the mantle from below and from within. But hot rock does not just sit there. It " +
      "moves in slow, looping currents called **convection cells**. These cells are the engine that drives most large-scale " +
      "plate motion."
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "In this lesson, the **system** is a section of Earth's mantle beneath a tectonic plate. The **surroundings** are " +
        "the hot core below, the cold surface above, and neighboring mantle material. Heat enters from below; heat leaves " +
        "at the top. As the mantle moves, it exerts drag forces on the plate above.",
    }),

    k.text(
      "**How convection works**\n\n" +
      "Hot mantle rock is less dense than cooler rock, so it rises toward the surface. As it rises, it spreads outward. " +
      "Near the surface, it cools, becomes denser, and sinks back down. The cycle repeats over millions of years.\n\n" +
      "Where hot rock rises and spreads, it pulls the crust apart. Where cool rock sinks, it drags a plate downward. These " +
      "motions are not fast, but over geologic time they reshape entire continents."
    ),

    // IMAGE PHASE: annotated mantle convection cross-section with plate drag arrows (Gemini, JSON-first).

    k.embed({
      url: `${TOOLS_BASE}/mantle-convection.html`,
      caption: '🌊 **Convection / Mantle Motion Model** — Adjust heat and viscosity to see how mantle circulation drags on plates. Predict where the crust will spread or sink.',
      height: 750,
    }),

    k.mc({
      prompt: 'In a mantle convection cell, where does the crust tend to be pulled apart?',
      options: [
        'Where cool rock sinks near a trench',
        'Where the mantle is coldest and densest',
        'Where hot rock rises and spreads outward',
        'Where the core meets the inner core',
      ],
      correctIndex: 2,
      explanation:
        'Hot mantle rock rises and spreads outward beneath the crust. This outward drag pulls the crust apart, creating ' +
        'divergent boundaries and rift zones like Afar.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**Predict from the model.** If a region of mantle starts to rise faster than its neighbors, what should happen to " +
        "the plate above it? Use the words *force*, *unbalanced*, and *motion* in your answer.",
      placeholder: 'If mantle rises faster…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'How does mantle convection help explain why the Afar rift opened?',
      claimHint: 'State the role of convection in opening the rift.',
      evidenceHint: 'Cite one observation from the Convection / Mantle Motion Model or from earlier lessons.',
      reasoningHint: 'Connect rising hot mantle to an unbalanced force that stretches and cracks the crust.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
