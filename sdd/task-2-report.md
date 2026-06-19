# Task 2 Report: Grid Model — simulateDay + reliability

## TDD Phases

### RED (Step 2)
Appended imports + three test cases to `grid-model.test.mjs`:
- `simulateDay: ample nuclear keeps reliability at 1.0, no blackouts`
- `simulateDay: too little supply produces blackout hours and reliability < 1`
- `simulateDay: battery covers a deficit that gas alone cannot`

Run: `cd public/tools && node --test grid-model.test.mjs`
Result: **FAIL** — `SyntaxError: The requested module './grid-model.js' does not provide an export named 'simulateDay'`

### GREEN (Steps 3–4)
Appended `simulateDay` implementation to `grid-model.js` (23 lines):
- Computes total battery capacity from all storage sources
- Iterates 24 hours, computing demand + base supply per hour
- Applies battery to cover deficits (limited to batteryMW per hour)
- Tracks blackout hours and total unserved MWh
- Returns object with `hours`, `reliability`, `blackoutHours`, `totalUnservedMWh`

Run: `cd public/tools && node --test grid-model.test.mjs`
Result: **PASS** — ✔ 6 tests, 0 fail, 0 cancelled

### Summary
- All 3 new tests pass
- Original 3 tests still pass (3 existing + 3 new = 6 total)
- Implementation faithful to brief; zero scope creep

## Files Changed
- `public/tools/grid-model.js` — +23 lines (simulateDay function)
- `public/tools/grid-model.test.mjs` — +30 lines (test imports + three test cases)

## Commit
```
ab657cf feat(grid-sim): simulateDay with battery dispatch + reliability
```

## Self-Review
✓ All TDD steps completed in order  
✓ Code matches brief exactly (no additions, no omissions)  
✓ Full test suite passes (6/6)  
✓ Commit message is exact  
✓ No grade-data, no file corruption, no state loss  

## Concerns
None. Implementation is minimal, correct, and ready for Task 3 (storm events).
