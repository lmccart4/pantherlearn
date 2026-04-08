// src/components/grading/WeeklyEvidenceTab.jsx
// Grading tab for weekly evidence submissions — navigate weeks, review photos & reflections, grade per-week.

import { useState, useEffect, useMemo } from "react";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { createNotification } from "../../lib/notifications";
import { awardXP, getXPConfig, DEFAULT_XP_VALUES } from "../../lib/gamification";
import {
  DAYS, DAY_LABELS, getISOWeekKey, getWeekRange,
  formatDateShort, offsetWeekKey, countDaysWithPhotos,
  normalizeDayImages, isLegacyFormat, dayHasPhotos,
} from "../../lib/weekHelpers";
import { GRADE_TIERS } from "../../lib/gradeTiers";

function suggestScore(weekData) {
  if (!weekData) return 0;
  const daysCount = countDaysWithPhotos(weekData);
  const photoScore = daysCount / 5;

  let reflectionWords = 0;
  DAYS.forEach((day) => {
    const ref = weekData[day]?.reflection || "";
    reflectionWords += ref.trim().split(/\s+/).filter((w) => w).length;
  });
  const reflectionScore = Math.min(reflectionWords / 50, 1);

  return Math.min(Math.round((photoScore * 0.6 + reflectionScore * 0.4) * 100), 100);
}

function suggestTierLabel(score) {
  if (score === 0) return "Missing";
  if (score < 55) return "Emerging";
  if (score < 65) return "Approaching";
  if (score < 85) return "Developing";
  return "Refining";
}

export default function WeeklyEvidenceTab({ selectedCourse, studentMap }) {
  const [weekKey, setWeekKey] = useState(() => getISOWeekKey());
  const [loading, setLoading] = useState(true);
  const [evidenceMap, setEvidenceMap] = useState({}); // { uid: weekDoc }
  const [grades, setGrades] = useState({}); // { uid: { score, label, courseId } }
  const [expanded, setExpanded] = useState(null);
  const [grading, setGrading] = useState(null);

  // Get sorted student list from studentMap
  const students = useMemo(() =>
    Object.entries(studentMap || {})
      .filter(([, info]) => info.role !== "teacher")
      .map(([uid, info]) => ({ uid, ...info }))
      .sort((a, b) => (a.displayName || "").localeCompare(b.displayName || "")),
    [studentMap]
  );

  // Fetch evidence + grades for the selected week
  useEffect(() => {
    if (!selectedCourse || students.length === 0) { setLoading(false); return; }

    const fetchWeekData = async () => {
      setLoading(true);
      const evMap = {};
      const gradeMap = {};

      const promises = students.map(async (s) => {
        // Fetch evidence doc
        try {
          const evDoc = await getDoc(doc(db, "evidence", s.uid, "courses", selectedCourse, "weeks", weekKey));
          if (evDoc.exists()) evMap[s.uid] = evDoc.data();
        } catch (e) { console.debug('Evidence fetch error', e.code); }

        // Fetch existing grade
        try {
          const gradeDoc = await getDoc(doc(db, "progress", s.uid, "courses", selectedCourse, "activities", `weekly-evidence-${weekKey}`));
          if (gradeDoc.exists()) {
            const d = gradeDoc.data();
            gradeMap[s.uid] = { score: d.activityScore, label: d.activityLabel, courseId: selectedCourse };
          }
        } catch (e) { console.debug('Evidence fetch error', e.code); }
      });

      await Promise.all(promises);
      setEvidenceMap(evMap);
      setGrades(gradeMap);
      setLoading(false);
    };

    fetchWeekData();
  }, [selectedCourse, weekKey, students.length]);

  const handleGrade = async (uid, tier) => {
    if (grading) return;
    setGrading(uid);
    try {
      const activityId = `weekly-evidence-${weekKey}`;
      const range = getWeekRange(weekKey);
      const title = `Weekly Evidence (${formatDateShort(range.start)} – ${formatDateShort(range.end)})`;

      const gradeRef = doc(db, "progress", uid, "courses", selectedCourse, "activities", activityId);
      await setDoc(gradeRef, {
        activityScore: tier.value,
        activityLabel: tier.label,
        activityType: "weekly-evidence",
        activityTitle: title,
        weekKey,
        gradedAt: new Date(),
      }, { merge: true });

      setGrades((prev) => ({ ...prev, [uid]: { score: tier.value, label: tier.label, courseId: selectedCourse } }));

      try {
        const config = await getXPConfig(selectedCourse);
        const xpAmount = config?.xpValues?.[tier.xpKey] ?? DEFAULT_XP_VALUES[tier.xpKey] ?? 0;
        if (xpAmount > 0) await awardXP(uid, xpAmount, `activity_grade:weekly-evidence:${tier.label.toLowerCase()}`, selectedCourse);
      } catch (xpErr) { console.warn("Could not award evidence XP:", xpErr); }

      try {
        await createNotification(uid, {
          type: "grade_result",
          title: `Evidence graded: ${tier.label}`,
          body: `Your weekly evidence for ${formatDateShort(range.start)} – ${formatDateShort(range.end)} received ${tier.label} (${Math.round(tier.value * 100)}%)`,
          icon: "\uD83D\uDCF8",
          courseId: selectedCourse,
        });
      } catch { /* non-critical */ }
    } catch (err) {
      console.error("Failed to save evidence grade:", err);
      alert("Failed to save grade. Please try again.");
    }
    setGrading(null);
  };

  const currentTier = (uid) => {
    const g = grades[uid];
    if (!g || g.score === null || g.score === undefined) return null;
    return GRADE_TIERS.find((t) => t.value === g.score) || null;
  };

  // Week navigation
  const range = getWeekRange(weekKey);
  const weekLabel = `${formatDateShort(range.start)} – ${formatDateShort(range.end)}`;
  const isCurrentWeek = weekKey === getISOWeekKey();

  // Stats
  const submitted = students.filter((s) => evidenceMap[s.uid] && countDaysWithPhotos(evidenceMap[s.uid]) > 0).length;
  const graded = Object.keys(grades).length;
  const needsReview = submitted - graded;

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {[1, 2, 3].map((i) => <div key={i} className="skeleton skeleton-card" style={{ height: 80 }} />)}
      </div>
    );
  }

  return (
    <div>
      {/* Week navigator */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 12,
        marginBottom: 20, padding: "10px 0",
      }}>
        <button onClick={() => setWeekKey(offsetWeekKey(weekKey, -1))} style={{
          background: "none", border: "1px solid var(--border)", borderRadius: 8,
          color: "var(--text)", cursor: "pointer", padding: "6px 12px", fontSize: 14,
        }}>
          ←
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text)" }}>
            Week of {weekLabel}
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>
            {weekKey}{isCurrentWeek ? " (current)" : ""}
          </div>
        </div>
        <button onClick={() => setWeekKey(offsetWeekKey(weekKey, 1))} disabled={isCurrentWeek} style={{
          background: "none", border: "1px solid var(--border)", borderRadius: 8,
          color: isCurrentWeek ? "var(--text3)" : "var(--text)", cursor: isCurrentWeek ? "default" : "pointer",
          padding: "6px 12px", fontSize: 14, opacity: isCurrentWeek ? 0.4 : 1,
        }}>
          →
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {[
          { label: "Students", value: students.length, color: "var(--text)" },
          { label: "Submitted", value: submitted, color: "var(--cyan)" },
          { label: "Graded", value: graded, color: "var(--green)" },
          { label: "Needs Review", value: Math.max(needsReview, 0), color: needsReview > 0 ? "var(--amber)" : "var(--text3)" },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "var(--font-display)", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Student list */}
      {students.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48, color: "var(--text3)" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{"\uD83D\uDCF8"}</div>
          <p style={{ fontSize: 15, fontWeight: 600 }}>No students enrolled</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {students.map((s) => {
            const evidence = evidenceMap[s.uid];
            const daysCount = countDaysWithPhotos(evidence);
            const tier = currentTier(s.uid);
            const score = suggestScore(evidence);
            const isExpanded = expanded === s.uid;
            const legacy = evidence && isLegacyFormat(evidence);

            return (
              <div key={s.uid} className="card" style={{
                padding: "16px 20px",
                borderColor: !tier && daysCount > 0 ? "rgba(245,166,35,0.15)" : undefined,
              }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {s.photoURL ? (
                      <img src={s.photoURL} alt="" style={{ width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)" }} />
                    ) : (
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "var(--text3)" }}>{"\uD83D\uDC64"}</div>
                    )}
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text)" }}>{s.displayName || s.uid.slice(0, 8)}</span>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{s.email || ""}</div>
                    </div>
                  </div>
                  {tier ? (
                    <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, fontWeight: 600, background: tier.bg, color: tier.color }}>
                      {tier.label}
                    </span>
                  ) : daysCount > 0 ? (
                    <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, background: "var(--blue-dim, rgba(59,130,246,0.12))", color: "var(--blue, #3b82f6)", fontWeight: 600 }}>
                      Needs review
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 4, background: "var(--surface2)", color: "var(--text3)", fontWeight: 600 }}>
                      No submission
                    </span>
                  )}
                </div>

                {/* Stats row */}
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10, fontSize: 12 }}>
                  {/* Day dots */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ color: "var(--text3)", marginRight: 4 }}>Days:</span>
                    {legacy ? (
                      <span style={{ color: "var(--text3)", fontSize: 11 }}>legacy format</span>
                    ) : (
                      DAYS.map((day) => (
                        <span key={day} title={DAY_LABELS[day]} style={{
                          width: 10, height: 10, borderRadius: "50%",
                          background: evidence && dayHasPhotos(evidence[day]) ? "var(--green)" : "var(--border)",
                          display: "inline-block",
                        }} />
                      ))
                    )}
                    <span style={{ marginLeft: 4, fontWeight: 600, color: daysCount > 0 ? "var(--text)" : "var(--text3)" }}>
                      {daysCount}/5
                    </span>
                  </div>
                  {daysCount > 0 && (
                    <div>
                      <span style={{ color: "var(--text3)" }}>Suggested: </span>
                      <span style={{ fontWeight: 600, color: "var(--text2)" }}>{score}% ({suggestTierLabel(score)})</span>
                    </div>
                  )}
                  {evidence && (
                    <button onClick={() => setExpanded(isExpanded ? null : s.uid)} style={{
                      background: "none", border: "none", color: "var(--amber)", cursor: "pointer",
                      fontSize: 11, fontWeight: 600, marginLeft: "auto",
                    }}>
                      {isExpanded ? "▲ Collapse" : "▼ Details"}
                    </button>
                  )}
                </div>

                {/* Expanded detail */}
                {isExpanded && evidence && (
                  <div style={{
                    background: "var(--bg)", borderRadius: 8, padding: 12, marginBottom: 12,
                    border: "1px solid var(--border)",
                  }}>
                    {legacy ? (
                      <div style={{ fontSize: 12, color: "var(--text3)" }}>
                        Legacy format — {(evidence.images || []).length} photo(s) uploaded
                        {evidence.reflection && (
                          <div style={{ marginTop: 8, color: "var(--text2)", lineHeight: 1.4 }}>
                            <strong>Reflection:</strong> {evidence.reflection}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {DAYS.map((day) => {
                          const dayData = evidence[day];
                          const images = normalizeDayImages(dayData);
                          const reflection = dayData?.reflection || "";
                          const hasContent = images.length > 0 || reflection;

                          return (
                            <div key={day} style={{
                              display: "flex", gap: 10, padding: "8px 0",
                              borderBottom: day !== "friday" ? "1px solid var(--border)" : "none",
                              opacity: hasContent ? 1 : 0.4,
                            }}>
                              <div style={{
                                width: 40, fontSize: 11, fontWeight: 700, color: "var(--text3)",
                                textTransform: "uppercase", paddingTop: 2, flexShrink: 0,
                              }}>
                                {DAY_LABELS[day]}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                {images.length > 0 ? (
                                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: reflection ? 6 : 0 }}>
                                    {images.map((img, i) => (
                                      <img key={i} src={typeof img === "string" ? img : img.dataUrl}
                                        alt="" style={{
                                          width: 56, height: 56, objectFit: "cover", borderRadius: 6,
                                          border: "1px solid var(--border)",
                                        }}
                                      />
                                    ))}
                                  </div>
                                ) : (
                                  <span style={{ fontSize: 11, color: "var(--text3)" }}>No photos</span>
                                )}
                                {reflection && (
                                  <div style={{
                                    fontSize: 12, color: "var(--text2)", lineHeight: 1.4, marginTop: 4,
                                    maxHeight: 60, overflow: "hidden",
                                  }}>
                                    {reflection}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Grading buttons */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, marginRight: 4 }}>Grade:</span>
                  {GRADE_TIERS.map((t) => {
                    const isSelected = grades[s.uid]?.score === t.value;
                    return (
                      <button key={t.label} onClick={() => handleGrade(s.uid, t)}
                        disabled={grading === s.uid}
                        style={{
                          fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 6,
                          border: isSelected ? `2px solid ${t.color}` : "1px solid var(--border)",
                          background: isSelected ? t.bg : "transparent",
                          color: isSelected ? t.color : "var(--text3)",
                          cursor: grading === s.uid ? "default" : "pointer",
                          transition: "all 0.15s",
                          opacity: grading === s.uid ? 0.5 : 1,
                        }}
                        onMouseEnter={(e) => { if (!isSelected) { e.currentTarget.style.background = t.bg; e.currentTarget.style.color = t.color; } }}
                        onMouseLeave={(e) => { if (!isSelected) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text3)"; } }}
                      >
                        {t.label} {Math.round(t.value * 100)}%
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
