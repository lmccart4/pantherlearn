const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
(async () => {
  const ids = ['infographic-day1-topic-data','infographic-day2-design','infographic-day3-polish-showcase','photo-essay-day1-theme-composition','photo-essay-day2-curate-sequence','photo-essay-day3-layout-showcase','short-form-video-day1-deconstruction','short-form-video-day2-script-shoot','short-form-video-day3-edit-capcut','short-form-video-day4-polish-showcase','psa-day1-topic-research','psa-day2-storyboard-design','psa-day3-production','psa-day4-polish-showcase'];
  console.log('Lesson | Order | DueDate | Visible');
  console.log('---');
  for (const id of ids) {
    const d = await db.collection('courses').doc('digital-literacy').collection('lessons').doc(id).get();
    const x = d.data();
    console.log(`${id.padEnd(42)} order=${String(x.order).padEnd(6)} due=${x.dueDate}  visible=${x.visible}`);
  }
})();
