// Backfill progress docs for Space Rescue from existing spaceRescue data
// Reads courses/{courseId}/spaceRescue, finds best attempt per student,
// computes score, writes to progress/{uid}/courses/{courseId}/activities/space-rescue
const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

function scoreCalc(sub) {
  const levelsCompleted = sub.levelsCompleted || 0;
  const bestLevel = sub.bestLevel || 0;
  const bestOxygenRemaining = sub.bestOxygenRemaining || 0;
  let score = Math.min(levelsCompleted * 25, 100);
  if (bestLevel >= 3) score = Math.min(score + Math.round(bestOxygenRemaining / 6), 100);
  return score;
}

function scoreToLabel(score) {
  if (score >= 90) return "Expert";
  if (score >= 80) return "Advanced";
  if (score >= 70) return "Proficient";
  if (score >= 60) return "Developing";
  if (score >= 50) return "Emerging";
  return "Beginning";
}

async function backfill() {
  const courses = await db.collection("courses").get();
  let total = 0;

  for (const course of courses.docs) {
    const snap = await db.collection("courses").doc(course.id).collection("spaceRescue").get();
    if (snap.empty) continue;

    const courseName = course.data().name || course.id;
    console.log(`Course: ${courseName} (${course.id})`);

    // Group by uid and find best attempt per student
    const byStudent = {};
    for (const d of snap.docs) {
      const data = d.data();
      const uid = data.uid;
      if (!uid) continue;
      if (!byStudent[uid] || (data.levelsCompleted || 0) > (byStudent[uid].levelsCompleted || 0)) {
        byStudent[uid] = data;
      }
    }

    for (const [uid, best] of Object.entries(byStudent)) {
      const score = scoreCalc(best);
      const label = `${scoreToLabel(score)} (${score}%)`;

      const ref = db.doc(`progress/${uid}/courses/${course.id}/activities/space-rescue`);
      await ref.set({
        activityScore: score / 100,
        activityLabel: label,
        activityType: "space-rescue",
        activityTitle: "Space Rescue Mission",
        levelsCompleted: best.levelsCompleted || 0,
        bestLevel: best.bestLevel || 0,
        gradedAt: best.completedAt || new Date(),
      }, { merge: true });

      console.log(`  ✓ ${best.studentName || uid} — ${label} (${best.levelsCompleted || 0} levels)`);
      total++;
    }
    console.log();
  }

  console.log(`Backfilled ${total} progress docs.`);
}

backfill().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
