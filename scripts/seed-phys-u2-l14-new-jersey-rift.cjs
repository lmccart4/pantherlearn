// seed-phys-u2-l14-new-jersey-rift.cjs — Unit 2 Lesson 14: Transfer Task — Could a New Rift Open in New Jersey? (SUMMATIVE)
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u2-l14-new-jersey-rift.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u2-l14-new-jersey-rift',
  title: 'Could a New Rift Open in New Jersey?',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 214,
  visible: false,
  dueDate: '2026-10-29', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'Could a New Rift Open in New Jersey?', subtitle: 'Unit 2 · Lesson 14 — Summative' }),

    k.objectives([
      'Apply the unit model to evaluate New Jersey geology',
      'Use evidence about ancient rifts, forces, and energy transfer to support a claim',
      'Write an evidence-based explanation using the CER format',
    ]),

    k.text(
      "This is the last lesson of the unit — and the moment we transfer our model to a new question. We started with the " +
      "2005 Afar rift and built an explanation using forces, energy transfer, convection, and plate tectonics. Now we ask: " +
      "**could a new rift open in New Jersey?**"
    ),

    k.text(
      "Here is what you know:\n\n" +
      "- New Jersey sits on top of the **ancient Newark Basin rift system**, and the **Palisades Sill** is nearby evidence of " +
      "past rift volcanism.\n" +
      "- Those rifts are **failed rifts**. The forces that opened them stopped acting roughly 200 million years ago.\n" +
      "- New Jersey is currently far from any active divergent plate boundary. The nearest active rifting is in the middle " +
      "of the Atlantic Ocean, along the Mid-Atlantic Ridge."
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "For this transfer task, the **system** is the crust and upper mantle beneath New Jersey and the surrounding region. " +
        "The **surroundings** include the convecting mantle below, neighboring tectonic plates, and the atmosphere above. A new " +
        "rift would require unbalanced forces from the surroundings to pull the system apart.",
    }),

    k.evidenceUpload({
      title: 'Upload Your Evidence',
      instructions:
        'Upload ONE annotated image or sketch that supports your answer. It can be a map showing NJ\'s location relative to ' +
        'active plate boundaries, a cross-section of the crust and mantle below NJ, or a labeled diagram of forces. Then ' +
        'write a one-sentence caption in the box below.',
      prompt: 'Caption: "This image shows ___ because ___."',
    }),

    k.cer({
      prompt:
        'Could a new rift open in New Jersey in the near future? Use evidence from this unit to support your answer.',
      claimHint: 'State clearly whether you think a new rift is likely, unlikely, or impossible — and over what time scale.',
      evidenceHint: 'Cite evidence about NJ\'s ancient rifts, current plate setting, and the forces/energy transfer needed for rifting.',
      reasoningHint: 'Explain how unbalanced forces, mantle convection, and the conditions for successful rifting apply to New Jersey.',
    }),

    k.teacherCheckpoint({
      id: 'phys-u2-l14-cp',
      title: 'Transfer — Teacher Score',
      prompt:
        'Mr. McCarthy reads your transfer explanation and scores it on the 3-dimensional rubric below. He is looking for ' +
        'whether you correctly applied this unit\'s forces, energy transfer, convection, and plate-tectonic ideas to evaluate ' +
        'a new situation — a complete claim, evidence pulled from the unit, and reasoning that ties the conditions for ' +
        'rifting to New Jersey. This is the summative grade that closes Unit 2.',
      weight: 15,
    }),

    k.rubric3D({
      title: 'Transfer Task Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u2-l14-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
