// seed-phys-u3-l02-distracted-driving.cjs — Unit 3 Lesson 2: reaction time + Stopping-Distance Calculator.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u3-l02-distracted-driving.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u3-l02-distracted-driving',
  title: 'Distracted Driving',
  unit: 'Unit 3: Collisions & Momentum',
  order: 302,
  visible: false,
  dueDate: '2026-10-14', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📱', title: 'Distracted Driving', subtitle: 'Unit 3 · Lesson 2' }),

    k.objectives([
      'Measure and compare reaction times for attentive and distracted drivers',
      'Use the Stopping-Distance Calculator to connect reaction time to total stopping distance',
      'Explain why distraction increases crash risk using distance and time ideas',
    ]),

    k.text(
      "One of the first things that makes driving risky is **time** — specifically, the time between when a driver sees " +
      "a hazard and when their foot hits the brake. That gap is called **reaction time**.\n\n" +
      "For an attentive driver, a common planning value for perception-reaction time is about **1.5 seconds** (the value " +
      "NHTSA uses for stopping-distance estimates). For a distracted driver — someone texting, " +
      "changing a song, or looking at a passenger — it can double or triple. That extra time doesn't just feel dangerous; " +
      "it adds serious distance to the stopping path. The car keeps moving at full speed while the driver's brain is still " +
      "figuring out what to do."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Two Parts of Stopping',
      content:
        "- **Reaction distance** — how far the car travels while the driver is still reacting\n" +
        "- **Braking distance** — how far the car travels after the brakes are applied\n" +
        "- **Total stopping distance** = reaction distance + braking distance",
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u3-l02-distracted-driving-reaction-paths.jpg',
      alt: 'A split-screen comparison: an attentive driver covers a short reaction distance before braking, while a distracted driver looking at a phone covers a much longer reaction distance before braking.',
      caption: 'A distracted driver keeps moving at full speed for longer, so the car covers far more ground before the brakes are even applied. *(Diagram.)*',
    }),

    k.embed({
      url: `${TOOLS_BASE}/stopping-distance.html`,
      caption: '🛑 **Stopping-Distance Calculator** — Input speed and reaction time to see how much road you need to stop safely.',
      height: 750,
    }),

    k.mc({
      prompt: 'A driver is traveling at 30 mph. If their reaction time doubles, what happens to the **reaction distance**?',
      options: [
        'It stays the same because braking distance is unchanged',
        'It is cut in half',
        'It also doubles',
        'It becomes zero once the brakes are applied',
      ],
      correctIndex: 2,
      explanation:
        'Reaction distance depends on speed × reaction time. If reaction time doubles while speed stays the same, ' +
        'the distance traveled during the reaction period also doubles.',
      difficulty: 'apply',
    }),

    k.dataTable({
      title: 'Reaction Time Data',
      preset: 'numeric',
      rows: [
        { key: 'attentive', label: 'Attentive driver (about 1.5 s)' },
        { key: 'distracted', label: 'Distracted driver (about 3.0 s)' },
      ],
      columns: [
        { key: 'speed_mph', label: 'Speed (mph)' },
        { key: 'reaction_dist_ft', label: 'Reaction distance (ft)' },
        { key: 'braking_dist_ft', label: 'Braking distance (ft)' },
        { key: 'total_dist_ft', label: 'Total stopping distance (ft)' },
      ],
    }),

    k.shortAnswer({
      prompt:
        "**What pattern do you see?**\n\nDescribe how reaction time, speed, and total stopping distance are related " +
        "in your own words.",
      placeholder: 'As reaction time increases…',
      difficulty: 'analyze',
    }),

    k.cer({
      prompt:
        'Why does distracted driving increase the chance of a crash, even if the car and road conditions are the same?',
      claimHint: 'State whether distraction mainly affects reaction distance, braking distance, or both.',
      evidenceHint: 'Cite numbers from the calculator or data table to support your claim.',
      reasoningHint: 'Explain why a longer reaction time means more risk, using the idea of stopping distance.',
    }),

    k.mc({
      prompt: 'Which change would **most increase** total stopping distance at 40 mph?',
      options: [
        'A wet road that doubles braking distance',
        'A distracted driver who triples reaction time',
        'A heavier car with the same brakes',
        'Both A and B increase it by the same amount',
      ],
      correctIndex: 1,
      explanation:
        'At 40 mph, reaction distance is already a large fraction of the total. Tripling reaction time roughly triples ' +
        'that large fraction, which usually exceeds the effect of doubling braking distance alone.',
      difficulty: 'analyze',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
