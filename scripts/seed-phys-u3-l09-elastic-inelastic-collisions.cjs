// seed-phys-u3-l09-elastic-inelastic-collisions.cjs — Unit 3 Lesson 9: Elastic & Inelastic Collisions.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l09-elastic-inelastic-collisions.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u3-l09-elastic-inelastic-collisions',
  title: 'Elastic & Inelastic Collisions',
  unit: 'Unit 3: Collisions & Momentum',
  order: 309,
  visible: false,
  dueDate: '2026-11-10', // PLACEHOLDER
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🚙', title: 'Elastic & Inelastic Collisions', subtitle: 'Unit 3 · Lesson 9' }),

    k.objectives([
      'Distinguish collisions in which kinetic energy is conserved from those in which it is not',
      'Explain where the "missing" kinetic energy goes when a collision is inelastic',
      'Use data from the simulator to classify real-world crashes as nearly elastic or inelastic',
    ]),

    k.text(
      "Momentum is conserved in every collision we've looked at — as long as we define the system carefully and treat " +
      "it as isolated during the crash. But **kinetic energy** is a different story.\n\n" +
      "In some collisions, the objects bounce off each other and the total kinetic energy after is almost the same as " +
      "before. We call those **elastic** collisions. A good approximation is two billiard balls clacking together, or " +
      "two steel spheres in a physics demo.\n\n" +
      "In most real crashes — cars, trucks, bikes — the vehicles crumple, bend, and deform. That deformation does work " +
      "on the metal, heating it up and making sound. The total kinetic energy after is **less** than before. Momentum is " +
      "still conserved, but kinetic energy is not. We call those **inelastic** collisions."
    ),

    k.callout({
      style: 'info',
      icon: '⚖️',
      title: 'Momentum vs. Kinetic Energy',
      content:
        "- **Momentum** is conserved in any isolated system: $\\vec{p}_{total\\ before} = \\vec{p}_{total\\ after}$.\n" +
        "- **Kinetic energy** $KE = \\frac{1}{2}mv^2$ is **only** conserved in an **elastic** collision.\n" +
        "- In an **inelastic** collision, some kinetic energy becomes thermal energy, sound, and work deforming the objects.\n" +
        "- **Perfectly elastic** and **perfectly inelastic** (objects stick together) are the two extremes; real crashes fall somewhere in between.",
    }),

    k.embed({
      url: `${TOOLS_BASE}/collision-sim-1d.html?mode=elastic-inelastic`,
      caption:
        '🧮 **1D Collision Simulator (Energy Mode)** — Run the same crash as elastic, then as inelastic. Compare the total ' +
        'momentum and total kinetic energy before and after each run. Where did the missing energy go?',
      height: 800,
    }),

    k.dataTable({
      title: 'Collision Data',
      preset: 'numeric',
      rows: [
        { key: 'trial1_elastic', label: 'Trial 1 — Elastic' },
        { key: 'trial2_inelastic', label: 'Trial 2 — Inelastic' },
        { key: 'trial3_real_world', label: 'Trial 3 — Real-world crash estimate' },
      ],
      columns: [
        { key: 'm1_v1', label: 'm₁, v₁ (before)' },
        { key: 'm2_v2', label: 'm₂, v₂ (before)' },
        { key: 'p_total_before', label: 'Total p before (kg·m/s)' },
        { key: 'p_total_after', label: 'Total p after (kg·m/s)' },
        { key: 'ke_total_before', label: 'Total KE before (J)' },
        { key: 'ke_total_after', label: 'Total KE after (J)' },
        { key: 'elastic_or_not', label: 'Elastic / Inelastic / In between' },
      ],
    }),

    k.mc({
      prompt:
        'A 1500 kg car moving at $10\\text{ m/s}$ rear-ends a 1500 kg car moving at $2\\text{ m/s}$ in the same direction. ' +
        'After the crash, the two cars lock together and move as one. Which quantity is conserved, and which is not?',
      options: [
        'Both momentum and kinetic energy are conserved because no objects leave the system.',
        'Momentum is conserved, but kinetic energy is not because the cars crumple and heat up.',
        'Kinetic energy is conserved, but momentum is not because the cars stick together.',
        'Neither is conserved because the collision is inelastic and the cars lock together.',
      ],
      correctIndex: 1,
      explanation:
        'Momentum is conserved for the isolated two-car system in any collision. Kinetic energy is not conserved here ' +
        'because the cars lock together and deform; some KE becomes thermal energy, sound, and work done on the metal.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**Real-world classification.** Choose one real-world crash type from the list below and explain whether it is " +
        "closer to elastic or inelastic, and why:\n\n" +
        "- two billiard balls colliding\n" +
        "- a car hitting a concrete highway barrier\n" +
        "- a football player tackling another player and bringing them down",
      placeholder: 'I chose…\n\nIt is closer to… because…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Use evidence from your simulator data table to claim whether a real car crash is closer to elastic or inelastic.',
      claimHint: 'State whether a typical car crash is best modeled as elastic, inelastic, or somewhere between.',
      evidenceHint: 'Cite the momentum and kinetic energy values you recorded for your inelastic trial.',
      reasoningHint: 'Explain why crumpling changes kinetic energy but not total momentum of the system.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
