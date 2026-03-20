/**
 * Cleanup Duplicate Lessons
 *
 * Deletes specific duplicate lessons from PantherLearn Firestore.
 * Safety: checks for student progress subcollections before deleting.
 * Skips any lesson that has real student progress (excludes "Joe" / test accounts).
 */

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

// Map friendly names to actual Firestore courseIds
const COURSE_MAP = {
  "digital-literacy": "digital-literacy",
  "ai-literacy-p4": "Y9Gdhw5MTY8wMFt6Tlvj",
  "ai-literacy-p5": "DacjJ93vUDcwqc260OP3",
  "ai-literacy-p7": "M2MVSXrKuVCD9JQfZZyp",
  "ai-literacy-p9": "fUw67wFhAtobWFhjwvZ5",
};

// All lessons to delete, grouped by course
const LESSONS_TO_DELETE = {
  "digital-literacy": [
    "understanding-your-audience",
    "the-hook",
    "visual-hierarchy",
    "infographics",
    "infographic-workshop",
    "thumbnail-cover-art",
    "writing-for-screens",
    "content-calendar",
    "content-showcase",
    "creator-economy",
    "finding-your-niche",
    "value-proposition",
    "branding-101",
    "revenue-models",
    "landing-pages",
    "marketing-on-zero",
    "pitch-deck",
    "pitch-practice",
    "pitch-day",
  ],
  "ai-literacy-p4": [
    "07862ecb",   // Prompt Duel stub
    "a8fcf536",   // Ethics Courtroom stub
  ],
  "ai-literacy-p5": [
    "07862ecb",               // Prompt Duel stub
    "a8fcf536",               // Ethics Courtroom stub
    "attention-is-all-you-need", // hidden dupe
    "15d68c40",               // Bias Detective stub
    "36da9be4",               // Is It Biased hidden dupe
    "60493b89",               // Data Labeling Lab
    "68262ca3",               // Guess Who
    "bfcdb80a",               // Art of Asking
  ],
  "ai-literacy-p7": [
    "36da9be4",               // Is It Biased hidden
    "07862ecb",               // Prompt Duel stub
    "15d68c40",               // Bias Detective stub
    "attention-is-all-you-need", // hidden
    "3cc3a344",               // Guess Who
    "a8042d2e",               // Art of Asking (template copy)
    "a8fcf536",               // Ethics Courtroom stub
  ],
  "ai-literacy-p9": [
    "15d68c40",               // Bias Detective stub
    "07862ecb",               // Prompt Duel stub
    "14c00425",               // Data Labeling Lab
    "attention-is-all-you-need", // hidden
    "36da9be4",               // Is It Biased hidden
    "embeddings-intro",       // dupe
    "neural-networks-intro",  // dupe
    "8617db87",               // Guess Who
    "a8fcf536",               // Ethics Courtroom stub
  ],
};

/**
 * Check if a lesson has real student progress (excluding Joe / test accounts).
 * Returns { hasRealProgress, realCount, names }
 */
async function checkProgress(courseId, lessonId) {
  const progressRef = db.collection(`courses/${courseId}/lessons/${lessonId}/progress`);
  const snap = await progressRef.get();

  if (snap.empty) {
    return { hasRealProgress: false, realCount: 0, names: [] };
  }

  const realDocs = snap.docs.filter(doc => {
    const data = doc.data();
    const name = (data.studentName || data.name || doc.id || "").toLowerCase();
    return name !== "joe" && name !== "test" && !name.includes("test");
  });

  return {
    hasRealProgress: realDocs.length > 0,
    realCount: realDocs.length,
    names: realDocs.slice(0, 5).map(d => {
      const data = d.data();
      return data.studentName || data.name || d.id;
    }),
  };
}

async function main() {
  console.log("=== DUPLICATE LESSON CLEANUP ===\n");

  let totalDeleted = 0;
  let totalSkippedProgress = 0;
  let totalSkippedMissing = 0;
  const skippedDetails = [];

  for (const [courseLabel, lessonIds] of Object.entries(LESSONS_TO_DELETE)) {
    const courseId = COURSE_MAP[courseLabel];
    console.log(`\n--- ${courseLabel} (${courseId}) — ${lessonIds.length} lessons to delete ---`);

    for (const lessonId of lessonIds) {
      const docPath = `courses/${courseId}/lessons/${lessonId}`;
      const docRef = db.collection("courses").doc(courseId).collection("lessons").doc(lessonId);

      // Check if document exists
      const docSnap = await docRef.get();
      if (!docSnap.exists) {
        console.log(`  SKIP (not found): ${docPath}`);
        totalSkippedMissing++;
        continue;
      }

      const data = docSnap.data();
      const title = data.title || "(no title)";

      // Safety check: look for real student progress
      const progress = await checkProgress(courseId, lessonId);

      if (progress.hasRealProgress) {
        console.log(`  ⚠ SKIP (has progress): ${docPath}`);
        console.log(`    Title: ${title}`);
        console.log(`    Real students: ${progress.realCount} — ${progress.names.join(", ")}`);
        totalSkippedProgress++;
        skippedDetails.push({ path: docPath, title, students: progress.realCount, names: progress.names });
        continue;
      }

      // Safe to delete
      await docRef.delete();
      console.log(`  DELETED: ${docPath} — "${title}"`);
      totalDeleted++;
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("=== SUMMARY ===");
  console.log(`  Deleted:              ${totalDeleted}`);
  console.log(`  Skipped (progress):   ${totalSkippedProgress}`);
  console.log(`  Skipped (not found):  ${totalSkippedMissing}`);
  console.log(`  Total processed:      ${totalDeleted + totalSkippedProgress + totalSkippedMissing}`);

  if (skippedDetails.length > 0) {
    console.log("\n--- SKIPPED DUE TO STUDENT PROGRESS ---");
    for (const s of skippedDetails) {
      console.log(`  ${s.path} — "${s.title}" — ${s.students} students: ${s.names.join(", ")}`);
    }
  }

  console.log("\n=== CLEANUP COMPLETE ===");
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
