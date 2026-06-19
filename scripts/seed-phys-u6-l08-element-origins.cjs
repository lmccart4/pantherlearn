// seed-phys-u6-l08-element-origins.cjs — Unit 6 Lesson 8: Where Do Elements Come From?
// Standards: HS-ESS1-3, HS-PS1-8. Nucleosynthesis and the cosmic origin of elements.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l08-element-origins.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const IMG_BASE = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics';

const lesson = {
  id: 'phys-u6-l08-element-origins',
  title: 'Where Do Elements Come From?',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 608,
  visible: false,
  dueDate: '2027-05-18', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '✨', title: 'Where Do Elements Come From?', subtitle: 'Unit 6 · Lesson 8' }),

    k.objectives([
      'Connect the elements around us to the nuclear processes that formed them',
      'Explain why stars can build elements up to iron, but not much heavier ones',
      'Use evidence to argue that most atoms in our bodies were forged inside stars',
    ]),

    k.text(
      "You've now seen how stars are born, how they shine, and how they die. But stars aren't just pretty lights in the sky — " +
      "they're **element factories**. The carbon in your cells, the oxygen you breathe, the calcium in your bones, and the iron " +
      "in your blood all have a cosmic origin story. Today we trace that story from the Big Bang to your body."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Nucleosynthesis',
      content:
        "**Nucleosynthesis** is the process of building new atomic nuclei. It happens through **nuclear fusion** (light nuclei " +
        "combining to make heavier ones) and, in extreme events, through other nuclear processes that assemble elements heavier " +
        "than iron.",
    }),

    k.text(
      "Here's the big picture, step by step.\n\n" +
      "**Step 1 — The Big Bang made the lightest stuff.** In the first few minutes after the Big Bang, the universe was hot " +
      "and dense enough for protons and neutrons to fuse into **hydrogen, helium, and a tiny bit of lithium**. That set the " +
      "starting ingredients for everything else.\n\n" +
      "**Step 2 — Stars fused lighter elements.** Inside stars, gravity squeezes hydrogen so hard that it fuses into helium, " +
      "releasing the energy that makes stars shine. As stars age, they fuse helium into carbon and oxygen, then carbon into " +
      "heavier elements, climbing the periodic table all the way to **iron (Fe)**.\n\n" +
      "**Step 3 — Iron is the end of the fusion ladder.** Iron has the most stable nucleus of any element. Fusing iron doesn't " +
      "release energy — it *takes* energy. So a star can't power itself by building elements past iron. Fusion stops there.\n\n" +
      "**Step 4 — Supernovae and neutron-star collisions built the rest.** The extreme energy of a supernova (or the collision " +
      "of two neutron stars) can shove nuclei together fast enough to make elements heavier than iron: gold, uranium, iodine, " +
      "and many more. Those elements get blown back into space, where they mix into new gas clouds and new star systems."
    ),

    k.image({
      url: `${IMG_BASE}/phys-u6-l08-element-origins-nucleosynthesis-flow.jpg`,
      alt: 'A flowchart of element origins: the Big Bang makes hydrogen, helium, and lithium; stars fuse elements up to iron; supernovae and neutron-star collisions make heavier elements like gold and uranium; this material seeds new star systems.',
      caption: 'Where the elements come from: the Big Bang made the lightest, stars fuse up to iron, and supernovae forge the heaviest — then recycle them into new worlds. *(Diagram.)*',
    }),

    k.mdTable({
      lead: '**Where Selected Elements Were Made**',
      headers: ['Element', 'Main cosmic origin'],
      rows: [
        ['Hydrogen (H)', 'Big Bang nucleosynthesis; most common atom in the universe'],
        ['Helium (He)', 'Big Bang nucleosynthesis + fusion in stars'],
        ['Carbon (C), Oxygen (O)', 'Fusion inside medium-mass and massive stars'],
        ['Iron (Fe)', 'Final stage of fusion in massive stars before core collapse'],
        ['Gold (Au), Uranium (U)', 'Supernova explosions and neutron-star collisions'],
      ],
      note: 'Data approximate; exact fractions vary by model and source.',
    }),

    k.mc({
      prompt: 'Why can\'t a normal star make elements much heavier than iron by fusion?',
      options: [
        'Iron fusion releases too much energy and would blow the star apart',
        'Stars run out of protons before they can reach heavier elements',
        'Gravity is too weak to squeeze heavy nuclei close enough together',
        'Fusing nuclei heavier than iron takes energy instead of releasing it',
      ],
      correctIndex: 3,
      explanation:
        'Iron has the most stable nucleus. Fusing lighter elements releases energy, but building elements past iron requires ' +
        'energy input. A star can no longer power itself that way, so fusion stops.',
      difficulty: 'understand',
    }),

    k.dataTable({
      title: 'Element Origin Map',
      preset: 'text',
      columns: [
        { key: 'element', label: 'Element' },
        { key: 'origin', label: 'Where it mainly forms' },
      ],
      rows: [
        { key: 'hydrogen', label: 'Hydrogen' },
        { key: 'helium', label: 'Helium' },
        { key: 'carbon', label: 'Carbon' },
        { key: 'oxygen', label: 'Oxygen' },
        { key: 'iron', label: 'Iron' },
        { key: 'gold', label: 'Gold' },
      ],
    }),

    k.mc({
      prompt: 'Most of the calcium in your bones and the iron in your blood was most likely produced by:',
      options: [
        'Nuclear processes in supernova explosions of massive stars',
        'The Big Bang, along with hydrogen and helium, in the first few minutes',
        'Fusion inside the Sun during its main-sequence life today',
        'Radioactive decay of uranium found in Earth\'s crust over time',
      ],
      correctIndex: 0,
      explanation:
        'Calcium and iron are heavier than helium but are not produced by the Big Bang in significant amounts. They are forged ' +
        'in massive stars and dispersed into space by supernovae, later becoming part of new solar systems like ours.',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Astronomer Carl Sagan famously said, "We are made of star stuff." Use what you learned today to explain what he meant.',
      claimHint: 'State what "star stuff" means in this context.',
      evidenceHint: 'Cite specific elements in our bodies and the nuclear processes that formed them.',
      reasoningHint: 'Explain how those elements got from inside stars into our bodies.',
    }),

    k.shortAnswer({
      prompt:
        'Look at the periodic table on the wall (or in your notebook). Pick one element not in the table above and predict ' +
        'where you think it formed: Big Bang, fusion in a star, or a supernova/neutron-star collision. Explain your reasoning.',
      placeholder: 'I chose… It probably formed in… because…',
      difficulty: 'apply',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
