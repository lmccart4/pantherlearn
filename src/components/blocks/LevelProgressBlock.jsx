// LevelProgressBlock — student-facing progress bar that fills as the teacher
// marks a linked teacher_checkpoint (e.g., Crack the Circuit).
//
// Block shape:
//   { type: "level_progress", linkedBlockId, maxLevel, tiers: [{minLevel, label, pct, color}, ...], title, intro }

import { renderMarkdown } from "../../lib/utils";

export default function LevelProgressBlock({ block, studentData = {} }) {
  const maxLevel = block.maxLevel || 18;
  const tiers = Array.isArray(block.tiers) ? block.tiers : [];
  const linked = block.linkedBlockId ? studentData[block.linkedBlockId] : null;
  const level = typeof linked?.studentLevel === "number" ? linked.studentLevel : 0;
  const isGraded = typeof linked?.studentLevel === "number";
  const pct = Math.max(0, Math.min(100, (level / maxLevel) * 100));

  const currentTier = (function () {
    for (const t of tiers) if (level >= t.minLevel) return t;
    return tiers[tiers.length - 1] || { label: "—", pct: 0, color: "#94a3b8" };
  })();

  return (
    <div style={{
      border: "1px solid var(--border)", borderRadius: 14, padding: 18,
      background: "var(--surface)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6, gap: 12, flexWrap: "wrap" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text)" }}>
          {block.title || "Your Progress"}
        </div>
        {isGraded && (
          <div style={{
            fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 8,
            background: `${currentTier.color}22`, color: currentTier.color,
            border: `1px solid ${currentTier.color}55`,
          }}>
            Level {level}/{maxLevel} · {currentTier.label} · {currentTier.pct}%
          </div>
        )}
      </div>

      {block.intro && (
        <div
          style={{ fontSize: 13, color: "var(--text2)", marginBottom: 12 }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(block.intro) }}
        />
      )}

      {/* The bar — clean pill style with percentage on the right */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 4 }}>
        <div style={{ flex: 1, position: "relative", height: 14, background: "#e5e7eb", borderRadius: 999, overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: 0, bottom: 0, left: 0, width: `${pct}%`,
            background: currentTier.color,
            borderRadius: 999,
            transition: "width 480ms cubic-bezier(.2,.8,.2,1), background 320ms ease",
          }} />
        </div>
        <div style={{ fontSize: 20, fontWeight: 500, color: "var(--text2)", minWidth: 56, textAlign: "right" }}>
          {Math.round(pct)}%
        </div>
      </div>

      {isGraded && (
        <div style={{ marginTop: 10, fontSize: 13, color: "var(--text3)" }}>
          {level} of {maxLevel} levels
        </div>
      )}

      {!isGraded && (
        <div style={{ marginTop: 10, fontSize: 12, color: "var(--text3)", fontStyle: "italic" }}>
          Raise your hand when you're ready. Your bar will fill in once Mr. McCarthy verifies your level.
        </div>
      )}
    </div>
  );
}
