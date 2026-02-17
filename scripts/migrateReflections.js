// scripts/migrateReflections.js
// One-time script to backfill courses/{courseId}/reflections/ from courses/{courseId}/grades/
// Run with: node scripts/migrateReflections.js

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc } from "firebase/firestore";

// Paste your Firebase config here (from src/lib/firebase.js)
const firebaseConfig = {
  apiKey: "AIzaSyAlxvGxLIBUrVO3WWmEcslFpSygeYVeHpY",
  authDomain: "pantherlearn-d6f7c.firebaseapp.com",
  projectId: "pantherlearn-d6f7c",
  storageBucket: "pantherlearn-d6f7c.firebasestorage.app",
  messagingSenderId: "293205883325",
  appId: "1:293205883325:web:c0c21ece0b4fc26f673ad4",
  measurementId: "G-5Y6BKF09HF",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrate() {
  console.log("Fetching courses...");
  const coursesSnap = await getDocs(collection(db, "courses"));
  const courseIds = coursesSnap.docs.map((d) => d.id);
  console.log(`Found ${courseIds.length} courses: ${courseIds.join(", ")}`);

  let total = 0, migrated = 0, skipped = 0;

  for (const courseId of courseIds) {
    console.log(`\nProcessing course: ${courseId}`);
    const gradesSnap = await getDocs(collection(db, "courses", courseId, "grades"));

    for (const gradeDoc of gradesSnap.docs) {
      const data = gradeDoc.data();
      if (data.type !== "reflection") continue;
      total++;

      const { studentId, lessonId } = data;
      if (!studentId || !lessonId) {
        console.log(`  Skipping ${gradeDoc.id} — missing studentId or lessonId`);
        skipped++;
        continue;
      }

      const reflRef = doc(db, "courses", courseId, "reflections", `${studentId}_${lessonId}`);
      const isValid = !data.skipped && data.score > 0;

      await setDoc(reflRef, {
        studentId,
        lessonId,
        response: data.response || "",
        valid: isValid,
        skipped: !!data.skipped,
        savedAt: data.gradedAt || new Date(),
      });

      migrated++;
      console.log(`  ✓ ${studentId} / ${lessonId} — ${isValid ? "valid" : "skipped"}`);
    }
  }

  console.log(`\nDone! ${migrated} reflections migrated, ${skipped} skipped, ${total} total found.`);
  process.exit(0);
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
