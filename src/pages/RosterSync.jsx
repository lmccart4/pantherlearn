// src/pages/RosterSync.jsx
// Renamed to "Roster" in the UI. Handles CSV bulk import + manual single student add/remove.
import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, orderBy, doc, writeBatch, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";

export default function RosterSync() {
  const { userRole } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState(null);
  const [error, setError] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [columnMap, setColumnMap] = useState({ email: "", firstName: "", lastName: "" });
  const [preview, setPreview] = useState([]);
  const fileRef = useRef(null);
  const [existingCount, setExistingCount] = useState(0);
  const [existingSections] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [rosterFilter, setRosterFilter] = useState("all");
  const [rosterSearch, setRosterSearch] = useState("");
  const [removing, setRemoving] = useState(null);

  // Manual add form
  const [showAddForm, setShowAddForm] = useState(false);
  const [addEmail, setAddEmail] = useState("");
  const [addFirstName, setAddFirstName] = useState("");
  const [addLastName, setAddLastName] = useState("");
  // Manual add section removed — no longer needed
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (userRole !== "teacher") return;
    const fetchCourses = async () => {
      try {
        const q = query(collection(db, "courses"), orderBy("order", "asc"));
        const snap = await getDocs(q);
        const c = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCourses(c);
        if (c.length > 0) setSelectedCourse(c[0].id);
      } catch (err) {
        console.error("Error loading courses:", err);
      }
      setLoading(false);
    };
    fetchCourses();
  }, [userRole]);

  // Load existing enrollment count when course changes
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchExisting = async () => {
      const snap = await getDocs(collection(db, "enrollments"));
      let count = 0;
      const students = [];
      snap.forEach((d) => {
        const data = d.data();
        if (data.courseId === selectedCourse) {
          count++;
          students.push({ docId: d.id, ...data });
        }
      });
      students.sort((a, b) => (a.name || a.email || "").localeCompare(b.name || b.email || ""));
      setExistingCount(count);
      setEnrolledStudents(students);
    };
    fetchExisting();
  }, [selectedCourse, syncResult]);

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).filter((l) => l.trim());
    if (lines.length < 2) return null;

    const headers = lines[0].split(",").map((h) => h.trim().replace(/^["']|["']$/g, ""));
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const row = [];
      let current = "";
      let inQuotes = false;
      for (const char of lines[i]) {
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          row.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      row.push(current.trim());
      if (row.length >= 1) {
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = row[idx] || ""; });
        rows.push(obj);
      }
    }
    return { headers, rows };
  };

  const handleFileUpload = (e) => {
    setError(null);
    setSyncResult(null);
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const parsed = parseCSV(ev.target.result);
      if (!parsed || parsed.rows.length === 0) {
        setError("Could not parse CSV. Make sure it has a header row and at least one data row.");
        return;
      }
      setCsvData(parsed);
      setPreview(parsed.rows.slice(0, 5));

      // Auto-detect columns
      const lower = parsed.headers.map((h) => h.toLowerCase());
      const autoMap = { email: "", firstName: "", lastName: "" };
      lower.forEach((h, i) => {
        if (h.includes("email") || h.includes("e-mail")) autoMap.email = parsed.headers[i];
        else if (h === "first" || h === "first name" || h === "firstname" || h === "first_name") autoMap.firstName = parsed.headers[i];
        else if (h === "last" || h === "last name" || h === "lastname" || h === "last_name") autoMap.lastName = parsed.headers[i];
      });
      setColumnMap(autoMap);
    };
    reader.readAsText(file);
  };

  const handleSync = async () => {
    if (!csvData || !columnMap.email || !selectedCourse) {
      setError("Please select a course, upload a CSV, and map the email column.");
      return;
    }

    setSyncing(true);
    setSyncResult(null);
    setError(null);

    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const usersByEmail = {};
      usersSnap.forEach((d) => {
        const email = d.data().email?.toLowerCase();
        if (email) usersByEmail[email] = d.id;
      });

      let totalStudents = 0;
      let skipped = 0;
      const sections = new Set();
      let batch = writeBatch(db);
      let batchCount = 0;

      for (const row of csvData.rows) {
        const email = (row[columnMap.email] || "").trim().toLowerCase();
        if (!email || !email.includes("@")) {
          skipped++;
          continue;
        }

        const firstName = columnMap.firstName ? (row[columnMap.firstName] || "").trim() : "";
        const lastName = columnMap.lastName ? (row[columnMap.lastName] || "").trim() : "";
        const name = [firstName, lastName].filter(Boolean).join(" ") || email.split("@")[0];

        const matchedUid = usersByEmail[email] || null;
        const emailClean = email.replace(/[^a-z0-9]/g, "_");
        const docId = `${selectedCourse}_${emailClean}`;

        batch.set(doc(db, "enrollments", docId), {
          courseId: selectedCourse,
          email,
          name,
          firstName,
          lastName,
          uid: matchedUid,
          studentUid: matchedUid,
          enrolledAt: new Date(),
        }, { merge: true });

        totalStudents++;
        batchCount++;

        if (batchCount >= 450) {
          await batch.commit();
          batch = writeBatch(db);
          batchCount = 0;
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }

      // Try to update enrolledCourses on user docs — but don't let this block the sync
      // Students without accounts yet will get linked at login via useAuth
      try {
        const enrolledUsersSnap = await getDocs(collection(db, "enrollments"));
        const uidsToUpdate = new Set();
        enrolledUsersSnap.forEach((d) => {
          const data = d.data();
          if (data.courseId === selectedCourse && data.uid) {
            uidsToUpdate.add(data.uid);
          }
        });
        for (const uid of uidsToUpdate) {
          try {
            const userRef = doc(db, "users", uid);
            const userDoc = await getDoc(userRef);
            if (!userDoc.exists()) continue; // Skip — user hasn't signed up yet
            const ec = userDoc.data().enrolledCourses || {};
            const ecMap = Array.isArray(ec) ? ec.reduce((m, id) => ({ ...m, [id]: true }), {}) : ec;
            if (!ecMap[selectedCourse]) {
              await setDoc(userRef, {
                enrolledCourses: { ...ecMap, [selectedCourse]: true },
              }, { merge: true });
            }
          } catch (e) {
            console.warn("Could not update enrolledCourses for", uid, e);
          }
        }
      } catch (e) {
        console.warn("enrolledCourses batch update skipped:", e);
      }

      await new Promise((r) => setTimeout(r, 1000));
      const verifySnap = await getDocs(collection(db, "enrollments"));
      let savedCount = 0;
      verifySnap.forEach((d) => {
        if (d.data().courseId === selectedCourse) savedCount++;
      });

      setSyncResult({
        students: totalStudents,
        skipped,
        savedCount,
      });

      setCsvData(null);
      setPreview([]);
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      console.error("Sync error:", err);
      setError("Sync failed: " + (err.message || "Unknown error") + (err.code ? ` (${err.code})` : ""));
    }
    setSyncing(false);
  };

  // ─── Manual Add Single Student ───
  const handleAddStudent = async () => {
    const email = addEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    const alreadyEnrolled = enrolledStudents.some((s) => s.email?.toLowerCase() === email);
    if (alreadyEnrolled) {
      setError(`${email} is already enrolled in this course.`);
      return;
    }
    setAdding(true);
    setError(null);
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      let matchedUid = null;
      usersSnap.forEach((d) => {
        if (d.data().email?.toLowerCase() === email) matchedUid = d.id;
      });
      const firstName = addFirstName.trim();
      const lastName = addLastName.trim();
      const name = [firstName, lastName].filter(Boolean).join(" ") || email.split("@")[0];
      const emailClean = email.replace(/[^a-z0-9]/g, "_");
      const docId = `${selectedCourse}_${emailClean}`;

      // Step 1: Write enrollment doc
      try {
        await setDoc(doc(db, "enrollments", docId), {
          courseId: selectedCourse, email, name, firstName, lastName,
          uid: matchedUid, studentUid: matchedUid, enrolledAt: new Date(),
        }, { merge: true });
      } catch (enrollErr) {
        throw new Error(`Enrollment write failed: ${enrollErr.message}`);
      }

      // Step 2: Update enrolledCourses (non-blocking)
      if (matchedUid) {
        try {
          const userRef = doc(db, "users", matchedUid);
          const userSnap = await getDoc(userRef);
          const ec = userSnap.exists() ? (userSnap.data().enrolledCourses || {}) : {};
          const ecMap = Array.isArray(ec) ? ec.reduce((m, id) => ({ ...m, [id]: true }), {}) : ec;
          if (!ecMap[selectedCourse]) {
            await setDoc(userRef, {
              enrolledCourses: { ...ecMap, [selectedCourse]: true },
            }, { merge: true });
          }
        } catch (e) {
          console.warn("Could not update enrolledCourses for", matchedUid, e);
        }
      }

      setSyncResult({ manual: true });
      setAddEmail(""); setAddFirstName(""); setAddLastName("");
      setShowAddForm(false);
    } catch (err) {
      console.error("Add student error:", err);
      setError("Failed to add student: " + err.message);
    }
    setAdding(false);
  };

  const handleRemoveStudent = async (student) => {
    if (!confirm(`Remove ${student.name || student.email} from ${courseName}?`)) return;
    setRemoving(student.docId);
    try {
      // Delete ALL enrollment docs for this student in this course
      // (there may be duplicates from CSV + enroll code with different doc IDs)
      const allEnrollSnap = await getDocs(collection(db, "enrollments"));
      const toDelete = [];
      allEnrollSnap.forEach((d) => {
        const data = d.data();
        if (data.courseId !== selectedCourse) return;
        const matchesUid = student.uid && (data.uid === student.uid || data.studentUid === student.uid);
        const matchesEmail = student.email && data.email?.toLowerCase() === student.email.toLowerCase();
        if (matchesUid || matchesEmail) toDelete.push(d.id);
      });
      for (const docId of toDelete) {
        await deleteDoc(doc(db, "enrollments", docId));
      }

      // Remove course from enrolledCourses on user doc
      const studentUid = student.uid || student.studentUid;
      if (studentUid) {
        try {
          const userRef = doc(db, "users", studentUid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const ec = userSnap.data().enrolledCourses;
            if (ec && typeof ec === "object" && !Array.isArray(ec)) {
              const updated = { ...ec };
              delete updated[selectedCourse];
              for (const key of Object.keys(updated)) {
                if (!isNaN(key)) delete updated[key];
              }
              await setDoc(userRef, { enrolledCourses: updated }, { merge: true });
            }
          }
        } catch (e) {
          console.warn("Could not update enrolledCourses after unenroll:", e);
        }
      }
      setEnrolledStudents((prev) => prev.filter((s) => s.docId !== student.docId));
      setExistingCount((prev) => prev - 1);
    } catch (err) {
      console.error("Remove failed:", err);
      setError("Failed to remove student: " + err.message);
    }
    setRemoving(null);
  };

  const handleRemoveSection = async (section) => {
    const studentsInSection = enrolledStudents.filter((s) => s.section === section);
    if (!confirm(`Remove all ${studentsInSection.length} students in ${section} from ${courseName}?`)) return;
    setRemoving(section);
    try {
      // Collect all emails and UIDs for students in this section
      const emailsInSection = new Set();
      const uidsInSection = new Set();
      studentsInSection.forEach((s) => {
        if (s.email) emailsInSection.add(s.email.toLowerCase());
        if (s.uid) uidsInSection.add(s.uid);
        if (s.studentUid) uidsInSection.add(s.studentUid);
      });

      // Find ALL enrollment docs matching any of these students for this course
      const allEnrollSnap = await getDocs(collection(db, "enrollments"));
      const batch = writeBatch(db);
      allEnrollSnap.forEach((d) => {
        const data = d.data();
        if (data.courseId !== selectedCourse) return;
        const matchesUid = data.uid && uidsInSection.has(data.uid) || data.studentUid && uidsInSection.has(data.studentUid);
        const matchesEmail = data.email && emailsInSection.has(data.email.toLowerCase());
        if (matchesUid || matchesEmail) batch.delete(d.ref);
      });
      await batch.commit();

      // Remove course from enrolledCourses on each student's user doc
      for (const uid of uidsInSection) {
        try {
          const userRef = doc(db, "users", uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const ec = userSnap.data().enrolledCourses;
            if (ec && typeof ec === "object" && !Array.isArray(ec)) {
              const updated = { ...ec };
              delete updated[selectedCourse];
              for (const key of Object.keys(updated)) {
                if (!isNaN(key)) delete updated[key];
              }
              await setDoc(userRef, { enrolledCourses: updated }, { merge: true });
            }
          }
        } catch (e) {
          console.warn("Could not update enrolledCourses for", uid, e);
        }
      }
      setEnrolledStudents((prev) => prev.filter((s) => s.section !== section));
      setExistingCount((prev) => prev - studentsInSection.length);
    } catch (err) {
      console.error("Remove section failed:", err);
      setError("Failed to remove section: " + err.message);
    }
    setRemoving(null);
  };

  const filteredEnrolled = enrolledStudents.filter((s) => {
    if (rosterSearch) {
      const term = rosterSearch.toLowerCase();
      return (s.name || "").toLowerCase().includes(term) ||
             (s.email || "").toLowerCase().includes(term);
    }
    return true;
  });

  if (userRole !== "teacher") {
    return (
      <div className="page-container" style={{ textAlign: "center", paddingTop: 120 }}>
        <h2 style={{ fontFamily: "var(--font-display)" }}>Teacher access only</h2>
      </div>
    );
  }

  const courseName = courses.find((c) => c.id === selectedCourse)?.title || "";

  return (
    <div className="page-container" style={{ padding: "48px 40px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
          Roster
        </h1>
        <p style={{ color: "var(--text2)", fontSize: 15, marginBottom: 32 }}>
          Manage student enrollment by CSV import or add students individually.
        </p>

        {error && (
          <div style={{
            background: "var(--red-dim)", border: "1px solid rgba(248,113,113,0.3)",
            borderRadius: 10, padding: "14px 20px", marginBottom: 20, fontSize: 14, color: "var(--red)",
          }}>{error}</div>
        )}

        {syncResult && !syncResult.manual && (
          <div style={{
            background: "var(--green-dim)", border: "1px solid rgba(45,212,160,0.3)",
            borderRadius: 10, padding: "14px 20px", marginBottom: 20, fontSize: 14, color: "var(--green)",
          }}>
            ✓ Enrolled {syncResult.savedCount} students in {courseName}
            {syncResult.skipped > 0 && <span style={{ display: "block", fontSize: 12, marginTop: 4, opacity: 0.8 }}>{syncResult.skipped} rows skipped (missing/invalid email)</span>}
          </div>
        )}

        {/* Select course */}
        <div className="card" style={{ padding: "20px 24px", marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
            Select Course
          </div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--surface)",
              color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14,
            }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.icon} {c.title}</option>
            ))}
          </select>
          {existingCount > 0 && (
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 8 }}>
              Currently enrolled: {existingCount} students
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary" style={{ fontSize: 13 }}>
            {showAddForm ? "Cancel" : "➕ Add Student"}
          </button>
          <button onClick={() => { setCsvData(null); if (fileRef.current) { fileRef.current.value = ""; fileRef.current.click(); } }} className="btn btn-secondary" style={{ fontSize: 13 }}>
            📄 Import CSV
          </button>
          <input ref={fileRef} type="file" accept=".csv,.txt" onChange={handleFileUpload} style={{ display: "none" }} />
        </div>

        {/* Manual Add Form */}
        {showAddForm && (
          <div className="card" style={{ padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>➕ Add Single Student</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", display: "block", marginBottom: 4 }}>Email *</label>
                <input type="email" placeholder="student@paps.net" value={addEmail} onChange={(e) => setAddEmail(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: `1px solid ${!addEmail.includes("@") && addEmail ? "var(--red)" : "var(--border)"}`, background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", display: "block", marginBottom: 4 }}>First Name</label>
                <input type="text" placeholder="John" value={addFirstName} onChange={(e) => setAddFirstName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13 }} />
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "var(--text3)", display: "block", marginBottom: 4 }}>Last Name</label>
                <input type="text" placeholder="Smith" value={addLastName} onChange={(e) => setAddLastName(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13 }} />
              </div>
            </div>
            <button onClick={handleAddStudent} disabled={adding || !addEmail.includes("@")} className="btn btn-primary"
              style={{ fontSize: 13, opacity: addEmail.includes("@") ? 1 : 0.5 }}>
              {adding ? "Adding..." : `Add to ${courseName}`}
            </button>
          </div>
        )}

        {/* CSV Upload (Step 2 — shown inline when file selected) */}
        {/* CSV mapping (shown when file selected) */}
        {csvData && (
          <div className="card" style={{ padding: "20px 24px", marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--amber)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
              Map CSV Columns
            </div>
            <p style={{ fontSize: 13, color: "var(--text3)", marginBottom: 14 }}>
              Found {csvData.rows.length} rows and {csvData.headers.length} columns. Map each field:
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 20 }}>
              {[
                { key: "email", label: "Email *", required: true },
                { key: "firstName", label: "First Name" },
                { key: "lastName", label: "Last Name" },
              ].map(({ key, label, required }) => (
                <div key={key}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: required ? "var(--text)" : "var(--text3)", marginBottom: 4, display: "block" }}>
                    {label}
                  </label>
                  <select
                    value={columnMap[key]}
                    onChange={(e) => setColumnMap((prev) => ({ ...prev, [key]: e.target.value }))}
                    style={{
                      width: "100%", padding: "8px 12px", borderRadius: 8,
                      border: `1px solid ${required && !columnMap[key] ? "var(--red)" : "var(--border)"}`,
                      background: "var(--surface)", color: "var(--text)",
                      fontFamily: "var(--font-body)", fontSize: 13,
                    }}
                  >
                    <option value="">— not mapped —</option>
                    {csvData.headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>
              Preview (first {preview.length} rows)
            </div>
            <div style={{ overflowX: "auto", borderRadius: 8, border: "1px solid var(--border)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: "var(--text2)" }}>Email</th>
                    <th style={{ textAlign: "left", padding: "8px 12px", color: "var(--text2)" }}>Name</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => {
                    const email = columnMap.email ? row[columnMap.email] : "";
                    const first = columnMap.firstName ? row[columnMap.firstName] : "";
                    const last = columnMap.lastName ? row[columnMap.lastName] : "";
                    const valid = email && email.includes("@");
                    return (
                      <tr key={i} style={{ borderBottom: "1px solid var(--border)", opacity: valid ? 1 : 0.4 }}>
                        <td style={{ padding: "6px 12px", color: valid ? "var(--cyan)" : "var(--red)" }}>{email || "—"}</td>
                        <td style={{ padding: "6px 12px" }}>{[first, last].filter(Boolean).join(" ") || "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {csvData.rows.length > 5 && (
              <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6 }}>
                ...and {csvData.rows.length - 5} more rows
              </div>
            )}
          </div>
        )}

        {csvData && (
          <button
            className="btn btn-primary"
            onClick={handleSync}
            disabled={syncing || !columnMap.email || !selectedCourse}
            style={{ fontSize: 15, padding: "12px 28px", marginBottom: 32 }}
          >
            {syncing ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Enrolling students...
              </span>
            ) : (
              `📥 Enroll ${csvData.rows.length} Students in ${courseName}`
            )}
          </button>
        )}

        {/* Current Roster */}
        {enrolledStudents.length > 0 && (
          <div style={{ marginTop: csvData ? 0 : 32 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
              Current Roster — {courseName}
            </h2>
            <p style={{ color: "var(--text3)", fontSize: 13, marginBottom: 16 }}>
              {existingCount} students enrolled
            </p>

            {/* Search + filter */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180, position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={rosterSearch}
                  onChange={(e) => setRosterSearch(e.target.value)}
                  style={{
                    width: "100%", padding: "8px 14px 8px 34px", borderRadius: 8,
                    border: "1px solid var(--border)", background: "var(--surface)",
                    color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13, outline: "none",
                  }}
                />
              </div>
            </div>

            {/* Student list */}
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid var(--border)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "var(--surface)", borderBottom: "2px solid var(--border)" }}>
                    <th style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Student</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 600, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Email</th>
                    <th style={{ textAlign: "center", padding: "10px 12px", fontWeight: 600, color: "var(--text2)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", width: 80 }}>Status</th>
                    <th style={{ textAlign: "center", padding: "10px 12px", width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEnrolled.map((s, i) => (
                    <tr key={s.docId} style={{
                      borderBottom: i < filteredEnrolled.length - 1 ? "1px solid var(--border)" : "none",
                      background: i % 2 === 0 ? "transparent" : "var(--surface)",
                      opacity: removing === s.docId ? 0.4 : 1,
                    }}>
                      <td style={{ padding: "8px 16px", fontWeight: 500 }}>
                        {s.name || s.email?.split("@")[0] || "—"}
                      </td>
                      <td style={{ padding: "8px 12px", color: "var(--cyan)", fontSize: 12 }}>
                        {s.email}
                      </td>
                      <td style={{ textAlign: "center", padding: "8px 12px" }}>
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4,
                          background: s.uid ? "var(--green-dim)" : "var(--surface2)",
                          color: s.uid ? "var(--green)" : "var(--text3)",
                          textTransform: "uppercase", letterSpacing: "0.04em",
                        }}>
                          {s.uid ? "Active" : "Pending"}
                        </span>
                      </td>
                      <td style={{ textAlign: "center", padding: "8px 12px" }}>
                        <button
                          onClick={() => handleRemoveStudent(s)}
                          disabled={removing === s.docId}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            color: "var(--text3)", fontSize: 14, padding: "4px 8px", borderRadius: 4,
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.background = "var(--red-dim)"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text3)"; e.currentTarget.style.background = "none"; }}
                          title={`Remove ${s.name || s.email}`}
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEnrolled.length === 0 && rosterSearch && (
              <div style={{ textAlign: "center", padding: 20, color: "var(--text3)", fontSize: 13 }}>
                No students match "{rosterSearch}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
