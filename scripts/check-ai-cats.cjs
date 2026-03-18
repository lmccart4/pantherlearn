const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const snap = await db.collection('courses').doc('Y9Gdhw5MTY8wMFt6Tlvj').collection('lessons')
    .where('visible', '==', true).get();
  
  snap.docs.forEach(doc => {
    const d = doc.data();
    if (d.gradeCategory) {
      console.log(d.title + ': gradeCategory=' + d.gradeCategory);
    }
  });
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
