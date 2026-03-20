/**
 * Migrate Orphaned Progress
 *
 * Migrates student progress from deleted lesson IDs to kept lesson IDs.
 * Only processes mappings that the audit confirmed have orphaned progress.
 *
 * Safety:
 *  - Uses .set() with { merge: true } to avoid overwriting other fields
 *  - Does NOT delete orphaned docs (left for manual cleanup)
 *  - Excludes test students (displayName contains "Joe" or "test")
 *  - Logs every operation in detail
 */

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

// Only the mappings confirmed to have orphaned progress
const MIGRATIONS = [
  // ai-literacy-p5
  { courseLabel: "ai-literacy-p5", courseId: "DacjJ93vUDcwqc260OP3", deletedId: "60493b89", keptId: "7f6e8030", lessonName: "Data Labeling Lab" },
  { courseLabel: "ai-literacy-p5", courseId: "DacjJ93vUDcwqc260OP3", deletedId: "68262ca3", keptId: "f836b893", lessonName: "Guess Who" },
  { courseLabel: "ai-literacy-p5", courseId: "DacjJ93vUDcwqc260OP3", deletedId: "bfcdb80a", keptId: "a8042d2e", lessonName: "Art of Asking" },
  // ai-literacy-p7
  { courseLabel: "ai-literacy-p7", courseId: "M2MVSXrKuVCD9JQfZZyp", deletedId: "3cc3a344", keptId: "f836b893", lessonName: "Guess Who" },
  { courseLabel: "ai-literacy-p7", courseId: "M2MVSXrKuVCD9JQfZZyp", deletedId: "a8042d2e", keptId: "7e348ccf", lessonName: "Art of Asking" },
  // ai-literacy-p9
  { courseLabel: "ai-literacy-p9", courseId: "fUw67wFhAtobWFhjwvZ5", deletedId: "14c00425", keptId: "7f6e8030", lessonName: "Data Labeling Lab" },
  { courseLabel: "ai-literacy-p9", courseId: "fUw67wFhAtobWFhjwvZ5", deletedId: "8617db87", keptId: "f836b893", lessonName: "Guess Who" },
];

async function main() {
  console.log("=== ORPHANED PROGRESS MIGRATION ===\n");

  // Step 1: Load users to get display names and identify test accounts
  console.log("Loading users collection...");
  const usersSnap = await db.collection("users").get();
  const excludeUids = new Set();
  const userNames = {}; // uid → displayName

  for (const doc of usersSnap.docs) {
    const data = doc.data();
    const name = (data.displayName || "").trim();
    userNames[doc.id] = name || doc.id;

    const nameLower = name.toLowerCase();
    if (nameLower.includes("joe") || nameLower.includes("test")) {
      excludeUids.add(doc.id);
    }
  }
  console.log(`  Total users: ${usersSnap.size}`);
  console.log(`  Excluded (Joe/test): ${excludeUids.size}`);

  // Step 2: Get all student UIDs from progress collection
  console.log("\nLoading student UIDs from progress/ collection...");
  const progressRefs = await db.collection("progress").listDocuments();
  const allStudentUids = progressRefs.map(ref => ref.id).filter(uid => !excludeUids.has(uid));
  console.log(`  Total progress docs: ${progressRefs.length}`);
  console.log(`  After excluding test accounts: ${allStudentUids.length}\n`);

  // Counters
  let totalCopied = 0;
  let totalMerged = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  const courseStats = {};

  // Step 3: Process each migration mapping
  for (const migration of MIGRATIONS) {
    const { courseLabel, courseId, deletedId, keptId, lessonName } = migration;
    console.log("=".repeat(100));
    console.log(`${lessonName} | ${courseLabel} | ${deletedId} → ${keptId}`);
    console.log("=".repeat(100));

    if (!courseStats[courseLabel]) {
      courseStats[courseLabel] = { copied: 0, merged: 0, skipped: 0 };
    }

    let mappingCopied = 0;
    let mappingMerged = 0;
    let mappingSkipped = 0;

    for (const uid of allStudentUids) {
      const studentName = userNames[uid] || uid;

      // Read orphaned progress doc
      const deletedRef = db.doc(`progress/${uid}/courses/${courseId}/lessons/${deletedId}`);
      const deletedSnap = await deletedRef.get();

      if (!deletedSnap.exists) continue;

      const deletedData = deletedSnap.data();
      const deletedAnswers = deletedData.answers || {};
      const deletedAnswerCount = Object.keys(deletedAnswers).length;

      // Skip if orphaned doc has no meaningful data
      if (deletedAnswerCount === 0 && !deletedData.completed) {
        console.log(`  SKIP  | ${studentName} | empty orphaned doc (no answers, not completed)`);
        mappingSkipped++;
        totalSkipped++;
        courseStats[courseLabel].skipped++;
        continue;
      }

      // Read kept progress doc
      const keptRef = db.doc(`progress/${uid}/courses/${courseId}/lessons/${keptId}`);
      const keptSnap = await keptRef.get();

      try {
        if (!keptSnap.exists) {
          // Case: No kept doc exists — copy orphaned data as-is
          await keptRef.set(deletedData, { merge: true });
          console.log(`  COPY  | ${studentName} | ${deletedAnswerCount} answers, completed=${deletedData.completed || false}`);
          mappingCopied++;
          totalCopied++;
          courseStats[courseLabel].copied++;
        } else {
          // Case: Kept doc exists — MERGE
          const keptData = keptSnap.data();
          const keptAnswers = keptData.answers || {};
          const keptAnswerCount = Object.keys(keptAnswers).length;

          // Merge answers: add orphaned keys that don't exist in kept
          const mergedAnswers = { ...keptAnswers };
          let newAnswersAdded = 0;
          for (const [blockId, answer] of Object.entries(deletedAnswers)) {
            if (!(blockId in mergedAnswers)) {
              mergedAnswers[blockId] = answer;
              newAnswersAdded++;
            }
          }

          // Merge completed: true if either is true
          const mergedCompleted = (keptData.completed || false) || (deletedData.completed || false);

          // Merge timestamps: use the more recent one
          const keptLastUpdated = keptData.lastUpdated;
          const deletedLastUpdated = deletedData.lastUpdated;
          let mergedLastUpdated = keptLastUpdated;
          if (deletedLastUpdated && keptLastUpdated) {
            const dTime = deletedLastUpdated.toMillis ? deletedLastUpdated.toMillis() : deletedLastUpdated;
            const kTime = keptLastUpdated.toMillis ? keptLastUpdated.toMillis() : keptLastUpdated;
            if (dTime > kTime) mergedLastUpdated = deletedLastUpdated;
          } else if (deletedLastUpdated && !keptLastUpdated) {
            mergedLastUpdated = deletedLastUpdated;
          }

          const keptCompletedAt = keptData.completedAt;
          const deletedCompletedAt = deletedData.completedAt;
          let mergedCompletedAt = keptCompletedAt;
          if (deletedCompletedAt && keptCompletedAt) {
            const dTime = deletedCompletedAt.toMillis ? deletedCompletedAt.toMillis() : deletedCompletedAt;
            const kTime = keptCompletedAt.toMillis ? keptCompletedAt.toMillis() : keptCompletedAt;
            if (dTime > kTime) mergedCompletedAt = deletedCompletedAt;
          } else if (deletedCompletedAt && !keptCompletedAt) {
            mergedCompletedAt = deletedCompletedAt;
          }

          // Build the merge payload
          const mergePayload = {
            answers: mergedAnswers,
            completed: mergedCompleted,
          };
          if (mergedLastUpdated) mergePayload.lastUpdated = mergedLastUpdated;
          if (mergedCompletedAt) mergePayload.completedAt = mergedCompletedAt;

          await keptRef.set(mergePayload, { merge: true });
          console.log(`  MERGE | ${studentName} | kept had ${keptAnswerCount} answers, orphaned had ${deletedAnswerCount} answers, added ${newAnswersAdded} new | completed: ${mergedCompleted}`);
          mappingMerged++;
          totalMerged++;
          courseStats[courseLabel].merged++;
        }
      } catch (err) {
        console.error(`  ERROR | ${studentName} | ${err.message}`);
        totalErrors++;
      }
    }

    console.log(`  --- Subtotal: ${mappingCopied} copied, ${mappingMerged} merged, ${mappingSkipped} skipped\n`);
  }

  // Step 4: Final summary
  console.log("\n" + "=".repeat(80));
  console.log("MIGRATION SUMMARY");
  console.log("=".repeat(80));
  console.log(`  Total copied (no kept doc):     ${totalCopied}`);
  console.log(`  Total merged (kept doc existed): ${totalMerged}`);
  console.log(`  Total skipped (empty orphaned):  ${totalSkipped}`);
  console.log(`  Total errors:                    ${totalErrors}`);
  console.log(`  Grand total processed:           ${totalCopied + totalMerged + totalSkipped}`);

  console.log(`\n  By course:`);
  for (const [label, stats] of Object.entries(courseStats).sort()) {
    console.log(`    ${label}: ${stats.copied} copied, ${stats.merged} merged, ${stats.skipped} skipped`);
  }

  console.log("\n  NOTE: Orphaned docs were NOT deleted (left for safety).");
  console.log("\n=== MIGRATION COMPLETE ===");
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
