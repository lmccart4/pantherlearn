const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const P5 = 'DacjJ93vUDcwqc260OP3';

async function main() {
  const reqSnap = await db.collection(`courses/${P5}/manaRequests`)
    .where('powerId', '==', 'classwork-pass').get();

  const lessonSnap = await db.collection(`courses/${P5}/lessons`).get();
  const lessons = lessonSnap.docs.map(d => ({ id: d.id, title: (d.data().title || '').trim(), visible: d.data().visible !== false }));

  function matchLesson(details) {
    const d = (details || '').toLowerCase().trim();
    if (!d) return null;
    // Exact
    let m = lessons.find(l => l.title.toLowerCase() === d);
    if (m) return { ...m, score: 'exact' };
    // Contains
    m = lessons.find(l => l.title.toLowerCase().includes(d) || d.includes(l.title.toLowerCase()));
    if (m) return { ...m, score: 'contains' };
    // Word-overlap fallback (>=2 common words >3 chars)
    const words = d.split(/\s+/).filter(w => w.length > 3);
    let best = null, bestN = 0;
    for (const l of lessons) {
      const tw = l.title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      const common = words.filter(w => tw.includes(w)).length;
      if (common > bestN) { bestN = common; best = l; }
    }
    return best && bestN >= 2 ? { ...best, score: `word-overlap:${bestN}` } : null;
  }

  console.log(`Found ${reqSnap.size} classwork-pass request(s) in Period 5\n`);
  const rows = [];
  for (const doc of reqSnap.docs) {
    const d = doc.data();
    const match = matchLesson(d.details);
    rows.push({ reqId: doc.id, student: d.studentName, details: d.details, status: d.status, createdAt: d.createdAt, match });
  }
  rows.sort((a,b) => String(a.createdAt).localeCompare(String(b.createdAt)));

  for (const r of rows) {
    const m = r.match;
    console.log(`[${r.createdAt}] ${r.student} (status=${r.status})`);
    console.log(`  wrote: "${r.details}"`);
    if (m) console.log(`  match: ${m.title}  (id=${m.id}, score=${m.score}, visible=${m.visible})`);
    else    console.log(`  match: NONE — needs manual pick`);
    console.log(`  reqId: ${r.reqId}`);
    console.log();
  }

  // Write JSON for the apply step
  const fs = require('fs');
  fs.writeFileSync('/tmp/classwork-pass-audit.json', JSON.stringify(rows, null, 2));
  console.log(`Wrote /tmp/classwork-pass-audit.json`);
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
