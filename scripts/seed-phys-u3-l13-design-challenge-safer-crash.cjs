// seed-phys-u3-l13-design-challenge-safer-crash.cjs — Unit 3 Lesson 13: SUMMATIVE design challenge.
// Standards: HS-PS2-3, HS-ETS1-3. Crumple-Zone Designer + 3-dimensional teacher rubric.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l13-design-challenge-safer-crash.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u3-l13-design-challenge-safer-crash',
  title: 'Design Challenge: Safer Crash',
  unit: 'Unit 3: Collisions & Momentum',
  order: 313,
  visible: false,
  dueDate: '2026-11-16', // PLACEHOLDER
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🛠️', title: 'Design Challenge: Safer Crash', subtitle: 'Unit 3 · Lesson 13 — Summative' }),

    k.objectives([
      'Design a crumple-zone / restraint system that keeps peak force on a passenger below a safety threshold',
      'Trade off crash safety against cost and weight constraints',
      'Justify design choices using momentum, impulse, and force ideas',
    ]),

    k.text(
      "This is the question we've been building toward: **How do we make a crash survivable?**\n\n" +
      "You are on a vehicle-safety engineering team. Your car hits a rigid wall at a fixed speed. You cannot change the " +
      "speed or the mass of the car — those are set by the crash test. What you *can* control is the front-end structure: " +
      "the material, the length of the crumple zone, and how it collapses. Your goal is to keep the peak force on the " +
      "passenger cell below the injury threshold while staying inside the budget and weight limits."
    ),

    k.callout({
      style: 'warning',
      icon: '📋',
      title: 'Criteria & Constraints',
      content:
        "Your design must satisfy **all three** criteria. The simulator checks these when you hit **Submit Design**:\n\n" +
        "- **Safety — peak force on the passenger cell must stay below the injury threshold.** A longer, softer crumple " +
        "zone lowers the peak force, but only if it still has room to collapse.\n" +
        "- **Cost — total design cost must stay within the budget.** Stronger or longer materials cost more.\n" +
        "- **Weight — total added weight must stay within the limit.** Extra material makes the car heavier, which can " +
        "affect fuel use and handling.\n\n" +
        "**The trade-off:** a longer crumple zone is safer but heavier and more expensive. A stiffer, shorter front end is " +
        "cheap and light but produces a larger peak force. Find the combination that passes all three tests.",
    }),

    k.text(
      "**Use the physics.** The total change in momentum of the car is fixed. Your design controls the **time** over " +
      "which that change happens. More collapse time means less peak force — but only if the structure collapses in a " +
      "controlled way and does not run out of room before the car stops."
    ),

    k.embed({
      url: `${TOOLS_BASE}/crumple-zone-designer.html`,
      caption:
        '🔧 **Crumple-Zone Designer** — Build your front-end structure, run the crash test, and iterate until your design ' +
        'passes the safety threshold without breaking the budget or weight limit.',
      height: 850,
    }),

    k.shortAnswer({
      prompt:
        "**Design rationale.**\n\nJustify your final design using evidence from this unit. Address all of these:\n\n" +
        "- **Crumple-zone choices:** which material, length, and collapse pattern you chose and *why*.\n" +
        "- **Physics justification:** how your design uses momentum, impulse, and force ideas to keep the passenger safe.\n" +
        "- **Trade-offs:** what you gave up to meet the safety threshold, and why that was the right choice.\n" +
        "- **Iteration:** describe at least one design that failed and what you changed.",
      placeholder: 'My design uses…\n\nThe physics is…\n\nI traded off…\n\nMy first try failed because…',
      difficulty: 'evaluate',
    }),

    k.teacherCheckpoint({
      id: 'phys-u3-l13-cp',
      title: 'Design — Teacher Score',
      prompt:
        "Mr. McCarthy reviews your submitted simulator design **and** your written rationale together, then scores them " +
        "on the 3-dimensional rubric below — your science ideas, your engineering practice, and the crosscutting lens " +
        "you bring to the problem. A design that passes the simulator but cannot be *explained* won't earn full " +
        "marks; a strong rationale that ignores the criteria won't either. Make sure your design holds and your " +
        "reasoning shows your work.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Design Challenge Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u3-l13-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
