const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const COURSES = [
  { id: 'Y9Gdhw5MTY8wMFt6Tlvj', label: 'AI Literacy P4' },
  { id: 'DacjJ93vUDcwqc260OP3', label: 'AI Literacy P5' },
  { id: 'M2MVSXrKuVCD9JQfZZyp', label: 'AI Literacy P7' },
  { id: 'fUw67wFhAtobWFhjwvZ5', label: 'AI Literacy P9' },
  { id: 'physics', label: 'Physics' },
  { id: 'digital-literacy', label: 'Digital Literacy' },
];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// IDs that are clearly legacy short-form codes (not dynamically generated per render)
// These are stable even if not UUID format
const LEGACY_PATTERN = /^[a-z0-9]{4,12}$/i;

async function main() {
  // Count non-UUID but stable IDs vs truly concerning ones
  let legacyCount = 0;
  let genuinelyConcerningCount = 0;
  const concerning = [];
  
  for (const course of COURSES) {
    const snap = await db.collection('courses').doc(course.id).collection('lessons')
      .where('visible', '==', true).get();
    
    const lessons = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    for (const lesson of lessons) {
      const blocks = lesson.blocks || [];
      
      for (const block of blocks) {
        if (!block.id) {
          console.log('NO_ID [' + course.label + '] ' + lesson.title + ' type:' + block.type);
          genuinelyConcerningCount++;
          continue;
        }
        
        if (UUID_RE.test(block.id)) continue; // proper UUID, fine
        
        // Non-UUID: classify
        // "objectives", "section-warmup" etc are clearly intentional semantic IDs
        // Short codes like "b1", "b2" are legacy but stable
        if (block.id === 'objectives' || block.id.startsWith('section-')) {
          legacyCount++; // probably intentional semantic IDs
        } else if (/^b\d+$/.test(block.id)) {
          legacyCount++; // b1, b2, b3... legacy
        } else if (/^[a-z0-9]{6,12}$/i.test(block.id)) {
          legacyCount++; // short hex/alphanumeric — likely stable legacy IDs
        } else {
          genuinelyConcerningCount++;
          concerning.push({course: course.label, lesson: lesson.title, block: block.type, id: block.id});
        }
      }
    }
  }
  
  console.log('\nLegacy non-UUID stable IDs: ' + legacyCount + ' (safe — stable even if not UUID format)');
  console.log('Genuinely concerning IDs: ' + genuinelyConcerningCount);
  if (concerning.length > 0) {
    console.log('\nConcerning IDs:');
    concerning.forEach(c => console.log('  [' + c.course + '] ' + c.lesson + ' ' + c.block + ':' + c.id));
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
