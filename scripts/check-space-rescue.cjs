// Check Space Rescue data in both locations
const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const courses = await db.collection("courses").get();

  for (const course of courses.docs) {
    // Space Rescue is courseScoped, so check courses/{courseId}/spaceRescue
    const rescueSnap = await db.collection("courses").doc(course.id).collection("spaceRescue").get();
    if (rescueSnap.empty) continue;

    const name = course.data().name || course.id;
    console.log(`Course: ${name} (${course.id})`);
    console.log(`  ${rescueSnap.size} spaceRescue doc(s):\n`);

    for (const d of rescueSnap.docs) {
      const data = d.data();
      console.log(`  Student: ${data.studentName || data.displayName || d.id}`);
      console.log(`    uid field: ${data.uid || "MISSING"}`);
      console.log(`    studentId field: ${data.studentId || "MISSING"}`);
      console.log(`    levelsCompleted: ${data.levelsCompleted}`);
      console.log(`    bestLevel: ${data.bestLevel}`);
      console.log(`    completedAt: ${data.completedAt ? "yes" : "MISSING"}`);
      console.log(`    score: ${data.score}`);
      console.log(`    doc ID: ${d.id}`);

      // Check progress doc
      const progressSnap = await db.doc(`progress/${d.id}/courses/${course.id}/activities/space-rescue`).get();
      console.log(`    progress doc: ${progressSnap.exists ? "EXISTS" : "MISSING"}`);
      if (progressSnap.exists) {
        const pData = progressSnap.data();
        console.log(`      activityScore: ${pData.activityScore}, label: ${pData.activityLabel}`);
      }
      console.log();
    }
  }
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
