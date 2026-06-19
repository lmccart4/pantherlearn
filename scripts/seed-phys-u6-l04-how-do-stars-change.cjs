// seed-phys-u6-l04-how-do-stars-change.cjs — Unit 6 Lesson 4: How Do Stars Change?.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l04-how-do-stars-change.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)
const IMG_BASE = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics';

const lesson = {
  id: 'phys-u6-l04-how-do-stars-change',
  title: 'How Do Stars Change?',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 604,
  visible: false,
  dueDate: '2026-10-02', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📊', title: 'How Do Stars Change?', subtitle: 'Unit 6 · Lesson 4' }),

    k.objectives([
      'Interpret a Hertzsprung-Russell (H-R) diagram as a temperature-luminosity graph',
      'Classify stars as main sequence, giant, or white dwarf based on their position',
      'Connect a star\'s position on the H-R diagram to its mass, temperature, color, and lifetime',
    ]),

    k.image({
      url: `${IMG_BASE}/phys-u6-l04-how-do-stars-change-hr-scaffold.jpg`,
      alt: 'A blank Hertzsprung-Russell diagram: temperature on the x-axis decreasing left to right (hot to cool), luminosity increasing upward, with a diagonal main-sequence band.',
      caption: 'The H-R diagram plots temperature (hot on the left, cool on the right) against luminosity. Most stars fall along the diagonal main sequence. *(Diagram.)*',
    }),

    k.text(
      "Stars are not all the same. Some are hot and blue; others are cool and red. Some are faint; some are incredibly " +
      "luminous. For decades, astronomers plotted stars by their **temperature** (or color) and **luminosity** (total " +
      "energy output). The resulting pattern, called the **Hertzsprung-Russell diagram**, is one of the most useful tools " +
      "in astrophysics."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'H-R Diagram Axes',
      content: "- **Horizontal axis:** temperature, hot on the left and cool on the right (backwards from typical graphs).\n" +
               "- **Vertical axis:** luminosity, plotted upward from dim to bright.\n" +
               "- **Main sequence:** the diagonal band where most stars spend most of their lives.",
    }),

    k.text(
      "The H-R diagram is not a map of where stars are in space. It is a **classification map**. A star's position tells " +
      "us about its stage of life. Massive stars are hot and bright, so they sit in the upper left of the main sequence. " +
      "Low-mass stars are cool and dim, so they sit in the lower right."
    ),

    k.image({
      url: `${IMG_BASE}/phys-u6-l04-how-do-stars-change-hr-labeled.jpg`,
      alt: 'A labeled H-R diagram showing the main-sequence diagonal, giants in the upper right, white dwarfs in the lower left, and the Sun mid-main-sequence.',
      caption: 'A star\'s position reveals its stage: main sequence (diagonal), giants (upper right, cool but bright), and white dwarfs (lower left, hot but dim). *(Diagram.)*',
    }),

    k.mdTable({
      lead: '**What H-R position tells us**',
      headers: ['Region', 'Temperature', 'Luminosity', 'Mass / stage hint'],
      rows: [
        ['Upper-left main sequence', 'Hot', 'Very luminous', 'Massive, young main-sequence stars'],
        ['Lower-right main sequence', 'Cool', 'Dim', 'Low-mass, long-lived main-sequence stars'],
        ['Upper right (giants)', 'Cool', 'Very luminous', 'Evolved, expanded stars'],
        ['Lower left (white dwarfs)', 'Hot', 'Dim', 'Dead stellar cores'],
      ],
      note: 'The Sun sits roughly in the middle of the main sequence.',
    }),

    k.embed({
      url: `${TOOLS_BASE}/hr-diagram-tool.html`,
      caption: '📈 **H-R Diagram Tool** — Place stars on a temperature-luminosity diagram, classify each region, and interpret what a star\'s position reveals about its mass and life stage.',
      height: 750,
    }),

    k.mc({
      prompt: 'A star is plotted in the upper-left corner of the H-R diagram. Which description fits best?',
      options: [
        'Cool, dim, and low-mass',
        'Hot, bright, and low-mass',
        'Hot, bright, and high-mass',
        'Cool, bright, and high-mass',
      ],
      correctIndex: 2,
      explanation: 'The upper-left of the H-R diagram means hot temperature (left side) and high luminosity (top). These are massive main-sequence stars.',
      difficulty: 'apply',
    }),

    k.mc({
      prompt: 'Why is the main sequence called a "sequence" rather than just a random scatter of stars?',
      options: [
        'Stars are lined up by distance from Earth',
        'Stars follow a clear pattern linking temperature, luminosity, and mass',
        'All stars move along it at the same speed',
        'It shows the order in which stars were born',
      ],
      correctIndex: 1,
      explanation: 'The main sequence shows an organized relationship: hotter stars are also more luminous and more massive. It is a pattern, not a random scatter.',
      difficulty: 'understand',
    }),

    k.cer({
      prompt: 'How does an H-R diagram help us figure out how stars change over their lifetimes?',
      claimHint: 'State what the H-R diagram reveals about a star\'s life stage.',
      evidenceHint: 'Use positions like main sequence, giants, and white dwarfs as evidence.',
      reasoningHint: 'Connect position to temperature, luminosity, and mass.',
    }),

    k.shortAnswer({
      prompt: 'A red giant and a white dwarf are both "dead or dying" stars, but they are in very different parts of the H-R diagram. What does that tell us about their properties?',
      placeholder: 'The red giant is… while the white dwarf is…',
      difficulty: 'apply',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
