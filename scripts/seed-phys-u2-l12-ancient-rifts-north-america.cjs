// seed-phys-u2-l12-ancient-rifts-north-america.cjs — Unit 2 Lesson 12: Ancient Rifts of North America.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u2-l12-ancient-rifts-north-america.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u2-l12-ancient-rifts-north-america',
  title: 'Ancient Rifts of North America',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 212,
  visible: false,
  dueDate: '2026-10-27', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'Ancient Rifts of North America', subtitle: 'Unit 2 · Lesson 12' }),

    k.objectives([
      'Identify ancient rift systems preserved in North American rocks',
      'Interpret data about rift location, age, and geological evidence',
      'Connect local New Jersey geology to past plate-tectonic forces',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u2-l12-ancient-rifts-north-america-map.jpg',
      alt: 'A simplified geological map of North America highlighting the Newark Basin in New Jersey and Pennsylvania, the Palisades Sill along the Hudson River, and the Y-shaped Midcontinent Rift through the Great Lakes region.',
      caption: 'Three ancient rift features in North America: the Newark Basin, the Palisades Sill, and the much older Midcontinent Rift. *(Diagram.)*',
    }),

    k.text(
      "The 2005 Afar rift is happening **right now**. But rifts have opened and closed across Earth for billions of years. " +
      "Some left behind scars in the crust that we can still read today — including here in **North America**."
    ),

    k.text(
      "In this lesson, we look at three pieces of evidence that show ancient rifting:\n\n" +
      "- The **Newark Basin** — a sunken block of crust that stretches through New Jersey and Pennsylvania\n" +
      "- The **Palisades Sill** — a thick sheet of igneous rock along the Hudson River that pushed in between sedimentary layers and was later tilted and exposed as steep cliffs by erosion\n" +
      "- The **Midcontinent Rift** — a much older, giant crack that runs through the Great Lakes region"
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "In this lesson, the **system** is a region of Earth's crust and upper mantle that was once being pulled apart by " +
        "tectonic forces. The **surroundings** include neighboring crustal blocks, the mantle below, and the atmosphere above. " +
        "Energy and forces crossed these boundaries during the rifting event.",
    }),

    k.mdTable({
      lead: '**Ancient rift evidence in North America**',
      headers: ['Feature', 'Location', 'Age (approx.)', 'Evidence of ancient rifting'],
      rows: [
        ['Newark Basin', 'New Jersey / Pennsylvania', '~200 million years ago', 'Layered sedimentary rocks in a down-dropped basin formed as the crust stretched'],
        ['Palisades Sill', 'Along the Hudson River, NJ/NY', '~200 million years ago', 'Thick igneous rock sheet intruded during rift-related volcanism'],
        ['Midcontinent Rift', 'Great Lakes region (MN/WI/MI/Ontario)', '~1.1 billion years ago', 'Huge volume of volcanic rock filling a failed continental crack'],
      ],
      note: 'All three features formed when forces inside Earth pulled the crust apart.',
    }),

    k.text(
      "The ages in the table tell a story. Around **200 million years ago**, the crust that is now New Jersey was being " +
      "stretched and thinned, just like Afar today. The basin sank, magma rose, and the Palisades Sill formed. Eventually " +
      "the rifting stopped — the forces became balanced, or the plate motion changed — and the rift failed."
    ),

    k.shortAnswer({
      prompt:
        "**Use the table.** Which feature is the oldest, and which is the youngest? What does that tell you about whether " +
        "rifting in North America happened only once?",
      placeholder: 'The oldest feature is… The youngest is… This means…',
      difficulty: 'analyze',
    }),

    k.mc({
      prompt: 'What does the presence of the Newark Basin and Palisades Sill tell us about New Jersey\'s geological past?',
      options: [
        'New Jersey has always been a stable, unchanging part of the continent',
        'Forces inside Earth once pulled this region apart, similar to Afar today',
        'The Palisades were carved by glaciers during the last ice age',
        'The basin formed when ocean water flooded a meteor crater',
      ],
      correctIndex: 1,
      explanation:
        'The Newark Basin and Palisades Sill are evidence that crustal stretching and rift-related volcanism once affected ' +
        'what is now New Jersey, much like the active rifting seen in Afar.',
      difficulty: 'understand',
    }),

    k.cer({
      prompt:
        'What evidence shows that New Jersey was once part of an active rift system?',
      claimHint: 'State whether New Jersey shows evidence of ancient rifting.',
      evidenceHint: 'Cite at least two specific features or data points from the table.',
      reasoningHint: 'Explain how those features form when forces inside Earth pull the crust apart.',
    }),

    k.externalLink({
      icon: '🌐',
      title: 'USGS — Newark Basin and Palisades Sill',
      description: 'Background on the rift basins and igneous rocks of the eastern United States.',
      url: 'https://www.usgs.gov/',
      buttonLabel: 'Explore',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
