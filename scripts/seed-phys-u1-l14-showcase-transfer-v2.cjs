// seed-phys-u1-l14-showcase-transfer-v2.cjs — Unit 1 Lesson 14: showcase + transfer task (SUMMATIVE unit closer, expanded).
// Generated from /Users/lukemccarthy/Lachlan/drafts/physics-content-review/expanded/l14-showcase-transfer-expanded.md
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l14-showcase-transfer-v2.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u1-l14-showcase-transfer',
  title: 'Showcase + Transfer Task',
  unit: 'Unit 1: Energy & the Grid',
  order: 114,
  visible: false,
  dueDate: '2026-09-25',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🎤', title: 'Showcase + Transfer Task', subtitle: 'Unit 1 · Lesson 14 — Summative' }),

    k.objectives([
      'Present your resilient-grid design and defend the choices behind it',
      'Transfer your energy and grid model to explain a brand-new blackout you have never studied',
      'Evaluate a peer\'s explanation using the transfer-task criteria',
      'Summarize how your answer to the unit\'s driving question has changed',
    ]),

    k.text(
      "This is the last lesson of the unit — and it's where everything comes together. We started in the dark, the night Sandy took out the lights in **Perth Amboy**. Since then you've followed the energy, taken apart the grid, and redesigned it. Today you do two things.\n\n" +
      "**First, the showcase.** You'll present your Lesson 13 resilient-grid design to the class. Be ready to explain:\n" +
      "- **What mix** of energy sources you chose (and roughly how much of each)\n" +
      "- **Why** that mix — what each source brings, and what its weakness is\n" +
      "- **How it survives a storm** — point to the exact moment in your simulator run where the design held when a weaker one would have failed\n\n" +
      "Keep it to about two minutes. Your job isn't to be perfect — it's to make a clear argument from evidence, the way an engineer defends a design."
    ),

    k.evidenceUpload({
      title: 'Upload Your Design',
      instructions:
        'Upload TWO things from your Lesson 13 work: (1) a screenshot of your grid simulator result — the run that shows ' +
        'your design surviving the storm — and (2) your presentation slide. Then write a one-line summary of your design in the box below.',
      prompt: 'One-line summary: "My grid uses ___ because ___, and it survives a storm because ___."',
    }),

    k.shortAnswer({
      prompt:
        "Listen to one classmate's showcase. Then answer these peer-review questions:\n\n" +
        "1. What energy mix did they choose?\n" +
        "2. What was their strongest piece of evidence?\n" +
        "3. What is one question you have about their design?",
      placeholder: 'They chose… / Their strongest evidence was… / I wonder…',
      difficulty: 'understand',
    }),

    k.text(
      "**Now the transfer task.** A real model isn't just one you can recite back for the phenomenon you studied — it's one you can carry to a situation you've never seen and still make sense of. So here's a different storm, a different grid: **does your model still explain it?**\n\n" +
      "In **February 2021**, Winter Storm Uri pushed extreme cold across **Texas**. Texas runs its own electric grid, managed by **ERCOT**, that is largely separated from the rest of the country. As the cold settled in, **roughly 4.5 million** homes and businesses lost power — many for days, in freezing temperatures.\n\n" +
      "What went wrong reads like a list of the ideas from this unit, all at once: equipment that produces power **froze**, demand for electric heat **spiked** at exactly the same time, and because the Texas grid is mostly **isolated** from its neighbors, it couldn't simply import enough power to make up the gap.\n\n" +
      "You never studied Texas. That's the point. Read the facts below, then apply *your* model."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l14-texas-grid-isolation.jpg',
      alt: 'Map of the United States highlighting the ERCOT grid region in Texas, separated from neighboring grids, with arrows blocked at the borders.',
      caption: "Texas's ERCOT grid is mostly isolated from neighboring grids, so it could not import enough power during the 2021 freeze.",
    }),

    k.mdTable({
      lead: '**Texas, February 2021 — What Happened (approximate)**',
      headers: ['What changed', 'Roughly what happened'],
      rows: [
        ['What froze', 'Natural-gas wellheads, pipes, and instruments — and some wind turbines — froze in the extreme cold, so they could not produce power'],
        ['Demand spike', 'Heating demand surged as millions ran electric heat at once during the freeze'],
        ['Why no imports', 'The Texas (ERCOT) grid is largely isolated from neighboring grids, so it could not import enough power to cover the shortfall'],
        ['Scale of outage', 'Roughly 4.5 million homes and businesses lost power, many for several days'],
      ],
      note: 'These figures are approximate and drawn from the UT Energy Institute\'s report on the February 2021 Texas blackouts. See the source link below.',
    }),

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Exemplar: How to explain a new blackout with your model',
      content:
        "*Sample claim:* The Texas grid failed because supply crashed and demand spiked at the same time, and the isolated ERCOT grid could not import backup power.\n\n" +
        "*Sample evidence:* Natural-gas equipment froze, so a major dispatchable source went offline. Wind turbines also froze, cutting another source. Meanwhile, demand for electric heat jumped. Because ERCOT is mostly isolated from neighboring grids, Texas could not buy enough power from outside to close the gap.\n\n" +
        "*Sample reasoning:* A grid must balance supply and demand every hour. When multiple supply sources fail simultaneously and demand rises sharply, the balance breaks. Storage and interconnections with neighboring grids are two ways to add resilience: storage covers short-term gaps, and interconnections let a grid import power when local generation fails. Texas lacked both at the scale needed.\n\n" +
        "This is what a strong transfer explanation looks like — but yours does not need to match it exactly.",
    }),

    k.cer({
      prompt:
        'Apply your energy and grid model to explain **WHY the Texas 2021 grid failed**, then propose **ONE** resilience fix that would have helped. Use the facts in the table above as your evidence.',
      claimHint: 'State, in one sentence, why the Texas grid failed — and name the one fix you would make.',
      evidenceHint: 'Cite specific facts from the table (what froze, the demand spike, the isolation) and connect them to ideas from this unit.',
      reasoningHint: 'Explain, using energy transfer/conservation and how a grid balances supply and demand, why those facts caused the failure and why your fix would help.',
    }),

    k.callout({
      style: 'definition',
      icon: '📖',
      title: 'Vocabulary Recap — Unit 1: Energy & the Grid',
      content:
        "- **Energy transfer:** energy moving from one object or place to another.\n" +
        "- **Energy transformation:** energy changing from one form to another (e.g., chemical → electrical → light).\n" +
        "- **Conservation of energy:** energy cannot be created or destroyed, only transferred or transformed.\n" +
        "- **Current:** the flow of electric charge.\n" +
        "- **Voltage:** the \"push\" that moves charge through a circuit.\n" +
        "- **Power:** the rate at which energy is transferred or transformed, $P = IV$.\n" +
        "- **Grid:** the interconnected system of power plants, transmission lines, and substations that delivers electricity.\n" +
        "- **Intermittency:** the property of solar and wind that they only generate when the weather allows.\n" +
        "- **Storage:** holding energy in a form that can be released later.\n" +
        "- **Dispatchable:** able to be turned on or ramped up quickly to meet demand.\n" +
        "- **Resilience:** the ability of a system to keep working or recover quickly after a disruption.\n" +
        "- **Criteria / constraints:** the goals and limits engineers use to evaluate designs.",
    }),

    k.shortAnswer({
      prompt:
        "The unit opened with this question: *How can we design a more reliable energy system for our community?* How has your answer changed since Lesson 1? Name at least one physics idea and one engineering idea that shaped your final answer.",
      placeholder: 'My answer has changed because… Physics idea: … Engineering idea: …',
      difficulty: 'evaluate',
    }),

    k.externalLink({
      icon: '📚',
      title: 'Source: UT Energy Institute — The Timeline and Events of the February 2021 Texas Electric Grid Blackouts',
      description: 'Authoritative committee report on the causes, scale, and impacts of the 2021 ERCOT blackouts.',
      url: 'https://energy.utexas.edu/research/ercot-blackout-2021',
      buttonLabel: 'Read UT Report',
    }),

    k.externalLink({
      icon: '📚',
      title: 'Source: U.S. EIA — Energy Explained: Electricity',
      description: 'EIA primer on electricity generation, transmission, and grid basics.',
      url: 'https://www.eia.gov/energyexplained/electricity/',
      buttonLabel: 'Read EIA Primer',
    }),

    k.teacherCheckpoint({
      id: 'phys-u1-l14-cp',
      title: 'Transfer — Teacher Score',
      prompt:
        'Mr. McCarthy reads your transfer explanation and scores it on the 3-dimensional rubric below. He is looking for ' +
        "whether you correctly applied this unit's energy and grid ideas to a phenomenon you never studied — a complete " +
        'claim, evidence pulled from the Texas facts, and reasoning that ties supply, demand, and energy together. This is ' +
        'the summative grade that closes Unit 1.',
      weight: 15,
    }),

    k.rubric3D({
      title: 'Transfer Task Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u1-l14-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
