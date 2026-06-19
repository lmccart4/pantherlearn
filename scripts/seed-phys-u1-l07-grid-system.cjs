// seed-phys-u1-l07-grid-system.cjs — Unit 1 Lesson 7: supply must match demand + Grid Reliability Simulator (LEARN).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l07-grid-system.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u1-l07-grid-system',
  title: 'The Grid as a System',
  unit: 'Unit 1: Energy & the Grid',
  order: 107,
  visible: false,
  dueDate: '2026-09-16',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'The Grid as a System', subtitle: 'Unit 1 · Lesson 7' }),

    k.objectives([
      'Explain why the electricity generated must match the electricity used at every moment',
      'Use a model to balance generation and demand across a full day',
      'Describe what keeps the grid stable — and what happens when balance is lost',
    ]),

    k.callout({
      style: 'insight',
      icon: '⚖️',
      title: 'Balance or Blackout',
      content:
        "On the grid, the electricity being **generated** must match the electricity being **used** (the **load**) " +
        "in real time — second by second. There's almost nowhere to put the extra, and no reserve to pull from if " +
        "you fall short. Too much or too little, and the system destabilizes.\n\n" +
        "*Crosscutting Concept: Stability & Change — a system stays stable only as long as its inputs and outputs " +
        "stay in balance.*",
    }),

    k.text(
      "Up to now we've followed energy through the grid one piece at a time. Now we zoom out and look at the whole " +
      "thing as a **system**. The **system** here is the regional power grid: every generator feeding in on one side, " +
      "every home, school, and business drawing power out on the other.\n\n" +
      "The amount of power people draw — the **demand**, or **load** — is never constant. It rises and falls across " +
      "the day. It's **low overnight** while people sleep, climbs through the morning, dips midday, and usually " +
      "**peaks in the evening** when everyone is home cooking, heating or cooling, and charging devices at once. " +
      "Grid operators can't store much of this electricity, so they constantly **adjust generation** — turning plants " +
      "up and down — to match demand as it changes, minute by minute."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l07-load-curve.jpg',
      alt: 'A daily electricity demand curve that is low overnight, rises through the morning, dips midday, and peaks in the early evening.',
      caption: 'Demand is never flat — it dips overnight and spikes in the evening. The grid has to match this curve hour by hour.',
    }),

    k.embed({
      url: `${TOOLS_BASE}/grid-reliability-simulator.html?mode=learn`,
      caption:
        '🔌 **Grid Reliability Simulator (Learn Mode)** — Set an energy mix and watch demand rise and fall across ' +
        'a full day. Your goal: keep generation **at or above demand at every hour**, including the evening peak, ' +
        'without blacking out.',
      height: 800,
    }),

    k.mc({
      prompt:
        'If electricity demand suddenly exceeds supply and nothing adjusts, what is the **most likely** result?',
      options: [
        'The grid frequency drops and parts of the grid shut off to protect equipment (a blackout)',
        'The extra demand is automatically stored away and saved for use later that day',
        'The voltage rises across the grid and connected appliances simply run faster',
        'Nothing happens, because on the grid supply is always exactly equal to demand',
      ],
      correctIndex: 0,
      explanation:
        'When load outruns generation, the generators are pulled harder than they can keep up with and the grid ' +
        'frequency sags. To protect equipment from damage, sections of the grid automatically disconnect — that\'s a ' +
        'blackout. The grid can\'t magically store the shortfall, raising voltage doesn\'t fix it, and supply only ' +
        'equals demand because operators work to keep it that way.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "In your own words, **why does the grid have to constantly balance supply and demand?** What did the " +
        "simulator show you about what happens when it can't?",
      placeholder: 'The grid has to stay balanced because…\n\nIn the simulator I saw that…',
      difficulty: 'apply',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
