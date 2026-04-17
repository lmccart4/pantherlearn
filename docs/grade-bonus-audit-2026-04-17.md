# Grade Bonus Audit — 2026-04-17

| File:Line | Write type | Risk | Fix needed? |
|-----------|------------|------|-------------|
| WrittenResponseCard.jsx:90 | `updateDoc(progressRef, updatePayload)` (dot-notation, grade fields only) | SAFE | no |
| WrittenResponseCard.jsx:135 | `updateDoc(progressRef, { answers.blockId: deleteField(), completed: false, completedAt: deleteField() })` | SAFE | no |
| AnnotationOverlay.jsx:110 | `setDoc(ref, { annotations: {...} }, { merge: true })` | SAFE | no |
| AnnotationOverlay.jsx:133 | `getDoc(ref)` — read only, no write | SAFE | no |
| LessonCompleteButton.jsx:281 | `setDoc(progressRef, { completedAt, completed: true }, { merge: true })` | SAFE | no |
| useEngagementTimer.jsx:30 | `setDoc(ref, { engagementTime: total }, { merge: true })` | SAFE | no |
| useEngagementTimer.jsx:42 | `getDoc(ref)` — read only, no write | SAFE | no |
| StudentProgress.jsx:484 | `setDoc(progressRef, { completed, completedAt, manuallyCompleted, completedBy }, { merge: true })` — teacher manual complete | SAFE | no |
| StudentProgress.jsx:537 | `deleteDoc(progressRef)` — teacher "reset progress" intentionally wipes entire lesson doc including gradeBonus | JUDGMENT CALL | no — deliberate full reset |
| StudentProgress.jsx:582 | `updateDoc(progressRef, { answers.blockId: deleteField(), completed: false, completedAt: deleteField() })` — single block reset | SAFE | no |
| StudentProgress.jsx:870 | `updateDoc(progressRef, updatePayload)` (dot-notation, grade fields only) | SAFE | no |
| StudentProgress.jsx:1307 | `updateDoc / setDoc(progressRef, {}, { merge: true })` — exempt toggle, merge only | SAFE | no |

## Summary
**0 RISK sites.** All writes use `merge: true` or `updateDoc` with dot-notation partial updates. No full overwrites that would clobber `gradeBonus`.

## Judgment Calls
- `StudentProgress.jsx:537` — `deleteDoc` on the full lesson progress doc during "Reset Progress" wipes `gradeBonus`. This is intentional: the teacher UI says "clears all their answers, completion status, and reflection." Wiping earned mana bonuses alongside a full reset is arguably correct behavior — a teacher using this nuclear option likely wants a clean slate. Left as-is and noted.
