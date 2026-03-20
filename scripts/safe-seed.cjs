// safe-seed.cjs — Safety wrapper for seed scripts.
//
// Use this instead of raw Firestore .set() on lesson documents.
// It checks whether the lesson already has student progress and
// refuses to overwrite if so, preventing the grade catastrophe
// that occurred on 2026-03-13.
//
// Usage:
//   const { safeSeed } = require('./safe-seed.cjs');
//   // Instead of: await lessonRef.set(lessonData);
//   // Use:        await safeSeed(db, courseId, lessonId, lessonData);
//
// For full block-ID-preserving writes, use safeLessonWrite() instead.

const { safeLessonWrite } = require("./safe-lesson-write.cjs");

/**
 * Safe wrapper around lesson document writes.
 *
 * - If the lesson doesn't exist yet: writes normally with .set()
 * - If the lesson exists but has NO student progress: writes normally
 * - If the lesson exists WITH student progress: uses safeLessonWrite()
 *   to preserve block IDs, OR aborts with a warning.
 *
 * @param {FirebaseFirestore.Firestore} db - Firestore instance
 * @param {string} courseId - Course document ID
 * @param {string} lessonId - Lesson document ID
 * @param {object} lessonData - Full lesson document data (must include blocks array)
 * @param {object} [options] - Optional settings
 * @param {boolean} [options.force=false] - If true, use safeLessonWrite even when progress exists (preserves IDs)
 * @param {boolean} [options.allowOverwrite=false] - DANGEROUS: if true, allows raw .set() even with progress
 * @returns {Promise<{action: string, preserved?: number}>}
 */
async function safeSeed(db, courseId, lessonId, lessonData, options = {}) {
  const { force = false, allowOverwrite = false } = options;

  const lessonRef = db.collection("courses").doc(courseId).collection("lessons").doc(lessonId);
  const existing = await lessonRef.get();

  // New lesson — safe to write directly
  if (!existing.exists) {
    await lessonRef.set(lessonData);
    console.log(`  [safeSeed] Created: ${lessonId}`);
    return { action: "created" };
  }

  // Check for student progress
  const hasProgress = await checkAnyProgress(db, courseId, lessonId);

  if (!hasProgress) {
    // No student progress — safe to overwrite
    await lessonRef.set(lessonData);
    console.log(`  [safeSeed] Updated (no progress): ${lessonId}`);
    return { action: "updated" };
  }

  // Student progress exists!
  if (allowOverwrite) {
    console.warn(`  ⚠️  [safeSeed] OVERWRITING lesson with progress: ${lessonId} (allowOverwrite=true)`);
    await lessonRef.set(lessonData);
    return { action: "force-overwritten" };
  }

  if (force) {
    // Use safeLessonWrite to preserve block IDs
    console.log(`  [safeSeed] Preserving block IDs via safeLessonWrite: ${lessonId}`);
    return await safeLessonWrite(db, courseId, lessonId, lessonData);
  }

  // Default: refuse to overwrite
  console.warn(`  ⛔ [safeSeed] SKIPPED: ${lessonId} has student progress. Use force:true to preserve IDs, or allowOverwrite:true to overwrite (DANGEROUS).`);
  return { action: "skipped-has-progress" };
}

/**
 * Quick check: does ANY student have progress on this lesson?
 */
async function checkAnyProgress(db, courseId, lessonId) {
  try {
    const enrollSnap = await db.collection("enrollments")
      .where("courseId", "==", courseId)
      .limit(50) // Check up to 50 enrollments
      .get();

    for (const doc of enrollSnap.docs) {
      const uid = doc.data().uid || doc.data().studentUid;
      if (!uid) continue;
      const progSnap = await db.collection("progress").doc(uid)
        .collection("courses").doc(courseId)
        .collection("lessons").doc(lessonId).get();
      if (progSnap.exists) {
        const data = progSnap.data();
        if (data.completed || (data.answers && Object.keys(data.answers).length > 0)) {
          return true;
        }
      }
    }
  } catch (err) {
    // Err on the side of caution
    console.warn(`  [safeSeed] Progress check failed, assuming progress exists: ${err.message}`);
    return true;
  }
  return false;
}

module.exports = { safeSeed };
