// seed-phys-u2-l05-first-plate-motion.cjs — Unit 2 Lesson 5: initial model of plate motion.
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u2-l05-first-plate-motion',
  title: 'A First Model of Plate Motion',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 205,
  visible: false,
  dueDate: '2026-10-09', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'A First Model of Plate Motion', subtitle: 'Unit 2 · Lesson 5' }),

    k.objectives([
      'Draw an initial model showing how plates move',
      'Identify pushes and pulls that could drive plate motion',
      'Connect the Afar rift to a larger pattern of plate motion',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u2-l05-first-plate-motion-plate-force-arrows.jpg',
      alt: 'A cross-section of a tectonic plate riding on the mantle, labeled with three force arrows: mantle drag beneath the plate, ridge push from a raised ridge, and slab pull where the plate edge sinks.',
      caption: 'Three forces that can move a plate: mantle drag, ridge push, and slab pull. *(Diagram.)*',
    }),

    k.text(
      "Afar is not just a local crack. It sits on a **divergent plate boundary** — a place where two tectonic plates are " +
      "moving apart. The crack we saw is the surface expression of plates pulling away from each other.\n\n" +
      "A **tectonic plate** is a large piece of Earth's crust and upper mantle that moves slowly over the hotter, softer " +
      "rock below. What pushes or pulls these giant plates?"
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "In this lesson, the **system** is one tectonic plate and the mantle directly beneath it. The **surroundings** are " +
        "neighboring plates, the hot core below, and the cold ocean or atmosphere above. Forces and energy cross these " +
        "boundaries as the plate interacts with its surroundings.",
    }),

    k.text(
      "**Possible driving forces**\n\n" +
      "Scientists consider several pushes and pulls:\n\n" +
      "- **Mantle drag** — convection currents in the mantle pull the plate along\n" +
      "- **Ridge push** — elevated mid-ocean ridges push plates away from the boundary\n" +
      "- **Slab pull** — a cold, dense plate sinking into the mantle pulls the rest of the plate behind it\n\n" +
      "These forces can be unbalanced, so the plate accelerates, decelerates, or changes direction — very slowly."
    ),

    k.shortAnswer({
      prompt:
        "**What could push or pull a plate?** List at least two possible forces from the list above, and explain which one " +
        "you think is most important for the Afar rift.",
      placeholder: 'Two forces are…',
      difficulty: 'apply',
    }),

    k.mc({
      prompt: 'What is the best initial explanation for why Earth\'s plates move?',
      options: [
        'The plates float on a completely still and unmoving mantle',
        'Plates only move when earthquakes shake them from side to side',
        'Forces from the mantle below push or pull on the plates above',
        'Ocean water pushes continents apart as the planet slowly spins',
      ],
      correctIndex: 2,
      explanation:
        'Plates move because forces from the mantle and plate boundaries push or pull them. Earthquakes are a result of ' +
        'that motion, not the cause of all of it.',
      difficulty: 'understand',
    }),

    k.sketch({
      title: 'Your First Plate-Motion Model',
      instructions:
        'Draw a cross-section showing a tectonic plate and the mantle below it. Add arrows showing at least two forces that ' +
        'could move the plate. Label each force.',
      prompt:
        "Don't worry about perfect details. This is your first model; we'll revise it as we learn more about mantle " +
        "convection and plate boundaries.",
    }),

    k.shortAnswer({
      prompt:
        "**Explain your model.** How do the forces in your drawing connect back to the Afar rift? What direction is the " +
        "plate moving, and what happens at the surface?",
      placeholder: 'In my model…',
      difficulty: 'analyze',
    }),

    k.callout({
      style: 'info',
      icon: '📌',
      title: 'Save Your Model',
      content:
        "Mr. McCarthy will save your sketch so we can compare it to your final model at the end of the unit. Models improve " +
        "as we gather more evidence — that's how science works.",
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
