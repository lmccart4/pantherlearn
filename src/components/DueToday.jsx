// src/components/DueToday.jsx
// Shows lessons due today, tomorrow, or overdue in a compact dashboard widget.
import { Link } from "react-router-dom";

export default function DueToday({ lessonMap, allCourses }) {
  if (!lessonMap || Object.keys(lessonMap).length === 0) return null;

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  // Collect lessons with due dates that are relevant (overdue, today, tomorrow)
  const items = [];
  for (const [lessonId, lesson] of Object.entries(lessonMap)) {
    if (!lesson.dueDate || lesson.visible === false) continue;
    const dueDate = lesson.dueDate;
    const isPastDue = dueDate < todayStr;
    const isToday = dueDate === todayStr;
    const isTomorrow = dueDate === tomorrowStr;
    if (isPastDue || isToday || isTomorrow) {
      const course = allCourses.find((c) => c.id === lesson.courseId);
      items.push({
        lessonId,
        title: lesson.title || "Untitled",
        courseId: lesson.courseId,
        courseName: course?.title || lesson.courseId,
        courseIcon: course?.icon || "📚",
        dueDate,
        isPastDue,
        isToday,
        isTomorrow,
        sortKey: isPastDue ? 0 : isToday ? 1 : 2,
      });
    }
  }

  // Sort: overdue first, then today, then tomorrow
  items.sort((a, b) => a.sortKey - b.sortKey || a.dueDate.localeCompare(b.dueDate));

  if (items.length === 0) {
    return (
      <div style={{
        flex: 1, padding: "14px 18px", borderRadius: 12,
        background: "var(--surface)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: 12,
        minHeight: 80,
      }}>
        <span style={{ fontSize: 24 }}>✅</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "var(--green)" }}>All caught up!</div>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>Nothing due today or tomorrow</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      flex: 1, padding: "14px 18px", borderRadius: 12,
      background: "var(--surface)", border: "1px solid var(--border)",
      minHeight: 80,
    }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        📋 Due Soon
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {items.slice(0, 4).map((item) => (
          <Link
            key={item.lessonId}
            to={`/course/${item.courseId}/lesson/${item.lessonId}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
              borderRadius: 8, background: "var(--surface2)", cursor: "pointer",
              borderLeft: `3px solid ${item.isPastDue ? "var(--red)" : item.isToday ? "var(--amber)" : "var(--text3)"}`,
              transition: "background 0.15s",
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 600, fontSize: 13,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {item.title}
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>
                  {item.courseIcon} {item.courseName}
                </div>
              </div>
              <div style={{
                fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                color: item.isPastDue ? "var(--red)" : item.isToday ? "var(--amber)" : "var(--text3)",
              }}>
                {item.isPastDue ? "⚠️ Overdue" : item.isToday ? "📌 Today" : "Tomorrow"}
              </div>
            </div>
          </Link>
        ))}
        {items.length > 4 && (
          <div style={{ fontSize: 11, color: "var(--text3)", textAlign: "center", paddingTop: 4 }}>
            +{items.length - 4} more
          </div>
        )}
      </div>
    </div>
  );
}
