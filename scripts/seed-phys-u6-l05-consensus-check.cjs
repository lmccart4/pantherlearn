// seed-phys-u6-l05-consensus-check.cjs — Unit 6 Lesson 5: Consensus Check: What We Know So Far.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l05-consensus-check.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const IMG_BASE = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics';

const lesson = {
  id: 'phys-u6-l05-consensus-check',
  title: 'Consensus Check: What We Know So Far',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 605,
  visible: false,
  dueDate: '2026-10-03', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🤝', title: 'Consensus Check: What We Know So Far', subtitle: 'Unit 6 · Lesson 5' }),

    k.objectives([
      'Synthesize spectra and H-R diagram evidence into a revised class model',
      'Distinguish between observations, inferences, and unanswered questions',
      'Complete a formative checkpoint on the anchor phenomenon',
    ]),

    k.image({
      url: `${IMG_BASE}/phys-u6-l05-consensus-check-star-model.jpg`,
      alt: 'A concept map with a star in the center, an arrow to a spectrum labeled composition and temperature, an arrow to an H-R diagram labeled luminosity and life stage, and an open question about why stars shine.',
      caption: 'What we know so far: spectra reveal a star\'s composition and temperature; the H-R diagram reveals its brightness and life stage. We still need to explain why stars shine. *(Diagram.)*',
    }),

    k.text(
      "We're wrapping up Lesson Set 1. So far, we have used **starlight** and the **H-R diagram** to figure out that " +
      "stars are not permanent, unchanging objects. They have compositions, temperatures, luminosities, and life stages. " +
      "Today we pull those ideas together and revise our class model."
    ),

    k.callout({
      style: 'info',
      icon: '🧭',
      title: 'Where We Stand',
      content: "- Stars emit light across the electromagnetic spectrum.\n" +
               "- A star's spectrum reveals which elements are in its atmosphere.\n" +
               "- The H-R diagram shows patterns linking temperature, luminosity, and life stage.\n" +
               "- We still need to explain *why* stars shine and *why* they eventually fade or explode.",
    }),

    k.text(
      "A good scientific model connects observations to explanations. Your job today is to help build a **consensus model** " +
      "that explains what we have figured out so far about the 'new star' phenomenon. Be specific: use evidence from spectra " +
      "and the H-R diagram, and label what is still uncertain."
    ),

    k.sketch({
      title: 'Revised Class Model',
      instructions: 'Draw a model that explains what we now understand about stars and "new stars." Include light, spectra, the H-R diagram, and at least one thing we still need to figure out.',
      prompt: 'How do spectra and the H-R diagram help us understand what a "new star" might be?',
    }),

    k.teacherCheckpoint({
      id: 'phys-u6-l05-cp',
      title: 'Consensus Model Checkpoint',
      prompt: 'Review the student\'s revised model. Score how well it uses spectra and H-R diagram evidence to explain what stars are and what a "new star" event might involve.',
      weight: 15,
    }),

    k.rubric3D({
      title: 'Consensus Model Rubric',
      linkedBlockId: 'phys-u6-l05-cp',
      totalPoints: 15,
    }),

    k.mc({
      prompt: 'Which statement best describes the difference between an observation and an inference in this unit so far?',
      options: [
        'An observation is data we collect; an inference is an explanation based on that data',
        'An observation is a guess; an inference is a fact',
        'They mean the same thing in science',
        'An observation requires a telescope; an inference does not',
      ],
      correctIndex: 0,
      explanation: 'Observations are the data (dark lines in a spectrum, position on an H-R diagram). Inferences are explanations we build from those observations.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'Which is the most important unanswered question our class model still needs to address?',
      options: [
        'What color the classroom walls are',
        'Whether stars are closer than the Moon',
        'How telescopes are built',
        'What makes stars shine and eventually stop shining',
      ],
      correctIndex: 3,
      explanation: 'The driving question is why stars shine and whether they shine forever. The most important unanswered question is what makes stars shine and what happens when they stop.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt: 'What is one thing your initial model from Lesson 1 got right? What is one thing you would change now?',
      placeholder: 'Got right: …\nWould change: …',
      difficulty: 'evaluate',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
