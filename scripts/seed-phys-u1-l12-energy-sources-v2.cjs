// seed-phys-u1-l12-energy-sources-v2.cjs — Unit 1 Lesson 12: Where Should Our Energy Come From? (expanded).
// Generated from /Users/lukemccarthy/Lachlan/drafts/physics-content-review/expanded/l12-energy-sources-expanded.md
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l12-energy-sources-v2.cjs
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
      'Use a simplified cost-and-emissions comparison to evaluate two sources',
      'Construct a claim-evidence-reasoning argument for Perth Amboy\'s best energy mix',
    ]),

    k.text(
      "When you flip a light switch in Perth Amboy, the electricity could come from a nuclear reactor running at full speed 24 hours a day, a natural-gas plant that can be turned on when demand spikes, or a solar panel that only makes power while the sun shines.\n\n" +
      "Every option has a cost. Every option has an impact. And none of them is perfect. So how should a community decide what to build? That is the question engineers and policymakers are still arguing about — and it is the question you will answer today."
    ),

    k.text(
      "We've followed the energy from the plant to your outlet, watched Sandy break the grid, and figured out how to store energy and bring it back. Now comes the big design question — the one engineers actually argue about: **where should that energy come from in the first place?**\n\n" +
      "The main sources on the table are **natural gas**, **nuclear**, **solar**, **wind**, and **hydro**. Right now, New Jersey leans hard on just two of them. In **2024**, our electricity came roughly **49.6% from natural gas** and **45% from nuclear** — together more than **90%** of the state's power. Solar added about **2.9%**, biomass about **1.1%**, and everything else was a sliver. Gas and nuclear have supplied over nine-tenths of NJ's electricity *every single year since 2011*, and both are **thermal plants** — they make heat to boil water to spin turbines.\n\n" +
      "So here's the question worth chewing on: **should that change?**"
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l12-energy-source-collage.jpg',
      alt: 'Four energy facilities side by side: a natural-gas power plant, a nuclear cooling tower, a solar farm, and wind turbines.',
      caption: "New Jersey's electricity comes mostly from natural gas and nuclear plants, with a growing share from solar.",
    }),

    k.mdTable({
      lead: '**Typical Energy-Source Trade-Offs**',
      headers: ['Energy source', 'Cost', 'Emissions', 'Reliability / availability', 'Land use'],
      rows: [
        ['Natural gas', 'Moderate', 'Emits CO₂', 'High — dispatchable on demand', 'Moderate'],
        ['Nuclear', 'High upfront', 'Very low direct carbon', 'High — runs around the clock', 'Low (small footprint)'],
        ['Solar', 'Falling', 'Very low direct carbon', 'Intermittent — only when the sun shines', 'High (large arrays)'],
        ['Wind', 'Falling', 'Very low direct carbon', 'Intermittent — only when the wind blows', 'Moderate to high'],
      ],
      note: 'These are typical trade-offs, not exact figures for any single facility. Real costs, emissions, and land use vary by technology, location, and regulation.',
    }),

    k.callout({
      style: 'info',
      icon: '⚖️',
      title: 'Evaluating Competing Solutions',
      content:
        "Look across that table and you'll notice something: **there is no perfect energy source.** Every option that is cheap or clean gives something up somewhere else — emissions, reliability, cost, or land.\n\n" +
        "This is what engineers actually do. They don't search for a flawless answer that doesn't exist — they **weigh the trade-offs against a set of criteria** and choose the best fit for a specific place and its needs *(HS-ESS3-2)*. The hard part isn't the physics. It's deciding **which criteria matter most**.",
    }),

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Worked Example: A 1,000 kWh month',
      content:
        "Suppose a Perth Amboy household uses $1{,}000\\text{ kWh}$ of electricity in one month. Compare two possible ways to supply that electricity.\n\n" +
        "**Source A — Natural gas plant**\n" +
        "- Typical direct CO₂ emissions: about $0.9\\text{ lb CO}_2\\text{/kWh}$ (EIA natural-gas emissions factor).\n" +
        "- Typical cost to generate: about \\$0.05/kWh (illustrative wholesale cost, not the full retail bill).\n\n" +
        "**Source B — Utility-scale solar farm**\n" +
        "- Typical direct CO₂ emissions: near zero while operating.\n" +
        "- Typical cost to generate: about \\$0.03/kWh (illustrative, based on recent utility-scale solar trends).\n\n" +
        "**Monthly emissions:**\n\n" +
        "$$1{,}000\\text{ kWh} \\times 0.9\\text{ lb CO}_2\\text{/kWh} = 900\\text{ lb CO}_2$$\n\n" +
        "Solar: roughly $0\\text{ lb CO}_2$ for the electricity itself.\n\n" +
        "**Monthly generation cost:**\n\n" +
        "- Natural gas: $1,000\\text{ kWh} \\times \\text{\\$}0.05/\\text{kWh} = \\text{\\$}50$\n" +
        "- Solar: $1,000\\text{ kWh} \\times \\text{\\$}0.03/\\text{kWh} = \\text{\\$}30$\n\n" +
        "**Trade-off:** Solar wins on direct emissions and this simplified cost comparison, but it only produces when the sun shines. A grid that relies heavily on solar needs storage or backup for nights and cloudy days. Natural gas can run anytime, but it emits CO₂ and its fuel supply can be interrupted by pipeline problems.",
    }),

    k.mc({
      prompt: 'Which energy source has very low direct carbon emissions but is only available when the wind is blowing?',
      options: [
        'Natural gas, because it can be turned on whenever demand is high.',
        'Nuclear, because it runs continuously with very low emissions.',
        'Solar, because it only produces power during daylight.',
        'Wind, because its output depends on weather conditions.',
      ],
      correctIndex: 3,
      explanation:
        'Wind power has very low direct operating emissions, but turbines only generate when the wind blows, so their availability depends on the weather.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: "Which two sources supplied more than 90% of New Jersey's electricity in 2024?",
      options: [
        'Coal plants and wind turbines.',
        'Natural gas and nuclear.',
        'Solar farms and hydroelectric dams.',
        'Oil-fired plants and biomass.',
      ],
      correctIndex: 1,
      explanation:
        "According to U.S. EIA data for New Jersey, natural gas provided about 49.6% and nuclear about 45% of the state's electricity in 2024, together more than 90%.",
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'Using the worked example above, why might a city still use some natural gas even if solar has lower direct emissions and lower illustrative cost?',
      placeholder: 'Natural gas might still be useful because…',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'Before class tomorrow, ask an adult in your home: *"When it comes to the electricity that powers our home, what matters most to you — cost, reliability, clean air, or something else?"* Write down what they said and why it mattered to them.',
      placeholder: 'I talked to… They cared most about… because…',
      difficulty: 'understand',
    }),

    k.cer({
      prompt:
        'What energy mix should Perth Amboy aim for over the next 20 years? Make a claim, support it with evidence from the trade-offs table and the NJ energy-mix data, and explain your reasoning.',
      claimHint: 'State the mix you would choose (e.g., mostly natural gas + nuclear, or mostly solar + wind + storage, or a balanced combination).',
      evidenceHint: 'Cite specific trade-offs from the table — cost, emissions, reliability, land use — and any facts about NJ\'s current mix or Sandy.',
      reasoningHint: 'Explain why the criteria that matter most for Perth Amboy lead you to that mix, and acknowledge one weakness your mix still has.',
    }),

    k.callout({
      style: 'definition',
      icon: '📖',
      title: 'Vocabulary — Energy Sources',
      content:
        "- **Renewable energy:** energy from sources that are naturally replenished on a human timescale, such as sunlight and wind.\n" +
        "- **Nonrenewable energy:** energy from sources that cannot be quickly replenished, such as natural gas, coal, and oil.\n" +
        "- **Carbon emissions:** carbon dioxide released into the atmosphere, often from burning fossil fuels.\n" +
        "- **Intermittency:** the property of a power source that does not produce energy continuously; solar and wind are intermittent.\n" +
        "- **Baseload power:** power that is generated continuously to meet the minimum level of demand.\n" +
        "- **Dispatchable:** able to be turned on or increased quickly to meet demand; natural-gas plants are dispatchable.\n" +
        "- **Thermal power plant:** a plant that generates electricity by using heat to boil water and spin a turbine.",
    }),

    k.ranking({
      prompt:
        "Now bring it together. Using what you learned from the trade-offs table **and** your family interview, **rank these criteria from MOST to LEAST important for OUR community** in Perth Amboy. There's no single right order — defend the one you choose.",
      items: [
        'Low cost / affordable bills',
        'Reliability (power that stays on in storms)',
        'Low emissions / clean air',
        'Uses local space and resources wisely',
      ],
    }),

    k.shortAnswer({
      prompt:
        'What is one trade-off of your preferred energy source? Name the source and explain one benefit it gives up compared with another source.',
      placeholder: 'My preferred source is… One trade-off is…',
      difficulty: 'evaluate',
    }),

    k.text(
      "**Challenge:** New Jersey's energy mix is not fixed. State policy, technology prices, and climate goals all push it to change over time. Compare NJ's mix to another state you are curious about — for example, Texas, California, or Washington — and notice how geography and policy shape the choices."
    ),

    k.externalLink({
      icon: '📊',
      title: "New Jersey's Real Energy Mix (U.S. EIA)",
      description: "See the official numbers for where New Jersey's electricity actually comes from — and how the mix has shifted over time.",
      url: 'https://www.eia.gov/electricity/state/newjersey/',
      buttonLabel: 'See NJ Energy Data',
    }),

    k.externalLink({
      icon: '📚',
      title: 'Source: U.S. EIA — Energy Explained: Electricity',
      description: 'EIA primer on energy sources, generation, and the electricity grid.',
      url: 'https://www.eia.gov/energyexplained/electricity/',
      buttonLabel: 'Read EIA Primer',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
