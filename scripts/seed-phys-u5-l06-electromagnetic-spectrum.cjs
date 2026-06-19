// seed-phys-u5-l06-electromagnetic-spectrum.cjs — Unit 5 Lesson 6: the electromagnetic spectrum.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l06-electromagnetic-spectrum.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app';
// IMAGE PHASE: logarithmic electromagnetic spectrum diagram from radio to gamma; inserted after content is approved.

const lesson = {
  id: 'phys-u5-l06-electromagnetic-spectrum',
  title: 'The Electromagnetic Spectrum',
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 506,
  visible: false,
  dueDate: '2026-10-27', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌈', title: 'The Electromagnetic Spectrum', subtitle: 'Unit 5 · Lesson 6' }),

    k.objectives([
      'Locate everyday technologies on the electromagnetic spectrum',
      'Compare frequency, wavelength, and energy across spectrum regions',
      'Explain why different frequencies interact with matter differently',
    ]),

    k.text(
      "All electromagnetic waves travel at the same speed in empty space: $c \\approx 3 \\times 10^8 \\text{ m/s}$. " +
      "What makes one type of EM radiation different from another is its **frequency** and **wavelength**. Because " +
      "$c = f\\lambda$ is fixed, high frequency means short wavelength, and low frequency means long wavelength.\n\n" +
      "The **system** we'll map is the electromagnetic wave plus whatever matter it might encounter. Higher-frequency " +
      "waves carry more energy per photon, so they tend to interact with matter more dramatically — from warming food " +
      "to breaking chemical bonds."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Spectrum Order (Low → High Frequency)',
      content:
        "Radio → Microwave → Infrared → Visible → Ultraviolet → X-ray → Gamma ray\n\n" +
        "As frequency increases: wavelength decreases, photon energy increases, and the radiation tends to penetrate " +
        "or ionize matter more strongly.",
    }),

    k.mdTable({
      headers: ['Technology', 'Frequency', 'Wavelength', 'Spectrum region'],
      rows: [
        ['FM radio', '$\\sim 100 \\text{ MHz}$', '$\\sim 3 \\text{ m}$', 'Radio'],
        ['WiFi / Bluetooth', '$\\sim 2.4 \\text{ GHz}$', '$\\sim 12.5 \\text{ cm}$', 'Microwave'],
        ['Microwave oven', '$\\sim 2.45 \\text{ GHz}$', '$\\sim 12.2 \\text{ cm}$', 'Microwave'],
        ['5G (sub-6)', '$\\sim 3.5 \\text{ GHz}$', '$\\sim 8.6 \\text{ cm}$', 'Microwave / Radio'],
        ['Visible red light', '$\\sim 430 \\text{ THz}$', '$\\sim 700 \\text{ nm}$', 'Visible'],
        ['Medical X-ray', '$\\sim 10^{18} \\text{ Hz}$', '$\\sim 0.1 \\text{ nm}$', 'X-ray'],
      ],
      lead: '**Everyday frequencies** — use this table to place familiar technologies on the spectrum.',
    }),

    k.embed({
      url: `${TOOLS_BASE}/em-spectrum-explorer.html`,
      caption: '🌈 **EM Spectrum Explorer** — Place each technology at the right frequency, wavelength, and energy. Match each region to its typical interaction with matter.',
      height: 750,
    }),

    k.mc({
      prompt: 'Which type of electromagnetic wave has the highest frequency?',
      options: [
        'Radio waves',
        'Microwaves',
        'Gamma rays',
        'Visible light',
      ],
      correctIndex: 2,
      explanation:
        'Gamma rays are at the high-frequency end of the electromagnetic spectrum, beyond X-rays. Radio waves are at ' +
        'the low-frequency end, microwaves are just above radio, and visible light sits between infrared and ultraviolet.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**Place the signals.**\n\nBluetooth, WiFi, and the microwave oven all use frequencies near $2.4 \\text{ GHz}$. " +
        "Explain why they don't interfere with each other constantly, using ideas from the spectrum table and the explorer.",
      placeholder: 'They do not constantly interfere because…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'A social media post claims that 5G signals are a form of X-ray radiation. Use the electromagnetic spectrum to evaluate the claim.',
      claimHint: 'State whether the claim is accurate.',
      evidenceHint: 'Compare the frequency/wavelength of 5G signals to X-rays using the table or explorer.',
      reasoningHint: 'Explain why frequency matters for how radiation interacts with matter.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
