// seed-phys-u3-l12-seatbelts-airbags-crumple-zones.cjs — Unit 3 Lesson 12: safety features extend stopping time and distribute force.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l12-seatbelts-airbags-crumple-zones.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u3-l12-seatbelts-airbags-crumple-zones',
  title: 'Seatbelts, Airbags & Crumple Zones',
  unit: 'Unit 3: Collisions & Momentum',
  order: 312,
  visible: false,
  dueDate: '2026-11-13', // PLACEHOLDER
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🛡️', title: 'Seatbelts, Airbags & Crumple Zones', subtitle: 'Unit 3 · Lesson 12' }),

    k.objectives([
      'Explain how seatbelts, airbags, and crumple zones extend stopping time and reduce peak force',
      'Analyze crash-test data to compare forces on restrained and unrestrained occupants',
      'Use structure-and-function reasoning to evaluate a safety feature',
    ]),

    k.text(
      "A car's job in a crash is not to survive perfectly intact. Its job is to protect the people inside. Engineers do " +
      "that by controlling how the car — and the people — slow down.\\n\\n" +
      "Every safety feature you see in a modern vehicle is a way of applying the same physics idea: **for a fixed " +
      "momentum change, a longer stopping time means a smaller peak force**. Seatbelts stretch a little. Airbags inflate " +
      "and then deflate as the person presses into them. Crumple zones collapse in a controlled way. Each feature turns " +
      "a brief, deadly stop into a longer, survivable one."
    ),

    k.externalLink({
      icon: '🎥',
      title: 'Crash Test Video: Restrained vs. Unrestrained',
      description:
        'Watch an IIHS crash test to see how crumple zones, seatbelts, and airbags work together during a frontal collision.',
      url: 'https://www.youtube.com/@iihs',
      buttonLabel: 'Watch IIHS Tests',
    }),

    k.text(
      "**How the features work together.**\\n\\n" +
      "- **Crumple zones** at the front and rear of the car absorb energy by deforming. They increase the time over " +
      "which the car's own momentum goes to zero, so the passenger cell slows more gradually.\\n" +
      "- **Seatbelts** keep the occupant moving with the car instead of flying forward. They also stretch slightly, " +
      "adding a little more stopping time.\\n" +
      "- **Airbags** fill the space between the person and the steering wheel or dashboard. They inflate quickly, then " +
      "let air escape as the person sinks in, spreading the force over a larger area and a longer time.\\n\\n" +
      "The system here is the **car + occupant**. Each feature is a structure with a function: turn a dangerous peak " +
      "force into a smaller, longer-lasting force."
    ),

    // IMAGE PHASE: annotated crash-test photo showing crumple zone, seatbelt path, and airbag deployment

    k.mdTable({
      lead: '**Approximate frontal crash-test data (illustrative)**',
      headers: ['Condition', 'Stopping time (s)', 'Peak force on chest (kN)'],
      rows: [
        ['No seatbelt, no airbag', '0.005', '50'],
        ['Seatbelt only', '0.040', '8'],
        ['Seatbelt + airbag', '0.080', '4'],
        ['Seatbelt + airbag + crumple zone', '0.150', '2'],
      ],
      note: 'Values are rounded for comparison; real tests vary by vehicle and crash configuration.',
    }),

    k.mc({
      prompt:
        'According to the data table, what is the main effect of adding seatbelts, airbags, and crumple zones together?',
      options: [
        'They reduce the total momentum change of the occupant during the crash.',
        'They increase the total momentum change of the occupant during the crash.',
        'They make the car more rigid so it does not deform in a crash.',
        'They extend the stopping time and therefore reduce the peak force on the occupant.',
      ],
      correctIndex: 3,
      explanation:
        'The occupant’s momentum change is fixed by the car’s initial speed. Safety features cannot change that. What ' +
        'they can do is extend the stopping time, which reduces peak force via $F_{avg}\\Delta t = \\Delta p$.',
      difficulty: 'analyze',
    }),

    k.shortAnswer({
      prompt:
        '**Structure and function.** Pick one safety feature (seatbelt, airbag, or crumple zone). Describe its structure ' +
        'and explain how that structure lets it perform its safety function.',
      placeholder: 'Feature: …\\n\\nStructure: …\\n\\nFunction: …',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Use the crash-test data and the impulse-momentum theorem to claim why modern cars are designed to crumple ' +
        'rather than stay perfectly rigid in a frontal crash.',
      claimHint: 'State whether a crumpling car or a rigid car is safer for the occupants, and why.',
      evidenceHint: 'Cite the stopping times and peak forces from the table.',
      reasoningHint:
        'Use $F_{avg}\\Delta t = \\Delta p$ to explain why a longer stopping time means a smaller peak force on the occupant.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
