// seed-phys-u5-l12-signals-city.cjs — Unit 5 Lesson 12: mapping cell-tower coverage in a city.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l12-signals-city.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u5-l12-signals-city',
  title: 'Signals in the City',
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 512,
  visible: false,
  dueDate: '2026-10-21', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🏙️', title: 'Signals in the City', subtitle: 'Unit 5 · Lesson 12' }),

    k.objectives([
      'Map cell-tower coverage on a simplified city map',
      'Explain the tradeoffs among frequency, range, bandwidth, and building penetration',
      'Defend a tower-placement plan using evidence',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u5-l12-signals-city-map.jpg',
      alt: 'A simplified top-down map of a small coastal city with a street grid, labeled school, residential, and commercial zones, green space, and a body of water along one edge.',
      caption: 'A simplified map of a Perth Amboy-style city — school, homes, businesses, and waterfront. You will place cell towers across zones like these. *(Diagram.)*',
    }),

    k.text(
      "If you look around Perth Amboy you'll notice cell towers, water towers with antennas, and small 5G boxes on " +
      "streetlights. They are not placed randomly. Each one is a choice about **frequency, range, bandwidth, and cost** " +
      "— and every choice involves a tradeoff.",
    ),

    k.mdTable({
      lead: '**Coverage Tradeoffs at a Glance**',
      headers: ['Carrier type', 'Typical frequency', 'Range', 'Building penetration', 'Data capacity'],
      rows: [
        ['Macro tower (4G/5G low-band)', '600–900 MHz', 'Long', 'Strong', 'Lower'],
        ['Mid-band 5G', '2.5–3.7 GHz', 'Medium', 'Moderate', 'Higher'],
        ['mmWave 5G', '24–39 GHz', 'Short', 'Weak', 'Very high'],
      ],
    }),

    k.text(
      "A single low-band tower can cover many square miles but cannot send a huge amount of data. A mmWave small cell " +
      "can send enormous amounts of data but its signal may only reach a few hundred meters and can be blocked by " +
      "walls, windows, and even rain. Real networks mix all three.",
    ),

    k.embed({
      url: `${TOOLS_BASE}/signal-tower-mapper.html?mode=city`,
      caption: '📶 **5G Tower Mapper** — Place towers on a simplified city map to cover roads and buildings while staying under budget. Compare low-band, mid-band, and mmWave choices.',
      height: 750,
    }),

    k.mc({
      prompt: 'A carrier wants to cover a dense downtown with very fast 5G. Which choice best matches that goal?',
      options: [
        'A few low-band towers spread far apart',
        'Many mmWave small cells close together',
        'One high-power AM radio transmitter',
        'A single satellite overhead',
      ],
      correctIndex: 1,
      explanation:
        "Dense downtown areas need high data capacity and many small coverage cells. mmWave provides very high data " +
        "rates but short range, so carriers deploy many small cells close together.",
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt: 'Why might a carrier choose mid-band 5G instead of mmWave for a suburban neighborhood like parts of Perth Amboy?',
      placeholder: 'Mid-band is a compromise because...',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Propose a tower plan for a 1-mile stretch of Perth Amboy that includes a school, a residential block, and a commercial strip. Choose frequencies and tower types, and defend your plan.',
      claimHint: 'State what mix of towers/frequencies you would use and where you would place them.',
      evidenceHint: 'Cite the tradeoff table and your mapper results (coverage, budget, data capacity).',
      reasoningHint: 'Explain why each placement and frequency choice matches the needs of that location.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
