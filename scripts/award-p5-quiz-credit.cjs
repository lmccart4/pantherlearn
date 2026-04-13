/**
 * Manual credit award for P5 on real-vs-ai-quiz (the Ultimate Image Quiz).
 *
 * Context: embed activity had no Submit Score button, so auto-send failures
 * silently dropped scores for ~50% of P5 students. Luke is awarding credit
 * to all P5 students equal to the class average across all scored embeds in
 * P5. Also marking reflection valid for every P5 student on this lesson.
 *
 * What this script does:
 *   1. Compute the class-wide average writtenScore across every scored embed
 *      answer in P5 (all scored-embed writtenScores, flat-averaged).
 *   2. For every enrolled P5 student MISSING a real-vs-ai-quiz embed answer:
 *      write an answer doc with the computed class average, flagged
 *      manuallyAwarded:true.
 *   3. For every enrolled P5 student (missing or not): upsert a reflection
 *      doc with valid:true for this lesson (1/1 reflection credit).
 *   4. Write an audit log entry per award to
 *      progress/{uid}/courses/{courseId}/lessons/{lessonId}/resetLog/{autoId}
 *      with type:"manual_award".
 *
 * Run: node scripts/award-p5-quiz-credit.cjs [--dry]
 */
const admin = require("firebase-admin");
admin.initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = admin.firestore();

const DRY = process.argv.includes("--dry");
const P5_COURSE_ID = "DacjJ93vUDcwqc260OP3";
const LESSON_ID = "real-vs-ai-quiz";
const LIVE_EMBED_BLOCK_ID = "embed-quiz-1773624055951"; // verified earlier
const REASON = "Bulk award: embed activity had no Submit Score button, auto-send silently failed for ~50% of P5. Awarded the P5 class average across scored embeds.";

async function main() {
  console.log(`${DRY ? "[DRY RUN] " : ""}P5 award — real-vs-ai-quiz\n`);

  // 1. Get P5 enrollments — roster
  const enrollSnap = await db.collection("enrollments").where("courseId", "==", P5_COURSE_ID).get();
  const roster = [];
  for (const d of enrollSnap.docs) {
    const data = d.data();
    const uid = data.uid || data.studentUid;
    if (!uid) continue;
    if (data.isTestStudent) continue;
    roster.push(uid);
  }
  console.log(`P5 roster: ${roster.length} students`);

  // 2. Identify every scored-embed block across P5 lessons (we need these
  //    block IDs to look up student writtenScores for the average calc).
  const lessonsSnap = await db.collection("courses").doc(P5_COURSE_ID).collection("lessons").get();
  const scoredEmbedBlockIds = new Set();
  for (const lesson of lessonsSnap.docs) {
    const blocks = lesson.data().blocks || [];
    for (const b of blocks) {
      if (b.type === "embed" && b.scored === true && b.id) {
        scoredEmbedBlockIds.add(b.id);
      }
    }
  }
  console.log(`Scored embed blocks in P5: ${scoredEmbedBlockIds.size}`);

  // 3. Compute class-wide average writtenScore across all scored-embed answers
  //    (flat-average across all {student, embed} pairs that have a writtenScore).
  const allWrittenScores = [];
  for (const uid of roster) {
    const lessonsCol = db.collection("progress").doc(uid).collection("courses").doc(P5_COURSE_ID).collection("lessons");
    const studentLessons = await lessonsCol.get();
    for (const lesson of studentLessons.docs) {
      const answers = lesson.data().answers || {};
      for (const [bid, ans] of Object.entries(answers)) {
        if (!scoredEmbedBlockIds.has(bid)) continue;
        if (ans?.writtenScore == null) continue;
        allWrittenScores.push({ uid, lessonId: lesson.id, blockId: bid, writtenScore: ans.writtenScore });
      }
    }
  }
  const n = allWrittenScores.length;
  const sum = allWrittenScores.reduce((s, x) => s + x.writtenScore, 0);
  const classAvg = n > 0 ? sum / n : 0;
  console.log(`Class-average writtenScore across ${n} scored-embed answers: ${classAvg.toFixed(4)} (${(classAvg * 100).toFixed(1)}%)`);

  // Translate to the quiz's display scale (maxScore = 48 questions)
  const QUIZ_MAX = 48;
  const displayScore = Math.round(classAvg * QUIZ_MAX);
  console.log(`Will award: ${displayScore}/${QUIZ_MAX} (writtenScore ${classAvg.toFixed(4)}) per missing student\n`);

  // 4. Identify P5 students missing the quiz embed answer
  const missing = [];
  const present = [];
  for (const uid of roster) {
    const progRef = db.doc(`progress/${uid}/courses/${P5_COURSE_ID}/lessons/${LESSON_ID}`);
    const snap = await progRef.get();
    const existing = snap.exists ? (snap.data().answers || {}) : {};
    const hasEmbed = existing[LIVE_EMBED_BLOCK_ID]?.writtenScore != null;
    if (hasEmbed) present.push(uid);
    else missing.push(uid);
  }
  console.log(`P5 students with quiz embed answer already: ${present.length}`);
  console.log(`P5 students missing the quiz embed answer: ${missing.length}\n`);

  // 5. Write awards for missing students + audit log
  let awardedCount = 0;
  for (const uid of missing) {
    const progRef = db.doc(`progress/${uid}/courses/${P5_COURSE_ID}/lessons/${LESSON_ID}`);
    // NOTE: setDoc({merge:true}) with dotted keys creates LITERAL top-level fields,
    // NOT nested paths. Use updateDoc() for dotted paths, or a nested object
    // (like below) with set({merge:true}) to write to answers.{blockId} safely.
    const awardPayload = {
      answers: {
        [LIVE_EMBED_BLOCK_ID]: {
          score: displayScore,
          maxScore: QUIZ_MAX,
          writtenScore: classAvg,
          submitted: true,
          completedAt: new Date().toISOString(),
          manuallyAwarded: true,
          awardedReason: REASON,
          awardedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      },
    };
    if (DRY) {
      awardedCount++;
      console.log(`  [dry] ${uid} would receive ${displayScore}/${QUIZ_MAX}`);
      continue;
    }
    // set({merge:true}) with a NESTED object merges into answers.{blockId} correctly.
    await progRef.set(awardPayload, { merge: true });

    // Audit log entry
    try {
      const logCol = db.collection("progress").doc(uid).collection("courses").doc(P5_COURSE_ID).collection("lessons").doc(LESSON_ID).collection("resetLog");
      await logCol.add({
        type: "manual_award",
        blockId: LIVE_EMBED_BLOCK_ID,
        blockLabel: "Real or AI: Ultimate Image Quiz (embed)",
        writtenScore: classAvg,
        score: displayScore,
        maxScore: QUIZ_MAX,
        reason: REASON,
        teacherUid: "SYSTEM",
        teacherEmail: "lucamccarthy@paps.net",
        timestamp: new Date().toISOString(),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        source: "bulk-award-script",
      });
    } catch (e) {
      console.warn(`  [audit] ${uid} log write failed: ${e.message}`);
    }
    awardedCount++;
    console.log(`  ✅ ${uid} awarded ${displayScore}/${QUIZ_MAX}`);
  }

  // 6. Mark reflection valid for every enrolled P5 student on this lesson (1/1)
  let reflCount = 0;
  for (const uid of roster) {
    const reflRef = db.doc(`courses/${P5_COURSE_ID}/reflections/${uid}_${LESSON_ID}`);
    const payload = {
      studentId: uid,
      lessonId: LESSON_ID,
      response: "(bulk-credited — see manual award audit log)",
      valid: true,
      skipped: false,
      savedAt: new Date(),
      manualOverride: true,
      bulkAwarded: true,
    };
    if (DRY) {
      reflCount++;
      continue;
    }
    await reflRef.set(payload, { merge: true });
    reflCount++;
  }
  console.log(`\nReflection credit: ${reflCount}/${roster.length} P5 students${DRY ? " (dry)" : ""}`);

  console.log(`\n${DRY ? "[DRY RUN] " : ""}Summary:`);
  console.log(`  P5 roster: ${roster.length}`);
  console.log(`  Class avg writtenScore: ${classAvg.toFixed(4)} (${(classAvg * 100).toFixed(1)}%) across ${n} scored-embed answers`);
  console.log(`  Missing quiz embed: ${missing.length}`);
  console.log(`  Awarded: ${awardedCount}`);
  console.log(`  Reflection credit: ${reflCount}`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });
