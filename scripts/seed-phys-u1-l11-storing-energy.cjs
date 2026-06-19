// seed-phys-u1-l11-storing-energy.cjs — Unit 1 Lesson 11: how we store energy + storage tradeoffs.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l11-storing-energy.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u1-l11-storing-energy',
  title: 'Storing Energy',
  unit: 'Unit 1: Energy & the Grid',
  order: 111,
  visible: false,
  dueDate: '2026-09-22',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'Storing Energy', subtitle: 'Unit 1 · Lesson 11' }),

    k.objectives([
      'Compare different ways to store energy and the energy form each one uses',
      'Explain how storage helps buffer renewable sources like solar and wind',
    ]),

    k.callout({
      style: 'insight',
      icon: '💡',
      title: 'Why Storage Matters',
      content:
        "Supply and demand don't always line up **in time**. Solar panels make the most power around midday, when the " +
        "sun is highest — but the demand for electricity in Perth Amboy peaks in the **evening**, when families get " +
        "home, turn on lights, cook dinner, and run the AC. The sun is already going down by then.\n\n" +
        "**Storage** is the fix. It lets the grid bank extra energy when there's plenty and release it later, when " +
        "it's needed. Without storage, a grid running on solar and wind would have power at the wrong times.",
    }),

    k.text(
      "There are three common ways to store energy, and each one parks the energy in a **different form**.\n\n" +
      "- **Batteries** store energy as **chemical** energy in the bonds inside their cells, then release it as " +
      "electrical energy on demand.\n" +
      "- **Pumped-hydro** stores energy as **gravitational potential energy**. When there's extra electricity, pumps " +
      "lift water uphill into a high reservoir. Later, that water falls back down through a turbine to make " +
      "electricity again. For this case, define the **system as the water plus the Earth** — gravitational potential " +
      "energy belongs to that pair, not to the water alone. The stored energy is $PE = mgh$, where $m$ is the mass of " +
      "water lifted, $g$ is the gravitational field strength, and $h$ is the height it's raised.\n" +
      "- **Thermal storage** stores energy as **heat** — for example, warming up a large tank of molten salt or water, " +
      "then drawing that heat back out later to boil water and spin a turbine.\n\n" +
      "In every case the energy is **transferred and transformed**, never created — we're just holding it in a " +
      "convenient form until the grid needs it back."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l11-storage-types.jpg',
      alt: 'Three energy-storage methods side by side: a battery, a pumped-hydro reservoir pair with a turbine, and a heated thermal-storage tank.',
      caption: 'Three ways to bank energy for later: chemical (battery), gravitational (pumped-hydro), and thermal (heat).',
    }),

    k.mdTable({
      lead: '**Energy Storage Trade-Offs**',
      headers: ['Storage type', 'Energy form stored', 'Response speed', 'Typical cost', 'How long it can store'],
      rows: [
        ['Battery', 'Chemical', 'Fast', 'High', 'Hours'],
        ['Pumped-hydro', 'Gravitational PE', 'Slow', 'Low', 'Hours to days'],
        ['Thermal', 'Heat', 'Slow', 'Low', 'Hours to days'],
      ],
    }),

    k.mc({
      prompt: 'Which storage option is best for responding **instantly** to a sudden spike in electricity demand?',
      options: [
        'Batteries, because they can release energy almost immediately.',
        'Pumped-hydro, because it stores the most total energy.',
        'Thermal storage, because heat is easy to move quickly.',
        'None — stored energy can never be released quickly.',
      ],
      correctIndex: 0,
      explanation:
        'Batteries respond the fastest — they can switch from storing to delivering electrical energy in a fraction ' +
        'of a second, which is exactly what a sudden demand spike needs. Pumped-hydro and thermal storage hold a lot ' +
        'of energy and are cheap, but they take time to spin up turbines, so they respond more slowly.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        "**Pick ONE storage type** for Perth Amboy's grid — battery, pumped-hydro, or thermal — and justify your " +
        "choice using the trade-offs in the table above. Which property mattered most to you, and why?",
      placeholder: 'I would choose… because the table shows…',
      difficulty: 'evaluate',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
