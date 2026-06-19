// seed-phys-u4-l03-energy-in-the-airburst.cjs — Unit 4 Lesson 3: kinetic energy + airburst energy transfer.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l03-energy-in-the-airburst.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
// IMAGE PHASE: Chelyabinsk damage map / broken windows; energy-release comparison graphic.

const lesson = {
  id: 'phys-u4-l03-energy-in-the-airburst',
  title: 'Energy in the Airburst',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 403,
  visible: false,
  dueDate: '2026-10-21', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '☄️', title: 'Energy in the Airburst', subtitle: 'Unit 4 · Lesson 3' }),

    k.objectives([
      'Calculate kinetic energy using $KE = \\frac{1}{2}mv^2$',
      'Explain how a meteoroid’s kinetic energy is transferred during an airburst',
      'Compare an airburst to a surface impact in terms of energy transfer',
    ]),

    k.text(
      "The Chelyabinsk object didn't just look bright — it was carrying an enormous amount of **kinetic energy** because " +
      "it was moving incredibly fast. When it hit the atmosphere, that energy had to go somewhere. Today we're going to " +
      "quantify just how much energy we're talking about, and figure out why an explosion high in the air could still " +
      "break windows on the ground."
    ),

    k.callout({
      style: 'info',
      icon: '📦',
      title: 'Define the System',
      content:
        "**System = the meteoroid + the air immediately around it.**\n\n" +
        "Energy can flow *into* the system from the meteoroid's motion and *out of* the system as heat, light, and sound " +
        "in the atmosphere. The ground is **outside** this system until the shock wave reaches it.",
    }),

    k.text(
      "The kinetic energy of a moving object is given by:\n\n" +
      "$$KE = \\frac{1}{2}mv^2$$\n\n" +
      "where $m$ is mass in kilograms and $v$ is speed in meters per second. For Chelyabinsk, estimates put the mass at " +
      "about $1.2 \\times 10^7$ kg and the speed at about $1.9 \\times 10^4$ m/s. Plugging those in gives roughly " +
      "$2.2 \\times 10^{15}$ joules — about **500 kilotons of TNT**.",
    ),

    k.mdTable({
      headers: ['Quantity', 'Estimated value'],
      rows: [
        ['Mass', '~$1.2 \\times 10^7$ kg'],
        ['Speed', '~$1.9 \\times 10^4$ m/s'],
        ['Kinetic energy', '~$2.2 \\times 10^{15}$ J'],
        ['Energy equivalent', '~500 kilotons of TNT'],
        ['Altitude of airburst', '~23 km above ground'],
      ],
      lead: '**Chelyabinsk energy estimates**',
      note: 'Values are approximate; different studies give slightly different estimates.',
    }),

    // IMAGE PHASE: comparison graphic showing 500 kt vs. familiar energy scales (Hiroshima, lightning bolt, etc.).

    k.text(
      "**Airburst vs. surface impact.**\n\n" +
      "Because the Chelyabinsk object exploded so high up, most of its kinetic energy was dumped into the **atmosphere** " +
      "as thermal energy and a powerful shock wave. Only a small fraction reached the ground. If the same object had " +
      "struck the surface intact, it would have dug a crater and ejected debris much farther.",
    ),

    k.mc({
      prompt: 'During the Chelyabinsk airburst, most of the object’s kinetic energy was ultimately…',
      options: [
        'Stored forever inside the small rock fragments that survived',
        'Destroyed by the explosion, so no energy remained',
        'Converted into a completely new form of matter',
        'Transferred to the atmosphere as thermal energy and shock waves',
      ],
      correctIndex: 3,
      explanation:
        'Energy is conserved. The meteoroid’s kinetic energy was transferred to the air as heat, light, sound, and a shock ' +
        'wave — not destroyed or turned into matter.',
      difficulty: 'apply',
    }),

    k.dataTable({
      title: 'Kinetic Energy Estimates',
      preset: 'numeric',
      rows: [
        { key: 'row1', label: 'Small meteoroid (1 kg, 20,000 m/s)' },
        { key: 'row2', label: 'Car on highway (1,500 kg, 30 m/s)' },
        { key: 'row3', label: 'Chelyabinsk object (~$1.2 \\times 10^7$ kg, 19,000 m/s)' },
      ],
      columns: [
        { key: 'mass', label: 'Mass (kg)' },
        { key: 'speed', label: 'Speed (m/s)' },
        { key: 'ke', label: 'Calculated KE (J)' },
      ],
    }),

    k.cer({
      prompt:
        'Explain why the Chelyabinsk airburst caused so much damage on the ground even though the object never hit the surface.',
      claimHint: 'State what carried most of the energy to the ground.',
      evidenceHint: 'Use the kinetic energy value and the altitude of the airburst in your evidence.',
      reasoningHint: 'Explain how energy transfer from the meteoroid to the atmosphere produced effects people could see and feel on the ground.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
