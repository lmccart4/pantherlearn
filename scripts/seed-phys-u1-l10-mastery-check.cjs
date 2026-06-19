// seed-phys-u1-l10-mastery-check.cjs — Unit 1 Lesson 10: mid-unit summative (PS3.A/B, Systems).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l10-mastery-check.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u1-l10-mastery-check',
  title: 'Mid-Unit Mastery Check',
  unit: 'Unit 1: Energy & the Grid',
  order: 110,
  visible: false,
  dueDate: '2026-09-21',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📝', title: 'Mid-Unit Mastery Check', subtitle: 'Unit 1 · Lesson 10 — Summative' }),

    k.objectives([
      'Explain the Sandy blackout at the smallest scale — the electrons moving in the wires',
      'Explain it at the system scale — how energy flows across the grid and where it failed',
      'Explain it at the human scale — the decisions about who got their power restored, and when',
    ]),

    k.text(
      "We've spent this unit pulling the Sandy blackout apart one piece at a time — what energy is, how it moves " +
      "through a wire, how the whole grid hangs together as a **system**, and how people decided what to fix first. " +
      "Today is your chance to **pull the whole story back together** into one explanation that runs across every scale " +
      "we've studied, from the electrons in the wire all the way up to the human decisions about restoration.\n\n" +
      "This isn't about memorizing definitions. It's about **reasoning** — showing me that you can connect the small " +
      "scale to the big scale and tell the story so it holds together. Take your time, use the physics ideas you've " +
      "built, and explain your thinking the way you would to someone who lived through Sandy but never learned how the " +
      "grid works."
    ),

    k.sketch({
      title: 'Model the Whole Chain',
      instructions:
        'Draw and annotate the full causal chain of the Sandy blackout, from the smallest scale to the largest: ' +
        'electrons moving in the wires → energy flowing through the grid (plant → transmission → substation → home) → ' +
        'why Sandy broke that flow → the human decisions about who got power back first.',
      prompt:
        "Label **every transformation** (where energy changes form) and **every failure point** (where the chain broke " +
        "during the storm). Use arrows to show the direction energy flows.",
    }),

    k.cer({
      prompt:
        'Write one explanation that ties the scales together: **Explain how the Sandy blackout happened, connecting the ' +
        'physics (energy, current, the grid) to the human side (what failed, who was affected).**',
      claimHint: 'State, in one sentence, what fundamentally caused the blackout to happen and to last so long.',
      evidenceHint:
        'Cite specific physics ideas (energy transfer/transformation, current as moving charge, the grid as a system) ' +
        'and specific facts about Sandy and its effects on the community.',
      reasoningHint:
        'Explain how the small-scale physics connects to the system-scale failure and to the human decisions about ' +
        'restoration — show why each link in the chain leads to the next.',
    }),

    k.teacherCheckpoint({
      id: 'phys-u1-l10-cp',
      title: 'Mastery — Teacher Score',
      prompt:
        "Mr. McCarthy will read your model and your written explanation and score them together on the " +
        "**3-dimensional rubric below**. You're being graded on how well your reasoning connects the scales — the " +
        "physics, the system, and the human side — not on perfect handwriting or memorized vocabulary. Make your " +
        "thinking visible.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Mastery Check Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u1-l10-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
