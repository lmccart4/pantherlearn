# Task 4: Grid Model scoreDesign — Report

## Summary
Task 4 completed successfully. Implemented `scoreDesign(sources, criteria)` function and appended 3 test cases to the test suite. All 12 tests pass (RED → GREEN → PASS cycle).

## Changes Made

### grid-model.js
- **Added:** `scoreDesign(sources, criteria = {})` export
  - Consumes: `SOURCE_TYPES`, `simulateDay`, `applyStorm` from Tasks 1–3
  - Simulates calm-day and storm-day reliability
  - Calculates total cost and evaluates against budget
  - Scores: +2 for calm reliability target met, +2 for storm resilience (≥ target−0.15), +1 for budget compliance
  - Returns object with score, maxScore, metrics, and breakdown array
  - `lowCarbon` flag reported but not scored in v1

### grid-model.test.mjs
- **Appended 3 test cases:**
  1. **"scoreDesign: a resilient low-cost design scores at or near full marks"** — nuclear + battery design should achieve score ≥4 (meets calm + storm + budget targets)
  2. **"scoreDesign: a flood-vulnerable gas-only grid loses the storm points"** — gas-only grid meets calm reliability but fails in storm, score < 5
  3. **"scoreDesign: over-budget design loses the cost point"** — nuclear ×6 exceeds $30 budget, `withinBudget: false`

## Test Results
- **All 12 tests PASS** (9 existing + 3 new)
  - 0 failures
  - 0 skipped
  - ~93ms total runtime

## Commit
```
b725550 feat(grid-sim): scoreDesign against reliability + cost criteria
```

## Implementation Details
- Calm simulation: `{ sunlight: 1, wind: 0.5, outages: [] }`
- Storm simulation: calls `applyStorm(sources, stormSeverity)` with default severity 0.9
- Cost calculation: sums `costPerUnit × units` across all sources
- Scoring logic: boolean checks for three criteria, awarding partial points (2 + 2 + 1 = 5 max)
- Breakdown: array of strings (e.g., `["calm-reliability:+2", "storm-reliability:+2", "budget:+1"]`) for UI feedback

## Notes
- No dependencies beyond the module's existing functions
- Default criteria: `reliabilityTarget: 0.95`, `costBudget: 30`, `stormSeverity: 0.9`
- Output object includes both score and detailed diagnostics (reliability values, cost, flags)
- Ready for Task 5 (embed-kit integration)
