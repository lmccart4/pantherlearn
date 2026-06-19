// seed-phys-u1-l12-energy-sources.cjs — Unit 1 Lesson 12: cost-benefit of energy sources + family interview.
// Standards: HS-ESS3-2 (evaluate competing design solutions for developing/managing/using energy resources
// based on cost-benefit ratios), ESS3.A (natural resources).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l12-energy-sources.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u1-l12-energy-sources',
  title: 'Where Should Our Energy Come From?',
  unit: 'Unit 1: Energy & the Grid',
  order: 112,
  visible: false,
  dueDate: '2026-09-23', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'Where Should Our Energy Come From?', subtitle: 'Unit 1 · Lesson 12' }),

    k.objectives([
      'Compare energy sources by weighing their costs against their benefits',
      'Gather criteria from our own community for making energy decisions',
    ]),

    k.text(
      "We've followed the energy from the plant to your outlet, watched Sandy break the grid, and figured out how to " +
      "store energy and bring it back. Now comes the big design question — the one engineers actually argue about: " +
      "**where should that energy come from in the first place?**\n\n" +
      "The main sources on the table are **natural gas**, **nuclear**, **solar**, **wind**, and **hydro**. Right now, " +
      "New Jersey leans hard on just two of them. In 2024, our electricity came roughly **49.6% from natural gas** and " +
      "**45% from nuclear** — together more than **90%** of the state's power. Solar added about **2.9%**, biomass about " +
      "**1.1%**, and everything else was a sliver. In fact, gas and nuclear have supplied over nine-tenths of NJ's " +
      "electricity *every single year since 2011*, and both are **thermal plants** — they make heat to boil water to spin " +
      "turbines.\n\n" +
      "So here's the question worth chewing on: **should that change?**"
    ),

    k.mdTable({
      lead: '**Energy Source Trade-Offs**',
      headers: ['Energy source', 'Cost', 'Emissions', 'Reliability / availability', 'Land use'],
      rows: [
        ['Natural gas', 'Moderate', 'Emits CO₂', 'High — dispatchable on demand', 'Moderate'],
        ['Nuclear', 'High upfront', 'Very low carbon', 'High — runs around the clock', 'Low (small footprint)'],
        ['Solar', 'Falling', 'Very low', 'Intermittent — only when the sun shines', 'High (large arrays)'],
        ['Wind', 'Falling', 'Very low', 'Intermittent — only when the wind blows', 'Moderate to high'],
      ],
    }),

    k.callout({
      style: 'info',
      icon: '⚖️',
      title: 'Evaluating Competing Solutions',
      content:
        "Look across that table and you'll notice something: **there is no perfect energy source.** Every option that's " +
        "cheap or clean gives something up somewhere else — emissions, reliability, cost, or land.\n\n" +
        "This is what engineers actually do. They don't search for a flawless answer that doesn't exist — they **weigh " +
        "the trade-offs against a set of criteria** and choose the best fit for a specific place and its needs " +
        "*(HS-ESS3-2)*. The hard part isn't the physics. It's deciding **which criteria matter most**.",
    }),

    k.externalLink({
      icon: '📊',
      title: "New Jersey's Real Energy Mix (U.S. EIA)",
      description: "See the official numbers for where New Jersey's electricity actually comes from — and how the mix has shifted over time.",
      url: 'https://www.eia.gov/electricity/state/newjersey/',
      buttonLabel: 'See NJ Energy Data',
    }),

    k.text(
      "**Your task tonight: interview your family.**\n\n" +
      "Engineering is a human endeavor — the criteria come from real people, not from a textbook. So go find out what " +
      "your community actually cares about. Ask a parent, a grandparent, a guardian, or another adult in your life one " +
      "simple question:\n\n" +
      "*\"When it comes to the electricity that powers our home, what matters most to you?\"*\n\n" +
      "Listen for what they bring up on their own. Do they care most about **cost** — keeping the bill affordable? " +
      "About **reliability** — power that stays on, even in a storm like Sandy? About **clean air** and lower emissions? " +
      "Something else entirely? Bring back what they say — their words become criteria we'll use to redesign the grid."
    ),

    k.shortAnswer({
      prompt:
        "**Report back from your interview.**\n\nWho did you talk to (a parent, guardian, grandparent, or other adult), " +
        "and what criteria did they care about **most** about our energy? Write down what they said and **why** it " +
        "mattered to them.",
      placeholder: 'I talked to… The thing they cared about most was… because…',
      difficulty: 'understand',
    }),

    k.ranking({
      prompt:
        "Now bring it together. Using what you learned from the trade-offs table **and** your family interview, " +
        "**rank these criteria from MOST to LEAST important for OUR community** in Perth Amboy. There's no single " +
        "right order — defend the one you choose.",
      items: [
        'Low cost / affordable bills',
        'Reliability (power that stays on in storms)',
        'Low emissions / clean air',
        'Uses local space and resources wisely',
      ],
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
