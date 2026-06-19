// seed-phys-u1-l06-making-electricity.cjs — Unit 1 Lesson 6: generators & electromagnetic induction (HS-PS2-5).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l06-making-electricity.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://pantherlearn.com/tools';

const lesson = {
  id: 'phys-u1-l06-making-electricity',
  title: 'Making Electricity',
  unit: 'Unit 1: Energy & the Grid',
  order: 106,
  visible: false,
  dueDate: '2026-09-15',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'Making Electricity', subtitle: 'Unit 1 · Lesson 6' }),

    k.objectives([
      'Describe electromagnetic induction in your own words',
      'Relate the motion of a magnet to the current induced in a coil',
      'Explain how a generator turns motion into electricity',
    ]),

    k.callout({
      style: 'insight',
      icon: '💡',
      title: 'Electromagnetic Induction',
      content:
        "A **changing** magnetic field through a coil of wire **induces** (creates) an electric current. " +
        "Move a magnet, and the field around the coil changes — and that change pushes charge through the wire. " +
        "This single idea is the heart of every generator on the grid. *(Standard: HS-PS2-5.)*",
    }),

    k.text(
      "Back in Lesson 2 we followed the energy and hit a step where a spinning turbine somehow handed its energy off as " +
      "**electricity**. We skipped past *how*. Today we open that box.\n\n" +
      "A **generator** converts **mechanical** energy (motion) into **electrical** energy. Define the **system** as the " +
      "spinning magnet plus the coil of wire around it. As the turbine spins the magnet, the magnetic field threading " +
      "through the coil keeps changing — and that changing field induces a current in the wire. Motion goes in; current " +
      "comes out. That is the exact moment in Lesson 2's chain where **mechanical energy became electrical energy** — " +
      "no energy is created here, it's just transformed from one form into another."
    ),

    // IMAGE PHASE: magnet rotating inside a coil of wire (simple generator diagram) — Gemini, JSON-first, inserted after content is approved.

    k.embed({
      url: `${TOOLS_BASE}/induction-visualizer.html`,
      caption: '🧲 **Induction / Generator Visualizer** — Spin the magnet inside the coil. Before each change, *predict* what will happen to the current, then check yourself against the meter.',
      height: 750,
    }),

    k.mc({
      prompt: 'Which change would **increase** the current induced in the coil?',
      options: [
        'Holding the magnet still right next to the coil',
        'Swapping in a noticeably weaker bar magnet',
        'Moving the magnet farther away from the coil',
        'Spinning the magnet faster inside the coil',
      ],
      correctIndex: 3,
      explanation:
        'Induction depends on how fast the magnetic field through the coil *changes*. Spinning the magnet faster makes ' +
        'the field change more quickly, so a larger current is induced. A still magnet means no change (no current), and ' +
        'a weaker or farther-away magnet means a smaller change — both give less current.',
      difficulty: 'understand',
    }),

    k.cer({
      prompt:
        'Predict and explain: if you spin the magnet **twice as fast**, what happens to the brightness of a bulb ' +
        'connected to the coil, and why?',
      claimHint: 'State whether the bulb gets brighter, dimmer, or stays the same.',
      evidenceHint: 'Point to what you saw in the visualizer when the magnet sped up.',
      reasoningHint: 'Connect faster motion to a faster-changing field, more induced current, and more energy delivered to the bulb.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
