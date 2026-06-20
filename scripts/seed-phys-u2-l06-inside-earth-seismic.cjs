// seed-phys-u2-l06-inside-earth-seismic.cjs — Unit 2 Lesson 6: Earth's layered interior from seismic waves.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u2-l06-inside-earth-seismic.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u2-l06-inside-earth-seismic',
  title: 'Inside Earth: What We Can\'t See',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 206,
  visible: false,
  dueDate: '2026-10-12', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'Inside Earth: What We Can\'t See', subtitle: 'Unit 2 · Lesson 6' }),

    k.objectives([
      'Use seismic wave data to infer Earth\'s layered interior',
      'Identify the crust, mantle, outer core, and inner core from evidence',
      'Connect Earth\'s internal structure to the forces that shape the surface',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u2-l06-inside-earth-layers-seismic-paths.jpg',
      alt: 'A cutaway of Earth showing four layers from outside to center: crust, mantle, liquid outer core, and solid inner core, with P-wave paths passing through all layers and S-wave paths stopping at the liquid outer core.',
      caption: 'Earth\'s four layers from the outside in: crust, mantle, outer core, inner core. S-waves stop at the liquid outer core. *(Diagram.)*',
    }),

    k.text(
      "We can't drill to the center of Earth. The deepest hole humans have ever dug is only about **12 kilometers** — barely " +
      "a scratch on the surface. So how do we know what's inside?\n\n" +
      "The answer is **seismic waves**. When an earthquake happens, energy travels through the planet as waves. Some waves " +
      "move through solids and liquids, and some change speed depending on the temperature, pressure, and material they pass " +
      "through. By studying where waves arrive and how fast they travel, scientists have mapped the layers inside Earth."
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "In this lesson, the **system** is Earth's interior from the crust all the way to the center. The **surroundings** " +
        "are the seismic waves entering from earthquakes and the detectors on the surface that record them. We use energy " +
        "transfer across the system boundary to learn what we cannot observe directly.",
    }),

    k.text(
      "**What seismic tomography shows**\n\n" +
      "Seismic tomography is like a CT scan for the planet. Slow waves usually mean hot, soft material. Fast waves usually " +
      "mean cold, rigid material. This lets scientists build a 3-D model of Earth's interior."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u2-l06-inside-earth-tomography-wavespeed.jpg',
      alt: 'A seismic tomography slice through Earth colored by wave speed, with a blue-to-red color scale showing fast cold rigid rock in blue and slow hot soft rock in red, including a rising hot plume.',
      caption: 'Seismic tomography colors Earth by wave speed: blue = fast (cold, rigid), red = slow (hot, soft). *(Diagram.)*',
    }),

    k.mdTable({
      lead: '**Earth\'s major layers** — what seismic waves reveal.',
      headers: ['Layer', 'State', 'Wave behavior', 'Why it matters'],
      rows: [
        ['Crust', 'Solid', 'Slower waves in thin, brittle rock; speed jumps at the Moho', 'Thin, brittle, where we live'],
        ['Mantle', 'Solid (but slow-flowing)', 'Speed varies with temperature', 'Convection drives plate motion'],
        ['Outer core', 'Liquid', 'S-waves do not pass through', 'Creates Earth\'s magnetic field'],
        ['Inner core', 'Solid', 'Very fast waves', 'Hot, dense, mostly iron'],
      ],
      note: 'The boundary between layers is detected by sudden changes in wave speed and direction.',
    }),

    k.embed({
      url: `${TOOLS_BASE}/seismic-tomography.html`,
      caption: '🔍 **Seismic Tomography Explorer** — Explore wave-speed data through Earth. Identify each layer and explain what the wave behavior tells you about its state.',
      height: 750,
    }),

    k.mc({
      prompt: 'A region deep inside Earth blocks S-waves completely but allows P-waves through. What can scientists conclude?',
      options: [
        'The region is solid iron with very high temperature',
        'The region is the crust, where waves move slowest',
        'The region has no mass and does not affect seismic waves',
        'The region is liquid, because S-waves cannot travel through it',
      ],
      correctIndex: 3,
      explanation:
        'S-waves are shear waves and cannot travel through liquids. A region that blocks S-waves but transmits P-waves is ' +
        'therefore in a liquid state. This is how scientists identified Earth\'s liquid outer core.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**Apply the evidence.** Tomography shows hot mantle rock rising beneath Afar and cooler rock sinking nearby. " +
        "How does this evidence connect to the forces that cracked the surface?",
      placeholder: 'Hot mantle rising…',
      difficulty: 'analyze',
    }),

    k.cer({
      prompt:
        'How do we know Earth has layers if we have never directly sampled most of them?',
      claimHint: 'State what seismic wave data reveal about Earth\'s interior.',
      evidenceHint: 'Use one observation from the Seismic Tomography Explorer or the table above.',
      reasoningHint: 'Explain why wave speed and wave type let scientists infer material and state.',
    }),

    k.externalLink({
      icon: '🌐',
      title: 'IRIS — Seismic Waves and Earth\'s Interior',
      description: 'Interactive resources on how seismic waves reveal the structure inside Earth.',
      url: 'https://www.iris.edu/hq/inclass/search?phrase=seismic%20waves',
      buttonLabel: 'Explore',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
