// seed-phys-u5-l03-wavelength-frequency-speed.cjs — Unit 5 Lesson 3: v = fλ quantitative work.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l03-wavelength-frequency-speed.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app';

const lesson = {
  id: 'phys-u5-l03-wavelength-frequency-speed',
  title: 'Wavelength, Frequency & Speed',
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 503,
  visible: false,
  dueDate: '2026-10-22', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📐', title: 'Wavelength, Frequency & Speed', subtitle: 'Unit 5 · Lesson 3' }),

    k.objectives([
      'Use the relationship $v = f\\lambda$ to compare waves',
      'Explain why frequency and wavelength are inversely related when speed is constant',
      'Apply the wave equation to sound, water, and light waves',
    ]),

    k.text(
      "Yesterday we named the parts of a wave. Today we'll make those parts quantitative. The speed of a wave tells " +
      "us how fast the disturbance moves through its medium. For any wave, the speed depends on the medium — but once " +
      "the medium is fixed, frequency and wavelength trade off.\n\n" +
      "The **system** we'll analyze is the wave plus the medium it moves through. Changing the medium (for example, " +
      "from air to water) changes the wave speed. Changing the source changes the frequency. The wavelength then adjusts " +
      "so that $v = f\\lambda$ stays true."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'The Wave Speed Equation',
      content:
        "$$v = f\\lambda$$\n\n" +
        "- $v$ = wave speed (m/s)\n" +
        "- $f$ = frequency (Hz, or waves per second)\n" +
        "- $\\lambda$ = wavelength (m)\n\n" +
        "If the medium stays the same, $v$ is constant. That means a higher frequency wave must have a shorter wavelength.",
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u5-l03-wavelength-frequency-speed-three-waves.jpg',
      alt: 'Three stacked waves: a low-frequency long-wavelength wave, a high-frequency short-wavelength wave of equal height, and a same-wavelength wave with a larger amplitude.',
      caption: 'At a fixed speed, higher frequency means shorter wavelength. Amplitude is independent — making a wave taller does not change its wavelength. *(Diagram.)*',
    }),

    k.mdTable({
      headers: ['Wave type', 'Typical frequency', 'Typical wavelength', 'Speed'],
      rows: [
        ['Sound in air', '$\\sim 1{,}000 \\text{ Hz}$', '$\\sim 0.34 \\text{ m}$', '$\\sim 340 \\text{ m/s}$'],
        ['Water wave', '$\\sim 0.5 \\text{ Hz}$', '$\\sim 2 \\text{ m}$', '$\\sim 1 \\text{ m/s}$'],
        ['Red light', '$\\sim 4.3 \\times 10^{14} \\text{ Hz}$', '$\\sim 700 \\text{ nm}$', '$3 \\times 10^8 \\text{ m/s}$'],
      ],
      lead: '**Reference values** — use these to check your calculations. Notice that light waves are much faster and have much shorter wavelengths than mechanical waves.',
    }),

    k.embed({
      url: `${TOOLS_BASE}/wave-properties-explorer.html`,
      caption: '📐 **Wave Properties Explorer — Math Mode** — Set frequency and wavelength, then check whether $v = f\\lambda$ holds for the wave you build.',
      height: 750,
    }),

    k.mc({
      prompt: 'A wave has a frequency of $2 \\text{ Hz}$ and a wavelength of $3 \\text{ m}$. What is its speed?',
      options: [
        'The wave speed is $6 \\text{ m/s}$.',
        'The wave speed is $1.5 \\text{ m/s}$.',
        'The wave speed is $5 \\text{ m/s}$.',
        'The wave speed is $0.67 \\text{ m/s}$.',
      ],
      correctIndex: 0,
      explanation:
        'Use $v = f\\lambda$. Substitute $f = 2 \\text{ Hz}$ and $\\lambda = 3 \\text{ m}$: $v = 2 \\times 3 = 6 \\text{ m/s}$.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        "**Calculate and compare.**\n\nA sound wave in air has frequency $250 \\text{ Hz}$ and wavelength $1.36 \\text{ m}$. " +
        "A light wave has frequency $5.0 \\times 10^{14} \\text{ Hz}$ and wavelength $6.0 \\times 10^{-7} \\text{ m}$. " +
        "Calculate the speed of each wave and explain why the numbers are so different.",
      placeholder: 'For the sound wave: v = …\nFor the light wave: v = …\nThe speeds differ because…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'In the Wave Properties Explorer, you keep the medium (and therefore the wave speed) the same. What happens to the wavelength when you increase the frequency? Explain why.',
      claimHint: 'State what happens to wavelength when frequency increases at constant speed.',
      evidenceHint: 'Use the wave equation $v = f\\lambda$ and describe what you observed in the explorer.',
      reasoningHint: 'Explain why the equation forces wavelength to change in the opposite direction of frequency.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
