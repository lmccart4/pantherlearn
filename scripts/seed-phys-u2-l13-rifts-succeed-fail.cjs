// seed-phys-u2-l13-rifts-succeed-fail.cjs — Unit 2 Lesson 13: Why Some Rifts Succeed and Others Fail.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u2-l13-rifts-succeed-fail.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
// IMAGE PHASE: side-by-side cross-section comparing an active rift (Afar) and a failed ancient rift.

const lesson = {
  id: 'phys-u2-l13-rifts-succeed-fail',
  title: 'Why Some Rifts Succeed and Others Fail',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 213,
  visible: false,
  dueDate: '2026-10-28', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'Why Some Rifts Succeed and Others Fail', subtitle: 'Unit 2 · Lesson 13' }),

    k.objectives([
      'Compare a successful active rift with failed ancient rifts',
      'Identify the conditions that allow a rift to keep opening',
      'Construct an evidence-based argument about why a rift succeeded or failed',
    ]),

    k.text(
      "Not every crack in Earth's crust becomes a new ocean. Some rifts keep opening for millions of years and split a " +
      "continent apart. Others start, stretch the crust a little, and then stop. The difference comes down to **forces, " +
      "energy transfer, and conditions deep underground**."
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "In this lesson, the **system** is a rift zone plus the crust and upper mantle around it. The **surroundings** " +
        "include the convecting mantle below, neighboring plates, and the surface above. Whether the rift succeeds depends " +
        "on whether unbalanced forces from the surroundings keep pulling the system apart.",
    }),

    k.mdTable({
      lead: '**Comparing rifts: Afar, Midcontinent Rift, and Newark Basin**',
      headers: ['Feature', 'Status', 'Forces below', 'Why it stopped or kept going'],
      rows: [
        ['Afar Rift', 'Active / succeeding', 'Strong mantle upwelling pulls crust apart', 'Mantle forces remain unbalanced; rift is still opening today'],
        ['Midcontinent Rift', 'Failed / ancient', 'Large forces initially opened the crack', 'Forces became balanced or plate motion changed; rift froze in place'],
        ['Newark Basin', 'Failed / ancient', 'Crust stretched enough to form a basin and volcanism', 'Rifting ended before the continent split; sediment buried the record'],
      ],
      note: 'Success or failure depends on whether the forces driving rifting stay stronger than the forces holding the crust together.',
    }),

    k.text(
      "Think about it like stretching a piece of taffy. If you keep pulling, it thins and eventually breaks. If you stop " +
      "pulling, it just stays thinned and stretched. A successful rift keeps pulling until a continent splits. A failed " +
      "rift is the stretched, thinned crust left behind."
    ),

    k.shortAnswer({
      prompt:
        "**Use the table.** For both the Midcontinent Rift and the Newark Basin, describe what changed so that the rift " +
        "stopped opening.",
      placeholder: 'The forces probably changed because…',
      difficulty: 'analyze',
    }),

    k.mc({
      prompt: 'Which condition is most likely to let a rift keep opening and eventually split a continent?',
      options: [
        'The mantle below keeps rising and pulling the crust apart',
        'The crust becomes thick and heavy so it sinks quickly',
        'All forces on the crust stay perfectly balanced forever',
        'The rift forms far from any plate boundary or heat source',
      ],
      correctIndex: 0,
      explanation:
        'A rift succeeds when unbalanced forces keep pulling the crust apart. Persistent mantle upwelling is one of the main ' +
        'drivers that can maintain those forces over millions of years.',
      difficulty: 'understand',
    }),

    k.text(
      "**Building an argument**\n\n" +
      "Scientists don't just say 'it failed' — they argue from evidence. They compare the forces, the energy source, and " +
      "the history of motion. In your answer below, do the same: use evidence from the table and from what you know about " +
      "convection and unbalanced forces."
    ),

    k.cer({
      prompt:
        'Why did the Afar rift succeed while the Midcontinent Rift and Newark Basin failed?',
      claimHint: 'State what makes Afar different from the ancient North American rifts.',
      evidenceHint: 'Cite at least two differences from the comparison table or from the unit.',
      reasoningHint: 'Explain how unbalanced forces, energy transfer, and time determine whether a rift keeps opening.',
    }),

    k.callout({
      style: 'info',
      icon: '📌',
      title: 'Model Update',
      content:
        "Mr. McCarthy will add the strongest arguments to our class model. Tomorrow you will use this model to evaluate a " +
        "brand-new question: could a rift open in New Jersey?",
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
