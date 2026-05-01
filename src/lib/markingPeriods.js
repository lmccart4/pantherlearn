// Marking period boundaries for the 2025–26 school year.
//
// Currently MP3 + MP4 are active in the UI. MP1 + MP2 are placeholders for
// future support — they have `active: false` so they won't appear in tabs /
// dropdowns until their dates are filled in.
//
// Boundaries:
//   MP3: ends 2026-04-15 (last day of MP3 = April 15, 2026)
//   MP4: starts 2026-04-16 (first day of MP4 = April 16, 2026)
//
// Extra-credit assignments posted on/around 4/14–4/15 are MP3 because their
// dueDate falls inside the MP3 window — no per-lesson override needed.

export const MARKING_PERIODS = [
  { id: "mp1", label: "MP1", start: null,         end: null,         active: false },
  { id: "mp2", label: "MP2", start: null,         end: null,         active: false },
  { id: "mp3", label: "MP3", start: null,         end: "2026-04-15", active: true  },
  { id: "mp4", label: "MP4", start: "2026-04-16", end: null,         active: true  },
];

export const ACTIVE_MARKING_PERIODS = MARKING_PERIODS.filter((mp) => mp.active);

// Returns the marking period id for a given dueDate (YYYY-MM-DD), or null.
export function getMarkingPeriod(dueDate) {
  if (!dueDate) return null;
  for (const mp of MARKING_PERIODS) {
    if (!mp.active) continue;
    const afterStart = !mp.start || dueDate >= mp.start;
    const beforeEnd  = !mp.end   || dueDate <= mp.end;
    if (afterStart && beforeEnd) return mp.id;
  }
  return null;
}

// Returns the id of the marking period containing today, or the most recent
// active period if today is past all active windows.
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
