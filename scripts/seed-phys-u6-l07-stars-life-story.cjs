// seed-phys-u6-l07-stars-life-story.cjs — Unit 6 Lesson 7: A Star's Life Story.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l07-stars-life-story.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)
// IMAGE PHASE: stellar life-cycle infographic for low/medium/high mass (Gemini, JSON-first)

const lesson = {
  id: 'phys-u6-l07-stars-life-story',
  title: 'A Star\'s Life Story',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 607,
  visible: false,
  dueDate: '2026-10-07', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌌', title: 'A Star\'s Life Story', subtitle: 'Unit 6 · Lesson 7' }),

    k.objectives([
      'Sequence the stages of a star\'s life from nebula to stellar remnant',
      'Explain how a star\'s mass determines its fate',
      'Connect the life-cycle stages to positions on the H-R diagram',
    ]),

    k.text(
      "Stars are born, live, and die. The whole story begins in a cold cloud of gas and dust called a **nebula**. Gravity " +
      "pulls the cloud together, heating it until fusion begins. For most of a star's life, it fuses hydrogen on the " +
      "**main sequence**. What happens next depends almost entirely on **mass**."
    ),

    k.callout({
      style: 'info',
      icon: '🧭',
      title: 'Mass Determines Fate',
      content: "- **Low-mass stars** (like the Sun): nebula → protostar → main sequence → red giant → planetary nebula → white dwarf\n" +
               "- **High-mass stars**: nebula → protostar → main sequence → red supergiant → supernova → neutron star or black hole",
    }),

    k.text(
      "Massive stars burn through their fuel faster, so they live shorter but more spectacular lives. When a massive star " +
      "runs out of fuel, its core collapses and the outer layers explode as a **supernova**. The glowing debris we saw in " +
      "the 'new star' records is exactly that kind of explosion."
    ),

    // IMAGE PHASE: three life-cycle tracks side by side with H-R positions labeled (Gemini, JSON-first)

    k.mdTable({
      lead: '**Life-cycle stages and what happens in each**',
      headers: ['Stage', 'What is happening', 'H-R position hint'],
      rows: [
        ['Nebula', 'Cloud of gas and dust collapses under gravity', 'Not plotted (too cool)'],
        ['Protostar', 'Heating up; fusion has not yet begun', 'Approaching main sequence'],
        ['Main sequence', 'Stable hydrogen fusion in the core', 'Diagonal band'],
        ['Red giant / supergiant', 'Core contracts; outer layers expand and cool', 'Upper right'],
        ['White dwarf / neutron star / black hole', 'Fusion stops; remnant cools or collapses', 'Lower left / off diagram'],
      ],
      note: 'A "new star" visible to the naked eye is usually the supernova stage of a high-mass star.',
    }),

    k.embed({
      url: `${TOOLS_BASE}/star-lifecycle-model.html`,
      caption: '🌠 **Star Life-Cycle Model** — Sequence the stages for low-, medium-, and high-mass stars and match each mass range to its final fate.',
      height: 750,
    }),

    k.mc({
      prompt: 'Which factor has the biggest influence on how a star evolves and what remnant it leaves behind?',
      options: [
        'The star\'s color',
        'The star\'s distance from Earth',
        'The star\'s mass',
        'The star\'s age in human years',
      ],
      correctIndex: 2,
      explanation: 'A star\'s mass determines how long it fuses, how hot it burns, and whether it ends as a white dwarf, neutron star, or black hole.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'A "new star" suddenly appears and then fades, leaving a glowing cloud. Which life-cycle event best explains this?',
      options: [
        'A low-mass star becoming a white dwarf',
        'A high-mass star exploding as a supernova',
        'A protostar first joining the main sequence',
        'A red giant cooling into a nebula',
      ],
      correctIndex: 1,
      explanation: 'A sudden brightening followed by a fading remnant cloud matches a supernova: the explosive death of a high-mass star.',
      difficulty: 'apply',
    }),

    k.cer({
      prompt: 'How does mass determine whether a star ends as a white dwarf, neutron star, or black hole?',
      claimHint: 'State the relationship between mass and final remnant.',
      evidenceHint: 'Use the life-cycle stages of low-mass and high-mass stars.',
      reasoningHint: 'Explain why higher mass leads to a more violent collapse.',
    }),

    k.shortAnswer({
      prompt: 'The Sun is a low- to medium-mass star. Predict its final state and explain why it will not become a black hole.',
      placeholder: 'The Sun will end as… because…',
      difficulty: 'apply',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
