// seed-phys-u1-l02-following-energy-v2.cjs — Unit 1 Lesson 2: what energy is + Energy Flow Tracer embed.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l02-following-energy-v2.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app';
const withId = (block, id) => ({ ...block, id });

const lesson = {
  id: 'phys-u1-l02-following-energy',
  title: 'Following the Energy',
  unit: 'Unit 1: Energy & the Grid',
  order: 102,
  visible: false,
  dueDate: '2026-09-09',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'Following the Energy', subtitle: 'Unit 1 · Lesson 2' }),

    k.objectives([
      'Define energy as the ability to cause change',
      'Identify the forms of energy along the path from power plant to home',
      'Trace how energy is transferred and transformed across the grid',
    ]),

    k.text(
      "Last lesson, the lights went out. Before we can fix the grid, we have to understand what's actually flowing " +
      "through it. So let's **follow the energy**.\n\n" +
      "**Energy** is the ability to cause change — to make something move, heat up, light up, or transform. The " +
      "**system** we'll trace in this lesson is the path energy takes from a *power plant* all the way to a *single home*."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Forms of Energy You\'ll Meet',
      content:
        "- **Chemical** — energy stored in the bonds of a fuel (like natural gas)\n" +
        "- **Thermal** — energy of hot, fast-moving particles (heat)\n" +
        "- **Mechanical** — energy of motion (a spinning turbine)\n" +
        "- **Electrical** — energy carried by moving charge in a wire\n" +
        "- **Radiant** — energy carried by light",
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l02-energy-path.jpg',
      alt: 'A diagram of the four stages electricity travels through: power plant, transmission towers, substation, and home.',
      caption: 'The path your electricity takes: generation → transmission → distribution → your outlet.',
    }),

    k.text(
      "Here's the journey. At a power plant, a fuel's **chemical** energy is released as **thermal** energy when it " +
      "burns. That heat boils water into steam, which spins a turbine — now the energy is **mechanical**. The spinning " +
      "turbine drives a generator that produces **electrical** energy. That electrical energy races through " +
      "transmission lines, steps down at substations, and finally reaches the outlet in your wall.\n\n" +
      "In New Jersey, almost all of our electricity comes from **natural gas and nuclear** plants. Both are *thermal* " +
      "plants — they make heat to boil water to spin turbines. (Here's a clue for later: during Sandy, the power " +
      "plants were mostly fine. Something else in this path broke.)"
    ),

    k.text(
      "**A quick refresher from chemistry:** energy is stored in the *motion* and *arrangement* of particles. When " +
      "natural gas burns, the energy stored in its chemical bonds is released and makes particles move faster — that's " +
      "what we feel as heat. Energy never appears from nowhere; it gets **transferred** and **transformed** from one " +
      "form into another."
    ),

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Worked Example: Where does the energy in your phone come from?',
      content:
        "Suppose you plug your phone into a wall charger in Perth Amboy. Let's trace the energy all the way back.\n\n" +
        "| Stage | What happens | Energy form |\n" +
        "| --- | --- | --- |\n" +
        "| 1. Natural gas underground | Energy is stored in the fuel's chemical bonds | **Chemical** |\n" +
        "| 2. Power plant boiler | The gas burns; particles move faster | **Chemical → Thermal** |\n" +
        "| 3. Turbine | Steam pushes blades to spin | **Thermal → Mechanical** |\n" +
        "| 4. Generator | Spinning magnets inside coils push charge through wires | **Mechanical → Electrical** |\n" +
        "| 5. Transmission + distribution | Electricity travels at high voltage, then steps down | **Electrical** (still) |\n" +
        "| 6. Phone charger | Electricity becomes a low-voltage current your phone can use | **Electrical** (still) |\n" +
        "| 7. Phone battery / screen | Electrical energy is stored chemically and also becomes light | **Electrical → Chemical + Radiant** |\n\n" +
        "Every arrow in that table is either a **transformation** (one form becomes another) or a **transfer** (the same " +
        "form moves from place to place). The total energy stays the same — but its form changes over and over.",
    }),

    withId(k.embed({
      url: `${TOOLS_BASE}/energy-flow-tracer.html`,
      caption: '🔋 **Energy Flow Tracer** — Follow the energy from the power plant to a home. Trace each transformation and keep the totals balanced.',
      height: 750,
    }), '4mdzpe3lmql137bu'),

    k.mc({
      prompt: 'At a natural-gas power plant, what is the **first** energy transformation that happens when the fuel is burned?',
      options: [
        'Electrical energy is transformed into thermal energy',
        'Chemical energy is transformed into thermal energy',
        'Mechanical energy is transformed into electrical energy',
        'Radiant energy is transformed into chemical energy',
      ],
      correctIndex: 1,
      explanation:
        'Burning fuel releases the chemical energy stored in its bonds as thermal energy (heat). That heat then boils ' +
        'water to spin a turbine (mechanical), which drives a generator (electrical). The chemical → thermal step comes first.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'Electricity moves from a high-voltage transmission line to a lower-voltage distribution line at a substation. What happens to the energy?',
      options: [
        'The energy is transferred to another grid part; it is still electrical.',
        'The energy is transformed from electrical into thermal and then back into electrical.',
        'The energy is destroyed by the transformer so less reaches homes.',
        'The energy is created when the voltage is stepped down.',
      ],
      correctIndex: 0,
      explanation:
        'A substation transfers electrical energy from transmission lines to distribution lines. The voltage changes, ' +
        'but the energy is still electrical — it is transferred, not transformed into a different form.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'In a power plant, steam spins a turbine. What form of energy does the spinning turbine have?',
      options: [
        'Thermal energy, because the steam that hits the turbine is hot.',
        'Electrical energy, because the turbine is connected to a generator.',
        'Mechanical energy, because a moving object has mechanical energy.',
        'Chemical energy, because the metal blades can react with steam.',
      ],
      correctIndex: 2,
      explanation:
        'A spinning turbine is moving, so its energy is mechanical. The generator then converts that mechanical energy into electrical energy.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'You turn on a desk lamp. The bulb glows. What is the last energy transformation in the path from power plant to light?',
      options: [
        'Chemical energy in the wire becomes thermal energy in the bulb.',
        'Mechanical energy from a spinning turbine becomes electrical energy.',
        'Thermal energy from the bulb becomes chemical energy in the wire.',
        'Electrical energy is transformed into radiant energy (light).',
      ],
      correctIndex: 3,
      explanation:
        'Inside the bulb, electrical energy from the wire is transformed into radiant energy (light). Some also becomes ' +
        'thermal energy (heat), but the useful output we wanted was light.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'Pick one device in this classroom (lamp, computer, projector, etc.). List the energy forms it passes through, ' +
        'from the original fuel at the power plant to the useful output in the device.',
      placeholder: 'Fuel → ... → device output',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'Explain the difference between an energy **transfer** and an energy **transformation**. Give one example of each from the grid path.',
      placeholder: 'A transfer is… A transformation is…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Where does the electrical energy in your home\'s outlet *originally* come from? Trace it all the way back to its source.',
      claimHint: 'Name the original source of the energy.',
      evidenceHint: 'List the forms the energy passes through, in order, from the plant to the outlet.',
      reasoningHint: 'Explain how each transformation hands the energy to the next stage.',
    }),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Vocabulary — Energy on the Grid',
      content:
        "- **System:** the set of objects and processes we choose to study. In this lesson, the system is power plant → " +
        "transmission → substation → home.\n" +
        "- **Energy transfer:** energy moving from one place or object to another without changing form.\n" +
        "- **Energy transformation:** energy changing from one form into another.\n" +
        "- **Input:** the energy that enters a system or a step.\n" +
        "- **Output:** the energy that leaves a system or a step in a useful form.\n" +
        "- **Generator:** a device that converts mechanical energy into electrical energy.\n" +
        "- **Turbine:** a machine with spinning blades that converts the energy of a moving fluid (steam, water, air) into mechanical energy.",
    }),

    k.shortAnswer({
      prompt:
        '**Exit Ticket.** Choose one device in your home. Trace its energy back two steps (device → outlet → power plant) ' +
        'and name the energy form at each step. Then explain whether each step is a transfer or a transformation.',
      placeholder: 'My device: ___ → outlet: ___ → power plant: ___',
      difficulty: 'apply',
    }),

    k.text(
      "**Challenge:** Not every power plant burns fuel. A solar farm transforms **radiant** energy from sunlight directly " +
      "into **electrical** energy — no turbine needed. A wind turbine transforms the **mechanical** energy of moving air " +
      "into **mechanical** rotation, then into **electrical** energy. Both skip the \"thermal\" step, which is one reason " +
      "renewable sources don't warm the planet as much when they generate electricity."
    ),

    k.externalLink({
      icon: '🌞',
      title: 'Source: How Electricity Is Made — U.S. EIA',
      description:
        'EIA overview of the different ways the United States generates electricity, including natural gas, nuclear, hydro, wind, and solar.',
      url: 'https://www.eia.gov/energyexplained/electricity/',
      buttonLabel: 'Read EIA Overview',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
