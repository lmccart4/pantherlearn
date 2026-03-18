const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

async function main() {
  const doc = await db.collection('courses').doc('physics').collection('lessons').doc('work-energy-discovery').get();
  const d = doc.data();
  const blocks = d.blocks || [];
  console.log('Lesson: ' + d.title);
  console.log('Total blocks: ' + blocks.length);
  console.log('gradeCategory: ' + (d.gradeCategory || 'NOT SET'));
  
  const mc = blocks.filter(b => b.type === 'question' && b.questionType === 'multiple_choice');
  const sa = blocks.filter(b => b.type === 'question' && b.questionType === 'short_answer');
  const embeds = blocks.filter(b => b.type === 'embed');
  
  console.log('MC: ' + mc.length + ', SA: ' + sa.length + ', Embeds: ' + embeds.length);
  console.log('');
  
  // Check for blocks without IDs  
  const noId = blocks.filter(b => !b.id);
  if (noId.length > 0) console.log('Blocks without ID: ' + noId.length);
  
  // Check for duplicate IDs
  const ids = blocks.map(b => b.id).filter(Boolean);
  const seen = new Set();
  ids.forEach(id => {
    if (seen.has(id)) console.log('DUPLICATE ID: ' + id);
    seen.add(id);
  });
  
  // Sample first few block types
  console.log('First 10 block types:');
  blocks.slice(0, 10).forEach((b, i) => console.log('  ' + i + ': ' + b.type + ' id:' + (b.id || 'NO_ID')));
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
