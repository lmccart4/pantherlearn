import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = getFirestore();

function getGradeTier(totalScore) {
  if (totalScore >= 2500) return { value: 1.0, label: "Refining", percent: 100 };
  if (totalScore >= 1800) return { value: 0.85, label: "Developing", percent: 85 };
  if (totalScore >= 1200) return { value: 0.65, label: "Approaching", percent: 75 };
  if (totalScore >= 600)  return { value: 0.55, label: "Emerging", percent: 65 };
  return { value: 0, label: "Missing", percent: 55 };
}

const courseId = 'Y9Gdhw5MTY8wMFt6Tlvj'; // Period 4

// Get best standalone score per uid
const allScores = await db.collection('battleship-scores').get();
const scoresByUid = {};
allScores.forEach(d => {
  const data = d.data();
  const uid = data.uid;
  if (!scoresByUid[uid] || data.totalScore > scoresByUid[uid].totalScore) {
    scoresByUid[uid] = data;
  }
});

// Get enrolled students for Period 4
const enrollSnap = await db.collection('enrollments').where('courseId', '==', courseId).get();
const enrolled = [];
enrollSnap.forEach(d => {
  const data = d.data();
  if (data.uid) enrolled.push({ uid: data.uid, email: data.email });
});

// Get existing course-scoped scores
const courseScores = await db.collection('courses').doc(courseId).collection('battleshipAI').get();
const existingUids = new Set();
courseScores.forEach(d => existingUids.add(d.id));

let backfilled = 0;
for (const student of enrolled) {
  if (scoresByUid[student.uid] && !existingUids.has(student.uid)) {
    const s = scoresByUid[student.uid];
    const tier = getGradeTier(s.totalScore);

    // Write to teacher review collection
    await db.doc(`courses/${courseId}/battleshipAI/${student.uid}`).set({
      uid: student.uid,
      studentId: student.uid,
      email: s.email,
      displayName: s.displayName || '',
      score: s.totalScore,
      totalScore: s.totalScore,
      accuracy: s.accuracy,
      outcome: s.outcome,
      enemyShipsSunk: s.enemyShipsSunk || 0,
      playerShipsSurvived: s.playerShipsSurvived || 0,
      combatScore: s.combatScore || 0,
      survivalBonus: s.survivalBonus || 0,
      victoryBonus: s.victoryBonus || 0,
      completedAt: s.completedAt || Timestamp.now(),
    }, { merge: true });

    // Write to progress path for grade pipeline
    await db.doc(`progress/${student.uid}/courses/${courseId}/activities/battleship-ai`).set({
      activityScore: tier.value,
      activityLabel: tier.label,
      activityType: 'battleship-ai',
      activityTitle: 'Battleship AI Literacy',
      gradedAt: Timestamp.now(),
    }, { merge: true });

    console.log(`✅ ${s.email} → ${s.totalScore} pts → ${tier.label} (${tier.percent}%)`);
    backfilled++;
  }
}

console.log(`\n✅ Backfilled ${backfilled} students in Period 4`);
process.exit(0);
