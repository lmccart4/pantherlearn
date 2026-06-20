// seed-phys-u6-l12-big-bang-evidence.cjs — Unit 6 Lesson 12: More Evidence for the Big Bang.
// Standards: HS-ESS1-2. CMB, light-element abundance, large-scale structure as Big Bang evidence.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l12-big-bang-evidence.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const IMG_BASE = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics';

const lesson = {
  id: 'phys-u6-l12-big-bang-evidence',
  title: 'More Evidence for the Big Bang',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 612,
  visible: false,
  dueDate: '2027-05-24', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🛰️', title: 'More Evidence for the Big Bang', subtitle: 'Unit 6 · Lesson 12' }),

    k.objectives([
      'Describe the cosmic microwave background and what it tells us about the early universe',
      'Connect the observed abundance of light elements to Big Bang nucleosynthesis',
      'Evaluate how multiple independent lines of evidence support the Big Bang model',
    ]),

    k.text(
      "Redshift and expanding space point toward a Big Bang, but a strong scientific model needs more than one line of " +
      "evidence. Today we look at **three independent pillars** that all converge on the same conclusion: the universe began " +
      "hot, dense, and small, and has been expanding ever since."
    ),

    k.callout({
      style: 'info',
      icon: '🔑',
      title: 'Three Pillars of Big Bang Evidence',
      content:
        "1. **Redshift of distant galaxies** — space is expanding.\n" +
        "2. **Cosmic Microwave Background (CMB)** — relic radiation from when the universe first became transparent.\n" +
        "3. **Abundance of light elements** — the observed ratios of hydrogen, helium, and lithium match Big Bang " +
        "nucleosynthesis predictions.",
    }),

    k.text(
      "**The Cosmic Microwave Background (CMB)** is often called the \"afterglow\" of the Big Bang. About **380,000 years " +
      "after the Big Bang**, the universe had cooled enough for electrons to combine with nuclei, forming neutral atoms. " +
      "Suddenly, light could travel freely. That light has been stretching along with space for nearly 14 billion years, " +
      "and today we detect it as faint microwave radiation coming from every direction in the sky.\n\n" +
      "The CMB is almost perfectly uniform, with tiny temperature variations that map out the seeds of the large-scale " +
      "structure we see today — the galaxies and voids that fill the cosmos."
    ),

    k.image({
      url: `${IMG_BASE}/phys-u6-l12-big-bang-evidence-cmb-map.jpg`,
      alt: 'An oval all-sky map of the Cosmic Microwave Background, nearly uniform with tiny blue (cooler) and red (warmer) temperature fluctuations, around 2.7 kelvin.',
      caption: 'The Cosmic Microwave Background: the afterglow of the Big Bang, nearly uniform at about 2.7 K, with tiny hot and cold spots that seeded today\'s galaxies. *(Diagram.)*',
    }),

    k.mc({
      prompt: 'The Cosmic Microwave Background is best described as:',
      options: [
        'Radiation emitted by the first stars that formed in the universe',
        'Microwaves from distant galaxies that are redshifted into the radio range',
        'Relic radiation left over from when the universe became transparent to light',
        'The glow produced by supernova explosions in the early universe',
      ],
      correctIndex: 2,
      explanation:
        'The CMB is light that was released when electrons combined with nuclei about 380,000 years after the Big Bang, ' +
        'making the universe transparent. That light has been stretched by cosmic expansion into microwaves.',
      difficulty: 'understand',
    }),

    k.text(
      "**The light-element abundance** is the third pillar. The Big Bang model predicts that the early hot, dense universe " +
      "should have fused protons and neutrons into specific ratios of hydrogen, helium, and a little lithium. When astronomers " +
      "measure the oldest, most unprocessed gas clouds, they find ratios that match the prediction remarkably well. " +
      "Stars later forged heavier elements, but the starting mix came from the Big Bang."
    ),

    k.mdTable({
      lead: '**Big Bang Predictions vs. Observations**',
      headers: ['Pillar', 'What the Big Bang predicts', 'What we observe'],
      rows: [
        ['Galaxy redshift', 'More distant galaxies recede faster', 'Hubble\'s law: distance and redshift are correlated'],
        ['CMB', 'A faint, uniform microwave glow from all directions', 'A ~2.7 K background seen across the entire sky'],
        ['Light elements', 'About 75% H, 25% He, trace Li by mass in old gas', 'Oldest gas clouds match this ratio closely'],
      ],
      note: 'Data approximate; see Planck/WMAP results and primordial abundance studies for precise values.',
    }),

    k.mc({
      prompt: 'Why does the observed abundance of hydrogen and helium support the Big Bang model?',
      options: [
        'Hydrogen and helium are the only elements that can form inside black holes',
        'The measured ratios in old gas match Big Bang nucleosynthesis predictions',
        'No other theory can explain why helium exists in stars',
        'Hydrogen and helium are always produced in exactly equal amounts by supernovae',
      ],
      correctIndex: 1,
      explanation:
        'The Big Bang model predicts a specific initial mix of light elements. Observations of old, unprocessed gas match ' +
        'those predictions, which is strong evidence that the model is on the right track.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'Pick the pillar you find most convincing and explain why. Then identify one thing each of the other two pillars adds ' +
        'that the first one cannot show on its own.',
      placeholder: 'Most convincing:… because…\n\nWhat the others add:…',
      difficulty: 'evaluate',
    }),

    k.cer({
      prompt:
        'Scientists say the Big Bang is a well-supported theory, not "just a guess." Use at least **two** of the three pillars ' +
        'to argue why the Big Bang model is strongly supported by evidence.',
      claimHint: 'State why the Big Bang model is well supported.',
      evidenceHint: 'Describe two pillars and what each one observes.',
      reasoningHint: 'Explain how each observation connects to the idea of a hot, dense, expanding early universe.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
