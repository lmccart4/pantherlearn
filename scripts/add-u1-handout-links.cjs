// add-u1-handout-links.cjs — append a "Printable handout" external_link block to the 5 U1
// reference lessons, pointing at the hosted HTML handouts. Append-only via safeLessonWrite (0 responses).
// Run: cd ~/pantherlearn-wt/openscied-u1-grid-sim && NODE_PATH=~/pantherlearn/node_modules node scripts/add-u1-handout-links.cjs
const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.cert(require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json')) });
const db = admin.firestore();
const k = require('./unit1-seed-kit.cjs');

const COURSE_ID = 'physics-2026';
const BASE = 'https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-handouts/physics/';

const LINKS = [
  ['phys-u1-l02-following-energy',  'Energy Flow Tracer Handout',     'phys-u1-l02-energy-flow-handout.html'],
  ['phys-u1-l10-mastery-check',     'Mid-Unit Study Guide',           'phys-u1-l10-study-guide.html'],
  ['phys-u1-l12-energy-sources',    'Energy Sources Interview Guide', 'phys-u1-l12-interview-guide.html'],
  ['phys-u1-l13-design-challenge',  'Design Challenge Brief',         'phys-u1-l13-design-brief.html'],
  ['phys-u1-l14-showcase-transfer', 'Peer Review Sheet',              'phys-u1-l14-peer-review.html'],
];

(async () => {
  for (const [lessonId, title, file] of LINKS) {
    const ref = db.collection('courses').doc(COURSE_ID).collection('lessons').doc(lessonId);
    const snap = await ref.get();
    if (!snap.exists) { console.log(`SKIP ${lessonId}: not found`); continue; }
    const data = snap.data();
    const blocks = data.blocks || [];
    // idempotent: skip if a handout link to this file is already present
    if (blocks.some(b => b.type === 'external_link' && typeof b.url === 'string' && b.url.includes(file))) {
      console.log(`= ${lessonId}: handout link already present`); continue;
    }
    const linkBlock = k.externalLink({
      icon: '📄',
      title: `Printable: ${title}`,
      description: 'Open or print this handout — equations render correctly and it works on a phone or computer.',
      url: BASE + file,
      buttonLabel: 'Open Handout',
    });
    const newLesson = { ...data, blocks: [...blocks, linkBlock] };
    const r = await k.seedLesson(db, COURSE_ID, newLesson);
    console.log(`+ ${lessonId}: ${r.action} (${newLesson.blocks.length} blocks, handout link added)`);
  }
  process.exit(0);
})().catch(e => { console.error(e.message); process.exit(1); });
