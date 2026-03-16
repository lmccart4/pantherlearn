const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  // Pick the physics course since it has momentum data
  const courseId = "physics";

  // Get enrollments
  const enrollSnap = await db.collection("enrollments").where("courseId", "==", courseId).get();
  console.log(`Enrollments for ${courseId}: ${enrollSnap.size}\n`);

  let withEmail = 0, withoutEmail = 0;
  for (const d of enrollSnap.docs) {
    const data = d.data();
    const uid = data.uid || data.studentUid;
    const enrollEmail = data.email || "";

    // Check user doc for email
    let userEmail = "";
    if (uid) {
      const userSnap = await db.doc(`users/${uid}`).get();
      if (userSnap.exists) userEmail = userSnap.data().email || "";
    }

    const email = enrollEmail || userEmail;
    const name = data.name || data.displayName || uid?.slice(0, 12) || "unknown";

    if (email) {
      withEmail++;
      console.log(`  ✓ ${name} | email: ${email}`);
    } else {
      withoutEmail++;
      console.log(`  ✗ ${name} | NO EMAIL (uid: ${uid || "none"}, enrollEmail: ${enrollEmail})`);
    }
  }

  console.log(`\nWith email: ${withEmail}, Without: ${withoutEmail}`);
}

check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
