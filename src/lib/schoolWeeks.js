// School week calendar for the 2025-2026 academic year.
// Week 0 is the 2-day opener (Sep 4-5). Weeks where school did not meet at
// all (Fall Recess Nov 3-7, Spring Break Apr 6-10, Dec 29 - Jan 2) are NOT
// counted. Shortened weeks (holidays, early dismissal) are counted.
// Labeling stops at Week 38 (Jun 15-18); Week 39 is finals and is not shown
// as a regular instructional week.
//
// Range semantics: each week's [start, end] covers Mon-Sun of that week so a
// lesson dated on a weekend still buckets into the preceding school week.
// Labels still show only the school days (e.g. "Feb 17-20" even though the
// range absorbs Feb 21-22). Adjacent weeks never overlap because every gap
// falls on a skipped recess week.
//
// Usage:
//   getWeekForDate("2026-04-14") -> 29
//   getCurrentWeek() -> returns the WEEKS entry whose range includes today

export const WEEKS = [
  // Week 0 is the half-week opener Thu-Sun Sep 4-7
  { num: 0, label: "Week 0 · Sep 4-5", start: "2025-09-04", end: "2025-09-07" },
  { num: 1, label: "Week 1 · Sep 8-12", start: "2025-09-08", end: "2025-09-14" },
  { num: 2, label: "Week 2 · Sep 15-19", start: "2025-09-15", end: "2025-09-21" },
  { num: 3, label: "Week 3 · Sep 22-26", start: "2025-09-22", end: "2025-09-28" },
  { num: 4, label: "Week 4 · Sep 29 – Oct 3", start: "2025-09-29", end: "2025-10-05" },
  { num: 5, label: "Week 5 · Oct 6-10", start: "2025-10-06", end: "2025-10-12" },
  { num: 6, label: "Week 6 · Oct 14-17", start: "2025-10-13", end: "2025-10-19" },
  { num: 7, label: "Week 7 · Oct 20-24", start: "2025-10-20", end: "2025-10-26" },
  { num: 8, label: "Week 8 · Oct 27-31", start: "2025-10-27", end: "2025-11-02" },
  // Nov 3-7 Fall Recess — skipped entirely
  { num: 9, label: "Week 9 · Nov 10-14", start: "2025-11-10", end: "2025-11-16" },
  { num: 10, label: "Week 10 · Nov 17-21", start: "2025-11-17", end: "2025-11-23" },
  { num: 11, label: "Week 11 · Nov 24-26", start: "2025-11-24", end: "2025-11-30" },
  { num: 12, label: "Week 12 · Dec 1-5", start: "2025-12-01", end: "2025-12-07" },
  { num: 13, label: "Week 13 · Dec 8-12", start: "2025-12-08", end: "2025-12-14" },
  { num: 14, label: "Week 14 · Dec 15-19", start: "2025-12-15", end: "2025-12-21" },
  { num: 15, label: "Week 15 · Dec 22-23", start: "2025-12-22", end: "2025-12-28" },
  // Dec 29 - Jan 4 Holiday Recess — skipped
  { num: 16, label: "Week 16 · Jan 5-9", start: "2026-01-05", end: "2026-01-11" },
  { num: 17, label: "Week 17 · Jan 12-16", start: "2026-01-12", end: "2026-01-18" },
  { num: 18, label: "Week 18 · Jan 20-23", start: "2026-01-19", end: "2026-01-25" },
  { num: 19, label: "Week 19 · Jan 26-30", start: "2026-01-26", end: "2026-02-01" },
  { num: 20, label: "Week 20 · Feb 2-6", start: "2026-02-02", end: "2026-02-08" },
  { num: 21, label: "Week 21 · Feb 9-13", start: "2026-02-09", end: "2026-02-15" },
  { num: 22, label: "Week 22 · Feb 17-20", start: "2026-02-16", end: "2026-02-22" },
  { num: 23, label: "Week 23 · Feb 23-27", start: "2026-02-23", end: "2026-03-01" },
  { num: 24, label: "Week 24 · Mar 2-6", start: "2026-03-02", end: "2026-03-08" },
  { num: 25, label: "Week 25 · Mar 9-13", start: "2026-03-09", end: "2026-03-15" },
  { num: 26, label: "Week 26 · Mar 16-20", start: "2026-03-16", end: "2026-03-22" },
  { num: 27, label: "Week 27 · Mar 23-27", start: "2026-03-23", end: "2026-03-29" },
  { num: 28, label: "Week 28 · Mar 30 – Apr 2", start: "2026-03-30", end: "2026-04-05" },
  // Apr 6-12 Spring Recess — skipped
  { num: 29, label: "Week 29 · Apr 13-17", start: "2026-04-13", end: "2026-04-19" },
  { num: 30, label: "Week 30 · Apr 20-24", start: "2026-04-20", end: "2026-04-26" },
  { num: 31, label: "Week 31 · Apr 27 – May 1", start: "2026-04-27", end: "2026-05-03" },
  { num: 32, label: "Week 32 · May 4-8", start: "2026-05-04", end: "2026-05-10" },
  { num: 33, label: "Week 33 · May 11-15", start: "2026-05-11", end: "2026-05-17" },
  { num: 34, label: "Week 34 · May 18-22", start: "2026-05-18", end: "2026-05-24" },
  { num: 35, label: "Week 35 · May 26-29", start: "2026-05-25", end: "2026-05-31" },
  { num: 36, label: "Week 36 · Jun 1-5", start: "2026-06-01", end: "2026-06-07" },
  { num: 37, label: "Week 37 · Jun 8-12", start: "2026-06-08", end: "2026-06-14" },
  { num: 38, label: "Week 38 · Jun 15-18", start: "2026-06-15", end: "2026-06-21" },
  // Week 39 (Jun 22-25) is finals — not shown as instructional
];

// Map a YYYY-MM-DD string → week number, or null if the date is outside all
// instructional ranges (including recess weeks and finals).
export function getWeekForDate(dateStr) {
  if (!dateStr) return null;
  const d = String(dateStr).slice(0, 10); // tolerate ISO datetimes
  for (const w of WEEKS) {
    if (d >= w.start && d <= w.end) return w.num;
  }
  return null;
}

// Return the WEEKS entry whose range includes today's local date, or null.
export function getCurrentWeek() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const today = `${y}-${m}-${day}`;
  return WEEKS.find((w) => today >= w.start && today <= w.end) || null;
}

// Group lessons by week. Returns an array of { week, lessons } in descending
// week-number order (newest at top). Lessons with no dueDate OR dueDate
// outside every week range go into a synthetic "Unscheduled" bucket at the
// very top. Within each week, lessons sort by dueDate descending (Friday on
// top, Monday on bottom); ties break on `order` descending.
export function groupLessonsByWeek(lessons) {
  const byWeek = new Map(); // num → lessons[]
  const unscheduled = [];
  for (const lesson of lessons) {
    const wn = getWeekForDate(lesson.dueDate);
    if (wn == null) {
      unscheduled.push(lesson);
      continue;
    }
    if (!byWeek.has(wn)) byWeek.set(wn, []);
    byWeek.get(wn).push(lesson);
  }

  const sortInWeek = (arr) => {
    arr.sort((a, b) => {
      const da = a.dueDate || "";
      const db = b.dueDate || "";
      if (da !== db) return db.localeCompare(da); // Fri → Mon
      return (b.order || 0) - (a.order || 0);
    });
  };

  const groups = [];
  if (unscheduled.length > 0) {
    // Sort by unit (numeric-aware so "Unit 2" precedes "Unit 10"), then by
    // `order` ascending within unit. Lessons missing a unit fall to the bottom.
    const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: "base" });
    unscheduled.sort((a, b) => {
      const ua = a.unit || "";
      const ub = b.unit || "";
      if (ua && !ub) return -1;
      if (!ua && ub) return 1;
      const byUnit = collator.compare(ua, ub);
      if (byUnit !== 0) return byUnit;
      return (a.order || 0) - (b.order || 0);
    });
    groups.push({
      week: { num: -1, label: "Unscheduled", start: null, end: null },
      lessons: unscheduled,
    });
  }

  // Newest week first
  const sortedNums = [...byWeek.keys()].sort((a, b) => b - a);
  for (const n of sortedNums) {
    const week = WEEKS.find((w) => w.num === n);
    const weekLessons = byWeek.get(n);
    sortInWeek(weekLessons);
    groups.push({ week, lessons: weekLessons });
  }

  return groups;
}
