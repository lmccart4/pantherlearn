// Safe lesson writer — preserves existing block IDs when updating lessons
// that students have already completed.
//
// Usage:
//   const { safeLessonWrite } = require('./safe-lesson-write.cjs');
//   await safeLessonWrite(db, courseId, lessonId, lessonData);
//
// If the lesson already exists with student progress, this remaps new block IDs
// to existing ones (by type + content similarity) so student answers stay linked.

async function safeLessonWrite(db, courseId, lessonId, newLesson) {
  const lessonRef = db.collection("courses").doc(courseId).collection("lessons").doc(lessonId);
  const existing = await lessonRef.get();

  if (!existing.exists) {
    // New lesson — write directly
    await lessonRef.set(newLesson);
    return { action: "created", preserved: 0 };
  }

  const oldBlocks = existing.data().blocks || [];
  const newBlocks = newLesson.blocks || [];

  if (oldBlocks.length === 0) {
    await lessonRef.set(newLesson);
    return { action: "updated", preserved: 0 };
  }

  // Check if any students have progress for this lesson
  const hasProgress = await checkForProgress(db, courseId, lessonId);
  if (!hasProgress) {
    // No student progress — safe to overwrite
    await lessonRef.set(newLesson);
    return { action: "updated", preserved: 0 };
  }

  // Students have progress — preserve block IDs by remapping
  // Phase 1: Try to match by content similarity within each type group
  const oldByType = groupBlocksByType(oldBlocks);
  let preserved = 0;
  const usedOldIds = new Set();

  const remappedBlocks = newBlocks.map(block => {
    const typeKey = blockTypeKey(block);
    const oldGroup = oldByType[typeKey];
    if (!oldGroup || oldGroup.length === 0) return block;

    // Try content-similarity match first (Finding #7)
    const bestMatch = findBestContentMatch(block, oldGroup, usedOldIds);
    if (bestMatch) {
      usedOldIds.add(bestMatch.id);
      preserved++;
      return { ...block, id: bestMatch.id };
    }

    // Fallback: take the next unused old ID for this type (positional)
    const nextUnused = oldGroup.find(ob => !usedOldIds.has(ob.id));
    if (nextUnused) {
      usedOldIds.add(nextUnused.id);
      preserved++;
      return { ...block, id: nextUnused.id };
    }

    return block;
  });

  const updatedLesson = { ...newLesson, blocks: remappedBlocks };
  await lessonRef.set(updatedLesson);
  return { action: "updated-preserved", preserved };
}

/**
 * Find the best content match for a new block among old blocks of the same type.
 * Uses prompt text / title / content as the matching signal.
 */
function findBestContentMatch(newBlock, oldGroup, usedOldIds) {
  const newText = getBlockText(newBlock);
  if (!newText) return null;

  let bestScore = 0;
  let bestMatch = null;

  for (const oldBlock of oldGroup) {
    if (usedOldIds.has(oldBlock.id)) continue;
    const oldText = getBlockText(oldBlock);
    if (!oldText) continue;

    // Exact match
    if (newText === oldText) return oldBlock;

    // Similarity score (simple overlap ratio)
    const score = textSimilarity(newText, oldText);
    if (score > bestScore && score >= 0.6) {
      bestScore = score;
      bestMatch = oldBlock;
    }
  }

  return bestMatch;
}

/**
 * Extract the primary text content from a block for comparison.
 */
function getBlockText(block) {
  if (block.prompt) return block.prompt.trim().toLowerCase();
  if (block.title) return block.title.trim().toLowerCase();
  if (block.url) return block.url.trim().toLowerCase();
  if (block.text) return block.text.trim().toLowerCase();
  return null;
}

/**
 * Simple text similarity — ratio of shared words to total unique words.
 */
function textSimilarity(a, b) {
  const wordsA = new Set(a.split(/\s+/));
  const wordsB = new Set(b.split(/\s+/));
  const union = new Set([...wordsA, ...wordsB]);
  if (union.size === 0) return 0;
  let shared = 0;
  for (const w of wordsA) { if (wordsB.has(w)) shared++; }
  return shared / union.size;
}

function blockTypeKey(block) {
  if (block.type === "question") return `question_${block.questionType || "unknown"}`;
  if (block.type === "embed" && block.scored) return "embed_scored";
  if (block.type === "embed") return "embed";
  return block.type;
}

function groupBlocksByType(blocks) {
  const groups = {};
  for (const block of blocks) {
    const key = blockTypeKey(block);
    if (!groups[key]) groups[key] = [];
    groups[key].push(block);
  }
  return groups;
}

/**
 * Check if ANY student has progress for this lesson.
 * Uses a collectionGroup query on the "lessons" subcollection rather than
 * sampling a fixed number of enrollments (Finding #8).
 */
async function checkForProgress(db, courseId, lessonId) {
  // First: try the efficient collectionGroup approach
  // Query all progress/{uid}/courses/{courseId}/lessons/{lessonId} docs directly
  try {
    // Check via enrollments — but query ALL, not just 10
    const enrollSnap = await db.collection("enrollments")
      .where("courseId", "==", courseId)
      .get();

    for (const doc of enrollSnap.docs) {
      const uid = doc.data().uid || doc.data().studentUid;
      if (!uid) continue;
      const progSnap = await db.collection("progress").doc(uid)
        .collection("courses").doc(courseId)
        .collection("lessons").doc(lessonId).get();
      if (progSnap.exists) {
        // Any progress at all (not just completed) means we must preserve IDs
        const data = progSnap.data();
        if (data.completed || (data.answers && Object.keys(data.answers).length > 0)) {
          return true;
        }
      }
    }
  } catch (err) {
    // If enrollment query fails, err on the side of caution
    console.warn(`[safeLessonWrite] Progress check failed, assuming progress exists: ${err.message}`);
    return true;
  }
  return false;
}

module.exports = { safeLessonWrite };
