// Safe lesson writer — preserves existing block IDs when updating lessons
// that students have already completed.
//
// Usage:
//   const { safeLessonWrite } = require('./safe-lesson-write.cjs');
//   await safeLessonWrite(db, courseId, lessonId, lessonData);
//
// If the lesson already exists with student progress, this remaps new block IDs
// to existing ones (by type + exact/fuzzy content similarity) so student answers stay linked.

function buildAuditFields(action) {
  const path = require("path");
  const script = process.argv[1] ? path.basename(process.argv[1]) : "(unknown)";
  return {
    lastEditedBy: script,
    lastEditedHost: require("os").hostname(),
    editAction: action,
    updatedAt: new Date()
  };
}

async function safeLessonWrite(db, courseId, lessonId, newLesson) {
  const lessonRef = db.collection("courses").doc(courseId).collection("lessons").doc(lessonId);
  const existing = await lessonRef.get();

  if (!existing.exists) {
    // New lesson — write directly
    await lessonRef.set({ ...newLesson, ...buildAuditFields("created") });
    return { action: "created", preserved: 0 };
  }

  const existingData = existing.data();
  const oldBlocks = existingData.blocks || [];
  const newBlocks = newLesson.blocks || [];

  if (oldBlocks.length === 0) {
    await lessonRef.set({ ...newLesson, ...buildAuditFields("updated") });
    return { action: "updated", preserved: 0 };
  }

  // Check if any students have progress for this lesson
  const hasProgress = await checkForProgress(db, courseId, lessonId);
  if (!hasProgress) {
    // No student progress — safe to overwrite
    await lessonRef.set({ ...newLesson, ...buildAuditFields("updated") });
    return { action: "updated", preserved: 0 };
  }

  // Students have progress — preserve block IDs by remapping
  // Phase 1: Try exact match first, then fuzzy match with strict thresholds
  const oldByType = groupBlocksByType(oldBlocks);
  let preserved = 0;
  const usedOldIds = new Set();
  const remappedByNewId = new Map();

  const remappedBlocks = newBlocks.map((block, index) => {
    const typeKey = blockTypeKey(block);
    const oldGroup = oldByType[typeKey];
    if (!oldGroup || oldGroup.length === 0) return block;

    // Exact match is always the safest path
    const exactMatch = oldGroup.find(ob => !usedOldIds.has(ob.id) && getBlockText(ob) === getBlockText(block));
    if (exactMatch) {
      usedOldIds.add(exactMatch.id);
      preserved++;
      remappedByNewId.set(block.id, exactMatch.id);
      return { ...block, id: exactMatch.id };
    }

    // Fuzzy match: strict threshold + margin over second-best candidate
    const fuzzyMatch = findBestContentMatch(block, oldGroup, usedOldIds);
    if (fuzzyMatch) {
      usedOldIds.add(fuzzyMatch.id);
      preserved++;
      remappedByNewId.set(block.id, fuzzyMatch.id);
      console.warn(
        `[safeLessonWrite] FUZZY remap: new block #${index} (${typeKey}) -> old id ${fuzzyMatch.id}: "${preview(getBlockText(block))}"`
      );
      return { ...block, id: fuzzyMatch.id };
    }

    // Fallback: take the next unused old ID for this type (positional)
    const nextUnused = oldGroup.find(ob => !usedOldIds.has(ob.id));
    if (nextUnused) {
      usedOldIds.add(nextUnused.id);
      preserved++;
      remappedByNewId.set(block.id, nextUnused.id);
      console.warn(
        `[safeLessonWrite] POSITIONAL remap: new block #${index} (${typeKey}) -> old id ${nextUnused.id}: "${preview(getBlockText(block))}"`
      );
      return { ...block, id: nextUnused.id };
    }

    return block;
  });

  // Warn about any old blocks that did not get a corresponding new block
  for (const oldBlock of oldBlocks) {
    if (!usedOldIds.has(oldBlock.id)) {
      console.warn(
        `[safeLessonWrite] ORPHAN risk: old block id ${oldBlock.id} (${oldBlock.type}) had no matching new block — student answers may be lost`
      );
    }
  }

  // Preserve teacher-managed fields that the seed script may have omitted
  const mergedTopLevel = preserveExistingFields(existingData, newLesson);

  const updatedLesson = {
    ...mergedTopLevel,
    blocks: remappedBlocks,
    ...buildAuditFields("updated-preserved")
  };
  await lessonRef.set(updatedLesson);
  return { action: "updated-preserved", preserved };
}

/**
 * Merge any top-level fields present in the existing doc but absent from newLesson
 * so a re-seed cannot hide a live lesson or wipe grade-release/dueDate info.
 */
function preserveExistingFields(existingData, newLesson) {
  const preservedFields = {};
  for (const key of Object.keys(existingData)) {
    if (key === "blocks" || key === "lastEditedBy" || key === "lastEditedHost" || key === "editAction" || key === "updatedAt") {
      continue;
    }
    if (!(key in newLesson)) {
      preservedFields[key] = existingData[key];
    }
  }
  return { ...preservedFields, ...newLesson };
}

/**
 * Find the best content match for a new block among old blocks of the same type.
 * Exact match is handled by the caller; this helper only does fuzzy matching.
 * Requires score >= 0.85 AND a clear margin (>= 0.1) over the second-best candidate.
 */
function findBestContentMatch(newBlock, oldGroup, usedOldIds) {
  const newText = getBlockText(newBlock);
  if (!newText) return null;

  let bestScore = -1;
  let bestMatch = null;
  let secondBestScore = -1;

  for (const oldBlock of oldGroup) {
    if (usedOldIds.has(oldBlock.id)) continue;
    const oldText = getBlockText(oldBlock);
    if (!oldText) continue;

    const score = textSimilarity(newText, oldText);
    if (score > bestScore) {
      secondBestScore = bestScore;
      bestScore = score;
      bestMatch = oldBlock;
    } else if (score > secondBestScore) {
      secondBestScore = score;
    }
  }

  const FUZZY_THRESHOLD = 0.85;
  const MARGIN = 0.1;
  if (bestScore >= FUZZY_THRESHOLD && bestScore - secondBestScore >= MARGIN) {
    return bestMatch;
  }
  return null;
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

function preview(text, maxLen = 60) {
  if (!text) return "(no text)";
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen - 3) + "...";
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
 * sampling a fixed number of enrollments.
 */
async function checkForProgress(db, courseId, lessonId) {
  // Check via enrollments — but query ALL, not just 10
  try {
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
