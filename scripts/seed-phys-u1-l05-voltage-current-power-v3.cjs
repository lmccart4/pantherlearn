// seed-phys-u1-l05-voltage-current-power-v3.cjs — Unit 1 Lesson 5: voltage, current & power + printable practice as graded blocks.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l05-voltage-current-power-v3.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u1-l05-voltage-current-power',
  title: 'Voltage, Current & Power',
  unit: 'Unit 1: Energy & the Grid',
  order: 105,
  visible: false,
  dueDate: '2026-09-14',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'Voltage, Current & Power', subtitle: 'Unit 1 · Lesson 5' }),

    k.objectives([
      'Distinguish between voltage, current, and power',
      'Use $P = IV$ and $P = \\frac{E}{t}$ to relate energy, time, current, and voltage',
      'Explain why the power grid transmits electricity at very high voltage',
    ]),

    k.text(
      "A single toaster can draw about **$10\\text{ A}$** from a wall outlet. A high-voltage transmission line may carry the " +
      "same power but at tens or hundreds of thousands of volts — so its current is much smaller. Why does the grid go to " +
      "the trouble of pushing electricity at such high voltages when your house only needs $120\\text{ V}$?\n\n" +
      "The answer is one of the most useful equations in this unit: $P = IV$."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Three Words That Get Mixed Up',
      content:
        "These three sound similar, but they measure different things. Keep them straight and the rest of the unit clicks.\n\n" +
        "- **Voltage** — the electrical *\"push\"* that drives charge through a wire, measured in **volts (V)**\n" +
        "- **Current** — the *rate that charge flows* past a point, measured in **amps (A)**\n" +
        "- **Power** — the *rate that energy is transferred*, measured in **watts (W)**",
    }),

    k.text(
      "Notice that two of these are *rates* — current is how fast charge moves, and power is how fast energy is delivered. " +
      "Those two ideas tie together in a pair of equations we'll lean on for the rest of the unit:\n\n" +
      "$$P = \\dfrac{E}{t} \\qquad P = IV$$\n\n" +
      "The first says **power is energy ($E$) delivered per unit of time ($t$)** — a $100\\text{ W}$ bulb moves $100\\text{ J}$ " +
      "of energy every second. The second says **power also equals current ($I$) times voltage ($V$)** — the harder you push " +
      "(more volts) and the more charge you push (more amps), the more energy you deliver each second."
    ),

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Worked Example: Why high voltage saves energy',
      content:
        "A small town needs $1{,}200{,}000\\text{ W}$ of power from a distant power plant. Compare two ways to send it.\n\n" +
        "**Case A: low voltage, high current**\n\n" +
        "Send the power at $1{,}200\\text{ V}$.\n\n" +
        "$$I = \\dfrac{P}{V} = \\dfrac{1{,}200{,}000\\text{ W}}{1{,}200\\text{ V}} = 1{,}000\\text{ A}$$\n\n" +
        "**Case B: high voltage, low current**\n\n" +
        "Send the same power at $120{,}000\\text{ V}$.\n\n" +
        "$$I = \\dfrac{P}{V} = \\dfrac{1{,}200{,}000\\text{ W}}{120{,}000\\text{ V}} = 10\\text{ A}$$\n\n" +
        "The power line has a fixed resistance, say $R = 0.10\\ \\Omega$. The energy lost as heat in the wires is " +
        "$P_{\\text{loss}} = I^2R$.\n\n" +
        "- Case A: $P_{\\text{loss}} = (1{,}000\\text{ A})^2 \\cdot 0.10\\ \\Omega = 100{,}000\\text{ W}$\n" +
        "- Case B: $P_{\\text{loss}} = (10\\text{ A})^2 \\cdot 0.10\\ \\Omega = 10\\text{ W}$\n\n" +
        "Raising the voltage by a factor of $100$ drops the current by the same factor and cuts the heat loss by a factor " +
        "of $10{,}000$. That is why electricity is sent across long distances at very high voltages.\n\n" +
        "*Note: The numbers in this example are illustrative, chosen to show the physics clearly. Real transmission voltages " +
        "vary by line and are typically tens to hundreds of thousands of volts. See the EIA source below.*",
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l05-transmission.jpg',
      alt: 'A diagram of a power plant with a step-up transformer, high-voltage transmission towers, and a step-down transformer near a house.',
      caption: 'Step **up** to high voltage for the long trip (low current, low loss), then step **down** to a safe voltage for your home.',
    }),

    k.text(
      "So why does the grid send electricity across the state at hundreds of thousands of volts before stepping it back " +
      "down for your house? It comes back to the energy losses we met in **Lesson 3**.\n\n" +
      "The **system** here is the *transmission line* between a power plant and a neighborhood. As charge flows, the wire " +
      "itself resists that flow and heats up — energy leaks out of the system as **thermal** energy in the wires. That " +
      "wasted heating grows with the *square* of the current ($I^2R$ heating): double the current and you lose **four times** " +
      "as much energy to heat.\n\n" +
      "Here's the trick. Because $P = IV$, the same amount of power can be carried with **high voltage and low current** " +
      "*or* low voltage and high current. The grid chooses high voltage on purpose — for a fixed power, raising the voltage " +
      "lets the current drop, and lower current means far less energy lost as heat along the way. That's why those tall " +
      "transmission towers run at such enormous voltages, and why a transformer near your neighborhood steps it back down " +
      "to something safe for your home."
    ),

    k.mc({
      prompt: 'One watt is equal to…',
      options: [
        'one joule per second',
        'one joule per coulomb',
        'one amp per volt',
        'one volt per second',
      ],
      correctIndex: 0,
      explanation:
        'Power is the rate of energy transfer, $P = \\frac{E}{t}$, so a watt is one joule of energy delivered each second ' +
        '(1 W = 1 J/s). A joule per coulomb is a volt, and the other two combinations are not standard units at all.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'A hair dryer plugged into a **120 V** outlet draws **12.5 A** of current. Find its power in watts. ' +
        'Show your work using $P = IV$.',
      placeholder: 'P = IV = …',
      difficulty: 'apply',
    }),

    k.mc({
      prompt: 'Transmission lines run at very high voltage mainly in order to…',
      options: [
        'make the electricity travel faster to homes',
        'increase the total energy delivered to customers',
        'reduce the current so less energy is lost as heat in the lines',
        'prevent the wires from carrying any current at all',
      ],
      correctIndex: 2,
      explanation:
        'For a fixed power, $P = IV$ means a higher voltage lets the current be smaller. Because heating loss grows with ' +
        'the square of the current ($I^2R$), a smaller current wastes far less energy as heat in the wires. The grid still ' +
        'carries current and delivers the same power — it just loses less of it on the way.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt:
        'A phone charger runs on $5\\text{ V}$ and draws $2\\text{ A}$. A desk lamp runs on $120\\text{ V}$ and draws $0.5\\text{ A}$. Which statement is true?',
      options: [
        'The phone charger uses more power because it draws more current.',
        'The phone charger and desk lamp use the same power.',
        'You cannot compare their powers without knowing the time.',
        'The desk lamp uses more power because it operates at higher voltage.',
      ],
      correctIndex: 3,
      explanation:
        'Use $P = IV$. Phone charger: $5\\text{ V} \\cdot 2\\text{ A} = 10\\text{ W}$. Desk lamp: $120\\text{ V} \\cdot 0.5\\text{ A} = 60\\text{ W}$. ' +
        'The lamp uses more power; voltage and current together determine power.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'A microwave oven is rated at $900\\text{ W}$ and plugs into a standard $120\\text{ V}$ outlet. How much current does it draw? Show your work using $P = IV$.',
      placeholder: 'I = P/V = …',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'The grid uses transformers to step voltage up for long-distance transmission and then step it back down before it enters homes. Why is this two-step process better than sending power to homes at the same high voltage used on transmission towers?',
      claimHint: 'State whether the two-step process is safer, more efficient, both, or neither.',
      evidenceHint: 'Use $P = IV$ and $P_{\\text{loss}} = I^2R$ to explain what happens when voltage is high and current is low.',
      reasoningHint: 'Connect the physics to the two different goals: long-distance efficiency and home safety.',
    }),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Vocabulary — Voltage, Current & Power',
      content:
        "- **Voltage ($V$):** the electrical \"push\" that drives charge through a wire, measured in volts (V).\n" +
        "- **Current ($I$):** the rate of flow of charge past a point, measured in amperes (A).\n" +
        "- **Power ($P$):** the rate at which energy is transferred, measured in watts (W).\n" +
        "- **Watt (W):** one joule of energy transferred per second ($1\\text{ W} = 1\\text{ J/s}$).\n" +
        "- **Transformer:** a device that changes AC voltage up or down.\n" +
        "- **Transmission line:** a high-voltage line that carries electricity long distances.\n" +
        "- **Resistive heating ($I^2R$ loss):** energy lost as heat when current flows through a wire with resistance.",
    }),

    k.shortAnswer({
      prompt:
        '**Exit Ticket.** In one or two sentences, explain why the same power can be sent with less energy loss by raising the voltage and lowering the current. Use $P = IV$ or $I^2R$ in your answer.',
      placeholder: 'Raising voltage lowers current because… Less current means less heat loss because…',
      difficulty: 'understand',
    }),

    k.text(
      "**Challenge:** Today some long undersea cables and data centers use **high-voltage direct current (HVDC)** instead " +
      "of AC. HVDC avoids some AC losses and can carry large amounts of power very efficiently. The trade-off is that DC " +
      "cannot be transformed as easily as AC, so the converters are expensive."
    ),

    k.externalLink({
      icon: '📚',
      title: 'Source: EIA — How Electricity Is Delivered to Consumers',
      description:
        'U.S. Energy Information Administration overview of generation, transmission, and distribution, including why the grid uses high voltage.',
      url: 'https://www.eia.gov/energyexplained/electricity/delivery-to-consumers.php',
      buttonLabel: 'Read EIA Overview',
    }),

    k.sectionHeader({ icon: '📝', title: 'Practice: Power & Transmission', subtitle: 'from the printable handout' }),

    k.mc({
      prompt: 'Which phrase best describes what **voltage** measures?',
      options: [
        'the rate at which energy is transferred by a circuit',
        'the rate at which charge flows past a point',
        'the electrical "push" that drives charge through a wire',
        'the energy transferred per coulomb of charge moved',
      ],
      correctIndex: 2,
      explanation:
        'Voltage is the electrical potential difference or "push" that moves charge through a circuit. Current is the rate of ' +
        'charge flow, and power is the rate of energy transfer.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'Which phrase best describes what **current** measures?',
      options: [
        'the rate at which energy is transferred by a circuit',
        'the rate at which charge flows past a point',
        'the electrical "push" that drives charge through a wire',
        'the energy transferred per coulomb of charge moved',
      ],
      correctIndex: 1,
      explanation:
        'Current ($I$) is the rate at which charge flows past a point in a circuit, measured in amperes (A).',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'Which phrase best describes what **power** measures?',
      options: [
        'the rate at which energy is transferred by a circuit',
        'the rate at which charge flows past a point',
        'the electrical "push" that drives charge through a wire',
        'the energy transferred per coulomb of charge moved',
      ],
      correctIndex: 0,
      explanation:
        'Power ($P$) is the rate at which energy is transferred or used, measured in watts (W). One watt equals one joule per second.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'A hair dryer draws $12.5\\text{ A}$ from a $120\\text{ V}$ outlet. What is its power? Show your work using $P = IV$.',
      placeholder: 'P = ___ W',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'A laptop charger delivers $65\\text{ W}$ of power at $20\\text{ V}$. How much current does it draw? Show your work.',
      placeholder: 'I = ___ A',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'A $60\\text{ W}$ LED bulb is left on for $8\\text{ h}$. How much energy does it use? Give your answer in watt-hours (Wh) and kilowatt-hours (kWh). Show your work.',
      placeholder: '___ Wh = ___ kWh',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'A power plant must deliver $600{,}000\\text{ W}$ to a town. It can send the power at $600\\text{ V}$ or at $60{,}000\\text{ V}$. ' +
        'The transmission line has a resistance of $0.20\\ \\Omega$. Find the current and the power lost as heat in each case. ' +
        'Then state which voltage is better for long-distance transmission and why.',
      placeholder:
        'At 600 V: I = ___ A, P_loss = ___ W\n' +
        'At 60,000 V: I = ___ A, P_loss = ___ W\n' +
        'Better voltage: ___ because…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Sending electricity at high voltage is more efficient than sending it at low voltage. Use one number from the transmission problem above to support this claim.',
      claimHint: 'State whether high-voltage transmission is more efficient, less efficient, or the same.',
      evidenceHint: 'Cite the current or power-loss value for the 600 V case and the 60,000 V case.',
      reasoningHint:
        'Explain why high voltage and low current reduce energy loss, using $P = IV$ and $P_{\\text{loss}} = I^2R$.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
