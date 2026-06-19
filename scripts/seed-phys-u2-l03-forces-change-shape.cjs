// seed-phys-u2-l03-forces-change-shape.cjs — Unit 2 Lesson 3: introducing force as push/pull and balanced/unbalanced forces.
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u2-l03-forces-change-shape',
  title: 'Forces Can Change Shape',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 203,
  visible: false,
  dueDate: '2026-10-07', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'Forces Can Change Shape', subtitle: 'Unit 2 · Lesson 3' }),

    k.objectives([
      'Define a force as a push or a pull',
      'Distinguish balanced and unbalanced forces',
      'Connect shape changes in materials to unbalanced forces',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u2-l03-forces-change-shape-tension-compression-shear.jpg',
      alt: 'A three-panel diagram of a rock block under tension (arrows pulling apart, block stretched), compression (arrows pushing together, block squashed), and shear (offset opposite arrows, block slanted).',
      caption: 'Three ways unbalanced forces change the shape of rock: tension stretches, compression squashes, shear slants. *(Diagram.)*',
    }),

    k.text(
      "Afar's crust didn't crack by itself. Something **pushed** or **pulled** it until it broke. In physics, any push or " +
      "pull is called a **force**.\n\n" +
      "Forces don't only change motion. They can also **change shape**. A stretched rubber band gets longer. A squeezed " +
      "sponge gets flatter. A bent ruler curves. Rock works the same way — it just needs much larger forces."
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "In today's hands-on activity, the **system** is the object you stretch, compress, or bend — for example, a piece " +
        "of clay, foam, or a flexible strip. The **surroundings** are your hands, the table, and Earth. Forces cross the " +
        "system boundary whenever you push or pull on the object.",
    }),

    k.text(
      "**Balanced vs. unbalanced forces**\n\n" +
      "When forces on an object add to zero, they are **balanced**. In that case, the object keeps doing whatever it was " +
      "already doing (or stays at rest). When the forces do not add to zero, they are **unbalanced**. An unbalanced force " +
      "can speed something up, slow it down, or — important for this unit — change its shape.\n\n" +
      "We write the net force as $F_{net}$. Balanced forces mean $F_{net} = 0$. Unbalanced forces mean $F_{net} \\neq 0$."
    ),

    k.text(
      "**Hands-on: stretch, compress, bend**\n\n" +
      "Mr. McCarthy will give your group a material to investigate. Pull it, squeeze it, and bend it. For each test, " +
      "record what the force does to the shape of the material."
    ),

    k.shortAnswer({
      prompt:
        "**Describe your results.** What happened when you stretched, compressed, and bent the material? Which change in " +
        "shape was easiest to produce, and which required the most force?",
      placeholder: 'When I stretched the material…',
      difficulty: 'apply',
    }),

    k.mc({
      prompt: 'Which statement about forces and shape is true?',
      options: [
        'An unbalanced force can stretch, compress, or bend an object',
        'Balanced forces always make an object move faster and faster',
        'A force only changes an object if it is larger than Earth\'s gravity',
        'When all forces cancel out, an object must change its shape',
      ],
      correctIndex: 0,
      explanation:
        'An unbalanced force ($F_{net} \\neq 0$) can change an object\'s shape by stretching, compressing, or bending it. ' +
        'Balanced forces ($F_{net} = 0$) do not cause change.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**Everyday example.** Describe something you have seen or done where a force changed an object's shape. Identify " +
        "the system, the force, and the change in shape.",
      placeholder: 'Example: …',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'How does the idea of unbalanced force help explain the crack that formed in Afar?',
      claimHint: 'State how unbalanced forces relate to the rift.',
      evidenceHint: 'Use an observation from the Afar event or from your hands-on test.',
      reasoningHint: 'Explain why an unbalanced force can break or split rock, not just move it.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
