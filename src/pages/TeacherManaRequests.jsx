// src/pages/TeacherManaRequests.jsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import {
  markRequestFulfilled,
  markRequestAccepted,
  revertRequestToPending,
  priceQuote,
  declineQuote,
  cancelQuote,
} from "../lib/manaRequests";

// Powers that are handled automatically and should NOT surface on this page.
const HIDDEN_POWER_IDS = new Set(["3d-print-box"]);

const STAGES = [
  {
    key: "new",
    label: "New Requests",
    hint: "Price custom quotes · accept simple requests",
    color: "#f59e0b",
    bg: "#fef3c7",
  },
  {
    key: "priced",
    label: "Awaiting Student",
    hint: "Quote sent — waiting for student to accept",
    color: "#0891b2",
    bg: "#cffafe",
  },
  {
    key: "accepted",
    label: "Print Queue",
    hint: "Oldest at top — print these next",
    color: "#7c3aed",
    bg: "#ede9fe",
  },
  {
    key: "fulfilled",
    label: "Fulfilled",
    hint: "Recently completed",
    color: "#059669",
    bg: "#d1fae5",
  },
];

const ts = (v) => {
  if (!v) return 0;
  if (typeof v === "string") return new Date(v).getTime() || 0;
  if (typeof v === "number") return v;
  if (v.toMillis) return v.toMillis();
  if (v.seconds != null) return v.seconds * 1000;
  if (v instanceof Date) return v.getTime();
  return 0;
};

const toDate = (v) => {
  if (!v) return null;
  if (typeof v === "string" || typeof v === "number") {
    const d = new Date(v);
    return isNaN(d) ? null : d;
  }
  if (v.toDate) return v.toDate();
  if (v.seconds != null) return new Date(v.seconds * 1000);
  if (v instanceof Date) return v;
  return null;
};

export default function TeacherManaRequests() {
  const { userRole } = useAuth();
  const isTeacher = userRole === "teacher";
  const [params] = useSearchParams();
  const focusId = params.get("focus");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [deniedCourses, setDeniedCourses] = useState([]);
  const [quoteInputs, setQuoteInputs] = useState({});

  async function load() {
    setLoading(true);
    setLoadError("");
    const denied = [];
    try {
      const q = query(collection(db, "courses"), orderBy("order", "asc"));
      const coursesSnap = await getDocs(q);
      const all = [];
      for (const c of coursesSnap.docs) {
        const courseData = c.data();
        try {
          const snap = await getDocs(collection(db, "courses", c.id, "manaRequests"));
          snap.forEach((d) =>
            all.push({
              id: d.id,
              courseId: c.id,
              courseName: courseData.name || c.id,
              ...d.data(),
            })
          );
        } catch (err) {
          denied.push(courseData.name || c.id);
          console.warn("[ManaRequests] skip course", c.id, err?.code || err?.message);
        }
      }
      setRows(all);
      setDeniedCourses(denied);
    } catch (err) {
      setLoadError(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isTeacher) load();
  }, [isTeacher]);

  useEffect(() => {
    if (focusId) {
      const el = document.getElementById(`req-${focusId}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusId, rows]);

  if (!isTeacher) return <div style={{ padding: 32 }}>Teacher access required.</div>;
  if (loading) return <div style={{ padding: 32 }}>Loading…</div>;

  // Filter out auto-fulfilled + hidden powers (e.g. 3D print — select from box)
  const visible = rows.filter(
    (r) => !r.autoFulfilled && !HIDDEN_POWER_IDS.has(r.powerId)
  );

  const byStage = {
    new: visible.filter((r) => r.status === "pending"),
    priced: visible.filter((r) => r.status === "priced"),
    accepted: visible.filter((r) => r.status === "accepted"),
    fulfilled: visible.filter((r) => r.status === "fulfilled"),
  };

  byStage.new.sort((a, b) => ts(b.createdAt) - ts(a.createdAt));
  byStage.priced.sort((a, b) => ts(a.pricedAt || a.createdAt) - ts(b.pricedAt || b.createdAt));
  byStage.accepted.sort((a, b) => ts(a.acceptedAt || a.createdAt) - ts(b.acceptedAt || b.createdAt));
  byStage.fulfilled.sort((a, b) => ts(b.fulfilledAt) - ts(a.fulfilledAt));

  async function run(fn, row) {
    setBusyId(row.id);
    try {
      await fn();
      await load();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setBusyId(null);
    }
  }

  const accept = (row) => run(() => markRequestAccepted(row.courseId, row.id), row);
  const fulfill = (row) => run(() => markRequestFulfilled(row.courseId, row.id), row);
  const revert = (row) => run(() => revertRequestToPending(row.courseId, row.id), row);
  const sendQuote = (row) => {
    const price = parseInt(quoteInputs[row.id], 10);
    if (!price || price <= 0) {
      alert("Enter a valid mana price");
      return;
    }
    run(async () => {
      await priceQuote(row.courseId, row.id, price);
      setQuoteInputs((s) => ({ ...s, [row.id]: "" }));
    }, row);
  };
  const decline = (row) => run(() => declineQuote(row.courseId, row.id), row);
  const retractQuote = (row) => run(() => cancelQuote(row.courseId, row.id), row);

  return (
    <div style={{ padding: 24, maxWidth: 1600, margin: "0 auto" }}>
      <h1 style={{ margin: "0 0 6px" }}>Mana Redemption Requests</h1>
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 18 }}>
        Workflow: <b>New Request</b> → (quote → <b>Awaiting Student</b> →) <b>Print Queue</b> → <b>Fulfilled</b>
      </div>

      {loadError && (
        <div style={errorBox}>Couldn't load: {loadError}</div>
      )}
      {deniedCourses.length > 0 && (
        <div style={warnBox}>Skipped {deniedCourses.length} course(s): {deniedCourses.join(", ")}</div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14 }}>
        {STAGES.map((stage) => {
          const list = byStage[stage.key];
          return (
            <div key={stage.key} style={columnStyle}>
              <div style={{ ...columnHeader, background: stage.bg, borderRadius: "12px 12px 0 0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <div style={{ fontWeight: 700, color: stage.color }}>{stage.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: stage.color }}>{list.length}</div>
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{stage.hint}</div>
              </div>
              <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                {list.length === 0 ? (
                  <div style={{ padding: 24, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>—</div>
                ) : (
                  list.map((row, idx) => (
                    <Card
                      key={row.id}
                      row={row}
                      stage={stage.key}
                      highlight={focusId === row.id}
                      printIndex={stage.key === "accepted" ? idx + 1 : null}
                      busy={busyId === row.id}
                      quoteInput={quoteInputs[row.id] || ""}
                      setQuoteInput={(v) => setQuoteInputs((s) => ({ ...s, [row.id]: v }))}
                      onAccept={() => accept(row)}
                      onFulfill={() => fulfill(row)}
                      onRevert={() => revert(row)}
                      onSendQuote={() => sendQuote(row)}
                      onDecline={() => decline(row)}
                      onRetractQuote={() => retractQuote(row)}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Card({
  row, stage, highlight, printIndex, busy,
  quoteInput, setQuoteInput,
  onAccept, onFulfill, onRevert, onSendQuote, onDecline, onRetractQuote,
}) {
  const isQuote = row.type === "quote";
  const created = toDate(row.createdAt);
  const priced = toDate(row.pricedAt);
  const accepted = toDate(row.acceptedAt);
  const fulfilled = toDate(row.fulfilledAt);
  const fmt = (d) =>
    d ? d.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "—";

  // Title + student description for quote types
  const title = row.powerName || (isQuote ? "Custom 3D Print" : "Request");

  return (
    <div
      id={`req-${row.id}`}
      style={{
        padding: 12,
        borderRadius: 8,
        border: highlight ? "2px solid #7c3aed" : "1px solid #e2e8f0",
        background: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
        <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 14, lineHeight: 1.3 }}>
          {printIndex && (
            <span style={printBadge} title="Print order">{printIndex}</span>
          )}
          {isQuote && <span style={quoteTag}>QUOTE</span>}
          {title}
        </div>
      </div>

      <div style={{ fontSize: 12, color: "#64748b", marginTop: 3 }}>
        {row.studentName} · {row.courseName}
        {row.cost > 0 && <> · {row.cost} ✦</>}
        {row.quotedCost > 0 && <> · quoted {row.quotedCost} ✦</>}
      </div>

      {(row.description || row.details) && (
        <div style={{ fontSize: 12, color: "#0f172a", marginTop: 6, padding: "6px 8px", background: "#f1f5f9", borderRadius: 6, lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
          {row.description || row.details}
        </div>
      )}
      {row.modelUrl && (
        <div style={{ marginTop: 6 }}>
          <a
            href={row.modelUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 4,
              fontSize: 11, fontWeight: 600, color: "#0891b2",
              padding: "3px 8px", borderRadius: 4,
              background: "#ecfeff", border: "1px solid #a5f3fc",
              textDecoration: "none", wordBreak: "break-all",
            }}
          >
            🔗 View model
          </a>
        </div>
      )}

      <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 8, lineHeight: 1.5 }}>
        <div>Requested: {fmt(created)}</div>
        {priced && <div>Quoted: {fmt(priced)}</div>}
        {accepted && <div>Accepted: {fmt(accepted)}</div>}
        {fulfilled && <div>Fulfilled: {fmt(fulfilled)}</div>}
      </div>

      {/* NEW — pending */}
      {stage === "new" && isQuote && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input
              type="number"
              min={1}
              placeholder="Price"
              value={quoteInput}
              onChange={(e) => setQuoteInput(e.target.value)}
              style={priceInput}
            />
            <span style={{ fontSize: 11, color: "#64748b" }}>✦</span>
            <button onClick={onSendQuote} disabled={busy || !quoteInput} style={btn("#0891b2", busy)}>
              Send Quote
            </button>
          </div>
          <button onClick={onDecline} disabled={busy} style={btn("#ef4444", busy, "ghost")}>
            Decline request
          </button>
        </div>
      )}
      {stage === "new" && !isQuote && (
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <button onClick={onAccept} disabled={busy} style={btn("#7c3aed", busy)} title="Move to Print Queue">
            Accept → Print Queue
          </button>
          <button onClick={onFulfill} disabled={busy} style={btn("#059669", busy, "ghost")} title="Skip print queue; mark complete">
            Fulfill
          </button>
        </div>
      )}

      {/* PRICED — waiting on student */}
      {stage === "priced" && (
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <div style={{ flex: 1, fontSize: 11, color: "#0891b2", fontWeight: 600, alignSelf: "center" }}>
            Quote sent · awaiting student
          </div>
          <button onClick={onRetractQuote} disabled={busy} style={btn("#64748b", busy, "ghost")}>
            Retract
          </button>
        </div>
      )}

      {/* ACCEPTED — print queue */}
      {stage === "accepted" && (
        <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
          <button onClick={onFulfill} disabled={busy} style={btn("#059669", busy)}>
            Printed / Fulfilled
          </button>
          <button onClick={onRevert} disabled={busy} style={btn("#64748b", busy, "ghost")} title="Move back to New Requests">
            Undo
          </button>
        </div>
      )}
    </div>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────
const columnStyle = {
  background: "#f8fafc",
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  minHeight: 300,
  display: "flex",
  flexDirection: "column",
};
const columnHeader = {
  padding: "12px 14px",
  borderBottom: "1px solid #e2e8f0",
};
const errorBox = { padding: 12, marginBottom: 14, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, fontSize: 13, color: "#991b1b" };
const warnBox = { padding: 10, marginBottom: 14, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, fontSize: 12, color: "#92400e" };
const printBadge = {
  display: "inline-block",
  minWidth: 22, height: 22, lineHeight: "22px", textAlign: "center",
  background: "#7c3aed", color: "#fff",
  borderRadius: 11, fontSize: 11, fontWeight: 700, marginRight: 6,
};
const quoteTag = {
  display: "inline-block",
  background: "#0891b2", color: "#fff",
  padding: "1px 6px", borderRadius: 4,
  fontSize: 9, fontWeight: 700, marginRight: 6, verticalAlign: "middle",
};
const priceInput = {
  width: 70, padding: "5px 8px",
  borderRadius: 6, border: "1px solid #cbd5e1",
  fontSize: 12, textAlign: "center",
};

function btn(color, busy, variant) {
  const ghost = variant === "ghost";
  return {
    padding: "6px 10px",
    borderRadius: 6,
    background: busy ? "#cbd5e1" : ghost ? "#fff" : color,
    color: busy ? "#fff" : ghost ? color : "#fff",
    border: ghost ? `1px solid ${color}` : "none",
    fontWeight: 600,
    fontSize: 12,
    cursor: busy ? "default" : "pointer",
    flex: 1,
  };
}
