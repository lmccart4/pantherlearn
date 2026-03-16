// Check if momentum lab grades exist in the progress collection (what MyGrades reads)
const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  // First get all students who have momentumAttempts
  const courses = await db.collection("courses").get();

  for (const course of courses.docs) {
    const attempts = await db.collection("courses").doc(course.id).collection("momentumAttempts").get();
    if (attempts.empty) continue;

    console.log(`Course: ${course.data().name || course.id}\n`);
    console.log("Checking progress/activities docs for each student...\n");

    for (const att of attempts.docs) {
      const uid = att.id;
      const data = att.data();
      const name = data.studentName || uid;

      // Check if progress/{uid}/courses/{courseId}/activities/momentum-mystery-lab exists
      const progressRef = db.doc(`progress/${uid}/courses/${course.id}/activities/momentum-mystery-lab`);
      const progressSnap = await progressRef.get();

      if (progressSnap.exists) {
        const pData = progressSnap.data();
        console.log(`  ✓ ${name} — progress doc exists (score: ${pData.activityScore}, label: ${pData.activityLabel})`);
      } else {
        console.log(`  ✗ ${name} — NO progress doc (momentumAttempts has bestXP: ${data.bestXP}, label: ${data.activityLabel})`);
      }
    }
  }
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
