// seed-phys-u3-l10-impulse.cjs — Unit 3 Lesson 10: Impulse (force, time, and momentum change).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l10-impulse.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u3-l10-impulse',
  title: 'Impulse',
  unit: 'Unit 3: Collisions & Momentum',
  order: 310,
  visible: false,
  dueDate: '2026-11-11', // PLACEHOLDER
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⏱️', title: 'Impulse', subtitle: 'Unit 3 · Lesson 10' }),

    k.objectives([
      'Relate impulse to change in momentum: $J = F_{avg}\\Delta t = \\Delta p$',
      'Explain why the same momentum change can produce very different peak forces',
      'Connect longer collision times to lower peak force and safer vehicle design',
    ]),

    k.text(
      "A crash is a transfer of momentum. But how **violent** it feels depends on more than just how much momentum changes. " +
      "It depends on **how fast** that change happens.\n\n" +
      "Think about catching a water balloon. If you catch it with stiff hands, it stops almost instantly — and it bursts. " +
      "If you pull your hands back as you catch it, the same total stop takes longer, the peak force is smaller, and the " +
      "balloon might survive. The change in momentum is the same in both cases; what changed is the **time** over which " +
      "that change happened."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Impulse',
      content:
        "**Impulse** is the product of the average net force and the time interval over which it acts:\n\n" +
        "$$J = F_{avg}\\Delta t$$\n\n" +
        "The impulse-momentum theorem says impulse equals the change in momentum of the system:\n\n" +
        "$$F_{avg}\\Delta t = \\Delta p = m\\Delta v$$\n\n" +
        "For the **same momentum change**, a **longer collision time** means a **smaller average force**.",
    }),

    k.text(
      "In a car crash, the total change in momentum of the passenger is fixed by the speed and mass. But car designers " +
      "can change the **time** over which the passenger slows down. A stiff, rigid front end stops the car almost " +
      "instantly, producing a huge peak force on the people inside. A **crumple zone** collapses in a controlled way, " +
      "stretching the same momentum change over a longer time and reducing the peak force that reaches the passenger cell."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u3-l10-impulse-force-time-graph.jpg',
      alt: 'A force-versus-time graph with two curves: a tall narrow peak labeled stiff collision and a shorter wider hump labeled crumple collision, both enclosing the same area under the curve.',
      caption: 'Both collisions have the same impulse (equal area = equal $\\Delta p$), but the crumpling collision spreads it over more time, so its peak force is much lower. *(Diagram.)*',
    }),

    k.embed({
      url: `${TOOLS_BASE}/impulse-crumple-explorer.html`,
      caption:
        '🔧 **Impulse & Crumple-Zone Explorer** — Keep the car’s speed and mass the same, but change how long the front ' +
        'end takes to crumple. Watch how a longer collision time lowers the peak force on the passenger cell.',
      height: 800,
    }),

    k.mc({
      prompt:
        'A car crashes into a wall. In Test A the car has a stiff front end and stops in $0.05\\text{ s}$. In Test B the ' +
        'same car has a crumple zone and stops in $0.20\\text{ s}$. The change in momentum of the car is the same in both ' +
        'tests. How does the average force in Test B compare to Test A?',
      options: [
        'Test B has 4 times the average force of Test A.',
        'Test B has the same average force as Test A.',
        'Test B has one-fourth the average force of Test A.',
        'Test B has one-half the average force of Test A.',
      ],
      correctIndex: 2,
      explanation:
        'Impulse equals change in momentum: $F_{avg}\\Delta t = \\Delta p$. For the same $\\Delta p$, if $\\Delta t$ is ' +
        'multiplied by 4 (from 0.05 s to 0.20 s), $F_{avg}$ is divided by 4. This is why crumple zones save lives.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        '**Name two safety features in a modern vehicle that intentionally increase collision time to reduce peak force. ' +
        'For each one, explain what part of the body or vehicle it protects and how it extends $\\Delta t$.**',
      placeholder: 'Feature 1: …\n\nFeature 2: …',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Claim whether a longer collision time makes a crash safer for the people inside, using the impulse-momentum theorem.',
      claimHint: 'State whether increasing collision time increases, decreases, or does not change peak force on the passenger.',
      evidenceHint: 'Use the relationship $F_{avg}\\Delta t = \\Delta p$ and explain what is held constant.',
      reasoningHint: 'Connect the smaller peak force to reduced injury risk in a real car crash.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
