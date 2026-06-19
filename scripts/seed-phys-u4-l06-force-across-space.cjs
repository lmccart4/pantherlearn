// seed-phys-u4-l06-force-across-space.cjs — Unit 4 Lesson 6: Newton's universal gravitation.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l06-force-across-space.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u4-l06-force-across-space',
  title: 'A Force That Reaches Across Space',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 406,
  visible: false,
  dueDate: '2026-10-26', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'A Force That Reaches Across Space', subtitle: 'Unit 4 · Lesson 6' }),

    k.objectives([
      'State Newton’s law of universal gravitation',
      'Explain how gravitational force depends on mass and distance',
      'Compare gravitational force to other distance-dependent forces we have studied',
    ]),

    k.text(
      "We've spent the first half of this unit describing what happens when objects hit Earth. Now we need to explain " +
      "*why* they were headed toward Earth in the first place — and why the Moon doesn't crash into us. The answer is " +
      "**gravity**: a force that pulls every mass toward every other mass, even across the vacuum of space."
    ),

    k.text(
      "Newton's law of universal gravitation says that the gravitational force between two objects is:\n\n" +
      "$$F_g = G \\frac{m_1 m_2}{r^2}$$\n\n" +
      "where $G$ is the universal gravitational constant, $m_1$ and $m_2$ are the masses, and $r$ is the distance between " +
      "their centers. Notice two things: **more mass means more force**, and **force falls off with the square of distance**."
    ),

    k.callout({
      style: 'info',
      icon: '📦',
      title: 'Define the System',
      content:
        "**System = the two masses interacting gravitationally** (for example, Earth + Moon, or Sun + asteroid).\n\n" +
        "The surroundings are everything else in the universe, but for most pairs the other masses are so far away that " +
        "their gravitational effects are tiny compared to the nearby partner.",
    }),

    k.mdTable({
      headers: ['Change made', 'Effect on $F_g$'],
      rows: [
        ['Double one mass', 'Force doubles'],
        ['Double both masses', 'Force quadruples'],
        ['Double the distance', 'Force becomes $\\frac{1}{4}$'],
        ['Triple the distance', 'Force becomes $\\frac{1}{9}$'],
        ['Halve the distance', 'Force quadruples'],
      ],
      lead: '**How $F_g$ responds to changes in mass and distance**',
      note: 'Because $r$ is squared in the denominator, distance has a stronger effect than mass.',
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u4-l06-force-across-space-earth-moon-force-pair.jpg',
      alt: 'Diagram of Earth and the Moon separated by distance r, with two equal and opposite force arrows along the line between their centers, labeled force of Earth on Moon and force of Moon on Earth.',
      caption: 'Gravity acts as an equal-and-opposite pair: Earth pulls the Moon exactly as hard as the Moon pulls Earth, along the line between them. *(Diagram.)*',
    }),

    k.mc({
      prompt: 'The distance between two asteroids is doubled. What happens to the gravitational force between them?',
      options: [
        'It stays the same',
        'It doubles',
        'It becomes one-fourth as strong',
        'It becomes half as strong',
      ],
      correctIndex: 2,
      explanation:
        'Gravitational force is inversely proportional to the square of distance ($1/r^2$). Doubling $r$ means the ' +
        'denominator becomes $2^2 = 4$, so the force drops to one-fourth.',
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt:
        "**Compare to Coulomb.**\n\nIn Unit 1 you saw that electric force also follows an inverse-square law: " +
        "$F_e = k \\frac{q_1 q_2}{r^2}$. In one paragraph, describe one way gravitational force is similar to electric force " +
        "and one important way it is different.",
      placeholder: 'Gravitational and electric forces are similar because… They differ because…',
      difficulty: 'analyze',
    }),

    k.cer({
      prompt:
        'Use Newton’s law of gravitation to explain why the Moon stays in orbit around Earth instead of flying off in a straight line.',
      claimHint: 'State what gravitational force does to the Moon’s motion.',
      evidenceHint: 'Reference the equation and the fact that the Moon has a sideways velocity.',
      reasoningHint: 'Explain how a force directed toward Earth can continuously bend the Moon’s path into a circle or ellipse.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
