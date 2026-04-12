const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const courseId = 'Y9Gdhw5MTY8wMFt6Tlvj'; // P4
  const lessonIds = [
    'ai-and-your-career',
    'ai-policy-lab',
    'final-project-launch',
    'final-project-presentations',
    'cb1e0c38',
    'baa8f813',
    'ai-values-corporate-power',
  ];

  for (const lessonId of lessonIds) {
    const ref = db.doc('courses/' + courseId + '/lessons/' + lessonId);
    const doc = await ref.get();
    if (!doc.exists) { console.log('SKIP (not found): ' + lessonId); continue; }
    const d = doc.data();
    if (d.visible === true) {
      console.log('REFUSED (visible=true): ' + lessonId + ' — ' + d.title);
      continue;
    }
    await ref.delete();
    console.log('DELETED: ' + lessonId + ' — ' + (d.title || '(no title)'));
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
