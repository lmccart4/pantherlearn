// seed-phys-u5-l11-sending-information.cjs — Unit 5 Lesson 11: encoding information on EM waves.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u5-l11-sending-information.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u5-l11-sending-information',
  title: 'Sending Information Through Space',
  unit: 'Unit 5: Electromagnetic Radiation',
  order: 511,
  visible: false,
  dueDate: '2026-10-20', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '📡', title: 'Sending Information Through Space', subtitle: 'Unit 5 · Lesson 11' }),

    k.objectives([
      'Explain how information is encoded onto an electromagnetic wave',
      'Compare amplitude, frequency, and digital modulation',
      'Predict how carrier frequency affects how much data a signal can carry',
    ]),

    k.text(
      "Electromagnetic waves don't just carry energy — they can also carry **information**. Every text, call, and " +
      "video stream reaching your phone arrives on an EM wave that has been **modulated**: some property of the wave " +
      "has been deliberately changed to represent a signal.",
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Three Ways to Encode Information',
      content:
        "- **Amplitude modulation (AM)** — the height of the wave changes; used for AM radio.\n" +
        "- **Frequency modulation (FM)** — the frequency shifts slightly; used for FM radio and some Bluetooth modes.\n" +
        "- **Digital modulation** — the wave is switched on/off or phase-shifted to send 0s and 1s; used by WiFi, cell, and 5G.",
    }),

    k.image({
      url: 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics/phys-u5-l11-sending-information-modulation.jpg',
      alt: 'Three stacked panels comparing amplitude modulation (varying wave height), frequency modulation (varying cycle spacing), and digital modulation (a square-wave pulse train of ones and zeros).',
      caption: 'Three ways to encode information on a carrier wave: AM varies the amplitude, FM varies the frequency, and digital sends discrete on/off pulses. *(Diagram.)*',
    }),

    k.text(
      "The wave that gets modified is called the **carrier wave**. It has a base frequency chosen for the job: lower " +
      "frequencies travel farther and bend around obstacles, while higher frequencies can carry more data per second " +
      "but need a clearer line of sight. The information rides on top of the carrier like writing on a piece of paper.",
    ),

    k.embed({
      url: `${TOOLS_BASE}/signal-tower-mapper.html`,
      caption: '📶 **Signal Encoder / Tower Mapper** — Explore how carrier frequency and modulation type affect signal range, bandwidth, and the amount of data a tower can send.',
      height: 750,
    }),

    k.mc({
      prompt: 'A cell tower switches from a 700 MHz carrier to a 3.5 GHz carrier. What tradeoff is most likely?',
      options: [
        'The new signal travels farther and carries less data',
        'The new signal travels farther and carries more data',
        'The new signal has the same range and the same data capacity',
        'The new signal travels shorter distances but carries more data',
      ],
      correctIndex: 3,
      explanation:
        "Higher-frequency carriers have shorter wavelengths, which generally travel shorter distances and are blocked " +
        "more easily by obstacles, but they can be modulated faster and therefore carry more data per second.",
      difficulty: 'apply',
    }),

    k.shortAnswer({
      prompt: 'Why is digital modulation (0s and 1s) more robust against noise than AM or FM for sending text messages?',
      placeholder: 'Digital signals are easier to rebuild because...',
      difficulty: 'understand',
    }),

    k.cer({
      prompt:
        'A city is choosing between two carrier frequencies for a new emergency-alert system: 100 MHz (FM radio band) or 2.4 GHz (WiFi/Bluetooth band). Recommend one for reaching the widest area and one for sending the most detailed alert, and explain your reasoning.',
      claimHint: 'State which frequency you would choose for wide-area alerts and which for high-data alerts.',
      evidenceHint: 'Cite how frequency relates to wavelength, range, and data capacity.',
      reasoningHint: 'Explain why lower frequency gives wider coverage and why higher frequency gives higher data rates.',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
