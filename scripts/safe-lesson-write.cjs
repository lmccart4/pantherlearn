// Safe lesson writer — preserves existing block IDs when updating lessons
// that students have already completed.
//
// Usage:
//   const { safeLessonWrite } = require('./safe-lesson-write.cjs');
//   await safeLessonWrite(db, courseId, lessonId, lessonData);
//
// If the lesson already exists with student progress, this remaps new block IDs
// to existing ones (by type + position) so student answers stay linked.

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
  const oldByType = groupBlocksByType(oldBlocks);
  const newByType = groupBlocksByType(newBlocks);

  let preserved = 0;
  const remappedBlocks = newBlocks.map(block => {
    const typeKey = blockTypeKey(block);
    const oldGroup = oldByType[typeKey];
    if (!oldGroup || oldGroup.length === 0) return block;

    // Take the next old ID for this type
    const oldBlock = oldGroup.shift();
    if (oldBlock) {
      preserved++;
      return { ...block, id: oldBlock.id };
    }
    return block;
  });

  const updatedLesson = { ...newLesson, blocks: remappedBlocks };
  await lessonRef.set(updatedLesson);
  return { action: "updated-preserved", preserved };
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

async function checkForProgress(db, courseId, lessonId) {
  // Check a sample of enrollments for progress
  const enrollSnap = await db.collection("enrollments")
    .where("courseId", "==", courseId)
    .limit(10)
    .get();

  for (const doc of enrollSnap.docs) {
    const uid = doc.data().uid || doc.data().studentUid;
    if (!uid) continue;
    const progSnap = await db.collection("progress").doc(uid)
      .collection("courses").doc(courseId)
      .collection("lessons").doc(lessonId).get();
    if (progSnap.exists && progSnap.data().completed) return true;
  }
  return false;
}

module.exports = { safeLessonWrite };
