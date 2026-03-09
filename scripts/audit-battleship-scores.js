import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = getFirestore();

const periods = [
  { id: 'Y9Gdhw5MTY8wMFt6Tlvj', label: 'Period 4' },
  { id: 'DacjJ93vUDcwqc260OP3',  label: 'Period 5' },
  { id: 'M2MVSXrKuVCD9JQfZZyp', label: 'Period 7' },
  { id: 'fUw67wFhAtobWFhjwvZ5',  label: 'Period 9' },
];

function getGradeTier(totalScore) {
  if (totalScore >= 2500) return { value: 1.0, label: "Refining", percent: 100 };
  if (totalScore >= 1800) return { value: 0.85, label: "Developing", percent: 85 };
  if (totalScore >= 1200) return { value: 0.65, label: "Approaching", percent: 75 };
  if (totalScore >= 600)  return { value: 0.55, label: "Emerging", percent: 65 };
  return { value: 0, label: "Missing", percent: 55 };
}

// Get all standalone battleship scores, keep best per uid
const allScores = await db.collection('battleship-scores').get();
const scoresByUid = {};
allScores.forEach(d => {
  const data = d.data();
  const uid = data.uid;
  if (!scoresByUid[uid] || data.totalScore > scoresByUid[uid].totalScore) {
    scoresByUid[uid] = { ...data, docId: d.id };
  }
});

console.log('Total unique students with standalone scores:', Object.keys(scoresByUid).length);
console.log();

const allMissing = [];

for (const period of periods) {
  console.log('═══ ' + period.label + ' (' + period.id + ') ═══');

  // Get students with course-scoped scores already
  const courseScores = await db.collection('courses').doc(period.id).collection('battleshipAI').get();
  const courseUids = new Set();
  courseScores.forEach(d => courseUids.add(d.id));

  // Also check progress path
  const progressUids = new Set();

  // Get enrolled students
  const enrollSnap = await db.collection('enrollments').where('courseId', '==', period.id).get();
  const enrolled = [];
  enrollSnap.forEach(d => {
    const data = d.data();
    if (data.uid) enrolled.push({ uid: data.uid, email: data.email });
  });

  // Find enrolled students who have standalone scores but no course-scoped score
  const missing = [];
  for (const student of enrolled) {
    if (scoresByUid[student.uid] && !courseUids.has(student.uid)) {
      const s = scoresByUid[student.uid];
      const tier = getGradeTier(s.totalScore);
      missing.push({ uid: student.uid, email: student.email, totalScore: s.totalScore, accuracy: s.accuracy, outcome: s.outcome, tier, courseId: period.id, periodLabel: period.label, displayName: s.displayName || '' });
    }
  }

  // Also check for students with course-scoped score but no progress entry
  for (const student of enrolled) {
    if (courseUids.has(student.uid)) {
      const progSnap = await db.doc(`progress/${student.uid}/courses/${period.id}/activities/battleship-ai`).get();
      if (!progSnap.exists) {
        const courseDoc = await db.doc(`courses/${period.id}/battleshipAI/${student.uid}`).get();
        const data = courseDoc.data();
        console.log('  ⚠️  ' + student.email + ' has course score but NO progress entry');
      }
    }
  }

  console.log('  Enrolled: ' + enrolled.length);
  console.log('  Have course-scoped score: ' + courseUids.size);
  console.log('  Missing (standalone only): ' + missing.length);
  if (missing.length > 0) {
    missing.forEach(m => {
      console.log('    ❌ ' + m.email + ' → ' + m.totalScore + ' pts (' + m.accuracy + '%, ' + m.outcome + ') → would be ' + m.tier.label + ' (' + m.tier.percent + '%)');
    });
  }
  allMissing.push(...missing);
  console.log();
}

console.log('═══ SUMMARY ═══');
console.log('Total students needing backfill:', allMissing.length);
allMissing.forEach(m => {
  console.log('  ' + m.periodLabel + ': ' + m.email + ' → ' + m.totalScore + ' pts → ' + m.tier.label);
});

process.exit(0);
