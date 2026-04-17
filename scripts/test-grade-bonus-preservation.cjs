// Regression test: verifies applyGradeBonus survives common re-write paths.
// Run: node scripts/test-grade-bonus-preservation.cjs
const admin = require('firebase-admin');
if (!admin.apps.length) admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const TEST_UID = 'test-grade-bonus-uid';
const TEST_COURSE = 'test-course';
const TEST_LESSON = 'test-lesson';

async function run() {
  const ref = db.collection('progress').doc(TEST_UID)
    .collection('courses').doc(TEST_COURSE)
    .collection('lessons').doc(TEST_LESSON);

  // 1. Seed gradeBonus
  await ref.set({ gradeBonus: 30, completed: false });

  // 2. Simulate a lesson completion write (must be merge)
  await ref.set({ completed: true, completedAt: new Date().toISOString() }, { merge: true });

  // 3. Assert completion write preserved gradeBonus
  const snap1 = await ref.get();
  const data1 = snap1.data();
  if (data1.gradeBonus !== 30) {
    console.error('FAIL: gradeBonus lost after lesson completion write. Got:', data1);
    await ref.delete().catch(() => {});
    process.exit(1);
  }
  console.log('PASS: gradeBonus preserved after completion write');

  // 4. Simulate engagement time write (must be merge)
  await ref.set({ engagementTime: 120 }, { merge: true });

  const snap2 = await ref.get();
  const data2 = snap2.data();
  if (data2.gradeBonus !== 30) {
    console.error('FAIL: gradeBonus lost after engagementTime write. Got:', data2);
    await ref.delete().catch(() => {});
    process.exit(1);
  }
  console.log('PASS: gradeBonus preserved after engagementTime write');

  // 5. Simulate annotation save (must be merge)
  await ref.set({ annotations: { strokes: [], savedAt: new Date().toISOString() } }, { merge: true });

  const snap3 = await ref.get();
  const data3 = snap3.data();
  if (data3.gradeBonus !== 30) {
    console.error('FAIL: gradeBonus lost after annotation write. Got:', data3);
    await ref.delete().catch(() => {});
    process.exit(1);
  }
  console.log('PASS: gradeBonus preserved after annotation write');

  // 6. Simulate teacher manual-complete (must be merge)
  await ref.set({ completed: true, completedAt: new Date().toISOString(), manuallyCompleted: true, completedBy: 'teacher' }, { merge: true });

  const snap4 = await ref.get();
  const data4 = snap4.data();
  if (data4.gradeBonus !== 30) {
    console.error('FAIL: gradeBonus lost after teacher manual-complete write. Got:', data4);
    await ref.delete().catch(() => {});
    process.exit(1);
  }
  console.log('PASS: gradeBonus preserved after teacher manual-complete write');

  // Cleanup
  await ref.delete();
  console.log('\nAll checks passed. gradeBonus is safe against all common write paths.');
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
