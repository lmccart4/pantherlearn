#!/usr/bin/env node
/**
 * exempt-choice-project.cjs
 *
 * AI Literacy Year-End "choice" project (6/2–6/4): each student does EITHER
 * Prompt Portfolio OR Career Deep-Dive. The lesson they did NOT choose is
 * marked EXEMPT for them — excluded from grade calc, hidden in MyGrades,
 * cleared in Classroom sync (matches the StudentProgress "Mark as Exempt" UI).
 *
 * SAFE BY DESIGN: only ever sets/clears the `exempt` flag on the two choice
 * lesson IDs. Never touches scores, responses, block IDs, or any other lesson.
 *
 * USAGE
 *   node scripts/exempt-choice-project.cjs --template
 *       → writes a blank roster scaffold (all enrolled students per section)
 *         to drafts/ai-lit-choice-roster.json for Luke to fill in.
 *
 *   node scripts/exempt-choice-project.cjs <roster.json>
 *       → DRY RUN. Resolves every student, prints planned exemptions + any
 *         unmatched names / missing choices. Writes nothing.
 *
 *   node scripts/exempt-choice-project.cjs <roster.json> --apply
 *       → executes the exemptions.
 *
 *   node scripts/exempt-choice-project.cjs <roster.json> --undo
 *       → removes the exempt flag on BOTH choice lessons for every rostered
 *         student (recovery). Use --apply to actually write the undo.
 *
 * ROSTER FORMAT (array per section; choice = the project they DID):
 *   {
 *     "P4": [ {"name":"Bryan Romero","email":"bromero653@paps.net","choice":"prompt"}, ... ],
 *     "P5": [...], "P7": [...], "P9": [...]
 *   }
 *   choice ∈ {"prompt","career"}  (blank/anything else = skipped, reported)
 */

const path = require("path");
const fs = require("fs");
const admin = require(path.join(__dirname, "..", "node_modules", "firebase-admin"));
const key = require(path.join(process.env.HOME, ".config", "firebase", "pantherlearn-admin.json"));
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const SECTIONS = {
  P4: "Y9Gdhw5MTY8wMFt6Tlvj",
  P5: "DacjJ93vUDcwqc260OP3",
  P7: "M2MVSXrKuVCD9JQfZZyp",
  P9: "fUw67wFhAtobWFhjwvZ5",
};
const LESSON = { prompt: "ai-project-prompt-portfolio", career: "ai-project-career-deep-dive" };
const ALL_CHOICE_LESSONS = Object.values(LESSON);
// the lesson to exempt = the one they did NOT choose
const EXEMPT_FOR = { prompt: LESSON.career, career: LESSON.prompt };

const norm = (s) => (s || "").toString().trim().toLowerCase().replace(/\s+/g, " ");

async function loadEnroll(cid) {
  const snap = await db.collection("enrollments").where("courseId", "==", cid).get();
  const byEmail = {}, byName = {}, list = [];
  snap.forEach((d) => {
    const e = d.data();
    const uid = e.uid || e.studentUid;
    if (!uid) return;
    const rec = { uid, name: e.name || `${e.firstName || ""} ${e.lastName || ""}`.trim(), email: e.email || "" };
    list.push(rec);
    if (rec.email) byEmail[norm(rec.email)] = rec;
    if (rec.name) (byName[norm(rec.name)] = byName[norm(rec.name)] || []).push(rec);
  });
  return { byEmail, byName, list };
}

async function template() {
  const out = {};
  for (const [p, cid] of Object.entries(SECTIONS)) {
    const { list } = await loadEnroll(cid);
    list.sort((a, b) => a.name.localeCompare(b.name));
    out[p] = list.map((r) => ({ name: r.name, email: r.email, choice: "" }));
  }
  const dest = path.join(__dirname, "..", "..", "Lachlan", "drafts", "ai-lit-choice-roster.json");
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(out, null, 2));
  console.log(`Wrote roster scaffold → ${dest}`);
  Object.entries(out).forEach(([p, arr]) => console.log(`  ${p}: ${arr.length} students`));
  console.log(`\nFill each "choice" with "prompt" or "career" (the project the student DID), then:`);
  console.log(`  node scripts/exempt-choice-project.cjs ${dest}            # dry run`);
  console.log(`  node scripts/exempt-choice-project.cjs ${dest} --apply    # execute`);
}

async function run(rosterPath, { apply, undo }) {
  const roster = JSON.parse(fs.readFileSync(rosterPath, "utf8"));
  const plan = [];           // {section, name, uid, exemptLesson}
  const unmatched = [], noChoice = [], ambiguous = [];

  for (const [section, cid] of Object.entries(SECTIONS)) {
    const entries = roster[section] || [];
    const { byEmail, byName } = await loadEnroll(cid);
    for (const item of entries) {
      const choice = norm(item.choice);
      let rec = item.email && byEmail[norm(item.email)];
      if (!rec && item.name) {
        const hits = byName[norm(item.name)] || [];
        if (hits.length === 1) rec = hits[0];
        else if (hits.length > 1) { ambiguous.push(`${section}: "${item.name}" matches ${hits.length} students — use email`); continue; }
      }
      if (!rec) { unmatched.push(`${section}: ${item.name || item.email || "(blank)"}`); continue; }
      if (!undo && !["prompt", "career"].includes(choice)) { noChoice.push(`${section}: ${rec.name}`); continue; }
      plan.push({ section, cid, name: rec.name, uid: rec.uid, exemptLesson: undo ? null : EXEMPT_FOR[choice], choice });
    }
  }

  console.log(`\n=== ${undo ? "UNDO" : "EXEMPT"} plan ${apply ? "(APPLY)" : "(dry run)"} ===`);
  const bySec = {};
  plan.forEach((p) => (bySec[p.section] = bySec[p.section] || []).push(p));
  for (const [s, arr] of Object.entries(bySec)) {
    console.log(`\n${s} — ${arr.length} students`);
    arr.forEach((p) => console.log(`  ${p.name.padEnd(26)} chose ${(p.choice || "-").padEnd(7)} → ${undo ? "clear exempt on BOTH choice lessons" : "exempt " + p.exemptLesson}`));
  }
  if (noChoice.length) console.log(`\n⚠️  No choice yet (skipped): ${noChoice.length}\n   ` + noChoice.join("\n   "));
  if (unmatched.length) console.log(`\n⚠️  UNMATCHED (skipped): ${unmatched.length}\n   ` + unmatched.join("\n   "));
  if (ambiguous.length) console.log(`\n⚠️  AMBIGUOUS (skipped): ${ambiguous.length}\n   ` + ambiguous.join("\n   "));

  if (!apply) { console.log(`\nDry run only. Re-run with --apply to write.`); return; }

  let wrote = 0;
  for (const p of plan) {
    if (undo) {
      for (const lid of ALL_CHOICE_LESSONS) {
        const ref = db.doc(`progress/${p.uid}/courses/${p.cid}/lessons/${lid}`);
        if ((await ref.get()).exists) { await ref.update({ exempt: admin.firestore.FieldValue.delete(), exemptAt: admin.firestore.FieldValue.delete(), exemptBy: admin.firestore.FieldValue.delete() }); wrote++; }
      }
    } else {
      const ref = db.doc(`progress/${p.uid}/courses/${p.cid}/lessons/${p.exemptLesson}`);
      await ref.set({ exempt: true, exemptAt: new Date(), exemptBy: "teacher" }, { merge: true });
      wrote++;
    }
  }
  console.log(`\n✅ Wrote ${wrote} progress doc(s). ${undo ? "Exemptions cleared." : "Exemptions applied."}`);
}

(async () => {
  const args = process.argv.slice(2);
  if (args.includes("--template")) return template();
  const rosterPath = args.find((a) => !a.startsWith("--"));
  if (!rosterPath) { console.error("Provide a roster JSON path, or --template to scaffold one."); process.exit(1); }
  await run(rosterPath, { apply: args.includes("--apply"), undo: args.includes("--undo") });
})().then(() => process.exit(0)).catch((e) => { console.error("ERR", e.message); process.exit(1); });
