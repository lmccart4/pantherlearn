// seed-phys-u6-l06-source-of-starlight.cjs — Unit 6 Lesson 6: The Source of Starlight.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l06-source-of-starlight.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const IMG_BASE = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics';

const lesson = {
  id: 'phys-u6-l06-source-of-starlight',
  title: 'The Source of Starlight',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 606,
  visible: false,
  dueDate: '2026-10-06', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '⚛️', title: 'The Source of Starlight', subtitle: 'Unit 6 · Lesson 6' }),

    k.objectives([
      'Explain that stars shine because of nuclear fusion in their cores',
      'Contrast fusion with fission and radioactive decay',
      'Use $E = mc^2$ to relate a tiny mass difference to a large energy release',
    ]),

    k.image({
      url: `${IMG_BASE}/phys-u6-l06-source-of-starlight-fusion.jpg`,
      alt: 'A fusion diagram: four hydrogen nuclei on the left combine into one helium nucleus on the right, releasing energy and a photon, labeled E = mc squared.',
      caption: 'Stars shine because four hydrogen nuclei fuse into one helium nucleus, converting a tiny bit of mass into energy and light. *(Diagram.)*',
    }),

    k.text(
      "We now know what stars are made of and how they are classified. But we still have not answered the driving question: " +
      "**why do stars shine?** The answer is nuclear **fusion** in the star's core.\n\n" +
      "Inside a star, gravity squeezes hydrogen nuclei together with enormous pressure and temperature. When the nuclei get " +
      "close enough, the strong nuclear force pulls them together, forming helium. A little bit of mass is converted into a " +
      "huge amount of energy."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Fusion in the Sun',
      content: "The net reaction in the Sun combines four hydrogen nuclei into one helium nucleus:\n\n" +
               "$$4\,^{1}\!H \rightarrow \,^{4}\!He + 2e^{+} + 2\nu_{e} + \text{energy}$$\n\n" +
               "The helium nucleus has slightly less mass than the four hydrogens. That 'missing' mass becomes energy via $E = mc^2$.",
    }),

    k.text(
      "The **system** here is the star's core: hydrogen nuclei + strong nuclear force + released energy. Energy is conserved " +
      "within the larger star-plus-surroundings system, but a small amount of mass is converted to energy. That energy works " +
      "its way outward as photons, eventually escaping as starlight."
    ),

    k.image({
      url: `${IMG_BASE}/phys-u6-l06-source-of-starlight-fission-vs-fusion.jpg`,
      alt: 'Side-by-side diagram: fission shows one heavy nucleus splitting into smaller pieces; fusion shows two light nuclei combining into a heavier one. Both release energy.',
      caption: 'Fission splits a heavy nucleus into smaller pieces; fusion combines light nuclei into a heavier one. Stars run on fusion. *(Diagram.)*',
    }),

    k.mdTable({
      lead: '**Three nuclear processes compared**',
      headers: ['Process', 'What happens', 'Where it matters'],
      rows: [
        ['Fusion', 'Light nuclei combine into a heavier nucleus', 'Cores of stars, hydrogen bombs'],
        ['Fission', 'Heavy nucleus splits into smaller nuclei', 'Nuclear power plants, atomic bombs'],
        ['Radioactive decay', 'Unstable nucleus emits particles/spontaneously', 'Carbon dating, geothermal heating'],
      ],
      note: 'All three can release energy because of mass-energy equivalence.',
    }),

    k.text(
      "Einstein's equation $E = mc^2$ tells us that mass itself is a form of energy. Because $c^2$ is enormous " +
      "($9 \times 10^{16}\ \text{m}^2/\text{s}^2$), even a tiny mass loss produces a huge energy output. That is why the Sun " +
      "can keep shining for billions of years while losing only a small fraction of its mass."
    ),

    k.dataTable({
      title: 'Fusion Mass-Energy Practice',
      preset: 'numeric',
      columns: [
        { key: 'reactant_mass', label: 'Reactant mass (kg)' },
        { key: 'product_mass', label: 'Product mass (kg)' },
        { key: 'mass_lost', label: 'Mass lost (kg)' },
        { key: 'energy_j', label: 'Energy released (J)' },
      ],
      rows: [
        { key: 'row1', label: 'Reaction 1' },
        { key: 'row2', label: 'Reaction 2' },
      ],
    }),

    k.mc({
      prompt: 'In the Sun\'s core, four hydrogen nuclei fuse into one helium nucleus. Why does this release energy?',
      options: [
        'The helium nucleus has more mass than the four hydrogens',
        'The helium nucleus has less mass than the four hydrogens',
        'The hydrogen nuclei double in number',
        'The reaction creates new elements heavier than iron',
      ],
      correctIndex: 1,
      explanation: 'Fusion releases energy because the product nucleus has slightly less mass than the reactants. The lost mass is converted to energy via E = mc².',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'Which nuclear process is the main source of energy in an ordinary star like the Sun?',
      options: [
        'Nuclear fission of uranium',
        'Nuclear fusion of hydrogen into helium',
        'Radioactive decay of iron',
        'Chemical burning of hydrogen gas',
      ],
      correctIndex: 1,
      explanation: 'Ordinary stars like the Sun produce energy by fusing hydrogen into helium in their cores. Chemical burning is far too weak to power a star.',
      difficulty: 'understand',
    }),

    k.cer({
      prompt: 'Why does a star shine? Use fusion, mass-energy equivalence, and the idea of a system in your answer.',
      claimHint: 'State what makes a star shine.',
      evidenceHint: 'Describe the fusion reaction and the mass-to-energy conversion.',
      reasoningHint: 'Explain how energy moves from the core to the surface and why this is a transfer of energy within the star system.',
    }),

    k.shortAnswer({
      prompt: 'Contrast fusion in the Sun with fission in a nuclear power plant. Name one similarity and one difference.',
      placeholder: 'Similarity: …\nDifference: …',
      difficulty: 'apply',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
