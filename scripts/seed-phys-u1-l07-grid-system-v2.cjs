// seed-phys-u1-l07-grid-system-v2.cjs — Unit 1 Lesson 7: the grid as a system (supply must match demand).
// Robust expansion; run only after Claude review.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l07-grid-system-v2.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app';

const lesson = {
  id: 'phys-u1-l07-grid-system',
  title: 'The Grid as a System',
  unit: 'Unit 1: Energy & the Grid',
  order: 107,
  visible: false,
  dueDate: '2026-09-16',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'The Grid as a System', subtitle: 'Unit 1 · Lesson 7' }),

    k.objectives([
      'Explain why the electricity generated must match the electricity used at every moment',
      'Use a model to balance generation and demand across a full day',
      'Describe what keeps the grid stable — and what happens when balance is lost',
      'Read a daily load curve and identify peak and minimum demand',
    ]),

    k.text(
      "Flip a light switch at 3 AM and the bulb lights up. Flip the same switch at 6 PM, when millions of other people are " +
      "also using electricity, and it still lights up. But behind that simple fact is a constant balancing act: at every " +
      "instant, the power being generated must equal the power being used. There is almost no place to store the extra, and " +
      "no large reserve to pull from if generation falls short.\n\n" +
      "How do grid operators keep the lights on when demand keeps changing?"
    ),

    k.text(
      "The **grid** is a system. Define the system as every generator, transmission line, substation, and user connected " +
      "together. The system is stable only when its inputs and outputs stay in balance.\n\n" +
      "- **Generation** is the power being fed into the grid by power plants, solar farms, wind turbines, and other sources.\n" +
      "- **Load** (or **demand**) is the power being drawn out by homes, schools, businesses, and factories.\n\n" +
      "For the grid to work, generation must match load **second by second**. If generation is too low, the grid frequency sags " +
      "and protective equipment shuts parts of it down — a blackout. If generation is too high, the frequency rises, which can " +
      "also damage equipment. Grid operators constantly adjust generation up and down to follow the load."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l07-load-curve.jpg',
      alt: 'A daily electricity demand curve that is low overnight, rises through the morning, dips midday, and peaks in the early evening.',
      caption: 'Demand is never flat — it dips overnight and spikes in the evening. The grid has to match this curve hour by hour.',
    }),

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Worked Example: When does the grid feel the most pressure?',
      content:
        "The table below shows an **illustrative** daily load curve for a region. It shows a typical pattern, not data from a " +
        "single real day.\n\n" +
        "| Time of day | Demand (MW) |\n" +
        "| --- | --- |\n" +
        "| Midnight | $4{,}000$ |\n" +
        "| 6 AM | $5{,}000$ |\n" +
        "| 9 AM | $7{,}500$ |\n" +
        "| Noon | $7{,}000$ |\n" +
        "| 3 PM | $6{,}500$ |\n" +
        "| 6 PM | $9{,}000$ |\n" +
        "| 9 PM | $7{,}000$ |\n" +
        "| Midnight | $4{,}500$ |\n\n" +
        "**Step 1:** Find the highest demand.\n\n" +
        "The peak is $9{,}000\\text{ MW}$ at $6\\text{ PM}$.\n\n" +
        "**Step 2:** Find the lowest demand.\n\n" +
        "The minimum is $4{,}000\\text{ MW}$ at midnight.\n\n" +
        "**Step 3:** Calculate the difference between peak and minimum.\n\n" +
        "$$9{,}000\\text{ MW} - 4{,}000\\text{ MW} = 5{,}000\\text{ MW}$$\n\n" +
        "Grid operators must keep enough generation available to cover that swing. Plants that can start quickly — often " +
        "natural-gas \"peaker\" plants — are used to handle the evening peak.\n\n" +
        "*Source note:* The general shape of daily demand curves is documented by the U.S. EIA; see the source link below.",
    }),

    k.embed({
      url: `${TOOLS_BASE}/grid-reliability-simulator.html?mode=learn`,
      caption:
        '🔌 **Grid Reliability Simulator (Learn Mode)** — Set an energy mix and watch demand rise and fall across a full day. ' +
        'Your goal: keep generation at or above demand at every hour, including the evening peak, without blacking out.',
      height: 800,
    }),

    k.mc({
      prompt:
        'If electricity demand suddenly exceeds supply and nothing adjusts, what is the **most likely** result?',
      options: [
        'The extra demand is automatically stored away and saved for use later that day',
        'The voltage rises across the grid and connected appliances simply run faster',
        'Nothing happens, because on the grid supply is always exactly equal to demand',
        'The grid frequency drops and parts of the grid shut off to protect equipment (a blackout)',
      ],
      correctIndex: 3,
      explanation:
        'When load outruns generation, generators are pulled harder than they can sustain and the grid frequency sags. ' +
        'Protective equipment disconnects sections to prevent damage, causing a blackout.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'Using the worked-example load curve, when is demand highest?',
      options: [
        '6 PM in the early evening',
        'Midnight while most people sleep',
        '9 AM during the morning ramp',
        'Noon during the midday dip',
      ],
      correctIndex: 0,
      explanation:
        'The table shows $9{,}000\\text{ MW}$ at 6 PM, which is the highest value listed.',
      difficulty: 'apply',
    }),

    k.mc({
      prompt: 'Why do grid operators keep some power plants idle until demand peaks?',
      options: [
        'To save money by never running them at full power',
        'To have extra generation ready when demand rises quickly',
        'To reduce the total amount of electricity used by customers',
        'To store electricity inside the plants for later release',
      ],
      correctIndex: 1,
      explanation:
        'Demand changes throughout the day. Operators keep \"peaker\" plants or spare capacity available so they can increase ' +
        'generation quickly when load rises, keeping supply equal to demand.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        'In your own words, why does the grid have to constantly balance supply and demand? What did the simulator show you ' +
        'about what happens when it cannot?',
      placeholder: 'The grid has to stay balanced because…\n\nIn the simulator I saw that…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Imagine you are planning a reliable grid for a town that needs power all day and all night. You can choose any mix of ' +
        'solar, wind, natural gas, and batteries. What mix would you choose, and why?',
      claimHint: 'State the energy mix you would use.',
      evidenceHint: 'Use what you know about when solar and wind produce power, and when demand peaks.',
      reasoningHint: 'Explain why your mix stays reliable even when the sun sets or the wind dies down.',
    }),

    k.callout({
      style: 'definition',
      icon: '📖',
      title: 'Vocabulary — The Grid as a System',
      content:
        '- **Grid:** the interconnected system of generators, transmission lines, substations, and users that delivers electricity.\n' +
        '- **Generation:** the power being fed into the grid by power plants and other sources.\n' +
        '- **Load / demand:** the power being drawn out of the grid by users.\n' +
        '- **Peak demand:** the highest amount of power used during a given period, often in the early evening.\n' +
        '- **Grid frequency:** the rate at which AC current oscillates; in the U.S. it is normally $60\\text{ Hz}$.\n' +
        '- **Baseload generation:** power plants that run continuously to meet minimum demand.\n' +
        '- **Peaker plant:** a power plant that can start quickly to meet short periods of high demand.\n' +
        '- **Variable generation:** sources like solar and wind whose output changes with weather.',
    }),

    k.shortAnswer({
      prompt:
        'Explain why a power grid cannot rely on solar panels alone if demand stays high after sunset. Use at least two of these ' +
        'terms: *generation*, *demand*, *peak*, or *storage*.',
      placeholder: 'A grid cannot rely on solar alone after sunset because…',
      difficulty: 'apply',
    }),

    k.text(
      "**Extension:** Battery storage and demand response (paying customers to reduce use during peaks) are two ways to keep the " +
      "grid balanced without building more power plants. Both are growing fast, but they raise their own engineering and equity " +
      "questions. Who gets paid to reduce use? Who pays for the batteries?"
    ),

    k.externalLink({
      icon: '📊',
      title: 'Source: U.S. EIA — Daily Electricity Demand Patterns',
      description:
        'EIA data and charts showing how electricity demand varies by time of day and season.',
      url: 'https://www.eia.gov/todayinenergy/detail.php?id=42912',
      buttonLabel: 'View EIA Demand Patterns',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
