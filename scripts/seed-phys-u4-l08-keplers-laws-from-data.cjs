// seed-phys-u4-l08-keplers-laws-from-data.cjs — Unit 4 Lesson 8: derive Kepler's laws from real orbital data.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l08-keplers-laws-from-data.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
// IMAGE PHASE: scatter plot of T^2 vs a^3 for planets and near-Earth asteroids showing linear trend.

const lesson = {
  id: 'phys-u4-l08-keplers-laws-from-data',
  title: 'Kepler\'s Laws from Data',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 408,
  visible: false,
  dueDate: '2026-10-15', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📊', title: 'Kepler\'s Laws from Data', subtitle: 'Unit 4 · Lesson 8' }),

    k.objectives([
      'Use real orbital data to find patterns in the motions of planets and asteroids',
      'State Kepler\'s first and second laws in your own words',
      'Use Kepler\'s third law to predict the period of an object from its orbital distance',
    ]),

    k.text(
      "Before Newton wrote his law of universal gravitation, **Johannes Kepler** had already figured out three rules that " +
      "describe how every planet moves around the Sun. He did it without knowing *why* — he just had decades of careful " +
      "observations and patience.\n\n" +
      "Today you have the same job: look at real orbital data for planets, moons, and asteroids, and let the patterns " +
      "jump out. The **system** we'll study is a smaller object (planet, moon, or asteroid) orbiting a much larger central " +
      "body (Sun or planet). We treat the two as an isolated two-body system, ignoring tiny pulls from everything else."
    ),

    k.mdTable({
      lead: '**Planetary orbital data** — use these values for your calculations.',
      headers: ['Object', 'Semi-major axis $a$ (AU)', 'Orbital period $T$ (years)', 'Eccentricity $e$'],
      rows: [
        ['Mercury', '0.387', '0.241', '0.206'],
        ['Venus', '0.723', '0.615', '0.007'],
        ['Earth', '1.000', '1.000', '0.017'],
        ['Mars', '1.524', '1.881', '0.093'],
        ['Ceres', '2.768', '4.601', '0.076'],
        ['Jupiter', '5.204', '11.86', '0.049'],
      ],
      note: 'Data: NASA JPL Horizons (approximate). AU = Earth-Sun average distance.',
    }),

    k.text(
      "**Kepler\'s first law** says orbits are **ellipses**, with the central body at one focus — not at the center. " +
      "Look at the eccentricity column: Earth\'s orbit is nearly circular ($e$ close to 0), while Mercury\'s is clearly " +
      "elliptical. Even a small $e$ means the Sun is off-center.\n\n" +
      "**Kepler\'s second law** says a line from the planet to the Sun sweeps out **equal areas in equal times**. That " +
      "means planets move **faster when close to the Sun** and slower when far away. We'll test that idea tomorrow in the " +
      "orbit simulator. Today we focus on the distance-period relationship."
    ),

    k.dataTable({
      title: 'Find the Distance–Period Pattern',
      preset: 'numeric',
      rows: [
        { key: 'mercury', label: 'Mercury' },
        { key: 'venus', label: 'Venus' },
        { key: 'earth', label: 'Earth' },
        { key: 'mars', label: 'Mars' },
        { key: 'ceres', label: 'Ceres' },
        { key: 'jupiter', label: 'Jupiter' },
      ],
      columns: [
        { key: 'a_cubed', label: '$a^3$ (AU$^3$)' },
        { key: 't_squared', label: '$T^2$ (years$^2$)' },
        { key: 'ratio', label: '$T^2 / a^3$ (years$^2$/AU$^3$)' },
      ],
    }),

    k.shortAnswer({
      prompt:
        "**Describe the pattern.** As the semi-major axis gets larger, what happens to the orbital period? " +
        "Is the relationship linear, or does it grow faster than that?",
      placeholder: 'As a increases, T …',
      difficulty: 'analyze',
    }),

    k.mc({
      prompt: 'A newly discovered asteroid orbits the Sun at $a = 4.0$ AU. Using Kepler\'s third-law pattern, about how long is its year?',
      options: [
        'About 4 years, because the period equals the distance',
        'About 6 years, because $T$ grows faster than $a$',
        'About 8 years, because $T^2 \approx a^3$ means $T \approx \sqrt{a^3}$',
        'About 16 years, because $T$ is the square of the distance',
      ],
      correctIndex: 2,
      explanation:
        'Kepler\'s third law says $T^2 \propto a^3$. For $a = 4$ AU, $a^3 = 64$, so $T = \sqrt{64} = 8$ years.',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'How do the orbital data support Kepler\'s claim that planets move in ellipses with the Sun at one focus?',
      claimHint: 'State Kepler\'s first law in your own words.',
      evidenceHint: 'Use the eccentricity values from the table and explain what an eccentricity greater than zero means.',
      reasoningHint: 'Connect nonzero eccentricity to the shape of the orbit and the location of the Sun.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
