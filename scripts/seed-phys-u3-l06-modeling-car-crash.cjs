// seed-phys-u3-l06-modeling-car-crash.cjs — Unit 3 Lesson 6: before/during/after models of a crash.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l06-modeling-car-crash.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u3-l06-modeling-car-crash',
  title: 'Modeling a Car Crash',
  unit: 'Unit 3: Collisions & Momentum',
  order: 306,
  visible: false,
  dueDate: '2026-10-21', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '✏️', title: 'Modeling a Car Crash', subtitle: 'Unit 3 · Lesson 6' }),

    k.objectives([
      'Draw before/during/after models of a collision',
      'Identify the system, forces, and changes in motion in a crash model',
      'Revise an initial model using evidence from force-and-motion ideas',
    ]),

    k.text(
      "A good model doesn't just describe what happened — it shows *why* it happened. Today you will build a " +
      "**before/during/after model** of a car crash, labeling the system, the forces, and the changes in motion at " +
      "each stage."
    ),

    k.callout({
      style: 'info',
      icon: '📐',
      title: 'Model Checklist',
      content:
        "Every strong crash model includes:\n" +
        "- **System boundary** — what objects are inside the system?\n" +
        "- **Forces** — label external forces on the system with arrows\n" +
        "- **Motion** — show velocity before, during, and after\n" +
        "- **Changes** — what changed because of the forces?",
    }),

    k.text(
      "**Scenario:** A small car is stopped at a red light. A large SUV rear-ends it. Both vehicles crumple and then " +
      "move forward together.\n\n" +
      "**Define the system.** For your first model, let the system be the small car. For your second model, let the " +
      "system be both vehicles together. Compare what is the same and what changes."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u3-l06-modeling-car-crash-scaffold.jpg',
      alt: 'A blank three-panel worksheet template labeled Before, During, and After, with empty boxes and a legend for system, force, and velocity for students to fill in.',
      caption: 'Use this before/during/after layout for your models — label the system boundary, the forces, and the velocity in each panel. *(Diagram.)*',
    }),

    k.sketch({
      title: 'Model 1 — Small Car as System',
      instructions:
        'Draw the small car before, during, and after the crash. Label the system boundary, the external forces acting on ' +
        'the car, and the car\'s velocity at each stage.',
      prompt: 'Remember: the SUV is outside this system, so the force from the SUV is external.',
    }),

    k.sketch({
      title: 'Model 2 — Both Vehicles as System',
      instructions:
        'Draw both vehicles together before, during, and after the crash. Label the system boundary, any external forces, ' +
        'and the velocity of the combined system.',
      prompt: 'Now the SUV-on-car and car-on-SUV forces are inside the system. What external force slows the pair down?',
    }),

    k.mc({
      prompt: 'When the system is both vehicles, what happens to the forces the two vehicles exert on each other?',
      options: [
        'They add together and double the acceleration',
        'They become internal forces that cancel in the system model',
        'They disappear because the vehicles stick together',
        'They become the only external forces left',
      ],
      correctIndex: 1,
      explanation:
        'Inside a two-vehicle system, the A-on-B and B-on-A forces are equal and opposite, so they sum to zero for the ' +
        'system as a whole. They do not change the total momentum of the system.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**Compare your models.** What is different about the forces when the small car is the system vs. when both " +
        "vehicles are the system? What stays the same?",
      placeholder: 'When the system is just the car…\nWhen the system is both vehicles…',
      difficulty: 'analyze',
    }),

    k.cer({
      prompt:
        'Use your models to explain why the small car is pushed forward after being rear-ended, even though the forces between the two vehicles are equal.',
      claimHint: 'State what happens to the small car\'s motion and why.',
      evidenceHint: 'Reference forces, mass, and acceleration from your models.',
      reasoningHint: 'Explain how the same force pair produces different effects on each vehicle.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
