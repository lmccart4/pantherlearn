// seed-phys-u5-l09-wave-vs-photon.cjs — Unit 5 Lesson 9: wave model vs. photon model of EM radiation.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l09-wave-vs-photon.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
// IMAGE PHASE: side-by-side icons — wave spreading around obstacle vs. photon as packet of energy (Gemini, JSON-first).

const lesson = {
  id: 'phys-u5-l09-wave-vs-photon',
  title: 'Wave Model vs. Photon Model',
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 509,
  visible: false,
  dueDate: '2026-10-16', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '💡', title: 'Wave Model vs. Photon Model', subtitle: 'Unit 5 · Lesson 9' }),

    k.objectives([
      'Describe when the wave model of EM radiation is useful',
      'Describe when the photon model is needed',
      'Use evidence to argue which model better explains a given phenomenon',
    ]),

    k.text(
      "For most of this unit we've treated electromagnetic radiation as a **wave** — something with wavelength, " +
      "frequency, and amplitude that can interfere and diffract. That model explains the microwave hot spots, why " +
      "Bluetooth passes through some materials and not others, and the entire electromagnetic spectrum. But it does " +
      "not explain everything.",
    ),

    k.text(
      "In the early 1900s, experiments showed that light hitting a metal surface can eject electrons **only if** the " +
      "frequency is high enough — no matter how intense the light is. A dim UV light can eject electrons while a " +
      "bright red light cannot. The wave model predicts that brighter light should always dump more energy into the " +
      "electrons. It doesn't. So physicists added a second model: **photons**.",
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Two Models, One Radiation',
      content:
        "- **Wave model** — EM radiation spreads out like a wave; explains interference, diffraction, and standing waves.\n" +
        "- **Photon model** — EM radiation comes in energy packets ($E = hf$); explains the photoelectric effect and why higher-frequency photons can ionize atoms.",
    }),

    k.text(
      "The photon energy is $E = hf$, where $h$ is Planck's constant and $f$ is frequency. That means a higher-frequency " +
      "photon carries more energy. A single X-ray photon carries enough energy to knock electrons out of atoms " +
      "(ionization); a single microwave photon does not. Both models are useful — we choose the one that explains the " +
      "evidence at hand.",
    ),

    k.mc({
      prompt: 'Which observation is best explained by the photon model rather than the wave model?',
      options: [
        'A dim UV light can eject electrons from a metal surface',
        'Light bends around the edge of a small obstacle',
        'Microwaves form standing-wave hot spots inside an oven',
        'Radio waves spread out as they leave a broadcast tower',
      ],
      correctIndex: 0,
      explanation:
        "The photoelectric effect — ejection of electrons depending on frequency, not just brightness — is the classic " +
        "evidence for photons. The other options are wave behaviors (diffraction, interference, and spreading).",
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt: 'Why do we keep BOTH the wave model and the photon model in physics instead of picking just one?',
      placeholder: 'Each model explains...',
      difficulty: 'evaluate',
    }),

    k.cer({
      prompt:
        'A 5G tower emits radiation at a higher frequency than an FM radio tower. Use both models to explain why 5G signals can carry more data but do not travel as far around obstacles.',
      claimHint: 'State which property of 5G waves explains the data advantage and which explains the range/obstacle limitation.',
      evidenceHint: 'Cite the frequency/wavelength relationship and the photon energy equation $E = hf$.',
      reasoningHint: 'Connect those ideas to bandwidth (more data) and to diffraction/line-of-sight behavior (less range around obstacles).',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
