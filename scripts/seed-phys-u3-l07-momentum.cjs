// seed-phys-u3-l07-momentum.cjs — Unit 3 Lesson 7: momentum as mass × velocity.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l07-momentum.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u3-l07-momentum',
  title: 'Momentum',
  unit: 'Unit 3: Collisions & Momentum',
  order: 307,
  visible: false,
  dueDate: '2026-10-22', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🎯', title: 'Momentum', subtitle: 'Unit 3 · Lesson 7' }),

    k.objectives([
      'Define momentum as mass × velocity and explain why it is a vector',
      'Predict the outcome of a 1D collision using momentum ideas',
      'Use the Collision Simulator to test predictions and revise them',
    ]),

    k.text(
      "So far we've talked about forces, mass, and acceleration. Now we add a new idea that ties them together in a " +
      "collision: **momentum**. Momentum is a measure of how much \"motion\" an object has, and it depends on both mass " +
      "and velocity."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Momentum',
      content:
        "$$\\vec{p} = m\\vec{v}$$\n\n" +
        "**Momentum** ($\\vec{p}$) is the product of an object's **mass** ($m$) and its **velocity** ($\\vec{v}$). " +
        "Because velocity has direction, momentum is a **vector**. Two objects can have the same speed but opposite " +
        "momenta if they move in opposite directions.",
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u3-l07-momentum-bars.jpg',
      alt: 'A heavy slow truck and a light fast car on a road, each with a velocity arrow and a momentum bar beneath it; the two momentum bars are equal in length, showing equal momentum from different mass-velocity combinations.',
      caption: 'A heavy, slow truck and a light, fast car can carry the *same* momentum — because $p = mv$ depends on both mass and velocity. *(Diagram.)*',
    }),

    k.text(
      "**Define the system.** In this lesson, the system is two vehicles on a straight track. We will ignore friction " +
      "and outside forces so the system is **isolated**. In an isolated system, the total momentum before a collision " +
      "equals the total momentum after — a rule we will test today."
    ),

    k.embed({
      url: `${TOOLS_BASE}/collision-sim-1d.html`,
      caption: '⚡ **1D Collision Simulator** — Set the masses and velocities, predict the outcome, and check your prediction. Watch the momentum bars.',
      height: 750,
    }),

    k.mc({
      prompt: 'Truck A has a mass of 2,000 kg and speed 10 m/s. Truck B has a mass of 1,000 kg and speed 20 m/s. Which has more momentum?',
      options: [
        'Truck A, because it has more mass',
        'Truck B, because it has more speed',
        'They have the same momentum',
        'Not enough information because directions are not given',
      ],
      correctIndex: 2,
      explanation:
        'Momentum is $p = mv$. Truck A: $2{,}000 \\times 10 = 20{,}000$ kg·m/s. Truck B: $1{,}000 \\times 20 = 20{,}000$ kg·m/s. ' +
        'The magnitudes are equal.',
      difficulty: 'apply',
    }),

    k.mc({
      prompt: 'A 1,500 kg car moves east at 12 m/s. A second identical car moves west at 12 m/s. How do their momenta compare?',
      options: [
        'They are equal because the cars are identical',
        'The eastbound car has more momentum because east is positive',
        'Momentum has no direction, so they are the same',
        'They have equal magnitude but opposite direction',
      ],
      correctIndex: 3,
      explanation:
        'Momentum is a vector. Equal masses and equal speeds give equal magnitudes, but opposite velocities give ' +
        'opposite momenta.',
      difficulty: 'understand',
    }),

    k.dataTable({
      title: 'Predict & Check Collisions',
      preset: 'numeric',
      rows: [
        { key: 'trial_1', label: 'Trial 1: same mass, same speed, head-on' },
        { key: 'trial_2', label: 'Trial 2: heavy slow vs. light fast' },
        { key: 'trial_3', label: 'Trial 3: one stationary, one moving' },
      ],
      columns: [
        { key: 'predicted_final_speed', label: 'Your predicted final speed(s) (m/s)' },
        { key: 'predicted_direction', label: 'Your predicted direction(s)' },
        { key: 'sim_final_speed', label: 'Simulator final speed(s) (m/s)' },
        { key: 'sim_direction', label: 'Simulator direction(s)' },
      ],
    }),

    k.shortAnswer({
      prompt:
        "**What did you notice about total momentum?**\n\nAfter running several trials, describe any pattern you see " +
        "in the total momentum before and after the collision.",
      placeholder: 'When I added the momentum of both vehicles before and after…',
      difficulty: 'analyze',
    }),

    k.cer({
      prompt:
        'Use momentum to explain what happens in a head-on collision between a heavy, slow truck and a light, fast car.',
      claimHint: 'State which way the combined vehicles move after the collision, or whether they stop.',
      evidenceHint: 'Use the momentum equation and compare $m_{truck}v_{truck}$ and $m_{car}v_{car}$.',
      reasoningHint: 'Explain how the direction and size of each vehicle\'s momentum determines the outcome.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
