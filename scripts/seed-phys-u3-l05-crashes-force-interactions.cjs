// seed-phys-u3-l05-crashes-force-interactions.cjs — Unit 3 Lesson 5: force pairs in collisions.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l05-crashes-force-interactions.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u3-l05-crashes-force-interactions',
  title: 'Crashes Are Force Interactions',
  unit: 'Unit 3: Collisions & Momentum',
  order: 305,
  visible: false,
  dueDate: '2026-10-20', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '💥', title: 'Crashes Are Force Interactions', subtitle: 'Unit 3 · Lesson 5' }),

    k.objectives([
      'Identify force pairs in a collision',
      'Use Newton\'s third law to predict forces on both objects in a crash',
      'Explain why damage can differ even when forces are equal',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u3-l05-crashes-force-interactions-impact-scene.jpg',
      alt: 'A stylized crash-test view of two vehicles meeting head-on at the instant of impact, the front ends beginning to crumple.',
      caption: 'At the moment of impact, each vehicle pushes on the other with an equal and opposite force. *(Illustration.)*',
    }),

    k.text(
      "When two cars collide, each one pushes on the other. Car A pushes on Car B, and Car B pushes back on Car A with a " +
      "force that is **equal in size and opposite in direction**. That is Newton's third law — and it is true whether the " +
      "cars are the same size or wildly different."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Newton\'s Third Law',
      content:
        "$$\\vec{F}_{A \\text{ on } B} = -\\vec{F}_{B \\text{ on } A}$$\n\n" +
        "Whenever object A exerts a force on object B, object B exerts an equal and opposite force on object A. " +
        "The forces are the same strength, but they act on **different objects**.",
    }),

    k.text(
      "**Define the system.** If the system is just Car A, then the force from Car B is an external force that changes " +
      "Car A's motion. If the system is the two cars together, the A-on-B and B-on-A forces are **internal** to the " +
      "system — they cancel out when we look at the whole system. Choosing the system carefully changes what counts as " +
      "external and what doesn't."
    ),

    k.mc({
      prompt: 'A small car and a large SUV collide head-on. According to Newton\'s third law, how do the forces they exert on each other compare?',
      options: [
        'The SUV exerts a larger force on the car',
        'The car exerts a larger force on the SUV',
        'No forces act because the collision is brief',
        'They exert equal-and-opposite forces on each other',
      ],
      correctIndex: 3,
      explanation:
        'Newton\'s third law says the forces are equal in magnitude and opposite in direction, regardless of the masses. ' +
        'The SUV does not push harder just because it is bigger.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'If the forces are equal, why is the small car usually more damaged than the SUV?',
      options: [
        'The same force causes a larger acceleration in the less-massive car',
        'The SUV\'s force actually lasts longer on the car',
        'The small car hits the SUV with less momentum',
        'Newton\'s third law does not apply to vehicles',
      ],
      correctIndex: 0,
      explanation:
        'From $a = F_{net}/m$, the same force produces a larger acceleration on the smaller mass. Larger acceleration ' +
        'means larger changes in velocity and more deformation.',
      difficulty: 'apply',
    }),

    k.sketch({
      title: 'Force-Pair Diagram',
      instructions:
        'Draw a small car and a large SUV just before, during, and after a head-on collision. Label the equal-and-opposite ' +
        'force pair. Then label which vehicle experiences the larger acceleration.',
      prompt: 'Use arrows to show the forces. Remember: the arrows are the same length, but the accelerations are not.',
    }),

    k.cer({
      prompt:
        'Explain how the same collision can exert equal forces on two vehicles but cause very different damage.',
      claimHint: 'State whether the forces are equal and whether the effects are equal.',
      evidenceHint: 'Use Newton\'s third law (force pair) and Newton\'s second law ($a = F_{net}/m$) in your evidence.',
      reasoningHint: 'Explain why equal forces lead to unequal accelerations when masses differ, and why that matters for damage.',
    }),

    k.shortAnswer({
      prompt:
        "**Pick your system.** Describe the same crash twice: first with just the small car as the system, then with " +
        "both vehicles as the system. What counts as an external force in each case?",
      placeholder: 'System 1 (small car): …\nSystem 2 (both cars): …',
      difficulty: 'analyze',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
