// seed-phys-u1-l06-making-electricity-v3.cjs — Unit 1 Lesson 6: generators & electromagnetic induction (HS-PS2-5).
// v3 = v2 lesson plus appended native graded practice blocks from l06-induction-lab-sheet.md.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l06-making-electricity-v3.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app';

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
      'Trace the energy transformations from a spinning turbine to electricity in a home',
    ]),

    k.text(
      "Wave a refrigerator magnet past a small coil of wire and you can generate a tiny electric current — not enough to " +
      "power your phone, but enough to prove a remarkable fact: **motion can create electricity**. Every time you ride in " +
      "an elevator, turn on a wind turbine, or flip a light switch in New Jersey, you are relying on that same idea.\n\n" +
      "The question is: what exactly has to move, and why does the amount of current depend on how fast it moves?"
    ),

    k.text(
      "A **magnetic field** fills the space around a magnet. When a coil of wire sits in that field, the field \"threads\" " +
      "through the loops of the coil. If the magnet **moves** — or the coil moves — the amount of field threading through " +
      "the coil **changes**. That changing field pushes charge through the wire. The effect is called **electromagnetic induction**.\n\n" +
      "Define the **system** as the magnet plus coil. No energy is created from nothing. The mechanical energy used to spin " +
      "the magnet is transformed into electrical energy in the coil. The faster the field changes, the more current is induced.\n\n" +
      "A **generator** is a machine that does this on a large scale. A turbine spins a magnet inside a coil, and the coil feeds " +
      "current out to the grid. In a natural-gas power plant, burning gas makes steam; the steam spins the turbine. In a wind " +
      "farm, wind spins the turbine blades. In a hydroelectric dam, falling water spins the turbine. The final step is always " +
      "the same: **spinning magnet → changing magnetic field → induced current**."
    ),

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Worked Example: Why does the bulb get brighter when you spin the magnet faster?',
      content:
        "A student connects a coil to a small light bulb and spins a bar magnet inside the coil.\n\n" +
        "**At $1$ revolution per second:** The magnetic field threading through the coil changes slowly. Only a small current " +
        "is induced, so the bulb glows dimly.\n\n" +
        "**At $4$ revolutions per second:** The magnet completes the same motion four times as fast. The field changes four " +
        "times faster, so a larger current is induced. The bulb glows more brightly.\n\n" +
        "**Why?** Induction depends on **how fast the magnetic field changes**, not just on how strong the magnet is. " +
        "Faster spin → faster field change → more current → more power delivered to the bulb.",
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l06-generator.jpg',
      alt: 'A bar magnet rotating inside a coil of wire connected to a light bulb, with magnetic field lines shown around the magnet.',
      caption: 'A generator in one picture: spin a magnet inside a coil, the changing magnetic field induces a current, and the bulb lights up.',
    }),

    k.embed({
      url: `${TOOLS_BASE}/induction-visualizer.html`,
      caption:
        '🧲 **Induction / Generator Visualizer** — Spin the magnet inside the coil. Before each change, *predict* what will ' +
        'happen to the current, then check yourself against the meter.',
      height: 750,
    }),

    k.mc({
      prompt: 'Which action will induce the **largest** current in a coil of wire connected to a meter?',
      options: [
        'Quickly spinning a strong magnet inside the coil',
        'Holding a strong magnet motionless inside the coil',
        'Slowly pulling a weak magnet out of the coil',
        'Placing the coil far away from any magnet',
      ],
      correctIndex: 0,
      explanation:
        'Induction requires a changing magnetic field through the coil. A motionless magnet produces no current; a weak or slow magnet ' +
        'produces little current. Quickly spinning a strong magnet creates the fastest field change, inducing the largest current.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'In a natural-gas power plant, the energy transformations **inside the generator itself** are best described as:',
      options: [
        'Chemical → thermal → mechanical → electrical',
        'Mechanical → electrical',
        'Thermal → chemical → electrical → mechanical',
        'Electrical → mechanical → thermal → chemical',
      ],
      correctIndex: 1,
      explanation:
        'The generator itself converts the mechanical energy of a spinning magnet into electrical energy. The full plant chain is ' +
        'chemical → thermal → mechanical → electrical, but the generator handles only the last transformation.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'A magnet spinning inside a coil produces alternating current (AC) because:',
      options: [
        "The magnet's north and south poles keep switching back and forth.",
        'The coil alternates between acting as a conductor and an insulator.',
        'The electrons in the wire keep moving in only one steady direction.',
        'The direction of the magnetic field through the coil keeps reversing.',
      ],
      correctIndex: 3,
      explanation:
        'As the magnet spins, the field through the coil first points one way, then the other. That reversing field pushes charge back ' +
        'and forth in the wire, producing AC.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'In your own words, explain why moving a magnet near a coil can create a current. Your answer should mention the ' +
        'magnetic field and the coil.',
      placeholder: 'Moving a magnet near a coil creates a current because…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Predict and explain: if you spin the magnet **twice as fast**, what happens to the brightness of a bulb connected to the coil, and why?',
      claimHint: 'State whether the bulb gets brighter, dimmer, or stays the same.',
      evidenceHint: 'Point to what you saw in the visualizer when the magnet sped up.',
      reasoningHint:
        'Connect faster motion to a faster-changing magnetic field, more induced current, and more energy delivered to the bulb.',
    }),

    k.callout({
      style: 'definition',
      icon: '📖',
      title: 'Vocabulary — Electromagnetic Induction',
      content:
        '- **Electromagnetic induction:** the creation of electric current by a changing magnetic field through a coil of wire.\n' +
        '- **Magnetic field:** the region of influence around a magnet where it can exert force.\n' +
        '- **Coil:** a loop or series of loops of wire.\n' +
        '- **Generator:** a device that converts mechanical energy into electrical energy by spinning a magnet inside a coil.\n' +
        '- **Turbine:** a machine with spinning blades that converts the energy of moving fluid (steam, wind, water) into mechanical energy.\n' +
        '- **Alternating current (AC):** current that reverses direction periodically, produced when a magnet spins in a coil.\n' +
        '- **Mechanical energy:** energy of motion or position.\n' +
        '- **Electrical energy:** energy carried by moving charge.',
    }),

    k.shortAnswer({
      prompt:
        'A wind turbine spins a generator. Name the two main energy transformations that happen between the wind and the ' +
        'electricity that reaches your home. Use the words *mechanical* and *electrical*.',
      placeholder: 'First… Then…',
      difficulty: 'apply',
    }),

    k.text(
      "**Extension:** In Lesson 2 we traced energy from fuel to lightbulb. Now we know the exact device where mechanical energy " +
      "becomes electrical energy: the generator. In a modern combined-cycle natural-gas plant, the same fuel produces electricity " +
      "in two stages — a gas turbine and a steam turbine — which is why these plants can reach efficiencies of roughly $45\\%$, " +
      "much higher than older simple-cycle plants. (See the EIA source for the exact efficiency comparison.)"
    ),

    k.externalLink({
      icon: '🔬',
      title: 'Optional: PhET Generator Simulation',
      description:
        'Explore a free, openly licensed simulation to see how a magnet, a coil, and a light bulb behave as you change the motion.',
      url: 'https://phet.colorado.edu/en/simulations/generator',
      buttonLabel: 'Open PhET Generator',
    }),

    // ----- Appended native practice blocks from l06-induction-lab-sheet.md -----
    k.sectionHeader({ icon: '🧪', title: 'Lab: Induction Observations', subtitle: 'Record and explain what you saw in the visualizer' }),

    k.dataTable({
      title: 'Record your induction visualizer observations',
      preset: 'numeric',
      rows: [
        { key: 'still', label: 'Held still' },
        { key: 'slow', label: 'Spinning slowly' },
        { key: 'fast', label: 'Spinning quickly' },
      ],
      columns: [
        { key: 'meter', label: 'Meter reading' },
        { key: 'brightness', label: 'Bulb brightness' },
      ],
    }),

    k.shortAnswer({
      prompt:
        'What pattern do you see between how fast the magnet spins and the meter reading? Explain why faster spinning produces a larger reading.',
      placeholder: 'Faster spin → larger meter reading because…',
      difficulty: 'apply',
    }),

    k.mc({
      prompt: 'In a real power plant, what device spins the magnet inside the generator?',
      options: [
        'A turbine',
        'A transformer',
        'A battery',
        'A solar panel',
      ],
      correctIndex: 0,
      explanation:
        'Steam, wind, or water spins the turbine blades, and the turbine spins the magnet inside the generator.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'Use the term **electromagnetic induction** to explain why spinning the magnet creates a current in the coil.',
      placeholder: 'Electromagnetic induction means…',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'In your own words, name the two main energy transformations that happen between the spinning turbine and the electricity in your home.',
      placeholder: 'First… Then…',
      difficulty: 'apply',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
