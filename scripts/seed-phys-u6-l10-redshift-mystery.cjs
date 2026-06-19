// seed-phys-u6-l10-redshift-mystery.cjs — Unit 6 Lesson 10: The Redshift Mystery.
// Standards: HS-ESS1-2. Galaxy spectra show redshift; interpret as motion away from us.
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/seed-phys-u6-l10-redshift-mystery.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const TOOLS_BASE = 'https://paps-tools.web.app'; // embeds deployed to the paps-tools hosting site (allowlisted)

const lesson = {
  id: 'phys-u6-l10-redshift-mystery',
  title: 'The Redshift Mystery',
  unit: 'Unit 6: Stars & the Big Bang',
  order: 610,
  visible: false,
  dueDate: '2027-05-20', // PLACEHOLDER — 2026-27 pacing TBD with Luke
  gradesReleased: true,
  blocks: [
    k.sectionHeader({ icon: '🔭', title: 'The Redshift Mystery', subtitle: 'Unit 6 · Lesson 10' }),

    k.objectives([
      'Interpret absorption spectra from distant galaxies',
      'Connect a shift toward longer wavelengths to motion away from Earth',
      'Calculate redshift using $z = \\Delta\\lambda / \\lambda_0$',
    ]),

    k.text(
      "In the last lesson set we used starlight to figure out what stars are made of. But light from very distant galaxies " +
      "holds a stranger secret. When astronomers spread that light into a spectrum, they see the same familiar fingerprints " +
      "— hydrogen, calcium, sodium — but the fingerprints are **shifted toward the red end of the spectrum**. That's the " +
      "**redshift mystery**. Today you solve it."
    ),

    k.callout({
      style: 'info',
      icon: '💡',
      title: 'The Doppler Effect, Revisited',
      content:
        "You met the Doppler effect with sound: a siren moving toward you sounds higher-pitched, and one moving away sounds " +
        "lower-pitched. Light works the same way. Light from a source moving **away** from us is stretched to longer " +
        "wavelengths — toward the red. Light from a source moving **toward** us is squeezed to shorter wavelengths — toward " +
        "the blue.",
    }),

    k.text(
      "The spectra you will examine come from real galaxies. Each shows dark absorption lines caused by atoms in the galaxy " +
      "absorbing light at specific wavelengths. When those lines appear at wavelengths **longer** than the lab values, the " +
      "galaxy is moving away from us. The bigger the shift, the faster the motion.\n\n" +
      "We measure the shift with the redshift formula:\n\n" +
      "$$z = \\frac{\\Delta\\lambda}{\\lambda_0} = \\frac{\\lambda_{observed} - \\lambda_{rest}}{\\lambda_{rest}}$$"
    ),

    k.embed({
      url: `${TOOLS_BASE}/spectra-redshift-explorer.html?mode=redshift`,
      caption: '🔭 **Spectra / Redshift Explorer** — Measure the wavelength shift of galaxy spectra and calculate redshift. Compare each galaxy to the reference lines for hydrogen, calcium, and sodium.',
      height: 800,
    }),

    k.mc({
      prompt: 'A distant galaxy\'s hydrogen absorption lines are shifted toward the red end of the spectrum. What does this tell us?',
      options: [
        'The galaxy is cooler than nearby stars',
        'The galaxy is made of different elements than our Sun',
        'The galaxy is rotating faster than the Milky Way',
        'The galaxy is moving away from us, stretching its light',
      ],
      correctIndex: 3,
      explanation:
        'Redshift means the light waves are stretched to longer wavelengths. For light, stretching happens when the source is ' +
        'moving away from the observer. This is the Doppler effect applied to light.',
      difficulty: 'understand',
    }),

    k.mdTable({
      lead: '**Practice: Galaxy Redshift Data**',
      headers: ['Galaxy', 'Rest wavelength (nm)', 'Observed wavelength (nm)'],
      rows: [
        ['A', '500', '525'],
        ['B', '450', '472'],
        ['C', '600', '618'],
      ],
      note: 'Use $z = (\\lambda_{observed} - \\lambda_{rest}) / \\lambda_{rest}$.',
    }),

    k.mc({
      prompt: 'For Galaxy A in the table, what is the redshift $z$?',
      options: [
        '0.025',
        '0.050',
        '0.100',
        '0.500',
      ],
      correctIndex: 1,
      explanation:
        '$z = (525 - 500) / 500 = 25 / 500 = 0.05$. The observed wavelength is 5% longer than the rest wavelength, so the ' +
        'redshift is 0.05.',
      difficulty: 'apply',
    }),

    k.cer({
      prompt:
        'Astronomer Edwin Hubble discovered that almost every galaxy he measured showed redshift, and more distant galaxies ' +
        'had **larger** redshifts. Use the Doppler effect to explain what Hubble\'s data tell us about the motion of galaxies.',
      claimHint: 'State what Hubble\'s redshift data imply about how galaxies are moving.',
      evidenceHint: 'Describe the pattern: what happens to redshift as distance increases?',
      reasoningHint: 'Connect redshift to direction of motion, and the overall pattern to the large-scale behavior of the universe.',
    }),

    k.shortAnswer({
      prompt:
        'If a galaxy showed **blueshifted** absorption lines instead of redshifted ones, what would that mean? Name one object ' +
        'in our local neighborhood where we actually observe blueshift.',
      placeholder: 'Blueshift would mean… One nearby example is…',
      difficulty: 'apply',
    }),
  ],
};

(async () => {
  const r = await k.seedLesson(db, COURSE_ID, lesson);
  console.log(`✅ ${COURSE_ID}/${lesson.id}: ${r.action} (${r.preserved} preserved, ${lesson.blocks.length} blocks)`);
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
