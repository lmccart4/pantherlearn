// seed-phys-u6-l02-light-as-messenger.cjs — Unit 6 Lesson 2: Light as a Messenger.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l02-light-as-messenger.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const IMG_BASE = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/physics';

const lesson = {
  id: 'phys-u6-l02-light-as-messenger',
  title: 'Light as a Messenger',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 602,
  visible: false,
  dueDate: '2026-09-30', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '💡', title: 'Light as a Messenger', subtitle: 'Unit 6 · Lesson 2' }),

    k.objectives([
      'Explain that light carries information across space and time',
      'Relate wavelength and frequency to position on the electromagnetic spectrum',
      'Use the EM spectrum to describe what starlight can tell us',
    ]),

    k.image({
      url: `${IMG_BASE}/phys-u6-l02-light-as-messenger-em-spectrum.jpg`,
      alt: 'The electromagnetic spectrum from radio on the left to gamma rays on the right, with the visible rainbow band highlighted in the middle.',
      caption: 'Light comes in many wavelengths. Visible light (the rainbow) is just a thin slice between radio waves and gamma rays. *(Diagram.)*',
    }),

    k.text(
      "The 'new stars' we saw yesterday are incredibly far away. We cannot visit them. We cannot scoop up a sample. " +
      "Almost everything we know about stars arrives as **light**. Light is our messenger from the cosmos.\n\n" +
      "In Unit 5 you learned that light is an electromagnetic wave. The **electromagnetic spectrum** organizes light " +
      "by wavelength and frequency. From long-wavelength radio waves to short-wavelength gamma rays, every part of the " +
      "spectrum carries different information."
    ),

    k.callout({
      style: 'definition',
      icon: '🔑',
      title: 'Key Relationship',
      content: "For any wave, **speed = wavelength × frequency**. Since all light in empty space travels at the same speed ($c$), " +
               "a shorter wavelength means a higher frequency, and a longer wavelength means a lower frequency.\n\n$c = \\lambda f$",
    }),

    k.image({
      url: `${IMG_BASE}/phys-u6-l02-light-as-messenger-spectrum-sources.jpg`,
      alt: 'An electromagnetic spectrum strip with icons under each region: a radio dish, a warm dust cloud, the Sun, a hot blue star, and an exploding star.',
      caption: 'Different parts of the spectrum come from different sources — hotter objects shine more strongly at shorter wavelengths. *(Diagram.)*',
    }),

    k.mdTable({
      lead: '**Parts of the electromagnetic spectrum** (longest wavelength to shortest)',
      headers: ['Type', 'Wavelength trend', 'Example source'],
      rows: [
        ['Radio', 'Longest', 'Gas clouds, pulsars'],
        ['Infrared', 'Long', 'Warm dust, cooler stars'],
        ['Visible', 'Medium', 'Sun, other stars'],
        ['Ultraviolet', 'Short', 'Hot young stars'],
        ['X-ray / Gamma', 'Shortest', 'Explosions, neutron stars'],
      ],
      note: 'Astronomers use telescopes tuned to different parts of the spectrum to learn different things.',
    }),

    k.text(
      "Visible light is only a tiny slice of what stars emit. When astronomers look at the same object in radio, infrared, " +
      "visible, and X-ray light, they see different layers and processes. Starlight, then, is not just a picture — it is " +
      "a **data stream** that travels across space and arrives here years, centuries, or even millions of years after it left."
    ),

    k.shortAnswer({
      prompt: 'Why does light take time to reach us from distant stars? What does that mean about what we are actually seeing?',
      placeholder: 'Light travels fast but space is huge, so…',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'Astronomers observe a star in both visible light and infrared light. What is the main reason they compare the two?',
      options: [
        'To make the star look more colorful in photos',
        'To see different temperatures and structures in the star',
        'To prove the star is moving toward Earth',
        'To find out how much the star weighs',
      ],
      correctIndex: 1,
      explanation: 'Different wavelengths come from different temperatures and physical conditions. Comparing visible and infrared light reveals different layers and features of the star.',
      difficulty: 'understand',
    }),

    k.mc({
      prompt: 'If a star emits mostly ultraviolet light, what can you reasonably conclude?',
      options: [
        'It is very cold',
        'It is very far away',
        'It is very hot',
        'It is very small',
      ],
      correctIndex: 2,
      explanation: 'Hotter objects emit more short-wavelength light. A star emitting mostly ultraviolet light must be very hot.',
      difficulty: 'apply',
    }),

    k.cer({
      prompt: 'How does light act as a "messenger" that lets us study stars we can never visit?',
      claimHint: 'State how light carries information from distant stars.',
      evidenceHint: 'Use ideas about the electromagnetic spectrum, wavelength, and travel time.',
      reasoningHint: 'Connect the evidence to why we can learn about stars without going there.',
    }),

    k.shortAnswer({
      prompt: 'Revise the Driving Question Board: what new question does starlight as a messenger raise for you?',
      placeholder: 'My revised or new question: …',
      difficulty: 'apply',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
