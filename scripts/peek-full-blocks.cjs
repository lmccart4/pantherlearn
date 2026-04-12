const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const courseId = 'Y9Gdhw5MTY8wMFt6Tlvj';
  const id = process.argv[2];
  const types = process.argv.slice(3);
  const doc = await db.doc('courses/' + courseId + '/lessons/' + id).get();
  const blocks = doc.data().blocks || [];
  blocks.forEach(b => {
    if (types.length === 0 || types.includes(b.type)) {
      console.log('\n--- ' + b.type + ' ---');
      console.log(JSON.stringify(b, null, 2));
    }
  });
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
