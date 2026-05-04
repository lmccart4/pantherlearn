const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
const ids = [
  'brand-kit-day1-vibe-check','brand-kit-day2-logo-color-font','brand-kit-day3-instagram-guide-showcase',
  'photo-essay-day1-theme-composition','photo-essay-day2-curate-sequence','photo-essay-day3-layout-showcase',
  'infographic-day1-topic-data','infographic-day2-design','infographic-day3-polish-showcase',
  'short-form-video-day1-deconstruction','short-form-video-day2-script-shoot','short-form-video-day3-edit-capcut','short-form-video-day4-polish-showcase',
  'psa-day1-topic-research','psa-day2-storyboard-design','psa-day3-production','psa-day4-polish-showcase'
];
(async () => {
  for (const id of ids) {
    const d = await db.collection('courses').doc('digital-literacy').collection('lessons').doc(id).get();
    if (!d.exists) { console.log(`✗ ${id} MISSING`); continue; }
    const data = d.data();
    console.log(`✓ ${id.padEnd(45)} order=${String(data.order).padEnd(6)} unit="${data.unit}"  blocks=${(data.blocks||[]).length} visible=${data.visible}`);
  }
})();
