# Task 7: embed-kit Regression Fix Report

## Summary
Fixed `makeStateSaver()` default `send` closure to guard against `ReferenceError: window is not defined` in non-browser (Node) environments.

## The Bug
In `public/tools/embed-kit.js` line 21, the default `send` closure referenced `window.parent` without guarding for Node. When `makeStateSaver()` was called with no injected `send` parameter and then `flush()` fired, it threw `ReferenceError: window is not defined` — the existing `try/catch` only wrapped `.postMessage`, not the `window` reference itself.

## The Fix
Added `typeof window === "undefined"` guard (mirroring the pattern already used in `sendActivityScore`):

```js
const doSend = send || ((msg) => {
  if (typeof window === "undefined") return;
  try { window.parent.postMessage(msg, "*"); } catch (e) {}
});
```

## Regression Test Added
Appended to `embed-kit.test.mjs`:
```js
test("makeStateSaver() with no injected send does not throw in Node on flush", () => {
  const saver = makeStateSaver(); // no send → default browser closure
  saver.save({ a: 1 });
  assert.doesNotThrow(() => saver.flush(), "default send must no-op in Node, not ReferenceError");
});
```

## Test Results
Command: `cd /Users/lukemccarthy/pantherlearn-wt/openscied-u1-grid-sim/public/tools && node --test embed-kit.test.mjs`

```
✔ buildScorePayload produces the exact EmbedBlock contract shape (1.655625ms)
✔ buildScorePayload clamps negative scores to 0 (0.062667ms)
✔ makeStateSaver coalesces rapid saves and flush sends latest state (0.892708ms)
✔ makeStateSaver flush with no pending state is a no-op (0.060916ms)
✔ makeStateSaver() with no injected send does not throw in Node on flush (0.106667ms)
✔ makeTranslator returns current-language strings with en fallback (0.072459ms)

ℹ tests 6
ℹ suites 0
ℹ pass 6
ℹ fail 0
```

**All 6 tests pass.** The new regression test confirms the fix — without the guard, it would throw before the flush completed.

## Commit
```
0f6ff6b fix(embed-kit): guard makeStateSaver default send for non-browser (Node)
```

Files changed:
- `public/tools/embed-kit.js` — 1-line fix
- `public/tools/embed-kit.test.mjs` — regression test added

## Concerns
None. The fix is minimal, non-breaking, and isolated. The guard is idempotent in the browser (always passes) and safe in Node (returns early). No impact on existing tools or tests.
