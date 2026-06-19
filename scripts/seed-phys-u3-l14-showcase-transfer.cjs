// seed-phys-u3-l14-showcase-transfer.cjs — Unit 3 Lesson 14: showcase + transfer task (SUMMATIVE unit closer).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l14-showcase-transfer.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u3-l14-showcase-transfer',
  title: 'Showcase + Transfer Task',
  unit: 'Unit 3: Collisions & Momentum',
  order: 314,
  visible: false,
  dueDate: '2026-11-17', // PLACEHOLDER
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🎤', title: 'Showcase + Transfer Task', subtitle: 'Unit 3 · Lesson 14 — Summative' }),

    k.objectives([
      'Present your safer-crash design and defend the choices behind it',
      'Transfer the momentum and impulse model to a new collision scenario',
    ]),

    k.text(
      "This is the last lesson of the unit — and it's where everything comes together. We opened with the question of " +
      "why driving is risky and what happens when vehicles collide. Since then you've built a model of momentum, " +
      "conservation of momentum, elastic and inelastic collisions, impulse, and how safety features save lives. Today " +
      "you do two things.\\n\\n" +
      "**First, the showcase.** Present your Lesson 13 safer-crash design to the class. Be ready to explain:\\n" +
      "- **What structure** you chose (material, length, collapse pattern)\\n" +
      "- **Why** that structure — what physics idea it uses and what trade-off you accepted\\n" +
      "- **How it performed** — point to the exact simulator result that shows it passes the safety threshold\\n\\n" +
      "Keep it to about two minutes. Your job isn't to be perfect — it's to make a clear argument from evidence, the way " +
      "an engineer defends a design."
    ),

    k.evidenceUpload({
      title: 'Upload Your Design',
      instructions:
        'Upload TWO things from your Lesson 13 work: (1) a screenshot of your Crumple-Zone Designer result — the run that ' +
        'shows your design passing the safety threshold — and (2) your presentation slide. Then write a one-line summary ' +
        'of your design in the box below.',
      prompt: 'One-line summary: "My design uses ___ because ___, and it keeps the passenger safe because ___."',
    }),

    k.text(
      "**Now the transfer task.** A real model isn't one you can only recite back for car crashes. It's one you can carry " +
      "to a situation you've never studied and still make sense of. So here's a different collision: a cyclist's head " +
      "hitting the pavement.\\n\\n" +
      "In a bike crash, the rider's head can go from full speed to a stop in a very short distance. Without a helmet, " +
      "the skull and brain absorb that stop almost instantly. With a helmet, a layer of foam crushes and extends the " +
      "stopping time. The rider's head has the same mass and the same change in velocity either way — but the force on " +
      "the brain is very different."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u3-l14-helmet-impact-foam.jpg',
      alt: 'A two-panel diagram of a head hitting pavement: without a helmet the head stops almost instantly with a big force arrow; with a helmet the foam liner compresses, lengthening the stop and shrinking the force arrow.',
      caption: 'A helmet\'s foam crushes on impact, stretching out the stopping time so the same change in momentum produces a much smaller force on the brain. *(Diagram.)*',
    }),

    k.mdTable({
      lead: '**Bike Helmet Impact — What We Know**',
      headers: ['What happens', 'Without helmet', 'With certified helmet'],
      rows: [
        ['Stopping distance', 'Very small — skull stops almost instantly', 'Larger — foam crushes over several centimeters'],
        ['Stopping time', 'Very short', 'Longer'],
        ['Peak force on brain', 'Large', 'Reduced'],
        ['Energy transformation', 'Kinetic energy goes into skull/brain deformation', 'Kinetic energy goes into crushing the foam liner'],
      ],
    }),

    k.cer({
      prompt:
        'Apply your momentum and impulse model to explain WHY a bike helmet reduces injury, then propose ONE design ' +
        'change that would make a helmet even safer. Use the facts in the table above as your evidence.',
      claimHint: 'State, in one sentence, why a helmet reduces brain injury and name the one design change you would make.',
      evidenceHint: 'Cite the stopping distance, stopping time, and peak-force differences from the table.',
      reasoningHint:
        'Explain, using $F_{avg}\\Delta t = \\Delta p$, why a longer stopping time means a smaller peak force on the brain, ' +
        'and why your proposed design change would help.',
    }),

    k.teacherCheckpoint({
      id: 'phys-u3-l14-cp',
      title: 'Transfer — Teacher Score',
      prompt:
        "Mr. McCarthy reads your transfer explanation and scores it on the 3-dimensional rubric below. He is looking for " +
        "whether you correctly applied this unit's momentum and impulse ideas to a phenomenon you never studied — a " +
        "complete claim, evidence pulled from the helmet facts, and reasoning that ties force, time, and momentum change " +
        "together. This is the summative grade that closes Unit 3.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Transfer Task Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u3-l14-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
