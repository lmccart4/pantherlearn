// seed-phys-u1-l14-showcase-transfer.cjs — Unit 1 Lesson 14: showcase + transfer task (SUMMATIVE unit closer).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l14-showcase-transfer.cjs
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
    ]),

    k.text(
      "This is the last lesson of the unit — and it's where everything comes together. We started in the dark, the night " +
      "Sandy took out the lights in **Perth Amboy**. Since then you've followed the energy, taken apart the grid, and " +
      "redesigned it. Today you do two things.\n\n" +
      "**First, the showcase.** You'll present your Lesson 13 resilient-grid design to the class. Be ready to explain:\n" +
      "- **What mix** of energy sources you chose (and roughly how much of each)\n" +
      "- **Why** that mix — what each source brings, and what its weakness is\n" +
      "- **How it survives a storm** — point to the exact moment in your simulator run where the design held when a weaker " +
      "one would have failed\n\n" +
      "Keep it to about two minutes. Your job isn't to be perfect — it's to make a clear argument from evidence, the way " +
      "an engineer defends a design."
    ),

    k.evidenceUpload({
      title: 'Upload Your Design',
      instructions:
        'Upload TWO things from your Lesson 13 work: (1) a screenshot of your grid simulator result — the run that shows ' +
        'your design surviving the storm — and (2) your presentation slide. Then write a one-line summary of your design ' +
        'in the box below.',
      prompt: 'One-line summary: "My grid uses ___ because ___, and it survives a storm because ___."',
    }),

    k.text(
      "**Now the transfer task.** A real model isn't just one you can recite back for the phenomenon you studied — it's " +
      "one you can carry to a situation you've never seen and still make sense of. So here's a different storm, a " +
      "different grid: **does your model still explain it?**\n\n" +
      "In **February 2021**, Winter Storm Uri pushed extreme cold across **Texas**. Texas runs its own electric grid, " +
      "managed by **ERCOT**, that is largely separated from the rest of the country. As the cold settled in, " +
      "**roughly 4.5 million** homes and businesses lost power — many for days, in freezing temperatures.\n\n" +
      "What went wrong reads like a list of the ideas from this unit, all at once: equipment that produces power " +
      "**froze**, demand for electric heat **spiked** at exactly the same time, and because the Texas grid is mostly " +
      "**isolated** from its neighbors, it couldn't simply import enough power to make up the gap.\n\n" +
      "You never studied Texas. That's the point. Read the facts below, then apply *your* model."
    ),

    // DATA: Texas 2021 figures approximate — verify before high-stakes use
    k.mdTable({
      lead: '**Texas, February 2021 — What Happened (approximate)**',
      headers: ['What changed', 'Roughly what happened'],
      rows: [
        ['What froze', 'Natural-gas wellheads, pipes, and instruments — and some wind turbines — froze in the extreme cold, so they could not produce power'],
        ['Demand spike', 'Heating demand surged as millions ran electric heat at once during the freeze'],
        ['Why no imports', 'The Texas (ERCOT) grid is largely isolated from neighboring grids, so it could not import enough power to cover the shortfall'],
        ['Scale of outage', 'Roughly 4.5 million homes and businesses lost power, many for several days'],
      ],
    }),

    k.cer({
      prompt:
        'Apply your energy and grid model to explain **WHY the Texas 2021 grid failed**, then propose **ONE** resilience ' +
        'fix that would have helped. Use the facts in the table above as your evidence.',
      claimHint: 'State, in one sentence, why the Texas grid failed — and name the one fix you would make.',
      evidenceHint: 'Cite specific facts from the table (what froze, the demand spike, the isolation) and connect them to ideas from this unit.',
      reasoningHint: 'Explain, using energy transfer/conservation and how a grid balances supply and demand, why those facts caused the failure and why your fix would help.',
    }),

    k.teacherCheckpoint({
      id: 'phys-u1-l14-cp',
      title: 'Transfer — Teacher Score',
      prompt:
        'Mr. McCarthy reads your transfer explanation and scores it on the 3-dimensional rubric below. He is looking for ' +
        'whether you correctly applied this unit\'s energy and grid ideas to a phenomenon you never studied — a complete ' +
        'claim, evidence pulled from the Texas facts, and reasoning that ties supply, demand, and energy together. This ' +
        'is the summative grade that closes Unit 1.',
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
