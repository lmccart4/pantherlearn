// seed-phys-u2-l09-plate-boundary-forces.cjs — Unit 2 Lesson 9: divergent, convergent, and transform plate boundaries.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u2-l09-plate-boundary-forces.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u2-l09-plate-boundary-forces',
  title: 'Forces at Plate Boundaries',
  unit: 'Unit 2: Forces & Earth\'s Crust',
  order: 209,
  visible: false,
  dueDate: '2026-10-15', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌍', title: 'Forces at Plate Boundaries', subtitle: 'Unit 2 · Lesson 9' }),

    k.objectives([
      'Compare forces at divergent, convergent, and transform boundaries',
      'Determine whether forces at a boundary are balanced or unbalanced',
      'Predict the motion and hazards at each boundary type',
    ]),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u2-l09-plate-boundary-three-types-forces.jpg',
      alt: 'A three-panel diagram of plate boundaries: divergent with arrows pulling apart and rising magma, convergent with arrows pushing together and a subducting plate, and transform with opposite arrows sliding past along a fault.',
      caption: 'The three boundary types: divergent (pull apart), convergent (push together), transform (slide past). *(Diagram.)*',
    }),

    k.text(
      "Plates meet at **boundaries**. What happens there depends on the direction of the forces. The same plate can be pulled " +
      "apart in one place, pushed together in another, and slide past in a third. If we can read the forces, we can predict " +
      "the motion and the hazards."
    ),

    k.callout({
      style: 'info',
      icon: '⚙️',
      title: 'Defining the System',
      content:
        "In this lesson, the **system** is the set of two tectonic plates meeting at a boundary. The **surroundings** are " +
        "the mantle below, the atmosphere or ocean above, and neighboring plates. Forces cross the system boundary as the " +
        "mantle drags the plates and as the plates push or pull on each other.",
    }),

    k.mdTable({
      lead: '**The three main boundary types** — how forces and motion compare.',
      headers: ['Boundary', 'Forces', 'Motion', 'Common hazards'],
      rows: [
        ['Divergent', 'Plates pull apart', 'Move away from each other', 'Rifting, earthquakes, volcanic eruptions'],
        ['Convergent', 'Plates push together', 'Move toward each other', 'Large earthquakes, tsunamis, volcanic arcs, mountains, deep trenches'],
        ['Transform', 'Plates slide past each other', 'Move horizontally', 'Sudden earthquakes along the fault'],
      ],
      note: 'The driving and resisting forces at a boundary are almost never exactly balanced, so plates slowly speed up, slow down, or change direction over geologic time.',
    }),

    k.text(
      "**Force diagrams at boundaries**\n\n" +
      "A force diagram shows every push or pull acting on a plate. If the arrows point opposite and are equal in size, the " +
      "forces are balanced and there is no acceleration — though the plate may still be moving at constant velocity. If one " +
      "arrow is larger, the forces are unbalanced and the plate speeds up, slows down, or changes direction. At plate " +
      "boundaries, the driving and resisting forces are almost never exactly balanced, so over geologic time plates slowly " +
      "speed up, slow down, or change direction."
    ),

    k.embed({
      url: `${TOOLS_BASE}/plate-boundary-builder.html`,
      caption: '🧩 **Plate-Boundary Force-Diagram Builder** — Place force vectors on plates at each boundary type, check whether the net force is balanced or unbalanced, and predict the resulting motion and hazard.',
      height: 750,
    }),

    k.mc({
      prompt: 'At a convergent boundary, two plates push directly toward each other. What can you conclude about the net force?',
      options: [
        'The net force is zero, so the plates stop moving completely',
        'The net force pushes the plates together, causing compression',
        'The net force pulls the plates apart, creating a new rift',
        'The net force only affects the ocean, not the land',
      ],
      correctIndex: 1,
      explanation:
        'When two plates push toward each other, the net force is directed inward. This unbalanced compressive force builds ' +
        'mountains and creates trenches at convergent boundaries.',
      difficulty: 'understand',
    }),

    k.shortAnswer({
      prompt:
        "**Apply to Afar.** Afar is at a divergent boundary. Describe the direction of the forces, the net force, and the " +
        "surface motion you would predict.",
      placeholder: 'At Afar, the forces…',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Choose one boundary type and explain how unbalanced forces at that boundary lead to a specific motion and hazard.',
      claimHint: 'Name the boundary type and the motion you predict.',
      evidenceHint: 'Describe the force arrows or pushes/pulls acting on the plates.',
      reasoningHint: 'Connect the net force to the motion and to the hazard that results.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
