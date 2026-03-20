# PantherLearn Scripts

## ⛔ WARNING: DO NOT USE RAW `.set()` ON LESSON DOCUMENTS

**Using raw Firestore `.set()` on a lesson document will regenerate all block IDs, orphaning every student's progress and grades. This already happened on 2026-03-13 and destroyed 107 student grades.**

### Safe alternatives:

| Method | When to use |
|--------|-------------|
| `safeSeed(db, courseId, lessonId, data)` | **Default for seed scripts.** Checks for student progress before writing. Refuses to overwrite if progress exists. |
| `safeLessonWrite(db, courseId, lessonId, data)` | **For updates to existing lessons.** Preserves block IDs by remapping via content similarity matching. |
| Raw `.set()` | **NEVER on lessons with student data.** Only acceptable for brand-new lessons that no student has ever seen. |

### Usage:

```js
// ✅ SAFE — use for all seed scripts
const { safeSeed } = require('./safe-seed.cjs');
await safeSeed(db, courseId, lessonId, lessonData);

// ✅ SAFE — use for lesson updates that must preserve block IDs
const { safeLessonWrite } = require('./safe-lesson-write.cjs');
await safeLessonWrite(db, courseId, lessonId, lessonData);

// ⛔ DANGEROUS — will destroy student grades if lesson has progress
await lessonRef.set(lessonData);
```

### Existing seed scripts

There are 135+ seed scripts in this directory that use raw `.set()`. These were written before `safeLessonWrite()` existed. **Do not run them against live lessons that students have already completed.** If you need to update a live lesson, use `safeSeed()` or `safeLessonWrite()` instead.

A git pre-commit hook warns if new code uses raw `.set()` on lesson documents in this directory.
