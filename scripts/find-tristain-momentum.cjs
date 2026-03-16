// Find student "Tristain" (or spelling variants) and check momentum mystery lab data
const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const VARIANTS = ["tristain", "tristan", "tristian"];

function nameMatches(name) {
  if (!name) return false;
  const lower = name.toLowerCase();
  return VARIANTS.some((v) => lower.includes(v));
}

async function findStudent() {
  console.log("=== STEP 1: Search for student ===\n");

  // Search "users" collection
  let found = [];
  const usersSnap = await db.collection("users").get();
  console.log(`users collection: ${usersSnap.size} docs`);
  for (const d of usersSnap.docs) {
    const data = d.data();
    const name = data.name || data.displayName || data.firstName || "";
    const email = data.email || "";
    if (nameMatches(name) || nameMatches(email) || nameMatches(d.id)) {
      found.push({ source: "users", uid: d.id, name, email, data });
      console.log(`  MATCH in users: uid=${d.id}, name="${name}", email="${email}"`);
    }
  }

  // Search "enrollments" collection
  const enrollSnap = await db.collection("enrollments").get();
  console.log(`enrollments collection: ${enrollSnap.size} docs`);
  for (const d of enrollSnap.docs) {
    const data = d.data();
    const name = data.name || data.displayName || data.studentName || "";
    const email = data.email || "";
    const uid = data.uid || data.studentUid || "";
    if (nameMatches(name) || nameMatches(email) || nameMatches(uid)) {
      found.push({ source: "enrollments", docId: d.id, uid, name, email, courseId: data.courseId, data });
      console.log(`  MATCH in enrollments: docId=${d.id}, uid=${uid}, name="${name}", courseId=${data.courseId}`);
    }
  }

  if (found.length === 0) {
    console.log("\nNo matches found. Dumping all user names for manual review...");
    for (const d of usersSnap.docs) {
      const data = d.data();
      const name = data.name || data.displayName || data.firstName || "";
      if (name) console.log(`  ${d.id}: ${name}`);
    }
    return null;
  }

  // Collect unique UIDs
  const uids = [...new Set(found.map((f) => f.uid || f.data?.uid).filter(Boolean))];
  console.log(`\nFound UIDs: ${uids.join(", ")}`);
  return { uids, found };
}

async function checkMomentumData(uids) {
  console.log("\n=== STEP 2: Find physics/momentum course IDs ===\n");

  // Get all courses, look for physics-related ones
  const coursesSnap = await db.collection("courses").get();
  const physicsCourseIds = [];
  for (const d of coursesSnap.docs) {
    const data = d.data();
    const name = (data.name || "").toLowerCase();
    const migrated = data.migratedFrom || "";
    if (name.includes("physics") || migrated === "physics" || d.id.includes("physics")) {
      physicsCourseIds.push(d.id);
      console.log(`  Physics course: ${d.id} (name="${data.name}", migratedFrom="${migrated}")`);
    }
  }

  // Also check all courses for momentumAttempts subcollections
  console.log("\n=== STEP 3: Check momentumAttempts subcollections ===\n");

  for (const course of coursesSnap.docs) {
    const attempts = await db.collection("courses").doc(course.id).collection("momentumAttempts").get();
    if (attempts.empty) continue;

    const courseName = course.data().name || course.id;
    console.log(`Course "${courseName}" (${course.id}) has ${attempts.size} momentum attempt(s)`);

    for (const att of attempts.docs) {
      const data = att.data();
      const studentName = data.studentName || "";
      const isMatch = nameMatches(studentName) || uids.includes(att.id);
      const marker = isMatch ? " *** MATCH ***" : "";
      console.log(`  ${att.id}: ${studentName} | bestXP=${data.bestXP} | cleared=${data.cleared} | ${data.activityLabel}${marker}`);
    }
  }

  console.log("\n=== STEP 4: Check progress collection ===\n");

  for (const uid of uids) {
    console.log(`Checking progress for uid=${uid}...`);

    // Check all course IDs (not just physics) for lesson/activity data
    for (const course of coursesSnap.docs) {
      const courseId = course.id;

      // Check progress/{uid}/courses/{courseId}/lessons/momentum-mystery-lab
      const lessonRef = db.doc(`progress/${uid}/courses/${courseId}/lessons/momentum-mystery-lab`);
      const lessonSnap = await lessonRef.get();
      if (lessonSnap.exists) {
        console.log(`  FOUND: progress/${uid}/courses/${courseId}/lessons/momentum-mystery-lab`);
        console.log(`    Data: ${JSON.stringify(lessonSnap.data(), null, 2)}`);
      }

      // Check progress/{uid}/courses/{courseId}/activities/momentum-mystery-lab
      const actRef = db.doc(`progress/${uid}/courses/${courseId}/activities/momentum-mystery-lab`);
      const actSnap = await actRef.get();
      if (actSnap.exists) {
        console.log(`  FOUND: progress/${uid}/courses/${courseId}/activities/momentum-mystery-lab`);
        console.log(`    Data: ${JSON.stringify(actSnap.data(), null, 2)}`);
      }
    }

    // Also check if there's a top-level progress doc
    const topRef = db.doc(`progress/${uid}`);
    const topSnap = await topRef.get();
    if (topSnap.exists) {
      console.log(`  progress/${uid} top-level doc: ${JSON.stringify(topSnap.data())}`);
    }
  }

  console.log("\n=== STEP 5: Check standalone collections ===\n");

  // Check for any top-level momentum-related collections
  for (const name of ["momentumAttempts", "momentum-attempts", "momentumResults", "momentum-results", "labResults", "lab-results"]) {
    try {
      const snap = await db.collection(name).get();
      if (!snap.empty) {
        console.log(`Found top-level collection "${name}" with ${snap.size} docs`);
        for (const d of snap.docs) {
          const data = d.data();
          console.log(`  ${d.id}: ${JSON.stringify(data)}`);
        }
      }
    } catch (e) {
      // collection doesn't exist, that's fine
    }
  }
}

async function main() {
  const result = await findStudent();
  if (result) {
    await checkMomentumData(result.uids);
  } else {
    console.log("\nCould not find student. Check name spelling or try a broader search.");
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
