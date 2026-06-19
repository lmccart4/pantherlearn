// seed-phys-u5-l02-waves-on-a-string.cjs — Unit 5 Lesson 2: wave properties + Wave Properties Explorer embed.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l02-waves-on-a-string.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app';
// IMAGE PHASE: labeled diagram of a transverse wave showing amplitude, wavelength, crest, trough; inserted after content is approved.

const lesson = {
  id: 'phys-u5-l02-waves-on-a-string',
  title: 'Waves on a String',
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 502,
  visible: false,
  dueDate: '2026-10-21', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '〰️', title: 'Waves on a String', subtitle: 'Unit 5 · Lesson 2' }),

    k.objectives([
      'Identify amplitude, wavelength, frequency, and period on a transverse wave',
      'Explain how wave properties relate to the energy a wave carries',
      'Use the Wave Properties Explorer to test predictions about mechanical waves',
    ]),

    k.text(
      "The microwave mystery showed us that some kind of signal can be blocked by a metal box. Before we explain that " +
      "signal, we need to build a model of what a **wave** is. A wave is a disturbance that moves through a medium — or, " +
      "in some cases, through empty space.\n\n" +
      "Today we'll use a **slinky or string** as our medium. The **system** we'll study is the string plus the hand or " +
      "motor that disturbs it. Energy enters the system when you shake the string, travels along the string as a wave, " +
      "and can leave the system at the other end."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Wave Properties',
      content:
        "- **Amplitude ($A$)** — the maximum displacement from the rest position; taller waves carry more energy\n" +
        "- **Wavelength ($\\lambda$)** — the distance from one crest to the next crest (or one trough to the next trough)\n" +
        "- **Frequency ($f$)** — how many waves pass a point each second, measured in hertz (Hz)\n" +
        "- **Period ($T$)** — the time for one full wave to pass, $T = \\frac{1}{f}$",
    }),

    k.text(
      "In the demo, Mr. McCarthy will send pulses down a long spring or string. Watch carefully: does the piece of " +
      "string itself travel all the way to the other end, or does the disturbance travel while the string stays in " +
      "place? Keep that question in mind — it will matter for every wave we study, including light."
    ),

    k.embed({
      url: `${TOOLS_BASE}/wave-properties-explorer.html`,
      caption: '〰️ **Wave Properties Explorer** — Adjust amplitude, wavelength, and frequency. Observe how each property changes the wave and the energy it carries.',
      height: 750,
    }),

    k.mc({
      prompt: 'In the Wave Properties Explorer, you keep frequency the same. Which change would make the wave carry more energy?',
      options: [
        'Decrease the amplitude and keep the wavelength the same',
        'Increase the wavelength and keep the amplitude the same',
        'Increase the amplitude and keep the frequency the same',
        'Decrease the frequency and keep the amplitude the same',
      ],
      correctIndex: 2,
      explanation:
        'For a mechanical wave on a string, amplitude is the main visual indicator of energy. A larger-amplitude wave ' +
        'moves the string farther from rest, which means more kinetic and potential energy in the system. Frequency is ' +
        'held constant in this question, so amplitude is the factor that changes the energy.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        "**Reflect on the explorer.**\n\nDescribe one thing you changed and what happened to the wave. Then explain " +
        "how you know energy was (or was not) transferred through the string.",
      placeholder: 'When I changed…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'A student says, "The string particles move from one end of the room to the other inside the wave." Use evidence from the demo and the explorer to respond.',
      claimHint: 'State whether the student is correct.',
      evidenceHint: 'Describe what you observed about the motion of the string itself versus the motion of the disturbance.',
      reasoningHint: 'Connect your observation to the definition of a wave: a disturbance that transfers energy.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
