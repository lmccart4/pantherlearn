# Spec — PantherLearn Student-to-Student Mana Donations

**Date:** 2026-04-16
**Author:** Lachlan (in brainstorming session with Luke)
**Status:** Design approved, ready for implementation plan

## Problem

Students earn mana through completed work, positive behavior, and grade bonuses, but the per-student balance is purely a personal economic resource — they spend it on individual perks via the existing flow. There's no social mechanic for one student to give mana to another. Luke wants a generosity prompt: a friction-light way for a student to brighten a classmate's day by sending them some mana.

## Goals

- Let any student send any portion of their balance to any classmate in the same section
- Make the social ritual the point — sender is always named on the receipt
- Preserve the integrity of the existing balance + transaction-log system: every donation is two atomic ledger entries, no balance can go negative, no concurrent-write drift
- Stay aligned with the existing Mana page UI; no new top-level surface

## Non-goals (explicit out-of-scope)

- Anonymous donations (every donation names the sender)
- Cooldown / rate-limit between donations (none — matches the "no daily cap" decision)
- Per-day total cap on giving (none)
- Recipient cap collision logic (donations bypass `MANA_CAP = 100` — recipients can hold above-cap balances via gifts)
- Recipient ability to refuse a donation (out of scope; mana goes through immediately)
- Cross-section donations (only same-section classmates)
- Teacher-side dedicated "all donations" dashboard view (the existing transaction-log surface in ManaManager picks up the new entries automatically; a custom view is a follow-up if Luke wants it)
- Pool decay retirement (separate small cleanup; not part of this spec)
- Decay applied to inflated above-cap balances (decay is pool-only and unaffected by per-student donations)

## Architecture

Three layers:

1. **Cloud Function** `donateMana({courseId, recipientUid, amount})` — callable function added to `functions/index.js` (where the existing Cloud Functions live, e.g., the image-gen function). Performs the Firestore transaction server-side using admin SDK. Validates: sender is authenticated, recipient is in the same enrollment section, sender's balance ≥ amount, sender ≠ recipient. Writes both ledger entries atomically.
2. **Firestore security rules** — deny all client writes to `courses/{courseId}/studentMana/{uid}` and `courses/{courseId}/studentMana/{uid}/transactions/{id}`. The Cloud Function service account is the only writer. Reads remain open to enrolled students for their own doc and to teachers for any doc in their courses (matches existing rules).
3. **Client UI** — a "Send mana" button on the existing Mana page (`src/components/ManaPool.jsx`) that opens a two-step modal (recipient picker → amount + confirm). On confirm, calls the Cloud Function via `httpsCallable` (same pattern as `src/components/blocks/ImageGenBlock.jsx`). On success, optimistically updates the local balance and closes the modal with a toast. On failure, displays the server error and stays open.

## Data model

No new collections. Reuses:

- **`courses/{courseId}/studentMana/{uid}`** — has `balance: number` and a bounded `history: array` (capped, the most recent N entries). Donation transaction adds:
  - For sender: `balance -= amount`, prepend to history `{type: "donation_sent", amount, recipientUid, recipientName, ts}`
  - For recipient: `balance += amount`, prepend to history `{type: "donation_received", amount, senderUid, senderName, ts}`
- **`courses/{courseId}/studentMana/{uid}/transactions/{autoId}`** — append-only authoritative log. Donation transaction adds two new docs (one per participant) with the same shape as above. The history array is the bounded display surface; the subcollection is the unbounded source of truth.

New transaction types: `donation_sent`, `donation_received`. Existing types (`grade_bonus`, `behavior`, `mage_award`, etc.) keep their semantics.

## Cloud Function: `donateMana`

**Signature:** `donateMana({ courseId: string, recipientUid: string, amount: number }) → { success: boolean, newSenderBalance: number, error?: string }`

**Auth:** requires `context.auth.uid` (sender). Rejects if missing.

**Validation (in order):**
1. `amount` is a positive integer, `1 <= amount <= 1000` (sanity ceiling — no realistic donation exceeds 1000 mana)
2. `recipientUid !== context.auth.uid` (no self-donate)
3. Both sender and recipient have an `enrollments/{eid}` doc with `courseId == courseId` and `userId` matching
4. Sender's `studentMana/{senderUid}` exists and `balance >= amount`

**Atomic transaction:** Single Firestore transaction reads sender + recipient `studentMana` docs, decrements/increments, prepends to bounded `history` arrays (slicing to the same cap the existing code uses), and creates the two new `transactions/{autoId}` docs. All-or-nothing.

**On success:** Returns `{ success: true, newSenderBalance }`. Also sends a push notification to the recipient via the existing `usePushNotifications` infrastructure (the Cloud Function calls the same notification helper used elsewhere).

**On failure:** Returns `{ success: false, error: "<human-readable reason>" }`. Common reasons: `insufficient_balance`, `recipient_not_in_section`, `self_donate_forbidden`, `invalid_amount`.

**Logging:** Function logs to Cloud Logging on every invocation (sender, recipient, amount, success/failure, latency) for audit trail. Same logging discipline as the existing image-gen Cloud Function.

## Firestore security rules

Add to `firestore.rules`:

```
match /courses/{courseId}/studentMana/{uid} {
  allow read: if isEnrolledIn(courseId) || isTeacher(courseId);
  allow write: if false;  // Cloud Function only
}
match /courses/{courseId}/studentMana/{uid}/transactions/{txId} {
  allow read: if isEnrolledIn(courseId) || isTeacher(courseId);
  allow write: if false;  // Cloud Function only
}
```

The `allow write: if false` rule denies all client writes. The Cloud Function uses admin SDK which bypasses rules. This is the cleanest enforcement of "donations are atomic Cloud Function writes only" — no client tampering possible.

**Migration concern:** if any existing client code currently writes directly to `studentMana/{uid}` (e.g., the grade-bonus or mage-award flows), it must be re-routed through Cloud Functions before this rule is deployed. Implementation plan must audit all writers first; if any exist, either route them through Cloud Functions OR keep narrower rules that allow writes from specific server-trusted contexts. Default assumption: existing writes are already server-only or via the existing Cloud Function pattern; verify in implementation.

## UI flow

### Send button (`src/components/ManaPool.jsx`)

A new "Send mana" red secondary button placed in the student's own balance section, near the existing balance display. Disabled when `balance === 0` (with a hover tooltip *"You need mana to donate"*).

### Modal — Step 1 (recipient picker)

Title: *"Send mana to a classmate"*
Subtitle: *"Brighten someone's day. They'll know it came from you."*

Single `<select>` element listing all classmates in the same enrollment section, **alphabetical by display name**, **self excluded**, **no balances shown**. Data source: `getStudentManaForClass(courseId)` already exists; we reuse it but only display names and uids — drop the balance values from the rendered options.

Buttons: *"Cancel"* (closes), *"Next →"* (disabled until a recipient is picked).

### Modal — Step 2 (amount + confirm)

Title: *"Send mana to {Recipient Name}"*

Number input (min=1, max=sender's `balance`, step=1). Helper text: *"You have {balance} mana available."* Live preview: *"You'll have {balance - amount} left."*

Buttons: *"← Back"* (returns to Step 1, recipient retained), *"Send {amount} mana →"* (red primary, disabled until amount is a valid integer in range).

On click → call `donateMana(courseId, recipientUid, amount)` Cloud Function. Show spinner on button. Disable both buttons while pending.

### Success state

Modal closes. Toast at top: *"Sent {amount} mana to {Recipient Name} ✨"*. Sender's balance display updates immediately to the value returned by the Cloud Function.

The recipient receives a push notification: *"{Sender Name} sent you {amount} mana ✨"* (uses the existing `usePushNotifications` infrastructure invoked from the Cloud Function).

### Failure state

Modal stays open on Step 2 with a red error box above the input: human-readable error from the Cloud Function. Examples:
- *"Couldn't send — your balance is now {actual}. Try again with a smaller amount."* (insufficient_balance)
- *"That classmate is no longer in this section."* (recipient_not_in_section)
- *"Donation amount must be a positive whole number."* (invalid_amount)

The sender's balance display refreshes from the server before the modal re-renders so the user sees current truth.

## Edge cases

- **Concurrent grade bonus / mage award changing sender's balance mid-modal:** the Cloud Function reads inside the transaction, so it always sees fresh balance. If insufficient at execution time, returns `insufficient_balance` and modal shows updated balance.
- **Concurrent donation between same parties:** Firestore transaction handles serialization. Worst case is a retry loop inside the function, transparent to the client.
- **Recipient leaves the section between picker-open and submit:** validation step 3 catches it, returns `recipient_not_in_section`.
- **Sender clicks "Send" twice rapidly:** button disabled on first click. If a second request races through (e.g., two devices), the second hits the balance check and fails cleanly.
- **`amount` is a fractional or negative number:** validation step 1 rejects.
- **`amount` of 0:** also rejected at step 1 (must be positive).
- **`amount` exceeding the 1000 sanity ceiling:** rejected — sanity guard, not a real-world cap, just to prevent client-side misuse.
- **Recipient is at the existing `MANA_CAP = 100`:** donation goes through; recipient holds above-cap balance. Decay does not apply (pool-level only).

## Testing

Pantherlearn has no test framework. Verification stack:

1. **Type-check + build:** `npm run build` succeeds with no new TypeScript / JSX errors.
2. **Cloud Function deploy:** `firebase deploy --only functions:donateMana` succeeds; function visible in Firebase console.
3. **Manual happy-path** with two test student accounts in the same section (one of the AI Lit P9 sections, since qa-student is a known test identity):
   - Sender starts with known balance, opens modal, picks recipient, sends amount, confirms balance updated and recipient balance updated.
   - Verify both `studentMana` docs + both `transactions/{autoId}` subcollection entries exist.
   - Verify recipient receives push notification.
4. **Failure-path checks:**
   - Donate more than balance → modal shows insufficient_balance error, balances unchanged.
   - Try to donate to self via direct Cloud Function call (bypassing UI) → returns self_donate_forbidden, balances unchanged.
   - Try to donate to a student not in the section via direct Cloud Function call → returns recipient_not_in_section.
5. **`/deploy-verify pantherlearn`** after the UI ships — Pixel captures the modal at 375/768/1280, Link verifies the transaction log entries land correctly and that no client-side write to `studentMana` succeeds (confirms rule lockdown).

## Rollback

Single-commit rollback is clean. Three reverts:

1. UI changes in `src/components/ManaPool.jsx` and the new modal component — pure JSX additions, deletion is safe.
2. Cloud Function deploy: redeploy prior version (or delete the function entirely with `firebase functions:delete donateMana`).
3. Firestore rules revert: restore prior `studentMana` rule. WARNING — the new rule may also have routed existing legitimate writers (grade bonus, mage award) through the Cloud Function pattern. If so, those writers also need to be reverted simultaneously, OR the rule kept narrower than this spec proposes. Implementation plan must surface the existing-writers audit early so this rollback risk is known.

No schema changes, no migration, no student-facing data loss. Existing per-student balances are untouched by the feature itself — only changed by actual donation actions, all of which are individually logged and reversible by Cloud Function or by the existing teacher-side balance adjustment tool in ManaManager.

## Dependencies

- Existing: `src/lib/mana.jsx` (uses `getStudentManaForClass`, transaction shape, push notification helper), `src/components/ManaPool.jsx`, `firestore.rules`, `usePushNotifications`
- New: one Cloud Function with the `firebase-functions` v6 callable interface, `firebase-admin` for the transaction
- No new npm packages on the client side (all UI uses existing components)
- No new Firestore indexes (transactions subcollection queries use auto-indexed fields)

## Open decisions — none

All clarifying questions were resolved in the brainstorming session:
1. Intent → A (generosity prompt)
2. Daily cap → none
3. Per-recipient cap → none (donations bypass MANA_CAP)
4. UI placement + recipient picker shape → B (Mana page, two-step modal, alphabetical dropdown, no balances shown)

## Next step

After user approval of this spec, invoke `superpowers:writing-plans` to produce the step-by-step implementation plan.
