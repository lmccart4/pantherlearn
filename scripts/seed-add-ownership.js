// seed-add-ownership.js
// ONE-TIME MIGRATION: Adds ownerUid, enrollCode, and sharedWith to existing courses.
// Also adds enrolledCourses[] to existing user docs for enrolled students.
//
// Run: node seed-add-ownership.js
//
// ⚠️  Before running, set YOUR_UID below to your teacher UID from Firebase Auth.

import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from './firebase-config.js';

// ⬇️ SET YOUR TEACHER UID HERE ⬇️
// Find this in Firebase Console → Authentication → Users → copy your UID
const MY_TEACHER_UID = "M2sNE8iH1aZ57L8z8Snp1Sj8cFD2";

function generateCodePrefix(title) {
  const cleaned = title.toUpperCase().replace(/[^A-Z]/g, "");
  const consonants = cleaned.replace(/[AEIOU]/g, "");
  return (consonants.length >= 4 ? consonants : cleaned).slice(0, 4).padEnd(4, "X");
}

function generateCodeSuffix() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

async function migrate() {
  console.log("═══════════════════════════════════════");
  console.log("  PantherLearn Ownership Migration");
  console.log("═══════════════════════════════════════\n");

  if (MY_TEACHER_UID === "YOUR_UID_HERE") {
    console.error("❌ Please set MY_TEACHER_UID in the script before running!");
    process.exit(1);
  }

  // Step 1: Add ownership to all courses
  console.log("Step 1: Adding ownership to courses...\n");
  const coursesSnap = await getDocs(collection(db, "courses"));
  const courses = [];

  for (const courseDoc of coursesSnap.docs) {
    const data = courseDoc.data();
    const updates = {};

    if (!data.ownerUid) {
      updates.ownerUid = MY_TEACHER_UID;
      console.log(`  📝 ${courseDoc.id}: Setting owner to ${MY_TEACHER_UID}`);
    }

    if (!data.enrollCode) {
      const prefix = generateCodePrefix(data.title || courseDoc.id);
      updates.enrollCode = `${prefix}-${generateCodeSuffix()}`;
      console.log(`  🔑 ${courseDoc.id}: Generated enroll code ${updates.enrollCode}`);
    }

    if (!data.sharedWith) {
      updates.sharedWith = [];
    }

    if (Object.keys(updates).length > 0) {
      await updateDoc(doc(db, "courses", courseDoc.id), updates);
    } else {
      console.log(`  ✅ ${courseDoc.id}: Already has ownership fields`);
    }

    courses.push({ id: courseDoc.id, ...data, ...updates });
  }

  // Step 2: Add teacherUid to enrollment docs
  console.log("\nStep 2: Adding teacherUid to enrollments...\n");
  const enrollSnap = await getDocs(collection(db, "enrollments"));
  let enrollUpdated = 0;

  for (const enrollDoc of enrollSnap.docs) {
    const data = enrollDoc.data();
    if (!data.teacherUid) {
      // Find the course owner
      const course = courses.find((c) => c.id === data.courseId);
      if (course) {
        await updateDoc(doc(db, "enrollments", enrollDoc.id), {
          teacherUid: course.ownerUid || MY_TEACHER_UID,
        });
        enrollUpdated++;
      }
    }
  }
  console.log(`  Updated ${enrollUpdated} enrollment docs`);

  // Step 3: Add enrolledCourses[] to user docs
  console.log("\nStep 3: Adding enrolledCourses to user docs...\n");
  // Build map: studentUid → Set of courseIds
  const studentCourses = {};
  for (const enrollDoc of enrollSnap.docs) {
    const data = enrollDoc.data();
    const uid = data.uid || data.studentUid;
    if (uid) {
      if (!studentCourses[uid]) studentCourses[uid] = new Set();
      studentCourses[uid].add(data.courseId);
    }
  }

  let usersUpdated = 0;
  for (const [uid, courseIds] of Object.entries(studentCourses)) {
    try {
      await updateDoc(doc(db, "users", uid), {
        enrolledCourses: Array.from(courseIds),
      });
      usersUpdated++;
    } catch (e) {
      console.log(`  ⚠️  Could not update user ${uid}: ${e.message}`);
    }
  }
  console.log(`  Updated ${usersUpdated} user docs`);

  // Summary
  console.log("\n═══════════════════════════════════════");
  console.log("  Migration Complete!");
  console.log("═══════════════════════════════════════");
  console.log(`  Courses: ${courses.length}`);
  console.log(`  Enroll codes generated:`);
  courses.forEach((c) => {
    console.log(`    ${c.title || c.id}: ${c.enrollCode}`);
  });
  console.log(`  Enrollments updated: ${enrollUpdated}`);
  console.log(`  User docs updated: ${usersUpdated}`);
  console.log("\n  Next steps:");
  console.log("  1. Deploy the updated Dashboard.jsx");
  console.log("  2. Share the enroll codes with your students");
  console.log("  3. New students can join via the 🔑 Join a Course button\n");

  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
