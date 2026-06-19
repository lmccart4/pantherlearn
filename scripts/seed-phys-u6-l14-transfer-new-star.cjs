// seed-phys-u6-l14-transfer-new-star.cjs — Unit 6 Lesson 14: Transfer Task: A New "New Star" (SUMMATIVE).
// Standards: HS-ESS1-1, HS-ESS1-2, HS-ESS1-3, HS-PS1-8. Apply the unit model to a fresh observation/media claim.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l14-transfer-new-star.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u6-l14-transfer-new-star',
  title: 'Transfer Task: A New "New Star"',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 614,
  visible: false,
  dueDate: '2027-05-26', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌟', title: 'Transfer Task: A New "New Star"', subtitle: 'Unit 6 · Lesson 14 — Summative' }),

    k.objectives([
      'Apply the unit model to a new astronomical observation',
      'Evaluate a sensationalized media claim using evidence from stars, spectra, and nucleosynthesis',
      'Communicate a reasoned conclusion about what is actually happening',
    ]),

    k.text(
      "This is the final lesson of Unit 6 — and the real test of whether your model is useful. A genuine scientific model " +
      "isn't just one you can repeat back. It's one you can carry to a new situation and still make sense of. Today you " +
      "apply everything you've built to a brand-new 'new star.'"
    ),

    k.callout({
      style: 'warning',
      icon: '📰',
      title: 'The Scenario',
      content:
        "Astronomers have announced that a star in a nearby galaxy has suddenly brightened by thousands of times. A popular " +
        "news headline reads: **'MYSTERIOUS STAR EXPLOSION COULD WIPE OUT EARTH, SCIENTISTS WARN.'**\n\n" +
        "You are the science advisor. Your job is to use the unit's model to figure out what is most likely happening, " +
        "whether the headline is justified, and what evidence would settle the question.",
    }),

    k.mdTable({
      lead: '**Data From the Astronomers\' Announcement**',
      headers: ['Observation', 'What was reported'],
      rows: [
        ['Location', 'A nearby galaxy roughly 2 million light-years away'],
        ['Event', 'A star that was faint suddenly became one of the brightest objects in the galaxy'],
        ['Spectrum', 'Strong emission lines of hydrogen, helium, oxygen, and iron'],
        ['Duration', 'The object brightened over days and has stayed bright for weeks'],
        ['Distance', 'The galaxy is far outside our Milky Way; light takes ~2 million years to reach us'],
      ],
      note: 'Scenario is realistic but simplified for classroom use.',
    }),

    k.text(
      "Use the model you've built. What kind of event could make a star suddenly brighten? What do the spectral lines tell " +
      "you about what the star was made of and what happened to it? How does distance change the threat level? What " +
      "additional evidence would you want to collect?"
    ),

    k.shortAnswer({
      prompt:
        'Before you write your full evaluation, brainstorm here. List at least **three** pieces of evidence or reasoning from ' +
        'this unit that help you interpret the observation.',
      placeholder: '1. The spectrum shows… because…\n2. A sudden brightening could be…\n3. Distance matters because…',
      difficulty: 'apply',
    }),

    k.evidenceUpload({
      title: 'Upload Your Model Sketch',
      instructions:
        'Sketch a diagram that shows what you think is happening inside or around the star. Label the evidence from the ' +
        'table and the processes involved (fusion, collapse, explosion, element formation, etc.).',
      prompt: 'Caption: "This diagram shows…"',
    }),

    k.cer({
      prompt:
        'Write a science-advisory response to the headline. **Should people panic?** Use the data table and the unit model to ' +
        'justify your conclusion.',
      claimHint: 'State clearly what you think is happening and whether the headline is justified.',
      evidenceHint:
        'Cite specific evidence: spectral lines, brightness change, distance, stellar life cycle, nucleosynthesis, or anything ' +
        'else from the unit.',
      reasoningHint:
        'Explain how the evidence supports your claim. Address why distance matters and what additional observations would ' +
        'strengthen or weaken your conclusion.',
    }),

    k.teacherCheckpoint({
      id: 'phys-u6-l14-cp',
      title: 'Transfer — Teacher Score',
      prompt:
        "Mr. McCarthy reads your evaluation, diagram, and reasoning, then scores them on the 3-dimensional rubric below. He " +
        "is looking for whether you correctly applied this unit's science ideas to a phenomenon you never studied — a clear " +
        "claim, evidence pulled from the scenario, and reasoning that ties stellar evolution, spectra, and nucleosynthesis " +
        "together. This is the summative grade that closes Unit 6.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Transfer Task Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u6-l14-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
