/**
 * Generate lesson plan HTML pages from Firestore lesson data.
 * Gold-standard template with: Do Now, Timeline, Exit Ticket, Standards, Reflection.
 */
const admin = require('firebase-admin');
if (!admin.apps.length) admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, 'lesson-plans-public');

// Course configs
const COURSES = [
  { id: 'physics', firestoreId: 'physics', label: 'Physics', color: '#f87171', accent: '#dc2626', accentDark: '#7f1d1d' },
  { id: 'ai-literacy', firestoreId: 'Y9Gdhw5MTY8wMFt6Tlvj', label: 'AI Literacy', color: '#a78bfa', accent: '#4f46e5', accentDark: '#4c1d95' },
  { id: 'digital-literacy', firestoreId: 'digital-literacy', label: 'Digital Literacy', color: '#38bdf8', accent: '#4f46e5', accentDark: '#0c4a6e' },
];

// School calendar weeks — Monday start dates
const WEEKS = [
  { key: '2026-W22', range: 'Mar 2 – Mar 6', start: '2026-03-02', end: '2026-03-06' },
  { key: '2026-W23', range: 'Mar 9 – Mar 13', start: '2026-03-09', end: '2026-03-13' },
  { key: '2026-W24', range: 'Mar 16 – Mar 20', start: '2026-03-16', end: '2026-03-20' },
  { key: '2026-W25', range: 'Mar 23 – Mar 27', start: '2026-03-23', end: '2026-03-27' },
  { key: '2026-W26', range: 'Mar 30 – Apr 3', start: '2026-03-30', end: '2026-04-03' },
];

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

function getWeekday(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.getDay(); // 0=Sun, 1=Mon...
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderMarkdownBasic(text) {
  if (!text) return '';
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

/**
 * Classify blocks into structured lesson plan sections:
 * doNow, objectives, timeline entries, exitTicket, standards
 */
function classifyBlocks(blocks) {
  if (!blocks || !blocks.length) return { doNow: null, objectives: null, timeline: [], exitTicket: null, standards: null };

  let doNow = null;
  let objectives = null;
  let exitTicket = null;
  let standards = null;
  const timeline = [];

  // Collect all question-type blocks to identify the last one as exit ticket
  const questionIndices = [];
  blocks.forEach((b, i) => {
    if (b.type === 'question' || b.type === 'multiple_choice') questionIndices.push(i);
  });
  const lastQuestionIdx = questionIndices.length > 0 ? questionIndices[questionIndices.length - 1] : -1;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];

    // Objectives block
    if (block.type === 'objectives') {
      objectives = block;
      // Check for standards in the block
      if (block.standards) standards = block.standards;
      continue;
    }

    // Callout: check if it's a Do Now / warm-up
    if (block.type === 'callout') {
      const style = (block.style || '').toLowerCase();
      const title = (block.title || '').toLowerCase();
      const content = (block.content || '').toLowerCase();
      if (style === 'warm-up' || style === 'warmup' || style === 'do-now' ||
          title.includes('do now') || title.includes('warm up') || title.includes('warm-up') ||
          title.includes('bellringer') || title.includes('bell ringer') ||
          content.includes('do now')) {
        if (!doNow) {
          doNow = block;
          continue;
        }
      }
      // Regular callout → timeline
      timeline.push({ type: 'callout', block });
      continue;
    }

    // Question blocks: last one = exit ticket, others = timeline
    if (block.type === 'question' || block.type === 'multiple_choice') {
      if (i === lastQuestionIdx && questionIndices.length > 0) {
        exitTicket = block;
      } else {
        timeline.push({ type: block.type === 'multiple_choice' ? 'check' : 'discussion', block });
      }
      continue;
    }

    // Embed blocks → interactive activity in timeline
    if (block.type === 'embed') {
      timeline.push({ type: 'activity', block });
      continue;
    }

    // Section header → section break in timeline
    if (block.type === 'section_header') {
      timeline.push({ type: 'section', block });
      continue;
    }

    // Text blocks → content in timeline
    if (block.type === 'text') {
      timeline.push({ type: 'instruction', block });
      continue;
    }

    // Info blocks → callout style in timeline
    if (block.type === 'info') {
      timeline.push({ type: 'callout', block: { ...block, type: 'callout', style: 'info' } });
      continue;
    }

    // Everything else with content → instruction
    if (block.content) {
      timeline.push({ type: 'instruction', block });
    }
  }

  return { doNow, objectives, timeline, exitTicket, standards };
}

/**
 * Estimate time allocations for timeline entries (total ~35 min class period minus 5 min do-now, 5 min exit ticket)
 */
function allocateTimes(timeline) {
  const totalMinutes = 35; // usable time for main instruction
  const count = timeline.filter(t => t.type !== 'section').length;
  if (count === 0) return [];

  let perBlock;
  if (count === 1) perBlock = totalMinutes;
  else if (count <= 3) perBlock = Math.floor(totalMinutes / count);
  else perBlock = Math.min(10, Math.floor(totalMinutes / count));

  let elapsed = 5; // start after do-now
  return timeline.map(entry => {
    if (entry.type === 'section') return { ...entry, timeLabel: null };
    const start = elapsed;
    const duration = perBlock;
    elapsed += duration;
    return { ...entry, timeLabel: `${start}-${start + duration} min` };
  });
}

// Default standards by course + unit keywords
const STANDARDS_MAP = {
  physics: {
    _default: 'NGSS HS-PS2',
    'momentum': 'NGSS HS-PS2-2 (Conservation of Momentum)',
    'energy': 'NGSS HS-PS3-1, HS-PS3-2 (Energy)',
    'force': 'NGSS HS-PS2-1 (Newton\'s Laws)',
    'motion': 'NGSS HS-PS2-1 (Motion & Forces)',
    'wave': 'NGSS HS-PS4-1 (Waves)',
    'circuit': 'NGSS HS-PS2-5 (Electrical Forces)',
    'magnet': 'NGSS HS-PS2-5 (Electromagnetic Forces)',
  },
  'ai-literacy': {
    _default: 'CSTA 3A-AP-13, ISTE 1.1',
    'ethics': 'CSTA 3B-IC-25 (Equity & Ethics)',
    'bias': 'CSTA 3B-IC-25, ISTE 1.2 (Digital Citizen)',
    'creative': 'ISTE 1.6 (Creative Communicator)',
    'prompt': 'CSTA 3A-AP-13 (Abstraction)',
    'neural': 'CSTA 3A-DA-12 (Data & Analysis)',
    'embed': 'CSTA 3A-DA-12 (Data Representation)',
  },
  'digital-literacy': {
    _default: 'NJSLS 8.1.8.DA.1, ISTE 1.2',
    'password': 'NJSLS 8.1.8.NI.2 (Network Security)',
    'footprint': 'ISTE 1.2 (Digital Citizen)',
    'phish': 'NJSLS 8.1.8.NI.2 (Cybersecurity)',
    'canva': 'NJSLS 8.1.8.DA.5 (Design)',
    'campaign': 'NJSLS 8.1.8.DA.1, 8.1.8.DA.5',
    'algorithm': 'CSTA 3A-AP-13 (Algorithms)',
  },
};

function getStandard(courseId, lesson) {
  const map = STANDARDS_MAP[courseId] || {};
  const title = (lesson.title || '').toLowerCase();
  const unit = (lesson.unit || '').toLowerCase();
  const search = title + ' ' + unit;
  for (const [keyword, std] of Object.entries(map)) {
    if (keyword === '_default') continue;
    if (search.includes(keyword)) return std;
  }
  return map._default || '';
}

function renderLessonContent(lesson, course) {
  const { doNow, objectives, timeline, exitTicket } = classifyBlocks(lesson.blocks || []);
  const timedEntries = allocateTimes(timeline);

  let html = '';

  // Standards pill
  const stdText = lesson.standards || lesson.standard || getStandard(course.id, lesson);
  if (stdText) {
    html += `<div class="standards-pill">${escapeHtml(typeof stdText === 'string' ? stdText : Array.isArray(stdText) ? stdText.join(', ') : '')}</div>`;
  }

  // Learning Objectives
  if (objectives && objectives.items && objectives.items.length) {
    html += `<ul class="objectives-list">`;
    objectives.items.forEach(item => {
      const clean = item.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      html += `<li>${escapeHtml(clean)}</li>`;
    });
    html += `</ul>`;
  }

  // Do Now — one line
  if (doNow) {
    const text = (doNow.content || doNow.title || '').replace(/\n/g, ' ').trim();
    if (text) {
      html += `<div class="do-now-box">`;
      html += `<div class="do-now-label">Do Now</div>`;
      html += `<div class="do-now-content">${escapeHtml(text.length > 160 ? text.slice(0, 160) + '…' : text)}</div>`;
      html += `</div>`;
    }
  }

  // Key Activities — only show embeds, named callouts, and section headers (skip generic text/question blocks)
  const activities = [];
  for (const entry of timedEntries) {
    if (entry.type === 'activity') {
      activities.push(entry.block.caption || entry.block.title || 'Interactive Activity');
    } else if (entry.type === 'callout' && entry.block.title) {
      const title = entry.block.title.replace(/\*\*/g, '');
      if (title.length > 5 && title.length < 80) activities.push(title);
    } else if (entry.type === 'section') {
      const title = (entry.block.title || '').trim();
      if (title && title.toLowerCase() !== 'exit ticket') activities.push(title);
    }
  }
  if (activities.length > 0) {
    html += `<div class="section-label">Key Activities</div>`;
    html += `<ul class="activity-list">`;
    activities.forEach(a => { html += `<li>${escapeHtml(a)}</li>`; });
    html += `</ul>`;
  }

  // Exit Ticket
  if (exitTicket) {
    const prompt = (exitTicket.prompt || exitTicket.question || '').replace(/\n/g, ' ').trim();
    if (prompt) {
      html += `<div class="exit-ticket-box">`;
      html += `<div class="exit-ticket-label">Exit Ticket</div>`;
      html += `<div class="exit-ticket-content">${escapeHtml(prompt.length > 180 ? prompt.slice(0, 180) + '…' : prompt)}</div>`;
      html += `</div>`;
    }
  }

  return html;
}

function generateWeekHtml(course, week, lessons) {
  const daySlots = new Array(5).fill(null);

  for (const lesson of lessons) {
    if (!lesson.dueDate) continue;
    const dow = getWeekday(lesson.dueDate);
    if (dow >= 1 && dow <= 5) {
      daySlots[dow - 1] = lesson;
    }
  }

  let lessonsHtml = '';
  for (let i = 0; i < 5; i++) {
    const lesson = daySlots[i];
    if (!lesson) {
      lessonsHtml += `
        <div class="lesson-card">
          <div class="lesson-header"><div><div class="lesson-day">${DAYS[i]}</div></div></div>
          <div class="no-lesson">No lesson scheduled</div>
        </div>`;
      continue;
    }

    const contentHtml = renderLessonContent(lesson, course);
    const unit = lesson.unit || '';

    lessonsHtml += `
      <div class="lesson-card has-content">
        <div class="lesson-header">
          <div>
            <div class="lesson-day">${DAYS[i]}</div>
            <div class="lesson-title">${escapeHtml(lesson.title)}</div>
            <div class="lesson-date">${formatDate(lesson.dueDate)}</div>
          </div>
          ${unit ? `<div class="lesson-unit-pill">${escapeHtml(unit)}</div>` : ''}
        </div>
        <div class="lesson-body">${contentHtml}</div>
      </div>`;
  }

  const overviewItems = lessons.map(l => {
    const dow = getWeekday(l.dueDate);
    const dayName = dow >= 1 && dow <= 5 ? DAYS[dow - 1] : '';
    return `<strong>${dayName}:</strong> ${escapeHtml(l.title)}`;
  });
  const overviewHtml = overviewItems.join('<br>') || 'No lessons this week';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${course.label} — ${week.key} Lesson Plan</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;
      background: #0d0d0d;
      color: #e3e3e3;
      line-height: 1.6;
      padding: 2rem;
    }

    .container { max-width: 900px; margin: 0 auto; }

    a.back {
      display: inline-flex; align-items: center; gap: 0.4rem;
      color: #60a5fa; text-decoration: none; font-size: 0.85rem;
      margin-bottom: 2rem; transition: color 0.2s;
    }
    a.back:hover { color: #93c5fd; }

    /* Header */
    header {
      border-bottom: 1px solid #2a2a2a;
      padding-bottom: 2rem; margin-bottom: 2rem;
    }
    h1 {
      font-size: 2.5rem; font-weight: 600; color: #fff;
      margin-bottom: 0.5rem; letter-spacing: -0.02em;
    }
    .meta {
      display: flex; gap: 2rem; margin-top: 1rem;
      font-size: 0.9rem; color: #8b8b8b; flex-wrap: wrap;
    }
    .meta-item { display: flex; align-items: center; gap: 0.5rem; }
    .meta-label { color: #5b5b5b; font-weight: 500; }

    /* Weekly Reflection */
    .weekly-reflection {
      background: linear-gradient(135deg, ${course.accentDark}44, ${course.accentDark}11);
      border: 1px solid ${course.color}33;
      border-radius: 10px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    .weekly-reflection-label {
      font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: ${course.color}; margin-bottom: 0.5rem;
    }
    .weekly-reflection-text {
      color: #94a3b8; font-size: 0.9rem; line-height: 1.7;
      font-style: italic;
    }

    /* Week at a Glance */
    .overview {
      background: #0f172a; border: 1px solid #1e293b;
      border-radius: 8px; padding: 1.5rem; margin-bottom: 2rem;
    }
    .overview-title {
      font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: #60a5fa; margin-bottom: 0.75rem;
    }
    .overview-body { color: #94a3b8; line-height: 1.8; font-size: 0.9rem; }
    .overview-body strong { color: #cbd5e1; }

    /* Lesson Cards */
    .lesson-card {
      background: #151515; border: 1px solid #2a2a2a;
      border-radius: 10px; padding: 2rem; margin-bottom: 2rem;
      transition: border-color 0.2s;
    }
    .lesson-card:hover {
      border-color: #3a3a3a;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .lesson-card.has-content { border-color: ${course.color}22; }
    .lesson-card.has-content:hover { border-color: ${course.color}55; }

    .lesson-header {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid #222;
    }
    .lesson-day {
      font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: #555; margin-bottom: 0.4rem;
    }
    .lesson-title {
      font-size: 1.4rem; font-weight: 600; color: #fff; margin-bottom: 0.25rem;
    }
    .lesson-date { font-size: 0.85rem; color: #666; font-weight: 500; }
    .lesson-unit-pill {
      font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.06em; color: ${course.color};
      background: ${course.accentDark}33; border: 1px solid ${course.color}33;
      border-radius: 20px; padding: 0.3rem 0.75rem; white-space: nowrap;
    }
    .no-lesson { color: #444; font-style: italic; padding: 0.5rem 0; }
    .lesson-body { margin-top: 0.5rem; }

    /* Standards pill */
    .standards-pill {
      display: inline-block; font-size: 0.7rem; font-weight: 600;
      color: ${course.color}; background: ${course.accentDark}33;
      border: 1px solid ${course.color}33; border-radius: 20px;
      padding: 0.25rem 0.75rem; margin-bottom: 1rem;
      letter-spacing: 0.04em;
    }

    /* Section labels */
    .section-label {
      font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: #666; margin-bottom: 0.75rem;
      margin-top: 1.5rem; padding-left: 12px; position: relative;
    }
    .section-label::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0;
      width: 3px; background: ${course.color}; border-radius: 2px;
    }
    .section-label:first-child { margin-top: 0; }

    /* Objectives */
    .objectives-list {
      padding-left: 1.5rem; color: #8b9eb7; font-size: 0.9rem;
      margin-bottom: 1rem;
    }
    .objectives-list li { margin-bottom: 0.4rem; }

    /* Do Now box */
    .do-now-box {
      background: #1a1a1a; border-left: 3px solid ${course.color};
      border-radius: 0 8px 8px 0; padding: 1.25rem 1.5rem;
      margin: 1rem 0 1.5rem 0;
    }
    .do-now-label {
      font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: ${course.color}; margin-bottom: 0.5rem;
    }
    .do-now-title { font-weight: 600; color: #e2e8f0; margin-bottom: 0.4rem; }
    .do-now-content { color: #94a3b8; font-size: 0.9rem; line-height: 1.7; }

    /* Timeline */
    .timeline { position: relative; padding-left: 24px; margin: 0.5rem 0 1.5rem 0; }
    .timeline::before {
      content: ''; position: absolute; left: 5px; top: 12px; bottom: 12px;
      width: 2px; background: #2a2a2a;
    }
    .timeline-entry {
      position: relative; margin-bottom: 1.5rem; padding-left: 16px;
    }
    .timeline-dot {
      position: absolute; left: -24px; top: 6px;
      width: 12px; height: 12px; border-radius: 50%;
      background: ${course.color}; border: 2px solid #151515;
      z-index: 1;
    }
    .timeline-time {
      font-size: 0.75rem; font-weight: 600; color: ${course.color};
      margin-bottom: 0.25rem; letter-spacing: 0.02em;
    }
    .timeline-body { }
    .timeline-activity-name {
      font-weight: 600; color: #e2e8f0; font-size: 0.95rem;
      margin-bottom: 0.3rem;
    }
    .timeline-desc {
      color: #94a3b8; font-size: 0.9rem; line-height: 1.7;
    }
    .timeline-desc strong { color: #cbd5e1; }
    .timeline-question { font-style: italic; color: #cbd5e1; }
    .timeline-resource {
      margin-top: 0.4rem;
    }
    .timeline-resource a {
      color: #60a5fa; text-decoration: none; font-size: 0.85rem;
      transition: color 0.2s;
    }
    .timeline-resource a:hover { color: #93c5fd; }
    .timeline-section-break {
      font-size: 0.85rem; font-weight: 600; color: #fff;
      margin: 0.5rem 0 0.75rem; padding-top: 0.5rem;
      border-top: 1px solid #2a2a2a;
    }
    .mc-options {
      padding-left: 1.5rem; margin-top: 0.5rem;
      color: #8b9eb7; font-size: 0.85rem; list-style: none;
    }
    .mc-options li { margin-bottom: 0.25rem; }

    /* Exit Ticket box */
    .exit-ticket-box {
      background: #1a1a1a; border-left: 3px solid #10b981;
      border-radius: 0 8px 8px 0; padding: 1.25rem 1.5rem;
      margin: 1.5rem 0 1rem 0;
    }
    .exit-ticket-label {
      font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: #10b981; margin-bottom: 0.5rem;
    }
    .exit-ticket-content {
      color: #cbd5e1; font-size: 0.9rem; line-height: 1.7; font-style: italic;
    }
    .exit-mc { margin-top: 0.5rem; }

    /* Activity list */
    .activity-list {
      padding-left: 1.25rem; margin: 0.25rem 0 1rem;
      color: #94a3b8; font-size: 0.85rem;
    }
    .activity-list li { margin-bottom: 0.2rem; }

    /* Resources */
    .resources-list {
      display: flex; flex-direction: column; gap: 0.5rem;
      margin-top: 0.5rem;
    }
    .resource-link {
      color: #60a5fa; text-decoration: none; font-size: 0.85rem;
      transition: color 0.2s;
    }
    .resource-link:hover { color: #93c5fd; }

    /* Print-friendly */
    @media print {
      body { background: #fff; color: #111; padding: 1rem; }
      .lesson-card { border-color: #ddd; box-shadow: none; background: #fff; }
      .do-now-box, .exit-ticket-box { background: #f9f9f9; }
      .timeline-dot { background: #333; }
      a.back { display: none; }
    }

    @media (max-width: 768px) {
      body { padding: 1rem; }
      h1 { font-size: 1.8rem; }
      .meta { flex-direction: column; gap: 0.5rem; }
      .lesson-card { padding: 1.25rem; }
      .lesson-header { flex-direction: column; gap: 0.5rem; }
    }
  </style>
</head>
<body>
  <div class="container">
    <a class="back" href="/">&larr; Back to all plans</a>
    <header>
      <h1>${course.label}</h1>
      <div class="meta">
        <div class="meta-item"><span class="meta-label">Teacher:</span><span>Mr. McCarthy</span></div>
        <div class="meta-item"><span class="meta-label">Week:</span><span>${week.key.split('-')[1]} (${week.range})</span></div>
        <div class="meta-item"><span class="meta-label">School:</span><span>Perth Amboy HS</span></div>
      </div>
    </header>

    <div class="weekly-reflection">
      <div class="weekly-reflection-label">Weekly Teaching Reflection</div>
      <div class="weekly-reflection-text">Review this week's pacing and student engagement. Note which activities resonated and which need adjustment for future planning.</div>
    </div>

    <div class="overview">
      <div class="overview-title">Week at a Glance</div>
      <div class="overview-body">${overviewHtml}</div>
    </div>

    ${lessonsHtml}
  </div>
</body>
</html>`;
}

async function main() {
  let totalFiles = 0;

  for (const course of COURSES) {
    const lessonsSnap = await db.collection('courses').doc(course.firestoreId).collection('lessons').get();
    const allLessons = lessonsSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      .filter(l => l.dueDate); // Include hidden lessons — plan site is for teachers, not students

    console.log(`\n${course.label}: ${allLessons.length} lessons with due dates`);

    const outDir = path.join(OUT_DIR, course.id);
    fs.mkdirSync(outDir, { recursive: true });

    for (const week of WEEKS) {
      const weekLessons = allLessons.filter(l => {
        return l.dueDate >= week.start && l.dueDate <= week.end;
      }).sort((a, b) => a.dueDate.localeCompare(b.dueDate));

      if (weekLessons.length === 0) {
        console.log(`  ${week.key}: no lessons — skipping`);
        continue;
      }

      const html = generateWeekHtml(course, week, weekLessons);
      const outPath = path.join(outDir, `${week.key}.html`);
      fs.writeFileSync(outPath, html);
      console.log(`  ${week.key}: ${weekLessons.length} lessons → ${outPath}`);
      totalFiles++;
    }
  }

  console.log(`\nDone. Generated ${totalFiles} weekly plan pages.`);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
