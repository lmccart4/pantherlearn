# AGENTS.md — PantherLearn (for Kimi / Cline / Roo / non-Claude assistants)

PantherLearn (pantherlearn.com) is Luke McCarthy's primary course-content platform — a Vite + React
app on Firebase (hosting + Firestore). Students do lessons here; **their grades and work are stored in
Firestore and keyed to lesson block IDs.** That fact drives every rule below.

The full operating brain is in `~/Lachlan/CLAUDE.md` and `~/Lachlan/.claude/rules/`. This file is the
must-not-break subset for working in *this* codebase.

## 🔴 NON-NEGOTIABLE — break these and students lose grades/work

1. **Never `.set()` or wholesale-overwrite a live lesson doc.** Block IDs are grade keys; regenerating
   them orphans every student's score and breaks Classroom sync. (This actually happened — 107 zeros
   pushed to Google Classroom, 180 progress records orphaned.)
2. **All lesson seed/edit scripts use `safeLessonWrite()`** — `scripts/safe-lesson-write.cjs`. It is
   append-only: adds blocks, never removes/reorders/re-IDs. It also preserves `visible` / `dueDate` /
   `gradesReleased`. Raw seed scripts are the #1 historical cause of grade disasters.
3. **You may** add new blocks, create new lessons, or fix a broken/lost grade link. You may **not**
   delete blocks students have scores on, move scored activities, or rename/re-ID completed lessons.
4. **Student work must persist to Firestore**, not localStorage-only. Tools that produce work post
   `{type:'html-activity-state', state}`; `EmbedBlock` saves it. Score-only is data loss. Verify the
   round-trip before shipping (a working in-tool autosave indicator does NOT prove server persistence).

## 🟠 Deploy & build

- **Always `npm run build` before `firebase deploy --only hosting`.** `firebase.json` serves `dist/`,
  which only updates via the Vite build. Deploying without building ships stale content.
- `npm run dev` = local Vite. New block types need a case in `LessonViewer.jsx`'s `blocksWithProps`
  allowlist or they render with empty `studentData`.
- New graded block types must be added to `scripts/classroom-sync.cjs`'s allowlist or grades silently
  don't sync.

## 🟡 Content conventions

- **Math:** KaTeX only — `$inline$`, `$$display$$`. Never plain-text equations.
- **Multiple choice:** correct answer randomized ~25% across A/B/C/D; every MC has an objectively
  correct answer (opinion polls use `allCorrect: true` + a short-answer follow-up). See
  `.claude/rules/multiple-choice.md`.
- **Scored embeds:** `scored: true`, `weight: 5`, auto-submit on results screen AND re-send on Submit
  click (no guard), `gradesReleased: true` for same-day grade visibility.
- **Images:** use `storage.googleapis.com/<bucket>/<path>` URLs (the `firebasestorage.googleapis.com`
  SDK form 403s without a token). No fake SVG/CSS/emoji art — real images only.
- **Lesson `dueDate`** is a `"YYYY-MM-DD"` string, not a Date/Timestamp, or it falls into Unscheduled.
- **No client-side API keys** in deployed HTML/JS — proxy via Cloud Function.
- New lessons seed `visible:false`; Luke controls go-live.

## Ask before

- Any `firebase deploy`, any Firestore write to live lessons, anything touching grades, any paid API.
- Sending to Google Classroom / external surfaces.

## Verify before claiming done

Run the build, run tests, check Firestore actually changed. Don't report success from intent.

When in doubt about grades or persistence: **stop and ask Luke.** Cost of pausing is zero; cost of
wiping student grades is enormous.
