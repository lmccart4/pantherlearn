// seed-phys-u1-l09-who-lost-power.cjs — Unit 1 Lesson 9: equity & values (Science as a human endeavor).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l09-who-lost-power.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
// IMAGE PHASE: optional restoration-priority / NJ outage-duration map (Gemini, JSON-first) inserted after content is approved.

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
    ]),

    k.text(
      "We've spent this unit learning the physics of *why* the grid failed — flooded substations, downed lines, " +
      "the path energy takes to your home. But the lights didn't come back on for everyone at the same time. " +
      "Restoration was **not uniform**.\n\n" +
      "When a storm knocks out power for millions, a utility can't fix everything at once. They make choices about " +
      "**what to repair first**. Standard practice is to prioritize **hospitals, emergency services, and densely " +
      "populated areas** — places where the most people, or the most vulnerable people, depend on power. That's a " +
      "reasonable starting point. But it also means *someone* waits longer, and the order isn't decided by physics alone.\n\n" +
      "One more thing to keep in mind: **Perth Amboy is served by JCP&L** (Jersey Central Power & Light), not PSE&G. " +
      "Which utility you happened to live under shaped how long you stayed in the dark."
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

    k.callout({
      style: 'question',
      icon: '⚖️',
      title: 'Whose Call Is It?',
      content:
        "Deciding **who gets power back first** is not something physics can answer. Physics tells you it's faster to " +
        "dry out and re-energize one switching station than to repair a thousand scattered downed lines — but it can't " +
        "tell you whether a hospital, a senior housing complex, or a low-income neighborhood *should* come first.\n\n" +
        "Those are **value judgments** made by people: utilities, regulators, and emergency planners. Engineering is a " +
        "**human endeavor** — every technical decision carries a choice about whose needs matter most.",
    }),

    k.text(
      "**The equity angle.** A long outage isn't an equal burden. The longer the power stays off, the harder it falls on " +
      "**low-income families**. With some towns dark for up to 22 days, people couldn't get to work or earn income, food " +
      "spoiled in dead refrigerators, and anyone relying on powered medical equipment was put at real risk.\n\n" +
      "The clearest data on this is from **New York City** (so it describes NYC, not New Jersey): there, **55% of the " +
      "people hit by Sandy's storm surge were very low-income renters**, with an average household income of about " +
      "**$18,000 per year**. People with the fewest resources were often the ones living where the flooding — and the " +
      "outages — hit hardest, and they had the least cushion to absorb the loss.\n\n" +
      "Back in NJ, residents talked about a **\"tale of two utilities.\"** JCP&L — the company that serves Perth Amboy — " +
      "drew the most complaints about slow restoration and poor communication, while PSE&G was generally seen as faster. " +
      "Whether or not that was fair to each company, it fueled a real **perception of unequal service** depending on " +
      "where you lived."
    ),

    k.shortAnswer({
      prompt:
        "**Was the order in which power was restored FAIR?**\n\nMake a claim (yes, no, or it depends) and support it " +
        "with at least **one specific piece of data from the table above**. There's no single right answer here — your " +
        "reasoning is what counts.",
      placeholder: 'I think the restoration order was… The data that supports this is…',
      difficulty: 'evaluate',
    }),

    k.shortAnswer({
      prompt:
        "**Whose voices should help decide how our community's grid gets rebuilt — and who gets power back first?**\n\n" +
        "Think about residents, utilities, hospitals, emergency planners, local government, and groups hit hardest by " +
        "long outages. Explain your reasoning.",
      placeholder: 'The people who should have a say are… because…',
      difficulty: 'evaluate',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
