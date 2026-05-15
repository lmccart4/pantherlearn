export const slugToCourseId = {
  "ai-lit-p4": "Y9Gdhw5MTY8wMFt6Tlvj",
  "ai-lit-p5": "DacjJ93vUDcwqc260OP3",
  "ai-lit-p7": "M2MVSXrKuVCD9JQfZZyp",
  "ai-lit-p9": "fUw67wFhAtobWFhjwvZ5",
  "physics": "physics",
  "digital-literacy": "digital-literacy",
};

export const courseIdToSlug = Object.fromEntries(
  Object.entries(slugToCourseId).map(([slug, id]) => [id, slug])
);

export function resolveCourseId(slug) {
  if (!slug) return null;
  return slugToCourseId[slug] ?? slug;
}

export function slugForCourseId(courseId) {
  if (!courseId) return null;
  return courseIdToSlug[courseId] ?? courseId;
}
