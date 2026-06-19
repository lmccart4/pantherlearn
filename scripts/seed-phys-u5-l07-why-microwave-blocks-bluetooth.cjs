// seed-phys-u5-l07-why-microwave-blocks-bluetooth.cjs — Unit 5 Lesson 7: wave-matter interactions.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l07-why-microwave-blocks-bluetooth.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
// IMAGE PHASE: close-up of microwave door mesh with wavelength comparison overlay; inserted after content is approved.

const lesson = {
  id: 'phys-u5-l07-why-microwave-blocks-bluetooth',
  title: 'Why the Microwave Blocks Bluetooth',
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 507,
  visible: false,
  dueDate: '2026-10-28', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🚫', title: 'Why the Microwave Blocks Bluetooth', subtitle: 'Unit 5 · Lesson 7' }),

    k.objectives([
      'Distinguish absorption, reflection, and transmission of electromagnetic waves',
      'Relate mesh hole size to the wavelength of the radiation',
      'Use the wave model to explain the anchoring phenomenon',
    ]),

    k.text(
      "We opened the unit with a mystery: a Bluetooth speaker inside a closed, unpowered microwave loses its signal. " +
      "Now we have enough physics to solve it.\n\n" +
      "When any electromagnetic wave reaches a material, three things can happen: it can be **transmitted** (pass " +
      "through), **absorbed** (its energy transferred to the material), or **reflected** (bounced away). The outcome " +
      "depends on both the wave and the material. The **system** we'll study is the Bluetooth signal plus the microwave " +
      "enclosure. Energy is reflected by the metal walls and mesh, so little of it reaches the speaker inside."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Three Wave-Matter Interactions',
      content:
        "- **Transmission** — the wave passes through the material\n" +
        "- **Absorption** — the wave's energy is transferred to the material (often as thermal energy)\n" +
        "- **Reflection** — the wave bounces off the material's surface\n\n" +
        "A metal mesh reflects waves whose wavelength is much larger than the holes. The Bluetooth wavelength " +
        "($\\sim 12.5 \\text{ cm}$) is much larger than the holes in a microwave door mesh.",
    }),

    k.text(
      "**Hands-on testing:** In groups, test what happens when you place different materials between a Bluetooth source " +
      "and a receiver. Predict whether each material will transmit, absorb, or reflect the signal, then record what " +
      "actually happens. The microwave door mesh is the most important test — its holes are tiny, but visible light " +
      "passes through them just fine. Why does light get through while Bluetooth does not?"
    ),

    k.dataTable({
      title: 'Signal Testing Results',
      preset: 'text',
      columns: [
        { key: 'material', label: 'Material' },
        { key: 'prediction', label: 'Prediction (transmit / absorb / reflect)' },
        { key: 'result', label: 'Observed result' },
      ],
      rows: [
        { key: 'paper', label: 'Paper or cardboard' },
        { key: 'plastic', label: 'Plastic container' },
        { key: 'glass', label: 'Glass' },
        { key: 'hand', label: 'Hand / body' },
        { key: 'mesh', label: 'Microwave door mesh' },
      ],
    }),

    k.mc({
      prompt: 'Why does the metal mesh in a microwave door block Bluetooth signals?',
      options: [
        'The mesh holes are much smaller than the Bluetooth wavelength',
        'The mesh reflects every kind of electromagnetic wave equally',
        'The glass door absorbs the Bluetooth signal before it exits',
        'The microwave oven still pulls power when it appears off',
      ],
      correctIndex: 0,
      explanation:
        'A metal mesh reflects electromagnetic waves whose wavelength is much larger than the hole size. Bluetooth ' +
        'has a wavelength of about 12.5 cm, while the holes in a microwave door mesh are a few millimeters across. ' +
        'Visible light has a much shorter wavelength, so it can pass through the same holes.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        "**Wavelength comparison.**\n\nVisible light has a wavelength around $500 \\text{ nm}$, while Bluetooth has a " +
        "wavelength around $12.5 \\text{ cm}$. Explain why visible light passes through the microwave door mesh but " +
        "Bluetooth does not.",
      placeholder: 'Visible light passes through because…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Write the full explanation: Why does a Bluetooth speaker lose its connection when it is placed inside a closed, unpowered microwave oven?',
      claimHint: 'State what happens to the Bluetooth signal.',
      evidenceHint: 'Use the frequency/wavelength of Bluetooth, the size of the mesh holes, and what you observed in the hands-on testing.',
      reasoningHint: 'Connect the wave-matter interaction to the wavelength comparison.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
