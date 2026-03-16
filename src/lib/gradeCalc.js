// Weighted category grading system.
// Each lesson has a gradeCategory ("assessment" | "classwork" | "homework").
// Overall grade = weighted average of category averages.
// Each assignment within a category has equal weight (percentage-based).

export const GRADE_CATEGORIES = ["assessment", "classwork", "homework"];
export const CATEGORY_WEIGHTS = { assessment: 0.65, classwork: 0.30, homework: 0.05 };
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
