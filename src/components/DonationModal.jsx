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
    () => [...classmates].sort((a, b) => (a.displayName || "").localeCompare(b.displayName || "")),
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
      // FirebaseError from a callable preserves the HttpsError.message
      setError(e?.message || "Couldn't send mana. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-[var(--surface2)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 1 && (
          <>
            <h2 className="mb-1 text-xl font-semibold text-[var(--text)]">Send mana to a classmate</h2>
            <p className="mb-4 text-sm text-[var(--text3)]">Brighten someone's day. They'll know it came from you.</p>

            <select
              className="mb-4 w-full rounded-md border border-[var(--border)] bg-[var(--surface3)] p-2 text-[var(--text)]"
              value={recipientUid}
              onChange={(e) => setRecipientUid(e.target.value)}
            >
              <option value="">Pick a classmate…</option>
              {sortedClassmates.map((c) => (
                <option key={c.uid} value={c.uid}>{c.displayName}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm text-[var(--text2)] hover:bg-[var(--surface3)]"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[#0a0a0f] disabled:opacity-50"
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
            <h2 className="mb-1 text-xl font-semibold text-[var(--text)]">Send mana to {recipient.displayName}</h2>
            <p className="mb-4 text-sm text-[var(--text3)]">You have {senderBalance} mana available.</p>

            <input
              type="number"
              className="mb-2 w-full rounded-md border border-[var(--border)] bg-[var(--surface3)] p-2 text-[var(--text)]"
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
              <p className="mb-4 text-sm text-[var(--text3)]">You'll have {senderBalance - amountNum} left.</p>
            )}
            {!amountValid && amount && (
              <p className="mb-4 text-sm text-[var(--text3)]">Enter a whole number between 1 and {Math.min(senderBalance, 1000)}.</p>
            )}
            {!amount && <p className="mb-4 text-sm text-[var(--text3)]">&nbsp;</p>}

            {error && (
              <div className="mb-3 rounded-md border border-[var(--red)]/40 bg-[var(--red-dim)] p-3 text-sm text-[var(--red)]">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm text-[var(--text2)] hover:bg-[var(--surface3)] disabled:opacity-50"
                onClick={() => { setStep(1); setError(""); }}
                disabled={submitting}
              >
                ← Back
              </button>
              <button
                className="rounded-md bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[#0a0a0f] disabled:opacity-50"
                disabled={!amountValid || submitting}
                onClick={handleSubmit}
              >
                {submitting ? "Sending…" : `Send ${amountValid ? amountNum : ""} mana →`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
