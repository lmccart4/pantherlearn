// seed-phys-u4-l09-orbits-have-a-shape.cjs — Unit 4 Lesson 9: ellipses, eccentricity, and intersecting orbits.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l09-orbits-have-a-shape.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)
// IMAGE PHASE: diagram showing focus, semi-major axis, perihelion, aphelion, and eccentricity of an ellipse.

const lesson = {
  id: 'phys-u4-l09-orbits-have-a-shape',
  title: 'Orbits Have a Shape',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 409,
  visible: false,
  dueDate: '2026-10-16', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🥚', title: 'Orbits Have a Shape', subtitle: 'Unit 4 · Lesson 9' }),

    k.objectives([
      'Describe an ellipse using eccentricity and semi-major axis',
      'Explain why Earth\'s orbit and an asteroid orbit can cross',
      'Use the orbit simulator to test how velocity and distance shape an orbit',
    ]),

    k.text(
      "Yesterday you found that planets follow a precise mathematical rule: $T^2 \propto a^3$. But the shape of the orbit " +
      "matters too. A circle is just a special case. Most orbits are **ellipses** — stretched-out circles with the central " +
      "body at one focus.\n\n" +
      "For our **system**, think of the Sun plus one orbiting object. The object's path is fixed by its starting distance " +
      "from the Sun and its sideways (tangential) speed. Too little speed and it falls in. Too much speed and it escapes. " +
      "Just the right speed gives a repeating ellipse."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Orbit Shape Vocabulary',
      content:
        "- **Ellipse** — a closed curve where the sum of the distances to two foci is constant\n" +
        "- **Eccentricity ($e$)** — how stretched the ellipse is; $e = 0$ is a circle, $0 < e < 1$ is an ellipse\n" +
        "- **Semi-major axis ($a$)** — half the longest distance across the orbit; sets the orbital period\n" +
        "- **Perihelion** — closest point to the Sun\n" +
        "- **Aphelion** — farthest point from the Sun",
    }),

    k.embed({
      url: `${TOOLS_BASE}/orbit-gravity-sim.html?mode=ellipses`,
      caption:
        '🪐 **Orbit / Gravity Simulator — Ellipse Mode** — Set the orbiting object\'s distance and tangential speed, then ' +
        'watch the shape of the orbit. Find the speed that makes a circle, then change one variable to make an ellipse.',
      height: 800,
    }),

    k.dataTable({
      title: 'Test Orbit Shapes',
      preset: 'numeric',
      rows: [
        { key: 'trial_1', label: 'Trial 1: low tangential speed' },
        { key: 'trial_2', label: 'Trial 2: circular-orbit speed' },
        { key: 'trial_3', label: 'Trial 3: faster than circular' },
        { key: 'trial_4', label: 'Trial 4: very fast' },
      ],
      columns: [
        { key: 'start_distance', label: 'Starting distance (AU)' },
        { key: 'speed', label: 'Tangential speed (relative units)' },
        { key: 'shape', label: 'Orbit shape you observed' },
        { key: 'still_bound', label: 'Still bound to the Sun? (yes / no)' },
      ],
    }),

    k.mc({
      prompt: 'In the simulator, you keep the starting distance the same but increase the tangential speed. What happens to the orbit?',
      options: [
        'The orbit becomes more circular, then becomes more elliptical, and can eventually escape',
        'The orbit always stays a perfect circle no matter the speed',
        'The orbit shrinks to a smaller circle and crashes into the Sun',
        'The orbit immediately reverses direction and spirals inward',
      ],
      correctIndex: 0,
      explanation:
        'At low speed the object falls inward; at just the right speed it circles; at higher speeds the ellipse stretches; ' +
        'above escape speed the object is no longer bound.',
      difficulty: 'understand',
    }),

    k.cer({
      prompt:
        'Earth orbits near a circle, but some asteroids have elliptical orbits that cross Earth\'s path. Explain how an ' +
        'asteroid can start far from Earth and still collide with our planet.',
      claimHint: 'State why an asteroid orbit can intersect Earth\'s orbit.',
      evidenceHint: 'Use the idea of eccentricity and the fact that both orbits share the Sun as a focus.',
      reasoningHint:
        'Explain how a stretched ellipse lets an asteroid travel from the asteroid belt to the inner solar system, and why ' +
        'that path can cross Earth\'s nearly circular orbit at the right time.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
