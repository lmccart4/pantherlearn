// seed-phys-u4-l12-tracking-near-earth-objects.cjs — Unit 4 Lesson 12: detecting and tracking asteroids.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l12-tracking-near-earth-objects.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u4-l12-tracking-near-earth-objects',
  title: 'Tracking Near-Earth Objects',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 412,
  visible: false,
  dueDate: '2026-10-21', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🔭', title: 'Tracking Near-Earth Objects', subtitle: 'Unit 4 · Lesson 12' }),

    k.objectives([
      'Describe how astronomers detect and track near-Earth asteroids',
      'Interpret impact-probability and energy data for real NEOs',
      'Communicate risk clearly using evidence, without causing panic',
    ]),

    k.text(
      "Now that we understand how an object can go from a safe orbit to a potential impact, we need to know: **how do we " +
      "find them before they find us?**\n\n" +
      "Astronomers scan the sky with telescopes, looking for small moving points of light. Once an object is found, they " +
      "measure its position over days or weeks, fit an orbit, and predict where it will be years into the future. The " +
      "**system** we care about is the asteroid plus the Sun plus the planets whose gravity will tweak its path. Small " +
      "uncertainties grow over time, so probabilities — not yes/no predictions — are the right way to talk about risk."
    ),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u4-l12-tracking-near-earth-objects-belt-map.jpg',
      alt: 'Top-down map of the inner solar system showing the Sun, the orbits of Mercury through Mars, the asteroid belt between Mars and Jupiter, and highlighted near-Earth objects on Earth-crossing orbits.',
      caption: 'Most asteroids stay in the belt between Mars and Jupiter, but near-Earth objects ride stretched orbits that cross Earth’s path. *(Diagram.)*',
    }),

    k.mdTable({
      lead: '**Selected near-Earth objects** — approximate values for comparison.',
      headers: ['Object', 'Estimated diameter', 'Impact probability (known)', 'Estimated energy (megatons TNT)', 'Next close approach'],
      rows: [
        ['Apophis', '~340 m', 'Effectively zero for 100 years', '~1,150', '2029-04-13'],
        ['Bennu', '~500 m', '1 in 2,700 by 2182', '~1,450', '2135'],
        ['Chelyabinsk object', '~20 m', 'Not detected before entry', '~0.5', '2013-02-15'],
        ['2024 YR4', '~50 m', 'Varying; monitoring', '~8', '2032'],
      ],
      note: 'Data: NASA JPL CNEOS / Sentry (approximate). Probabilities change as observations improve.',
    }),

    k.externalLink({
      icon: '🌐',
      title: 'NASA CNEOS — Sentry: Earth Impact Monitoring',
      description: 'Live table of known near-Earth objects with computed impact probabilities and close-approach dates.',
      url: 'https://cneos.jpl.nasa.gov/sentry/',
      buttonLabel: 'Explore',
    }),

    k.dataTable({
      title: 'Compare and Communicate Risk',
      preset: 'text',
      rows: [
        { key: 'apophis', label: 'Apophis' },
        { key: 'bennu', label: 'Bennu' },
        { key: 'chelyabinsk', label: 'Chelyabinsk object' },
      ],
      columns: [
        { key: 'worst_case', label: 'What could go wrong in a worst-case scenario?' },
        { key: 'reassuring', label: 'What is reassuring about the current data?' },
        { key: 'headline', label: 'Write a one-sentence headline for a news story (accurate, not alarming)' },
      ],
    }),

    k.mc({
      prompt: 'Why do astronomers report asteroid impact risk as a probability (e.g., "1 in 2,700") instead of a yes/no answer?',
      options: [
        'Because the asteroid\'s orbit is known exactly and probability is just a public-relations choice',
        'Because small measurement uncertainties in position and velocity grow over time, making the future path uncertain',
        'Because asteroids randomly change speed for no physical reason',
        'Because probabilities are easier to convert into movie plots than exact predictions',
      ],
      correctIndex: 1,
      explanation:
        'Orbital predictions are based on limited observations. Tiny errors in today\'s position and velocity become larger ' +
        'uncertainties far in the future, so risk is expressed as a probability that updates as more data are collected.',
      difficulty: 'understand',
    }),

    k.cer({
      prompt:
        'You are asked to explain the risk from Bennu to a friend who saw a scary headline. Write a short, accurate ' +
        'explanation that uses the data in the table.',
      claimHint: 'State whether Bennu is likely to hit Earth in the next century.',
      evidenceHint: 'Use the impact probability and estimated diameter from the table.',
      reasoningHint:
        'Explain why monitoring matters and why a small probability is not the same as zero risk, nor the same as a guarantee.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
