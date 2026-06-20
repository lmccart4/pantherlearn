// seed-phys-u4-l05-craters-tell-a-story.cjs — Unit 4 Lesson 5: impact crater simulator.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l05-craters-tell-a-story.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u4-l05-craters-tell-a-story',
  title: 'Craters Tell a Story',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 405,
  visible: false,
  dueDate: '2026-10-23', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '☄️', title: 'Craters Tell a Story', subtitle: 'Unit 4 · Lesson 5' }),

    k.objectives([
      'Relate impactor mass and speed to crater size',
      'Use a simulation to test how kinetic energy shapes a crater',
      'Connect crater data to real impact events on Earth',
    ]),

    k.text(
      "Earth has been hit many times. **Meteor Crater in Arizona** is about **1,200 meters across** and was carved roughly " +
      "50,000 years ago by an iron impactor only about **50 meters wide**. Much larger impacts have happened too — the " +
      "Chicxulub impact, linked to the extinction of the non-avian dinosaurs, left a crater about **180 kilometers " +
      "across**. The size of a crater is a clue to the energy of the impact."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u4-l05-craters-tell-a-story-meteor-crater.jpg',
      alt: 'Aerial view of Barringer Meteor Crater in Arizona, a round bowl-shaped crater about 1.2 km wide with a raised rim in flat desert.',
      caption: 'Meteor Crater, Arizona — about 1.2 km across, carved ~50,000 years ago by an iron impactor only ~50 m wide. *(Illustration.)*',
    }),

    k.text(
      "**What controls crater size?**\n\n" +
      "Kinetic energy depends on both mass and speed: $KE = \\frac{1}{2}mv^2$. Because speed is squared, a small change in " +
      "speed has a much bigger effect than the same change in mass. The surface material matters too — a soft surface " +
      "makes a deeper, simpler crater than solid rock."
    ),

    k.callout({
      style: 'info',
      icon: '📦',
      title: 'Define the System',
      content:
        "**System = the impactor + the patch of ground it hits.**\n\n" +
        "Energy flows *into* the system as the impactor's kinetic energy and *out of* the system as kinetic energy of " +
        "ejected debris, thermal energy, sound, and seismic waves. The atmosphere is part of the surroundings.",
    }),

    k.embed({
      url: `${TOOLS_BASE}/impact-crater-sim.html`,
      caption: '💥 **Impact Crater Simulator** — Vary the impactor’s mass, speed, and surface material. Predict the crater diameter, then run the simulation and compare.',
      height: 750,
    }),

    k.mc({
      prompt: 'In the simulator, which single change usually produces the biggest increase in crater diameter?',
      options: [
        'Doubling the impactor’s mass',
        'Doubling the impactor’s speed',
        'Halving the impactor’s mass',
        'Making the target surface rockier',
      ],
      correctIndex: 1,
      explanation:
        'Kinetic energy depends on speed squared ($v^2$), so doubling speed quadruples KE. That larger energy deposit ' +
        'generally makes a wider crater than doubling mass, which only doubles KE.',
      difficulty: 'apply',
    }),

    k.dataTable({
      title: 'Crater Predictions',
      preset: 'numeric',
      rows: [
        { key: 'run1', label: 'Run 1' },
        { key: 'run2', label: 'Run 2' },
        { key: 'run3', label: 'Run 3' },
      ],
      columns: [
        { key: 'mass', label: 'Mass (kg)' },
        { key: 'speed', label: 'Speed (km/s)' },
        { key: 'predicted', label: 'Predicted diameter (m)' },
        { key: 'observed', label: 'Observed diameter (m)' },
      ],
    }),

    k.cer({
      prompt:
        'How does the size of an impact crater help scientists figure out what hit Earth and how fast it was moving?',
      claimHint: 'State the relationship between impact energy and crater size.',
      evidenceHint: 'Use at least one prediction from the simulator and one real crater example (Arizona or Chicxulub).',
      reasoningHint: 'Explain why crater diameter is a reliable clue to the original kinetic energy of the impactor.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
