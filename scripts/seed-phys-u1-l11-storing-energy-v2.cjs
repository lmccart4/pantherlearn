// seed-phys-u1-l11-storing-energy-v2.cjs — Unit 1 Lesson 11: Storing Energy (expanded).
// Generated from /Users/lukemccarthy/Lachlan/drafts/physics-content-review/expanded/l11-storing-energy-expanded.md
// NOTE: [NEEDS-RESEARCH: EIA daily demand curve source for NJ / Perth Amboy] — verify EIA URL or soften demand-curve language to "typically" before high-stakes seeding.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l11-storing-energy-v2.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u1-l11-storing-energy',
  title: 'Storing Energy',
  unit: 'Unit 1: Energy & the Grid',
  order: 111,
  visible: false,
  dueDate: '2026-09-22',
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚡', title: 'Storing Energy', subtitle: 'Unit 1 · Lesson 11' }),

    k.objectives([
      'Compare different ways to store energy and the energy form each one uses',
      'Explain how storage helps buffer renewable sources like solar and wind',
      'Use $PE = mgh$ to estimate the energy stored in a pumped-hydro system',
      'Evaluate why batteries alone cannot fully solve renewable intermittency',
    ]),

    k.text(
      "Your phone battery lets you send texts for hours after you unplug it. But could a phone battery keep an entire city running?\n\n" +
      "During Superstorm Sandy, some neighborhoods lost power for more than a week. Solar panels on a roof might have made plenty of electricity at noon the day before the storm — but once the sun went down, that energy was gone unless someone had stored it. **Storage is what turns a moment of sunshine into light after dark.**\n\n" +
      "This lesson is about how we store energy, what form the energy takes while it waits, and why storage is the key to making solar and wind reliable enough to power a community."
    ),

    k.text(
      "There are three common ways to store energy on a grid, and each one parks the energy in a **different form**.\n\n" +
      "- **Batteries** store energy as **chemical energy** in the bonds inside their cells. When the grid needs power, the chemicals react and release electrical energy on demand.\n" +
      "- **Pumped-hydro** stores energy as **gravitational potential energy**. When there is extra electricity, pumps lift water uphill into a high reservoir. Later, the water falls back down through a turbine to generate electricity again. For this case, define the **system as the water plus the Earth** — gravitational potential energy belongs to that pair, not to the water alone. The stored energy is $PE = mgh$, where $m$ is the mass of water lifted, $g$ is the gravitational field strength near Earth's surface, and $h$ is the vertical height it is raised.\n" +
      "- **Thermal storage** stores energy as **heat** — for example, warming a large tank of molten salt or water, then drawing that heat back out later to boil water and spin a turbine.\n\n" +
      "In every case the energy is **transferred and transformed**, never created. We are just holding it in a convenient form until the grid needs it back."
    ),

    k.callout({
      style: 'insight',
      icon: '💡',
      title: 'Why Storage Matters',
      content:
        "Supply and demand do not always line up **in time**. Solar panels typically make the most power around midday, when the sun is highest — but electricity demand in many U.S. communities typically peaks in the **evening**, when families get home, turn on lights, cook dinner, and run air conditioning. By then the sun is already low or gone.\n\n" +
        "**Storage is the fix.** It lets the grid bank extra energy when there is plenty and release it later, when it is needed. Without storage, a grid running on solar and wind would have power at the wrong times.",
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u1-l11-storage-types.jpg',
      alt: 'Three energy-storage methods side by side: a battery, a pumped-hydro reservoir pair with a turbine, and a heated thermal-storage tank.',
      caption: 'Three ways to bank energy for later: chemical (battery), gravitational (pumped-hydro), and thermal (heat).',
    }),

    k.mdTable({
      lead: '**Typical Energy-Storage Trade-Offs**',
      headers: ['Storage type', 'Energy form stored', 'Response speed', 'Typical cost', 'How long it can store'],
      rows: [
        ['Battery', 'Chemical', 'Fast', 'High', 'Hours'],
        ['Pumped-hydro', 'Gravitational PE', 'Slow', 'Low', 'Hours to days'],
        ['Thermal', 'Heat', 'Slow', 'Low', 'Hours to days'],
      ],
      note: 'The values above are typical characteristics, not exact specs for any one facility. Real systems vary by design, location, and age.',
    }),

    k.callout({
      style: 'example',
      icon: '✏️',
      title: 'Worked Example: How much energy is actually stored?',
      content:
        "A small town has two storage options on the table.\n\n" +
        "- **Battery bank:** a set of lithium-ion batteries rated at $E_{\\text{battery}} = 10\\text{ kWh}$ of stored electrical energy.\n" +
        "- **Pumped-hydro reservoir:** a tank that can hold $5{,}000\\text{ kg}$ of water $80\\text{ m}$ above the turbine.\n\n" +
        "**Part A — Battery bank.** The rating already tells us the stored energy:\n\n" +
        "$$E_{\\text{battery}} = 10\\text{ kWh}$$\n\n" +
        "That is enough to run ten $1\\text{ kW}$ window air conditioners for one hour, or one such air conditioner for ten hours.\n\n" +
        "**Part B — Pumped-hydro reservoir.** Use gravitational potential energy:\n\n" +
        "$$PE = mgh$$\n\n" +
        "$$PE = (5{,}000\\text{ kg})(9.8\\text{ m/s}^2)(80\\text{ m})$$\n\n" +
        "$$PE = 3{,}920{,}000\\text{ J} \\approx 3.9\\text{ MJ}$$\n\n" +
        "Convert to kilowatt-hours using $1\\text{ kWh} = 3.6\\text{ MJ}$:\n\n" +
        "$$PE = \\frac{3.9\\text{ MJ}}{3.6\\text{ MJ/kWh}} \\approx 1.1\\text{ kWh}$$\n\n" +
        "**Comparison:** For the same stored energy, the pumped-hydro setup in this example stores **less** than the battery bank. But real pumped-hydro facilities use **millions** of kilograms of water and heights of hundreds of meters, so their stored energy can dwarf a battery bank. The trade-off is response speed and location: batteries can be placed almost anywhere and respond in milliseconds; pumped-hydro needs specific geography and takes longer to ramp up.",
    }),

    k.mc({
      prompt: 'A pumped-hydro facility stores energy by pumping water uphill. What form of energy is being stored?',
      options: [
        'Chemical energy, because water molecules are rearranged.',
        'Gravitational potential energy, because the water is raised against gravity.',
        'Thermal energy, because friction warms the pipes as the water moves.',
        'Kinetic energy, because the water is moving quickly while it is pumped.',
      ],
      correctIndex: 1,
      explanation:
        'Lifting water increases the gravitational potential energy of the water-Earth system. That energy can be recovered later when the water falls and turns a turbine.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'A city gets most of its electricity from solar panels. When is storage most needed to keep the lights on?',
      options: [
        'In the middle of the day, when the sun is brightest and panels produce the most power.',
        'In the early morning, before the sun rises and panels produce almost nothing.',
        'In the evening, after the sun sets but people are still using lights, cooking, and air conditioning.',
        'Storage is never needed, because solar panels can produce power at night using stored moonlight.',
      ],
      correctIndex: 2,
      explanation:
        'Solar output drops at sunset, but evening demand stays high. Storage filled during the day can discharge at night to cover the gap.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        "A pumped-hydro tank holds $2{,}000\\text{ kg}$ of water $50\\text{ m}$ above the turbine. Calculate the stored gravitational potential energy in joules, then convert it to kilowatt-hours. Show your work.",
      placeholder: '$PE = $ ___ J = ___ kWh',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        "Imagine you are advising Perth Amboy on adding storage to a new solar farm. Would you recommend batteries, pumped-hydro, or thermal storage? Name the most important trade-off for Perth Amboy and explain your choice.",
      placeholder: 'I would recommend… because the most important trade-off here is…',
      difficulty: 'evaluate',
    }),

    k.cer({
      prompt:
        'A classmate says, "If we just build enough batteries, we can run the whole grid on solar and wind and never worry about cloudy or calm days." Is that claim correct? Make a claim, support it with evidence from this lesson, and explain your reasoning.',
      claimHint: 'State whether batteries alone can fully solve intermittency.',
      evidenceHint: 'Use what you know about battery cost, storage duration, response speed, and the typical length of cloudy or calm periods.',
      reasoningHint: 'Explain why the trade-offs of batteries matter for a whole grid, and what other solutions might be needed.',
    }),

    k.callout({
      style: 'definition',
      icon: '📖',
      title: 'Vocabulary — Energy Storage',
      content:
        "- **Battery:** a device that stores energy as chemical energy and releases it as electrical energy.\n" +
        "- **Capacity:** the total amount of energy a storage system can hold, often measured in kilowatt-hours (kWh).\n" +
        "- **Discharge:** releasing stored energy from a battery or other storage device.\n" +
        "- **Intermittency:** the property of a power source like solar or wind that does not produce energy all the time.\n" +
        "- **Pumped-hydro storage:** a storage method that uses electricity to pump water uphill, then lets it fall through a turbine to generate electricity later.\n" +
        "- **Thermal storage:** storing energy as heat in a material such as molten salt or water.\n" +
        "- **Grid-scale storage:** a storage system large enough to support an electrical grid rather than a single device.",
    }),

    k.shortAnswer({
      prompt:
        'In one or two sentences, explain why we cannot simply replace every power plant with batteries and solar panels. Name at least one limitation of batteries that makes other energy sources or storage types necessary.',
      placeholder: 'We cannot replace every plant because…',
      difficulty: 'evaluate',
    }),

    k.text(
      "**Challenge:** Engineers around the world are building larger batteries and longer-duration storage. Some systems aim to store energy for days or even weeks, not just hours. The next frontier is making storage cheap enough and long-lasting enough to cover long cloudy spells or seasonal changes in wind and sun."
    ),

    k.externalLink({
      icon: '🔬',
      title: 'Source: Energy Storage Basics — National Renewable Energy Laboratory',
      description: 'NREL overview of battery, pumped-hydro, thermal, and emerging grid-storage technologies.',
      url: 'https://www.nrel.gov/energy-storage/',
      buttonLabel: 'Explore NREL Storage',
    }),

    k.externalLink({
      icon: '📚',
      title: 'Source: U.S. Energy Information Administration — Electricity Explained',
      description: 'EIA primer on how electricity is generated, transmitted, and used, including daily demand patterns.',
      url: 'https://www.eia.gov/energyexplained/electricity/',
      buttonLabel: 'Read EIA Primer',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
