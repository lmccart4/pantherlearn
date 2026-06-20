// seed-phys-u3-l08-conservation-momentum.cjs — Unit 3 Lesson 8: Conservation of Momentum (closed system).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l08-conservation-momentum.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u3-l08-conservation-momentum',
  title: 'Conservation of Momentum',
  unit: 'Unit 3: Collisions & Momentum',
  order: 308,
  visible: false,
  dueDate: '2026-11-09', // PLACEHOLDER
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🚗', title: 'Conservation of Momentum', subtitle: 'Unit 3 · Lesson 8' }),

    k.objectives([
      'Define the system in a collision so momentum accounting is unambiguous',
      'Use the idea that total momentum before equals total momentum after in an isolated system',
      'Predict how changing mass or velocity of one vehicle changes the total momentum of a two-vehicle system',
    ]),

    k.text(
      "Yesterday you met momentum: $\\vec{p} = m\\vec{v}$. Mass times velocity, with direction. Today we ask a harder " +
      "question: when two cars crash, where does all that momentum *go*?\n\n" +
      "The short answer is: **it doesn't go anywhere**. If you define your **system** as the two vehicles together, " +
      "and if nothing outside that system pushes on them during the crash, then the **total momentum of the system " +
      "stays the same**. The individual vehicles change velocity, but the vector sum of their momenta before the " +
      "collision equals the vector sum after."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Conservation of Momentum',
      content:
        "For an **isolated system** — one with no net external force — the total momentum is conserved:\n\n" +
        "$$\\vec{p}_{total\\ before} = \\vec{p}_{total\\ after}$$\n\n" +
        "In one dimension, for two objects:\n\n" +
        "$$m_1v_{1,i} + m_2v_{2,i} = m_1v_{1,f} + m_2v_{2,f}$$\n\n" +
        "The system here is **both vehicles together**. The road, the air, and the Earth are outside the system unless " +
        "you include them.",
    }),

    k.text(
      "**Why 'isolated' matters.** Real crashes aren't perfectly isolated — friction with the road, drag from the air, " +
      "and the push from the ground all act on the cars. But during the brief, violent part of the collision, those " +
      "outside forces are usually tiny compared with the forces the cars exert on each other. So we treat the two-car " +
      "system as isolated *during the collision* and conservation of momentum gives us a powerful prediction tool."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u3-l08-conservation-momentum-vectors.jpg',
      alt: 'A before-and-after diagram of a 1D collision: before, Car A has +800 and Car B has -500 momentum for a total of +300; after, the individual momenta change but the system total is still +300.',
      caption: 'The individual vehicles change momentum, but the total momentum of the isolated two-car system is the same before and after (+300 kg·m/s here). *(Diagram.)*',
    }),

    k.embed({
      url: `${TOOLS_BASE}/collision-sim-1d.html?mode=closed-system`,
      caption:
        '🧮 **1D Collision Simulator (Closed System)** — Set the masses and velocities of two vehicles, run the crash, ' +
        'and check whether total momentum before equals total momentum after. Watch what happens when you make one vehicle much heavier.',
      height: 800,
    }),

    k.mc({
      prompt:
        'Two cars collide on a flat, icy road where friction is negligible. If Car A has momentum $+800\\text{ kg·m/s}$ ' +
        'and Car B has momentum $-500\\text{ kg·m/s}$ before the crash, what is the total momentum of the two-car system ' +
        'right after the crash?',
      options: [
        'It stays $+300\\text{ kg·m/s}$ because momentum is conserved in the isolated two-car system.',
        'It becomes $+1300\\text{ kg·m/s}$ because the momenta add without considering direction.',
        'It becomes $-300\\text{ kg·m/s}$ because the negative momentum reverses the total.',
        'It cannot be determined because crumpling changes the total momentum of the system.',
      ],
      correctIndex: 0,
      explanation:
        'Total momentum is conserved for the isolated two-car system: $800 + (-500) = +300\\text{ kg·m/s}$. Crumpling ' +
        'changes kinetic energy and internal energy, but it does not change the total momentum of the system.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        "**Define your system.** In the simulator, what objects did you include in the system? Explain why it's reasonable " +
        "to treat them as isolated during the short time of the collision, and name one external force that would make the " +
        "system *not* perfectly isolated.",
      placeholder: 'My system includes…\n\nIt is approximately isolated because…\n\nOne external force is…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Use conservation of momentum to explain what happens to the total momentum of the two-vehicle system when a ' +
        'small car rear-ends a massive truck that is stopped at a red light.',
      claimHint: 'State what happens to the total momentum of the system from just before to just after the collision.',
      evidenceHint: 'Describe the momentum of each vehicle before the crash and compare it to the momentum of each vehicle after.',
      reasoningHint: 'Explain why conservation of momentum predicts this outcome, using the idea of an isolated system.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
