// seed-phys-u2-l10-vectors-direction-matters.cjs — Unit 2 Lesson 10: force has direction; qualitative vector addition.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u2-l10-vectors-direction-matters.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u2-l10-vectors-direction-matters',
  title: 'Vectors: Direction Matters',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 210,
  visible: false,
  dueDate: '2026-10-16', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'Vectors: Direction Matters', subtitle: 'Unit 2 · Lesson 10' }),

    k.objectives([
      'Represent a force as a vector with magnitude and direction',
      'Add vectors qualitatively to find a net force',
      'Predict plate motion from the direction of the net force',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u2-l10-vectors-balanced-unbalanced.jpg',
      alt: 'A two-panel diagram: balanced forces with two equal opposite arrows canceling to net zero, and unbalanced forces with two unequal opposite arrows leaving a net force toward the larger arrow.',
      caption: 'Equal, opposite forces cancel (net = 0). Unequal opposite forces leave a net force toward the larger one. *(Diagram.)*',
    }),

    k.text(
      "A force is more than a number. It has a **direction**. If you push a box north and a friend pushes the same box south " +
      "with the same strength, the box does not move. The forces cancel. But if one push is stronger, the box moves in the " +
      "direction of the stronger force."
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "In this lesson, the **system** is a tectonic plate acted on by two or more forces. The **surroundings** are the " +
        "mantle, neighboring plates, and any other object that pushes or pulls on it. The net force on the system determines " +
        "whether and how the plate accelerates.",
    }),

    k.text(
      "**Vectors**\n\n" +
      "A vector is an arrow that shows both **how big** a quantity is and **which way** it points. For forces, the length of " +
      "the arrow shows the magnitude and the arrowhead shows the direction.\n\n" +
      "When two forces act along the same line, we can add them as signed numbers. If one force is $+F$ to the right and " +
      "another is $-F$ to the left, the net force is $F_{net} = F + (-F) = 0$. If the rightward force is larger, $F_{net}$ " +
      "points to the right."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u2-l10-vectors-net-force-plate.jpg',
      alt: 'A tectonic plate with a long slab-pull force arrow pointing right and a shorter mantle-drag arrow pointing left, and a bold net-force arrow pointing right showing the plate accelerates toward the larger force.',
      caption: 'Add the forces on a plate as vectors: the net force points toward the larger force, so the plate accelerates that way. *(Diagram.)*',
    }),

    k.embed({
      url: `${TOOLS_BASE}/vector-addition.html`,
      // REUSE TODO: reskin + score wiring for OpenSciEd plate-motion context; verify bilingual toggle and activityScore postMessage.
      caption: '➡️ **Vector Addition Visualizer** — Add forces as vectors. Predict the net force on a plate and the direction it will move.',
      height: 750,
    }),

    k.mc({
      prompt: 'A plate feels a 4-unit force to the east and a 4-unit force to the west. What is the net force?',
      options: [
        '8 units east, as if the forces add',
        '8 units west, as if the forces add',
        '16 units total, the sum of both forces',
        'Zero, so the plate does not accelerate',
      ],
      correctIndex: 3,
      explanation:
        'Equal and opposite forces along the same line cancel. The net force is zero, so the plate does not accelerate, ' +
        'although it may still be moving at constant velocity.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**Apply to plates.** A plate is pushed east by mantle drag and west by slab pull. (Here the mantle is moving slower " +
        "than the plate, so mantle drag acts *against* the motion.) If slab pull is stronger, sketch or describe the net " +
        "force and predict the plate\'s acceleration.",
      placeholder: 'The net force points…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Why does the direction of a force matter when predicting plate motion?',
      claimHint: 'State why direction must be included in a force analysis.',
      evidenceHint: 'Use an example from the Vector Addition Visualizer or the lesson.',
      reasoningHint: 'Explain how adding vectors with direction gives a net force that predicts motion.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
