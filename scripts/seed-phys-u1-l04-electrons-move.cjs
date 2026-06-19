// seed-phys-u1-l04-electrons-move.cjs — Unit 1 Lesson 4: current as moving charge (AC vs DC).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l04-electrons-move.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
// NOTE: v1 ships native — the reusable wire-sim embed isn't built yet, so there is NO scored embed here.

const lesson = {
  id: 'phys-u1-l04-electrons-move',
  title: 'Electrons on the Move',
  unit: 'Unit 1: Energy & the Grid',
  order: 104,
  visible: false,
  dueDate: '2026-09-11',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'Electrons on the Move', subtitle: 'Unit 1 · Lesson 4' }),

    k.objectives([
      'Describe electric current as the flow of electric charge',
      'Explain what is physically moving inside the wires that power your home',
      'Compare alternating current (AC) with direct current (DC)',
    ]),

    k.text(
      "So far we've traced energy from the power plant to your wall and learned that electrical energy is carried by " +
      "moving charge. But what is *actually moving* inside the wire? It's not the wire itself, and it's not some new " +
      "stuff being pumped in from far away.\n\n" +
      "**Electric current** is the flow of electric charge. In a metal wire — like the copper in the cord of your phone " +
      "charger — the charges that move are **electrons**. Metals are full of electrons that aren't locked to any single " +
      "atom, so when we connect the wire to a source, those loose electrons drift through the conductor. That drifting " +
      "river of electrons is the current."
    ),

    // IMAGE PHASE: diagram of electrons drifting through a copper wire (Gemini, JSON-first) inserted after content is approved.

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Current and Charge',
      content:
        "- **Charge** is measured in **coulombs (C)**. One coulomb is a huge pile of electrons — about 6.2 billion " +
        "billion of them.\n" +
        "- **Current** is measured in **amperes**, or **amps (A)**. Current tells you *how much charge flows past a " +
        "point each second*.\n\n" +
        "We write that relationship as:\n\n" +
        "$$I = \\dfrac{q}{t}$$\n\n" +
        "where $I$ is the current (in amps), $q$ is the charge that flows (in coulombs), and $t$ is the time (in " +
        "seconds). A current of $1\\text{ A}$ means $1\\text{ C}$ of charge flows past every second.",
    }),

    k.text(
      "Now here's a twist that surprises most people. The charge in your house doesn't all flow *one direction* like " +
      "water down a river. There are two ways current can flow:\n\n" +
      "- **Direct current (DC)** — charge flows steadily in **one direction**, from one terminal to the other. A " +
      "battery makes DC. The current in your phone *after* the charger converts it is DC.\n" +
      "- **Alternating current (AC)** — charge rapidly **reverses direction**, back and forth, many times each second. " +
      "In the United States the current in your wall outlet switches direction 60 times per second.\n\n" +
      "The **power grid distributes AC**, and that choice is not random. With AC, devices called **transformers** can " +
      "easily *step the voltage up* for long-distance transmission and then *step it back down* before it reaches your " +
      "home. High voltage lets energy travel long distances through the transmission lines with far less waste. " +
      "Transformers only work with changing current — so AC is what makes the grid practical."
    ),

    k.mc({
      prompt: 'Which statement correctly describes the difference between **AC** and **DC**?',
      options: [
        'DC steadily reverses its direction many times each second, while AC flows one steady way like a battery does',
        'DC and AC both flow in one steady direction, but DC moves electrons and AC moves protons through the wire',
        'AC and DC both reverse direction constantly, but only AC can be stepped up or down by a transformer device',
        'AC periodically reverses its direction many times each second (the grid), while DC flows one steady way like a battery does',
      ],
      correctIndex: 3,
      explanation:
        'AC (alternating current) reverses direction many times per second — that\'s what the power grid distributes, ' +
        'because transformers can then step its voltage up and down. DC (direct current) flows steadily in one ' +
        'direction, the way a battery delivers charge. Electrons (not protons) are the moving charges in a metal wire.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        '**Why does the power grid distribute electricity as AC rather than DC?**\n\n' +
        "(Hint: think about transformers and what happens to the energy as it travels long distances through " +
        "transmission lines.)",
      placeholder: 'The grid uses AC because…',
      difficulty: 'apply',
    }),

    k.externalLink({
      icon: '🔬',
      title: 'Optional: Explore Current and Circuits',
      description:
        'Want to see charge actually move? PhET makes free, openly licensed physics simulations. Try a circuit or ' +
        'current simulation to watch electrons flow and see how the pieces connect.',
      url: 'https://phet.colorado.edu/en/simulations/filter?subjects=physics',
      buttonLabel: 'Explore Simulations',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
