// seed-phys-u1-l03-energy-conserved.cjs — Unit 1 Lesson 3: conservation of energy + accounting for losses.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u1-l03-energy-conserved.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://pantherlearn.com/tools';

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

    k.embed({
      url: `${TOOLS_BASE}/energy-flow-tracer.html`,
      caption: '🔋 **Energy Flow Tracer** — Trace the energy through each transformation and make the totals balance. Remember: the books only balance when you also count the energy lost to heat at every step.',
      height: 750,
    }),

    k.barChart({ title: 'Energy Accounting: Input → Useful → Lost', barCount: 3 }),

    k.text(
      "When engineers want to know how *good* an energy system is, they ask: of all the energy that went **in**, how " +
      "much came out as the **useful** form we actually wanted? That ratio is called **efficiency**:\n\n" +
      "$$\\text{efficiency} = \\dfrac{E_\\text{useful}}{E_\\text{input}}$$\n\n" +
      "A typical natural-gas power plant turns only about a third of its fuel's chemical energy into electricity that " +
      "reaches homes — the rest leaves as heat. So when you account for energy in a system, the input always equals the " +
      "useful output **plus** the energy lost to heat. The total is conserved; it just doesn't all end up where we wanted it."
    ),

    k.mc({
      prompt:
        'A power plant releases **1000 J** of chemical energy by burning fuel, but only **350 J** reach homes as ' +
        'electrical energy. How much energy was "lost," and where did it go?',
      options: [
        '350 J, stored permanently in the transmission wires.',
        '1350 J, since the generator adds energy to the system.',
        '650 J, transformed into thermal energy (heat) during the transformations and transmission.',
        '0 J, because energy is always conserved so nothing is ever lost.',
      ],
      correctIndex: 2,
      explanation:
        'Conservation of energy means the 1000 J doesn\'t disappear — every joule has to be accounted for. ' +
        '$1000\\text{ J} - 350\\text{ J} = 650\\text{ J}$ didn\'t reach homes, so it must have left the useful path in ' +
        'another form: low-grade thermal energy (heat) released at the boiler, the turbine, and along the transmission ' +
        'lines. It wasn\'t destroyed and it wasn\'t stored in the wires — it was transformed into heat that warmed the ' +
        'surroundings.',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Where did the missing **650 J** go? Use the law of conservation of energy to defend your answer.',
      claimHint: 'State what happened to the 650 J that didn\'t reach homes as electricity.',
      evidenceHint: 'Cite the input (1000 J), the useful output (350 J), and the difference between them.',
      reasoningHint: 'Use conservation of energy to explain why the energy had to go somewhere — name the form it took (heat) and where it ended up (the surroundings).',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
