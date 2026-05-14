# Mana Request Notes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add per-request public notes (student-visible) and private notes (teacher-only) to the mana-requests dashboard.

**Architecture:** Public notes are an append-only `publicNotes` array field on the existing `manaRequests` doc (already student-readable). Private notes are an append-only `privateNotes` subcollection gated to teachers by a Firestore rule, so students cannot read them even via the API. Writer functions live in `src/lib/manaRequests.js`; the teacher card and student banners render and append notes.

**Tech Stack:** React (Vite), Firebase Firestore v12, no test framework — verification is `npm run lint`, `npm run build`, and manual UI checks against the dev server.

---

## File Structure

- `firestore.rules` — add `privateNotes` subcollection rule inside the existing `manaRequests` block.
- `src/lib/manaRequests.js` — add `addPublicNote`, `addPrivateNote`, `getPrivateNotes`.
- `src/pages/TeacherManaRequests.jsx` — add notes section to `Card`, wire private-note loading.
- `src/pages/StudentMana.jsx` — render `publicNotes` on the priced banner; add `acceptedRequests` state + filter + "In Progress" banners.

---

## Task 1: Firestore rule for private notes

**Files:**
- Modify: `firestore.rules` (inside `match /manaRequests/{requestId}` block, around line 119-129)

- [ ] **Step 1: Add the privateNotes subcollection rule**

In `firestore.rules`, inside the existing `match /manaRequests/{requestId} { ... }` block, after the `allow delete:` line and before the closing `}`, add:

```
        match /privateNotes/{noteId} {
          allow read, write: if isCourseTeacher(courseId);
        }
```

- [ ] **Step 2: Deploy the rules**

Run: `firebase deploy --only firestore:rules`
Expected: `✔  Deploy complete!` with no compile errors.

- [ ] **Step 3: Commit**

```bash
git add firestore.rules
git commit -m "feat: firestore rule for mana request private notes subcollection"
```

---

## Task 2: Note writer/reader functions

**Files:**
- Modify: `src/lib/manaRequests.js`

- [ ] **Step 1: Add imports**

In `src/lib/manaRequests.js`, the current import line is:

```js
import { collection, addDoc, updateDoc, doc, getDocs, query, where } from "firebase/firestore";
```

Replace it with:

```js
import { collection, addDoc, updateDoc, doc, getDocs, query, where, arrayUnion, orderBy } from "firebase/firestore";
```

- [ ] **Step 2: Add the three functions**

Append to the end of `src/lib/manaRequests.js`:

```js
export async function addPublicNote(courseId, requestId, text) {
  const ref = doc(db, "courses", courseId, "manaRequests", requestId);
  await updateDoc(ref, {
    publicNotes: arrayUnion({ text, createdAt: new Date().toISOString() }),
  });
}

export async function addPrivateNote(courseId, requestId, text) {
  const colRef = collection(db, "courses", courseId, "manaRequests", requestId, "privateNotes");
  await addDoc(colRef, { text, createdAt: new Date().toISOString() });
}

export async function getPrivateNotes(courseId, requestId) {
  const colRef = collection(db, "courses", courseId, "manaRequests", requestId, "privateNotes");
  const snap = await getDocs(query(colRef, orderBy("createdAt", "asc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
```

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: no new errors in `src/lib/manaRequests.js`.

- [ ] **Step 4: Commit**

```bash
git add src/lib/manaRequests.js
git commit -m "feat: add public/private note functions for mana requests"
```

---

## Task 3: Teacher card notes UI

**Files:**
- Modify: `src/pages/TeacherManaRequests.jsx`

- [ ] **Step 1: Import the new functions**

In `src/pages/TeacherManaRequests.jsx`, the import from `../lib/manaRequests` currently lists:
`markRequestFulfilled, markRequestAccepted, revertRequestToPending, priceQuote, declineQuote, cancelQuote`.
Add `addPublicNote, addPrivateNote, getPrivateNotes` to that import block.

- [ ] **Step 2: Add a NotesSection component**

Add this component to `src/pages/TeacherManaRequests.jsx`, above the `Card` function:

```jsx
function NotesSection({ row }) {
  const [privateNotes, setPrivateNotes] = useState([]);
  const [pubInput, setPubInput] = useState("");
  const [privInput, setPrivInput] = useState("");
  const [savingPub, setSavingPub] = useState(false);
  const [savingPriv, setSavingPriv] = useState(false);

  const loadPrivate = async () => {
    try {
      setPrivateNotes(await getPrivateNotes(row.courseId, row.id));
    } catch (err) {
      console.warn("[ManaNotes] private load failed", err?.code || err?.message);
    }
  };

  useEffect(() => { loadPrivate(); }, [row.courseId, row.id]);

  const publicNotes = row.publicNotes || [];

  const fmt = (v) => {
    const d = toDate(v);
    return d ? d.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "";
  };

  const addPub = async () => {
    const text = pubInput.trim();
    if (!text) return;
    setSavingPub(true);
    try {
      await addPublicNote(row.courseId, row.id, text);
      setPubInput("");
      row.publicNotes = [...publicNotes, { text, createdAt: new Date().toISOString() }];
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSavingPub(false);
    }
  };

  const addPriv = async () => {
    const text = privInput.trim();
    if (!text) return;
    setSavingPriv(true);
    try {
      await addPrivateNote(row.courseId, row.id, text);
      setPrivInput("");
      await loadPrivate();
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSavingPriv(false);
    }
  };

  return (
    <div style={{ marginTop: 10, borderTop: "1px solid #e2e8f0", paddingTop: 8 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: "#0891b2", textTransform: "uppercase", letterSpacing: 0.4 }}>
        Public notes — student sees these
      </div>
      {publicNotes.map((n, i) => (
        <div key={i} style={noteEntry}>
          <div style={{ whiteSpace: "pre-wrap" }}>{n.text}</div>
          <div style={noteTime}>{fmt(n.createdAt)}</div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        <input
          type="text"
          placeholder="Add a public note"
          value={pubInput}
          onChange={(e) => setPubInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addPub(); }}
          style={noteInput}
        />
        <button onClick={addPub} disabled={savingPub || !pubInput.trim()} style={btn("#0891b2", savingPub)}>
          Add
        </button>
      </div>

      <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 0.4, marginTop: 10 }}>
        Private notes — only you
      </div>
      {privateNotes.map((n) => (
        <div key={n.id} style={noteEntry}>
          <div style={{ whiteSpace: "pre-wrap" }}>{n.text}</div>
          <div style={noteTime}>{fmt(n.createdAt)}</div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        <input
          type="text"
          placeholder="Add a private note"
          value={privInput}
          onChange={(e) => setPrivInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") addPriv(); }}
          style={noteInput}
        />
        <button onClick={addPriv} disabled={savingPriv || !privInput.trim()} style={btn("#64748b", savingPriv)}>
          Add
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Render NotesSection inside Card**

In the `Card` function, immediately before the final closing `</div>` of the card (right after the `stage === "accepted"` action block, before the card's outermost closing `</div>`), add:

```jsx
      <NotesSection row={row} />
```

- [ ] **Step 4: Add the note styles**

In the `// ── Styles ──` section at the bottom of the file, after the `priceInput` const, add:

```js
const noteEntry = {
  fontSize: 11, color: "#0f172a", marginTop: 4,
  padding: "5px 8px", background: "#f8fafc",
  border: "1px solid #e2e8f0", borderRadius: 6, lineHeight: 1.4,
};
const noteTime = { fontSize: 9, color: "#94a3b8", marginTop: 2 };
const noteInput = {
  flex: 1, padding: "5px 8px", borderRadius: 6,
  border: "1px solid #cbd5e1", fontSize: 11,
};
```

- [ ] **Step 5: Lint and build**

Run: `npm run lint && npm run build`
Expected: build succeeds, no new lint errors in `TeacherManaRequests.jsx`.

- [ ] **Step 6: Manual check**

Run `npm run dev`, open `/teacher/mana-requests` as a teacher. On any request card, confirm both note blocks render, add a public note and a private note, and confirm both appear with timestamps after adding.

- [ ] **Step 7: Commit**

```bash
git add src/pages/TeacherManaRequests.jsx
git commit -m "feat: public/private notes section on teacher mana request cards"
```

---

## Task 4: Student-facing public notes

**Files:**
- Modify: `src/pages/StudentMana.jsx`

- [ ] **Step 1: Add acceptedRequests state**

In `src/pages/StudentMana.jsx`, find the `pricedRequests` state declaration (a `useState` near the other request state). Immediately after it add:

```jsx
  const [acceptedRequests, setAcceptedRequests] = useState([]);
```

- [ ] **Step 2: Populate acceptedRequests in load()**

In `load()`, the existing block (around line 474-478) reads:

```js
      try {
        const allRequests = await getManaRequests(courseId);
        const priced = allRequests.filter(r => r.studentUid === user.uid && r.status === "priced");
        setPricedRequests(priced);
      } catch (e) { console.warn("Failed to load requests:", e); }
```

Replace it with:

```js
      try {
        const allRequests = await getManaRequests(courseId);
        const priced = allRequests.filter(r => r.studentUid === user.uid && r.status === "priced");
        setPricedRequests(priced);
        const accepted = allRequests.filter(r => r.studentUid === user.uid && r.status === "accepted");
        setAcceptedRequests(accepted);
      } catch (e) { console.warn("Failed to load requests:", e); }
```

- [ ] **Step 3: Render public notes on the priced banner**

In the priced banner JSX (around line 1228-1230), the description block reads:

```jsx
              <div style={{ fontSize: 12, color: MANA_TEXT_MUTED, marginTop: 2 }}>
                "{req.description}"
              </div>
```

Immediately after that `</div>`, add:

```jsx
              {(req.publicNotes || []).map((n, i) => (
                <div key={i} style={{ fontSize: 12, color: MANA_TEXT, marginTop: 4, paddingLeft: 8, borderLeft: `2px solid ${GOLD}66` }}>
                  {n.text}
                </div>
              ))}
```

- [ ] **Step 4: Render the "In Progress" banners**

Immediately after the closing `))}` of the `pricedRequests.map(...)` block (right before the `{/* ═══ ENCHANTMENT LOG ═══ */}` comment), add:

```jsx
        {/* In-Progress Request Banners */}
        {acceptedRequests.map((req) => (
          <div key={req.id} style={{
            background: `${ACCENT}08`, border: `1px solid ${ACCENT}44`, borderRadius: 12,
            padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "flex-start",
            gap: 12, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 22 }}>🛠️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, color: MANA_TEXT }}>
                {req.powerName || "Custom 3D Print"} — in the print queue
              </div>
              {req.description && (
                <div style={{ fontSize: 12, color: MANA_TEXT_MUTED, marginTop: 2 }}>
                  "{req.description}"
                </div>
              )}
              {(req.publicNotes || []).map((n, i) => (
                <div key={i} style={{ fontSize: 12, color: MANA_TEXT, marginTop: 4, paddingLeft: 8, borderLeft: `2px solid ${ACCENT}66` }}>
                  {n.text}
                </div>
              ))}
            </div>
          </div>
        ))}
```

- [ ] **Step 5: Lint and build**

Run: `npm run lint && npm run build`
Expected: build succeeds, no new lint errors in `StudentMana.jsx`.

- [ ] **Step 6: Manual check**

With the dev server running, log in as a student who has a `priced` request and one `accepted` request (use the teacher dashboard to set states if needed). Confirm: the priced banner shows any public notes; an "In the print queue" banner appears for the accepted request and shows its public notes. Confirm private notes never appear anywhere on the student view.

- [ ] **Step 7: Commit**

```bash
git add src/pages/StudentMana.jsx
git commit -m "feat: show public notes + in-progress banner on student mana view"
```

---

## Self-Review Notes

- **Spec coverage:** publicNotes field (Task 2/3/4), privateNotes subcollection (Task 1/2/3), rule (Task 1), teacher UI any-stage (Task 3 — NotesSection rendered unconditionally in Card), student priced banner (Task 4 Step 3), student in-progress card (Task 4 Step 4). All covered.
- **Type consistency:** note shape `{ text, createdAt }` consistent across `addPublicNote`, `addPrivateNote`, render code. `getPrivateNotes` adds `id`. `toDate`/`btn` helpers reused from existing `TeacherManaRequests.jsx` scope — `NotesSection` is defined in the same module so both are in scope.
- **No placeholders:** all steps contain full code.
