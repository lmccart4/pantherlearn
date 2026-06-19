// seed-phys-u1-l05-voltage-current-power.cjs — Unit 1 Lesson 5: voltage, current & power (light quantitative, PS3.B).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l05-voltage-current-power.cjs
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
      "The first says **power is energy ($E$) delivered per unit of time ($t$)** — a 100 W bulb moves 100 joules of energy " +
      "every second. The second says **power also equals current ($I$) times voltage ($V$)** — the harder you push (more " +
      "volts) and the more charge you push (more amps), the more energy you deliver each second."
    ),

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
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
