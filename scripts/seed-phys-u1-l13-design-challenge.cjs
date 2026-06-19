// seed-phys-u1-l13-design-challenge.cjs — Unit 1 Lesson 13: SUMMATIVE design challenge.
// Standards: HS-PS3-3, HS-ETS1. Grid Reliability Simulator (DESIGN mode) + 3-dimensional teacher rubric.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l13-design-challenge.cjs
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
      'Design an energy system that meets the reliability, cost, and emissions criteria',
      'Engineer that system to survive a Sandy-scale storm without blacking out',
      'Justify your energy mix and storage choices with evidence from the whole unit',
    ]),

    k.text(
      "This is it — the question we opened with on day one: **How can we design a more reliable energy system for our " +
      "community?** Today *you* answer it.\n\n" +
      "You and your team are the **Perth Amboy Resilience Task Force**. The city has hired you to redesign the grid so " +
      "that the next storm doesn't repeat October 2012 — when Superstorm Sandy left roughly **2.7 million** New Jersey " +
      "customers in the dark, some of them for more than a week. Your job is to build a grid that keeps the lights on " +
      "every hour, stays inside the city's budget, runs clean, and **keeps serving the city even when the storm hits**."
    ),

    k.callout({
      style: 'warning',
      icon: '📋',
      title: 'Criteria & Constraints',
      content:
        "Your design has to satisfy **all four** of these. These are the exact targets the simulator checks when you hit " +
        "**Submit Design**:\n\n" +
        "- **Reliability — at least 95%** of hours served on a normal day (supply must meet or beat demand nearly every " +
        "hour; demand swings from a ~600 MW overnight base to a ~1,500 MW evening peak).\n" +
        "- **Budget — cost of $30 or less.** Every unit you add costs build points (e.g. solar/wind $2 each, gas $3, " +
        "battery $4, nuclear $6). Spend over $30 and you're out of budget.\n" +
        "- **Emissions — keep it clean.** No high-carbon sources. Natural gas is the only high-carbon option in the kit, " +
        "so a passing-grade clean design leans on nuclear, solar, wind, and batteries.\n" +
        "- **Storm survival — hold up under the Sandy storm.** Click **⛈ Run the Sandy Storm** (severity 0.9): it floods " +
        "out flood-vulnerable sites, hides the sun behind storm clouds, and leaves only light wind. Your grid must stay " +
        "**within ~15% of the reliability target (about 80% of hours served)** through the storm.",
    }),

    k.text(
      "**The trade-off you have to solve:** the cheap, dispatchable source (natural gas) is *flood-vulnerable* and *dirty* " +
      "— exactly what failed during Sandy. The clean sources (solar, wind) are *weather-dependent*, so the storm guts " +
      "them right when you need them most. Nuclear is clean and storm-proof but expensive, and **batteries** only give " +
      "back energy you stored earlier. Balancing supply against demand **every hour — including the storm hour —** is the " +
      "whole challenge."
    ),

    k.embed({
      url: `${TOOLS_BASE}/grid-reliability-simulator.html?mode=design`,
      caption: '🛠️ **Grid Reliability Simulator (Design Mode)** — Build your energy mix, then design a grid that holds the 95% reliability target on a normal day **and** survives the Sandy storm. Tune your sources, run the storm, and hit Submit Design when it holds.',
      height: 850,
    }),

    k.shortAnswer({
      prompt:
        "**Design rationale.**\n\nJustify your final design using evidence from this entire unit. Address all of these:\n\n" +
        "- **Energy mix:** which sources you chose and *why*, in terms of the **energy transformations** each one runs " +
        "(chemical/nuclear/radiant/kinetic → electrical).\n" +
        "- **Supply & demand:** how your design keeps supply balanced against demand across the day, especially at the " +
        "evening peak.\n" +
        "- **Storage trade-offs:** what role batteries play, and the limits of leaning on storage.\n" +
        "- **Lessons from Sandy:** what actually failed in 2012, and how your design avoids repeating it under the storm.",
      placeholder: 'My energy mix is…\n\nTo balance supply and demand…\n\nMy storage choice…\n\nDuring Sandy, what failed was…',
      difficulty: 'evaluate',
    }),

    k.teacherCheckpoint({
      id: 'phys-u1-l13-cp',
      title: 'Design — Teacher Score',
      prompt:
        "Mr. McCarthy reviews your submitted grid design **and** your written rationale together, then scores them on the " +
        "**3-dimensional rubric below** — your science ideas, your engineering practice, and the crosscutting lens you " +
        "bring to the problem. A grid that technically passes the simulator but can't be *explained* won't earn full " +
        "marks; a strong rationale that ignores the criteria won't either. Make sure your design holds and your " +
        "reasoning shows your work.",
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
