// seed-phys-u1-l02-following-energy.cjs — Unit 1 Lesson 2: what energy is + Energy Flow Tracer embed.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l02-following-energy.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)
// IMAGE PHASE: plant→transmission→substation→home diagram (Gemini, JSON-first) inserted after content is approved.

const lesson = {
  id: 'phys-u1-l02-following-energy',
  title: 'Following the Energy',
  unit: 'Unit 1: Energy & the Grid',
  order: 102,
  visible: false,
  dueDate: '2026-09-09', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'Following the Energy', subtitle: 'Unit 1 · Lesson 2' }),

    k.objectives([
      'Define energy as the ability to cause change',
      'Identify the forms of energy along the path from power plant to home',
      'Trace how energy is transferred and transformed across the grid',
    ]),

    k.text(
      "Last lesson, the lights went out. Before we can fix the grid, we have to understand what's actually flowing " +
      "through it. So let's **follow the energy**.\n\n" +
      "**Energy** is the ability to cause change — to make something move, heat up, light up, or transform. The " +
      "**system** we'll trace in this lesson is the path energy takes from a *power plant* all the way to a *single home*."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Forms of Energy You\'ll Meet',
      content:
        "- **Chemical** — energy stored in the bonds of a fuel (like natural gas)\n" +
        "- **Thermal** — energy of hot, fast-moving particles (heat)\n" +
        "- **Mechanical** — energy of motion (a spinning turbine)\n" +
        "- **Electrical** — energy carried by moving charge in a wire\n" +
        "- **Radiant** — energy carried by light",
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l02-energy-path.jpg',
      alt: 'A diagram of the four stages electricity travels through: power plant, transmission towers, substation, and home.',
      caption: 'The path your electricity takes: generation → transmission → distribution → your outlet.',
    }),

    k.text(
      "Here's the journey. At a power plant, a fuel's **chemical** energy is released as **thermal** energy when it " +
      "burns. That heat boils water into steam, which spins a turbine — now the energy is **mechanical**. The spinning " +
      "turbine drives a generator that produces **electrical** energy. That electrical energy races through " +
      "transmission lines, steps down at substations, and finally reaches the outlet in your wall.\n\n" +
      "In New Jersey, almost all of our electricity comes from **natural gas and nuclear** plants. Both are *thermal* " +
      "plants — they make heat to boil water to spin turbines. (Here's a clue for later: during Sandy, the power " +
      "plants were mostly fine. Something else in this path broke.)"
    ),

    k.text(
      "**A quick refresher from chemistry:** energy is stored in the *motion* and *arrangement* of particles. When " +
      "natural gas burns, the energy stored in its chemical bonds is released and makes particles move faster — that's " +
      "what we feel as heat. Energy never appears from nowhere; it gets **transferred** and **transformed** from one " +
      "form into another."
    ),

    k.embed({
      url: `${TOOLS_BASE}/energy-flow-tracer.html`,
      caption: '🔋 **Energy Flow Tracer** — Follow the energy from the power plant to a home. Trace each transformation and keep the totals balanced.',
      height: 750,
    }),

    k.mc({
      prompt: 'At a natural-gas power plant, what is the **first** energy transformation that happens when the fuel is burned?',
      options: [
        'Electrical energy is transformed into thermal energy',
        'Chemical energy is transformed into thermal energy',
        'Mechanical energy is transformed into electrical energy',
        'Radiant energy is transformed into chemical energy',
      ],
      correctIndex: 1,
      explanation:
        'Burning fuel releases the chemical energy stored in its bonds as thermal energy (heat). That heat then boils ' +
        'water to spin a turbine (mechanical), which drives a generator (electrical). The chemical → thermal step comes first.',
      difficulty: 'understand',
    }),

    k.cer({
      prompt:
        'Where does the electrical energy in your home\'s outlet *originally* come from? Trace it all the way back to its source.',
      claimHint: 'Name the original source of the energy.',
      evidenceHint: 'List the forms the energy passes through, in order, from the plant to the outlet.',
      reasoningHint: 'Explain how each transformation hands the energy to the next stage.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
