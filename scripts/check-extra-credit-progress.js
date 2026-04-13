import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();
const snap = await db.collectionGroup('progress')
  .where('lessonId', '==', 'energy-audit-extra-credit')
  .get();
console.log('Progress docs found:', snap.size);
snap.forEach(d => console.log(' -', d.ref.path));
process.exit(0);
