// seed-phys-u3-l04-force-mass-changing-motion.cjs — Unit 3 Lesson 4: net force, mass, and acceleration.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l04-force-mass-changing-motion.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)
// IMAGE PHASE: free-body diagram showing net force on a cart of different masses (Gemini, JSON-first).

const lesson = {
  id: 'phys-u3-l04-force-mass-changing-motion',
  title: 'Force, Mass & Changing Motion',
  unit: 'Unit 3: Collisions & Momentum',
  order: 304,
  visible: false,
  dueDate: '2026-10-16', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '💪', title: 'Force, Mass & Changing Motion', subtitle: 'Unit 3 · Lesson 4' }),

    k.objectives([
      'Relate net force, mass, and acceleration using Newton\'s second law',
      'Predict how a heavier vehicle responds to the same braking force',
      'Connect force-and-motion ideas to real driving situations',
    ]),

    k.text(
      "We've seen that speed and reaction time control how far a car travels before it stops. But once the brakes are " +
      "applied, **physics** takes over. The brake pads push backward on the wheels, the tires push backward on the road, " +
      "and the car slows down.\n\n" +
      "That slowing is an **acceleration** — a change in velocity. Newton's second law tells us exactly how much " +
      "acceleration we get for a given push:"
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Newton\'s Second Law',
      content:
        "$$a = \\frac{F_{net}}{m}$$\n\n" +
        "The **acceleration** of an object is directly proportional to the **net force** on it and inversely proportional " +
        "to its **mass**.",
    }),

    k.text(
      "**Define the system.** In this lesson, the system is a single vehicle plus the road it pushes against. The net force " +
      "on the system comes from the brakes (and from friction). If we keep the braking force the same but increase the " +
      "mass of the vehicle, the acceleration gets smaller — meaning the vehicle takes longer to stop."
    ),

    k.embed({
      url: `${TOOLS_BASE}/force-and-motion-basics.html`,
      caption: '⚙️ **PhET Force and Motion: Basics** — Explore how force, mass, and acceleration are related. Stop the cart and compare braking distances.',
      height: 750,
    }),

    k.mc({
      prompt: 'You push a small cart and a large cart with the **same net force**. How does their acceleration compare?',
      options: [
        'Both carts accelerate equally because the force is the same',
        'The small cart accelerates more because it has less mass',
        'The large cart accelerates more because it has more inertia',
        'Neither cart accelerates if there is no friction',
      ],
      correctIndex: 1,
      explanation:
        'From $a = F_{net}/m$, acceleration is inversely proportional to mass. With the same net force, the less-massive ' +
        'object has the larger acceleration.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'A fully loaded truck and an empty car brake with the **same maximum force**. Which takes longer to stop from the same speed?',
      options: [
        'The truck, because it has more mass and therefore less acceleration',
        'The car, because it has more inertia',
        'They stop in the same distance if the brakes are equally good',
        'The truck, because heavier objects naturally move faster',
      ],
      correctIndex: 0,
      explanation:
        'With the same braking force, the truck\'s larger mass gives it a smaller (negative) acceleration, so it takes ' +
        'more time and more distance to come to rest.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        "**Define the system.** For the truck-and-car braking comparison above, name the system you are analyzing and " +
        "name one object outside the system that exerts a force on it.",
      placeholder: 'System: …\nExternal object: …',
      difficulty: 'understand',
    }),

    k.cer({
      prompt:
        'Explain why a heavy SUV takes longer to stop than a small sedan, even when both drivers brake as hard as possible.',
      claimHint: 'State how mass affects acceleration when net force is the same.',
      evidenceHint: 'Cite the relationship $a = F_{net}/m$ and explain what happens to acceleration when mass increases.',
      reasoningHint: 'Connect smaller acceleration to a longer stopping distance.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
