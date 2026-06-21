// seed-phys-u1-l03-energy-conserved-v3.cjs — Unit 1 Lesson 3: conservation of energy + accounting for losses + printable practice as graded blocks.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l03-energy-conserved-v3.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app';
const withId = (block, id) => ({ ...block, id });

const lesson = {
  id: 'phys-u1-l03-energy-conserved',
  title: 'Energy Doesn\'t Disappear',
  unit: 'Unit 1: Energy & the Grid',
  order: 103,
  visible: false,
  dueDate: '2026-09-10',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'Energy Doesn\'t Disappear', subtitle: 'Unit 1 · Lesson 3' }),

    k.objectives([
      'State the law of conservation of energy in your own words',
      'Track energy through a chain of transformations, including the energy that gets "lost"',
      'Account for "lost" energy as low-grade heat that escapes to the surroundings',
    ]),

    k.text(
      "Take out your phone. If the battery is at 20%, you know it will eventually shut down. When that happens, " +
      "where did the energy go?\n\n" +
      "It didn't vanish. The battery's stored chemical energy was transformed into electrical energy, which the phone " +
      "transformed into light, sound, and motion — and also into heat. Even the heat is still energy; it just spread into " +
      "the air around the phone, where it is too spread out to be useful.\n\n" +
      "That is the big idea of this lesson: **energy is conserved**. It changes form and moves around, but it is never " +
      "created or destroyed."
    ),

    k.callout({
      style: 'insight',
      icon: '💡',
      title: 'Conservation of Energy',
      content:
        "**Energy is never created or destroyed — it only changes form.** This is one of the most important laws in all " +
        "of physics, and it has *no known exceptions*.\n\n" +
        "The **system** we'll track in this lesson is the same one as last time: the path energy takes from a *power " +
        "plant* all the way to a *home*. If we add up every form the energy takes inside that system, the total always " +
        "stays the same. Nothing vanishes.",
    }),

    k.text(
      "Last lesson we followed the energy from a fuel's **chemical** bonds, to **thermal** energy when it burns, to the " +
      "**mechanical** energy of a spinning turbine, to the **electrical** energy that races to your home:\n\n" +
      "$$\\text{chemical} \\rightarrow \\text{thermal} \\rightarrow \\text{mechanical} \\rightarrow \\text{electrical}$$\n\n" +
      "Here's the catch nobody tells you at first: **at every single step, some energy escapes as low-grade heat.** The " +
      "boiler radiates warmth into the air. The turbine bearings get hot from friction. The transmission lines warm up " +
      "as charge pushes through them. None of that energy is *destroyed* — it's just transformed into a form we can't " +
      "easily use anymore. It leaks out of our useful path and into the **surroundings** as heat."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l03-energy-sankey.jpg',
      alt: 'A Sankey diagram of energy flowing in from the left, with thin arrows of heat peeling off at each step and a smaller useful-output arrow remaining.',
      caption: 'Energy is conserved: the energy in equals the useful energy out **plus** everything that leaks away as heat at each step.',
    }),

    k.text(
      "When engineers want to know how *good* an energy system is, they ask: of all the energy that went **in**, how " +
      "much came out as the **useful** form we actually wanted? That ratio is called **efficiency**:\n\n" +
      "$$\\text{efficiency} = \\dfrac{E_\\text{useful}}{E_\\text{input}}$$\n\n" +
      "Different power plants have very different efficiencies. Older simple-cycle natural-gas plants convert roughly " +
      "**30–35%** of their fuel's chemical energy into electricity. Modern combined-cycle natural-gas plants — which capture " +
      "waste heat from a gas turbine to run a second steam turbine — convert about **45%** of that energy into electricity, " +
      "according to U.S. Energy Information Administration data. The rest leaves the plant as low-grade heat.\n\n" +
      "So when you account for energy in a system, the input always equals the useful output **plus** the energy lost to " +
      "heat. The total is conserved; it just doesn't all end up where we wanted it."
    ),

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Worked Example: Where did the battery energy go?',
      content:
        "A phone battery stores **10 Wh** of energy. The phone uses an average of **2.0 W** while a student watches videos " +
        "for **4.0 h**.\n\n" +
        "**Step 1:** Find the useful electrical energy the phone consumes.\n\n" +
        "$$E = P \\cdot t = 2.0\\text{ W} \\cdot 4.0\\text{ h} = 8.0\\text{ Wh}$$\n\n" +
        "**Step 2:** Account for the rest.\n\n" +
        "The battery started with 10 Wh. The phone used 8 Wh for light, sound, and computing. That leaves:\n\n" +
        "$$10\\text{ Wh} - 8.0\\text{ Wh} = 2.0\\text{ Wh}$$\n\n" +
        "**Step 3:** Where did the missing 2 Wh go?\n\n" +
        "It became thermal energy — the phone warmed up. Some was radiated into the air; some warmed the case and the " +
        "student's hand. The total is still 10 Wh:\n\n" +
        "$$10\\text{ Wh (battery)} = 8.0\\text{ Wh (useful work)} + 2.0\\text{ Wh (heat to surroundings)}$$\n\n" +
        "No energy was created or destroyed. It was only transformed and transferred.",
    }),

    withId(k.embed({
      url: `${TOOLS_BASE}/energy-flow-tracer.html`,
      caption: '🔋 **Energy Flow Tracer** — Trace the energy through each transformation and make the totals balance. Remember: the books only balance when you also count the energy lost to heat at every step.',
      height: 750,
    }), 'sqszdwrrmql137yt'),

    k.barChart({ title: 'Energy Accounting: Input → Useful → Lost', barCount: 3 }),

    k.mc({
      prompt: 'In physics, when we say energy is "conserved," we mean:',
      options: [
        'Energy cannot be created or destroyed; it only changes form.',
        'Energy is saved whenever we turn off unused lights.',
        'The total amount of energy in the universe is slowly decreasing.',
        'Energy is stored only in batteries and fuels.',
      ],
      correctIndex: 0,
      explanation:
        'Conservation of energy means the total energy in a closed system stays constant. It can be transferred or transformed, ' +
        'but not created or destroyed.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt:
        'A power plant releases **1000 J** of chemical energy by burning fuel, but only **350 J** reach homes as ' +
        'electrical energy. How much energy was "lost," and where did it go?',
      options: [
        '350 J, stored permanently in the transmission wires.',
        '1350 J, since the generator adds energy to the system.',
        '650 J, transformed into thermal energy that escapes as heat.',
        '0 J, because energy is always conserved so nothing is ever lost.',
      ],
      correctIndex: 2,
      explanation:
        'Conservation of energy means the 1000 J doesn\'t disappear — every joule has to be accounted for. ' +
        '$1000\\text{ J} - 350\\text{ J} = 650\\text{ J}$ didn\'t reach homes, so it must have left the useful path as ' +
        'low-grade thermal energy (heat) released at the boiler, the turbine, and along the transmission lines.',
      difficulty: 'apply',
    }),

    k.mc({
      prompt:
        'A modern combined-cycle natural-gas power plant converts about 45% of its fuel\'s chemical energy into electricity. What happens to the other 55%?',
      options: [
        'It is destroyed by the generator to protect the rest of the grid.',
        'It is stored inside the transmission towers for later use.',
        'It turns back into natural gas inside the distribution pipes.',
        'It leaves the plant as low-grade heat that warms the surroundings.',
      ],
      correctIndex: 3,
      explanation:
        'The other 55% becomes thermal energy that escapes into the surroundings as waste heat. Energy is conserved, so it ' +
        'cannot be destroyed — but it becomes less useful.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'Why is "used up" the wrong way to describe what happens to energy in a phone?',
      options: [
        'The phone continuously creates new energy from its battery chemicals as it runs.',
        'The energy changes form and spreads out, but the total stays the same.',
        'The battery absorbs thermal energy from the air to recharge itself.',
        'Energy disappears permanently once the battery icon shows 0% charge.',
      ],
      correctIndex: 1,
      explanation:
        'Energy is conserved. It is not used up or destroyed; it is transformed into other forms (light, sound, heat) and ' +
        'transferred to the surroundings.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'A laptop charger supplies **60 W** of power. The laptop converts **45 W** into useful work (light, sound, computing). ' +
        'The rest becomes heat. How much power becomes heat? Show your work and explain where the heat goes.',
      placeholder: 'P_heat = ___ W. The heat goes to…',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'A student says, "A power plant that is 40% efficient wastes most of the fuel\'s energy." Is that statement fair? ' +
        'Explain using the words **efficiency**, **useful output**, and **heat**.',
      placeholder: 'The statement is fair / unfair because…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Where did the missing **650 J** go? Use the law of conservation of energy to defend your answer.',
      claimHint: 'State what happened to the 650 J that didn\'t reach homes as electricity.',
      evidenceHint: 'Cite the input (1000 J), the useful output (350 J), and the difference between them.',
      reasoningHint:
        'Use conservation of energy to explain why the energy had to go somewhere — name the form it took (heat) and ' +
        'where it ended up (the surroundings).',
    }),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Vocabulary — Conservation & Efficiency',
      content:
        "- **Conserve:** to keep the same total amount; in physics, energy is conserved because its total does not change.\n" +
        "- **Transform:** to change from one form of energy into another.\n" +
        "- **Dissipate:** to spread out and become less concentrated, especially as low-grade heat in the surroundings.\n" +
        "- **Thermal energy:** the energy of moving particles; what we commonly call heat.\n" +
        "- **Surroundings:** everything outside the system being studied; where \"lost\" energy usually ends up.\n" +
        "- **Efficiency:** the ratio of useful energy output to total energy input, usually written as a percentage.\n" +
        "- **Combined-cycle plant:** a natural-gas power plant that uses waste heat from one turbine to run a second turbine, raising efficiency.",
    }),

    k.shortAnswer({
      prompt:
        '**Exit Ticket.** Explain why "used up" is the wrong phrase for energy. Use one everyday example (phone, car, lamp, etc.) ' +
        'and name at least two forms the energy takes.',
      placeholder: '"Used up" is wrong because… For example, when I use a ___ , the energy becomes…',
      difficulty: 'understand',
    }),

    k.text(
      "**Challenge:** Engineers fight over every percent of efficiency because wasted energy costs money and, for fossil-fuel " +
      "plants, releases carbon dioxide. A combined-cycle natural-gas plant at ~45% efficiency uses less fuel per " +
      "kilowatt-hour than an older simple-cycle plant at ~33% efficiency. Over a year, that difference can mean millions of " +
      "dollars and thousands of tons of CO₂."
    ),

    k.externalLink({
      icon: '📊',
      title: 'Source: EIA — Efficiency of Different Types of Power Plants',
      description:
        'U.S. Energy Information Administration data on average tested heat rates and efficiencies for U.S. power plants.',
      url: 'https://www.eia.gov/tools/faqs/faq.php?id=107&t=3',
      buttonLabel: 'Read EIA FAQ',
    }),

    k.sectionHeader({ icon: '📝', title: 'Practice: Energy Accounting', subtitle: 'from the printable handout' }),

    k.mc({
      prompt: 'In physics, when we say energy is "conserved," we mean it:',
      options: [
        'cannot be created or destroyed; it only changes form.',
        'is saved whenever we turn off unused lights.',
        'is slowly decreasing across the whole universe.',
        'can be stored only inside batteries and fuels.',
      ],
      correctIndex: 0,
      explanation:
        'Conservation of energy means the total energy in a system stays constant. Energy can be transferred or transformed, ' +
        'but it cannot be created or destroyed.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'The ratio of useful energy output to total energy input is called:',
      options: [
        'conservation of energy.',
        'energy transformation.',
        'efficiency.',
        'dissipation.',
      ],
      correctIndex: 2,
      explanation:
        'Efficiency compares the useful output energy to the total input energy. The rest is usually lost as low-grade heat.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'A power plant releases **800 J** of chemical energy, but only **300 J** reach homes as electricity. ' +
        'Find the energy "lost," name the form it takes, and write the accounting equation.',
      placeholder: 'Lost = ___ J. Form: ___. Equation: ___',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'A phone battery stores **12 Wh** of energy. After 3 hours, the phone has used **7 Wh** of useful energy. ' +
        'Find the energy lost, name its main form, and write the equation.',
      placeholder: 'Lost = ___ Wh. Form: ___. Equation: ___',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'A laptop charger supplies **50 W** of power. The laptop does **35 W** of useful work. ' +
        'Find the power lost as heat and the efficiency of this step. Show your work.',
      placeholder: 'P_lost = ___ W. efficiency = ___ %',
      difficulty: 'apply',
    }),

    k.mc({
      prompt: 'Three plants report these efficiencies. Which list ranks them from **most efficient to least efficient**?',
      options: [
        'coal 35%, old simple-cycle natural gas 33%, modern combined-cycle natural gas 45%',
        'modern combined-cycle natural gas 45%, coal 35%, old simple-cycle natural gas 33%',
        'old simple-cycle natural gas 33%, coal 35%, modern combined-cycle natural gas 45%',
        'modern combined-cycle natural gas 45%, old simple-cycle natural gas 33%, coal 35%',
      ],
      correctIndex: 1,
      explanation:
        'Ranking from highest efficiency to lowest: modern combined-cycle natural gas at 45%, coal at 35%, old simple-cycle ' +
        'natural gas at 33%. Higher efficiency means more useful electricity per unit of fuel.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        'A student says, "My phone used up all its battery energy, so the energy is gone." Use the law of conservation of energy ' +
        'to explain why that statement is wrong. Name at least two forms the energy took.',
      placeholder: 'The energy is not gone because… It became… and…',
      difficulty: 'apply',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
