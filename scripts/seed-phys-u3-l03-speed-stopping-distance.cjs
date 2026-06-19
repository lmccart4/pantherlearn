// seed-phys-u3-l03-speed-stopping-distance.cjs — Unit 3 Lesson 3: speed, reaction distance, and braking distance.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l03-speed-stopping-distance.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u3-l03-speed-stopping-distance',
  title: 'Speed & Stopping Distance',
  unit: 'Unit 3: Collisions & Momentum',
  order: 303,
  visible: false,
  dueDate: '2026-10-15', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📈', title: 'Speed & Stopping Distance', subtitle: 'Unit 3 · Lesson 3' }),

    k.objectives([
      'Relate reaction distance and braking distance to speed',
      'Graph and predict total stopping distance from speed data',
      'Explain why small speed changes matter so much for safety',
    ]),

    k.text(
      "Yesterday we saw that distraction stretches the **reaction distance**. Today we're zooming in on the other " +
      "major factor: **speed**. Going faster affects both parts of stopping — reaction distance *and* braking distance. " +
      "The faster you go, the more road you need.\n\n" +
      "For an attentive driver with a typical reaction time, the total stopping distance at 20 mph is much shorter than " +
      "at 40 mph — but it doesn't just double. The braking distance grows with the **square** of speed, so doubling " +
      "your speed roughly *quadruples* the braking distance."
    ),

    k.mdTable({
      headers: ['Speed (mph)', 'Reaction distance (ft)', 'Braking distance (ft)', 'Total stopping distance (ft)'],
      rows: [
        ['20', '22', '20', '42'],
        ['30', '33', '45', '78'],
        ['40', '44', '80', '124'],
        ['50', '55', '125', '180'],
        ['60', '66', '180', '246'],
      ],
      lead: '**Reference data for dry pavement and a 0.75 s reaction time**',
      note: 'Values are rounded estimates for a typical passenger vehicle.',
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u3-l03-speed-stopping-distance-graph.jpg',
      alt: 'A stacked bar chart of stopping distance at 20, 40, and 60 mph, with each bar split into a reaction segment that grows in proportion to speed and a braking segment that grows with the square of speed and dominates at high speed.',
      caption: 'Reaction distance grows steadily with speed, but braking distance grows with the *square* of speed — which is why the total explodes as you go faster. *(Diagram.)*',
    }),

    k.embed({
      url: `${TOOLS_BASE}/stopping-distance.html`,
      caption: '🛑 **Stopping-Distance Calculator** — Use the graph to predict total stopping distance at different speeds, then check your prediction.',
      height: 750,
    }),

    k.mc({
      prompt: 'If a car doubles its speed from 30 mph to 60 mph, about how much does the **braking distance** change?',
      options: [
        'It stays about the same',
        'It doubles',
        'It is cut in half',
        'It roughly quadruples',
      ],
      correctIndex: 3,
      explanation:
        'Braking distance is proportional to the square of speed. Doubling speed means the braking distance ' +
        'increases by a factor of about four (from 45 ft to 180 ft in the table).',
      difficulty: 'apply',
    }),

    k.dataTable({
      title: 'Predict & Check',
      preset: 'numeric',
      rows: [
        { key: 'pred_25', label: '25 mph' },
        { key: 'pred_35', label: '35 mph' },
        { key: 'pred_45', label: '45 mph' },
      ],
      columns: [
        { key: 'predicted_total_ft', label: 'Your predicted total stopping distance (ft)' },
        { key: 'calculator_total_ft', label: 'Calculator total stopping distance (ft)' },
        { key: 'difference_ft', label: 'Difference (ft)' },
      ],
    }),

    k.shortAnswer({
      prompt:
        "**What pattern did you find?**\n\nDescribe how total stopping distance changes as speed increases. " +
        "Is the relationship linear? Explain.",
      placeholder: 'As speed increases, total stopping distance…',
      difficulty: 'analyze',
    }),

    k.cer({
      prompt:
        'A city council is deciding whether to lower a neighborhood speed limit from 40 mph to 30 mph. Use stopping-distance data to argue why this change could prevent crashes.',
      claimHint: 'State whether lowering the speed limit would meaningfully reduce stopping distance.',
      evidenceHint: 'Use specific numbers from the table or calculator to compare 30 mph and 40 mph.',
      reasoningHint: 'Explain why shorter stopping distance means fewer crashes, using the idea of reaction distance + braking distance.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
