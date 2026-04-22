// Patch all broken Unit 5 AI-lit image URLs to use the new local images.
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const URL_MAP = {
  'lesson-images%2Fgeneral%2Fa-doctor-and-an-ai-system-both-examining-the-same-chest-x-ra.jpg': '/images/ai-literacy/ai-healthcare-hero.png',
  'lesson-images%2Fgeneral%2Fai-literacy-healthcare-ai-diagnosis.jpg': '/images/ai-literacy/ai-healthcare-diagnosis.png',
  'lesson-images%2Fgeneral%2Fai-literacy-hiring-resume-filter.jpg': '/images/ai-literacy/ai-hiring-filter.png',
  'lesson-images%2Fgeneral%2Fa-giant-digital-eye-composed-of-security-cameras-and-circuit.jpg': '/images/ai-literacy/ai-policing-eye.png',
  'lesson-images%2Fgeneral%2Fai-literacy-policing-surveillance-grid.jpg': '/images/ai-literacy/ai-policing-surveillance.png',
  'lesson-images%2Fgeneral%2Fai-literacy-art-human-vs-ai-creation.jpg': '/images/ai-literacy/ai-art-human-vs-ai.png',
};

const COURSES = ['Y9Gdhw5MTY8wMFt6Tlvj','DacjJ93vUDcwqc260OP3','M2MVSXrKuVCD9JQfZZyp','fUw67wFhAtobWFhjwvZ5'];

(async () => {
  let patched = 0;
  for (const cid of COURSES) {
    const snap = await db.collection('courses').doc(cid).collection('lessons').get();
    for (const doc of snap.docs) {
      const blocks = (doc.data().blocks || []).map(b => ({ ...b }));
      let changed = false;
      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.type === 'image' && typeof b.url === 'string') {
          for (const [oldKey, newUrl] of Object.entries(URL_MAP)) {
            if (b.url.includes(oldKey)) {
              blocks[i] = { ...b, url: newUrl };
              changed = true;
              patched++;
              console.log(`  ${cid}/${doc.id} [block ${i}] → ${newUrl}`);
              break;
            }
          }
        }
      }
      if (changed) await doc.ref.update({ blocks });
    }
  }
  console.log(`\n✅ Patched ${patched} image URLs across ${COURSES.length} AI-lit sections`);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
