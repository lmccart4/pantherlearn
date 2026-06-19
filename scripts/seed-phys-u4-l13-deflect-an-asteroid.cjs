// seed-phys-u4-l13-deflect-an-asteroid.cjs — Unit 4 Lesson 13: SUMMATIVE design challenge.
// Standards: HS-ETS1, HS-PS2-4, HS-PS3-1. Orbit/Gravity Simulator + 3-dimensional teacher rubric.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l13-deflect-an-asteroid.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u4-l13-deflect-an-asteroid',
  title: 'Design Challenge: Deflect an Asteroid',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 413,
  visible: false,
  dueDate: '2026-10-22', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🛠️', title: 'Design Challenge: Deflect an Asteroid', subtitle: 'Unit 4 · Lesson 13 — Summative' }),

    k.objectives([
      'Design a mission that changes an asteroid\'s velocity enough to miss Earth',
      'Trade off mission type, time to impact, mass, and energy requirements',
      'Justify the design using gravity, orbital motion, and energy ideas',
    ]),

    k.text(
      "This is the question we've been building toward: **If we found an asteroid heading for Earth, what could we do?**\n\n" +
      "You are on a planetary-defense engineering team. A small asteroid has been tracked, and its current orbit intersects " +
      "Earth\'s. You cannot change Earth\'s orbit. What you *can* control is when, where, and how you apply a small push or " +
      "pull to the asteroid. The earlier you act, the smaller the change you need — because orbits are sensitive to initial " +
      "conditions, especially over long times."
    ),

    k.callout({
      style: 'warning',
      icon: '📋',
      title: 'Criteria & Constraints',
      content:
        "Your design must satisfy **all three** criteria. The simulator checks these when you hit **Submit Design**:\n\n" +
        "- **Deflection — the asteroid\'s new orbit must miss Earth by a safe margin.** Even a tiny velocity change can " +
        "work if applied early enough.\n" +
        "- **Time — you must act before the close approach.** Earlier is better; late deflections need much more energy.\n" +
        "- **Feasibility — your mission type must be plausible with current or near-future technology.** Kinetic impactor, " +
        "gravity tractor, or nuclear standoff are the main options.\n\n" +
        "**The trade-off:** a kinetic impactor is fast but transfers less total momentum to a large asteroid. A gravity " +
        "tractor is slow but works on almost any size. A nuclear standoff can deflect more mass but is politically complex.",
    }),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "**System:** the asteroid, Earth, and the Sun — plus your spacecraft during the brief deflection maneuver. " +
        "**Surroundings:** everything else (gravity from Jupiter, solar radiation pressure, outgassing). We treat the system " +
        "as isolated enough that a small $\Delta v$ early on compounds into a large miss distance later.",
    }),

    k.embed({
      url: `${TOOLS_BASE}/orbit-gravity-sim.html?mode=deflect`,
      caption:
        '🛰️ **Orbit / Gravity Simulator — Deflection Mode** — Choose a deflection strategy, apply a velocity change to the ' +
        'asteroid, and run the orbit forward. Iterate until the asteroid misses Earth by a safe margin.',
      height: 850,
    }),

    k.evidenceUpload({
      title: 'Upload Your Mission Design',
      instructions:
        'Upload TWO things: (1) a screenshot of your simulator result showing the asteroid missing Earth, and (2) a sketch ' +
        'or slide of your spacecraft and deflection method. Then summarize your design below.',
      prompt: 'One-line summary: "My mission uses ___ to change the asteroid\'s ___ because ___."',
    }),

    k.shortAnswer({
      prompt:
        "**Design rationale.**\n\nJustify your final mission using evidence from this unit. Address all of these:\n\n" +
        "- **Mission type:** kinetic impactor, gravity tractor, or nuclear standoff — and *why* you chose it.\n" +
        "- **Physics justification:** how a small velocity change early in the orbit can become a large miss distance later.\n" +
        "- **Trade-offs:** what you gave up to meet the deflection and feasibility criteria.\n" +
        "- **Iteration:** describe at least one attempt that failed and what you changed.",
      placeholder: 'My mission uses…\n\nThe physics is…\n\nI traded off…\n\nMy first try failed because…',
      difficulty: 'evaluate',
    }),

    k.teacherCheckpoint({
      id: 'phys-u4-l13-cp',
      title: 'Design — Teacher Score',
      prompt:
        "Mr. McCarthy reviews your submitted simulator design **and** your written rationale together, then scores them " +
        "on the 3-dimensional rubric below — your science ideas, your engineering practice, and the crosscutting lens you " +
        "bring to the problem. A design that misses Earth but cannot be *explained* won't earn full marks; a strong " +
        "rationale that ignores the criteria won't either. Make sure your design holds and your reasoning shows your work.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Design Challenge Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u4-l13-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
