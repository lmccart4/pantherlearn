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

async function main() {
  let totalIssues = 0;
  
  for (const course of COURSES) {
    const snap = await db.collection('courses').doc(course.id).collection('lessons')
      .where('visible', '==', true).get();
    
    const lessons = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    
    for (const lesson of lessons) {
      const blocks = lesson.blocks || [];
      
      // Check for blocks without IDs
      const noId = blocks.filter(b => !b.id);
      if (noId.length > 0) {
        console.log('MISSING_ID [' + course.label + '] ' + lesson.title + ': ' + noId.length + ' blocks without ID (types: ' + noId.map(b => b.type).join(', ') + ')');
        totalIssues++;
      }
      
      // Check for duplicate block IDs
      const ids = blocks.map(b => b.id).filter(Boolean);
      const seen = new Set();
      const dups = [];
      for (const id of ids) {
        if (seen.has(id)) dups.push(id);
        seen.add(id);
      }
      if (dups.length > 0) {
        console.log('DUPLICATE_ID [' + course.label + '] ' + lesson.title + ': duplicate IDs: ' + dups.join(', '));
        totalIssues++;
      }
      
      // Check for non-UUID IDs (could indicate dynamically generated IDs)
      const nonUuid = blocks.filter(b => b.id && !UUID_RE.test(b.id));
      if (nonUuid.length > 0) {
        console.log('NON_UUID_ID [' + course.label + '] ' + lesson.title + ': ' + nonUuid.map(b => b.type + ':' + b.id.slice(0,20)).join(', '));
        totalIssues++;
      }
      
      // Check embed blocks — are scored ones actually wired?
      const embedBlocks = blocks.filter(b => b.type === 'embed');
      for (const eb of embedBlocks) {
        if (!eb.url) {
          console.log('EMBED_NO_URL [' + course.label + '] ' + lesson.title + ' block:' + (eb.id || 'NO_ID'));
          totalIssues++;
        }
        // embed with scored:true but no url is dead
        if (eb.scored && !eb.url) {
          console.log('SCORED_EMBED_NO_URL [' + course.label + '] ' + lesson.title + ': scored embed missing URL');
          totalIssues++;
        }
      }
      
      // Check activity blocks for grading wiring
      // For lessons that are "Assessment Grade" type — do they have activity blocks?
      if (lesson.title && lesson.title.includes('Assessment Grade')) {
        const activityBlocks = blocks.filter(b => ['bias_detective','space_rescue','momentum_mystery_lab','embedding_explorer'].includes(b.type));
        const embedScored = blocks.filter(b => b.type === 'embed' && b.scored);
        if (activityBlocks.length === 0 && embedScored.length === 0) {
          console.log('ASSESSMENT_NO_SCORED_BLOCK [' + course.label + '] ' + lesson.title + ': labeled Assessment Grade but no scored activity or embed block');
          totalIssues++;
        }
      }
    }
  }
  
  if (totalIssues === 0) {
    console.log('No block ID or embed URL issues found across all visible lessons.');
  }
  console.log('\nTotal block structural issues: ' + totalIssues);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
