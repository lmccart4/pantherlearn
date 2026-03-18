const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const courseIds = [
  { id: 'Y9Gdhw5MTY8wMFt6Tlvj', label: 'AI P4' },
  { id: 'DacjJ93vUDcwqc260OP3', label: 'AI P5' },
  { id: 'M2MVSXrKuVCD9JQfZZyp', label: 'AI P7' },
  { id: 'fUw67wFhAtobWFhjwvZ5', label: 'AI P9' },
];

async function main() {
  for (const course of courseIds) {
    const snap = await db.collection('courses').doc(course.id).collection('lessons')
      .where('visible', '==', true).get();
    
    for (const doc of snap.docs) {
      const d = doc.data();
      const blocks = d.blocks || [];
      const scoredEmbeds = blocks.filter(b => b.type === 'embed' && b.scored);
      if (scoredEmbeds.length === 0) continue;
      
      console.log('[' + course.label + '] ' + d.title + ' (id: ' + doc.id + ')');
      scoredEmbeds.forEach(eb => {
        const url = eb.url || 'NO URL';
        const isGSlides = url.includes('docs.google.com/presentation');
        const isGDrive = url.includes('drive.google.com');
        const isPanthers = url.includes('pantherlearn') || url.includes('web.app') || url.includes('firebase');
        const isUnknown = !isGSlides && !isGDrive && !isPanthers;
        console.log('  embed id:' + eb.id + ' scored:' + eb.scored);
        console.log('  URL type: ' + (isGSlides ? 'GOOGLE SLIDES (wont post score!)' : isGDrive ? 'GOOGLE DRIVE (wont post score!)' : isPanthers ? 'Firebase app (should work)' : 'UNKNOWN: ' + url.slice(0, 60)));
      });
    }
  }
  
  // Also check physics
  const physSnap = await db.collection('courses').doc('physics').collection('lessons').where('visible', '==', true).get();
  for (const doc of physSnap.docs) {
    const d = doc.data();
    const blocks = d.blocks || [];
    const scoredEmbeds = blocks.filter(b => b.type === 'embed' && b.scored);
    if (scoredEmbeds.length === 0) continue;
    
    console.log('[Physics] ' + d.title + ' (id: ' + doc.id + ')');
    scoredEmbeds.forEach(eb => {
      const url = eb.url || 'NO URL';
      const isGSlides = url.includes('docs.google.com/presentation');
      const isGDrive = url.includes('drive.google.com');
      const isPanthers = url.includes('pantherlearn') || url.includes('web.app') || url.includes('firebase');
      console.log('  embed id:' + eb.id + ' scored:' + eb.scored);
      console.log('  URL type: ' + (isGSlides ? 'GOOGLE SLIDES (wont post score!)' : isGDrive ? 'GOOGLE DRIVE (wont post score!)' : isPanthers ? 'Firebase app (should work)' : 'UNKNOWN: ' + url.slice(0, 60)));
    });
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
