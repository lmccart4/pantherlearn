// Quick check: do any students have momentumAttempts in Firestore?
const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const courses = await db.collection("courses").get();
  console.log("Checking", courses.size, "courses for momentumAttempts...\n");

  let total = 0;
  for (const course of courses.docs) {
    const attempts = await db
      .collection("courses")
      .doc(course.id)
      .collection("momentumAttempts")
      .get();
    if (attempts.empty) continue;

    const name = course.data().name || "unnamed";
    console.log(`Course: ${name} (${course.id})`);
    console.log(`  ${attempts.size} attempt(s):`);
    for (const d of attempts.docs) {
      const data = d.data();
      console.log(
        `  - ${data.studentName || d.id} | bestXP: ${data.bestXP} | cleared: ${data.cleared} | ${data.activityLabel}`
      );
      total++;
    }
    console.log();
  }

  if (total === 0) {
    console.log("No momentum lab data found in any course.");
  } else {
    console.log(`Total: ${total} student attempt(s) found.`);
  }
}

check()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
