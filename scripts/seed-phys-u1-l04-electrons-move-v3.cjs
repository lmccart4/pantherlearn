// seed-phys-u1-l04-electrons-move-v3.cjs — Unit 1 Lesson 4: current as moving charge (AC vs DC) + printable practice as graded blocks.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l04-electrons-move-v3.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

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
      "Turn on a desk lamp. The bulb lights up almost instantly — but the electrons inside the wall did **not** race all " +
      "the way from the power plant to your room in that split second. The wire was already full of electrons. What " +
      "actually happened is that the power source gave the electrons near the outlet a push, and that push traveled " +
      "through the wire like a wave.\n\n" +
      "So what *is* moving? And how is the movement in a phone battery different from the movement in your wall outlet? " +
      "Those two questions are what this lesson is about."
    ),

    k.text(
      "In a metal wire, the atoms are locked in place, but some of their electrons are free to drift. When you connect the " +
      "wire to a power source, those free electrons all start drifting in the same general direction. That drift is " +
      "**electric current**.\n\n" +
      "The drift is slow — in a typical household copper wire, electrons drift at roughly **1 mm/s**, about the speed of " +
      "a crawling ant. But the electrical *signal* that tells them to start moving travels close to the speed of light, " +
      "which is why the lamp seems to turn on instantly."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l04-electron-drift.jpg',
      alt: 'A cutaway of a copper wire showing blue electrons drifting in one direction through a lattice of orange copper atoms.',
      caption: 'Electric current is electrons drifting through the metal — charge on the move.',
    }),

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

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Worked Example: How many electrons pass through the lamp?',
      content:
        "A small LED lamp draws a steady current of $0.50\\text{ A}$. How much charge passes through the lamp in $30\\text{ s}$?\n\n" +
        "**Step 1:** Use the current equation.\n\n" +
        "$$I = \\dfrac{q}{t}$$\n\n" +
        "**Step 2:** Rearrange to solve for charge.\n\n" +
        "$$q = I \\cdot t = 0.50\\text{ A} \\cdot 30\\text{ s} = 15\\text{ C}$$\n\n" +
        "**Step 3:** Convert coulombs to electrons.\n\n" +
        "One coulomb is about $6.2 \\times 10^{18}$ electrons, so:\n\n" +
        "$$15\\text{ C} \\cdot 6.2 \\times 10^{18}\\text{ electrons/C} \\approx 9.3 \\times 10^{19}\\text{ electrons}$$\n\n" +
        "That is about **93 quintillion electrons** drifting through the lamp in half a minute.",
    }),

    k.mc({
      prompt:
        'A student says, "When I plug in my laptop, electrons from the power plant travel through the cord and into my laptop." What is the best response?',
      options: [
        'Correct — electrons actually travel all the way from the generating station to your device.',
        'Incorrect — electrons do not move in wires; energy alone travels from the source to the device.',
        'Partly correct — the wire already contains electrons, and the source pushes them to drift through the wire.',
        'Incorrect — protons are the charges that move through metal wires.',
      ],
      correctIndex: 2,
      explanation:
        'The copper wire already contains free electrons. The power source pushes them to drift; it does not pump electrons ' +
        'from the power plant. (Protons are locked inside atomic nuclei and do not move through metal wires.)',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'Which statement correctly compares alternating current (AC) and direct current (DC)?',
      options: [
        'DC flows one steady way; AC reverses periodically, allowing transformers to step its voltage up and down.',
        'AC flows one steady way like a battery; DC reverses direction many times each second.',
        'Both AC and DC flow one steady way, but AC is used in wall outlets because it carries higher voltage.',
        'DC reverses direction periodically; AC flows one steady way and therefore cannot be transformed by a transformer.',
      ],
      correctIndex: 0,
      explanation:
        'DC (battery-style current) flows steadily in one direction. AC periodically reverses; transformers need changing ' +
        'current, so the grid uses AC to step voltage up and down.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'A phone charger delivers $2.0\\text{ A}$ of current. How much charge flows into the phone battery in $15\\text{ s}$? Show your work using $q = I \\cdot t$.',
      placeholder: 'q = ___ C',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'Name one device in your home that runs on AC from the wall and one device that runs on DC from a battery. Why does the grid use AC instead of DC for long-distance transmission?',
      placeholder: 'AC device: ___ DC device: ___ The grid uses AC because…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt: 'In a working circuit, are electrons created, destroyed, or neither? Make a claim and support it with evidence and reasoning.',
      claimHint: 'State whether electrons are created, destroyed, conserved, or something else.',
      evidenceHint: 'Use what you know about current as the flow of charge and about the wire being full of electrons.',
      reasoningHint: 'Explain why the idea of "creating" or "destroying" charge would violate a basic rule of physics.',
    }),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Vocabulary — Current & Circuits',
      content:
        "- **Current ($I$):** the flow of electric charge, measured in amperes (A).\n" +
        "- **Electron:** a negatively charged particle; the moving charge in a metal wire.\n" +
        "- **Coulomb (C):** the unit of electric charge; about $6.2 \\times 10^{18}$ electrons.\n" +
        "- **Direct current (DC):** charge flows steadily in one direction.\n" +
        "- **Alternating current (AC):** charge reverses direction many times per second; the U.S. grid frequency is $60\\text{ Hz}$.\n" +
        "- **Conductor:** a material, like copper, through which charge can move easily.\n" +
        "- **Closed loop / closed circuit:** a complete path that allows current to flow.",
    }),

    k.shortAnswer({
      prompt:
        '**Exit Ticket.** In one or two sentences, explain the difference between the *drift speed of electrons* and the *speed of the electrical signal* in a wire. Then name one reason the power grid uses AC instead of DC.',
      placeholder: 'Drift speed is… The signal speed is… The grid uses AC because…',
      difficulty: 'understand',
    }),

    k.text(
      "**Challenge:** The \"War of Currents\" in the 1880s pitted Thomas Edison (DC) against Nikola Tesla and George " +
      "Westinghouse (AC). AC won for the grid because transformers made long-distance transmission practical. Today, " +
      "some undersea cables and data centers are returning to high-voltage DC because it avoids certain AC losses."
    ),

    k.externalLink({
      icon: '🔬',
      title: 'Optional: Build a Circuit with PhET',
      description:
        'Explore a free, openly licensed circuit simulation to see how electrons move and how current depends on voltage and resistance.',
      url: 'https://phet.colorado.edu/en/simulations/circuit-construction-kit-dc',
      buttonLabel: 'Open PhET Simulation',
    }),

    k.externalLink({
      icon: '📚',
      title: 'Source: How Electricity Works — U.S. Energy Information Administration',
      description:
        'EIA primer on electricity generation, transmission, and the difference between AC and DC.',
      url: 'https://www.eia.gov/energyexplained/electricity/',
      buttonLabel: 'Read EIA Primer',
    }),

    k.sectionHeader({ icon: '📝', title: 'Practice: Current, Charge & AC/DC', subtitle: 'from the printable handout' }),

    k.mc({
      prompt: 'In the United States, the current in a wall outlet reverses direction about 60 times each second. This is called:',
      options: [
        'alternating current (AC)',
        'direct current (DC)',
        'static electricity',
        'electron drift',
      ],
      correctIndex: 0,
      explanation:
        'AC periodically reverses direction. The 60 Hz U.S. grid frequency means the current switches direction 60 times per second.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'A 9 V battery pushes charge in one steady direction through a flashlight bulb. This is called:',
      options: [
        'alternating current (AC)',
        'direct current (DC)',
        'induced current',
        'transmission current',
      ],
      correctIndex: 1,
      explanation:
        'Batteries supply direct current (DC): charge flows steadily from one terminal to the other.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'A hair dryer draws $10\\text{ A}$ of current. How much charge passes through it in $5.0\\text{ s}$? Show your work using $q = I \\cdot t$.',
      placeholder: 'q = ___ C',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'A phone charger delivers $1.5\\text{ A}$. How long does it take for $45\\text{ C}$ of charge to flow into the phone? Show your work.',
      placeholder: 't = ___ s',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'An LED draws $0.25\\text{ A}$ for $40\\text{ s}$. Find (a) the charge that passes through and (b) the number of electrons. ' +
        'Use $6.2 \\times 10^{18}$ electrons/C. Show your work.',
      placeholder: '(a) ___ C\n(b) ___ electrons',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'The drift speed of electrons in a household wire is roughly $1\\text{ mm/s}$, yet a lamp seems to turn on instantly. Explain why in your own words.',
      placeholder: 'The wire is already full of electrons, so…',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'Why does the power grid use AC instead of DC for long-distance transmission?',
      placeholder: 'The grid uses AC because…',
      difficulty: 'apply',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
