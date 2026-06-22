// Read-only: scan PantherLearn users + enrollments, classify each paps email by
// digit count in the local part, and surface auth-rule exceptions.
//   Rule: teacher = <=1 digit, student = >=2 (proven deploy rule blocked >=3).
// Writes full detail to /tmp; prints only a concise summary.
const admin = require("firebase-admin");
const path = require("path");
const fs = require("fs");

const keyPath = path.join(process.env.HOME, ".config/firebase/pantherlearn-admin.json");
admin.initializeApp({ credential: admin.credential.cert(require(keyPath)) });
const db = admin.firestore();

const digitCount = (email) => ((email.split("@")[0] || "").match(/\d/g) || []).length;
const norm = (e) => (e || "").trim().toLowerCase();

async function dumpCollection(name, emailFields, roleFields) {
  const out = [];
  try {
    const snap = await db.collection(name).get();
    snap.forEach((d) => {
      const x = d.data();
      let email = "";
      for (const f of emailFields) if (x[f]) { email = x[f]; break; }
      let role = "";
      for (const f of roleFields) if (x[f]) { role = String(x[f]); break; }
      if (email) out.push({ email: norm(email), role: role.toLowerCase(), name: x.name || x.displayName || "" });
    });
  } catch (e) { console.log(`(skip ${name}: ${e.message})`); }
  return out;
}

async function main() {
  const enroll = await dumpCollection("enrollments", ["email", "studentEmail"], ["role"]);
  const users  = await dumpCollection("users", ["email"], ["role", "userType", "accountType"]);

  // Build a per-email record. enrollments => student by definition.
  const byEmail = new Map();
  const put = (email, role, name, src) => {
    if (!email || !email.endsWith("@paps.net")) return;
    const cur = byEmail.get(email) || { email, roles: new Set(), name: "", srcs: new Set() };
    if (role) cur.roles.add(role);
    if (name && !cur.name) cur.name = name;
    cur.srcs.add(src);
    byEmail.set(email, cur);
  };
  enroll.forEach((r) => put(r.email, r.role || "student", r.name, "enrollments"));
  users.forEach((r) => put(r.email, r.role || "", r.name, "users"));

  const recs = [...byEmail.values()].map((r) => {
    const roles = [...r.roles];
    const isTeacher = roles.some((x) => /teacher|admin|staff|co.?teacher/.test(x)) || r.srcs.has("users") && !r.srcs.has("enrollments") && roles.length === 0 === false;
    const looksStudent = r.srcs.has("enrollments") || roles.some((x) => /student/.test(x));
    return { email: r.email, name: r.name, roles, srcs: [...r.srcs], digits: digitCount(r.email), looksStudent, looksTeacher: roles.some((x) => /teacher|admin|staff/.test(x)) };
  });

  const students = recs.filter((r) => r.looksStudent && !r.looksTeacher);
  const teachers = recs.filter((r) => r.looksTeacher);

  // Distributions
  const dist = (arr) => { const m = {}; arr.forEach((r) => { m[r.digits] = (m[r.digits] || 0) + 1; }); return m; };

  // Exceptions
  const studentsLowDigit = students.filter((r) => r.digits <= 1).sort((a, b) => a.digits - b.digits || a.email.localeCompare(b.email));
  const studentsTwoDigit = students.filter((r) => r.digits === 2).sort((a, b) => a.email.localeCompare(b.email));
  const teachersHighDigit = teachers.filter((r) => r.digits >= 2).sort((a, b) => b.digits - a.digits || a.email.localeCompare(b.email));

  const report = { generated: new Date().toISOString(), totals: { students: students.length, teachers: teachers.length, allEmails: recs.length }, studentDigitDist: dist(students), teacherDigitDist: dist(teachers), studentsLowDigit, studentsTwoDigit, teachersHighDigit };
  fs.writeFileSync("/tmp/auth-exception-scan.json", JSON.stringify(report, null, 2));

  console.log("TOTALS:", `students=${students.length}`, `teachers/staff=${teachers.length}`, `unique paps emails=${recs.length}`);
  console.log("student digit distribution:", JSON.stringify(dist(students)));
  console.log("teacher digit distribution:", JSON.stringify(dist(teachers)));
  console.log("");
  console.log(`STUDENTS with <=1 digit (would read as TEACHER — must blocklist): ${studentsLowDigit.length}`);
  studentsLowDigit.forEach((r) => console.log(`  [${r.digits}] ${r.email}  ${r.name ? "(" + r.name + ")" : ""}`));
  console.log("");
  console.log(`STUDENTS with exactly 2 digits (ambiguous gap): ${studentsTwoDigit.length}`);
  studentsTwoDigit.slice(0, 60).forEach((r) => console.log(`  [2] ${r.email}  ${r.name ? "(" + r.name + ")" : ""}`));
  if (studentsTwoDigit.length > 60) console.log(`  …and ${studentsTwoDigit.length - 60} more (see /tmp/auth-exception-scan.json)`);
  console.log("");
  console.log(`TEACHERS/STAFF with >=2 digits (would be BLOCKED — must allowlist): ${teachersHighDigit.length}`);
  teachersHighDigit.forEach((r) => console.log(`  [${r.digits}] ${r.email}  ${r.name ? "(" + r.name + ")" : ""} roles=${r.roles.join("|")}`));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
