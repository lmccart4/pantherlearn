// seed-phys-u6-l13-communicating-cosmic-history.cjs — Unit 6 Lesson 13: Communicating Cosmic History (SUMMATIVE).
// Standards: HS-ESS1-1, HS-ESS1-2, HS-ESS1-3. Consensus-model presentation of starlight + redshift + CMB + nucleosynthesis.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l13-communicating-cosmic-history.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u6-l13-communicating-cosmic-history',
  title: 'Communicating Cosmic History',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 613,
  visible: false,
  dueDate: '2027-05-25', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🎤', title: 'Communicating Cosmic History', subtitle: 'Unit 6 · Lesson 13 — Summative' }),

    k.objectives([
      'Construct a coherent explanation that connects starlight, redshift, CMB, and nucleosynthesis',
      'Communicate how the Big Bang model accounts for multiple independent lines of evidence',
      'Use a 3-dimensional argument that includes science ideas, a practice, and a crosscutting lens',
    ]),

    k.text(
      "This is the communication summit of the unit. You started with a mystery — why do 'new stars' appear and fade — and " +
      "you've built a model that explains it by connecting ideas across enormous scales of time and space. Today you put " +
      "that model into words, diagrams, and a short presentation that someone else could follow.\n\n" +
      "A strong explanation doesn't just list facts. It shows **how the evidence fits together**: starlight tells us what " +
      "stars are made of; the H-R diagram tells us how they evolve; nucleosynthesis tells us where the elements came from; " +
      "redshift tells us the universe is expanding; the CMB and light-element abundance tell us it began hot and dense. " +
      "Pull those threads into one story."
    ),

    k.callout({
      style: 'info',
      icon: '📋',
      title: 'Your Task',
      content:
        "Create a short communication piece — a slide, a poster sketch, or a narrated diagram — that tells the story of " +
        "cosmic history from the Big Bang to today. Your piece must include:\n\n" +
        "- **Starlight as evidence** (spectra + H-R diagram)\n" +
        "- **Nucleosynthesis** (where elements came from)\n" +
        "- **Redshift + expanding space** (why the universe is getting bigger)\n" +
        "- **CMB and light-element abundance** (why we think it started hot and dense)",
    }),

    k.sketch({
      title: 'Your Cosmic History Diagram',
      instructions:
        'Draw a one-page visual story of cosmic history. Use arrows to show time and cause-effect relationships. Label the ' +
        'evidence that supports each major claim.',
      prompt:
        'Include: Big Bang → expansion/cooling → light-element formation → first stars → fusion up to iron → supernovae ' +
        'spreading heavy elements → new stars and planets. Show where spectra, redshift, CMB, and element abundance fit as evidence.',
    }),

    k.shortAnswer({
      prompt:
        'Write the **script** for your communication piece: 3–5 sentences you would say to a peer who missed this unit. Hit ' +
        'all four required pieces of evidence and explain how they connect.',
      placeholder: 'Our story starts with… Starlight tells us… Redshift shows… The CMB and light elements confirm…',
      difficulty: 'evaluate',
    }),

    k.evidenceUpload({
      title: 'Upload Your Communication Piece',
      instructions:
        'Upload a photo or screenshot of your slide, poster, or diagram. If you made a slide deck, upload the most important ' +
        'slide.',
      prompt: 'One-line caption: "This image shows…"',
    }),

    k.teacherCheckpoint({
      id: 'phys-u6-l13-cp',
      title: 'Communication — Teacher Score',
      prompt:
        "Mr. McCarthy reviews your diagram, script, and uploaded piece together, then scores them on the 3-dimensional " +
        "rubric below. He is looking for a coherent story that correctly uses evidence and shows how the Big Bang model " +
        "connects multiple scales and ideas — not Hollywood production value.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Communicating Cosmic History Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u6-l13-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
