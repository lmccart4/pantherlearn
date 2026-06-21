# Kimi Rules Fix Summary — 2026-06-20

Files written (originals untouched):
- `pantherlearn-wt/audit-fixes/firestore.rules.fixed`
- `pantherlearn-wt/audit-fixes/storage.rules.fixed`
- `pantherprep/firestore.rules.fixed`

No deploy, no firebase CLI, no git commit.

---

## PantherLearn `firestore.rules.fixed`

### AUDIT-C1 — Stop self-escalation to teacher
- `isTeacher()` now reads `request.auth.token.role == "teacher"` instead of `users/{uid}.data.role`.
  - Allows: any user with a server-set `teacher` custom claim.
  - Denies: students who wrote `role:"teacher"` to their own user doc.
  - Comment notes claims are set by Admin SDK / Cloud Functions from the @paps.net email pattern + override lists, and that existing teachers will fail until backfilled.
- `users/{uid}` write rule split into create/update/delete.
  - Teachers may still write any user doc.
  - Students may create their own doc only if protected fields are at safe defaults (`role == "student"` or absent, `enrolledCourses` absent, `isTestStudent` false/absent, no balance/credit/mana fields).
  - Students may update their own doc only if protected fields (`role`, `enrolledCourses`, `isTestStudent`, plus balance/credit/mana fields) do not change.
  - Students may no longer delete their own user doc.

### AUDIT-C2 — Stop self-grading in `progress/{uid}/**`
- `progress/{uid}/{document=**}` owner write now requires `progressWriteIsSane()`.
  - Allows: owner writes where `score`, `maxScore`, `writtenScore`, `correct` stay within sane bounds.
  - Denies: owner writes that set teacher-owned fields `approved` or `gradedBy`, or out-of-bounds scores.
  - Comment notes this is a stopgap and the durable fix is server-side score recomputation.

### AUDIT-C4 — Stop cross-student PII reads
- `users/{uid}` read: now `isOwner(uid) || isTeacher()` (was any logged-in user).
- `studentProfiles/{id}` and `classSongs/{id}`: now teacher-only (was any authenticated user).
- Top-level `enrollments/{enrollmentId}` read: now teacher-only or own-by-email (was any logged-in user).
- `pantherTrack/classes/list/{classId}` and all subcollections: now readable/writable only by the class owner (was any authenticated user).
- `botProjects/{projectId}` read: now owner or teacher (was any authenticated user).
- `battleship-scores/{docId}` read: now owner or teacher (was any authenticated user).

---

## PantherLearn `storage.rules.fixed`

### AUDIT-C1 — Stop self-escalation to teacher
- `isTeacher()` now reads `request.auth.token.role == "teacher"` instead of Firestore `users/{uid}.data.role`.
  - Same transition note as above.
- Removed the redundant `request.auth.token.role == 'teacher'` clause in the upload read rule; `isTeacher()` now covers it.

### AUDIT-C4 — Storage upload reads
- Students still read only their own upload folder; teachers still read any upload folder.

---

## PantherPrep `firestore.rules.fixed`

### AUDIT-C1 — Stop self-escalation to teacher
- Added `isTeacher()` and `isAdmin()` helpers reading `request.auth.token.role`.
- `isStaff(uid)` now delegates to those custom-claim helpers instead of reading `students/{uid}.data.role`.
  - Allows: users with server-set `teacher` or `admin` claim.
  - Denies: students who wrote `role:"teacher"` to their own student doc.
- `students/{uid}` write rule split:
  - Create allowed only if `role == "student"`.
  - Update allowed only if the `role` field does not change.
  - Delete denied from client.

### AUDIT-C4 — Stop cross-student PII reads
- `students/{uid}` read: now own uid or staff (was any authenticated paps user).
- `sessions/{sessionId}` read: now own uid or staff; create requires own uid (was any authenticated paps user could read/create all sessions).

---

## CALLOUT — Verify before deploy

These tightened rules may break real workflows if the corresponding server-side pieces are not already in place:

1. **Custom claim backfill required.** Everywhere `isTeacher()` / `isStaff()` now checks `request.auth.token.role`, existing teacher/staff accounts will be denied until their claim is set. Verify the claim-setting function exists and has been run for Luke and any agent/QA accounts that need teacher access.
2. **PantherLearn client enrollment will break.** `users/{uid}` now forbids student writes to `enrolledCourses`. The current `src/lib/enrollment.jsx` writes this field directly from the browser. Deploy these rules only after an `enrollInCourse` Cloud Function is live and the client calls it.
3. **PantherLearn agents (Pixel/Link/qa-student) may lose teacher gates.** If those accounts previously relied on `users/{uid}.data.role == "teacher"`, they now need the custom claim. Verify agent accounts have the claim, or scope them via `isPapsUser`-style rules where appropriate.
4. **PantherPrep agents/qa-student may lose staff reads.** `isStaff()` is now claim-based. If Pixel/Link QA reads sessions/performanceLog/adaptiveProfile as staff, their accounts need the `teacher` or `admin` claim. No provider restrictions were added, so email/password auth still works, but staff access requires the claim.
5. **PantherTrack class visibility is now limited to the class owner.** If co-teachers, deputies, or admins need to read a class they do not own, this rule is too narrow. Verify no shared-access workflows exist.
6. **botProjects and battleship-scores reads are now owner/teacher only.** If any student gallery or leaderboard depends on all students reading these docs, it will break.
7. **Progress C2 is a partial mitigation.** A determined student can still inflate within-bound scores inside the nested `answers` map because Rules cannot deeply validate every nested field. The permanent fix is server-side score recomputation, which is not implemented here.
8. **Existing `users/{uid}` docs with `role` field.** The `role` field is no longer trusted by Rules, but stale values remain in Firestore. Client code that still reads `userDoc.role` for UI gating will show outdated teacher UI until the client is also migrated to `request.auth.token.role`.

---

Recommendation: deploy these rules only after the custom-claim migration and the server-side enrollment function are verified; run a non-production Rules unit test or emulator pass if possible.
