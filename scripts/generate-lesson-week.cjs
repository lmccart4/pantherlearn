#!/usr/bin/env node
// scripts/generate-lesson-week.cjs
//
// Generates stub lesson plan HTML files for the next school week,
// updates lesson-plans-public/index.html, and optionally deploys.
//
// Usage:
//   node scripts/generate-lesson-week.cjs             # generate only
//   node scripts/generate-lesson-week.cjs --deploy    # generate + firebase deploy

'use strict';

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ── CONFIG ────────────────────────────────────────────────────────────────────
const ROOT       = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'lesson-plans-public');
const INDEX_PATH = path.join(PUBLIC_DIR, 'index.html');
const COURSES    = ['physics', 'ai-literacy', 'digital-literacy'];
const COURSE_LABELS = {
  'physics':          'Physics',
  'ai-literacy':      'AI Literacy',
  'digital-literacy': 'Digital Literacy',
};
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_FULL = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];

// ── PARSE INDEX ───────────────────────────────────────────────────────────────
const indexHtml = fs.readFileSync(INDEX_PATH, 'utf8');
const weeksMatch = indexHtml.match(/const weeks = \[([\s\S]*?)\];/);
if (!weeksMatch) { console.error('✗ Could not find weeks array in index.html'); process.exit(1); }

const weekEntries = [...weeksMatch[1].matchAll(/\{\s*key:\s*"([^"]+)",\s*range:\s*"([^"]+)"\s*\}/g)]
  .map(m => ({ key: m[1], range: m[2] }));
if (!weekEntries.length) { console.error('✗ No weeks found in array'); process.exit(1); }

const last = weekEntries[weekEntries.length - 1];
console.log(`Last week in index: ${last.key}  (${last.range})`);

// ── COMPUTE NEXT WEEK ─────────────────────────────────────────────────────────
const keyMatch = last.key.match(/^(\d{4})-W(\d+)$/);
if (!keyMatch) { console.error(`✗ Unrecognised key format: ${last.key}`); process.exit(1); }

const lastYear   = parseInt(keyMatch[1]);
const lastWNum   = parseInt(keyMatch[2]);
const nextWNum   = lastWNum + 1;

// Parse the Monday of the last week from its range string ("Mar 9 – Mar 13")
const rangeMatch = last.range.match(/(\w+)\s+(\d+)/);
if (!rangeMatch) { console.error(`✗ Unrecognised range format: ${last.range}`); process.exit(1); }

const lastMonIdx = MONTHS.indexOf(rangeMatch[1]);
const lastMonDay = parseInt(rangeMatch[2]);
const lastMonday = new Date(lastYear, lastMonIdx, lastMonDay);

// Advance 7 days
const nextMonday = new Date(lastMonday);
nextMonday.setDate(nextMonday.getDate() + 7);
const nextFriday = new Date(nextMonday);
nextFriday.setDate(nextFriday.getDate() + 4);

const nextYear   = nextMonday.getFullYear();
const nextKey    = `${nextYear}-W${nextWNum}`;
const nextRange  = `${MONTHS[nextMonday.getMonth()]} ${nextMonday.getDate()} – ${MONTHS[nextFriday.getMonth()]} ${nextFriday.getDate()}`;

console.log(`Next week:         ${nextKey}  (${nextRange})`);

// ── GUARD: already exists? ────────────────────────────────────────────────────
if (weekEntries.some(w => w.key === nextKey)) {
  console.log(`✓ ${nextKey} already exists in index.html — nothing to do.`);
  process.exit(0);
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function dayOffset(monday, n) {
  const d = new Date(monday);
  d.setDate(d.getDate() + n);
  return d;
}
function fmt(d) { return `${MONTH_FULL[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`; }

function daySection(dayName, d) {
  return `
        <!-- ${dayName.toUpperCase()} -->
        <div class="lesson-section">
            <div class="lesson-header">
                <div>
                    <div class="lesson-day">${dayName}</div>
                    <div class="lesson-title">— Not yet posted —</div>
                    <div class="lesson-date">${fmt(d)}</div>
                </div>
            </div>
            <p class="no-lesson">Lesson plan for this day has not been posted yet.</p>
        </div>`;
}

function buildHtml(course, monday) {
  const label   = COURSE_LABELS[course];
  const [mon, tue, wed, thu, fri] = [0,1,2,3,4].map(i => dayOffset(monday, i));
  const weekStr = `${nextWNum} (${MONTHS[mon.getMonth()]} ${mon.getDate()}–${MONTHS[fri.getMonth()]} ${fri.getDate()}, ${nextYear})`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${label} — Week ${nextWNum} Lesson Plan</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif; background: #0d0d0d; color: #e3e3e3; line-height: 1.6; padding: 2rem; }
        .container { max-width: 1200px; margin: 0 auto; }
        a.back { display: inline-flex; align-items: center; gap: 0.4rem; color: #60a5fa; text-decoration: none; font-size: 0.85rem; margin-bottom: 2rem; transition: color 0.2s; }
        a.back:hover { color: #93c5fd; }
        header { border-bottom: 1px solid #2a2a2a; padding-bottom: 2rem; margin-bottom: 3rem; }
        h1 { font-size: 2.5rem; font-weight: 600; color: #fff; margin-bottom: 0.5rem; letter-spacing: -0.02em; }
        .meta { display: flex; gap: 2rem; margin-top: 1rem; font-size: 0.9rem; color: #8b8b8b; flex-wrap: wrap; }
        .meta-item { display: flex; align-items: center; gap: 0.5rem; }
        .meta-label { color: #5b5b5b; font-weight: 500; }
        .overview { background: #0f172a; border: 1px solid #1e293b; border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem; }
        .overview-title { font-size: 1.1rem; font-weight: 600; color: #e2e8f0; margin-bottom: 1rem; }
        .overview-body { color: #94a3b8; line-height: 1.7; font-style: italic; }
        .lesson-section { background: #151515; border: 1px solid #2a2a2a; border-radius: 10px; padding: 2rem; margin-bottom: 2rem; transition: border-color 0.2s; }
        .lesson-section:hover { border-color: #3a3a3a; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .lesson-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #222; }
        .lesson-day { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 0.5rem; }
        .lesson-title { font-size: 1.5rem; font-weight: 600; color: #fff; margin-bottom: 0.25rem; }
        .lesson-date { font-size: 0.85rem; color: #888; font-weight: 500; }
        .no-lesson { color: #555; font-style: italic; padding: 1rem 0; }
        @media (max-width: 768px) { body { padding: 1rem; } h1 { font-size: 1.8rem; } .meta { flex-direction: column; gap: 0.5rem; } }
    </style>
</head>
<body>
    <div class="container">
        <a class="back" href="/">&larr; Back to all plans</a>
        <header>
            <h1>${label}</h1>
            <div class="meta">
                <div class="meta-item"><span class="meta-label">Teacher:</span><span>Mr. McCarthy</span></div>
                <div class="meta-item"><span class="meta-label">Week:</span><span>${weekStr}</span></div>
            </div>
        </header>

        <div class="overview">
            <div class="overview-title">Week at a Glance</div>
            <div class="overview-body">Plans for this week have not been posted yet.</div>
        </div>
${daySection('Monday',    mon)}
${daySection('Tuesday',   tue)}
${daySection('Wednesday', wed)}
${daySection('Thursday',  thu)}
${daySection('Friday',    fri)}
    </div>
</body>
</html>`;
}

// ── WRITE COURSE FILES ────────────────────────────────────────────────────────
COURSES.forEach(course => {
  const dir  = path.join(PUBLIC_DIR, course);
  const file = path.join(dir, `${nextKey}.html`);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(file, buildHtml(course, nextMonday), 'utf8');
  console.log(`  ✓ Created ${course}/${nextKey}.html`);
});

// ── UPDATE INDEX.HTML ─────────────────────────────────────────────────────────
const newEntry   = `{ key: "${nextKey}", range: "${nextRange}" }`;
const updatedIdx = indexHtml.replace(
  /const weeks = \[([\s\S]*?)\];/,
  (_, inner) => {
    const trimmed   = inner.trimEnd().replace(/,$/, '');
    const separator = trimmed.trim().length > 0 ? ',\n            ' : '\n            ';
    return `const weeks = [${trimmed}${separator}${newEntry}\n        ];`;
  }
);
fs.writeFileSync(INDEX_PATH, updatedIdx, 'utf8');
console.log(`  ✓ index.html updated — added ${nextKey} (${nextRange})`);

// ── DEPLOY ────────────────────────────────────────────────────────────────────
if (process.argv.includes('--deploy')) {
  console.log('\nDeploying to Firebase (lesson-plans-paps)...');
  try {
    execSync('firebase deploy --only hosting:lesson-plans-paps', { cwd: ROOT, stdio: 'inherit' });
    console.log('✓ Deploy complete.');
  } catch (err) {
    console.error('✗ Deploy failed:', err.message);
    process.exit(1);
  }
} else {
  console.log('\nDone. Run with --deploy to push to Firebase, or commit and deploy manually.');
}
