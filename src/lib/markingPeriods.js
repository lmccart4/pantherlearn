// Marking period boundaries for the 2025–26 school year.
//
// `active: true` controls whether the MP appears as a student-facing tab.
// `getMarkingPeriod()` buckets dates across ALL periods (active or not) so
// historical lessons resolve to MP1/MP2 even though students can't toggle
// to those tabs. Lessons that bucket into an inactive MP are hidden from
// MP-toggled views by the consuming component.
//
// Boundaries (NJ public-school approximation):
//   MP1: through 2025-11-07
//   MP2: 2025-11-10 through 2026-01-23
//   MP3: 2026-01-26 through 2026-04-15
//   MP4: 2026-04-16 onward

export const MARKING_PERIODS = [
  { id: "mp1", label: "MP1", start: null,         end: "2025-11-07", active: false },
  { id: "mp2", label: "MP2", start: "2025-11-08", end: "2026-01-23", active: false },
  { id: "mp3", label: "MP3", start: "2026-01-24", end: "2026-04-15", active: true  },
  { id: "mp4", label: "MP4", start: "2026-04-16", end: null,         active: true  },
];

export const ACTIVE_MARKING_PERIODS = MARKING_PERIODS.filter((mp) => mp.active);

// Returns the marking period id for a given date (YYYY-MM-DD), or null.
// Considers ALL marking periods regardless of `active` so historical lessons
// can be bucketed correctly. The UI decides separately which buckets to show.
export function getMarkingPeriod(dateStr) {
  if (!dateStr) return null;
  for (const mp of MARKING_PERIODS) {
    const afterStart = !mp.start || dateStr >= mp.start;
    const beforeEnd  = !mp.end   || dateStr <= mp.end;
    if (afterStart && beforeEnd) return mp.id;
  }
  return null;
}

// Returns the id of the marking period containing today, or the most recent
// active period if today is past all active windows. Used only for default
// tab selection — never as a fallback for lesson bucketing.
export function getCurrentMarkingPeriod(now = new Date()) {
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  for (const mp of MARKING_PERIODS) {
    if (!mp.active) continue;
    const afterStart = !mp.start || todayStr >= mp.start;
    const beforeEnd  = !mp.end   || todayStr <= mp.end;
    if (afterStart && beforeEnd) return mp.id;
  }
  return ACTIVE_MARKING_PERIODS[ACTIVE_MARKING_PERIODS.length - 1]?.id || null;
}

// Convert a Firestore Timestamp / Date / ISO string to YYYY-MM-DD, or null.
export function toDateStr(ts) {
  if (!ts) return null;
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  if (isNaN(d)) return null;
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Resolve a lesson's marking period: dueDate, then createdAt, else null.
// Returning null means the lesson should NOT appear under any MP tab.
export function getLessonMarkingPeriod(lesson) {
  if (!lesson) return null;
  return getMarkingPeriod(lesson.dueDate) || getMarkingPeriod(toDateStr(lesson.createdAt));
}
