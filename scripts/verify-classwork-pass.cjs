const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const C = 'DacjJ93vUDcwqc260OP3', L = 'ai-quests-reflection';
const UIDS = {};
(async () => {
  const rs = await db.collection(`courses/${C}/manaRequests`).where('powerId','==','classwork-pass').get();
  for (const d of rs.docs) UIDS[d.data().studentName] = d.data().studentUid;
  for (const [name, uid] of Object.entries(UIDS)) {
    const s = await db.doc(`progress/${uid}/courses/${C}/lessons/${L}`).get();
    console.log(name, '→', s.exists ? JSON.stringify(s.data()) : 'MISSING');
  }
})();
