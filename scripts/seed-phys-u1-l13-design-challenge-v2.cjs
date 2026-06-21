// seed-phys-u1-l13-design-challenge-v2.cjs — Unit 1 Lesson 13: SUMMATIVE design challenge (expanded).
// Generated from /Users/lukemccarthy/Lachlan/drafts/physics-content-review/expanded/l13-design-challenge-expanded.md
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l13-design-challenge-v2.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u1-l13-design-challenge',
  title: 'Design Challenge: A Resilient Grid for Perth Amboy',
  unit: 'Unit 1: Energy & the Grid',
  order: 113,
  visible: false,
  dueDate: '2026-09-24',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🛠️', title: 'Design Challenge: A Resilient Grid for Perth Amboy', subtitle: 'Unit 1 · Lesson 13 — Summative' }),

    k.objectives([
      'Design an energy system that meets reliability, cost, and emissions criteria',
      'Engineer that system to survive a Sandy-scale storm without blacking out',
      'Justify your energy mix and storage choices with evidence from the whole unit',
      'Identify the strongest feature of your design and one trade-off you had to accept',
    ]),

    k.text(
      "This is it — the question we opened with on day one: **How can we design a more reliable energy system for our community?** Today *you* answer it.\n\n" +
      "You and your team are the **Perth Amboy Resilience Task Force**. The city has hired you to redesign the grid so that the next storm doesn't repeat October 2012 — when Superstorm Sandy left roughly **2.7 million** New Jersey customers in the dark, some of them for more than a week. Your job is to build a grid that keeps the lights on every hour, stays inside the city's budget, runs clean, and **keeps serving the city even when the storm hits**."
    ),

    k.callout({
      style: 'warning',
      icon: '📋',
      title: 'Criteria & Constraints',
      content:
        "Your design has to satisfy **all four** of these. These are the exact targets the simulator checks when you hit **Submit Design**:\n\n" +
        "- **Reliability — at least 95%** of hours served on a normal day. Supply must meet or beat demand nearly every hour; demand swings from a ~600 MW overnight base to a ~1,500 MW evening peak *(simulator parameters, not real Perth Amboy load data)*.\n" +
        "- **Budget — cost of $30 or less.** Every unit you add costs build points *(simulator parameters: solar/wind $2 each, gas $3, battery $4, nuclear $6)*. Spend over $30 and you're out of budget.\n" +
        "- **Emissions — keep it clean.** No high-carbon sources. Natural gas is the only high-carbon option in the kit, so a passing-grade clean design leans on nuclear, solar, wind, and batteries.\n" +
        "- **Storm survival — hold up under the Sandy storm.** Click **⛈ Run the Sandy Storm** (severity 0.9): it floods out flood-vulnerable sites, hides the sun behind storm clouds, and leaves only light wind. Your grid must stay **within ~15% of the reliability target (about 80% of hours served)** through the storm.",
    }),

    k.text(
      "**The trade-off you have to solve:** the cheap, dispatchable source in this simulator (natural gas) is *flood-vulnerable* and *emits CO₂* — exactly the kind of source that failed or strained during Sandy. The clean sources (solar, wind) are *weather-dependent*, so the storm guts them right when you need them most. Nuclear is clean and storm-proof but expensive, and **batteries** only give back energy you stored earlier. Balancing supply against demand **every hour — including the storm hour —** is the whole challenge."
    ),

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Worked Example: One possible design',
      content:
        "A student team proposes the following mix for the simulator:\n\n" +
        "- **2 nuclear units** ($6 \\times 2 = 12$ points)\n" +
        "- **3 solar units** ($2 \\times 3 = 6$ points)\n" +
        "- **3 wind units** ($2 \\times 3 = 6$ points)\n" +
        "- **1 battery unit** ($4 \\times 1 = 4$ points)\n" +
        "- **0 natural-gas units**\n" +
        "- **Total cost:** $12 + 6 + 6 + 4 = 28$ points *(within budget)*\n\n" +
        "**Why it might pass on a normal day:** Nuclear provides a steady baseload around the clock. Solar covers midday demand. Wind adds clean power when it blows. The battery stores midday solar and discharges in the evening.\n\n" +
        "**Why it might still fail the storm:** Sandy-level storms in the simulator cut solar and wind output. With only one battery, stored energy runs out quickly. The team might need to add more batteries or accept a small amount of natural gas as backup.\n\n" +
        "**The design process:** This example is *not* the only right answer. It shows how to check each criterion, notice the weak spot, and iterate. Your final design may look very different.",
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l13-resilient-grid-concept.jpg',
      alt: 'A simplified city grid diagram showing diverse energy sources, a battery, transmission lines, and a highlighted storm-resilient path.',
      caption: 'A resilient grid uses a mix of sources, storage, and hardened infrastructure so that no single failure takes everything down.',
    }),

    k.embed({
      url: `${TOOLS_BASE}/grid-reliability-simulator.html?mode=design`,
      caption: '🛠️ **Grid Reliability Simulator (Design Mode)** — Build your energy mix, then design a grid that holds the 95% reliability target on a normal day **and** survives the Sandy storm. Tune your sources, run the storm, and hit Submit Design when it holds.',
      height: 850,
    }),

    k.mc({
      prompt: 'Which criterion requires your design to supply electricity for at least 95% of hours on a normal day?',
      options: [
        'Budget — the design must cost $30 or less.',
        'Reliability — supply must meet demand nearly every hour.',
        'Emissions — the design must avoid high-carbon sources.',
        'Storm survival — the design must survive the Sandy storm.',
      ],
      correctIndex: 1,
      explanation:
        'The reliability criterion checks that your grid meets demand for at least 95% of hours on a normal day.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'A team spends 32 build points in the simulator. What happens?',
      options: [
        'The grid automatically loses the storm survival test.',
        'The emissions criterion is ignored.',
        'The design fails — it costs more than the $30 limit.',
        'The reliability target increases to 100%.',
      ],
      correctIndex: 2,
      explanation:
        'The budget constraint is $30 or less. Spending 32 points means the design violates the budget constraint and fails.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'Before you submit, look at your simulator results. Which criterion is your design strongest on, and which one is it weakest on? What is one change you could make to fix the weak spot?',
      placeholder: 'Strongest: ___ Weakest: ___ One change: ___',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        "Justify your final design using evidence from this entire unit. Address all of these:\n\n" +
        "- **Energy mix:** which sources you chose and *why*, in terms of the **energy transformations** each one runs (chemical/nuclear/radiant/kinetic → electrical).\n" +
        "- **Supply & demand:** how your design keeps supply balanced against demand across the day, especially at the evening peak.\n" +
        "- **Storage trade-offs:** what role batteries play, and the limits of leaning on storage.\n" +
        "- **Lessons from Sandy:** what actually failed in 2012, and how your design avoids repeating it under the storm.",
      placeholder: 'My energy mix is…\n\nTo balance supply and demand…\n\nMy storage choice…\n\nDuring Sandy, what failed was…',
      difficulty: 'evaluate',
    }),

    k.cer({
      prompt:
        'Your team claims that your design is the best fit for Perth Amboy. Make that claim, support it with evidence from the simulator and from this unit, and explain your reasoning.',
      claimHint: 'State, in one sentence, why your design is a good fit for Perth Amboy.',
      evidenceHint: 'Cite specific simulator results (reliability %, budget, emissions, storm survival) and facts from the unit (Sandy failures, source trade-offs, storage limits).',
      reasoningHint: 'Explain how your energy mix, storage, and redundancy work together to meet the criteria, and name one trade-off you accepted.',
    }),

    k.callout({
      style: 'definition',
      icon: '📖',
      title: 'Vocabulary — Engineering Design',
      content:
        "- **Criteria:** the goals a design must meet, such as reliability, low emissions, or low cost.\n" +
        "- **Constraints:** the limits a design must respect, such as budget, land, or materials.\n" +
        "- **Trade-off:** giving up one benefit to gain another, which is unavoidable when no option is perfect.\n" +
        "- **Resilience:** the ability of a system to keep functioning or recover quickly when something goes wrong.\n" +
        "- **Redundancy:** having backup parts or paths so that one failure does not shut down the whole system.\n" +
        "- **Dispatchable:** able to be turned on or increased quickly when needed.\n" +
        "- **Baseload:** the minimum level of demand on the grid over a day, supplied by steady-running sources.",
    }),

    k.shortAnswer({
      prompt:
        'What is the strongest feature of your resilient-grid design? What is one trade-off you had to accept to make it work?',
      placeholder: 'Strongest feature: ___ Trade-off: ___',
      difficulty: 'evaluate',
    }),

    k.text(
      "**Challenge:** Real utilities do exactly this kind of design work after major storms. After Sandy, PSE&G launched the **Energy Strong** program, spending billions of dollars to raise or flood-proof substations, replace gas mains in flood zones, and add smarter grid monitoring. Resilience is not just a classroom exercise — it is an ongoing engineering effort."
    ),

    k.externalLink({
      icon: '🏗️',
      title: 'Source: PSE&G Energy Strong — Post-Sandy Grid Hardening',
      description: 'PSE&G overview of infrastructure investments made after Superstorm Sandy to improve grid resilience.',
      url: 'https://poweringprogress.pseg.com/energy-strong/',
      buttonLabel: 'Read About Energy Strong',
    }),

    k.teacherCheckpoint({
      id: 'phys-u1-l13-cp',
      title: 'Design — Teacher Score',
      prompt:
        "Mr. McCarthy reviews your submitted grid design **and** your written rationale together, then scores them on the **3-dimensional rubric below** — your science ideas, your engineering practice, and the crosscutting lens you bring to the problem. A grid that technically passes the simulator but can't be *explained* won't earn full marks; a strong rationale that ignores the criteria won't either. Make sure your design holds and your reasoning shows your work.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Design Challenge Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u1-l13-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
