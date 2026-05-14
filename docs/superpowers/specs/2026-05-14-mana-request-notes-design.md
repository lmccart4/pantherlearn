# Mana Request Notes — Public & Private

**Date:** 2026-05-14
**Status:** Approved

## Problem

The teacher mana-requests dashboard (`/teacher/mana-requests`) has no way to attach
notes to a request. Luke needs two kinds of notes per request:

- **Public notes** — details the requesting student should see (e.g. "printing in blue").
- **Private notes** — teacher-only working notes (e.g. "print at 80% scale").

Critically, private notes must be unreadable by students — not just hidden in the UI.

## Constraint discovered

The Firestore rule on `manaRequests` is `allow read: if hasCourseAccess(courseId)`.
Any enrolled student can read the entire request doc via the API. Therefore private
notes cannot be a field on the request doc — they must live somewhere students cannot
read.

## Data model

### Public notes
- Array field `publicNotes` on the `manaRequests/{id}` doc.
- Each entry: `{ text: string, createdAt: string (ISO) }`.
- Append-only via `arrayUnion`.
- Doc is already student-readable — no read-rule change.

### Private notes
- New subcollection: `courses/{courseId}/manaRequests/{requestId}/privateNotes/{noteId}`.
- Each doc: `{ text: string, createdAt: string (ISO) }`.
- Append-only (new doc per note). No edit/delete in v1.

## Firestore rules

Add inside the existing `match /manaRequests/{requestId}` block:

```
match /privateNotes/{noteId} {
  allow read, write: if isCourseTeacher(courseId);
}
```

The existing student update rule already restricts students to
`affectedKeys().hasOnly(["status", "acceptedAt"])`, so students cannot write
`publicNotes`. No change needed there.

## Writer functions — `src/lib/manaRequests.js`

```
addPublicNote(courseId, requestId, text)
  → updateDoc(ref, { publicNotes: arrayUnion({ text, createdAt: ISO }) })

addPrivateNote(courseId, requestId, text)
  → addDoc(collection(.../privateNotes), { text, createdAt: ISO })

getPrivateNotes(courseId, requestId)
  → getDocs(.../privateNotes) → sorted by createdAt asc
```

## Teacher UI — `src/pages/TeacherManaRequests.jsx`

Each `Card` gets a notes section, available at **any stage** (New, Awaiting,
Print Queue, Fulfilled).

- Two labeled blocks:
  - "Public notes — student sees these"
  - "Private notes — only you"
- Each block renders existing entries (text + short timestamp) followed by a
  text input + "Add" button.
- Private notes are fetched per-card on mount via `getPrivateNotes`; public notes
  come from `row.publicNotes` already in the loaded row.
- Adding a note calls the writer, then refreshes (public: re-run `load()`;
  private: re-fetch that card's private notes).

## Student UI — `src/pages/StudentMana.jsx`

### Priced quote banner
Render `req.publicNotes` entries below the existing description line.

### New "In Progress" card
Students currently see nothing after accepting a quote, and nothing for accepted
non-quote requests. Add a card for `status === "accepted"` requests belonging to
the student:
- Shows request name/description, a status line ("In the print queue"), and
  `publicNotes` entries.
- New filter in `load()` next to the existing `priced` filter:
  `accepted = allRequests.filter(r => r.studentUid === user.uid && r.status === "accepted")`
- Stored in new state `acceptedRequests`; rendered as banners near `pricedRequests`.

## Out of scope (v1)

- Editing or deleting individual notes.
- Notes on auto-fulfilled / hidden-power requests.
- Notifying the student when a public note is added.
