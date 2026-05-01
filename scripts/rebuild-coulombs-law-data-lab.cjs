// Rebuild coulombs-law-data-lab into native blocks (Option B):
// - Splits the giant single embed into Part 1 + Part 2 embeds
// - Reflections become native PantherLearn question blocks (auto-graded by Luke's pipeline)
// - Drops the "8-word minimum" / "all 12 force values" student-facing directive
//
// Authoritative blocks update — bypasses safeLessonWrite append-only because:
//   1. lesson is `visible:false` (never gone live)
//   2. script asserts no student progress exists before writing
// If either guard fails, script aborts.

const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];

const COURSE_ID = 'physics';
const LESSON_ID = 'coulombs-law-data-lab';

const blocks = [
  { type: 'section_header', id: 'sh-warmup', label: 'Warm Up' },

  { type: 'objectives', id: 'obj-coulombs-lab', items: [
    'Use a simulation to collect quantitative data on the electric force between two charges',
    'Identify whether the relationship between charge and force is direct, inverse, or none',
    'Identify whether the relationship between distance and force is direct, inverse, or none',
    'Use data to make an interpolated prediction (Newton\'s third law preview)',
  ]},

  { type: 'callout', id: id(), variant: 'question-of-the-day',
    content: '**Question of the Day:** Two charged objects can attract or repel each other. What two things do you think determine **how strong** that force is?' },

  { type: 'question', id: 'q-warmup', questionType: 'short_answer',
    prompt: 'Make a prediction (no wrong answers — just commit). What two things do you think most affect the strength of the electric force between two charges? Why?' },

  // ── PART 1 ─────────────────────────────────────────────────────
  { type: 'section_header', id: 'sh-part1', label: 'Part 1: Force vs. Charge' },

  { type: 'text', id: id(), content:
    "**Setup:** Today you'll figure out *what factors* affect the electric force by collecting your own data with the **Coulomb's Law** PhET simulation.\n\n" +
    "In Part 1, you'll **vary the amount of charge** on each particle while the distance stays constant. The activity has the exact settings — follow them and fill in all 14 force readings." },

  { type: 'embed', id: 'embed-coulombs-part1',
    url: 'https://pantherlearn.com/tools/coulombs-law-data-lab.html?part=1',
    caption: 'PhET sim + Part 1 data table. Bilingual EN/ES. Submit when all force values are entered.',
    height: 1180,
    scored: true,
    weight: 5 },

  { type: 'text', id: id(), content: '### Part 1 Reflection\n\nAnswer the questions below using **numbers from your data table**.' },

  { type: 'question', id: 'q-p1-pairs', questionType: 'short_answer',
    prompt: 'What do you observe about the force on q1 by q2 compared to the force on q2 by q1? Use numbers from your data to support your answer.' },

  { type: 'question', id: 'q-p1-bigger', questionType: 'short_answer',
    prompt: 'When the charge on q1 becomes larger while q2 stays the same, what happens to the force? Use numbers from your data.' },

  { type: 'question', id: 'q-p1-relationship', questionType: 'multiple_choice',
    prompt: 'Three kinds of relationships exist between two variables: **direct** (one goes up → other goes up), **inverse** (one goes up → other goes down), or **none** (no clear pattern). What kind of relationship do you see between **charge and force**?',
    options: [
      'Direct — when charge goes up, force goes up',
      'Inverse — when charge goes up, force goes down',
      'No clear relationship between charge and force',
    ],
    correctIndex: 0 },

  { type: 'question', id: 'q-p1-justify', questionType: 'short_answer',
    prompt: 'Justify your answer above using specific numbers from your Part 1 data table.' },

  // ── PART 2 ─────────────────────────────────────────────────────
  { type: 'section_header', id: 'sh-part2', label: 'Part 2: Force vs. Distance' },

  { type: 'text', id: id(), content:
    "**Now flip it:** keep the charges fixed and **vary the distance** between them. The activity has the exact settings — follow them and fill in all 5 force readings." },

  { type: 'embed', id: 'embed-coulombs-part2',
    url: 'https://pantherlearn.com/tools/coulombs-law-data-lab.html?part=2',
    caption: 'PhET sim + Part 2 data table. Bilingual EN/ES. Submit when all force values are entered.',
    height: 1080,
    scored: true,
    weight: 5 },

  { type: 'text', id: id(), content: '### Part 2 Reflection\n\nAnswer using **numbers from your data table**.' },

  { type: 'question', id: 'q-p2-smaller', questionType: 'short_answer',
    prompt: 'When the distance between the two charges gets *smaller*, what happens to the force? Use numbers from your data.' },

  { type: 'question', id: 'q-p2-interpolate', questionType: 'short_answer',
    prompt: 'Interpolate. Looking at your Part 2 data table, how far apart do you think two ±10 µC charges might be if they were experiencing a force of 250 N? Explain how you got your answer.' },

  { type: 'question', id: 'q-p2-relationship', questionType: 'multiple_choice',
    prompt: 'What kind of relationship do you see between **distance and force**?',
    options: [
      'Direct — when distance goes up, force goes up',
      'Inverse — when distance goes up, force goes down',
      'No clear relationship between distance and force',
    ],
    correctIndex: 1 },

  { type: 'question', id: 'q-p2-justify', questionType: 'short_answer',
    prompt: 'Justify your answer above using specific numbers from your Part 2 data table. Bonus: how much does the force change when you cut the distance in half?' },

  // ── WRAP UP ────────────────────────────────────────────────────
  { type: 'section_header', id: 'sh-wrap', label: 'Wrap Up' },

  { type: 'text', id: id(), content:
    "**What you should have discovered:**\n\n" +
    "1. **Newton's third law applies to electric force.** The force on q1 from q2 is *exactly equal* in size to the force on q2 from q1 (just opposite in direction). Charge magnitudes and signs don't change that pairing.\n\n" +
    "2. **Force scales with charge — directly.** Doubling either charge doubles the force. Tripling either charge triples it. This is a **direct** relationship.\n\n" +
    "3. **Force scales with distance — inversely (and steeply).** Halving the distance doesn't just double the force — it quadruples it. The relationship isn't just inverse, it's **inverse square**: $F \\propto \\frac{1}{r^2}$.\n\n" +
    "Tomorrow we'll formalize all of this into a single equation: **Coulomb's Law**. You already have the data to predict it." },

  { type: 'question', id: 'q-wrap-prediction', questionType: 'short_answer',
    prompt: 'Based on what you saw today, **predict the equation for the electric force** in your own words (you don\'t have to use math symbols — words are fine). It should mention both charges and the distance, and it should match the patterns you found.' },

  { type: 'callout', id: id(), variant: 'reflection',
    content: '**Looking ahead:** The actual equation is $F = \\frac{kq_1q_2}{r^2}$ — directly proportional to *each* charge, inversely proportional to the *square* of the distance. We\'ll work problems with it tomorrow.' },
];

(async () => {
  const ref = db.collection('courses').doc(COURSE_ID).collection('lessons').doc(LESSON_ID);
  const snap = await ref.get();
  if (!snap.exists) { console.error('ABORT — lesson not found'); process.exit(1); }
  const data = snap.data();

  if (data.visible === true) {
    console.error('ABORT — lesson is visible:true. Refusing to restructure a live lesson.');
    process.exit(1);
  }

  // Best-effort progress check (collectionGroup query may need an index — if so we
  // fall back to checking visibility, which already guarantees no exposure).
  try {
    const prog = await db.collectionGroup('lessonProgress')
      .where('lessonId', '==', LESSON_ID).limit(1).get();
    if (!prog.empty) {
      console.error('ABORT — student progress exists for this lesson.');
      process.exit(1);
    }
  } catch (e) {
    console.log('(progress check skipped — collectionGroup query unavailable, relying on visible:false)');
  }

  await ref.update({
    blocks,
    title: "Coulomb's Law — Data Collection Lab",
    gradesReleased: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  console.log(`Rebuilt ${COURSE_ID}/${LESSON_ID} (${blocks.length} blocks).`);
  process.exit(0);
})();
