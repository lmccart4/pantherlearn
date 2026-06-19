// seed-phys-u4-l04-searching-for-pieces.cjs — Unit 4 Lesson 4: meteorite recovery + sample analysis.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u4-l04-searching-for-pieces.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
// IMAGE PHASE: meteorite sample photo + density/magnet test demonstration (rights-cleared).s

const lesson = {
  id: 'phys-u4-l04-searching-for-pieces',
  title: 'Searching for Pieces',
  unit: 'Unit 4: Meteors, Orbits & Gravity',
  order: 404,
  visible: false,
  dueDate: '2026-10-22', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '☄️', title: 'Searching for Pieces', subtitle: 'Unit 4 · Lesson 4' }),

    k.objectives([
      'Describe how scientists locate and recover meteorites',
      'Use density and magnetic properties to distinguish meteorite candidates from Earth rocks',
      'Explain what meteorites can reveal about the early solar system',
    ]),

    k.text(
      "After the Chelyabinsk airburst, teams of scientists and volunteers searched the snowy ground for surviving fragments. " +
      "They found hundreds of small meteorites — dark, fragile rocks that had made it through the atmosphere. Finding them " +
      "took careful searching, but it also took knowledge of what to look for."
    ),

    k.text(
      "**Two quick field tests.**\n\n" +
      "1. **Density.** Meteorites are usually denser than typical Earth rocks because they contain metals like iron and nickel. " +
      "You can estimate density by weighing a sample and measuring its volume by water displacement.\n\n" +
      "2. **Magnetism.** Most meteorites contain enough iron-nickel metal that a strong magnet will stick to them. Many Earth " +
      "rocks are not magnetic at all, so this is a fast way to rule out ordinary stones."
    ),

    // IMAGE PHASE: photo of a meteorite fragment + magnet/density test setup.

    k.mdTable({
      headers: ['Sample', 'Mass (g)', 'Volume (cm³)', 'Density (g/cm³)', 'Magnet sticks?'],
      rows: [
        ['A — black, glassy', '45', '18', '2.5', 'No'],
        ['B — dark, dense', '62', '8', '7.8', 'Yes'],
        ['C — reddish, rough', '55', '22', '2.5', 'No'],
        ['D — gray, metallic', '78', '10', '7.8', 'Yes'],
      ],
      lead: '**Virtual lab data: four candidate rocks**',
      note: 'Typical Earth rocks have densities around 2.5–3.0 g/cm³. Iron-nickel meteorites are much denser, around 7–8 g/cm³.',
    }),

    k.mc({
      prompt: 'Based on the data above, which samples are most likely meteorites?',
      options: [
        'Samples B and D, because they are dense and magnetic',
        'Samples A and C, because they have the lowest densities',
        'Samples A and B, because one is glassy and one is dark',
        'Samples C and D, because they have the largest volumes',
      ],
      correctIndex: 0,
      explanation:
        'Meteorites are typically denser than Earth rocks and contain iron-nickel metal, so a magnet sticks to them. ' +
        'Samples B and D match both criteria.',
      difficulty: 'apply',
    }),

    k.dataTable({
      title: 'Your Candidate Analysis',
      preset: 'text',
      rows: [
        { key: 'sampleA', label: 'Sample A' },
        { key: 'sampleB', label: 'Sample B' },
        { key: 'sampleC', label: 'Sample C' },
        { key: 'sampleD', label: 'Sample D' },
      ],
      columns: [
        { key: 'meteorite', label: 'Meteorite? (yes/no/unclear)' },
        { key: 'evidence', label: 'Evidence from density + magnetism' },
      ],
    }),

    k.shortAnswer({
      prompt:
        "**What do meteorites tell us?**\n\nMeteorites are some of the oldest solid material in the solar system. In a " +
        "few sentences, explain why studying meteorites helps scientists understand the early Earth and the other planets.",
      placeholder: 'Meteorites are useful because…',
      difficulty: 'analyze',
    }),

    k.externalLink({
      icon: '🧲',
      title: 'Smithsonian — How to Identify a Meteorite',
      description: 'A field guide to the visual and physical tests scientists use to separate meteorites from \"meteorwrongs.\"',
      url: 'https://naturalhistory.si.edu/education/teaching-resources/earth-and-space-science/meteorites',
      buttonLabel: 'Read',
    }),

    k.cer({
      prompt:
        'A farmer in Russia finds a dark, heavy rock in a field where the Chelyabinsk meteor fell. Make a case for why scientists should study it.',
      claimHint: 'State whether the rock is likely worth scientific study.',
      evidenceHint: 'Cite density, magnetism, and the circumstances of where it was found.',
      reasoningHint: 'Connect those observations to what meteorites can reveal about the solar system.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
