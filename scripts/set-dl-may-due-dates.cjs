const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const dueDates = {
  // Infographic Sprint
  'infographic-day1-topic-data': '2026-05-05',
  'infographic-day2-design': '2026-05-06',
  'infographic-day3-polish-showcase': '2026-05-07',
  // Photo Essay Sprint
  'photo-essay-day1-theme-composition': '2026-05-08',
  'photo-essay-day2-curate-sequence': '2026-05-11',
  'photo-essay-day3-layout-showcase': '2026-05-12',
  // Short-Form Video Sprint
  'short-form-video-day1-deconstruction': '2026-05-13',
  'short-form-video-day2-script-shoot': '2026-05-14',
  'short-form-video-day3-edit-capcut': '2026-05-15',
  'short-form-video-day4-polish-showcase': '2026-05-18',
  // PSA Sprint (PSA Day 4 final lock = Tue 5/26 per Memorial Day buffer)
  'psa-day1-topic-research': '2026-05-19',
  'psa-day2-storyboard-design': '2026-05-20',
  'psa-day3-production': '2026-05-21',
  'psa-day4-polish-showcase': '2026-05-26',
  // Brand Kit (kept invisible, no due date)
};

(async () => {
  for (const [id, dueDate] of Object.entries(dueDates)) {
    const ref = db.collection('courses').doc('digital-literacy').collection('lessons').doc(id);
    const doc = await ref.get();
    if (!doc.exists) { console.log(`✗ ${id} MISSING`); continue; }
    await ref.update({ dueDate });
    console.log(`✓ ${id.padEnd(40)} dueDate=${dueDate}`);
  }

  // Clear dueDate on Brand Kit (in case it has stale ones)
  for (const id of ['brand-kit-day1-vibe-check','brand-kit-day2-logo-color-font','brand-kit-day3-instagram-guide-showcase']) {
    const ref = db.collection('courses').doc('digital-literacy').collection('lessons').doc(id);
    const doc = await ref.get();
    if (!doc.exists) continue;
    if (doc.data().dueDate) {
      await ref.update({ dueDate: admin.firestore.FieldValue.delete() });
      console.log(`⊗ ${id.padEnd(40)} dueDate cleared (kept invisible, dormant)`);
    } else {
      console.log(`— ${id.padEnd(40)} no dueDate to clear`);
    }
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
