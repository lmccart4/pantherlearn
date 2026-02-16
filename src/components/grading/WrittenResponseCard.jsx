// src/components/grading/WrittenResponseCard.jsx
import { useState } from "react";
import { analyzeResponse } from "../../lib/aiDetection";
import { compareToBaselines } from "../../lib/aiBaselines";

export default function WrittenResponseCard({ item, helpers, onSelectStudent, selectedLesson }) {
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  const { getStudentName, getStudentEmail, getStudentPhoto, getBlockPrompt, lessonMap, responses } = helpers;

  // Build per-student writing history for comparison
  const history = responses
    .filter((r) => r.studentId === item.studentId && r.id !== item.id && r.answer)
    .map((r) => r.answer);

  // Look up AI baselines from the lesson block
  const lessonInfo = lessonMap[item.lessonId];
  const block = (lessonInfo?.blocks || []).find((b) => b.id === item.blockId);
  const aiBaselines = block?.aiBaselines || [];

  const analysis = analyzeResponse(item.answer, {
    submittedAt: item.submittedAt,
    previousResponses: history,
    aiBaselines,
    compareToBaselines,
  });

  return (
    <div className="card" style={{ padding: "16px 20px", borderColor: analysis.risk === "high" ? "rgba(239,68,68,0.25)" : analysis.risk === "medium" ? "rgba(245,166,35,0.25)" : undefined }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {getStudentPhoto(item.studentId) ? (
            <img src={getStudentPhoto(item.studentId)} alt="" style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)" }} />
          ) : (
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "var(--text3)" }}>👤</div>
          )}
          <div>
            <span style={{ fontWeight: 600, fontSize: 14, cursor: "pointer", color: "var(--text)" }}
              onClick={() => onSelectStudent(item.studentId, item.lessonId, selectedLesson)}>
              {getStudentName(item.studentId)}
            </span>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>{getStudentEmail(item.studentId)}</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {analysis.risk !== "none" && (
            <span
              onClick={(e) => { e.stopPropagation(); setIsAnalysisExpanded(!isAnalysisExpanded); }}
              style={{
                fontSize: 11, padding: "2px 10px", borderRadius: 4, fontWeight: 600, cursor: "pointer",
                background: analysis.risk === "high" ? "var(--red-dim)" : analysis.risk === "medium" ? "var(--amber-dim)" : "var(--surface2)",
                color: analysis.color, transition: "opacity 0.15s",
              }}
              title="Click for details"
            >
              {analysis.label}
            </span>
          )}
          <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, background: "var(--blue-dim)", color: "var(--blue)", fontWeight: 600 }}>
            Needs review
          </span>
        </div>
      </div>

      {/* AI detection detail panel */}
      {isAnalysisExpanded && analysis.risk !== "none" && (
        <div style={{
          background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
          padding: "12px 16px", marginBottom: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text2)" }}>AI Detection Analysis</span>
            <span style={{ fontSize: 11, color: "var(--text3)" }}>
              Confidence: {Math.round(analysis.overallScore * 100)}%
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 12 }}>
            {analysis.details.filter((d) => d.score > 0).map((d) => (
              <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: "var(--text3)", width: 130, flexShrink: 0 }}>{d.name}</span>
                <div style={{ flex: 1, height: 6, background: "var(--surface2)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    width: `${d.score * 100}%`, height: "100%", borderRadius: 3,
                    background: d.score > 0.6 ? "var(--red)" : d.score > 0.3 ? "var(--amber)" : "var(--text3)",
                    transition: "width 0.3s",
                  }} />
                </div>
                <span style={{ fontSize: 10, color: "var(--text3)", width: 28, textAlign: "right" }}>
                  {Math.round(d.score * 100)}
                </span>
              </div>
            ))}
          </div>

          {analysis.flags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {analysis.flags.map((flag, i) => (
                <span key={i} style={{
                  fontSize: 10, padding: "2px 8px", borderRadius: 4,
                  background: "var(--surface2)", color: "var(--text2)", border: "1px solid var(--border)",
                }}>
                  {flag}
                </span>
              ))}
            </div>
          )}

          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, color: "var(--text3)", fontStyle: "italic" }}>
            <span>Heuristic analysis only — not definitive. Use as a starting point for conversation with the student.</span>
            {aiBaselines.length > 0 ? (
              <span style={{ fontStyle: "normal", color: "var(--green)", fontWeight: 600 }}>
                ✓ AI baselines active ({aiBaselines.map((b) => b.provider).join(", ")})
              </span>
            ) : (
              <span style={{ fontStyle: "normal", color: "var(--text3)" }}>
                ○ No AI baselines — re-save lesson to generate
              </span>
            )}
          </div>
        </div>
      )}

      <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 8 }}>
        {getBlockPrompt(item.lessonId, item.blockId)}
      </div>
      <div style={{ background: "var(--bg)", borderRadius: 8, padding: 14, fontSize: 15, lineHeight: 1.6, marginBottom: 12, border: "1px solid var(--border)" }}>
        {item.answer}
      </div>
      {item.submittedAt && (
        <div style={{ fontSize: 11, color: "var(--text3)" }}>
          Submitted {new Date(item.submittedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
        </div>
      )}
    </div>
  );
}