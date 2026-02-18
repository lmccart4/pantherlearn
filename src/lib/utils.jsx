// src/lib/utils.js

function escapeHTML(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderMarkdown(text) {
  if (!text) return "";
  // Escape HTML first to prevent XSS, THEN apply markdown formatting
  return escapeHTML(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

export function uid() {
  return crypto.randomUUID().slice(0, 8);
}

/**
 * Resolves the effective due date for a lesson given a student's sectionId.
 * Priority: section-specific override > global dueDate > null
 * @param {Object} lesson - Lesson object with optional dueDate and dueDates fields
 * @param {string|null} sectionId - The student's sectionId (e.g., "period-1")
 * @returns {string|null} - Due date string "YYYY-MM-DD" or null
 */
export function getEffectiveDueDate(lesson, sectionId) {
  if (sectionId && lesson?.dueDates?.[sectionId]) {
    return lesson.dueDates[sectionId];
  }
  return lesson?.dueDate || null;
}