# Fix Plan — Grade-Calc Divergence + Correctness Bugs

> Target worktree: `/Users/lukemccarthy/pantherlearn-wt/audit-fixes`  
> DO NOT edit, deploy, seed, sync, or commit from this Kimi task. This is a read-only fix plan for a Claude session to apply.

---

## Grade-Calc Divergence

**Source of truth:** `scripts/classroom-sync.cjs`. It is the surface that writes to Google Classroom, so MyGrades + StudentProgress must mirror it.

**Authoritative graded block types** (from `classroom-sync.cjs`):
- `question` with `questionType: "multiple_choice"`, `"short_answer"`, `"ranking"`, `"linked"`
- `type: "sorting"`
- `type: "concept_builder"`
- `type: "embed"` or `"connect_four"` with `scored: true`
- `type: "teacher_checkpoint"`
- `type: "data_table"` with `preset === "dropdown"` and `scored !== false`
- reflection (1 pt when lesson completed + reflection valid)

**Types that must NOT be graded:** `external_link`, `text`, `callout`, `objectives`, `image`, `video`, `slide_submit`, etc.

---

### 1. Block-type allowlist mismatch

#### `src/pages/MyGrades.jsx` — add missing helper filters

**Old:**
```jsx
  const getEmbedBlocks = (lesson) =>
    (lesson.blocks || []).filter((b) => (b.type === "embed" || b.type === "connect_four") && b.scored);

  // Does this lesson have a reflection? (only if lesson has been completed by this student)
```

**Replace with:**
```jsx
  const getEmbedBlocks = (lesson) =>
    (lesson.blocks || []).filter((b) => (b.type === "embed" || b.type === "connect_four") && b.scored);

  const getRankingQuestions = (lesson) =>
    (lesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "ranking");

  const getLinkedQuestions = (lesson) =>
    (lesson.blocks || []).filter((b) => b.type === "question" && b.questionType === "linked");

  const getSortingBlocks = (lesson) =>
    (lesson.blocks || []).filter((b) => b.type === "sorting");

  const getConceptBuilderBlocks = (lesson) =>
    (lesson.blocks || []).filter((b) => b.type === "concept_builder");

  // Does this lesson have a reflection? (only if lesson has been completed by this student)
```
**Why:** These helpers exist in `classroom-sync.cjs` but are absent from MyGrades, so ranking/linked/sorting/concept_builder points were silently dropped from the student-facing grade.

#### `src/pages/MyGrades.jsx` — declare them in `getLessonGrade`

**Old:**
```jsx
    const mc = getMCQuestions(lesson);
    const sa = getSAQuestions(lesson);
    const embeds = getEmbedBlocks(lesson);
    const checkpoints = (lesson.blocks || []).filter((b) => b.type === "teacher_checkpoint");
    const dataTables = (lesson.blocks || []).filter((b) => b.type === "data_table" && b.preset === "dropdown" && b.scored !== false);
    // skipReflection lesson flag: lesson grade is computed without the reflection slot
    // (used for embed-only assessments where the embed score IS the entire grade)
    const hasReflection = !lesson.skipReflection && lessonHasReflection(lessonId);

    // Embed weighting: use explicit weight if set, otherwise dynamic 50/50 split
    const nonEmbedPts = mc.length + sa.length + (hasReflection ? 1 : 0);
```

**Replace with:**
```jsx
    const mc = getMCQuestions(lesson);
    const sa = getSAQuestions(lesson);
    const ranking = getRankingQuestions(lesson);
    const linked = getLinkedQuestions(lesson);
    const sorting = getSortingBlocks(lesson);
    const conceptBuilder = getConceptBuilderBlocks(lesson);
    const embeds = getEmbedBlocks(lesson);
    const checkpoints = (lesson.blocks || []).filter((b) => b.type === "teacher_checkpoint");
    const dataTables = (lesson.blocks || []).filter((b) => b.type === "data_table" && b.preset === "dropdown" && b.scored !== false);
    // skipReflection lesson flag: lesson grade is computed without the reflection slot
    // (used for embed-only assessments where the embed score IS the entire grade)
    const hasReflection = !lesson.skipReflection && lessonHasReflection(lessonId);

    // Embed weighting: use explicit weight if set, otherwise dynamic 50/50 split
    const nonEmbedPts = mc.length + sa.length + ranking.length + linked.length + sorting.length + conceptBuilder.length + (hasReflection ? 1 : 0);
```
**Why:** The denominator used for unweighted embed fallback must include every non-embed graded block type that `classroom-sync.cjs` counts.

#### `src/pages/MyGrades.jsx` — score the missing block types

**Old:**
```jsx
    // Written: writtenScore (0 to 1) per question, only if graded
    sa.forEach((q) => {
      const a = answers[q.id];
      if (a?.writtenScore !== undefined && a?.writtenScore !== null) {
        earnedPoints += a.writtenScore;
      }
    });

    // Scored embeds: use per-block weight
```

**Replace with:**
```jsx
    // Written: writtenScore (0 to 1) per question, only if graded
    sa.forEach((q) => {
      const a = answers[q.id];
      if (a?.writtenScore !== undefined && a?.writtenScore !== null) {
        earnedPoints += a.writtenScore;
      }
    });

    // Ranking: partialScore (0-1) if submitted
    ranking.forEach((q) => {
      const a = answers[q.id];
      if (a?.submitted) {
        totalPoints += 1;
        if (a.partialScore != null) earnedPoints += a.partialScore;
      }
    });

    // Linked: writtenScore (0-1) if submitted
    linked.forEach((q) => {
      const a = answers[q.id];
      if (a?.submitted) {
        totalPoints += 1;
        if (a.writtenScore != null) earnedPoints += a.writtenScore;
      }
    });

    // Sorting: writtenScore (0-1) if submitted, else raw correct/total
    sorting.forEach((q) => {
      const a = answers[q.id];
      if (a?.submitted) {
        totalPoints += 1;
        if (a.writtenScore != null) earnedPoints += a.writtenScore;
        else if (a.score?.correct != null && a.score?.total > 0) earnedPoints += a.score.correct / a.score.total;
      }
    });

    // Concept builder: 1 point if submitted
    conceptBuilder.forEach((q) => {
      const a = answers[q.id];
      if (a?.submitted) {
        totalPoints += 1;
        earnedPoints += 1;
      }
    });

    // Scored embeds: use per-block weight
```
**Why:** Mirrors `classroom-sync.cjs` L306-337 exactly; each type contributes 1 possible point and earned points using the same field semantics.

#### `src/pages/MyGrades.jsx` — include new types in return value

**Old:**
```jsx
    return {
      earnedPoints,
      totalPoints,
      embedWeights,
      grade: Math.round((earnedPoints / totalPoints) * 100),
      mc, sa, embeds, checkpoints, hasReflection,
    };
```

**Replace with:**
```jsx
    return {
      earnedPoints,
      totalPoints,
      embedWeights,
      grade: Math.round((earnedPoints / totalPoints) * 100),
      mc, sa, ranking, linked, sorting, conceptBuilder, embeds, checkpoints, hasReflection,
    };
```
**Why:** Keeps the returned grade breakdown consistent with what was actually computed.

---

#### `src/pages/StudentProgress.jsx` — add missing helper filters

**Old:**
```jsx
  const getQuestions = (lesson) => (lesson.blocks || []).filter((b) => b.type === "question");
  const getMCQuestions = (lesson) => getQuestions(lesson).filter((b) => b.questionType === "multiple_choice");
  const getSAQuestions = (lesson) => getQuestions(lesson).filter((b) => b.questionType === "short_answer");
```

**Replace with:**
```jsx
  const getQuestions = (lesson) => (lesson.blocks || []).filter((b) => b.type === "question");
  const getMCQuestions = (lesson) => getQuestions(lesson).filter((b) => b.questionType === "multiple_choice");
  const getSAQuestions = (lesson) => getQuestions(lesson).filter((b) => b.questionType === "short_answer");
  const getRankingQuestions = (lesson) => getQuestions(lesson).filter((b) => b.questionType === "ranking");
  const getLinkedQuestions = (lesson) => getQuestions(lesson).filter((b) => b.questionType === "linked");
  const getSortingBlocks = (lesson) => (lesson.blocks || []).filter((b) => b.type === "sorting");
  const getConceptBuilderBlocks = (lesson) => (lesson.blocks || []).filter((b) => b.type === "concept_builder");
```
**Why:** Same helper gap as MyGrades; StudentProgress is the teacher gradebook view and must agree with Classroom.

#### `src/pages/StudentProgress.jsx` — declare them in `getStudentLessonGrade`

**Old:**
```jsx
    const mc = getMCQuestions(lesson);
    const sa = getSAQuestions(lesson);
    const embeds = getEmbedBlocks(lesson);
    const today = new Date().toISOString().split("T")[0];
```

**Replace with:**
```jsx
    const mc = getMCQuestions(lesson);
    const sa = getSAQuestions(lesson);
    const ranking = getRankingQuestions(lesson);
    const linked = getLinkedQuestions(lesson);
    const sorting = getSortingBlocks(lesson);
    const conceptBuilder = getConceptBuilderBlocks(lesson);
    const embeds = getEmbedBlocks(lesson);
    const today = new Date().toISOString().split("T")[0];
```
**Why:** Makes the four missing block collections available for scoring and embed-weight denominator.

#### `src/pages/StudentProgress.jsx` — score the missing block types

**Old:**
```jsx
    });

    // Scored embeds: use explicit weight if set, otherwise dynamic 50/50 split
    const hasAnyProgress = Object.keys(answers).some((k) => !k.startsWith("_"));
    const nonEmbedPts = mc.length + sa.length + ((studentCompleted && reflection) ? 1 : 0);
```

**Replace with:**
```jsx
    });

    // Ranking: partialScore (0-1) if submitted; missing if past due
    const rankingItems = [];
    ranking.forEach((q) => {
      const a = answers[q.id];
      if (a?.submitted) {
        rankingItems.push({ type: "ranking", prompt: q.prompt, points: a.partialScore != null ? a.partialScore : 0, max: 1 });
      } else if (isPastDue) {
        rankingItems.push({ type: "ranking", prompt: q.prompt, points: 0, max: 1, missing: true });
      }
    });

    // Linked: writtenScore (0-1) if submitted; missing if past due
    const linkedItems = [];
    linked.forEach((q) => {
      const a = answers[q.id];
      if (a?.submitted && a.writtenScore != null) {
        linkedItems.push({ type: "linked", prompt: q.prompt, points: a.writtenScore, max: 1 });
      } else if (a?.submitted) {
        linkedItems.push({ type: "linked", prompt: q.prompt, points: null, max: 1, ungraded: true });
      } else if (isPastDue) {
        linkedItems.push({ type: "linked", prompt: q.prompt, points: 0, max: 1, missing: true });
      }
    });

    // Sorting: writtenScore or raw correct/total; missing if past due
    const sortingItems = [];
    sorting.forEach((q) => {
      const a = answers[q.id];
      if (a?.submitted) {
        let pts = null;
        if (a.writtenScore != null) pts = a.writtenScore;
        else if (a.score?.correct != null && a.score?.total > 0) pts = a.score.correct / a.score.total;
        sortingItems.push({ type: "sorting", prompt: q.title || q.prompt || "Sorting", points: pts, max: 1, ungraded: pts == null });
      } else if (isPastDue) {
        sortingItems.push({ type: "sorting", prompt: q.title || q.prompt || "Sorting", points: 0, max: 1, missing: true });
      }
    });

    // Concept builder: 1 point if submitted; missing if past due
    const conceptBuilderItems = [];
    conceptBuilder.forEach((q) => {
      const a = answers[q.id];
      if (a?.submitted) {
        conceptBuilderItems.push({ type: "concept_builder", prompt: q.title || q.prompt || "Concept builder", points: 1, max: 1 });
      } else if (isPastDue) {
        conceptBuilderItems.push({ type: "concept_builder", prompt: q.title || q.prompt || "Concept builder", points: 0, max: 1, missing: true });
      }
    });

    // Scored embeds: use explicit weight if set, otherwise dynamic 50/50 split
    const hasAnyProgress = Object.keys(answers).some((k) => !k.startsWith("_"));
    const nonEmbedPts = mc.length + sa.length + ranking.length + linked.length + sorting.length + conceptBuilder.length + ((studentCompleted && reflection) ? 1 : 0);
```
**Why:** Adds the four missing block families to the teacher gradebook breakdown using the same logic as `classroom-sync.cjs`.

#### `src/pages/StudentProgress.jsx` — include them in `gradedItems`

**Old:**
```jsx
    const gradedItems = [
      ...mcItems,
      ...saItems.filter((i) => !i.ungraded),
      ...embedItems.filter((i) => i.points != null),
      ...checkpointItems,
      ...dataTableItems,
      ...(reflectionItem ? [reflectionItem] : []),
    ];
```

**Replace with:**
```jsx
    const gradedItems = [
      ...mcItems,
      ...saItems.filter((i) => !i.ungraded),
      ...rankingItems,
      ...linkedItems.filter((i) => !i.ungraded),
      ...sortingItems.filter((i) => !i.ungraded),
      ...conceptBuilderItems,
      ...embedItems.filter((i) => i.points != null),
      ...checkpointItems,
      ...dataTableItems,
      ...(reflectionItem ? [reflectionItem] : []),
    ];
```
**Why:** Otherwise the newly-built item arrays are not included in the final earned/possible totals.

#### `src/pages/StudentProgress.jsx` — include them in the return value

**Old:**
```jsx
    return {
      grade,
      earned: Math.round(earned * 100) / 100,
      possible,
      mcItems,
      saItems,
      embedItems,
      checkpointItems,
      dataTableItems,
      reflectionItem,
      mcCorrect: mcItems.filter((i) => i.correct).length,
      mcTotal: mcItems.length,
      mcPossible: mc.length,
      saGraded: saItems.filter((i) => !i.ungraded).length,
      saTotal: saItems.length,
      saUngraded: saItems.filter((i) => i.ungraded).length,
    };
```

**Replace with:**
```jsx
    return {
      grade,
      earned: Math.round(earned * 100) / 100,
      possible,
      mcItems,
      saItems,
      rankingItems,
      linkedItems,
      sortingItems,
      conceptBuilderItems,
      embedItems,
      checkpointItems,
      dataTableItems,
      reflectionItem,
      mcCorrect: mcItems.filter((i) => i.correct).length,
      mcTotal: mcItems.length,
      mcPossible: mc.length,
      saGraded: saItems.filter((i) => !i.ungraded).length,
      saTotal: saItems.length,
      saUngraded: saItems.filter((i) => i.ungraded).length,
      rankingTotal: ranking.length,
      linkedTotal: linked.length,
      sortingTotal: sorting.length,
      conceptBuilderTotal: conceptBuilder.length,
    };
```
**Why:** Keeps the drilldown object consistent with the computed grade.

---

### 2. Embed-weight denominator (`nonEmbedPts`) divergence

This is resolved by the two replacements above: both MyGrades and StudentProgress now compute
```js
mc.length + sa.length + ranking.length + linked.length + sorting.length + conceptBuilder.length + (reflection ? 1 : 0)
```
matching `classroom-sync.cjs` L364.

**No additional file edits are required for #2.**

---

### 3. `data_table` grading guard divergence

Align all three surfaces to use the block's configured `weight` as the max and to count a submitted `score` without requiring `maxScore` in the answer object.

#### `src/pages/MyGrades.jsx` — clamp data_table score to weight

**Old:**
```jsx
    // Data tables: prorated by submitted score / maxScore
    dataTables.forEach((b, i) => {
      const a = answers[b.id];
      if (a?.submitted && typeof a.score === "number") {
        earnedPoints += a.score;
      }
    });
```

**Replace with:**
```jsx
    // Data tables: prorated by submitted score / weight
    dataTables.forEach((b, i) => {
      const a = answers[b.id];
      const max = dataTableWeights[i];
      if (a?.submitted && typeof a.score === "number") {
        earnedPoints += Math.max(0, Math.min(max, a.score));
      }
    });
```
**Why:** Matches `classroom-sync.cjs` L354-359 and prevents an out-of-range score from inflating the grade.

#### `src/pages/StudentProgress.jsx` — remove the extra `maxScore` guard

**Old:**
```jsx
      if (a?.submitted && typeof a.score === "number" && typeof a.maxScore === "number" && a.maxScore > 0) {
        dataTableItems.push({ type: "data_table", prompt: b.title || "Data table", points: a.score, max: a.maxScore });
      } else if (isPastDue) {
```

**Replace with:**
```jsx
      if (a?.submitted && typeof a.score === "number") {
        dataTableItems.push({ type: "data_table", prompt: b.title || "Data table", points: a.score, max: weight });
      } else if (isPastDue) {
```
**Why:** `DataTableBlock` always writes `score` scaled to `weight`; requiring `maxScore` in the answer object creates a divergence with MyGrades/classroom-sync on any malformed/legacy answer. This change is conservative — it never drops an already-captured score.

---

### 4. EmbedBlock monotonic `writtenScore` guard strands lessons

#### `src/components/blocks/EmbedBlock.jsx`

**Old:**
```jsx
      const existing = studentData?.[block.id];
      if (existing?.writtenScore != null && newWrittenScore < existing.writtenScore) return;

      const isGameComplete = msg.gameComplete !== false;
      const wasAlreadySubmitted = existing?.submitted === true;

      onAnswer(block.id, {
        score: msg.score,
        maxScore,
        writtenScore: newWrittenScore,
        submitted: isGameComplete || wasAlreadySubmitted,
        completedAt: msg.completedAt || new Date().toISOString(),
        ...(msg.breakdown && { breakdown: msg.breakdown }),
        ...(msg.scenariosCompleted != null && { scenariosCompleted: msg.scenariosCompleted }),
      });
```

**Replace with:**
```jsx
      const existing = studentData?.[block.id];
      const isGameComplete = msg.gameComplete !== false;
      const wasAlreadySubmitted = existing?.submitted === true;

      const keepOldScore = existing?.writtenScore != null && newWrittenScore < existing.writtenScore;
      onAnswer(block.id, {
        score: keepOldScore ? (existing.score ?? msg.score) : msg.score,
        maxScore: keepOldScore ? (existing.maxScore ?? maxScore) : maxScore,
        writtenScore: keepOldScore ? existing.writtenScore : newWrittenScore,
        submitted: isGameComplete || wasAlreadySubmitted,
        completedAt: msg.completedAt || new Date().toISOString(),
        ...(msg.breakdown && { breakdown: msg.breakdown }),
        ...(msg.scenariosCompleted != null && { scenariosCompleted: msg.scenariosCompleted }),
      });
```
**Why:** The early return prevented `submitted: true` from ever being written when the final run scored lower than an interim run. Now the higher score is preserved, but `submitted` is always updated when `gameComplete` is true.

---

## Correctness Bugs

### 5. ConnectFourBlock double-count + stale closure

#### `src/components/blocks/ConnectFourBlock.jsx` — move the once-per-game guard inside `handleGameEnd`

First, move the ref declaration so it is initialized before `handleGameEnd`.  
Move this line from after the subscription effect to immediately before `// ─── Game end handler ───`:
```jsx
  const lastCountedGameRef = useRef(null);
```

Then replace `handleGameEnd`:

**Old:**
```jsx
  // ─── Game end handler ───
  const handleGameEnd = useCallback((result) => {
    const newCompleted = gamesCompleted + 1;
    setGamesCompleted(newCompleted);
    sendScore(newCompleted, gamesStarted);
  }, [gamesCompleted, gamesStarted, sendScore]);
```

**Replace with:**
```jsx
  // ─── Game end handler ───
  const handleGameEnd = useCallback((result) => {
    if (lastCountedGameRef.current === activeGameId) return;
    lastCountedGameRef.current = activeGameId;
    setGamesCompleted((prev) => {
      const newCompleted = prev + 1;
      sendScore(newCompleted, gamesStarted);
      return newCompleted;
    });
  }, [activeGameId, gamesStarted, sendScore]);
```
**Why:** `gamesCompleted` from the closure could be stale when two completions happen close together; the functional updater fixes that. Putting the guard inside `handleGameEnd` dedupes all three entry points (AI move, subscription, answer path).

#### Remove redundant call-site guards

**Subscription effect — old:**
```jsx
  useEffect(() => {
    if (!gameData || gameData.status !== "finished") return;
    if (!activeGameId) return;
    // Only count once per game ID
    if (lastCountedGameRef.current === activeGameId) return;
    lastCountedGameRef.current = activeGameId;
    handleGameEnd(gameData);
  }, [gameData?.status, activeGameId, handleGameEnd]);
```

**Replace with:**
```jsx
  useEffect(() => {
    if (!gameData || gameData.status !== "finished") return;
    if (!activeGameId) return;
    handleGameEnd(gameData);
  }, [gameData?.status, activeGameId, handleGameEnd]);
```
**Why:** The guard now lives inside `handleGameEnd`; keeping it here is redundant.

**Answer path — old:**
```jsx
        if (result?.gameOver && lastCountedGameRef.current !== activeGameId) {
          lastCountedGameRef.current = activeGameId;
          handleGameEnd(result);
        }
```

**Replace with:**
```jsx
        if (result?.gameOver) {
          handleGameEnd(result);
        }
```
**Why:** Same dedup now handled centrally.

**`handleBackToLobby` — old:**
```jsx
  const handleBackToLobby = () => {
    setActiveGameId(null);
    setGameData(null);
    setShowQuestion(false);
    if (aiMoveTimeoutRef.current) clearTimeout(aiMoveTimeoutRef.current);
  };
```

**Replace with:**
```jsx
  const handleBackToLobby = () => {
    setActiveGameId(null);
    setGameData(null);
    setShowQuestion(false);
    lastCountedGameRef.current = null;
    if (aiMoveTimeoutRef.current) clearTimeout(aiMoveTimeoutRef.current);
  };
```
**Why:** Clears the per-game dedup ref so returning to a finished game later does not re-count it.

---

### 6. EmbeddingExplorer sparse `explanations` array

Change `explanations` from an array to an object map keyed by `findingId`, and update the scorer to handle both shapes.

#### `src/pages/EmbeddingExplorer.jsx` — state shape

**Old:**
```jsx
  const [explanations, setExplanations] = useState([]);
```

**Replace with:**
```jsx
  const [explanations, setExplanations] = useState({});
```
**Why:** Arrays with null holes serialize poorly and become fragile when findings are toggled off; an object map is dense and stable.

#### `src/pages/EmbeddingExplorer.jsx` — helper to migrate legacy arrays

Add near the top of the component (after state declarations):

```jsx
  const normalizeExplanations = (raw, findingIds) => {
    if (!raw) return {};
    if (Array.isArray(raw)) {
      return raw.reduce((acc, text, idx) => {
        if (text != null && findingIds?.[idx]) acc[findingIds[idx]] = text;
        return acc;
      }, {});
    }
    return { ...raw };
  };
```

#### `src/pages/EmbeddingExplorer.jsx` — load existing exploration

**Old:**
```jsx
      setIdentifiedFindings(existing.engineerReport?.identifiedFindings || []);
      setExplanations(existing.engineerReport?.explanations || []);
```

**Replace with:**
```jsx
      const loadedIdentified = existing.engineerReport?.identifiedFindings || [];
      setIdentifiedFindings(loadedIdentified);
      setExplanations(normalizeExplanations(existing.engineerReport?.explanations, loadedIdentified));
```
**Why:** Converts any legacy sparse array into the new object map on load.

#### `src/pages/EmbeddingExplorer.jsx` — reset paths

Replace the two occurrences of:
```jsx
      setExplanations([]);
```
with:
```jsx
      setExplanations({});
```
(One is in the new-exploration branch, one is in restart.)

#### `src/pages/EmbeddingExplorer.jsx` — toggle finding

**Old:**
```jsx
  function handleToggleFinding(findingId) {
    const next = identifiedFindings.includes(findingId)
      ? identifiedFindings.filter((id) => id !== findingId)
      : [...identifiedFindings, findingId];
    setIdentifiedFindings(next);
    save({ engineerReport: { identifiedFindings: next, explanations, summary } });
  }
```

**Replace with:**
```jsx
  function handleToggleFinding(findingId) {
    const isRemoving = identifiedFindings.includes(findingId);
    const next = isRemoving
      ? identifiedFindings.filter((id) => id !== findingId)
      : [...identifiedFindings, findingId];
    const nextExplanations = { ...explanations };
    if (isRemoving) delete nextExplanations[findingId];
    setIdentifiedFindings(next);
    setExplanations(nextExplanations);
    save({ engineerReport: { identifiedFindings: next, explanations: nextExplanations, summary } });
  }
```
**Why:** Removes stale explanation text when its finding is unselected, preventing misattribution in the UI.

#### `src/pages/EmbeddingExplorer.jsx` — explanation change

**Old:**
```jsx
  function handleExplanationChange(index, text) {
    const next = [...explanations];
    next[index] = text;
    setExplanations(next);
    save({ engineerReport: { identifiedFindings, explanations: next, summary } });
  }
```

**Replace with:**
```jsx
  function handleExplanationChange(findingId, text) {
    const next = { ...explanations, [findingId]: text };
    if (!text) delete next[findingId];
    setExplanations(next);
    save({ engineerReport: { identifiedFindings, explanations: next, summary } });
  }
```
**Why:** Writes explanations by finding ID, eliminating null holes entirely.

#### `src/pages/EmbeddingExplorer.jsx` — PhaseReport textarea binding

**Old:**
```jsx
                <textarea
                  placeholder={`Explain this finding in your own words...`}
                  value={explanations[idx] || ""}
                  onChange={(e) => onExplanationChange(idx, e.target.value)}
```

**Replace with:**
```jsx
                <textarea
                  placeholder={`Explain this finding in your own words...`}
                  value={explanations[findingId] || ""}
                  onChange={(e) => onExplanationChange(findingId, e.target.value)}
```
**Why:** Reads from and writes to the object map by `findingId`.

#### `src/lib/embeddingStore.js` — `calculateScore` must accept object map

**Old:**
```jsx
  // Engineer's Report (0-20) — explanations >30 chars + summary
  const explanations = exploration.engineerReport?.explanations || [];
  const explanationsWithContent = explanations.filter((e) => e && e.length > 30).length;
```

**Replace with:**
```jsx
  // Engineer's Report (0-20) — explanations >30 chars + summary
  const explanations = exploration.engineerReport?.explanations || {};
  const explanationValues = Array.isArray(explanations) ? explanations : Object.values(explanations);
  const explanationsWithContent = explanationValues.filter((e) => e && e.length > 30).length;
```
**Why:** The scorer previously counted array entries; it must now count the values of the object map while still tolerating legacy arrays.

---

### 7. StudentProgress divide-by-zero / NaN guard

#### `src/pages/StudentProgress.jsx`

**Old:**
```jsx
    const earned = gradedItems.reduce((sum, i) => sum + i.points, 0);
    const possible = gradedItems.reduce((sum, i) => sum + (i.max || 1), 0);
    const bonus = progressData[studentUid]?.[lessonId]?._gradeBonus || 0;
    const grade = Math.round((earned / possible) * 100) + bonus;
```

**Replace with:**
```jsx
    const earned = gradedItems.reduce((sum, i) => sum + i.points, 0);
    const possible = gradedItems.reduce((sum, i) => sum + (i.max || 1), 0);
    if (possible <= 0) return null;
    const bonus = progressData[studentUid]?.[lessonId]?._gradeBonus || 0;
    const grade = Math.round((earned / possible) * 100) + bonus;
```
**Why:** Defensive guard; today `possible` is protected by `|| 1`, but a future all-zero-max configuration would produce `NaN` here.

---

### 8. StudentMana controlled `<select>` null value

#### `src/pages/StudentMana.jsx`

**Old:**
```jsx
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(routeCourseId || null);
  const courseId = selectedCourse;
```

**Replace with:**
```jsx
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(routeCourseId || "");
  const courseId = selectedCourse || "";
```
**Why:** A React `<select>` should never receive `null`/`undefined` as `value`; defaulting to `""` avoids the controlled/uncontrolled warning.

#### `src/pages/StudentMana.jsx` — add a default option

**Old:**
```jsx
        {courses.length > 1 && (
          <select
            value={courseId}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{
              marginBottom: 16, padding: "8px 12px", borderRadius: 8,
              border: `1px solid ${MANA_BORDER}`, background: MANA_SURFACE,
              color: MANA_TEXT, fontSize: 14, fontWeight: 500, cursor: "pointer", width: "100%",
            }}
          >
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        )}
```

**Replace with:**
```jsx
        {courses.length > 1 && (
          <select
            value={courseId}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{
              marginBottom: 16, padding: "8px 12px", borderRadius: 8,
              border: `1px solid ${MANA_BORDER}`, background: MANA_SURFACE,
              color: MANA_TEXT, fontSize: 14, fontWeight: 500, cursor: "pointer", width: "100%",
            }}
          >
            <option value="" disabled>Select a course</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select>
        )}
```
**Why:** Gives the select a valid default `""` option while the load effect still auto-selects the first course once data arrives.

---

## Verification Checklist (for Claude applying the plan)

- [ ] `classroom-sync.cjs`, `MyGrades.jsx`, and `StudentProgress.jsx` all reference the same six non-embed block families (mc, sa, ranking, linked, sorting, concept_builder) when computing `nonEmbedPts`.
- [ ] `ranking`/`linked`/`sorting`/`concept_builder` points are added to earned/possible in MyGrades and to `gradedItems` in StudentProgress.
- [ ] `data_table` scoring no longer depends on `a.maxScore` in StudentProgress; MyGrades clamps to weight.
- [ ] EmbedBlock always writes `submitted: true` when `gameComplete` is true, even if the score is lower than a previous run.
- [ ] ConnectFourBlock `handleGameEnd` is idempotent and uses a functional `setGamesCompleted` update.
- [ ] EmbeddingExplorer stores explanations as `{ [findingId]: text }` and `calculateScore` counts object values.
- [ ] StudentProgress guards `possible <= 0` before dividing.
- [ ] StudentMana `<select>` `value` is never `null`/`undefined`.
- [ ] Run targeted fixture tests / manual QA on one lesson containing ranking + linked + sorting + concept_builder + embed and confirm all three grade surfaces match.
