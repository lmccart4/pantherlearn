// Scan every lesson due Apr 20–24 across all courses for broken image URLs.
// Also updates ai-in-law block 4 URL in all 4 AI lit section docs.
const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const COURSES = [
  'physics',
  'digital-literacy',
  'Y9Gdhw5MTY8wMFt6Tlvj', // AI lit P4
  'DacjJ93vUDcwqc260OP3', // P5
  'M2MVSXrKuVCD9JQfZZyp', // P7
  'fUw67wFhAtobWFhjwvZ5', // P9
];
const WEEK = new Set(['2026-04-20','2026-04-21','2026-04-22','2026-04-23','2026-04-24']);

const NEW_AI_LAW_URL = '/images/ai-literacy/ai-law-algorithm-justice.png';
const OLD_AI_LAW_URL = 'https://firebasestorage.googleapis.com/v0/b/pantherlearn-d6f7c.firebasestorage.app/o/lesson-images%2Fgeneral%2Fai-literacy-law-algorithm-justice.jpg?alt=media';

async function headCheck(url) {
  if (!url) return { status: 'EMPTY' };
  // Relative URLs = served by pantherlearn.web.app/dist
  const full = url.startsWith('http') ? url : `https://pantherlearn.web.app${url}`;
  try {
    const res = await fetch(full, { method: 'HEAD' });
    return { status: res.status, ct: res.headers.get('content-type') };
  } catch (e) {
    return { status: 'ERROR', err: e.message };
  }
}

(async () => {
  const broken = [];
  let totalChecked = 0, okCount = 0, updatedDocs = 0;

  for (const cid of COURSES) {
    const snap = await db.collection('courses').doc(cid).collection('lessons').get();
    for (const doc of snap.docs) {
      const x = doc.data();
      if (!WEEK.has(x.dueDate)) continue;
      const blocks = x.blocks || [];
      let changed = false;

      for (let i = 0; i < blocks.length; i++) {
        const b = blocks[i];
        if (b.type !== 'image' || !b.url) continue;

        // Patch known broken ai-law URL inline
        if (b.url === OLD_AI_LAW_URL) {
          blocks[i] = { ...b, url: NEW_AI_LAW_URL };
          changed = true;
          console.log(`  🔧 PATCHED ${cid}/${doc.id} [block ${i}]: → ${NEW_AI_LAW_URL}`);
          continue;
        }

        totalChecked++;
        const res = await headCheck(b.url);
        const ok = res.status === 200 && res.ct && res.ct.startsWith('image/');
        if (ok) { okCount++; continue; }

        broken.push({ course: cid, lesson: doc.id, blockIdx: i, url: b.url, status: res.status, alt: b.alt, caption: b.caption });
        console.log(`  ❌ ${cid}/${doc.id} [block ${i}] (due ${x.dueDate}): ${res.status} — ${b.url.substring(0,100)}`);
      }

      if (changed) {
        await doc.ref.update({ blocks });
        updatedDocs++;
      }
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`  Week's image URLs checked: ${totalChecked}`);
  console.log(`  OK: ${okCount}`);
  console.log(`  Broken: ${broken.length}`);
  console.log(`  Docs patched (ai-law URL): ${updatedDocs}`);
  if (broken.length) {
    console.log('\n=== Broken details (need manual fix) ===');
    broken.forEach(b => {
      console.log(`  ${b.course}/${b.lesson} [${b.blockIdx}] status=${b.status}`);
      console.log(`     caption: ${b.caption}`);
      console.log(`     url: ${b.url}`);
    });
  }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
