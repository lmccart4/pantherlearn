const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
const UID = 'i1ihuORep0UhMUgG7WOPm25g29I2';
const COURSE = 'DacjJ93vUDcwqc260OP3';

(async () => {
  // Reconstruct everything inbound to Diorvis from ALL OTHER STUDENTS' history+transactions
  const studentsCol = db.collection('courses').doc(COURSE).collection('studentMana');
  const all = await studentsCol.get();

  console.log('=== ALL INFLOWS TO DIORVIS (from any student\'s outbound, any source) ===\n');
  const inflows = [];
  for (const s of all.docs) {
    if (s.id === UID) continue;
    const data = s.data();
    // history array on parent doc
    for (const h of (data.history || [])) {
      if (h.recipientUid === UID || h.toUid === UID || /diorvis/i.test(h.recipientName || h.toName || '')) {
        inflows.push({src: `${data.studentName || s.id.slice(0,8)} (history)`, ts: h.ts?.toDate?.() || h.timestamp, type: h.type, amount: h.amount, reason: h.reason, raw: h});
      }
    }
    // transactions subcollection
    const tx = await s.ref.collection('transactions').get();
    for (const t of tx.docs) {
      const x = t.data();
      if (x.recipientUid === UID || /diorvis/i.test(x.recipientName || '')) {
        inflows.push({src: `${data.studentName || s.id.slice(0,8)} (tx)`, ts: x.ts?.toDate?.() || x.timestamp, type: x.type, amount: x.amount, reason: x.reason || x.note, sender: x.senderName, raw: x});
      }
    }
  }
  inflows.sort((a, b) => new Date(a.ts) - new Date(b.ts));
  let total = 0;
  for (const i of inflows) {
    const ts = new Date(i.ts).toISOString();
    total += Math.abs(i.amount || 0);
    console.log(`  ${ts}  +${Math.abs(i.amount||0)}  ${i.type}  from ${i.src}  ${i.reason||''}`);
  }
  console.log(`\n  TOTAL inflows to Diorvis from other students' logs: ${total}`);

  // Also: any direct mage-award transactions in studentMana history that mention Diorvis OR from a Mage
  console.log('\n=== Diorvis own MageDay activities (was-Mage) ===');
  // Pool history of Mages
  const pool = await db.collection('courses').doc(COURSE).collection('mana').doc('pool').get();
  const mh = pool.data().mageHistory || [];
  console.log('  pool.mageHistory:', mh.slice(0, 20));
  if (mh.includes(UID)) console.log('  ✓ Diorvis WAS the Mage on at least one day');
  // Look in his own history array for type=mage_award or kind=mage
  const dD = (await studentsCol.doc(UID).get()).data();
  const ownMage = (dD.history || []).filter(h => /mage/i.test(h.type||'') || /awarded.*to/i.test(h.reason||'') || h.type === 'mage_award');
  console.log(`  ${ownMage.length} entries in his history tagged Mage-side`);
  for (const o of ownMage) console.log('    ', JSON.stringify(o).slice(0, 200));
})();
