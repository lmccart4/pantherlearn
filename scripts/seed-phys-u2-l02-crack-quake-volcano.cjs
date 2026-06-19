// seed-phys-u2-l02-crack-quake-volcano.cjs — Unit 2 Lesson 2: connecting three phenomena as evidence.
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
// IMAGE PHASE: rift/quake/volcano triptych or annotated diagram linking the three phenomena.

const lesson = {
  id: 'phys-u2-l02-crack-quake-volcano',
  title: 'A Crack, a Quake, and a Volcano',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 202,
  visible: false,
  dueDate: '2026-10-06', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'A Crack, a Quake, and a Volcano', subtitle: 'Unit 2 · Lesson 2' }),

    k.objectives([
      'Connect rifting, earthquakes, and volcanoes as related evidence',
      'Use surface observations to infer processes below Earth\'s surface',
      'Revise our class model of what happened in Afar',
    ]),

    k.text(
      "Yesterday we met the **Afar rift**. Today we zoom out and ask: What if the crack, the earthquakes, and the " +
      "volcanic eruption are **not separate events**, but different signs of the same underlying cause?\n\n" +
      "Geologists often work backward from evidence at the surface to figure out what is happening underground. " +
      "A crack tells us the crust has been pulled apart. Earthquakes tell us rocks have suddenly slipped. Volcanoes " +
      "tell us hot material is rising. All three point toward **forces acting inside Earth**."
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "In this lesson, the **system** is the piece of Earth's crust and upper mantle beneath the Afar region. The " +
        "**surroundings** are the rest of Earth, the atmosphere, and any neighboring plates. We care about forces and " +
        "energy transfers across the system boundary.",
    }),

    k.mdTable({
      lead: '**Evidence from the surface** — What each observation tells us about the system below.',
      headers: ['Observation', 'What we can see', 'What it suggests below the surface'],
      rows: [
        ['Rift', 'A long crack opened in the ground', 'The crust is being pulled or stretched apart'],
        ['Earthquake', 'Ground shaking recorded by seismometers', 'Rocks underground suddenly slipped or broke'],
        ['Volcano', 'Ash and lava erupted at the surface', 'Hot material is rising from deeper inside Earth'],
      ],
      note: 'These three observations are stronger together than any one of them alone.',
    }),

    k.text(
      "**Building an argument**\n\n" +
      "When scientists argue from evidence, they don't just list facts. They explain **why** a particular observation " +
      "supports a claim about something they cannot directly see. In Afar, we cannot see the forces below the surface, " +
      "but we can see what they do."
    ),

    k.shortAnswer({
      prompt:
        "**Which observation is the strongest evidence that something is happening *below* the surface?** Explain your " +
        "choice using the table above.",
      placeholder: 'The strongest evidence is… because…',
      difficulty: 'analyze',
    }),

    k.mc({
      prompt: 'What do earthquakes, volcanic eruptions, and a sudden rift in the crust all suggest about the Afar region?',
      options: [
        'The surface has been heated only by sunlight for a very long time',
        'Forces inside Earth are pushing or pulling on the crust from below',
        'The desert rocks are too brittle to hold up large structures',
        'Seasonal wind and rain are slowly breaking apart the dry ground',
      ],
      correctIndex: 1,
      explanation:
        'A rift, earthquakes, and volcanoes all point to forces acting inside Earth. Sunlight, weak rocks, or weather ' +
        'alone do not explain all three phenomena happening together.',
      difficulty: 'understand',
    }),

    k.cer({
      prompt:
        'What is causing the crack, the earthquakes, and the volcano in Afar? Use evidence from the surface to support a ' +
        'claim about forces below the surface.',
      claimHint: 'State what you think is happening beneath Afar.',
      evidenceHint: 'Cite at least two observations from the table.',
      reasoningHint: 'Explain why those observations point to forces inside Earth rather than surface causes.',
    }),

    k.callout({
      style: 'info',
      icon: '📌',
      title: 'Model Update',
      content:
        "Mr. McCarthy will add the strongest claims to our class model. By the end of the unit, we'll check whether " +
        "today's claims still hold up.",
    }),

    k.externalLink({
      icon: '🌐',
      title: 'USGS Earthquake Hazards Program',
      description: 'Explore recent earthquakes and see how seismologists track motion inside Earth.',
      url: 'https://earthquake.usgs.gov/earthquakes/map/',
      buttonLabel: 'Open',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
