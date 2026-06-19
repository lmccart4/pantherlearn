// seed-phys-u5-l14-make-recommendation.cjs — Unit 5 Lesson 14: transfer task — make a recommendation about radiation use (summative).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l14-make-recommendation.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u5-l14-make-recommendation',
  title: 'Make a Recommendation',
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 514,
  visible: false,
  dueDate: '2026-10-23', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🎯', title: 'Make a Recommendation', subtitle: 'Unit 5 · Lesson 14 — Summative' }),

    k.objectives([
      'Apply the wave and photon models to a new real-world decision',
      'Use evidence to recommend a safe, effective use of radiation',
      'Defend a decision using the CER format and this unit\'s physics ideas',
    ]),

    k.text(
      "This is the last lesson of Unit 5 — the transfer task. A real model is one you can carry to a new situation " +
      "and still use to make a good decision. You have studied the microwave/Bluetooth mystery, the electromagnetic " +
      "spectrum, how radiation interacts with matter, how information is encoded on waves, and how to evaluate " +
      "safety claims. Now apply all of it.",
    ),

    k.text(
      "**Scenario:** Perth Amboy High School is upgrading its wireless network. The IT team has two proposals on the " +
      "table, and the principal wants a student recommendation backed by physics. The school has a mix of old brick " +
      "walls, large windows, a central courtyard, and a budget that allows either (A) or (B), but not both.",
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u5-l14-make-recommendation-school-campus.jpg',
      alt: 'A top-down diagram of a school campus showing classrooms along corridors, a central courtyard, large windows, thick brick walls, several WiFi routers with coverage zones, and an exterior smart-meter panel.',
      caption: 'The school campus: routers must cover classrooms through thick brick walls and a courtyard, while signal passes more easily through windows. A smart meter sits on the exterior. *(Diagram.)*',
    }),

    k.mdTable({
      lead: '**School WiFi Upgrade — Two Proposals**',
      headers: ['Proposal', 'Equipment', 'Frequency', 'Coverage / data', 'Concerns raised'],
      rows: [
        ['A', 'Fewer high-power WiFi 6 access points', '2.4 GHz + 5 GHz', 'Wide coverage, moderate data', 'Some parents worry about constant RF exposure near classrooms'],
        ['B', 'Many low-power WiFi 6E access points', '6 GHz + some 5 GHz', 'Spot coverage, very high data, needs more units', 'Higher total number of transmitters, shorter range per unit'],
      ],
    }),

    k.text(
      "Your recommendation should not just pick a winner — it should explain **why** that choice makes sense for " +
      "THIS school, using ideas about frequency, wavelength, range, data capacity, building penetration, intensity, " +
      "and safety. You may also propose a hybrid if you can justify it within the budget constraint.",
    ),

    k.cer({
      prompt:
        'Recommend Proposal A, Proposal B, or a justified hybrid for the school WiFi upgrade. Defend your choice using this unit\'s physics ideas.',
      claimHint: 'State your recommendation clearly (A, B, or hybrid) and the main reason.',
      evidenceHint: 'Cite facts from the proposal table and from this unit (frequency, range, data capacity, intensity, safety).',
      reasoningHint: 'Explain how the physics connects to the school\'s specific needs (brick walls, courtyard, classroom density, parent concerns).',
    }),

    k.evidenceUpload({
      title: 'Optional: Visual Aid',
      instructions:
        'If you made a sketch, chart, or map to support your recommendation, upload it here. This is optional but can strengthen your argument.',
      prompt: 'Brief caption for your visual:',
    }),

    k.teacherCheckpoint({
      id: 'phys-u5-l14-cp',
      title: 'Transfer — Teacher Score',
      prompt:
        "Mr. McCarthy will read your recommendation and score it on the 3-dimensional rubric below. He is looking for " +
        "a clear decision, evidence pulled from the proposal and from this unit's physics, and reasoning that shows " +
        "you can apply the model to a new context. This is the summative grade that closes Unit 5.",
      weight: 15,
    }),

    k.rubric3D({
      title: 'Transfer Task Rubric (3 Dimensions)',
      linkedBlockId: 'phys-u5-l14-cp',
      totalPoints: 15,
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
