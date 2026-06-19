# OpenSciEd Physics U2–U6 — Embed Finalization Checklist

These 14 embeds are **first drafts** (Kimi-written, kit-wired, bilingual, scoring present). Your job
is to **finalize**: verify + fix scoring wiring, add auto-send where missing, verify physics against
the spec, confirm bilingual completeness, and add a minimal Node test for each scoring model.

These are SCORED, grade-touching activities for a future course (`physics-2026`, `visible:false`,
NOT yet deployed). Quality matters; do not break the score → Firestore contract.

**Working dir:** `/Users/lukemccarthy/pantherlearn-wt/openscied-u1-grid-sim/public/tools/`
Edit ONLY your assigned unit's `*.html` + `*-model.js` files and CREATE the test files. Do not touch
other units, the U1 embeds (energy-flow / grid / induction), seed scripts, or lessons. Do NOT deploy.

---

## 0. Read first (authoritative rules)
- `/Users/lukemccarthy/Lachlan/.claude/rules/scored-embed-checklist.md` — the score postMessage contract (SACRED)
- `/Users/lukemccarthy/Lachlan/.claude/rules/persist-student-interaction-data.md` — work must persist
- `/Users/lukemccarthy/Lachlan/.claude/rules/mc-answer-randomization.md` — if the embed has fixed choice questions
- `/Users/lukemccarthy/Lachlan/.claude/rules/math-formatting.md` + `energy-define-the-system` principle
- `public/tools/embed-kit.js` — the shared helpers you must use
- The U1 gold standard: `public/tools/energy-flow-tracer.html` (pattern reference)

## 1. Scoring wiring (verify every box)
- [ ] Imports `sendActivityScore` (and `makeTranslator`, `makeStateSaver`) from `./embed-kit.js`.
- [ ] Score payload uses the kit (`type:"activityScore"`, raw `score` ≥ 0, `maxScore`, `gameComplete`).
- [ ] **`maxScore` MUST be `5`** for every embed (clean weight:5 ratio). If the model's internal max
      isn't 5, normalize to a 0–5 scale before sending. Final score sent must be on 0–5.
- [ ] **AUTO-SEND on completion**: when the student reaches the natural "done/results" state (all
      required inputs filled / final round reached), automatically call the score sender with
      `gameComplete: true`. Gate the AUTO path with a one-shot flag so it doesn't spam.
- [ ] **MANUAL Submit button re-sends with NO guard**: the Submit handler ALWAYS calls the sender
      again (even if auto already fired). No `if (alreadySent) return`. (Checklist rule #1/#2.)
- [ ] Interim/progress saves (if any) use `gameComplete: false`; only the final/complete send uses `true`.
- [ ] 5 embeds currently AUTO-SEND IS MISSING (manual only) — add it:
      `plate-boundary-builder`, `mantle-convection`, `impact-crater-sim`,
      `wave-properties-explorer`, `spectra-redshift-explorer`.

## 2. Persistence (work must survive refresh)
- [ ] `makeStateSaver` instantiated; `saver.save({...full work state...})` called on every meaningful
      change; `saver.flush()` on `beforeunload`. Confirm the saved state captures the student's actual
      work (selections/inputs), not just a score.

## 3. Bilingual EN/ES
- [ ] Every user-facing string lives in a `DICT`/translator with both `en` and `es`. No hardcoded
      English in render paths. Lang toggle re-renders. Spot-check the ES is real Spanish (Kimi
      sometimes leaves English in `es`). Fix any English-in-`es`.

## 4. Physics correctness (against the spec + data pack)
- [ ] Read your unit's spec §"Interactive embeds" and verify the embed's scored answers are physically
      correct and match the spec's intent. Cross-check numbers against the data pack where relevant.
- [ ] Define-the-system: any "net force" / "energy" / "work" question must specify the system/object.
- [ ] **U2 plate-boundary-builder SPECIFIC FIX**: the net-force question must define the system. Reword
      `netForceQ` (EN + ES) to "Is the net force **on each plate** balanced or unbalanced?" (ES: "¿La
      fuerza neta **sobre cada placa** está equilibrada o desequilibrada?"). KEEP `unbalanced` correct
      for all three boundaries — that is the intended HS-ESS2-1 pedagogy (unbalanced forces drive plate
      motion/hazards), not a bug.
- [ ] If the embed has fixed-choice questions, check correct-answer positions aren't all clustered on
      one option, and option lengths are roughly balanced (mc rule).

## 5. Add a minimal Node test per scoring model (NEW)
For each `<embed>-model.js` (or the model file it imports), CREATE `<embed>-model.test.mjs` in the same
`tools/` dir using `node:test` + `node:assert`. Assert at minimum:
1. Perfect/correct input → score equals the max (5 after normalization).
2. Empty / all-wrong input → low score (0 or near 0), never negative.
3. Score is always within `[0, maxScore]`.
Run: `cd /Users/lukemccarthy/pantherlearn-wt/openscied-u1-grid-sim && node --test public/tools/<embed>-model.test.mjs`
(Models are dependency-free ES modules; plain node works, no node_modules needed.)

## 6. Smoke-check the HTML loads
- [ ] `node -e "require('fs').readFileSync('<path>','utf8')"` is not enough — instead grep your edited
      HTML to confirm: the auto-send call exists, the manual handler re-sends, no leftover `TODO`, and
      every `getElementById(...)` referenced in JS has a matching element id in the HTML (a renamed/
      missing id silently kills the function — checklist rule #10).

## Output (return to lead — be concise)
For EACH embed in your unit, one block:
- **<embed-name>**: already-correct ✓ list | CHANGED: <bullets> | TEST: pass/fail (N assertions) |
  ESCALATE: <any physics/scoring judgment call you are <90% sure about — do NOT guess on scored logic>
End with: total files edited, total tests added (all green?), and anything you intentionally left for the lead.
