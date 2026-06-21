// seed-phys-u1-l09-who-lost-power-v3.cjs — Unit 1 Lesson 9: equity & values in restoration (human endeavor).
// v3 = v2 lesson plus appended native graded practice blocks from l09-data-analysis-sheet.md.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l09-who-lost-power-v3.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u1-l09-who-lost-power',
  title: 'Who Lost Power?',
  unit: 'Unit 1: Energy & the Grid',
  order: 109,
  visible: false,
  dueDate: '2026-09-18',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'Who Lost Power?', subtitle: 'Unit 1 · Lesson 9' }),

    k.objectives([
      'Analyze disparities in who lost power and who got it back first after Sandy',
      'Discuss the values and trade-offs behind energy restoration decisions',
      'Recognize that engineering choices are a human endeavor, not just physics',
      'Use data from a table to compare outage durations across counties',
    ]),

    k.text(
      "We've spent this unit learning the physics of *why* the grid failed — flooded substations, downed lines, the path energy " +
      "takes to your home. But the lights didn't come back on for everyone at the same time. Restoration was **not uniform**.\n\n" +
      "When a storm knocks out power for millions, a utility can't fix everything at once. They make choices about **what to repair " +
      "first**. Standard practice is to prioritize **hospitals, emergency services, and densely populated areas** — places where the " +
      "most people, or the most vulnerable people, depend on power. That's a reasonable starting point. But it also means *someone* " +
      "waits longer, and the order isn't decided by physics alone.\n\n" +
      "One more thing to keep in mind: **Perth Amboy is served by JCP&L** (Jersey Central Power & Light), not PSE&G. Which utility you " +
      "happened to live under shaped how long you stayed in the dark."
    ),

    k.mdTable({
      lead: '**NJ Outage Duration After Sandy — Longest-Tail Counties (avg. days without power)**',
      headers: ['County / Area', 'Average Days Without Power'],
      rows: [
        ['Monmouth', '~10'],
        ['Somerset', '~9'],
        ['Union', '~9'],
        ['Ocean', '~8'],
        ['Some individual NJ towns', 'up to 22'],
      ],
      note: 'Statewide, 17% of NJ towns had outages lasting longer than 10 days. Source: Center for American Progress (NJ town/county data).',
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l09-outage-map.jpg',
      alt: 'Map of New Jersey shading the counties with the longest average power outages after Superstorm Sandy: Monmouth about 10 days, Somerset and Union about 9 days, Ocean about 8 days, with Perth Amboy marked in Middlesex County.',
      caption: 'The hardest-hit counties by average outage duration (Center for American Progress). Counties not separately reported in the source are left unshaded.',
    }),

    k.callout({
      style: 'question',
      icon: '⚖️',
      title: 'Whose Call Is It?',
      content:
        "Deciding **who gets power back first** is not something physics can answer. Physics tells you it's faster to dry out and " +
        "re-energize one switching station than to repair a thousand scattered downed lines — but it can't tell you whether a hospital, " +
        "a senior housing complex, or a low-income neighborhood *should* come first.\n\n" +
        "Those are **value judgments** made by people: utilities, regulators, and emergency planners. Engineering is a **human " +
        "endeavor** — every technical decision carries a choice about whose needs matter most.",
    }),

    k.text(
      "**The equity angle.** A long outage isn't an equal burden. The longer the power stays off, the harder it falls on **low-income " +
      "families**. With some towns dark for up to 22 days, people couldn't get to work or earn income, food spoiled in dead refrigerators, " +
      "and anyone relying on powered medical equipment was put at real risk.\n\n" +
      "The clearest data on this is from **New York City** (so it describes NYC, not New Jersey): there, **55% of the people hit by " +
      "Sandy's storm surge were very low-income renters**, with an average household income of about **$18,000 per year**. People with " +
      "the fewest resources were often the ones living where the flooding — and the outages — hit hardest, and they had the least cushion " +
      "to absorb the loss.\n\n" +
      "Back in NJ, residents talked about a **\"tale of two utilities.\"** JCP&L — the company that serves Perth Amboy — drew the most " +
      "complaints about slow restoration and poor communication, while PSE&G was generally seen as faster. Whether or not that was fair " +
      "to each company, it fueled a real **perception of unequal service** depending on where you lived."
    ),

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Worked Example: How much longer did Monmouth County wait than Ocean County?',
      content:
        "The table gives these average outage durations:\n\n" +
        "- Monmouth County: ~$10$ days\n" +
        "- Ocean County: ~$8$ days\n\n" +
        "**Step 1:** Identify the two values you need.\n\n" +
        "**Step 2:** Subtract the shorter duration from the longer one.\n\n" +
        "$$10\\text{ days} - 8\\text{ days} = 2\\text{ days}$$\n\n" +
        "So, on average, a household in Monmouth County was without power about **2 days longer** than a household in Ocean County.\n\n" +
        "**Step 3:** Put the number in context. Two extra days without power means two extra days of spoiled food, no heat, and no way to " +
        "charge medical devices. The difference is not just a number — it shapes how people experienced the storm.",
    }),

    k.mc({
      prompt: 'According to the outage-duration table, which county had the longest average outage?',
      options: [
        'Ocean County, about 8 days',
        'Union County, about 9 days',
        'Somerset County, about 9 days',
        'Monmouth County, about 10 days',
      ],
      correctIndex: 3,
      explanation: 'The table lists Monmouth County at about 10 days, which is the longest average shown.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'Which groups are typically prioritized when utilities restore power after a major storm?',
      options: [
        'Hospitals, emergency services, and densely populated areas',
        'Shopping malls, schools, and sports stadiums',
        'The newest buildings and the most expensive neighborhoods',
        'Areas farthest from the utility headquarters',
      ],
      correctIndex: 0,
      explanation:
        'FEMA and utility restoration guidelines prioritize critical facilities and places where the most people depend on power.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'The lesson says that 55% of storm-surge victims in New York City were very-low-income renters. How might a long power outage ' +
        'hurt low-income families more than wealthier families? Give at least one specific reason.',
      placeholder: 'A long outage hurts low-income families more because…',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        '**Whose voices should help decide how our community\'s grid gets rebuilt — and who gets power back first?**\n\n' +
        "Think about residents, utilities, hospitals, emergency planners, local government, and groups hit hardest by long outages. " +
        'Explain your reasoning.',
      placeholder: 'The people who should have a say are… because…',
      difficulty: 'evaluate',
    }),

    k.cer({
      prompt:
        'Was the order in which power was restored after Sandy fair? Make a claim (yes, no, or it depends) and support it with at least one specific piece of data from the lesson.',
      claimHint: 'State your claim clearly in one sentence.',
      evidenceHint:
        'Cite the county-duration table, the 22-day figure, the NYC equity data, or the "tale of two utilities" idea.',
      reasoningHint:
        'Explain why your evidence supports your claim. Remember: "fair" is a value judgment, so your reasoning matters more than the claim itself.',
    }),

    k.callout({
      style: 'definition',
      icon: '📖',
      title: 'Vocabulary — Outages & Equity',
      content:
        '- **Outage:** a period when electric service is interrupted.\n' +
        '- **Infrastructure:** the physical systems — wires, substations, transformers, poles — that deliver electricity.\n' +
        '- **Restoration:** the process of repairing the grid and bringing power back.\n' +
        '- **Critical load:** facilities like hospitals, emergency services, and water-treatment plants that must stay powered.\n' +
        '- **Resilience:** the ability of a system to keep working or recover quickly after a disruption.\n' +
        '- **Equity:** fairness in how resources, risks, and recovery efforts are distributed.',
    }),

    k.shortAnswer({
      prompt:
        'If you were advising Perth Amboy on how to make the next storm recovery fairer, what is one change you would recommend? ' +
        'Explain your reasoning in two or three sentences.',
      placeholder: 'One change I would recommend is… because…',
      difficulty: 'evaluate',
    }),

    k.externalLink({
      icon: '📊',
      title: 'Source: NJ Town Outage Durations After Sandy',
      description:
        'Center for American Progress release on Superstorm Sandy and low-income communities, including county and town outage-duration data.',
      url: 'https://www.americanprogress.org/press/release-superstorm-sandy-extreme-weather-events-hit-low-income-communities-the-hardest/',
      buttonLabel: 'View CAP Release',
    }),

    k.externalLink({
      icon: '📚',
      title: 'Source: FEMA Power Outage Incident Annex',
      description:
        'FEMA guidance on power-outage response, including priorities for hospitals, emergency services, and critical infrastructure.',
      url: 'https://www.fema.gov/sites/default/files/documents/fema_incident-annex_power-outage.pdf',
      buttonLabel: 'Read FEMA Annex',
    }),

    k.externalLink({
      icon: '🏙️',
      title: "Source: NYU Furman Center — Sandy's Impact on NYC Renters",
      description: 'Fact brief on the income distribution of New Yorkers affected by Sandy\'s storm surge.',
      url: 'https://furmancenter.org/research/publication/fact-brief',
      buttonLabel: 'View Furman Center Brief',
    }),

    // ----- Appended native practice blocks from l09-data-analysis-sheet.md -----
    k.sectionHeader({ icon: '📊', title: 'Practice: Outage Duration & Equity', subtitle: 'Analyze the county data and connect it to fairness' }),

    k.shortAnswer({
      prompt:
        'Which county in the table had the longest average outage?',
      placeholder: 'The county with the longest average outage is…',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'How many more days, on average, did Monmouth County wait than Ocean County? Show your work.',
      placeholder: '$10 - 8 = $ ___ days',
      difficulty: 'apply',
    }),

    k.mc({
      prompt:
        'If a town was without power for 22 days, how many weeks is that? Round to the nearest whole week.',
      options: [
        '2 weeks',
        '3 weeks',
        '4 weeks',
        '5 weeks',
      ],
      correctIndex: 1,
      explanation:
        '$22 \\div 7 \\approx 3.14$, which rounds to 3 weeks.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'The map does not give a Middlesex County average. What is the closest county-level figure you can use to estimate Perth Amboy\'s experience?',
      placeholder: 'The closest county-level estimate is…',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'Why might Perth Amboy\'s actual outage duration have been different from the county average? Think about the waterfront, elevation, and which utility serves the city.',
      placeholder: 'Perth Amboy might have differed because…',
      difficulty: 'analyze',
    }),

    k.shortAnswer({
      prompt:
        'Name one way a long power outage can hurt low-income families more than wealthy families.',
      placeholder: 'A long outage hurts low-income families more because…',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'Utilities often prioritize hospitals, emergency services, and densely populated areas when restoring power. Give one reason this practice makes sense and one reason it can feel unfair.',
      placeholder: 'Makes sense: …\nCan feel unfair: …',
      difficulty: 'evaluate',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
