// seed-phys-u6-l03-starlight-tells-us.cjs — Unit 6 Lesson 3: What Starlight Tells Us.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l03-starlight-tells-us.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)
const IMG_BASE = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics';

const lesson = {
  id: 'phys-u6-l03-starlight-tells-us',
  title: 'What Starlight Tells Us',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 603,
  visible: false,
  dueDate: '2026-10-01', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌈', title: 'What Starlight Tells Us', subtitle: 'Unit 6 · Lesson 3' }),

    k.objectives([
      'Relate absorption and emission spectra to the elements in a light source',
      'Match star spectra to laboratory reference spectra to identify composition',
      'Explain why each element has a unique spectral fingerprint',
    ]),

    k.image({
      url: `${IMG_BASE}/phys-u6-l03-starlight-tells-us-spectral-fingerprints.jpg`,
      alt: 'Four stacked rainbow spectra labeled H, He, Na, and Ca, each crossed by a different pattern of dark absorption lines.',
      caption: 'Every element absorbs light at its own set of wavelengths — a unique pattern of dark lines, like a fingerprint. *(Diagram.)*',
    }),

    k.text(
      "In 1814, Joseph Fraunhofer noticed that the Sun's rainbow was missing certain colors — thin dark lines. Those lines " +
      "turned out to be a code. Every element absorbs or emits light at specific wavelengths, creating a pattern as unique " +
      "as a fingerprint. When we see dark lines in a star's spectrum, we are seeing which elements are present in the star."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Spectral Fingerprints',
      content: "- **Emission spectrum:** bright lines at specific wavelengths, produced by a hot gas.\n" +
               "- **Absorption spectrum:** a continuous rainbow with dark lines where atoms absorbed specific wavelengths.\n" +
               "- Each element (hydrogen, helium, sodium, calcium…) produces a unique line pattern.",
    }),

    k.text(
      "The system we are studying is the **star + its atmosphere**. Light from the star's hot interior passes through the " +
      "cooler outer gas. Atoms in that outer gas absorb specific wavelengths, leaving dark absorption lines. By comparing " +
      "those lines to laboratory spectra, we can identify the elements in the star without ever touching it."
    ),

    k.image({
      url: `${IMG_BASE}/phys-u6-l03-starlight-tells-us-three-spectra.jpg`,
      alt: 'Three stacked spectra: a continuous rainbow, an emission spectrum of bright lines on black, and an absorption spectrum of dark lines on a rainbow.',
      caption: 'Three kinds of spectra: a smooth continuous rainbow, bright emission lines from hot gas, and dark absorption lines where cooler gas absorbs light. *(Diagram.)*',
    }),

    k.mdTable({
      lead: '**Reference spectral lines** (simplified for this lesson)',
      headers: ['Element', 'Line pattern note'],
      rows: [
        ['Hydrogen (H)', 'Strong lines in visible blue/violet; famous Balmer series'],
        ['Helium (He)', 'Lines slightly different from hydrogen; common in hot stars'],
        ['Sodium (Na)', 'Double line in yellow/orange'],
        ['Calcium (Ca)', 'Strong lines in violet/ultraviolet'],
      ],
      note: 'Real spectra are more complex, but these patterns are enough to identify a star\'s main atmospheric elements.',
    }),

    k.embed({
      url: `${TOOLS_BASE}/spectra-redshift-explorer.html?mode=identify`,
      caption: '🔭 **Spectra / Redshift Explorer** — Compare a star\'s absorption spectrum to reference spectra of hydrogen, helium, sodium, and calcium. Identify which elements are present.',
      height: 750,
    }),

    k.mc({
      prompt: 'A star\'s spectrum shows dark lines at the exact wavelengths where hydrogen absorbs light. What can you conclude?',
      options: [
        'The star contains hydrogen in its outer atmosphere',
        'The star contains only hydrogen',
        'The star is made of liquid water',
        'The dark lines are caused by Earth\'s atmosphere only',
      ],
      correctIndex: 0,
      explanation: 'Matching absorption lines mean the element is present in the star\'s outer atmosphere. They do not tell us the star is made only of that element, nor are they caused by Earth\'s atmosphere alone.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'Why can spectra tell us what elements are in a star, even though the star is trillions of miles away (several light-years)?',
      options: [
        'Each element emits only one single color of light',
        'Telescopes can physically collect samples from stars',
        'Each element has a unique pattern of spectral lines',
        'All stars have exactly the same composition',
      ],
      correctIndex: 2,
      explanation: 'Every element absorbs or emits light at a unique set of wavelengths. That pattern acts like a fingerprint we can match from Earth.',
      difficulty: 'understand',
    }),

    k.cer({
      prompt: 'How do astronomers use a star\'s spectrum to figure out what the star is made of?',
      claimHint: 'State the connection between spectral lines and elements.',
      evidenceHint: 'Describe absorption lines and how they are compared to lab spectra.',
      reasoningHint: 'Explain why matching patterns lets us identify elements without visiting the star.',
    }),

    k.shortAnswer({
      prompt: 'The "new star" records from Lesson 1 showed a sudden brightening. Predict: how might a spectrum taken during the explosion help astronomers understand what happened?',
      placeholder: 'A spectrum during the explosion might show…',
      difficulty: 'apply',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
