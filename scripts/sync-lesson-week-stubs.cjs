#!/usr/bin/env node
// scripts/sync-lesson-week-stubs.cjs
//
// Pulls lesson data from Firestore (via dueDate) and populates the
// lesson-plans-public stub HTML files that generate-lesson-week.cjs created.
//
// Usage:
//   node scripts/sync-lesson-week-stubs.cjs             # sync all weeks
//   node scripts/sync-lesson-week-stubs.cjs --week 2026-W24  # sync one week
//   node scripts/sync-lesson-week-stubs.cjs --deploy    # sync + firebase deploy
//   node scripts/sync-lesson-week-stubs.cjs --week 2026-W24 --deploy

'use strict';

const admin = require('firebase-admin');
const fs    = require('fs');
const path  = require('path');
const { execSync } = require('child_process');

// ── FIREBASE ──────────────────────────────────────────────────────────────────
if (!admin.apps.length) {
  admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
}
const db = admin.firestore();

// ── CONFIG ────────────────────────────────────────────────────────────────────
const ROOT       = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT, 'lesson-plans-public');
const INDEX_PATH = path.join(PUBLIC_DIR, 'index.html');
const MONTHS     = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const MONTH_FULL = ['January','February','March','April','May','June',
                    'July','August','September','October','November','December'];
const DAYS       = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// Course → Firestore courseIds (AI Literacy deduped across sections)
const COURSE_CONFIG = {
  'ai-literacy': {
    label: 'AI Literacy',
    courseIds: [
      'Y9Gdhw5MTY8wMFt6Tlvj', // P4
      'DacjJ93vUDcwqc260OP3', // P5
      'M2MVSXrKuVCD9JQfZZyp', // P7
      'fUw67wFhAtobWFhjwvZ5', // P9
    ],
    dedupe: true, // lessons are identical across sections — use title to dedupe
  },
  'physics': {
    label: 'Physics',
    courseIds: ['physics'],
    dedupe: false,
  },
  'digital-literacy': {
    label: 'Digital Literacy',
    courseIds: ['digital-literacy'],
    dedupe: false,
  },
};

// ── WEEK KEY HELPERS ──────────────────────────────────────────────────────────
// Returns the ISO week Monday for a given date
function getWeekMonday(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun 6=Sat
  const diff = day === 0 ? -6 : 1 - day; // Monday=0 offset
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

// Returns YYYY-Wnn key for a date
function getWeekKey(date) {
  const mon = getWeekMonday(date);
  // ISO week number: Jan 4 is always in week 1
  const jan4 = new Date(mon.getFullYear(), 0, 4);
  const w1Mon = getWeekMonday(jan4);
  const weekNum = Math.round((mon - w1Mon) / (7 * 24 * 60 * 60 * 1000)) + 1;
  return `${mon.getFullYear()}-W${weekNum}`;
}

// Parses a YYYY-Wnn key into { year, weekNum }
function parseWeekKey(key) {
  const m = key.match(/^(\d{4})-W(\d+)$/);
  if (!m) return null;
  return { year: parseInt(m[1]), weekNum: parseInt(m[2]) };
}

// Returns Monday date for a YYYY-Wnn key
function mondayFromKey(key) {
  const { year, weekNum } = parseWeekKey(key);
  // Jan 4 of the year is always week 1
  const jan4 = new Date(year, 0, 4);
  const w1Mon = getWeekMonday(jan4);
  const mon = new Date(w1Mon);
  mon.setDate(mon.getDate() + (weekNum - 1) * 7);
  return mon;
}

function fmt(d) {
  return `${MONTH_FULL[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function dayOffset(monday, n) {
  const d = new Date(monday);
  d.setDate(d.getDate() + n);
  return d;
}

// ── PARSE INDEX FOR WEEKS ─────────────────────────────────────────────────────
// Returns [{ key, range, monday: Date }]
function getWeeksFromIndex() {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');
  const m = html.match(/const weeks = \[([\s\S]*?)\];/);
  if (!m) throw new Error('Could not find weeks array in index.html');
  return [...m[1].matchAll(/\{\s*key:\s*"([^"]+)",\s*range:\s*"([^"]+)"\s*\}/g)]
    .map(e => {
      const key   = e[1];
      const range = e[2];
      // range format: "Mar 16 – Mar 20"  — parse the first date as Monday
      const rangeM = range.match(/(\w+)\s+(\d+)/);
      const year   = parseInt(key.match(/^(\d{4})/)[1]);
      const monIdx = MONTHS.indexOf(rangeM[1]);
      const monday = new Date(year, monIdx, parseInt(rangeM[2]));
      return { key, range, monday };
    });
}

// ── FIRESTORE FETCH ───────────────────────────────────────────────────────────
// Returns lessons for a course that have dueDates within [mondayStr, fridayStr] (YYYY-MM-DD)
async function fetchLessonsForWeek(courseSlug, mondayDate) {
  const config = COURSE_CONFIG[courseSlug];
  const friday = dayOffset(mondayDate, 4);

  const mondayStr = mondayDate.toISOString().slice(0, 10);
  const fridayStr = friday.toISOString().slice(0, 10);

  const lessonMap = new Map(); // title → lesson (for deduplication)

  for (const courseId of config.courseIds) {
    const snap = await db.collection('courses').doc(courseId)
      .collection('lessons')
      .where('dueDate', '>=', mondayStr)
      .where('dueDate', '<=', fridayStr)
      .get();

    for (const doc of snap.docs) {
      const data = { id: doc.id, ...doc.data() };
      if (data.visible === false) continue; // skip drafts
      const key = config.dedupe ? data.title : `${courseId}:${doc.id}`;
      if (!lessonMap.has(key)) {
        lessonMap.set(key, data);
      }
    }
  }

  return Array.from(lessonMap.values());
}

// ── HTML GENERATION ───────────────────────────────────────────────────────────
function buildObjectivesHtml(lesson) {
  // Pull learning objectives from the objectives block if it exists
  const objBlock = (lesson.blocks || []).find(b => b.type === 'objectives');
  if (!objBlock || !objBlock.items || objBlock.items.length === 0) return '';
  const items = objBlock.items.slice(0, 3); // cap at 3
  return `
            <ul class="lesson-objectives">
              ${items.map(i => `<li>${i}</li>`).join('\n              ')}
            </ul>`;
}

function buildDaySection(dayName, date, lesson) {
  if (!lesson) {
    return `
        <!-- ${dayName.toUpperCase()} -->
        <div class="lesson-section">
            <div class="lesson-header">
                <div>
                    <div class="lesson-day">${dayName}</div>
                    <div class="lesson-title">— Not yet posted —</div>
                    <div class="lesson-date">${fmt(date)}</div>
                </div>
            </div>
            <p class="no-lesson">Lesson plan for this day has not been posted yet.</p>
        </div>`;
  }

  const unit = lesson.unit ? `<div class="lesson-unit">${lesson.unit}</div>` : '';
  const qod = lesson.questionOfTheDay
    ? `<div class="lesson-qod"><span class="qod-label">Question of the Day:</span> ${lesson.questionOfTheDay}</div>`
    : '';
  const objectives = buildObjectivesHtml(lesson);

  return `
        <!-- ${dayName.toUpperCase()} -->
        <div class="lesson-section has-content">
            <div class="lesson-header">
                <div>
                    <div class="lesson-day">${dayName}</div>
                    <div class="lesson-title">${lesson.title}</div>
                    <div class="lesson-date">${fmt(date)}</div>
                </div>
            </div>
            ${unit}
            ${qod}
            ${objectives}
        </div>`;
}

function buildHtml(courseSlug, weekKey, monday, lessonsByDay) {
  const config = COURSE_CONFIG[courseSlug];
  const { weekNum } = parseWeekKey(weekKey);
  const friday = dayOffset(monday, 4);
  const weekStr = `${weekNum} (${MONTHS[monday.getMonth()]} ${monday.getDate()}–${MONTHS[friday.getMonth()]} ${friday.getDate()}, ${monday.getFullYear()})`;

  // Determine overview text
  const hasAny = Object.values(lessonsByDay).some(Boolean);
  const overviewBody = hasAny
    ? Object.entries(lessonsByDay)
        .filter(([, l]) => l)
        .map(([, l]) => l.title)
        .join(', ')
    : 'Plans for this week have not been posted yet.';

  const [mon, tue, wed, thu, fri] = [0,1,2,3,4].map(i => dayOffset(monday, i));

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.label} — Week ${weekNum} Lesson Plan</title>
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
        .lesson-section.has-content { border-color: #1e3a2f; }
        .lesson-section.has-content:hover { border-color: #02C39A; }
        .lesson-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid #222; }
        .lesson-day { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 0.5rem; }
        .lesson-title { font-size: 1.5rem; font-weight: 600; color: #fff; margin-bottom: 0.25rem; }
        .lesson-date { font-size: 0.85rem; color: #888; font-weight: 500; }
        .lesson-unit { font-size: 0.8rem; color: #02C39A; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 0.75rem; }
        .lesson-qod { font-size: 0.95rem; color: #94a3b8; margin-bottom: 0.75rem; font-style: italic; }
        .qod-label { color: #5b6b73; font-style: normal; font-weight: 600; }
        .lesson-objectives { margin-top: 0.5rem; padding-left: 1.25rem; color: #8b9eb7; font-size: 0.9rem; }
        .lesson-objectives li { margin-bottom: 0.25rem; }
        .no-lesson { color: #555; font-style: italic; padding: 1rem 0; }
        @media (max-width: 768px) { body { padding: 1rem; } h1 { font-size: 1.8rem; } .meta { flex-direction: column; gap: 0.5rem; } }
    </style>
</head>
<body>
    <div class="container">
        <a class="back" href="/">&larr; Back to all plans</a>
        <header>
            <h1>${config.label}</h1>
            <div class="meta">
                <div class="meta-item"><span class="meta-label">Teacher:</span><span>Mr. McCarthy</span></div>
                <div class="meta-item"><span class="meta-label">Week:</span><span>${weekStr}</span></div>
            </div>
        </header>

        <div class="overview">
            <div class="overview-title">Week at a Glance</div>
            <div class="overview-body">${overviewBody}</div>
        </div>
${buildDaySection('Monday',    mon, lessonsByDay.monday)}
${buildDaySection('Tuesday',  tue, lessonsByDay.tuesday)}
${buildDaySection('Wednesday',wed, lessonsByDay.wednesday)}
${buildDaySection('Thursday', thu, lessonsByDay.thursday)}
${buildDaySection('Friday',   fri, lessonsByDay.friday)}
    </div>
</body>
</html>`;
}

// ── SYNC ONE WEEK + COURSE ────────────────────────────────────────────────────
async function syncWeekCourse(weekKey, monday, courseSlug) {
  const lessons = await fetchLessonsForWeek(courseSlug, monday);

  if (lessons.length === 0) {
    // Nothing in Firestore for this week — leave stub as-is
    return { weekKey, courseSlug, updated: false, count: 0 };
  }

  // Map lessons to weekdays by dueDate
  const lessonsByDay = { monday: null, tuesday: null, wednesday: null, thursday: null, friday: null };
  const dayKeys = ['monday','tuesday','wednesday','thursday','friday'];

  for (const lesson of lessons) {
    if (!lesson.dueDate) continue;
    const d = new Date(lesson.dueDate + 'T12:00:00'); // noon to avoid TZ issues
    const dayIndex = d.getDay(); // 0=Sun, 1=Mon ... 5=Fri
    if (dayIndex >= 1 && dayIndex <= 5) {
      const key = dayKeys[dayIndex - 1];
      // If multiple lessons on same day, keep the one with higher order or just first
      if (!lessonsByDay[key] || (lesson.order || 999) < (lessonsByDay[key].order || 999)) {
        lessonsByDay[key] = lesson;
      }
    }
  }

  const html = buildHtml(courseSlug, weekKey, monday, lessonsByDay);
  const dir  = path.join(PUBLIC_DIR, courseSlug);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, `${weekKey}.html`), html, 'utf8');

  return { weekKey, courseSlug, updated: true, count: lessons.length };
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  const weekArg  = args.includes('--week')  ? args[args.indexOf('--week')  + 1] : null;
  const deploy   = args.includes('--deploy');

  // Determine which weeks to sync
  const allWeeks = getWeeksFromIndex();
  let weeks;
  if (weekArg) {
    const found = allWeeks.find(w => w.key === weekArg);
    if (!found) { console.error(`Week ${weekArg} not found in index.html`); process.exit(1); }
    weeks = [found];
  } else {
    weeks = allWeeks;
  }

  console.log(`Syncing ${weeks.length} week(s) from Firestore...\n`);

  let totalUpdated = 0;
  for (const { key: weekKey, monday } of weeks) {
    for (const courseSlug of Object.keys(COURSE_CONFIG)) {
      const result = await syncWeekCourse(weekKey, monday, courseSlug);
      if (result.updated) {
        console.log(`  ✓ ${weekKey} / ${courseSlug} — ${result.count} lesson(s) populated`);
        totalUpdated++;
      } else {
        console.log(`  · ${weekKey} / ${courseSlug} — no lessons with dueDate this week (stub unchanged)`);
      }
    }
  }

  console.log(`\n${totalUpdated} file(s) updated.`);

  if (deploy) {
    console.log('\nDeploying to Firebase (lesson-plans-paps)...');
    execSync('firebase deploy --only hosting:lesson-plans-paps', { cwd: ROOT, stdio: 'inherit' });
    console.log('✓ Deploy complete.');
  } else if (totalUpdated > 0) {
    console.log('Run with --deploy to push to Firebase.');
  }

  process.exit(0);
}

main().catch(err => {
  console.error('✗', err.message);
  process.exit(1);
});
