// seed-phys-u5-l08-hot-cold-spots.cjs — Unit 5 Lesson 8: standing waves / hot-cold spots in a microwave.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l08-hot-cold-spots.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';

const lesson = {
  id: 'phys-u5-l08-hot-cold-spots',
  title: 'Hot and Cold Spots',
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 508,
  visible: false,
  dueDate: '2026-10-15', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🌊', title: 'Hot and Cold Spots', subtitle: 'Unit 5 · Lesson 8' }),

    k.objectives([
      'Map standing-wave hot and cold zones inside a microwave',
      'Relate the spacing between hot spots to the wavelength of the microwaves',
      'Explain why some parts of food heat much faster than others',
    ]),

    k.text(
      "We've established that a microwave oven and a Bluetooth speaker both emit electromagnetic waves around " +
      "$2.4\\text{--}2.5\\ \\text{GHz}$. So why does the microwave cook food while Bluetooth barely warms your phone? " +
      "One reason is **power**, but another is something waves do when they bounce around inside a closed space: " +
      "they form **standing waves**.",
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Standing Wave',
      content:
        "A **standing wave** forms when two waves of the same frequency travel in opposite directions and overlap. " +
        "At some locations the waves add together (antinodes = **hot spots**); at others they cancel out " +
        "(nodes = **cold spots**). The distance between two neighboring hot spots is about half a wavelength " +
        "($\\lambda/2$).",
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u5-l08-hot-cold-spots-standing-wave.jpg',
      alt: 'A top-down cutaway of a microwave cavity showing a standing-wave pattern of alternating hot spots (antinodes) and cold spots (nodes) spaced half a wavelength apart.',
      caption: 'Standing waves inside the oven create fixed hot spots (antinodes) and cold spots (nodes). Neighboring hot spots are about half a wavelength ($\\lambda/2$) apart. *(Diagram.)*',
    }),

    k.text(
      "In this investigation you will map hot and cold zones using a **safe, low-power method**: a flat tray of " +
      "mini marshmallows or thermal paper placed on the turntable *without spinning*. After a very short heating " +
      "time, the pattern of melted and unmelted regions reveals where the microwave energy is strongest and weakest. " +
      "**Do not run the oven empty, do not overheat, and follow Mr. McCarthy's safety instructions exactly.**",
    ),

    k.callout({
      style: 'warning',
      icon: '⚠️',
      title: 'Safety First',
      content:
        "- Keep heating times short (10-20 seconds)\n" +
        "- Use a microwave-safe tray and eye protection\n" +
        "- Never put metal or foil inside the oven\n" +
        "- Let the tray cool before touching it",
    }),

    k.dataTable({
      title: 'Hot/Cold Spot Measurements',
      preset: 'numeric',
      rows: [
        { key: 'row1', label: 'Trial 1' },
        { key: 'row2', label: 'Trial 2' },
        { key: 'row3', label: 'Trial 3' },
      ],
      columns: [
        { key: 'hotA', label: 'Position of hot spot A (cm)' },
        { key: 'hotB', label: 'Position of hot spot B (cm)' },
        { key: 'spacing', label: 'Spacing (cm)' },
        { key: 'wavelength', label: 'Calculated λ (cm)' },
      ],
    }),

    k.barChart({ title: 'Average Hot-Spot Spacing Across Trials', barCount: 3 }),

    k.mc({
      prompt: 'Two neighboring hot spots inside the microwave are about 6 cm apart. About what wavelength does that imply?',
      options: [
        'About 3 cm',
        'About 6 cm',
        'About 12 cm',
        'About 24 cm',
      ],
      correctIndex: 2,
      explanation:
        "The distance between neighboring hot spots (antinodes) of a standing wave is about half a wavelength " +
        "($\\lambda/2$). If the spacing is 6 cm, the full wavelength is about $2 \\times 6 = 12\\ \\text{cm}$.",
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Explain why a microwave oven has hot and cold spots, and explain how turning on the turntable helps food heat more evenly.',
      claimHint: 'State what causes hot and cold spots and what the turntable does about them.',
      evidenceHint: 'Cite your measured spacing and the relationship between hot-spot spacing and wavelength.',
      reasoningHint: 'Use the idea of standing waves and antinodes/nodes to explain the pattern and the fix.',
    }),

    k.shortAnswer({
      prompt: 'Predict: if you used a microwave with a much higher frequency (shorter wavelength), how would the hot-spot spacing change? Explain.',
      placeholder: 'Higher frequency means... so the spacing would...',
      difficulty: 'apply',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
