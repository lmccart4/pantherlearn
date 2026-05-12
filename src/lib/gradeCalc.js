// Weighted category grading system.
// Each lesson has a gradeCategory ("assessment" | "classwork" | "homework").
// Overall grade = weighted average of category averages.
// Each assignment within a category has equal weight (percentage-based).
//
// Some lessons (projects) ship with a `rubric` block. When the teacher scores
// the rubric for a specific student, `computeRubricGrade()` produces a single
// 0–100 grade from the per-criterion scores + weights. That score overrides
// the auto-computed lesson grade — see StudentProgress.getStudentLessonGrade.

export const GRADE_CATEGORIES = ["assessment", "classwork", "homework"];
export const CATEGORY_WEIGHTS = { assessment: 0.60, classwork: 0.35, homework: 0.05 };
export const DEFAULT_CATEGORY = "classwork";

export const CATEGORY_LABELS = {
  assessment: "Assessment",
  classwork: "Classwork",
  homework: "Homework",
};

export const CATEGORY_COLORS = {
  assessment: "var(--amber)",
  classwork: "var(--cyan)",
  homework: "var(--green)",
};

/**
 * Compute weighted overall grade from per-lesson and per-activity percentages.
 *
 * @param {Array<{ percentage: number, category: string }>} lessonGrades
 * @param {Array<{ percentage: number }>} activityGrades — always "classwork"
 * @returns {{ overall: number, categories: { [cat]: { avg: number, count: number, weight: number, effectiveWeight: number } } } | null}
 */
export function getWeightedOverall(lessonGrades, activityGrades = []) {
  // Group by category
  const buckets = { assessment: [], classwork: [], homework: [] };

  for (const lg of lessonGrades) {
    const cat = lg.category || DEFAULT_CATEGORY;
    if (buckets[cat]) buckets[cat].push(lg.percentage);
  }

  // Activities always classwork
  for (const ag of activityGrades) {
    buckets.classwork.push(ag.percentage);
  }

  // Check if any category has data
  const populated = GRADE_CATEGORIES.filter((c) => buckets[c].length > 0);
  if (populated.length === 0) return null;

  // Compute category averages
  const categoryAvgs = {};
  for (const cat of GRADE_CATEGORIES) {
    const items = buckets[cat];
    categoryAvgs[cat] = items.length > 0
      ? items.reduce((s, v) => s + v, 0) / items.length
      : null;
  }

  // Redistribute weights among populated categories
  const totalPopulatedWeight = populated.reduce((s, c) => s + CATEGORY_WEIGHTS[c], 0);

  let overall = 0;
  const categories = {};
  for (const cat of GRADE_CATEGORIES) {
    const effectiveWeight = buckets[cat].length > 0
      ? CATEGORY_WEIGHTS[cat] / totalPopulatedWeight
      : 0;
    categories[cat] = {
      avg: categoryAvgs[cat],
      count: buckets[cat].length,
      weight: CATEGORY_WEIGHTS[cat],
      effectiveWeight,
    };
    if (categoryAvgs[cat] != null) {
      overall += categoryAvgs[cat] * effectiveWeight;
    }
  }

  return { overall: Math.round(overall), categories };
}

/**
 * Compute a 0–100 grade from a rubric block + per-criterion scores.
 *
 * Each criterion has a `weight` (0–100 contribution) and a set of `levels` with
 * `score` values from 1–4. The student's recorded score for a criterion is one
 * of those level scores. We normalize each criterion's score against the
 * highest level available for THAT criterion (almost always 4), then weight
 * and sum.
 *
 * Example:
 *   criteria = [
 *     { name: "Daily Log", weight: 20, levels: [{score:1},{score:2},{score:3},{score:4}] },
 *     ...
 *   ]
 *   rubricScore = { c0: 4, c1: 3, c2: 4, c3: 2, c4: 3 }
 *   → grade = round( (4/4 * 20) + (3/4 * 25) + (4/4 * 20) + (2/4 * 20) + (3/4 * 15) )
 *
 * Returns null if either input is missing or no criterion has been scored yet.
 *
 * @param {{ criteria: Array<{ weight: number, levels: Array<{ score: number }> }> }} rubricBlock
 * @param {Object<string, number>} rubricScore — keys like "c0","c1",... mapped to chosen level score
 * @returns {{ grade: number, scored: number, total: number } | null}
 */
export function computeRubricGrade(rubricBlock, rubricScore) {
  if (!rubricBlock || !Array.isArray(rubricBlock.criteria) || rubricBlock.criteria.length === 0) return null;
  if (!rubricScore || typeof rubricScore !== "object") return null;

  let weightedPct = 0;
  let totalWeight = 0;
  let scored = 0;

  rubricBlock.criteria.forEach((crit, idx) => {
    const weight = typeof crit?.weight === "number" ? crit.weight : 0;
    if (weight <= 0) return;
    const chosen = rubricScore[`c${idx}`];
    if (typeof chosen !== "number") return;

    const levelScores = (crit.levels || []).map((l) => l?.score).filter((s) => typeof s === "number");
    const maxScore = levelScores.length > 0 ? Math.max(...levelScores) : 4;
    if (maxScore <= 0) return;

    const normalized = Math.max(0, Math.min(1, chosen / maxScore));
    weightedPct += normalized * weight;
    totalWeight += weight;
    scored += 1;
  });

  if (scored === 0) return null;

  // If the rubric is partially scored, scale to what HAS been scored (so a
  // half-graded rubric shows a sensible interim grade rather than reading 0
  // for unscored criteria). Once every criterion is scored, the scaling
  // factor is 1.0 and the result equals the straight weighted sum.
  const totalRubricWeight = rubricBlock.criteria.reduce((s, c) => s + (typeof c?.weight === "number" ? c.weight : 0), 0);
  const grade = totalWeight > 0 && totalRubricWeight > 0
    ? Math.round((weightedPct / totalWeight) * 100)
    : 0;

  return {
    grade,
    scored,
    total: rubricBlock.criteria.length,
    fullyScored: scored === rubricBlock.criteria.length,
  };
}
