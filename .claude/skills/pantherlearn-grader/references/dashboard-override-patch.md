# Dashboard Override Patch

To enable the self-calibration feedback loop, update the `handleGrade` function in `WrittenResponseCard.jsx` so that when a teacher manually grades (or re-grades) a response, it:

1. Sets `gradedBy: "teacher"` 
2. Preserves the existing `autogradeOriginal` field (if present)

## Updated handleGrade

Replace the `handleGrade` function in `WrittenResponseCard.jsx` with:

```javascript
const handleGrade = async (tier, overrideReason = null) => {
  if (grading) return;
  setGrading(true);
  try {
    const progressRef = doc(
      db, "progress", item.studentId, "courses", item.courseId, "lessons", item.lessonId
    );

    // Build the grade payload
    const gradePayload = {
      answer: item.answer,
      submitted: true,
      needsGrading: false,
      writtenScore: tier.value,
      writtenLabel: tier.label,
      gradedAt: new Date(),
      gradedBy: "teacher",
    };

    // Tag the reason if this override should NOT train the agent
    // Valid reasons: "glitch", "mercy", "ignore"
    // null or "calibration" = this IS a real correction the agent should learn from
    if (overrideReason) {
      gradePayload.overrideReason = overrideReason;
    }

    // NOTE: We do NOT overwrite autogradeOriginal here.
    // Firestore merge: true with a nested object only overwrites the fields
    // we explicitly set. Since we don't include autogradeOriginal in this write,
    // it stays intact from the agent's original grade — which is exactly what
    // we want for the calibration harvest.

    await setDoc(progressRef, {
      answers: {
        [item.blockId]: gradePayload,
      },
    }, { merge: true });

    setSavedGrade(tier.value);
    if (onGraded) onGraded(item.id, tier);
  } catch (err) {
    console.error("Failed to save grade:", err);
    alert("Failed to save grade. Please try again.");
  }
  setGrading(false);
};
```

## UI Suggestion

When an agent-graded response is being overridden (i.e., `autogradeOriginal` exists on the current item), show a small prompt after the teacher clicks a different tier:

```
"Why are you changing this grade?"
[The agent got it wrong]  [Data glitch]  [Giving mercy credit]  [Other — don't train on this]
```

These map to:
- "The agent got it wrong" → `overrideReason: null` (calibration signal)
- "Data glitch" → `overrideReason: "glitch"`
- "Giving mercy credit" → `overrideReason: "mercy"`
- "Other — don't train on this" → `overrideReason: "ignore"`

For overrides where `autogradeOriginal` does NOT exist (manual-only grades), skip this prompt entirely — there's nothing to train on.

## How It Works

1. Agent grades a response → writes `gradedBy: "autograde-agent"` + `autogradeOriginal: { ... }`
2. Luke sees the grade on the dashboard and disagrees → clicks a different tier
3. Dashboard writes `gradedBy: "teacher"` + new score, but does NOT touch `autogradeOriginal`
4. Next time the agent runs, `harvestOverrides()` finds all docs where `gradedBy === "teacher"` AND `autogradeOriginal` exists
5. Those corrections get injected into the system prompt as calibration examples
6. Agent gets smarter over time

## What If Luke Grades Something the Agent Never Touched?

No problem. If there's no `autogradeOriginal` field, the override harvester skips it. Manual-only grades don't interfere with the calibration pipeline.
