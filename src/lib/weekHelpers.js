// src/lib/weekHelpers.js
// Shared week utility functions for Weekly Evidence system.

export const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];
export const DAY_LABELS = { monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu", friday: "Fri" };
export const DAY_FULL = { monday: "Monday", tuesday: "Tuesday", wednesday: "Wednesday", thursday: "Thursday", friday: "Friday" };

export function getISOWeekKey(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const yearStart = new Date(d.getFullYear(), 0, 4);
  const weekNum = 1 + Math.round(
    ((d - yearStart) / 86400000 - 3 + ((yearStart.getDay() + 6) % 7)) / 7
  );
  return `${d.getFullYear()}-W${String(weekNum).padStart(2, "0")}`;
}

export function getWeekMonday(weekKey) {
  const [yearStr, wStr] = weekKey.split("-W");
  const year = parseInt(yearStr, 10);
  const week = parseInt(wStr, 10);
  const jan4 = new Date(year, 0, 4);
  const dayOfWeek = (jan4.getDay() + 6) % 7;
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - dayOfWeek + (week - 1) * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function getWeekRange(weekKey) {
  const monday = getWeekMonday(weekKey);
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  return { start: monday, end: friday };
}

export function formatDateShort(d) {
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function offsetWeekKey(weekKey, delta) {
  const monday = getWeekMonday(weekKey);
  monday.setDate(monday.getDate() + delta * 7);
  return getISOWeekKey(monday);
}

export function isLegacyFormat(data) {
  return data && Array.isArray(data.images) && !data.monday;
}

export function dayHasPhotos(dayData) {
  if (!dayData) return false;
  if (Array.isArray(dayData.images) && dayData.images.length > 0) return true;
  if (dayData.image) return true;
  return false;
}

export function countDaysWithPhotos(data) {
  if (!data) return 0;
  if (isLegacyFormat(data)) return data.images?.length > 0 ? 1 : 0;
  return DAYS.filter((d) => dayHasPhotos(data[d])).length;
}

export function normalizeDayImages(dayData) {
  if (!dayData) return [];
  if (Array.isArray(dayData.images)) return dayData.images;
  if (dayData.image) return [dayData.image];
  return [];
}
