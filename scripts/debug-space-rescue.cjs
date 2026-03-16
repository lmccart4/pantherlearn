const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

async function check() {
  const courses = await db.collection("courses").get();
  console.log(`Checking ${courses.size} courses...\n`);

  for (const course of courses.docs) {
    const name = course.data().name || course.data().title || course.id;
    const snap = await db.collection("courses").doc(course.id).collection("spaceRescue").get();
    console.log(`${name} (${course.id}): ${snap.size} spaceRescue docs`);
    if (snap.size > 0) {
      snap.docs.slice(0, 3).forEach(d => {
        console.log(`  Sample:`, JSON.stringify(d.data(), null, 2).slice(0, 300));
      });
    }
  }

  // Also check if spaceRescue exists as a top-level collection
  console.log("\nChecking top-level spaceRescue collection...");
  const topSnap = await db.collection("spaceRescue").get();
  console.log(`Top-level spaceRescue: ${topSnap.size} docs`);
  if (topSnap.size > 0) {
    topSnap.docs.slice(0, 3).forEach(d => {
      console.log(`  Sample:`, JSON.stringify(d.data(), null, 2).slice(0, 300));
    });
  }
}

check().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
