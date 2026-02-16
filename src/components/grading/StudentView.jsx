// src/components/grading/StudentView.jsx
import ChatLogCard from "./ChatLogCard";
import WrittenResponseCard from "./WrittenResponseCard";

export default function StudentView({ courseResponses, courseLogs, selectedStudent, activeTab, helpers }) {
  const { getStudentName, getStudentEmail, getStudentPhoto } = helpers;

  const studentWritten = courseResponses.filter((r) => r.studentId === selectedStudent);
  const studentLogs = courseLogs.filter((l) => l.studentId === selectedStudent);
  const photo = getStudentPhoto(selectedStudent);

  return (
    <div>
      {/* Student header */}
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 16, padding: "20px 24px", marginBottom: 24 }}>
        {photo ? (
          <img src={photo} alt="" style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid var(--border)" }} />
        ) : (
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--text3)" }}>👤</div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>{getStudentName(selectedStudent)}</div>
          <div style={{ fontSize: 13, color: "var(--text3)" }}>{getStudentEmail(selectedStudent)}</div>
        </div>
        <div style={{ display: "flex", gap: 20, textAlign: "center" }}>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--amber)" }}>{studentWritten.length}</div>
            <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", fontWeight: 600 }}>Written</div>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--cyan)" }}>{studentLogs.length}</div>
            <div style={{ fontSize: 10, color: "var(--text3)", textTransform: "uppercase", fontWeight: 600 }}>Chats</div>
          </div>
        </div>
      </div>

      {activeTab === "written" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {studentWritten.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No written responses from this student</div>
          ) : studentWritten.map((item) => (
            <WrittenResponseCard key={item.id} item={item} helpers={helpers} onSelectStudent={() => {}} selectedLesson={null} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {studentLogs.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 40, color: "var(--text3)" }}>No chat conversations from this student</div>
          ) : studentLogs.map((log) => (
            <ChatLogCard key={log.id} log={log} helpers={helpers} />
          ))}
        </div>
      )}
    </div>
  );
}