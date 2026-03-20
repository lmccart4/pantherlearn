/**
 * Audit Orphaned Progress — READ ONLY
 *
 * Finds all student progress docs that reference deleted lesson IDs
 * and reports what needs to be migrated to the kept lesson IDs.
 *
 * Does NOT write or modify any data.
 */

const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

// Course ID mapping
const COURSES = {
  "ai-literacy-p4": "Y9Gdhw5MTY8wMFt6Tlvj",
  "ai-literacy-p5": "DacjJ93vUDcwqc260OP3",
  "ai-literacy-p7": "M2MVSXrKuVCD9JQfZZyp",
  "ai-literacy-p9": "fUw67wFhAtobWFhjwvZ5",
  "digital-literacy": "digital-literacy",
};

// Deleted lesson ID → Kept lesson ID, grouped by course label
const MIGRATION_MAP = {
  "ai-literacy-p4": {
    "07862ecb": "prompt-duel",
    "a8fcf536": "ethics-courtroom",
  },
  "ai-literacy-p5": {
    "07862ecb": "prompt-duel",
    "a8fcf536": "ethics-courtroom",
    "attention-is-all-you-need": "120fcd16",
    "15d68c40": "2751049c",
    "36da9be4": "99b41b9e",
    "60493b89": "7f6e8030",
    "68262ca3": "f836b893",
    "bfcdb80a": "a8042d2e",
  },
  "ai-literacy-p7": {
    "36da9be4": "003cc465",
    "07862ecb": "prompt-duel",
    "15d68c40": "10f6863c",
    "attention-is-all-you-need": "30719985",
    "3cc3a344": "f836b893",
    "a8042d2e": "7e348ccf",
    "a8fcf536": "ethics-courtroom",
  },
  "ai-literacy-p9": {
    "15d68c40": "02dd821c",
    "07862ecb": "prompt-duel",
    "14c00425": "7f6e8030",
    "attention-is-all-you-need": "2534c489",
    "36da9be4": "9c905aee",
    "embeddings-intro": "2462cd94",
    "neural-networks-intro": "79b06af4",
    "8617db87": "f836b893",
    "a8fcf536": "ethics-courtroom",
  },
  "digital-literacy": {
    "understanding-your-audience": "content-creation-audience",
    "the-hook": "content-creation-hook",
    "visual-hierarchy": "content-creation-visual-hierarchy",
    "infographics": "content-creation-infographics-1",
    "infographic-workshop": "content-creation-infographics-2",
    "thumbnail-cover-art": "content-creation-thumbnail",
    "writing-for-screens": "content-creation-writing",
    "content-calendar": "content-creation-calendar",
    "content-showcase": "content-creation-showcase",
    "creator-economy": "entrepreneurship-creator-economy",
    "finding-your-niche": "entrepreneurship-niche",
    "value-proposition": "entrepreneurship-value-prop",
    "branding-101": "entrepreneurship-branding",
    "revenue-models": "entrepreneurship-revenue",
    "landing-pages": "entrepreneurship-landing-page",
    "marketing-on-zero": "entrepreneurship-marketing",
    "pitch-deck": "entrepreneurship-pitch-deck",
    "pitch-practice": "entrepreneurship-pitch-practice",
    "pitch-day": "entrepreneurship-pitch-day",
  },
};

async function main() {
  console.log("=== ORPHANED PROGRESS AUDIT (READ-ONLY) ===\n");

  // Step 1: Build a set of test/Joe UIDs to exclude
  console.log("Loading users collection to identify test accounts...");
  const usersSnap = await db.collection("users").get();
  const excludeUids = new Set();
  const userNames = {}; // uid → displayName

  for (const doc of usersSnap.docs) {
    const data = doc.data();
    const name = (data.displayName || "").trim();
    userNames[doc.id] = name || doc.id;

    const nameLower = name.toLowerCase();
    if (nameLower === "joe" || nameLower.includes("test")) {
      excludeUids.add(doc.id);
    }
  }
  console.log(`  Total users: ${usersSnap.size}`);
  console.log(`  Excluded (Joe/test): ${excludeUids.size}`);

  // Step 2: Get all student UIDs from the progress collection
  console.log("\nLoading all student UIDs from progress/ collection...");
  const progressSnap = await db.collection("progress").listDocuments();
  const allStudentUids = progressSnap.map(ref => ref.id).filter(uid => !excludeUids.has(uid));
  console.log(`  Total progress docs: ${progressSnap.length}`);
  console.log(`  After excluding test accounts: ${allStudentUids.length}`);

  // Step 3: For each student, for each course, check deleted and kept lesson progress
  const results = []; // { uid, name, courseLabel, courseId, deletedLessonId, keptLessonId, deletedProgress, keptProgress }
  const affectedStudents = new Set();
  const courseCounts = {};

  let processed = 0;
  const total = allStudentUids.length;

  for (const uid of allStudentUids) {
    processed++;
    if (processed % 25 === 0 || processed === total) {
      process.stdout.write(`\r  Checking student ${processed}/${total}...`);
    }

    for (const [courseLabel, courseId] of Object.entries(COURSES)) {
      const deletedToKept = MIGRATION_MAP[courseLabel];
      if (!deletedToKept) continue;

      for (const [deletedId, keptId] of Object.entries(deletedToKept)) {
        // Check progress on deleted lesson
        const deletedRef = db.doc(`progress/${uid}/courses/${courseId}/lessons/${deletedId}`);
        const deletedSnap = await deletedRef.get();

        if (!deletedSnap.exists) continue;

        // Found orphaned progress — now check the kept lesson too
        const deletedData = deletedSnap.data();
        const deletedAnswers = deletedData.answers || {};
        const deletedAnswerCount = Object.keys(deletedAnswers).length;
        const deletedCompleted = deletedData.completed || false;

        // Check progress on kept lesson
        const keptRef = db.doc(`progress/${uid}/courses/${courseId}/lessons/${keptId}`);
        const keptSnap = await keptRef.get();

        let keptCompleted = false;
        let keptAnswerCount = 0;
        let keptExists = false;

        if (keptSnap.exists) {
          keptExists = true;
          const keptData = keptSnap.data();
          const keptAnswers = keptData.answers || {};
          keptAnswerCount = Object.keys(keptAnswers).length;
          keptCompleted = keptData.completed || false;
        }

        affectedStudents.add(uid);
        if (!courseCounts[courseLabel]) courseCounts[courseLabel] = 0;
        courseCounts[courseLabel]++;

        results.push({
          uid,
          name: userNames[uid] || uid,
          courseLabel,
          courseId,
          deletedLessonId: deletedId,
          keptLessonId: keptId,
          deletedCompleted,
          deletedAnswerCount,
          keptExists,
          keptCompleted,
          keptAnswerCount,
        });
      }
    }
  }

  console.log("\n");

  // Step 4: Print results table
  if (results.length === 0) {
    console.log("No orphaned progress found. Nothing to migrate.");
    return;
  }

  console.log("=".repeat(160));
  console.log("ORPHANED PROGRESS DETAILS");
  console.log("=".repeat(160));

  // Header
  const hdr = [
    pad("Student Name", 25),
    pad("UID (short)", 14),
    pad("Course", 18),
    pad("Deleted Lesson", 30),
    pad("Del Completed", 14),
    pad("Del Answers", 12),
    pad("Kept Lesson", 30),
    pad("Kept Exists", 12),
    pad("Kept Completed", 15),
    pad("Kept Answers", 12),
  ].join(" | ");
  console.log(hdr);
  console.log("-".repeat(160));

  // Sort by course then student name
  results.sort((a, b) => {
    if (a.courseLabel !== b.courseLabel) return a.courseLabel.localeCompare(b.courseLabel);
    return a.name.localeCompare(b.name);
  });

  for (const r of results) {
    const row = [
      pad(r.name, 25),
      pad(r.uid.substring(0, 12) + "...", 14),
      pad(r.courseLabel, 18),
      pad(r.deletedLessonId, 30),
      pad(r.deletedCompleted ? "YES" : "no", 14),
      pad(String(r.deletedAnswerCount), 12),
      pad(r.keptLessonId, 30),
      pad(r.keptExists ? "YES" : "no", 12),
      pad(r.keptCompleted ? "YES" : "no", 15),
      pad(String(r.keptAnswerCount), 12),
    ].join(" | ");
    console.log(row);
  }

  // Step 5: Summary
  console.log("\n" + "=".repeat(80));
  console.log("SUMMARY");
  console.log("=".repeat(80));
  console.log(`  Total orphaned progress docs:  ${results.length}`);
  console.log(`  Total students affected:       ${affectedStudents.size}`);
  console.log(`  Breakdown by course:`);
  for (const [label, count] of Object.entries(courseCounts).sort()) {
    console.log(`    ${label}: ${count} progress docs`);
  }

  // Conflict analysis
  const conflicts = results.filter(r => r.keptExists && r.keptAnswerCount > 0);
  const noConflict = results.filter(r => !r.keptExists || r.keptAnswerCount === 0);
  console.log(`\n  Migration complexity:`);
  console.log(`    Clean (no progress on kept lesson):  ${noConflict.length}`);
  console.log(`    Conflict (kept lesson has answers):  ${conflicts.length}`);

  if (conflicts.length > 0) {
    console.log(`\n  CONFLICT DETAILS (kept lesson already has answers):`);
    for (const c of conflicts) {
      console.log(`    ${c.name} | ${c.courseLabel} | ${c.deletedLessonId} → ${c.keptLessonId} | deleted=${c.deletedAnswerCount} answers | kept=${c.keptAnswerCount} answers`);
    }
  }

  console.log("\n=== AUDIT COMPLETE (read-only, no data modified) ===");
}

function pad(str, len) {
  if (str.length >= len) return str.substring(0, len);
  return str + " ".repeat(len - str.length);
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
