# PantherLearn Mana Donations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let any pantherlearn student send any portion of their mana balance to any classmate in the same enrollment section, via a "Send mana" button on the Mana page.

**Architecture:** Server-mediated atomic transaction. A new callable Cloud Function (`donateMana`) runs the Firestore transaction with admin SDK so balances and ledger entries always update atomically and a push notification is created in the same transaction. The client adds a thin wrapper in `src/lib/mana.jsx` and a two-step modal mounted on the existing `ManaPool` page.

**Tech Stack:** Firebase Cloud Functions v2 (callable, `onCall`), Firebase Admin SDK, React (existing JSX setup), Tailwind, Firestore transactions.

**Spec:** `docs/superpowers/specs/2026-04-16-pantherlearn-mana-donations-design.md` (commit `170eb3c`).

---

## Spec deviation flagged upfront

The spec proposed locking down `studentMana` writes with `allow write: if false` so only the Cloud Function service account can write. That is **NOT possible in this iteration** because two existing client-side flows write to `studentMana`:

- `src/pages/ManaManager.jsx:389,418` — teachers awarding mana via `awardStudentMana(...)`
- `src/pages/StudentMana.jsx:566,577` — STUDENTS awarding mana to other students via the Mage system, plus self-bonus on Mage completion
- (`src/lib/mana.jsx:360 awardStudentMana` and `:461 deductStudentMana` are the helpers — both invoked client-side from the above)

Locking down would break the Mage system. Routing all those writers through Cloud Functions is a separate, larger project. **For this plan, donations go through the Cloud Function for atomic-transaction safety + audit trail + push notification, but the existing rule (`allow write: if hasCourseAccess(courseId)`) stays in place.** A future security pass can tighten the rules across all writers together.

This deviation is recorded in Task 1.

## Verification stack

Pantherlearn has no test framework. Verification is:
1. `npm run build` after each client change (catches type/JSX errors)
2. Cloud Function smoke test via `firebase functions:shell` or test invocation post-deploy
3. Manual happy-path + failure-path drives in the UI as qa-student
4. `/deploy-verify pantherlearn "..."` final gate (Link + Pixel)

## File inventory

**New:**
- `src/components/DonationModal.jsx` — two-step modal (recipient picker → amount + confirm)

**Modified:**
- `docs/superpowers/specs/2026-04-16-pantherlearn-mana-donations-design.md` — note the rule-lockdown deviation
- `functions/index.js` — append `exports.donateMana = onCall(...)` callable function (~120 lines)
- `src/lib/mana.jsx` — add `donateMana(courseId, recipientUid, amount)` client wrapper (~15 lines)
- `src/components/ManaPool.jsx` — add "Send mana" button + DonationModal mount (~20 lines)

No new collections. No firestore.rules changes. No schema changes.

---

## Task 1 — Update spec to record rule-lockdown deviation

Goal: keep the spec honest about what we're actually building. The rule-lockdown approach in the spec was based on an assumption (no existing client writers to `studentMana`) that turned out to be wrong.

**Files:**
- Modify: `docs/superpowers/specs/2026-04-16-pantherlearn-mana-donations-design.md`

- [ ] **Step 1:** In `docs/superpowers/specs/2026-04-16-pantherlearn-mana-donations-design.md`, find the **"Firestore security rules"** section. Replace its entire body with:

```markdown
## Firestore security rules

**No rule changes in this iteration.** The original spec proposed locking down `studentMana` writes to Cloud-Function-only with `allow write: if false`, but that would break two existing legitimate client-side writers:

- `src/pages/ManaManager.jsx` — teachers awarding mana via `awardStudentMana(...)`
- `src/pages/StudentMana.jsx` — students awarding mana to other students via the Mage system, plus self-bonus on Mage completion

Donations still go through the Cloud Function for atomic-transaction safety, audit trail, and push notification dispatch. The existing rule (`allow write: if hasCourseAccess(courseId)`) stays in place. A future security pass can tighten all writers together — out of scope for donations.
```

- [ ] **Step 2:** Find the **"Rollback"** section and remove the third item (`3. Firestore rules revert: ...`). Renumber the remaining items 1-2.

- [ ] **Step 3:** Find the **"Architecture"** section. In bullet 2, change `**Firestore security rules** — deny all client writes to ...` to:

```markdown
2. **Firestore security rules** — unchanged in this iteration (existing rule allows writes from any user with course access). See Firestore security rules section for context. The Cloud Function provides the atomic-transaction safety and notification dispatch that the rule lockdown would have provided; the rule lockdown is deferred to a future security pass.
```

- [ ] **Step 4:** Commit:

```bash
cd ~/pantherlearn && git add docs/superpowers/specs/2026-04-16-pantherlearn-mana-donations-design.md && git commit -m "Spec: defer studentMana rule lockdown — existing client writers (Mage system, teacher awards) require separate migration"
```

---

## Task 2 — Add `donateMana` callable Cloud Function

**Files:**
- Modify: `functions/index.js` (append a new `exports.donateMana` block at the end of the file, before the file's final closing `);` if any, but typically just appended)

- [ ] **Step 1:** Append this block to the end of `functions/index.js`:

```js
// ─────────────────────────────────────────────────────────────────
// donateMana — student-to-student mana donation
// Atomic transaction: deduct sender, credit recipient, append both
// ledger entries, create recipient notification (existing FCM trigger
// handles delivery). All in one transaction; either all succeed or none.
// ─────────────────────────────────────────────────────────────────
exports.donateMana = onCall(
  { region: "us-central1", maxInstances: 10 },
  async (request) => {
    // Auth check
    const senderUid = request.auth?.uid;
    if (!senderUid) {
      throw new HttpsError("unauthenticated", "You must be signed in to donate mana.");
    }

    // Input shape
    const { courseId, recipientUid, amount } = request.data || {};
    if (typeof courseId !== "string" || !courseId) {
      throw new HttpsError("invalid-argument", "courseId is required.");
    }
    if (typeof recipientUid !== "string" || !recipientUid) {
      throw new HttpsError("invalid-argument", "recipientUid is required.");
    }
    if (!Number.isInteger(amount) || amount < 1 || amount > 1000) {
      throw new HttpsError("invalid-argument", "Donation amount must be a whole number between 1 and 1000.");
    }
    if (recipientUid === senderUid) {
      throw new HttpsError("invalid-argument", "You can't donate mana to yourself.");
    }

    // Verify both sender and recipient are enrolled in the same course
    const enrollSnap = await db.collection("enrollments")
      .where("courseId", "==", courseId)
      .get();
    const enrolledUids = new Set(enrollSnap.docs.map((d) => d.data().userId));
    if (!enrolledUids.has(senderUid)) {
      throw new HttpsError("failed-precondition", "You're not enrolled in this section.");
    }
    if (!enrolledUids.has(recipientUid)) {
      throw new HttpsError("failed-precondition", "That classmate is no longer in this section.");
    }

    // Read participant display names for the ledger entries + notification copy
    const [senderUserSnap, recipientUserSnap] = await Promise.all([
      db.collection("users").doc(senderUid).get(),
      db.collection("users").doc(recipientUid).get(),
    ]);
    const senderName = senderUserSnap.exists ? (senderUserSnap.data().displayName || "Someone") : "Someone";
    const recipientName = recipientUserSnap.exists ? (recipientUserSnap.data().displayName || "a classmate") : "a classmate";

    const senderManaRef = db.doc(`courses/${courseId}/studentMana/${senderUid}`);
    const recipientManaRef = db.doc(`courses/${courseId}/studentMana/${recipientUid}`);
    const senderTxRef = db.collection(`courses/${courseId}/studentMana/${senderUid}/transactions`).doc();
    const recipientTxRef = db.collection(`courses/${courseId}/studentMana/${recipientUid}/transactions`).doc();
    const notificationRef = db.collection(`users/${recipientUid}/notifications`).doc();

    let newSenderBalance;

    await db.runTransaction(async (tx) => {
      const senderManaSnap = await tx.get(senderManaRef);
      const recipientManaSnap = await tx.get(recipientManaRef);

      const senderBalance = senderManaSnap.exists ? (senderManaSnap.data().balance || 0) : 0;
      const recipientBalance = recipientManaSnap.exists ? (recipientManaSnap.data().balance || 0) : 0;

      if (senderBalance < amount) {
        throw new HttpsError("failed-precondition", `Your balance is now ${senderBalance}. Try again with a smaller amount.`);
      }

      newSenderBalance = senderBalance - amount;
      const newRecipientBalance = recipientBalance + amount;
      const ts = admin.firestore.FieldValue.serverTimestamp();

      // Bounded history array — match the existing 50-entry cap used elsewhere in mana.jsx
      const senderHistoryEntry = {
        type: "donation_sent",
        amount: -amount,
        recipientUid,
        recipientName,
        ts: new Date(),
      };
      const recipientHistoryEntry = {
        type: "donation_received",
        amount: +amount,
        senderUid,
        senderName,
        ts: new Date(),
      };

      const senderExisting = senderManaSnap.exists ? (senderManaSnap.data().history || []) : [];
      const recipientExisting = recipientManaSnap.exists ? (recipientManaSnap.data().history || []) : [];
      const HISTORY_CAP = 50;

      tx.set(senderManaRef, {
        balance: newSenderBalance,
        history: [senderHistoryEntry, ...senderExisting].slice(0, HISTORY_CAP),
        lastUpdated: ts,
      }, { merge: true });

      tx.set(recipientManaRef, {
        balance: newRecipientBalance,
        history: [recipientHistoryEntry, ...recipientExisting].slice(0, HISTORY_CAP),
        lastUpdated: ts,
      }, { merge: true });

      // Append-only authoritative ledger entries
      tx.set(senderTxRef, {
        type: "donation_sent",
        amount: -amount,
        recipientUid,
        recipientName,
        balanceAfter: newSenderBalance,
        ts,
      });
      tx.set(recipientTxRef, {
        type: "donation_received",
        amount: +amount,
        senderUid,
        senderName,
        balanceAfter: newRecipientBalance,
        ts,
      });

      // Recipient push notification — existing sendPushNotification trigger sends FCM
      tx.set(notificationRef, {
        title: "You got mana ✨",
        body: `${senderName} sent you ${amount} mana`,
        icon: "✨",
        link: "/mana",
        type: "donation",
        ts,
      });
    });

    console.log(`donateMana: ${senderUid} → ${recipientUid}, amount=${amount}, course=${courseId}, newSenderBalance=${newSenderBalance}`);
    return { success: true, newSenderBalance };
  }
);
```

- [ ] **Step 2:** Verify the file still parses cleanly:

```bash
cd ~/pantherlearn/functions && node --check index.js
```

Expected: silent success (no syntax errors).

- [ ] **Step 3:** Confirm `onCall` and `HttpsError` are imported at the top of `functions/index.js`. They should be — the file's first line is:

```js
const { onRequest, onCall, HttpsError } = require("firebase-functions/v2/https");
```

If for some reason `onCall`/`HttpsError` aren't in the destructure, add them.

- [ ] **Step 4:** Commit:

```bash
cd ~/pantherlearn && git add functions/index.js && git commit -m "Add donateMana callable: atomic student-to-student mana transfer with ledger + notification"
```

---

## Task 3 — Deploy the Cloud Function

**Files:**
- (None — deploy only)

- [ ] **Step 1:** Deploy just the new function:

```bash
cd ~/pantherlearn && firebase deploy --only functions:donateMana 2>&1 | tail -20
```

Expected output ending with `✔  functions[donateMana(us-central1)] Successful create operation.` (or `update` if redeploying).

If it fails:
- Build/parse error → fix in `functions/index.js`, re-deploy
- Permission error → check `firebase login` is current and the project is `pantherlearn-d6f7c`
- Quota / region error → check the firebase.json functions config matches `us-central1`

- [ ] **Step 2:** Smoke-confirm the function is callable via Firebase console or by listing functions:

```bash
cd ~/pantherlearn && firebase functions:list 2>&1 | grep donateMana
```

Expected: a row showing `donateMana` as `https`/`v2`/`us-central1`.

- [ ] **Step 3:** No commit needed for this task (it's a deploy, no code changes).

---

## Task 4 — Add client wrapper to `src/lib/mana.jsx`

**Files:**
- Modify: `src/lib/mana.jsx` (append a new export at the end)

- [ ] **Step 1:** Open `src/lib/mana.jsx`. Confirm `httpsCallable` and `getFunctions` are already imported (the existing image-gen flow uses them — search the file for `httpsCallable` to confirm the import). If they are NOT yet imported in this file, add at the top:

```js
import { getFunctions, httpsCallable } from "firebase/functions";
```

- [ ] **Step 2:** Append this export to the end of `src/lib/mana.jsx`:

```js
// ─── Donation: student-to-student mana transfer ───
// Calls the donateMana Cloud Function. Returns { success, newSenderBalance }
// on success, or throws an Error with the human-readable message from the
// function's HttpsError (FirebaseError.message preserves it).
export async function donateMana(courseId, recipientUid, amount) {
  const fn = httpsCallable(getFunctions(), "donateMana");
  const result = await fn({ courseId, recipientUid, amount });
  return result.data;
}
```

- [ ] **Step 3:** Verify the build still parses:

```bash
cd ~/pantherlearn && npm run build 2>&1 | tail -10
```

Expected: build succeeds. If `httpsCallable`/`getFunctions` import fails, check what other files in the codebase do (e.g., `src/components/blocks/ImageGenBlock.jsx`) and match that pattern.

- [ ] **Step 4:** Commit:

```bash
cd ~/pantherlearn && git add src/lib/mana.jsx && git commit -m "mana.jsx: add donateMana client wrapper around the callable function"
```

---

## Task 5 — Build `<DonationModal />` component

**Files:**
- Create: `src/components/DonationModal.jsx`

- [ ] **Step 1:** Create `src/components/DonationModal.jsx`:

```jsx
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
        className="w-full max-w-md rounded-xl bg-[var(--surface1)] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 1 && (
          <>
            <h2 className="mb-1 text-xl font-semibold text-[var(--text1)]">Send mana to a classmate</h2>
            <p className="mb-4 text-sm text-[var(--text3)]">Brighten someone's day. They'll know it came from you.</p>

            <select
              className="mb-4 w-full rounded-md border border-[var(--border)] bg-[var(--surface2)] p-2 text-[var(--text1)]"
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
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm text-[var(--text2)] hover:bg-[var(--surface2)]"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
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
            <h2 className="mb-1 text-xl font-semibold text-[var(--text1)]">Send mana to {recipient.displayName}</h2>
            <p className="mb-4 text-sm text-[var(--text3)]">You have {senderBalance} mana available.</p>

            <input
              type="number"
              className="mb-2 w-full rounded-md border border-[var(--border)] bg-[var(--surface2)] p-2 text-[var(--text1)]"
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
              <div className="mb-3 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                className="rounded-md border border-[var(--border)] px-4 py-2 text-sm text-[var(--text2)] hover:bg-[var(--surface2)] disabled:opacity-50"
                onClick={() => { setStep(1); setError(""); }}
                disabled={submitting}
              >
                ← Back
              </button>
              <button
                className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
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
```

Notes on assumptions to verify on first build:
- CSS variables `--surface1`, `--surface2`, `--text1`, `--text2`, `--text3`, `--border`, `--accent` should already exist in pantherlearn's theme. If `--accent` doesn't resolve to red, swap to whatever the site's primary CTA uses (e.g., `bg-red-500` or a project-specific class).
- Modal pattern (fixed inset, z-50, click-outside-to-close) — match other modals in the codebase if they have a different convention. If there's an existing reusable `<Modal>` shell, switch to it.

- [ ] **Step 2:** Type-check + build:

```bash
cd ~/pantherlearn && npm run build 2>&1 | tail -10
```

Expected: build succeeds.

- [ ] **Step 3:** Commit:

```bash
cd ~/pantherlearn && git add src/components/DonationModal.jsx && git commit -m "Add DonationModal: two-step picker → amount + confirm flow"
```

---

## Task 6 — Wire button + modal into `ManaPool.jsx`

Goal: add a "Send mana" button to the student's own balance section of `ManaPool.jsx` and mount `<DonationModal />` controlled by local state.

**Files:**
- Modify: `src/components/ManaPool.jsx`

- [ ] **Step 1:** Read `src/components/ManaPool.jsx` to find:
   - Where the **student's own balance** is displayed (the section a student lands on first)
   - How `courseId` and the student's `uid` are available to this component (props vs context vs Firebase auth)
   - Whether `getStudentManaForClass(courseId)` is already loaded into state (to provide the classmates list)

If the classmates list isn't already loaded in `ManaPool.jsx`, you'll need to load it. Use `getStudentManaForClass` from `src/lib/mana.jsx`. The result is `{ [uid]: { balance, ... } }`. To get classmate display names, also load enrolled users (the existing patterns in `ManaPool.jsx` for loading classmates should be followed — check what's already there).

- [ ] **Step 2:** At the top of `src/components/ManaPool.jsx`, add to the imports:

```jsx
import { useState } from "react";
import DonationModal from "./DonationModal.jsx";
```

(If `useState` is already imported, just add `DonationModal`.)

- [ ] **Step 3:** Inside the `ManaPool` component body, near the top with other state declarations, add:

```jsx
const [donationOpen, setDonationOpen] = useState(false);
```

- [ ] **Step 4:** In the JSX, near the student's own balance display (e.g., next to or below the balance number), add the button:

```jsx
<button
  onClick={() => setDonationOpen(true)}
  disabled={(myBalance ?? 0) === 0}
  title={(myBalance ?? 0) === 0 ? "You need mana to donate" : ""}
  className="rounded-md bg-[var(--accent)] px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
>
  Send mana
</button>
```

Replace `myBalance` with whatever the existing variable is for the student's own balance value (look at how the page renders the balance number).

- [ ] **Step 5:** At the bottom of the JSX (before the closing tag of the outermost element), mount the modal:

```jsx
<DonationModal
  isOpen={donationOpen}
  onClose={() => setDonationOpen(false)}
  courseId={courseId}
  senderBalance={myBalance ?? 0}
  classmates={classmateList /* see Step 6 */}
  onSuccess={(newBalance, recipientName, amount) => {
    setMyBalance(newBalance); /* or however the local balance state updates */
    /* show toast: "Sent {amount} mana to {recipientName} ✨" — use existing toast helper if any */
  }}
/>
```

- [ ] **Step 6:** Build the `classmateList` array from existing data on the page. It must be:
   - Sourced from the same `getStudentManaForClass(courseId)` call (or equivalent enrollment list) that the page already uses
   - Filtered to **exclude the current user's uid**
   - Shape: `[{ uid: string, displayName: string }, ...]`

If display names aren't already in the loaded data, look at how the existing UI shows classmate names in `ManaPool.jsx` and reuse that path. There's typically a `users` collection lookup somewhere on the page; piggyback on it.

- [ ] **Step 7:** Toast on success — if `ManaPool.jsx` already has a toast helper, use it. If not, a quick one-line approach: use a local `toastMessage` state + a `<div>` rendered when set + a `setTimeout` to clear after 3s. Don't introduce a new toast library.

- [ ] **Step 8:** Build:

```bash
cd ~/pantherlearn && npm run build 2>&1 | tail -10
```

Expected: build succeeds.

- [ ] **Step 9:** Commit:

```bash
cd ~/pantherlearn && git add src/components/ManaPool.jsx && git commit -m "ManaPool: add Send mana button + DonationModal mount"
```

---

## Task 7 — Deploy hosting

- [ ] **Step 1:** Deploy:

```bash
cd ~/pantherlearn && npm run build && firebase deploy --only hosting 2>&1 | tail -10
```

Expected: `✔ Deploy complete!`. The Cloud Function deployed in Task 3 is already live; this just ships the UI.

- [ ] **Step 2:** No commit needed for the deploy step.

---

## Task 8 — `/deploy-verify` (Link + Pixel)

Goal: end-to-end verify the full donation flow: button visible, modal renders, picker excludes self, amount validation works, Cloud Function transaction lands, both ledger entries written, push notification doc created.

- [ ] **Step 1:** Run:

```
/deploy-verify pantherlearn "Mana donations: new Send mana button on the Mana page opens a two-step modal (recipient picker → amount + confirm) that calls the donateMana Cloud Function. Atomic Firestore transaction writes sender + recipient balances and ledger entries, plus a notification doc that triggers FCM push. Existing client writers to studentMana (Mage system, teacher awards) untouched — this iteration does NOT lock down the rules."
```

- [ ] **Step 2:** Expected outcomes:
   - **Link:** verifies the Cloud Function `donateMana` is deployed and callable, the modal triggers a real Firestore transaction (test using qa-student → another test student in same section), both `studentMana` docs update with correct balances, both `transactions/{autoId}` ledger docs exist, the recipient's `notifications/{autoId}` doc was created, the existing FCM trigger fired (check `sendPushNotification` logs).
   - **Pixel:** captures the Mana page with the new "Send mana" button at 375/768/1280, the modal Step 1 (recipient picker), the modal Step 2 (amount input + confirm), and the success toast / closed modal post-donation.

- [ ] **Step 3:** Address any 🔴 blockers Link or Pixel surface. Re-deploy if needed.

---

## Spec coverage checklist

| Spec section | Requirement | Task |
|---|---|---|
| Goals | Send any portion of balance to any classmate same section | Tasks 2, 5, 6 |
| Goals | Sender always named on receipt | Task 2 (notification body + ledger entries include senderName) |
| Goals | Atomic transaction | Task 2 (`db.runTransaction`) |
| Architecture §1 | Cloud Function `donateMana({courseId, recipientUid, amount})` | Task 2 |
| Architecture §2 | Firestore rules — DEVIATION (deferred) | Task 1 (spec correction) |
| Architecture §3 | Client UI — button + 2-step modal on Mana page | Tasks 5, 6 |
| Data model | Reuse `studentMana/{uid}` + `transactions` subcollection, two new transaction types | Task 2 |
| Cloud Function validation | All 4 validation steps in spec order | Task 2 |
| Cloud Function: sender push notification | Notification doc creation in transaction | Task 2 |
| UI — Send button | Disabled at balance=0, on Mana page | Task 6 |
| UI — Step 1 picker | Alphabetical, no balances, self excluded | Task 5 |
| UI — Step 2 amount | Min/max, live preview, send button | Task 5 |
| UI — Success toast + push | Toast + push | Tasks 6 (toast) + 2 (push) |
| UI — Failure error | Modal stays open with server error | Task 5 |
| Edge cases | All listed cases handled | Task 2 (validation + transaction handles them) |
| Testing | Build + Cloud Function deploy + manual + /deploy-verify | Tasks 7, 8 |
| Rollback | Single-commit reverts | Implicit in small focused commits |

All spec requirements covered, no placeholders, no TODOs.

---

## Execution notes

Tasks 1-2 are independent, no order dependency between spec edit and Cloud Function code. Tasks 3-8 have strict ordering (deploy → wrapper → modal → wire → deploy → verify).

Estimated implementation time: 60-90 minutes total in a session, longer if subagent-driven with between-task reviews.
