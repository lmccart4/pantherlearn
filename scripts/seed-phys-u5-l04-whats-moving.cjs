// seed-phys-u5-l04-whats-moving.cjs — Unit 5 Lesson 4: waves transfer energy without transferring matter.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l04-whats-moving.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u5-l04-whats-moving',
  title: "What's Moving?",
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 504,
  visible: false,
  dueDate: '2026-10-23', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '💧', title: "What's Moving?", subtitle: 'Unit 5 · Lesson 4' }),

    k.objectives([
      'Distinguish the motion of a wave from the motion of the medium',
      'Explain that waves transfer energy, not matter',
      'Revise the initial wave model to show particle motion vs. wave motion',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u5-l04-whats-moving-cork-water-wave.jpg',
      alt: 'A cork floats on water as a wave moves to the right; the wave and its energy travel forward while the cork only bobs up and down in place.',
      caption: 'The wave (and its energy) travels forward, but the cork only bobs up and down — the water itself stays put. *(Illustration.)*',
    }),

    k.text(
      "So far we've described what waves *look* like. Now we ask a deeper question: **what is actually moving?** " +
      "When a wave rolls across a pool, the water itself does not travel with the wave. If it did, all the water " +
      "would pile up at one end of the pool.\n\n" +
      "The **system** we'll think about is the water in a ripple tank plus the object floating on it. Energy enters " +
      "the system at the source and spreads outward through the water. The water particles move in small loops, but " +
      "the water as a whole stays in the tank."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'The Core Idea',
      content:
        "A **wave** is a disturbance that transfers **energy** from one place to another. It does **not** transfer " +
        "the matter of the medium itself. The particles of the medium oscillate around their equilibrium positions, " +
        "but they do not travel with the wave.",
    }),

    k.text(
      "**Classroom demo:** Watch the ripple tank. A small cork or paper bit is placed on the water surface. As the " +
      "wave passes, notice whether the cork rides the wave toward the edge of the tank or simply bobs up and down " +
      "and side to side. Then think about the slinky demo from Lesson 2: did any piece of the slinky travel from one " +
      "person's hand to the other?"
    ),

    k.mc({
      prompt: 'A cork floats on the surface of a pond as a wave passes by. Which statement best describes its motion?',
      options: [
        'It travels along with the wave toward the shore',
        'It sinks when the crest of the wave reaches it',
        'It speeds up because it gains energy from the wave',
        'It bobs up and down but returns to about the same place',
      ],
      correctIndex: 3,
      explanation:
        'In a water wave, the water particles (and anything floating on them) move in small orbital motions around ' +
        'their rest positions. The wave carries energy across the surface, but it does not carry the water or the cork ' +
        'along with it.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**Observing the medium.**\n\nDescribe what you saw the cork do in the ripple tank. Then explain what that " +
        "tells you about whether the water itself travels with the wave.",
      placeholder: 'The cork moved…',
      difficulty: 'apply',
    }),

    k.sketch({
      title: 'Revise Your Wave Model',
      instructions:
        'Draw a side view of a water wave. Add arrows showing how a single water particle moves as the wave passes. ' +
        'Then add a separate arrow showing the direction the wave energy travels.',
      prompt: 'Make sure your drawing shows that the particle motion and the wave motion are different.',
    }),

    k.cer({
      prompt:
        'A friend argues that ocean waves move water from the middle of the ocean all the way to the beach, which is why the sand gets wet. Use evidence from class to respond.',
      claimHint: 'State whether you agree or disagree with the friend.',
      evidenceHint: 'Use observations from the ripple tank or slinky demo.',
      reasoningHint: 'Explain the difference between energy transfer and matter transfer in a wave.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
