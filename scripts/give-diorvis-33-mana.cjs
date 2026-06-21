// One-time: restore the 33 mana of legitimate peer donations Diorvis received
// before the 2026-05-29 mana correction. The correction zeroed his balance
// because his senders' pools were tainted, but the senders themselves got
// their own corrections — the 33 mana flowing TO Diorvis was legitimate
// from his perspective and is now being added back.
//
//   +2  from Eduardo Morel (2026-04-24)
//   +5  from Sebastian Rivas Barrios (2026-04-24)
//   +26 from Eduardo Morel (2026-05-27)
//   ────
//   +33 total
//
// Append-only history entry. Balance increments via FieldValue.increment so
// any concurrent write (a Mage award, a donation) can't overwrite the change.

const admin = require('firebase-admin');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

const UID    = 'i1ihuORep0UhMUgG7WOPm25g29I2';
const COURSE = 'DacjJ93vUDcwqc260OP3';
const AMOUNT = 33;

(async () => {
  const ref = db.collection('courses').doc(COURSE).collection('studentMana').doc(UID);
  const before = await ref.get();
  if (!before.exists) { console.error('No studentMana doc — aborting.'); process.exit(1); }
  const b = before.data();
  console.log(`BEFORE: balance=${b.balance}  lifetimeEarned=${b.lifetimeEarned}  history.length=${(b.history||[]).length}`);

  const entry = {
    amount: AMOUNT,
    type: "adjustment",
    reason: "Mana restored: peer donations you received on 4/24 (+2 from Eduardo, +5 from Sebastian) and 5/27 (+26 from Eduardo) were voided by the 5/29 correction because the senders' pools were tainted. Those senders got their own corrections, but the 33 mana coming TO you was legit from your side — adding it back.",
    timestamp: new Date().toISOString(),
    ts: admin.firestore.Timestamp.now(),
  };

  await ref.update({
    balance: FieldValue.increment(AMOUNT),
    history: FieldValue.arrayUnion(entry),
    lastUpdated: admin.firestore.Timestamp.now(),
  });

  const after = await ref.get();
  const a = after.data();
  console.log(`AFTER:  balance=${a.balance}  lifetimeEarned=${a.lifetimeEarned}  history.length=${(a.history||[]).length}`);
  console.log(`Delta:  +${a.balance - b.balance}`);
})();
