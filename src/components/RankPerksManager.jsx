// src/components/RankPerksManager.jsx
// Teacher admin panel for managing rank perks per course.
// Add to your teacher settings/admin page.

import { useState, useEffect } from "react";
import {
  DEFAULT_PERKS,
  RANK_TIERS,
  LEVELS,
  loadCoursePerks,
  saveCoursePerks,
  approvePerkRedemption,
  denyPerkRedemption,
} from "../lib/gamification";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";

const styles = {
  container: {
    background: "#1a1a2e",
    borderRadius: 16,
    padding: 28,
    color: "#e0e0e0",
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: "#fff",
    margin: 0,
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  subtitle: {
    fontSize: 13,
    color: "#8892b0",
    marginTop: 4,
  },
  saveBtn: {
    background: "linear-gradient(135deg, #2ecc71, #27ae60)",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    padding: "10px 24px",
    fontSize: 14,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  saveBtnDisabled: {
    background: "#333",
    color: "#666",
    cursor: "not-allowed",
  },
  tierSection: {
    marginBottom: 20,
    border: "1px solid #2a2a4a",
    borderRadius: 12,
    overflow: "hidden",
  },
  tierHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "14px 18px",
    background: "#16162b",
    cursor: "pointer",
    userSelect: "none",
  },
  tierBadge: (color) => ({
    width: 36,
    height: 36,
    borderRadius: 8,
    background: `${color}22`,
    border: `2px solid ${color}`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
  }),
  tierName: (color) => ({
    fontSize: 16,
    fontWeight: 600,
    color,
  }),
  tierLevels: {
    fontSize: 12,
    color: "#8892b0",
  },
  perkRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 18px",
    borderTop: "1px solid #2a2a4a",
    transition: "background 0.15s",
  },
  perkRowDisabled: {
    opacity: 0.4,
  },
  toggle: (enabled) => ({
    width: 44,
    height: 24,
    borderRadius: 12,
    background: enabled ? "#2ecc71" : "#333",
    position: "relative",
    cursor: "pointer",
    transition: "background 0.2s",
    flexShrink: 0,
    border: "none",
    padding: 0,
  }),
  toggleDot: (enabled) => ({
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#fff",
    position: "absolute",
    top: 3,
    left: enabled ? 23 : 3,
    transition: "left 0.2s",
  }),
  perkIcon: {
    fontSize: 22,
    width: 36,
    textAlign: "center",
    flexShrink: 0,
  },
  perkInfo: {
    flex: 1,
    minWidth: 0,
  },
  perkName: {
    fontSize: 14,
    fontWeight: 600,
    color: "#fff",
  },
  perkDesc: {
    fontSize: 12,
    color: "#8892b0",
    marginTop: 2,
  },
  perkMeta: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    flexShrink: 0,
  },
  levelBadge: (color) => ({
    background: `${color}22`,
    color,
    border: `1px solid ${color}44`,
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 12,
    fontWeight: 600,
    whiteSpace: "nowrap",
  }),
  typeBadge: (type) => ({
    background: type === "consumable" ? "#e67e2222" : "#3498db22",
    color: type === "consumable" ? "#e67e22" : "#3498db",
    border: `1px solid ${type === "consumable" ? "#e67e2244" : "#3498db44"}`,
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 11,
    fontWeight: 600,
    whiteSpace: "nowrap",
  }),
  input: {
    background: "#16162b",
    border: "1px solid #2a2a4a",
    borderRadius: 6,
    color: "#fff",
    padding: "6px 10px",
    fontSize: 13,
    width: 50,
    textAlign: "center",
  },
  addPerkBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    padding: 14,
    background: "transparent",
    border: "2px dashed #2a2a4a",
    borderRadius: 12,
    color: "#8892b0",
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s",
    marginTop: 16,
  },
  // Request management
  requestsSection: {
    marginTop: 28,
    borderTop: "1px solid #2a2a4a",
    paddingTop: 20,
  },
  requestCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "12px 16px",
    background: "#16162b",
    borderRadius: 10,
    marginBottom: 8,
  },
  requestBtns: {
    display: "flex",
    gap: 8,
    marginLeft: "auto",
  },
  approveBtn: {
    background: "#2ecc71",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  denyBtn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 14px",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  emptyState: {
    textAlign: "center",
    padding: 20,
    color: "#555",
    fontSize: 13,
  },
  // Add perk modal
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "#1a1a2e",
    borderRadius: 16,
    padding: 28,
    width: "90%",
    maxWidth: 440,
    border: "1px solid #2a2a4a",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: "#fff",
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    display: "block",
    fontSize: 12,
    color: "#8892b0",
    marginBottom: 6,
    fontWeight: 600,
  },
  fullInput: {
    background: "#16162b",
    border: "1px solid #2a2a4a",
    borderRadius: 8,
    color: "#fff",
    padding: "10px 14px",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
  },
  select: {
    background: "#16162b",
    border: "1px solid #2a2a4a",
    borderRadius: 8,
    color: "#fff",
    padding: "10px 14px",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
  },
  modalBtns: {
    display: "flex",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 20,
  },
  cancelBtn: {
    background: "#333",
    color: "#aaa",
    border: "none",
    borderRadius: 8,
    padding: "10px 20px",
    fontSize: 14,
    cursor: "pointer",
  },
};

export default function RankPerksManager({ courseId }) {
  const [perks, setPerks] = useState(DEFAULT_PERKS);
  const [requests, setRequests] = useState([]);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPerk, setNewPerk] = useState({
    name: "",
    description: "",
    icon: "🎁",
    unlockLevel: 5,
    type: "consumable",
    usesPerSemester: 1,
    category: "privilege",
  });

  useEffect(() => {
    if (!courseId) return;
    loadCoursePerks(courseId).then(setPerks);
    loadRequests();
  }, [courseId]);

  async function loadRequests() {
    try {
      const ref = collection(db, "courses", courseId, "perkRequests");
      const q = query(ref, where("status", "==", "pending"), orderBy("requestedAt", "desc"));
      const snap = await getDocs(q);
      const reqs = [];
      snap.forEach((d) => reqs.push({ id: d.id, ...d.data() }));
      setRequests(reqs);
    } catch (err) {
      console.error("Error loading perk requests:", err);
    }
  }

  function togglePerk(perkId) {
    setPerks((prev) =>
      prev.map((p) =>
        p.id === perkId ? { ...p, enabled: p.enabled === false ? true : false } : p
      )
    );
    setDirty(true);
  }

  function updatePerkField(perkId, field, value) {
    setPerks((prev) =>
      prev.map((p) => (p.id === perkId ? { ...p, [field]: value } : p))
    );
    setDirty(true);
  }

  function removePerk(perkId) {
    setPerks((prev) => prev.filter((p) => p.id !== perkId));
    setDirty(true);
  }

  function addCustomPerk() {
    const id = `custom_${Date.now()}`;
    const tier = RANK_TIERS.find(
      (t) =>
        newPerk.unlockLevel >= t.minLevel * 5 - 4 &&
        newPerk.unlockLevel <= t.maxLevel
    )?.tier || 1;
    setPerks((prev) => [
      ...prev,
      {
        ...newPerk,
        id,
        tier: Math.ceil(newPerk.unlockLevel / 5),
        enabled: true,
        usesPerSemester: newPerk.type === "passive" ? null : newPerk.usesPerSemester,
      },
    ]);
    setShowAddModal(false);
    setNewPerk({
      name: "",
      description: "",
      icon: "🎁",
      unlockLevel: 5,
      type: "consumable",
      usesPerSemester: 1,
      category: "privilege",
    });
    setDirty(true);
  }

  async function handleSave() {
    setSaving(true);
    await saveCoursePerks(courseId, perks);
    setDirty(false);
    setSaving(false);
  }

  async function handleApprove(req) {
    await approvePerkRedemption(courseId, req.id, req.uid, req.perkId);
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  }

  async function handleDeny(req) {
    await denyPerkRedemption(courseId, req.id);
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  }

  // Group perks by tier
  const perksByTier = {};
  RANK_TIERS.forEach((t) => {
    perksByTier[t.tier] = perks
      .filter((p) => {
        const pTier = Math.ceil(p.unlockLevel / 5);
        return pTier === t.tier;
      })
      .sort((a, b) => a.unlockLevel - b.unlockLevel);
  });

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🏆 Rank Perks Manager</h2>
          <p style={styles.subtitle}>
            Configure which perks students unlock at each rank tier. 35 levels, 7 tiers.
          </p>
        </div>
        <button
          style={{
            ...styles.saveBtn,
            ...((!dirty || saving) ? styles.saveBtnDisabled : {}),
          }}
          onClick={handleSave}
          disabled={!dirty || saving}
        >
          {saving ? "Saving..." : dirty ? "Save Changes" : "Saved ✓"}
        </button>
      </div>

      {/* Tier sections */}
      {RANK_TIERS.map((tier) => (
        <div key={tier.tier} style={styles.tierSection}>
          <div style={styles.tierHeader}>
            <div style={styles.tierBadge(tier.color)}>{tier.icon}</div>
            <div>
              <div style={styles.tierName(tier.color)}>
                Tier {tier.tier}: {tier.name}
              </div>
              <div style={styles.tierLevels}>
                Levels {tier.minLevel}–{tier.maxLevel} • Unlocks at{" "}
                {LEVELS[tier.minLevel - 1]?.xpRequired?.toLocaleString()} XP
              </div>
            </div>
          </div>

          {(perksByTier[tier.tier] || []).length === 0 ? (
            <div style={styles.emptyState}>No perks assigned to this tier</div>
          ) : (
            (perksByTier[tier.tier] || []).map((perk) => (
              <div
                key={perk.id}
                style={{
                  ...styles.perkRow,
                  ...(perk.enabled === false ? styles.perkRowDisabled : {}),
                }}
              >
                <button
                  style={styles.toggle(perk.enabled !== false)}
                  onClick={() => togglePerk(perk.id)}
                  aria-label={`Toggle ${perk.name}`}
                >
                  <div style={styles.toggleDot(perk.enabled !== false)} />
                </button>

                <div style={styles.perkIcon}>{perk.icon}</div>

                <div style={styles.perkInfo}>
                  <div style={styles.perkName}>{perk.name}</div>
                  <div style={styles.perkDesc}>{perk.description}</div>
                </div>

                <div style={styles.perkMeta}>
                  <span style={styles.levelBadge(tier.color)}>
                    Lv {perk.unlockLevel}
                  </span>
                  <span style={styles.typeBadge(perk.type)}>{perk.type}</span>
                  {perk.type === "consumable" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <input
                        type="number"
                        style={styles.input}
                        value={perk.usesPerSemester || 1}
                        min={1}
                        max={10}
                        onChange={(e) =>
                          updatePerkField(
                            perk.id,
                            "usesPerSemester",
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                      <span style={{ fontSize: 11, color: "#666" }}>/sem</span>
                    </div>
                  )}
                  {perk.id.startsWith("custom_") && (
                    <button
                      onClick={() => removePerk(perk.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e74c3c",
                        cursor: "pointer",
                        fontSize: 16,
                        padding: "2px 6px",
                      }}
                      title="Remove custom perk"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ))}

      <button
        style={styles.addPerkBtn}
        onClick={() => setShowAddModal(true)}
        onMouseOver={(e) => {
          e.currentTarget.style.borderColor = "#2ecc71";
          e.currentTarget.style.color = "#2ecc71";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.borderColor = "#2a2a4a";
          e.currentTarget.style.color = "#8892b0";
        }}
      >
        + Add Custom Perk
      </button>

      {/* Pending Perk Requests */}
      {requests.length > 0 && (
        <div style={styles.requestsSection}>
          <h3 style={{ ...styles.title, fontSize: 18, marginBottom: 14 }}>
            📬 Pending Perk Requests ({requests.length})
          </h3>
          {requests.map((req) => {
            const perk = perks.find((p) => p.id === req.perkId);
            return (
              <div key={req.id} style={styles.requestCard}>
                <span style={{ fontSize: 20 }}>{perk?.icon || "🎁"}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                    {req.studentName}
                  </div>
                  <div style={{ fontSize: 12, color: "#8892b0" }}>
                    Wants to use: {perk?.name || req.perkId}
                  </div>
                </div>
                <div style={styles.requestBtns}>
                  <button style={styles.approveBtn} onClick={() => handleApprove(req)}>
                    Approve
                  </button>
                  <button style={styles.denyBtn} onClick={() => handleDeny(req)}>
                    Deny
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Perk Modal */}
      {showAddModal && (
        <div style={styles.modal} onClick={() => setShowAddModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalTitle}>Add Custom Perk</div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Perk Name</label>
              <input
                style={styles.fullInput}
                value={newPerk.name}
                onChange={(e) => setNewPerk({ ...newPerk, name: e.target.value })}
                placeholder="e.g., Bathroom Priority Pass"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <input
                style={styles.fullInput}
                value={newPerk.description}
                onChange={(e) => setNewPerk({ ...newPerk, description: e.target.value })}
                placeholder="What the student gets"
              />
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Icon (emoji)</label>
                <input
                  style={styles.fullInput}
                  value={newPerk.icon}
                  onChange={(e) => setNewPerk({ ...newPerk, icon: e.target.value })}
                  maxLength={2}
                />
              </div>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Unlock Level</label>
                <input
                  type="number"
                  style={styles.fullInput}
                  value={newPerk.unlockLevel}
                  min={1}
                  max={35}
                  onChange={(e) =>
                    setNewPerk({ ...newPerk, unlockLevel: parseInt(e.target.value) || 1 })
                  }
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={styles.label}>Type</label>
                <select
                  style={styles.select}
                  value={newPerk.type}
                  onChange={(e) => setNewPerk({ ...newPerk, type: e.target.value })}
                >
                  <option value="passive">Passive (always active)</option>
                  <option value="consumable">Consumable (limited uses)</option>
                </select>
              </div>
              {newPerk.type === "consumable" && (
                <div style={{ ...styles.formGroup, flex: 1 }}>
                  <label style={styles.label}>Uses / Semester</label>
                  <input
                    type="number"
                    style={styles.fullInput}
                    value={newPerk.usesPerSemester}
                    min={1}
                    max={20}
                    onChange={(e) =>
                      setNewPerk({
                        ...newPerk,
                        usesPerSemester: parseInt(e.target.value) || 1,
                      })
                    }
                  />
                </div>
              )}
            </div>

            <div style={styles.modalBtns}>
              <button style={styles.cancelBtn} onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
              <button
                style={{
                  ...styles.saveBtn,
                  ...(!newPerk.name ? styles.saveBtnDisabled : {}),
                }}
                onClick={addCustomPerk}
                disabled={!newPerk.name}
              >
                Add Perk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
