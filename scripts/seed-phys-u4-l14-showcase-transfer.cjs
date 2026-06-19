// seed-phys-u4-l14-showcase-transfer.cjs — Unit 4 Lesson 14: showcase + transfer task (SUMMATIVE unit closer).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l14-showcase-transfer.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u4-l14-showcase-transfer',
  title: 'Showcase + Transfer Task',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 414,
  visible: false,
  dueDate: '2026-10-23', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🎤', title: 'Showcase + Transfer Task', subtitle: 'Unit 4 · Lesson 14 — Summative' }),

    k.objectives([
      'Present your asteroid-deflection design and defend the choices behind it',
      'Transfer the gravity, orbits, and energy model to a new impact phenomenon',
    ]),

    k.text(
      "This is the last lesson of the unit — and it's where everything comes together. We opened with a fireball over " +
      "Chelyabinsk and the question of how collisions with space objects have changed Earth, past and future. Since then " +
      "you've built a model of gravity, orbital motion, Kepler\'s laws, gravitational energy, near-Earth-object tracking, " +
      "and asteroid deflection. Today you do two things.\n\n" +
      "**First, the showcase.** Present your Lesson 13 deflection design to the class. Be ready to explain:\n" +
      "- **What mission type** you chose (kinetic impactor, gravity tractor, nuclear standoff)\n" +
      "- **Why** that mission — what physics idea it uses and what trade-off you accepted\n" +
      "- **How it performed** — point to the exact simulator result that shows the asteroid missing Earth\n\n" +
      "Keep it to about two minutes. Your job isn't to be perfect — it's to make a clear argument from evidence, the way " +
      "an engineer defends a design."
    ),

    k.evidenceUpload({
      title: 'Upload Your Design',
      instructions:
        'Upload TWO things from your Lesson 13 work: (1) a screenshot of your Orbit / Gravity Simulator result showing the ' +
        'asteroid missing Earth, and (2) your presentation slide. Then write a one-line summary of your design below.',
      prompt: 'One-line summary: "My mission uses ___ because ___, and it deflects the asteroid because ___."',
    }),

    k.text(
      "**Now the transfer task.** A real model isn't one you can only recite back for Chelyabinsk or a future asteroid. " +
      "It's one you can carry to a situation you've never studied and still make sense of. So here's a different impact: " +
      "**the Chicxulub impact**, 66 million years ago.\n\n" +
      "A rock roughly 10–15 kilometers across struck Earth near the Yucatán Peninsula. The impact released enormous energy, " +
      "threw debris into the atmosphere, and is linked to a mass extinction that included most non-avian dinosaurs. You " +
      "weren't there to measure it. That's the point. Use your model to explain what happened."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u4-l14-showcase-transfer-chicxulub-impact.jpg',
      alt: 'Artist’s rendering of the Chicxulub impact: a massive asteroid striking a shallow sea, erupting a towering ejecta plume and spreading a dark dust veil across a prehistoric Earth.',
      caption: 'The Chicxulub impact 66 million years ago — a 10–15 km asteroid whose ejecta plume and global dust veil are linked to the dinosaur extinction. *(Illustration.)*',
    }),

    k.mdTable({
      lead: '**Chicxulub impact — what we know**',
      headers: ['Feature', 'Evidence'],
      rows: [
        ['Crater size', 'Roughly 150 km wide, buried under Yucatán Peninsula sediments'],
        ['Impactor size', 'Estimated 10–15 km diameter from crater modeling'],
        ['Energy', 'Roughly 100 million megatons TNT, far larger than any human-made explosion'],
        ['Global effects', 'Worldwide iridium layer, soot, shocked quartz, mass-extinction fossil record'],
        ['Timing', 'Dates to about 66 million years ago, matching the K-Pg boundary'],
      ],
      note: 'Data: scientific consensus from geologic and paleontological evidence.',
    }),

    k.cer({
      prompt:
        'Apply your gravity, orbits, and energy model to explain **WHY the Chicxulub impact was so destructive**, even ' +
        'though the asteroid was only 10–15 km across. Use the evidence in the table.',
      claimHint: 'State why a relatively small object caused global damage.',
      evidenceHint: 'Cite the energy estimate, impactor size, and at least one global effect from the table.',
      reasoningHint:
        'Explain, using kinetic energy ($KE = \\frac{1}{2}mv^2$) and the energy transfer from the asteroid to Earth\'s ' +
        'atmosphere and surface, why the impact had worldwide consequences.',
    }),

    k.teacherCheckpoint({
      id: 'phys-u4-l14-cp',
      title: 'Transfer — Teacher Score',
      prompt:
        "Mr. McCarthy reads your transfer explanation and scores it on the 3-dimensional rubric below. He is looking for " +
        "whether you correctly applied this unit's gravity, orbits, and energy ideas to a phenomenon you never studied — a " +
        "complete claim, evidence pulled from the Chicxulub facts, and reasoning that ties mass, speed, energy transfer, and " +
        "global effects together. This is the summative grade that closes Unit 4.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Transfer Task Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u4-l14-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
