// Coulomb's Law — Data Collection Lab (Physics)
// Discovery-first lab: students use the PhET sim to collect force-vs-charge / force-vs-distance data,
// identify the patterns, then the formal `coulombs-law` lesson (order 46) synthesizes the equation.
// Order: 45 (slots immediately before existing coulombs-law). Hidden until Luke flips visible.
//
// Structure (Option B — native blocks, not a single giant embed):
//   Warm Up  →  Part 1 (embed ?part=1, then native reflection blocks)
//            →  Part 2 (embed ?part=2, then native reflection blocks)
//            →  Wrap Up
// Reflections grade through the standard PantherLearn pipeline; each embed scores weight:5.
//
// Uses safeLessonWrite so re-runs preserve existing block IDs / student progress.

const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const { safeLessonWrite } = require('./safe-lesson-write.cjs');
const { v4: uuidv4 } = require('uuid');
const id = () => uuidv4().split('-')[0];

const COURSE_ID = 'physics';
const LESSON_ID = 'coulombs-law-data-lab';

const lesson = {
  id: LESSON_ID,
  title: "Coulomb's Law — Data Collection Lab",
  order: 45,
  visible: false,
  gradesReleased: true,
  unit: 'Electrostatics',
  gradeCategory: 'classwork',
  blocks: [
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
  ],
  createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

(async () => {
  try {
    const res = await safeLessonWrite(db, COURSE_ID, LESSON_ID, lesson);
    console.log(`${res.action} ${COURSE_ID}/${LESSON_ID} (preserved ${res.preserved})`);
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
  process.exit(0);
})();
