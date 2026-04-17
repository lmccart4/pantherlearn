import { useState, useMemo } from "react";
import { donateMana } from "../lib/mana.jsx";

/**
 * Two-step donation modal.
 *
 * Props:
 *   isOpen: boolean
 *   onClose: () => void
 *   courseId: string
 *   senderBalance: number
 *   classmates: Array<{ uid: string, displayName: string }>  // self already excluded
 *   onSuccess: (newSenderBalance: number, recipientName: string, amount: number) => void
 */
export default function DonationModal({ isOpen, onClose, courseId, senderBalance, classmates, onSuccess }) {
  const [step, setStep] = useState(1);
  const [recipientUid, setRecipientUid] = useState("");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const sortedClassmates = useMemo(
    () => [...(classmates || [])].sort((a, b) => (a.displayName || "").localeCompare(b.displayName || "")),
    [classmates]
  );

  const recipient = sortedClassmates.find((c) => c.uid === recipientUid) || null;
  const amountNum = parseInt(amount, 10);
  const amountValid = Number.isInteger(amountNum) && amountNum >= 1 && amountNum <= senderBalance && amountNum <= 1000;

  if (!isOpen) return null;

  const reset = () => {
    setStep(1);
    setRecipientUid("");
    setAmount("");
    setError("");
    setSubmitting(false);
  };

  const handleClose = () => {
    if (submitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const { newSenderBalance } = await donateMana(courseId, recipientUid, amountNum);
      onSuccess(newSenderBalance, recipient.displayName, amountNum);
      reset();
      onClose();
    } catch (e) {
      setError(e?.message || "Couldn't send mana. Please try again.");
      setSubmitting(false);
    }
  };

  const overlay = {
    position: "fixed", inset: 0, zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center",
    background: "rgba(0,0,0,0.65)", padding: 16,
  };
  const panel = {
    width: "100%", maxWidth: 480,
    background: "var(--surface-2)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    fontFamily: "var(--font-body)",
    color: "var(--text)",
  };
  const heading = { fontSize: 20, fontWeight: 600, color: "var(--text)", marginBottom: 4 };
  const sub = { fontSize: 13, color: "var(--text-3)", marginBottom: 16 };
  const field = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "var(--surface-3)",
    color: "var(--text)",
    fontSize: 14,
    fontFamily: "inherit",
    marginBottom: 16,
    outline: "none",
  };
  const btnRow = { display: "flex", justifyContent: "flex-end", gap: 8 };
  const btnGhost = {
    padding: "10px 16px", borderRadius: 8,
    border: "1px solid var(--border)", background: "transparent",
    color: "var(--text-2)", fontSize: 14, fontWeight: 500,
    cursor: submitting ? "not-allowed" : "pointer",
    opacity: submitting ? 0.5 : 1,
  };
  const btnPrimary = (enabled) => ({
    padding: "10px 16px", borderRadius: 8, border: "none",
    background: "var(--brand)", color: "#0a0a0f",
    fontSize: 14, fontWeight: 600,
    cursor: enabled ? "pointer" : "not-allowed",
    opacity: enabled ? 1 : 0.5,
  });
  const hint = { fontSize: 13, color: "var(--text-3)", marginBottom: 16 };
  const errBox = {
    marginBottom: 12, padding: 12, borderRadius: 8,
    border: "1px solid rgba(239,95,95,0.4)",
    background: "rgba(239,95,95,0.12)",
    color: "var(--red)", fontSize: 13,
  };

  return (
    <div style={overlay} onClick={handleClose}>
      <div style={panel} onClick={(e) => e.stopPropagation()}>
        {step === 1 && (
          <>
            <h2 style={heading}>Send mana to a classmate</h2>
            <p style={sub}>Brighten someone's day. They'll know it came from you.</p>

            <select
              style={field}
              value={recipientUid}
              onChange={(e) => setRecipientUid(e.target.value)}
            >
              <option value="">Pick a classmate…</option>
              {sortedClassmates.map((c) => (
                <option key={c.uid} value={c.uid}>{c.displayName}</option>
              ))}
            </select>

            <div style={btnRow}>
              <button style={btnGhost} onClick={handleClose}>Cancel</button>
              <button
                style={btnPrimary(!!recipientUid)}
                disabled={!recipientUid}
                onClick={() => setStep(2)}
              >
                Next →
              </button>
            </div>
          </>
        )}

        {step === 2 && recipient && (
          <>
            <h2 style={heading}>Send mana to {recipient.displayName}</h2>
            <p style={sub}>You have {senderBalance} mana available.</p>

            <input
              type="number"
              style={{ ...field, marginBottom: 8 }}
              min={1}
              max={Math.min(senderBalance, 1000)}
              step={1}
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(""); }}
              placeholder="How much?"
              disabled={submitting}
              autoFocus
            />
            {amountValid && (
              <p style={hint}>You'll have {senderBalance - amountNum} left.</p>
            )}
            {!amountValid && amount && (
              <p style={hint}>Enter a whole number between 1 and {Math.min(senderBalance, 1000)}.</p>
            )}
            {!amount && <p style={hint}>&nbsp;</p>}

            {error && <div style={errBox}>{error}</div>}

            <div style={btnRow}>
              <button
                style={btnGhost}
                onClick={() => { setStep(1); setError(""); setAmount(""); }}
                disabled={submitting}
              >
                ← Back
              </button>
              <button
                style={btnPrimary(amountValid && !submitting)}
                disabled={!amountValid || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Sending…" : `Send ${amountValid ? `${amountNum} ` : ""}mana →`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
