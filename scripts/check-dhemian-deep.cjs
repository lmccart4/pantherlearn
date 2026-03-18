const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const UID = "qJ5CCFsZvfXo20tS2eTAHuaI1zw2";

async function check() {
  // Check the user doc itself
  const userDoc = await db.doc(`users/${UID}`).get();
  console.log("User doc:", JSON.stringify(userDoc.data(), null, 2));

  // Try courseId on the user
  const userData = userDoc.data();
  if (userData?.courseId) {
    console.log("\nUser's courseId:", userData.courseId);
    const lessons = await db.collection(`courses/${userData.courseId}/lessons`).get();
    for (const l of lessons.docs) {
      const p = await db.doc(`courses/${userData.courseId}/lessons/${l.id}/progress/${UID}`).get();
      if (p.exists) console.log(`  Progress: ${l.id}:`, JSON.stringify(p.data()));
    }
  }

  // Check any battleship-related progress collection globally via collectionGroup
  const battleshipProgress = await db.collectionGroup("progress")
    .where("studentId", "==", UID).get();
  console.log("\nCollectionGroup progress hits:", battleshipProgress.size);
  battleshipProgress.docs.forEach(d => console.log(" ", d.ref.path, JSON.stringify(d.data())));
}

check().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
