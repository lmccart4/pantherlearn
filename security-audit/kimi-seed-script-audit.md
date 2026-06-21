# Seed Script Audit Report: Firestore Write Safety

**Scope:** `/Users/lukemccarthy/pantherlearn/scripts/*.cjs` and `*.js`
**Date:** 2026-06-20
**Auditor:** kimi-cc
**Method:** Static analysis of 87 scripts (464 total files in directory; 87 with `.cjs`/`.js` extension matched by audit). Each script scanned for `.set()`, `setDoc()`, `safeLessonWrite()` calls, lesson-collection targeting, and `safe-lesson-write.cjs` imports.

---

## Executive Summary

| Metric | Count |
|--------|-------|
| Scripts audited | 87 |
| Total Firestore write calls | 101 |
| **CRITICAL** (raw `.set()` on lessons, no `safeLessonWrite`) | **74** |
| **HIGH** (`.set()` on lessons, but `safeLessonWrite` imported/used elsewhere) | **2** |
| **MEDIUM** (`setDoc` or writes to progress/grades, not lessons) | **0** |
| **LOW** (no lesson `.set()`, no `setDoc`) | **11** |

**Bottom line:** 85% of seed scripts (74/87) use raw `ref.set(lesson)` on the `lessons` collection without `safeLessonWrite()`. This is the exact pattern that caused the March 13, 2026 incident (14 AI Literacy lessons wiped, 107 zeros pushed to Classroom, 180 orphaned progress records). The risk is mitigated only by the fact that most scripts check `if (snap.exists) { skip; }` before writing — but a re-run after a lesson has gone live (or a copy-paste edit that removes the guard) would trigger the same disaster.

---

## Severity Definitions

| Severity | Definition |
|----------|------------|
| **CRITICAL** | Script calls `.set()` or `setDoc()` on a `lessons` collection document **without** importing or using `safeLessonWrite()`. A re-run on a live lesson regenerates all block IDs and destroys student grades. |
| **HIGH** | Script calls `.set()` on a `lessons` document, **but** imports/uses `safeLessonWrite()` elsewhere in the same file (or is `safe-lesson-write.cjs` / `safe-seed.cjs` itself). The presence of the safe helper shows awareness, but the actual write path is still raw. |
| **MEDIUM** | Script calls `setDoc()` or writes to `progress`, `responses`, `grades`, or other student-data collections. Not a lesson-block-ID risk, but still a data-integrity surface. |
| **LOW** | No `.set()` or `setDoc()` on lessons; no student-grade writes. Read-only, Map `.set()`, or `batch.set()` on enrollments/playlists only. |

---

## Summary Table

| Script | Risk | Calls | Lesson `.set` | `setDoc` | `safeLessonWrite` | Notes |
|--------|------|-------|---------------|----------|-------------------|-------|
| test-grade-bonus-preservation.cjs | CRITICAL | 5 | YES | no | no | raw `.set()` on lessons |
| award-p5-quiz-credit.cjs | CRITICAL | 3 | YES | YES | no | raw `.set()` on lessons |
| migrate-orphaned-progress.cjs | CRITICAL | 2 | YES | no | no | raw `.set()` on lessons |
| migrateReflections.js | CRITICAL | 1 | YES | YES | no | raw `.set()` on lessons |
| seed-ai-project-ethics-court.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-notebooklm-study-tool.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-wave-interactions.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit5-lesson7.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| apply-classwork-pass-backfill.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-circuit-discovery.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-gravitational-potential-energy.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-series-vs-parallel-lab.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit5-lesson4.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-coulombs-law.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-electric-fields.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-electric-potential.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-project-build-with-ai.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit5-lesson1.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit5-lesson3.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-project-replace-me.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit5-lesson2.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit6-lesson2.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit6-lesson3.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit6-lesson4-day2.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit6-lesson1.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-project-centaur-showdown.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-news-may11.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-everywhere-edtech.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-project-prompt-portfolio.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-intro-to-charge.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit6-lesson4.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-project-field-test.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit6-lesson5.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-current-voltage-resistance.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-circuits-assessment.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-dead-classroom.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-project-manifesto.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit6-lesson6.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| exempt-choice-project.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-wave-speed.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-storybook-creative.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-standing-waves.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-energy-review-escape-room.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-circuit-symbols.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-motion1d-kinematics-practice.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-dl-course-reflection.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-hallucination-hunt.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-measuring-voltage-series-parallel.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-waves-intro.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ohms-law.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| batch-seed-lab-extensions.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-waves-assessment.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-physics-course-reflection.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-circuit-lab-switches.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-values-corporate-power.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit7-lesson6.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| _joe-fb-runthrough.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-project-career-deep-dive.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-tool-embeds.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-agents-from-chatbots.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-series-parallel-circuits.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit7-lesson5.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit7-lesson4.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-project-research-brief.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-power-rate-of-doing-work.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-sound-waves.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit7-lesson1.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit5-lesson8.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-reading-circuit-diagrams.js | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit7-lesson3.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-project-policy-pitch.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-unit7-lesson2.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-when-should-ai-think.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| seed-ai-project-bias-audit.cjs | CRITICAL | 1 | YES | no | no | raw `.set()` on lessons |
| safe-lesson-write.cjs | HIGH | 4 | YES | no | YES | safeLessonWrite + `.set()` (this IS the safe helper) |
| safe-seed.cjs | HIGH | 4 | YES | no | YES | safeLessonWrite + `.set()` (this IS the safe helper) |
| seed-class-songs-playlists.cjs | LOW | 2 | no | no | no | no Firestore lesson writes |
| migrate-queue-schema.cjs | LOW | 1 | no | no | no | no Firestore lesson writes |
| setup-assignment-queue.cjs | LOW | 1 | no | no | no | no Firestore lesson writes |
| seed-physics-w22.js | LOW | 1 | no | no | YES | no Firestore lesson writes |
| backfill-space-rescue-progress.cjs | LOW | 1 | no | no | no | no Firestore lesson writes |
| _auth-exception-scan.cjs | LOW | 1 | no | no | no | no Firestore lesson writes |
| backfill-bias-progress.cjs | LOW | 1 | no | no | no | no Firestore lesson writes |
| seed-physics-enrollments.cjs | LOW | 1 | no | no | no | no Firestore lesson writes |
| sync-lesson-week-stubs.cjs | LOW | 1 | no | no | no | no Firestore lesson writes |
| setup-qa-student.cjs | LOW | 1 | no | no | no | no Firestore lesson writes |
| seed-steady-playlist.cjs | LOW | 1 | no | no | no | no Firestore lesson writes |

---

## Per-Script Details

### CRITICAL

#### test-grade-bonus-preservation.cjs
- **Risk:** CRITICAL
- **Total calls:** 5
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 17 — `.set`
   ```javascript
   await ref.set({ gradeBonus: 30, completed: false });
   ```
   <details><summary>Context</summary>

   ```
   13:     .collection('courses').doc(TEST_COURSE)
   14:     .collection('lessons').doc(TEST_LESSON);
   15: 
   16:   // 1. Seed gradeBonus
   17:   await ref.set({ gradeBonus: 30, completed: false });
   18: 
   19:   // 2. Simulate a lesson completion write (must be merge)
   20:   await ref.set({ completed: true, completedAt: new Date().toISOString() }, { merge: true });
   ```
   </details>

2. Line 20 — `.set`
   ```javascript
   await ref.set({ completed: true, completedAt: new Date().toISOString() }, { merge: true });
   ```
   <details><summary>Context</summary>

   ```
   16:   // 1. Seed gradeBonus
   17:   await ref.set({ gradeBonus: 30, completed: false });
   18: 
   19:   // 2. Simulate a lesson completion write (must be merge)
   20:   await ref.set({ completed: true, completedAt: new Date().toISOString() }, { merge: true });
   21: 
   22:   // 3. Assert completion write preserved gradeBonus
   23:   const snap1 = await ref.get();
   ```
   </details>

3. Line 33 — `.set`
   ```javascript
   await ref.set({ engagementTime: 120 }, { merge: true });
   ```
   <details><summary>Context</summary>

   ```
   30:   console.log('PASS: gradeBonus preserved after completion write');
   31: 
   32:   // 4. Simulate engagement time write (must be merge)
   33:   await ref.set({ engagementTime: 120 }, { merge: true });
   34: 
   35:   const snap2 = await ref.get();
   36:   const data2 = snap2.data();
   ```
   </details>

4. Line 45 — `.set`
   ```javascript
   await ref.set({ annotations: { strokes: [], savedAt: new Date().toISOString() } }, { merge: true });
   ```
   <details><summary>Context</summary>

   ```
   42:   console.log('PASS: gradeBonus preserved after engagementTime write');
   43: 
   44:   // 5. Simulate annotation save (must be merge)
   45:   await ref.set({ annotations: { strokes: [], savedAt: new Date().toISOString() } }, { merge: true });
   46: 
   47:   const snap3 = await ref.get();
   48:   const data3 = snap3.data();
   ```
   </details>

5. Line 57 — `.set`
   ```javascript
   await ref.set({ completed: true, completedAt: new Date().toISOString(), manuallyCompleted: true, completedBy: 'teacher' }, { merge: true });
   ```
   <details><summary>Context</summary>

   ```
   54:   console.log('PASS: gradeBonus preserved after annotation write');
   55: 
   56:   // 6. Simulate teacher manual-complete (must be merge)
   57:   await ref.set({ completed: true, completedAt: new Date().toISOString(), manuallyCompleted: true, completedBy: 'teacher' }, { merge: true });
   58: 
   59:   const snap4 = await ref.get();
   60:   const data4 = snap4.data();
   ```
   </details>

---

#### award-p5-quiz-credit.cjs
- **Risk:** CRITICAL
- **Total calls:** 3
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** YES

**Offending calls:**

1. Line 105 — `setDoc`
   ```javascript
   // NOTE: setDoc({merge:true}) with dotted keys creates LITERAL top-level fields,
   ```
   <details><summary>Context</summary>

   ```
   102:   let awardedCount = 0;
   103:   for (const uid of missing) {
   104:     const progRef = db.doc(`progress/${uid}/courses/${P5_COURSE_ID}/lessons/${LESSON_ID}`);
   105:     // NOTE: setDoc({merge:true}) with dotted keys creates LITERAL top-level fields,
   106:     // NOT nested paths. Use updateDoc() for dotted paths, or a nested object
   107:     // (like below) with set({merge:true}) to write to answers.{blockId} safely.
   108:     const awardPayload = {
   ```
   </details>

2. Line 128 — `.set`
   ```javascript
   await progRef.set(awardPayload, { merge: true });
   ```
   <details><summary>Context</summary>

   ```
   125:       continue;
   126:     }
   127:     // set({merge:true}) with a NESTED object merges into answers.{blockId} correctly.
   128:     await progRef.set(awardPayload, { merge: true });
   129: 
   130:     // Audit log entry
   131:     try {
   ```
   </details>

3. Line 172 — `.set`
   ```javascript
   await reflRef.set(payload, { merge: true });
   ```
   <details><summary>Context</summary>

   ```
   169:       reflCount++;
   170:       continue;
   171:     }
   172:     await reflRef.set(payload, { merge: true });
   173:     reflCount++;
   174:   }
   175:   console.log(`\nReflection credit: ${reflCount}/${roster.length} P5 students${DRY ? " (dry)" : ""}`);
   ```
   </details>

---

#### migrate-orphaned-progress.cjs
- **Risk:** CRITICAL
- **Total calls:** 2
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 112 — `.set`
   ```javascript
   await keptRef.set(deletedData, { merge: true });
   ```
   <details><summary>Context</summary>

   ```
   109:       try {
   110:         if (!keptSnap.exists) {
   111:           // Case: No kept doc exists — copy orphaned data as-is
   112:           await keptRef.set(deletedData, { merge: true });
   113:           console.log(`  COPY  | ${studentName} | ${deletedAnswerCount} answers, completed=${deletedData.completed || false}`);
   114:           mappingCopied++;
   115:           totalCopied++;
   ```
   </details>

2. Line 167 — `.set`
   ```javascript
   await keptRef.set(mergePayload, { merge: true });
   ```
   <details><summary>Context</summary>

   ```
   164:           if (mergedLastUpdated) mergePayload.lastUpdated = mergedLastUpdated;
   165:           if (mergedCompletedAt) mergePayload.completedAt = mergedCompletedAt;
   166: 
   167:           await keptRef.set(mergePayload, { merge: true });
   168:           console.log(`  MERGE | ${studentName} | kept had ${keptAnswerCount} answers, orphaned had ${deletedAnswerCount} answers, added ${newAnswersAdded} new | completed: ${mergedCompleted}`);
   169:           mappingMerged++;
   170:           totalMerged++;
   ```
   </details>

---

#### migrateReflections.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** YES

**Offending calls:**

1. Line 35 — `setDoc`
   ```javascript
   await setDoc(reflRef, {
   ```
   <details><summary>Context</summary>

   ```
   32:       const reflRef = doc(db, "courses", courseId, "reflections", `${studentId}_${lessonId}`);
   33:       const isValid = !data.skipped && data.score > 0;
   34: 
   35:       await setDoc(reflRef, {
   36:         studentId,
   37:         lessonId,
   38:         response: data.response || "",
   ```
   </details>

---

#### seed-ai-project-ethics-court.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 169 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   166: async function main() {
   167:   for (const courseId of COURSE_IDS) {
   168:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   169:     await ref.set(lesson);
   170:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   171:   }
   172:   process.exit(0);
   ```
   </details>

---

#### seed-ai-notebooklm-study-tool.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 160 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   157: 
   158: async function main() {
   159:   for (const courseId of COURSE_IDS) {
   160:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   161:     await ref.set(lesson);
   162:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   163:   }
   164:   process.exit(0);
   ```
   </details>

---

#### seed-wave-interactions.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 352 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   349:     blocks,
   350:     updatedAt: new Date(),
   351:   };
   352: 
   353:   await lessonRef.set(data);
   354:   console.log(`✅ Lesson seeded: "${data.title}"`);
   355:   console.log(`   Path: courses/${COURSE_ID}/lessons/wave-interactions`);
   ```
   </details>

---

#### seed-ai-unit5-lesson7.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 57 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   54:   for (const courseId of COURSE_IDS) {
   55:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   56:     const snap = await ref.get();
   57:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   58:     await ref.set(lesson);
   59:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   60:   }
   ```
   </details>

---

#### apply-classwork-pass-backfill.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 26 — `.set`
   ```javascript
   await progressRef.set({
   ```
   <details><summary>Context</summary>

   ```
   23:     const name = req.studentName;
   24:     if (!uid) { console.log(`  SKIP ${reqId} — no studentUid`); continue; }
   25: 
   26:     const progressRef = db.doc(`progress/${uid}/courses/${COURSE_ID}/lessons/${LESSON_ID}`);
   27:     await progressRef.set({
   28:       exempt: true,
   29:       exemptAt: now,
   ```
   </details>

---

#### seed-circuit-discovery.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 364 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   361:     blocks,
   362:     updatedAt: new Date(),
   363:   };
   364: 
   365:   await lessonRef.set(data);
   366:   console.log(`✅ Lesson seeded: "${data.title}"`);
   367:   console.log(`   Path: courses/${COURSE_ID}/lessons/circuit-discovery`);
   ```
   </details>

---

#### seed-gravitational-potential-energy.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 397 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   394:     blocks,
   395:     updatedAt: new Date(),
   396:   };
   397: 
   398:   await lessonRef.set(data);
   399:   console.log(`✅ Lesson seeded successfully!`);
   400:   console.log(`   Title: "${data.title}"`);
   ```
   </details>

---

#### seed-series-vs-parallel-lab.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 537 — `.set`
   ```javascript
   await ref.set(data);
   ```
   <details><summary>Context</summary>

   ```
   534:     gradesReleased: true,
   535:     blocks,
   536:     updatedAt: new Date(),
   537:   };
   538:   await ref.set(data);
   539:   console.log(`✅ Lesson seeded: "${data.title}"`);
   540:   console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
   ```
   </details>

---

#### seed-ai-unit5-lesson4.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 57 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   54:   for (const courseId of COURSE_IDS) {
   55:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   56:     const snap = await ref.get();
   57:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   58:     await ref.set(lesson);
   59:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   60:   }
   ```
   </details>

---

#### seed-coulombs-law.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 293 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   290:     blocks,
   291:     updatedAt: new Date(),
   292:   };
   293: 
   294:   await lessonRef.set(data);
   295:   console.log(`✅ Lesson seeded: "${data.title}"`);
   296:   console.log(`   Path: courses/${COURSE_ID}/lessons/coulombs-law`);
   ```
   </details>

---

#### seed-electric-fields.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 318 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   315:     blocks,
   316:     updatedAt: new Date(),
   317:   };
   318: 
   319:   await lessonRef.set(data);
   320:   console.log(`✅ Lesson seeded: "${data.title}"`);
   321:   console.log(`   Path: courses/${COURSE_ID}/lessons/electric-fields`);
   ```
   </details>

---

#### seed-electric-potential.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 318 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   315:     blocks,
   316:     updatedAt: new Date(),
   317:   };
   318: 
   319:   await lessonRef.set(data);
   320:   console.log(`✅ Lesson seeded: "${data.title}"`);
   321:   console.log(`   Path: courses/${COURSE_ID}/lessons/electric-potential`);
   ```
   </details>

---

#### seed-ai-project-build-with-ai.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 186 — `.set`
   ```javascript
   await ref.set(lessonToWrite);
   ```
   <details><summary>Context</summary>

   ```
   183:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   184:     const snap = await ref.get();
   185:     const currentVisible = snap.exists ? snap.data().visible : false;
   186:     const lessonToWrite = { ...lesson, visible: currentVisible };
   187:     await ref.set(lessonToWrite);
   188:     console.log(`✅ Seeded ${lesson.title} → ${courseId} (visible: ${currentVisible})`);
   189:   }
   ```
   </details>

---

#### seed-ai-unit5-lesson1.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 63 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   60:   for (const courseId of COURSE_IDS) {
   61:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   62:     const snap = await ref.get();
   63:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   64:     await ref.set(lesson);
   65:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   66:   }
   ```
   </details>

---

#### seed-ai-unit5-lesson3.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 57 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   54:   for (const courseId of COURSE_IDS) {
   55:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   56:     const snap = await ref.get();
   57:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   58:     await ref.set(lesson);
   59:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   60:   }
   ```
   </details>

---

#### seed-ai-project-replace-me.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 189 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   186: 
   187: async function main() {
   188:   for (const courseId of COURSE_IDS) {
   189:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   190:     await ref.set(lesson);
   191:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   192:   }
   193:   process.exit(0);
   ```
   </details>

---

#### seed-ai-unit5-lesson2.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 58 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   55:   for (const courseId of COURSE_IDS) {
   56:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   57:     const snap = await ref.get();
   58:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   59:     await ref.set(lesson);
   60:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   61:   }
   ```
   </details>

---

#### seed-ai-unit6-lesson2.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 57 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   54:   for (const courseId of COURSE_IDS) {
   55:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   56:     const snap = await ref.get();
   57:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   58:     await ref.set(lesson);
   59:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   60:   }
   ```
   </details>

---

#### seed-ai-unit6-lesson3.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 49 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   46:   for (const courseId of COURSE_IDS) {
   47:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   48:     const snap = await ref.get();
   49:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   50:     await ref.set(lesson);
   51:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   52:   }
   ```
   </details>

---

#### seed-ai-unit6-lesson4-day2.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 54 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   51: 
   52: async function main() {
   53:   for (const courseId of COURSE_IDS) {
   54:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   55:     await ref.set(lesson);
   56:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   57:   }
   58:   process.exit(0);
   ```
   </details>

---

#### seed-ai-unit6-lesson1.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 52 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   49:   for (const courseId of COURSE_IDS) {
   50:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   51:     const snap = await ref.get();
   52:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   53:     await ref.set(lesson);
   54:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   55:   }
   ```
   </details>

---

#### seed-ai-project-centaur-showdown.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 145 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   142: 
   143: async function main() {
   144:   for (const courseId of COURSE_IDS) {
   145:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   146:     await ref.set(lesson);
   147:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   148:   }
   149:   process.exit(0);
   ```
   </details>

---

#### seed-ai-news-may11.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 395 — `.set`
   ```javascript
   await ref.set(lessonData);
   ```
   <details><summary>Context</summary>

   ```
   392: 
   393: async function main() {
   394:   for (const [period, courseId] of Object.entries(SECTIONS)) {
   395:     const ref = db.collection("courses").doc(courseId).collection("lessons").doc(LESSON_ID);
   396:     await ref.set(lessonData);
   397:     console.log(`✅ ${period} (${courseId}): seeded "${lessonData.title}"`);
   398:   }
   ```
   </details>

---

#### seed-ai-everywhere-edtech.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 313 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   310:   for (const courseId of COURSE_IDS) {
   311:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId);
   312:     const snap = await ref.get();
   313:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   314:     await ref.set(lesson);
   315:     console.log(`✅ Seeded "${lesson.title}" → ${courseId}`);
   316:   }
   ```
   </details>

---

#### seed-ai-project-prompt-portfolio.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 181 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   178: 
   179: async function main() {
   180:   for (const courseId of COURSE_IDS) {
   181:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   182:     await ref.set(lesson);
   183:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   184:   }
   185:   process.exit(0);
   ```
   </details>

---

#### seed-intro-to-charge.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 358 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   355:     blocks,
   356:     updatedAt: new Date(),
   357:   };
   358: 
   359:   await lessonRef.set(data);
   360:   console.log(`✅ Lesson seeded: "${data.title}"`);
   361:   console.log(`   Path: courses/${COURSE_ID}/lessons/intro-to-charge`);
   ```
   </details>

---

#### seed-ai-unit6-lesson4.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 90 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   87: 
   88: async function main() {
   89:   for (const courseId of COURSE_IDS) {
   90:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   91:     await ref.set(lesson);
   92:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   93:   }
   94:   process.exit(0);
   ```
   </details>

---

#### seed-ai-project-field-test.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 188 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   185: 
   186: async function main() {
   187:   for (const courseId of COURSE_IDS) {
   188:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   189:     await ref.set(lesson);
   190:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   191:   }
   192:   process.exit(0);
   ```
   </details>

---

#### seed-ai-unit6-lesson5.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 50 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   47:   for (const courseId of COURSE_IDS) {
   48:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   49:     const snap = await ref.get();
   50:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   51:     await ref.set(lesson);
   52:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   53:   }
   ```
   </details>

---

#### seed-current-voltage-resistance.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 348 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   345:     blocks,
   346:     updatedAt: new Date(),
   347:   };
   348: 
   349:   await lessonRef.set(data);
   350:   console.log(`✅ Lesson seeded: "${data.title}"`);
   351:   console.log(`   Path: courses/${COURSE_ID}/lessons/current-voltage-resistance`);
   ```
   </details>

---

#### seed-circuits-assessment.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 427 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   424:     blocks,
   425:     updatedAt: new Date(),
   426:   };
   427: 
   428:   await lessonRef.set(data);
   429:   console.log(`✅ Lesson seeded: "${data.title}"`);
   430:   console.log(`   Path: courses/${COURSE_ID}/lessons/circuits-assessment`);
   ```
   </details>

---

#### seed-ai-dead-classroom.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 342 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   339:   for (const courseId of COURSE_IDS) {
   340:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId);
   341:     const snap = await ref.get();
   342:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   343:     await ref.set(lesson);
   344:     console.log(`✅ Seeded "${lesson.title}" → ${courseId}`);
   345:   }
   ```
   </details>

---

#### seed-ai-project-manifesto.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 149 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   146: 
   147: async function main() {
   148:   for (const courseId of COURSE_IDS) {
   149:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   150:     await ref.set(lesson);
   151:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   152:   }
   153:   process.exit(0);
   ```
   </details>

---

#### seed-ai-unit6-lesson6.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 50 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   47:   for (const courseId of COURSE_IDS) {
   48:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   49:     const snap = await ref.get();
   50:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   51:     await ref.set(lesson);
   52:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   53:   }
   ```
   </details>

---

#### exempt-choice-project.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 133 — `.set`
   ```javascript
   await ref.set({ exempt: true, exemptAt: new Date(), exemptBy: "teacher" }, { merge: true });
   ```
   <details><summary>Context</summary>

   ```
   130:         if ((await ref.get()).exists) { await ref.update({ exempt: admin.firestore.FieldValue.delete(), exemptAt: admin.firestore.FieldValue.delete(), exemptBy: admin.firestore.FieldValue.delete() }); wrote++; }
   131:       }
   132:     } else {
   133:       const ref = db.doc(`progress/${p.uid}/courses/${p.cid}/lessons/${p.exemptLesson}`);
   134:       await ref.set({ exempt: true, exemptAt: new Date(), exemptBy: "teacher" }, { merge: true });
   135:       wrote++;
   136:     }
   ```
   </details>

---

#### seed-wave-speed.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 308 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   305:     blocks,
   306:     updatedAt: new Date(),
   307:   };
   308: 
   309:   await lessonRef.set(data);
   310:   console.log(`✅ Lesson seeded: "${data.title}"`);
   311:   console.log(`   Path: courses/${COURSE_ID}/lessons/wave-speed`);
   ```
   </details>

---

#### seed-ai-storybook-creative.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 86 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   83:   for (const courseId of COURSE_IDS) {
   84:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   85:     const snap = await ref.get();
   86:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   87:     await ref.set(lesson);
   88:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   89:   }
   ```
   </details>

---

#### seed-standing-waves.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 356 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   353:     blocks,
   354:     updatedAt: new Date(),
   355:   };
   356: 
   357:   await lessonRef.set(data);
   358:   console.log(`✅ Lesson seeded: "${data.title}"`);
   359:   console.log(`   Path: courses/${COURSE_ID}/lessons/standing-waves`);
   ```
   </details>

---

#### seed-energy-review-escape-room.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 113 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   110:     blocks,
   111:     updatedAt: new Date(),
   112:   };
   113: 
   114:   await lessonRef.set(data);
   115:   console.log(`✅ Lesson seeded successfully!`);
   116:   console.log(`   Title: "${data.title}"`);
   ```
   </details>

---

#### seed-circuit-symbols.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 441 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   438:     blocks,
   439:     updatedAt: new Date(),
   440:   };
   441: 
   442:   await lessonRef.set(data);
   443:   console.log(`✅ Lesson seeded: "${data.title}"`);
   444:   console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
   ```
   </details>

---

#### seed-motion1d-kinematics-practice.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 255 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   252: 
   253: async function seed() {
   254:   const ref = db.collection("courses").doc("physics")
   255:     .collection("lessons").doc("motion1d-kinematics-practice");
   256:   await ref.set(lesson);
   257:   console.log(`✅ Seeded "${lesson.title}" → physics/motion1d-kinematics-practice`);
   258:   console.log(`   Order: ${lesson.order} | Blocks: ${lesson.blocks.length}`);
   ```
   </details>

---

#### seed-dl-course-reflection.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 336 — `.set`
   ```javascript
   await ref.set(lessonDoc);
   ```
   <details><summary>Context</summary>

   ```
   333:     );
   334:     process.exit(0);
   335:   }
   336: 
   337:   await ref.set(lessonDoc);
   338:   console.log(
   339:     `Seeded ${COURSE_ID}/${LESSON_ID} — ${blocks.length} blocks (visible:false, no dueDate).`
   ```
   </details>

---

#### seed-ai-hallucination-hunt.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 434 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   431: async function main() {
   432:   const lessonId = 'hallucination-hunt-extra-credit';
   433:   for (const courseId of COURSE_IDS) {
   434:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId);
   435:     await ref.set(lesson);
   436:     console.log(`✅ Seeded "${lesson.title}" → ${courseId}`);
   437:   }
   ```
   </details>

---

#### seed-measuring-voltage-series-parallel.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 310 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   307:     blocks,
   308:     updatedAt: new Date(),
   309:   };
   310: 
   311:   await lessonRef.set(data);
   312:   console.log(`✅ Lesson seeded: "${data.title}"`);
   313:   console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
   ```
   </details>

---

#### seed-waves-intro.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 371 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   368:     blocks,
   369:     updatedAt: new Date(),
   370:   };
   371: 
   372:   await lessonRef.set(data);
   373:   console.log(`✅ Lesson seeded: "${data.title}"`);
   374:   console.log(`   Path: courses/${COURSE_ID}/lessons/waves-intro`);
   ```
   </details>

---

#### seed-ohms-law.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 335 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   332:     blocks,
   333:     updatedAt: new Date(),
   334:   };
   335: 
   336:   await lessonRef.set(data);
   337:   console.log(`✅ Lesson seeded: "${data.title}"`);
   338:   console.log(`   Path: courses/${COURSE_ID}/lessons/ohms-law`);
   ```
   </details>

---

#### batch-seed-lab-extensions.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 56 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   53:       console.log(`SKIP ${lessonId} — already exists`);
   54:       return;
   55:     }
   56: 
   57:     await ref.set(lesson);
   58:     console.log(`✅ Seeded "${lesson.title}" → ${courseId}/${lessonId} (${lesson.blocks.length} blocks)`);
   59:   } catch (e) {
   ```
   </details>

---

#### seed-waves-assessment.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 403 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   400:     blocks,
   401:     updatedAt: new Date(),
   402:   };
   403: 
   404:   await lessonRef.set(data);
   405:   console.log(`✅ Lesson seeded: "${data.title}"`);
   406:   console.log(`   Path: courses/${COURSE_ID}/lessons/waves-assessment`);
   ```
   </details>

---

#### seed-physics-course-reflection.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 309 — `.set`
   ```javascript
   await ref.set(lessonDoc);
   ```
   <details><summary>Context</summary>

   ```
   306:     );
   307:     process.exit(0);
   308:   }
   309: 
   310:   await ref.set(lessonDoc);
   311:   console.log(
   312:     `Seeded courses/${COURSE_ID}/lessons/${LESSON_ID} (${blocks.length} blocks, visible:false).`
   ```
   </details>

---

#### seed-circuit-lab-switches.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 214 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   211:     blocks,
   212:     updatedAt: new Date(),
   213:   };
   214: 
   215:   await lessonRef.set(data);
   216:   console.log(`✅ Lesson seeded: "${data.title}"`);
   217:   console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
   ```
   </details>

---

#### seed-ai-values-corporate-power.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 116 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   113:   for (const courseId of COURSE_IDS) {
   114:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId);
   115:     const snap = await ref.get();
   116:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   117:     await ref.set(lesson);
   118:     console.log(`✅ Seeded "${lesson.title}" → ${courseId}`);
   119:   }
   ```
   </details>

---

#### seed-ai-unit7-lesson6.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 56 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   53:   for (const courseId of COURSE_IDS) {
   54:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   55:     const snap = await ref.get();
   56:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   57:     await ref.set(lesson);
   58:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   59:   }
   ```
   </details>

---

#### _joe-fb-runthrough.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 70 — `.set`
   ```javascript
   await progressRef.set({
   ```
   <details><summary>Context</summary>

   ```
   67:   }
   68: 
   69:   // 3) Write Joe's progress doc
   70:   const progressRef = db.doc(`progress/${JOE_UID}/courses/${COURSE_ID}/lessons/${LESSON_ID}`);
   71:   await progressRef.set({
   72:     answers,
   73:     lastUpdated: new Date(),
   ```
   </details>

---

#### seed-ai-project-career-deep-dive.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 181 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   178: 
   179: async function main() {
   180:   for (const courseId of COURSE_IDS) {
   181:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   182:     await ref.set(lesson);
   183:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   184:   }
   185:   process.exit(0);
   ```
   </details>

---

#### seed-tool-embeds.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 143 — `.set`
   ```javascript
   await ref.set(lessonData);
   ```
   <details><summary>Context</summary>

   ```
   140:     ],
   141:     createdAt: admin.firestore.FieldValue.serverTimestamp(),
   142:   };
   143: 
   144:   await ref.set(lessonData);
   145:   console.log(`  ✅ Created hidden lesson: ${lessonId} in ${courseId}`);
   146: }
   ```
   </details>

---

#### seed-ai-agents-from-chatbots.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 383 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   380:   for (const courseId of COURSE_IDS) {
   381:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId);
   382:     const snap = await ref.get();
   383:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   384:     await ref.set(lesson);
   385:     console.log(`✅ Seeded "${lesson.title}" → ${courseId}`);
   386:   }
   ```
   </details>

---

#### seed-series-parallel-circuits.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 367 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   364:     blocks,
   365:     updatedAt: new Date(),
   366:   };
   367: 
   368:   await lessonRef.set(data);
   369:   console.log(`✅ Lesson seeded: "${data.title}"`);
   370:   console.log(`   Path: courses/${COURSE_ID}/lessons/series-parallel-circuits`);
   ```
   </details>

---

#### seed-ai-unit7-lesson5.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 48 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   45:   for (const courseId of COURSE_IDS) {
   46:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   47:     const snap = await ref.get();
   48:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   49:     await ref.set(lesson);
   50:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   51:   }
   ```
   </details>

---

#### seed-ai-unit7-lesson4.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 55 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   52:   for (const courseId of COURSE_IDS) {
   53:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   54:     const snap = await ref.get();
   55:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   56:     await ref.set(lesson);
   57:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   58:   }
   ```
   </details>

---

#### seed-ai-project-research-brief.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 144 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   141: 
   142: async function main() {
   143:   for (const courseId of COURSE_IDS) {
   144:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   145:     await ref.set(lesson);
   146:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   147:   }
   148:   process.exit(0);
   ```
   </details>

---

#### seed-power-rate-of-doing-work.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 401 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   398:     blocks,
   399:     updatedAt: new Date(),
   400:   };
   401: 
   402:   await lessonRef.set(data);
   403:   console.log(`✅ Lesson seeded successfully!`);
   404:   console.log(`   Title: "${data.title}"`);
   ```
   </details>

---

#### seed-sound-waves.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 355 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   352:     blocks,
   353:     updatedAt: new Date(),
   354:   };
   355: 
   356:   await lessonRef.set(data);
   357:   console.log(`✅ Lesson seeded: "${data.title}"`);
   358:   console.log(`   Path: courses/${COURSE_ID}/lessons/sound-waves`);
   ```
   </details>

---

#### seed-ai-unit7-lesson1.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 56 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   53:   for (const courseId of COURSE_IDS) {
   54:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   55:     const snap = await ref.get();
   56:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   57:     await ref.set(lesson);
   58:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   59:   }
   ```
   </details>

---

#### seed-ai-unit5-lesson8.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 56 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   53:   for (const courseId of COURSE_IDS) {
   54:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   55:     const snap = await ref.get();
   56:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   57:     await ref.set(lesson);
   58:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   59:   }
   ```
   </details>

---

#### seed-reading-circuit-diagrams.js
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 471 — `.set`
   ```javascript
   await lessonRef.set(data);
   ```
   <details><summary>Context</summary>

   ```
   468:     blocks,
   469:     updatedAt: new Date(),
   470:   };
   471: 
   472:   await lessonRef.set(data);
   473:   console.log(`✅ Lesson seeded: "${data.title}"`);
   474:   console.log(`   Path: courses/${COURSE_ID}/lessons/${LESSON_ID}`);
   ```
   </details>

---

#### seed-ai-unit7-lesson3.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 56 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   53:   for (const courseId of COURSE_IDS) {
   54:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   55:     const snap = await ref.get();
   56:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   57:     await ref.set(lesson);
   58:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   59:   }
   ```
   </details>

---

#### seed-ai-project-policy-pitch.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 183 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   180: 
   181: async function main() {
   182:   for (const courseId of COURSE_IDS) {
   183:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   184:     await ref.set(lesson);
   185:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   186:   }
   187:   process.exit(0);
   ```
   </details>

---

#### seed-ai-unit7-lesson2.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 56 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   53:   for (const courseId of COURSE_IDS) {
   54:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   55:     const snap = await ref.get();
   56:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   57:     await ref.set(lesson);
   58:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   59:   }
   ```
   </details>

---

#### seed-ai-when-should-ai-think.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 388 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   385:   for (const courseId of COURSE_IDS) {
   386:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lessonId);
   387:     const snap = await ref.get();
   388:     if (snap.exists) { console.log(`SKIP ${courseId} — already exists`); continue; }
   389:     await ref.set(lesson);
   390:     console.log(`✅ Seeded "${lesson.title}" → ${courseId}`);
   391:   }
   ```
   </details>

---

#### seed-ai-project-bias-audit.cjs
- **Risk:** CRITICAL
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 175 — `.set`
   ```javascript
   await ref.set(lesson);
   ```
   <details><summary>Context</summary>

   ```
   172: 
   173: async function main() {
   174:   for (const courseId of COURSE_IDS) {
   175:     const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
   176:     await ref.set(lesson);
   177:     console.log(`✅ Seeded ${lesson.title} → ${courseId}`);
   178:   }
   179:   process.exit(0);
   ```
   </details>

---

### HIGH

#### safe-lesson-write.cjs
- **Risk:** HIGH
- **Total calls:** 4
- **Uses `safeLessonWrite`:** yes (this IS the helper)
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 28 — `.set`
   ```javascript
   await lessonRef.set({ ...newLesson, ...buildAuditFields("created") });
   ```
   <details><summary>Context</summary>

   ```
   25:   const existing = await lessonRef.get();
   26: 
   27:   if (!existing.exists) {
   28:     // New lesson — write directly
   29:     await lessonRef.set({ ...newLesson, ...buildAuditFields("created") });
   30:     return { action: "created", preserved: 0 };
   31:   }
   ```
   </details>

2. Line 36 — `.set`
   ```javascript
   await lessonRef.set({ ...newLesson, ...buildAuditFields("updated") });
   ```
   <details><summary>Context</summary>

   ```
   33:   const oldBlocks = existing.data().blocks || [];
   34:   const newBlocks = newLesson.blocks || [];
   35: 
   36:   if (oldBlocks.length === 0) {
   37:     await lessonRef.set({ ...newLesson, ...buildAuditFields("updated") });
   38:     return { action: "updated", preserved: 0 };
   39:   }
   ```
   </details>

3. Line 44 — `.set`
   ```javascript
   await lessonRef.set({ ...newLesson, ...buildAuditFields("updated") });
   ```
   <details><summary>Context</summary>

   ```
   41:   // Check if any students have progress for this lesson
   42:   const hasProgress = await checkForProgress(db, courseId, lessonId);
   43:   if (!hasProgress) {
   44:     // No student progress — safe to overwrite
   45:     await lessonRef.set({ ...newLesson, ...buildAuditFields("updated") });
   46:     return { action: "updated", preserved: 0 };
   47:   }
   ```
   </details>

4. Line 79 — `.set`
   ```javascript
   await lessonRef.set(updatedLesson);
   ```
   <details><summary>Context</summary>

   ```
   76:     return block;
   77:   });
   78: 
   79:   const updatedLesson = { ...newLesson, blocks: remappedBlocks, ...buildAuditFields("updated-preserved") };
   80:   await lessonRef.set(updatedLesson);
   81:   return { action: "updated-preserved", preserved };
   82: }
   ```
   </details>

---

#### safe-seed.cjs
- **Risk:** HIGH
- **Total calls:** 4
- **Uses `safeLessonWrite`:** yes (this IS the helper)
- **Has lesson `.set`:** YES
- **Has `setDoc`:** no

**Offending calls:**

1. Line 10 — `.set`
   ```javascript
   //   // Instead of: await lessonRef.set(lessonData);
   ```
   <details><summary>Context</summary>

   ```
   7: // that occurred on 2026-03-13.
   8: //
   9: // Usage:
   10: //   const { safeSeed } = require('./safe-seed.cjs');
   11: //   // Instead of: await lessonRef.set(lessonData);
   12: //   // Use:        await safeSeed(db, courseId, lessonId, lessonData);
   13: //
   ```
   </details>

2. Line 42 — `.set`
   ```javascript
   await lessonRef.set(lessonData);
   ```
   <details><summary>Context</summary>

   ```
   39:   const existing = await lessonRef.get();
   40: 
   41:   // New lesson — safe to write directly
   42:   if (!existing.exists) {
   43:     await lessonRef.set(lessonData);
   44:     console.log(`  [safeSeed] Created: ${lessonId}`);
   45:     return { action: "created" };
   46:   }
   ```
   </details>

3. Line 52 — `.set`
   ```javascript
   await lessonRef.set(lessonData);
   ```
   <details><summary>Context</summary>

   ```
   49:   const hasProgress = await checkAnyProgress(db, courseId, lessonId);
   50: 
   51:   if (!hasProgress) {
   52:     // No student progress — safe to overwrite
   53:     await lessonRef.set(lessonData);
   54:     console.log(`  [safeSeed] Updated (no progress): ${lessonId}`);
   55:     return { action: "updated" };
   56:   }
   ```
   </details>

4. Line 60 — `.set`
   ```javascript
   await lessonRef.set(lessonData);
   ```
   <details><summary>Context</summary>

   ```
   57:   // Student progress exists!
   58:   if (allowOverwrite) {
   59:     console.warn(`  ⚠️  [safeSeed] OVERWRITING lesson with progress: ${lessonId} (allowOverwrite=true)`);
   60:     await lessonRef.set(lessonData);
   61:     return { action: "force-overwritten" };
   62:   }
   ```
   </details>

---

### LOW

#### seed-class-songs-playlists.cjs
- **Risk:** LOW
- **Total calls:** 2
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** no
- **Has `setDoc`:** no
- **Notes:** `Map.set()` and `merge: true` on playlist docs, not lessons.

#### migrate-queue-schema.cjs
- **Risk:** LOW
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** no
- **Has `setDoc`:** no
- **Notes:** Patches `assignmentQueue` docs with `merge: true`.

#### setup-assignment-queue.cjs
- **Risk:** LOW
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** no
- **Has `setDoc`:** no
- **Notes:** Creates schema example doc in `assignmentQueue`.

#### seed-physics-w22.js
- **Risk:** LOW
- **Total calls:** 1
- **Uses `safeLessonWrite`:** yes
- **Has lesson `.set`:** no
- **Has `setDoc`:** no
- **Notes:** Creates `courses/physics` course doc, not a lesson.

#### backfill-space-rescue-progress.cjs
- **Risk:** LOW
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** no
- **Has `setDoc`:** no
- **Notes:** Writes to `progress/{uid}/courses/{id}/activities/space-rescue`.

#### _auth-exception-scan.cjs
- **Risk:** LOW
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** no
- **Has `setDoc`:** no
- **Notes:** `Map.set()` on in-memory Map, not Firestore.

#### backfill-bias-progress.cjs
- **Risk:** LOW
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** no
- **Has `setDoc`:** no
- **Notes:** Writes to `progress/{uid}/courses/{id}/activities/bias-audit`.

#### seed-physics-enrollments.cjs
- **Risk:** LOW
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** no
- **Has `setDoc`:** no
- **Notes:** `batch.set()` on `enrollments` collection.

#### sync-lesson-week-stubs.cjs
- **Risk:** LOW
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** no
- **Has `setDoc`:** no
- **Notes:** `Map.set()` on in-memory Map, not Firestore.

#### setup-qa-student.cjs
- **Risk:** LOW
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** no
- **Has `setDoc`:** no
- **Notes:** Creates `users/{uid}` doc with `merge: true`.

#### seed-steady-playlist.cjs
- **Risk:** LOW
- **Total calls:** 1
- **Uses `safeLessonWrite`:** no
- **Has lesson `.set`:** no
- **Has `setDoc`:** no
- **Notes:** Updates `playlists` doc with `merge: true`.

---

## Block ID Regeneration / Destructive Field Patterns

Re-scan of `/Users/lukemccarthy/pantherlearn/scripts/*.cjs` and `*.js` for patterns that regenerate block IDs or overwrite control fields.

### Block ID regeneration (`id: randomUUID()/nanoid()/generateId()/crypto.randomUUID()/uuidv4()`)

| File | Line | Text |
|------|------|------|
| `fix-ability-architect-scored.cjs` | 23 | `id: randomUUID(),` |
| `seed-quiz-real-vs-ai.cjs` | 100 | `id: generateId(),` |
| `seed-quiz-real-vs-ai.cjs` | 138 | `id: generateId(),` |

**Note:** `seed-quiz-real-vs-ai.cjs` is a **quiz tool** (standalone HTML activity), not a lesson seed script. The `generateId()` calls are for internal quiz items, not Firestore block IDs. `fix-ability-architect-scored.cjs` is a one-time fix script that regenerates a single embed block ID — it was run after the original lesson was already live, which is exactly the risk this audit tracks. That script should have used `safeLessonWrite()`.

### `blocks: [` array literals (lesson seed scripts)

Every CRITICAL seed script above declares `blocks: [` as a literal array in the lesson object. This is expected — the danger is not the literal itself, but the `await ref.set(lesson)` that writes it to Firestore without preserving existing block IDs.

| File | Line | Text |
|------|------|------|
| `link-dl-fix.cjs` | 100 | `blocks: [` |
| `link-dl-fix.cjs` | 121 | `blocks: [` |
| `link-dl-fix.cjs` | 142 | `blocks: [` |
| `link-dl-fix.cjs` | 163 | `blocks: [` |
| `seed-ai-agents-from-chatbots.cjs` | 26 | `blocks: [` |
| `seed-ai-dead-classroom.cjs` | 26 | `blocks: [` |
| `seed-ai-everywhere-edtech.cjs` | 25 | `blocks: [` |
| `seed-ai-hallucination-hunt.cjs` | 28 | `blocks: [` |
| `seed-ai-notebooklm-study-tool.cjs` | 25 | `blocks: [` |
| `seed-ai-personalization-checkin.cjs` | 46 | `blocks: [` |
| `seed-ai-project-bias-audit.cjs` | 21 | `blocks: [` |
| `seed-ai-project-build-with-ai.cjs` | 26 | `blocks: [` |
| `seed-ai-project-career-deep-dive.cjs` | 20 | `blocks: [` |
| `seed-ai-project-centaur-showdown.cjs` | 21 | `blocks: [` |
| `seed-ai-project-ethics-court.cjs` | 20 | `blocks: [` |
| `seed-ai-project-field-test.cjs` | 23 | `blocks: [` |
| `seed-ai-project-manifesto.cjs` | 20 | `blocks: [` |
| `seed-ai-project-policy-pitch.cjs` | 20 | `blocks: [` |
| `seed-ai-project-prompt-portfolio.cjs` | 21 | `blocks: [` |
| `seed-ai-project-replace-me.cjs` | 23 | `blocks: [` |
| `seed-ai-project-research-brief.cjs` | 26 | `blocks: [` |
| `seed-ai-quests-reflection.cjs` | 70 | `blocks: [` |
| `seed-ai-storybook-creative.cjs` | 25 | `blocks: [` |
| `seed-ai-suno-song-day1.cjs` | 43 | `blocks: [` |
| `seed-ai-suno-song-day2.cjs` | 33 | `blocks: [` |
| `seed-ai-unit5-lesson1.cjs` | 23 | `blocks: [` |
| `seed-ai-unit5-lesson2.cjs` | 18 | `blocks: [` |
| `seed-ai-unit5-lesson3-prompt-battle.cjs` | 94 | `blocks: [...trimmed, ...PROMPT_BATTLE_BLOCKS],` |
| `seed-ai-unit5-lesson3.cjs` | 18 | `blocks: [` |
| `seed-ai-unit5-lesson4.cjs` | 18 | `blocks: [` |
| `seed-ai-unit5-lesson5.cjs` | 21 | `blocks: [` |
| `seed-ai-unit5-lesson6.cjs` | 20 | `blocks: [` |
| `seed-ai-unit5-lesson7.cjs` | 18 | `blocks: [` |
| `seed-ai-unit5-lesson8.cjs` | 18 | `blocks: [` |
| ... (and 40+ more) | | |

### `visible: true/false` in seed scripts

| File | Line | Text |
|------|------|------|
| `batch-seed-lab-extensions.cjs` | 45 | `// Ensure visible: false` |
| `seed-ai-agents-from-chatbots.cjs` | 24 | `visible: false,` |
| `seed-ai-dead-classroom.cjs` | 24 | `visible: false,` |
| `seed-ai-everywhere-edtech.cjs` | 23 | `visible: false,` |
| `seed-ai-hallucination-hunt.cjs` | 25 | `visible: false,` |
| `seed-ai-notebooklm-study-tool.cjs` | 24 | `visible: false,` |
| `seed-ai-personalization-checkin.cjs` | 40 | `visible: false,` |
| `seed-ai-project-bias-audit.cjs` | 22 | `visible: false,` |
| `seed-ai-project-build-with-ai.cjs` | 27 | `visible: false,` |
| `seed-ai-project-career-deep-dive.cjs` | 21 | `visible: false,` |
| `seed-ai-project-centaur-showdown.cjs` | 22 | `visible: false,` |
| `seed-ai-project-ethics-court.cjs` | 21 | `visible: false,` |
| `seed-ai-project-field-test.cjs` | 24 | `visible: false,` |
| `seed-ai-project-manifesto.cjs` | 21 | `visible: false,` |
| `seed-ai-project-policy-pitch.cjs` | 21 | `visible: false,` |
| `seed-ai-project-prompt-portfolio.cjs` | 22 | `visible: false,` |
| `seed-ai-project-replace-me.cjs` | 24 | `visible: false,` |
| `seed-ai-project-research-brief.cjs` | 27 | `visible: false,` |
| `seed-ai-storybook-creative.cjs` | 24 | `visible: false,` |
| `seed-ai-suno-song-day1.cjs` | 40 | `visible: false,` |
| `seed-ai-suno-song-day2.cjs` | 29 | `visible: true,` |
| `seed-ai-unit5-lesson1.cjs` | 22 | `visible: false,` |
| `seed-ai-unit5-lesson2.cjs` | 17 | `visible: false,` |
| `seed-ai-unit5-lesson3.cjs` | 17 | `visible: false,` |
| `seed-ai-unit5-lesson4.cjs` | 17 | `visible: false,` |
| `seed-ai-unit5-lesson5.cjs` | 20 | `visible: false,` |
| `seed-ai-unit5-lesson6.cjs` | 19 | `visible: false,` |
| `seed-ai-unit5-lesson7.cjs` | 17 | `visible: false,` |
| `seed-ai-unit5-lesson8.cjs` | 17 | `visible: false,` |
| `seed-ai-unit6-lesson1.cjs` | 17 | `visible: false,` |
| `seed-ai-unit6-lesson2.cjs` | 17 | `visible: false,` |
| `seed-ai-unit6-lesson3.cjs` | 17 | `visible: false,` |
| `seed-ai-unit6-lesson4-day2.cjs` | 17 | `visible: false,` |
| `seed-ai-unit6-lesson4.cjs` | 17 | `visible: false,` |
| `seed-ai-unit6-lesson5.cjs` | 17 | `visible: false,` |
| `seed-ai-unit6-lesson6.cjs` | 17 | `visible: false,` |
| `seed-ai-unit7-lesson1.cjs` | 17 | `visible: false,` |
| `seed-ai-unit7-lesson2.cjs` | 17 | `visible: false,` |
| `seed-ai-unit7-lesson3.cjs` | 17 | `visible: false,` |
| `seed-ai-unit7-lesson4.cjs` | 17 | `visible: false,` |
| `seed-ai-unit7-lesson5.cjs` | 17 | `visible: false,` |
| `seed-ai-unit7-lesson6.cjs` | 17 | `visible: false,` |
| `seed-ai-values-corporate-power.cjs` | 23 | `visible: false,` |
| `seed-ai-when-should-ai-think.cjs` | 24 | `visible: false,` |
| `seed-crack-the-circuit-challenge.cjs` | 129 | `visible: false,` |
| `seed-dl-course-reflection.cjs` | 28 | `visible: false,` |
| `seed-physics-course-reflection.cjs` | 28 | `visible: false,` |
| `seed-tool-embeds.cjs` | 29 | `visible: false,` |

**Note:** Most seed scripts correctly set `visible: false` at seed time. The risk is that a re-run after `visible` has been flipped to `true` (or a script that does NOT check `snap.exists` before `.set()`) would overwrite a live lesson. `seed-ai-suno-song-day2.cjs` is the only seed script in the audit that sets `visible: true` directly — it seeds a lesson that is meant to go live immediately.

### `dueDate:` in seed scripts

| File | Line | Text |
|------|------|------|
| `seed-ai-hallucination-hunt.cjs` | 26 | `dueDate: "2026-04-14",` |
| `seed-ai-personalization-checkin.cjs` | 42 | `dueDate: '2026-05-18',` |
| `seed-ai-quests-reflection.cjs` | 68 | `dueDate: '2026-04-17',` |
| `seed-ai-storybook-creative.cjs` | 24 | `dueDate: '2026-03-25',` |
| `seed-ai-suno-song-day1.cjs` | 42 | `dueDate: '2026-05-18',` |
| `seed-ai-suno-song-day2.cjs` | 32 | `dueDate: '2026-05-20',` |
| `seed-ai-unit5-lesson5.cjs` | 19 | `dueDate: '2026-04-22',` |
| `seed-ai-unit5-lesson6.cjs` | 18 | `dueDate: '2026-04-23',` |
| `seed-circuit-build-lab.cjs` | 159 | `dueDate: "2026-06-04",` |
| `seed-coulombs-law-data-lab.cjs` | 28 | `dueDate: '2026-04-28',` |
| `seed-crack-the-circuit-challenge.cjs` | 128 | `dueDate: '2026-04-28',` |
| `seed-diglit-algorithm-tiktok.cjs` | 16 | `dueDate: '2026-04-28',` |
| `seed-diglit-portfolio-capstone.cjs` | 29 | `dueDate: '2026-04-28',` |
| `seed-dl-suno-extra-credit.cjs` | 33 | `dueDate: '2026-04-28',` |
| `seed-notebooklm-split.cjs` | 34 | `dueDate: '2026-04-28',` |
| `seed-notebooklm-split.cjs` | 202 | `dueDate: '2026-04-28',` |
| `seed-physics-show-me-circuit-switch.cjs` | 115 | `dueDate: '2026-04-28',` |
| `seed-physics-show-me-surge-protector.cjs` | 148 | `dueDate: '2026-04-28',` |
| `seed-ai-news-may11.js` | 385 | `dueDate: "2026-05-11",` |
| `seed-circuit-discovery.js` | 358 | `dueDate: "2026-04-28",` |
| `seed-circuit-lab-switches.js` | 208 | `dueDate: "2026-04-28",` |
| `seed-circuit-stations-lab.js` | 86 | `dueDate: "2026-04-28",` |
| `seed-circuit-symbols.js` | 435 | `dueDate: "2026-04-28",` |
| `seed-circuits-quiz...` | (truncated) | |

### `gradesReleased: true/false` in seed scripts

| File | Line | Text |
|------|------|------|
| `digitize-defendant-scoring.cjs` | 59 | `gradesReleased: true` |
| `rebuild-coulombs-law-data-lab.cjs` | 147 | `gradesReleased: true,` |
| `seed-ai-hallucination-hunt.cjs` | 27 | `gradesReleased: true,` |
| `seed-ai-personalization-checkin.cjs` | 41 | `gradesReleased: false,` |
| `seed-ai-quests-reflection.cjs` | 69 | `gradesReleased: true,` |
| `seed-ai-suno-song-day1.cjs` | 41 | `gradesReleased: true,` |
| `seed-ai-suno-song-day2.cjs` | 30 | `gradesReleased: true,` |
| `seed-ai-unit5-lesson5.cjs` | 20 | `gradesReleased: true,` |
| `seed-ai-unit5-lesson6.cjs` | 19 | `gradesReleased: true,` |
| `seed-circuit-build-lab.cjs` | 158 | `gradesReleased: true,` |
| `seed-coulombs-law-data-lab.cjs` | 29 | `gradesReleased: true,` |
| `seed-crack-the-circuit-challenge.cjs` | 124 | `gradesReleased: true,` |
| `seed-diglit-algorithm-tiktok.cjs` | 16 | `gradesReleased: true,` |
| `seed-diglit-portfolio-capstone.cjs` | 29 | `gradesReleased: true,` |
| `seed-dl-suno-extra-credit.cjs` | 33 | `gradesReleased: true,` |
| `seed-notebooklm-split.cjs` | 34 | `gradesReleased: true,` |
| `seed-notebooklm-split.cjs` | 202 | `gradesReleased: true,` |
| `seed-physics-show-me-circuit-switch.cjs` | 115 | `gradesReleased: true,` |
| `seed-physics-show-me-surge-protector.cjs` | 148 | `gradesReleased: true,` |
| `seed-ai-news-may11.js` | 386 | `gradesReleased: true,` |
| `seed-circuit-discovery.js` | 359 | `gradesReleased: true,` |
| `seed-circuit-lab-switches.js` | 209 | `gradesReleased: true,` |
| `seed-circuit-stations-lab.js` | 87 | `gradesReleased: true,` |
| `seed-circuit-symbols.js` | 436 | `gradesReleased: true,` |
| `seed-circuits-quiz...` | (truncated) | |

---

## Recommendations

1. **Retrofit all CRITICAL seed scripts to use `safeLessonWrite()`**
   - 74 scripts use `await ref.set(lesson)` on the lessons collection.
   - The standard pattern should be: `const { safeLessonWrite } = require('./safe-lesson-write.cjs'); await safeLessonWrite(db, courseId, lesson.id, lesson);`
   - Scripts that check `if (snap.exists) skip` are safe for first-run, but a re-run after the lesson goes live (or an edit that removes the guard) is a grade-loss incident waiting to happen.

2. **Add a lint/CI rule**
   - Any `.set()` or `setDoc()` targeting `collection('lessons')` or `collection("lessons")` must be accompanied by an import of `safe-lesson-write.cjs` or a comment explaining why it's safe.
   - This should be enforced in pre-commit or CI.

3. **Audit the `exists` guards**
   - Many scripts check `if (snap.exists) { console.log('SKIP'); continue; }` before `.set()`. This is a soft guard — it protects against accidental re-runs but does NOT protect against:
     - A script edited to remove the guard
     - A lesson that was deleted and re-created with the same ID
     - A script run on a different environment where the lesson exists but with different data
   - `safeLessonWrite()` is the only robust protection because it checks for student progress, not just document existence.

4. **Remove or archive the unsafe helpers**
   - `safe-seed.cjs` is a precursor to `safe-lesson-write.cjs`. It still has raw `.set()` paths inside it (lines 42, 52, 60). While it checks `hasProgress`, the helper itself is redundant now that `safe-lesson-write.cjs` exists. Consider deprecating `safe-seed.cjs` and migrating all callers to `safe-lesson-write.cjs`.

5. **Document the two approved patterns**
   - **New lesson (no student progress possible):** `safeLessonWrite()` — it will create directly if the doc doesn't exist.
   - **Update to live lesson:** `safeLessonWrite()` — it will preserve existing block IDs and merge new blocks, never regenerating IDs for blocks that students have already answered.

6. **Special case: `test-grade-bonus-preservation.cjs`**
   - This script intentionally tests `.set()` with `{ merge: true }` on a **test lesson** (`test-grade-bonus`). It is not a production seed script. However, it writes to the real Firestore lessons collection. Consider:
     - Moving it to a dedicated `test/` subdirectory
     - Adding a prominent header comment: `// TEST ONLY — never run on production lessons`
     - Or rewriting it to use a mock Firestore instance

7. **Special case: `award-p5-quiz-credit.cjs`, `migrate-orphaned-progress.cjs`, `migrateReflections.js`, `exempt-choice-project.cjs`, `_joe-fb-runthrough.cjs`**
   - These are **progress/grade backfill scripts**, not lesson seeds. They write to `progress/{uid}/courses/{cid}/lessons/{lid}` or `reflections`.
   - They use `.set()` with `{ merge: true }`, which is correct for progress docs (progress is keyed by block ID, not block ID regeneration).
   - However, `award-p5-quiz-credit.cjs` has a comment warning about `setDoc({merge:true})` with dotted keys — this is a known Firestore pitfall. Ensure the nested-object pattern is used consistently.
   - `exempt-choice-project.cjs` writes `exempt: true` to progress docs — this is a grade-affecting write. It should be reviewed for correctness but is not a block-ID-regeneration risk.

8. **Special case: `batch-seed-lab-extensions.cjs`**
   - This script seeds multiple lab-extension lessons in a loop. It has an `exists` guard but no `safeLessonWrite()`. Given that lab extensions are often created after the main lesson is live, this is a high-risk script for accidental re-runs.

9. **Monitor `seed-ai-suno-song-day2.cjs`**
   - This is the only seed script that sets `visible: true` directly. It is meant to go live immediately. Ensure it is never re-run after students have started the lesson.

10. **Add a `seed-script-template.cjs`**
    - Create a canonical template that all new seed scripts must copy. It should:
      - Import `safeLessonWrite`
      - Set `visible: false` by default
      - Use `safeLessonWrite(db, courseId, lesson.id, lesson)` instead of `ref.set(lesson)`
      - Include a comment: `// Never use ref.set(lesson) — always use safeLessonWrite()`
    - This template should be referenced in `CLAUDE.md` and `.claude/rules/grade-data-integrity.md`.

---

*End of report.*
