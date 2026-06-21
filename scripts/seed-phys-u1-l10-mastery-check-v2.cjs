// seed-phys-u1-l10-mastery-check-v2.cjs — Unit 1 Lesson 10: mid-unit summative (PS3.A/B, Systems).
// Robust expansion; run only after Claude review.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l10-mastery-check-v2.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u1-l10-mastery-check',
  title: 'Mid-Unit Mastery Check',
  unit: 'Unit 1: Energy & the Grid',
  order: 110,
  visible: false,
  dueDate: '2026-09-21',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📝', title: 'Mid-Unit Mastery Check', subtitle: 'Unit 1 · Lesson 10 — Summative' }),

    k.objectives([
      'Explain the Sandy blackout at the smallest scale — the electrons moving in the wires',
      'Explain it at the system scale — how energy flows across the grid and where it failed',
      'Explain it at the human scale — the decisions about who got their power restored, and when',
      'Use the power equation $P = IV$ and the energy equation $E = Pt$ to solve simple grid problems',
    ]),

    k.text(
      "We've spent this unit pulling the Sandy blackout apart one piece at a time — what energy is, how it moves through a wire, " +
      "how the whole grid hangs together as a **system**, and how people decided what to fix first. Today is your chance to **pull " +
      "the whole story back together** into one explanation that runs across every scale we've studied, from the electrons in the wire " +
      "all the way up to the human decisions about restoration.\n\n" +
      "This isn't about memorizing definitions. It's about **reasoning** — showing me that you can connect the small scale to the big " +
      "scale and tell the story so it holds together. Take your time, use the physics ideas you've built, and explain your thinking the " +
      "way you would to someone who lived through Sandy but never learned how the grid works."
    ),

    k.text(
      "Before you explain the whole Sandy blackout, let's recap the pieces:\n\n" +
      "- **Energy** is transferred from fuel (chemical) → thermal → mechanical → electrical → light/heat/motion in your home.\n" +
      "- **Current** is the flow of charge. In metal wires, the moving charges are electrons. The grid uses **AC** because transformers " +
      "can step its voltage up and down.\n" +
      "- **Voltage** is the \"push\" that drives current. **Power** is how fast energy is being transferred: $P = IV$.\n\n" +
      "None of these ideas lives alone. The blackout happened because the grid — a system of generation, transmission, and distribution " +
      "— had parts that flooded, broke, or shut down."
    ),

    k.text(
      "The grid is a system, not just a set of wires. A system has parts that depend on one another. When one part fails, the effects " +
      "spread:\n\n" +
      "- **Generation:** power plants (mostly natural gas and nuclear in NJ) kept producing electricity during Sandy.\n" +
      "- **Transmission:** high-voltage lines carried power across the state.\n" +
      "- **Substations:** switching stations and transformers were flooded by storm surge, so power could not be routed onward.\n" +
      "- **Distribution:** downed lines and broken poles disconnected neighborhoods.\n" +
      "- **Homes and critical loads:** hospitals, traffic lights, schools, and houses all lost power when the chain broke.\n\n" +
      "To explain the blackout, you have to connect the physics to the system failure."
    ),

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Worked Example: A space heater on a cold night',
      content:
        "A $1500\\text{ W}$ space heater is plugged into a standard $120\\text{ V}$ outlet.\n\n" +
        "**Part A: How much current does it draw?**\n\n" +
        "Use the power equation:\n\n" +
        "$$P = IV$$\n\n" +
        "Rearrange to solve for current:\n\n" +
        "$$I = \\frac{P}{V} = \\frac{1500\\text{ W}}{120\\text{ V}} = 12.5\\text{ A}$$\n\n" +
        "So the heater draws $12.5\\text{ A}$.\n\n" +
        "**Part B: How much electrical energy does it use in 2 hours?**\n\n" +
        "Use:\n\n" +
        "$$E = Pt$$\n\n" +
        "$$E = 1500\\text{ W} \\cdot 2\\text{ h} = 3000\\text{ Wh} = 3.0\\text{ kWh}$$\n\n" +
        "That energy had to be generated at a power plant, stepped up to high voltage, transmitted across the state, stepped back down, " +
        "and delivered through distribution wires to the outlet. Every step in that chain was a possible failure point during Sandy.",
    }),

    k.mc({
      prompt: 'In a natural-gas power plant, the energy transformations are best described as:',
      options: [
        'Chemical → electrical → thermal → mechanical',
        'Chemical → thermal → mechanical → electrical',
        'Electrical → mechanical → thermal → chemical',
        'Mechanical → electrical → thermal → chemical',
      ],
      correctIndex: 1,
      explanation:
        'Natural gas is burned (chemical → thermal), the heat turns water to steam that spins a turbine (thermal → mechanical), and the ' +
        'turbine spins a generator (mechanical → electrical).',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'Why is electricity sent across long distances at very high voltages?',
      options: [
        'High voltage makes electrons move faster through the wire.',
        'High voltage converts AC into DC automatically at substations.',
        'High voltage reduces energy losses in the transmission lines.',
        'High voltage eliminates the need for substations on the grid.',
      ],
      correctIndex: 2,
      explanation:
        'Higher voltage allows lower current for the same power, which reduces resistive losses ($P_{loss} = I^2R$) in the transmission lines. ' +
        'Substations are still needed to step voltage down.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt:
        'During Sandy, many NJ power plants kept running, but customers still lost power. What does that tell you about the cause of the blackout?',
      options: [
        'The blackout was caused by a shortage of fuel at the generating plants.',
        'The blackout happened because people used too much electricity.',
        'The blackout was caused by AC reversing direction too often.',
        'The blackout was mainly a failure of the delivery system, not generation.',
      ],
      correctIndex: 3,
      explanation:
        'Since generation was largely intact, the failure was in transmission, substations, and distribution — the parts that deliver electricity to homes.',
      difficulty: 'analyze',
    }),

    k.shortAnswer({
      prompt:
        'Explain the difference between "energy flowing through the grid" and "electrons moving in the wires." Use one example from the unit.',
      placeholder: 'Energy flowing through the grid means… Electrons moving in the wires means… An example is…',
      difficulty: 'apply',
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l10-grid-diagram.jpg',
      alt:
        'A simplified diagram of the electrical grid, showing five connected stages from left to right: (1) power plant, (2) step-up ' +
        'transformer and transmission towers, (3) substation, (4) distribution lines and pole transformer, (5) house. Some labels are blank for students to fill in.',
      caption: 'Label each stage and add one failure mode that could happen there during a storm.',
    }),

    k.shortAnswer({
      prompt:
        'At the start of the unit, the driving question was "Why did the lights go out during Superstorm Sandy?" Now, write a one-paragraph ' +
        'answer that connects at least three scales: electrons in the wire, a part of the grid system, and a human decision about restoration.',
      placeholder: 'The lights went out during Sandy because…',
      difficulty: 'evaluate',
    }),

    k.externalLink({
      icon: '📚',
      title: 'Source: EIA — How Electricity Is Delivered to Consumers',
      description:
        'U.S. Energy Information Administration overview of the electricity delivery system, including generation, transmission, and distribution.',
      url: 'https://www.eia.gov/energyexplained/electricity/delivery-to-consumers.php',
      buttonLabel: 'Read EIA Overview',
    }),

    k.sketch({
      title: 'Model the Whole Chain',
      instructions:
        'Draw and annotate the full causal chain of the Sandy blackout, from the smallest scale to the largest: electrons moving in ' +
        'the wires → energy flowing through the grid (plant → transmission → substation → home) → why Sandy broke that flow → the human ' +
        'decisions about who got power back first.',
      prompt:
        "Label **every transformation** (where energy changes form) and **every failure point** (where the chain broke during the storm). " +
        'Use arrows to show the direction energy flows.',
    }),

    k.cer({
      prompt:
        'Write one explanation that ties the scales together: **Explain how the Sandy blackout happened, connecting the physics (energy, ' +
        'current, the grid) to the human side (what failed, who was affected).**',
      claimHint: 'State, in one sentence, what fundamentally caused the blackout to happen and to last so long.',
      evidenceHint:
        'Cite specific physics ideas (energy transfer/transformation, current as moving charge, the grid as a system) and specific facts ' +
        'about Sandy and its effects on the community.',
      reasoningHint:
        'Explain how the small-scale physics connects to the system-scale failure and to the human decisions about restoration — show why ' +
        'each link in the chain leads to the next.',
    }),

    k.teacherCheckpoint({
      id: 'phys-u1-l10-cp',
      title: 'Mastery — Teacher Score',
      prompt:
        "Mr. McCarthy will read your model and your written explanation and score them together on the 3-dimensional rubric below. " +
        "You're being graded on how well your reasoning connects the scales — the physics, the system, and the human side — not on " +
        'perfect handwriting or memorized vocabulary. Make your thinking visible.',
      weight: 15,
    }),

    k.rubric3D({
      title: 'Mastery Check Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u1-l10-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
