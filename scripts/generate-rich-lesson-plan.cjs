#!/usr/bin/env node
'use strict';

/**
 * generate-rich-lesson-plan.cjs
 * Generates a rich HTML lesson plan page matching the W25 canonical format.
 *
 * Usage:
 *   node scripts/generate-rich-lesson-plan.cjs \
 *     --course <physics|ai-literacy|digital-literacy> \
 *     --week <W21|W22|W27|W28|W29|W30> \
 *     --out <path>
 *
 * Idempotent — rerunning produces the same output.
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// ─── Course config ────────────────────────────────────────────────────────────
const COURSE_CONFIG = {
  physics: {
    displayName: 'Physics',
    firestoreId: 'physics',
    accent: '#f87171',
    accentBg: '#7f1d1d33',
    accentBorder: '#f8717133',
    reflectionBg: '#7f1d1d44',
    reflectionBgFaint: '#7f1d1d11',
    reflectionBorder: '#f8717133',
    reflectionLabel: '#f87171',
    standards: 'NGSS HS-PS3-1, HS-PS3-2 (Energy)',
  },
  'ai-literacy': {
    displayName: 'AI Literacy',
    firestoreId: 'Y9Gdhw5MTY8wMFt6Tlvj',
    accent: '#a78bfa',
    accentBg: '#4c1d9533',
    accentBorder: '#a78bfa33',
    reflectionBg: '#4c1d9544',
    reflectionBgFaint: '#4c1d9511',
    reflectionBorder: '#a78bfa33',
    reflectionLabel: '#a78bfa',
    standards: 'CSTA 3A-AP-13, ISTE 1.1',
  },
  'digital-literacy': {
    displayName: 'Digital Literacy',
    firestoreId: 'digital-literacy',
    accent: '#38bdf8',
    accentBg: '#0c4a6e33',
    accentBorder: '#38bdf833',
    reflectionBg: '#0c4a6e44',
    reflectionBgFaint: '#0c4a6e11',
    reflectionBorder: '#38bdf833',
    reflectionLabel: '#38bdf8',
    standards: 'NJSLS 8.1.8.DA.1, ISTE 1.2',
  },
};

// ─── Week metadata ────────────────────────────────────────────────────────────
const WEEK_META = {
  W21: { label: 'W21', range: 'Feb 16 – Feb 20', start: '2026-02-16', end: '2026-02-20', mon: 'Feb 16', days: ['Feb 16', 'Feb 17', 'Feb 18', 'Feb 19', 'Feb 20'], year: 2026, month: 2, day1: 16 },
  W22: { label: 'W22', range: 'Feb 23 – Feb 27', start: '2026-02-23', end: '2026-02-27', mon: 'Feb 23', days: ['Feb 23', 'Feb 24', 'Feb 25', 'Feb 26', 'Feb 27'], year: 2026, month: 2, day1: 23 },
  W27: { label: 'W27', range: 'Mar 30 – Apr 3', start: '2026-03-30', end: '2026-04-03', mon: 'Mar 30', days: ['Mar 30', 'Mar 31', 'Apr 1', 'Apr 2', 'Apr 3'], year: 2026, month: 3, day1: 30 },
  W28: { label: 'W28', range: 'Apr 6 – Apr 10', start: '2026-04-06', end: '2026-04-10', mon: 'Apr 6', days: ['Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10'], year: 2026, month: 4, day1: 6, springBreak: true },
  W29: { label: 'W29', range: 'Apr 13 – Apr 17', start: '2026-04-13', end: '2026-04-17', mon: 'Apr 13', days: ['Apr 13', 'Apr 14', 'Apr 15', 'Apr 16', 'Apr 17'], year: 2026, month: 4, day1: 13, psatDay: 'Apr 15' },
  W30: { label: 'W30', range: 'Apr 20 – Apr 24', start: '2026-04-20', end: '2026-04-24', mon: 'Apr 20', days: ['Apr 20', 'Apr 21', 'Apr 22', 'Apr 23', 'Apr 24'], year: 2026, month: 4, day1: 20 },
};

const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

// ─── Date helpers ─────────────────────────────────────────────────────────────
function dateKeyForDay(week, dayIdx) {
  // dayIdx: 0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri
  // Build a YYYY-MM-DD from week start + offset
  const wm = WEEK_META[week];
  const base = new Date(wm.start + 'T12:00:00Z');
  base.setUTCDate(base.getUTCDate() + dayIdx);
  const y = base.getUTCFullYear();
  const m = String(base.getUTCMonth() + 1).padStart(2, '0');
  const d = String(base.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDateLong(dateStr) {
  // dateStr: 'YYYY-MM-DD'
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const [y, m, d] = dateStr.split('-').map(Number);
  return `${months[m-1]} ${d}, ${y}`;
}

// ─── Block extraction helpers ─────────────────────────────────────────────────
function extractObjectives(blocks) {
  const obj = blocks.find(b => b.type === 'objectives');
  if (!obj) return [];
  const items = obj.items || obj.objectives || [];
  return items.filter(Boolean);
}

function extractDoNow(blocks) {
  // Find section_header with "Warm Up" or "Do Now", then take next text/callout/question block
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.type === 'section_header') {
      const label = (b.title || b.label || '').toLowerCase();
      if (label.includes('warm') || label.includes('do now')) {
        // Look ahead for content block
        if (i + 1 < blocks.length) {
          const next = blocks[i + 1];
          if (next.type === 'question') {
            return next.prompt || null;
          }
          if (next.type === 'text' || next.type === 'callout') {
            return next.content || next.text || null;
          }
        }
      }
    }
  }
  return null;
}

function extractTimeline(blocks) {
  const sections = [];
  for (const b of blocks) {
    if (b.type === 'section_header') {
      const title = b.title || b.label || '';
      if (title) sections.push(title);
    }
  }
  return sections;
}

function extractExitTicket(blocks) {
  // Find exit ticket question or section
  for (let i = blocks.length - 1; i >= 0; i--) {
    const b = blocks[i];
    if (b.type === 'section_header') {
      const label = (b.title || b.label || '').toLowerCase();
      if (label.includes('exit') || label.includes('wrap')) {
        if (i + 1 < blocks.length) {
          const next = blocks[i + 1];
          if (next.type === 'question') return next.prompt || null;
          if (next.type === 'text' || next.type === 'callout') return next.content || next.text || null;
        }
      }
    }
    if (b.type === 'question') {
      const prompt = (b.prompt || '').toLowerCase();
      if (prompt.includes('exit') || (i === blocks.length - 1)) {
        const fullPrompt = b.prompt || '';
        if (fullPrompt.length > 20) return fullPrompt;
      }
    }
  }
  return null;
}

// ─── HTML escape ──────────────────────────────────────────────────────────────
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(str, len) {
  if (!str) return '';
  if (str.length <= len) return str;
  return str.slice(0, len) + '…';
}

// ─── CSS template ─────────────────────────────────────────────────────────────
function buildCSS(cfg) {
  return `    * { margin: 0; padding: 0; box-sizing: border-box; }

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
      background: linear-gradient(135deg, ${cfg.reflectionBg}, ${cfg.reflectionBgFaint});
      border: 1px solid ${cfg.reflectionBorder};
      border-radius: 10px;
      padding: 1.25rem 1.5rem;
      margin-bottom: 1.5rem;
    }
    .weekly-reflection-label {
      font-size: 0.7rem; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.1em; color: ${cfg.reflectionLabel}; margin-bottom: 0.5rem;
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
    .lesson-card.has-content { border-color: ${cfg.accent}22; }
    .lesson-card.has-content:hover { border-color: ${cfg.accent}55; }

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
      letter-spacing: 0.06em; color: ${cfg.accent};
      background: ${cfg.accentBg}; border: 1px solid ${cfg.accentBorder};
      border-radius: 20px; padding: 0.3rem 0.75rem; white-space: nowrap;
    }
    .no-lesson { color: #444; font-style: italic; padding: 0.5rem 0; }
    .lesson-body { margin-top: 0.5rem; }

    /* Standards pill */
    .standards-pill {
      display: inline-block; font-size: 0.7rem; font-weight: 600;
      color: ${cfg.accent}; background: ${cfg.accentBg};
      border: 1px solid ${cfg.accentBorder}; border-radius: 20px;
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
      width: 3px; background: ${cfg.accent}; border-radius: 2px;
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
      background: #1a1a1a; border-left: 3px solid ${cfg.accent};
      border-radius: 0 8px 8px 0; padding: 1.25rem 1.5rem;
      margin: 1rem 0 1.5rem 0;
    }
    .do-now-label {
      font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.1em; color: ${cfg.accent}; margin-bottom: 0.5rem;
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
      background: ${cfg.accent}; border: 2px solid #151515;
      z-index: 1;
    }
    .timeline-time {
      font-size: 0.75rem; font-weight: 600; color: ${cfg.accent};
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
    .timeline-resource { margin-top: 0.4rem; }
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
    }`;
}

// ─── Lesson card HTML ─────────────────────────────────────────────────────────
function buildLessonCard(dayName, dateStr, lesson, cfg) {
  if (!lesson) {
    return `      <div class="lesson-card">
        <div class="lesson-header"><div><div class="lesson-day">${dayName}</div></div></div>
        <div class="no-lesson">No lesson scheduled</div>
      </div>`;
  }

  const objectives = extractObjectives(lesson.blocks || []);
  const doNow = extractDoNow(lesson.blocks || []);
  const timeline = extractTimeline(lesson.blocks || []);
  const exitTicket = extractExitTicket(lesson.blocks || []);
  const unit = lesson.unit || '';

  let bodyHtml = `<div class="standards-pill">${esc(cfg.standards)}</div>`;

  if (objectives.length > 0) {
    bodyHtml += `<ul class="objectives-list">`;
    objectives.forEach(o => { bodyHtml += `<li>${esc(o)}</li>`; });
    bodyHtml += `</ul>`;
  }

  if (doNow) {
    bodyHtml += `<div class="do-now-box">
          <div class="do-now-label">Do Now / Warm Up</div>
          <div class="do-now-content">${esc(truncate(doNow, 300))}</div>
        </div>`;
  }

  if (timeline.length > 0) {
    bodyHtml += `<div class="section-label">Key Activities</div>
        <ul class="activity-list">`;
    timeline.forEach(t => { bodyHtml += `<li>${esc(t)}</li>`; });
    bodyHtml += `</ul>`;
  }

  if (exitTicket) {
    bodyHtml += `<div class="exit-ticket-box">
          <div class="exit-ticket-label">Exit Ticket</div>
          <div class="exit-ticket-content">${esc(truncate(exitTicket, 250))}</div>
        </div>`;
  }

  const unitPill = unit
    ? `<div class="lesson-unit-pill">${esc(unit)}</div>`
    : '';

  return `      <div class="lesson-card has-content">
        <div class="lesson-header">
          <div>
            <div class="lesson-day">${dayName}</div>
            <div class="lesson-title">${esc(lesson.title)}</div>
            <div class="lesson-date">${formatDateLong(dateStr)}</div>
          </div>
          ${unitPill}
        </div>
        <div class="lesson-body">${bodyHtml}</div>
      </div>`;
}

function buildBreakCard(dayName, message) {
  return `      <div class="lesson-card">
        <div class="lesson-header"><div><div class="lesson-day">${dayName}</div></div></div>
        <div class="no-lesson">${message}</div>
      </div>`;
}

// ─── Week at a glance & reflection text ──────────────────────────────────────
function buildOverview(week, lessons) {
  const wm = WEEK_META[week];

  if (wm.springBreak) {
    return 'Spring Break — no classes all week.';
  }

  const parts = [];
  lessons.forEach((l, idx) => {
    if (l) {
      const dayName = DAY_NAMES[idx];
      parts.push(`<strong>${dayName}:</strong> ${esc(l.title)}`);
    }
  });

  // W29: add PSAT day note
  if (week === 'W29') {
    parts.splice(2, 0, '<strong>Wednesday:</strong> PSAT/SAT Day — No Class');
  }

  return parts.join('<br>') || 'No lessons scheduled this week.';
}

function buildReflection(week, course, lessons, wm) {
  if (wm.springBreak) {
    return 'Spring Break — April 6–10. No classes. Use the time to review pacing and prep Week 29 materials.';
  }

  const lessonTitles = lessons.filter(Boolean).map(l => l.title);
  if (lessonTitles.length === 0) {
    return 'No lessons scheduled this week. Review pacing and adjust upcoming plans as needed.';
  }

  // Build retrospective reflections based on week/course
  const reflections = {
    'W21-physics': 'Introduced momentum conservation through thought experiment and crash investigation — students grappled with the core idea before the math.',
    'W22-physics': 'Wrapped momentum with experimental testing and an assessment lab — a satisfying unit close that let students own the data.',
    'W21-ai-literacy': 'Kicked off generative AI: what it is, how smart it really is, and how training data shapes output. Four lessons, fast pacing.',
    'W22-ai-literacy': 'Closed Foundations of Generative AI with a bias deep dive and quiz. Students came in skeptical and left with real questions.',
    'W21-digital-literacy': 'Jumped into WeVideo production — AI is everywhere opener, then straight into Basics and Storytelling Structure. Production starts.',
    'W22-digital-literacy': 'Finished WeVideo projects with a share-out and pivoted into Gaming & Esports as a new thread. Clean unit transition.',
    'W27-physics': 'Reviewed Work & Energy with an Escape Room then wrapped with a Weight Room lab assessment. Students applied energy concepts to real movement.',
    'W27-ai-literacy': 'Heavy week — Creativity Escape Room quiz, storybook project, image prompt engineering, content moderation. Cross-cutting unit themes clicked.',
    'W27-digital-literacy': 'Closed Data Literacy with the Vault Cracker quiz, then launched Algorithm Economy with three quick lessons on recommendation systems.',
    'W29-physics': 'Returned from PSAT break with one extra-credit Energy Audit, then started Electrostatics with The Mysterious Machine. New unit energy is good.',
    'W29-ai-literacy': 'Post-PSAT week: Hallucination Hunt for extra credit, then pivoted to AI Ethics — who decides what AI learns? Students had opinions.',
    'W29-digital-literacy': 'Post-PSAT week: Digital Footprint Audit (2 days) for extra credit, then Filter Bubbles and Virality. Algorithm Economy arc deepening.',
    'W30-physics': 'Full week of Electrostatics — charge rules, diagrams, why neutral objects attract. Conceptual scaffolding before the math.',
    'W30-ai-literacy': 'AI in the Real World unit launch: healthcare, courtroom, hiring, policing, art. One sector per day. Students connected AI to their own futures.',
    'W30-digital-literacy': 'Digital Entrepreneurship unit launched — Creator Economy through Revenue Models. Five lessons in five days, each building on the last.',
  };

  const key = `${week}-${course}`.toLowerCase().replace('w', 'W');
  const reflKey = week + '-' + course;
  return reflections[reflKey] || `${wm.label} (${wm.range}): covered ${lessonTitles.slice(0, 3).join(', ')}${lessonTitles.length > 3 ? ', and more' : ''}.`;
}

// ─── Main generator ───────────────────────────────────────────────────────────
async function generate(courseName, week, outPath) {
  const cfg = COURSE_CONFIG[courseName];
  if (!cfg) throw new Error('Unknown course: ' + courseName);
  const wm = WEEK_META[week];
  if (!wm) throw new Error('Unknown week: ' + week);

  // Init Firestore if not already
  if (!admin.apps.length) {
    admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
  }
  const db = admin.firestore();

  // Fetch lessons
  let rawLessons = [];
  if (!wm.springBreak) {
    const snap = await db.collection(`courses/${cfg.firestoreId}/lessons`)
      .where('dueDate', '>=', wm.start)
      .where('dueDate', '<=', wm.end)
      .get();
    snap.forEach(doc => rawLessons.push({ id: doc.id, ...doc.data() }));
    rawLessons.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
  }

  // Map lessons to day slots (Mon=0 .. Fri=4)
  const dayLessons = [null, null, null, null, null];
  for (const lesson of rawLessons) {
    const dueDate = lesson.dueDate;
    if (!dueDate) continue;
    for (let di = 0; di < 5; di++) {
      if (dateKeyForDay(week, di) === dueDate) {
        // If multiple lessons on same day, use first (or append to title)
        if (!dayLessons[di]) {
          dayLessons[di] = lesson;
        } else {
          // Combine titles
          dayLessons[di]._extraTitle = (dayLessons[di]._extraTitle || '') + ' / ' + lesson.title;
        }
      }
    }
  }

  // Build cards
  const cards = [];
  for (let di = 0; di < 5; di++) {
    const dayName = DAY_NAMES[di];
    const dateStr = dateKeyForDay(week, di);
    const dayLabel = wm.days[di];

    if (wm.springBreak) {
      cards.push(buildBreakCard(dayName, 'Spring Break — No Class'));
    } else if (week === 'W29' && dayLabel === 'Apr 15') {
      cards.push(buildBreakCard(dayName, 'PSAT/SAT Day — No Class'));
    } else {
      const lesson = dayLessons[di];
      if (lesson && lesson._extraTitle) {
        lesson.title = lesson.title + ' / ' + lesson._extraTitle;
        delete lesson._extraTitle;
      }
      cards.push(buildLessonCard(dayName, dateStr, lesson, cfg));
    }
  }

  // Overview and reflection
  const overviewBody = buildOverview(week, dayLessons);
  const reflectionText = buildReflection(week, courseName, dayLessons.filter(Boolean), wm);

  const css = buildCSS(cfg);
  const weekLabel = wm.label + ' (' + wm.range + ')';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(cfg.displayName)} — ${wm.label} Lesson Plan</title>
  <style>
${css}
  </style>
</head>
<body>
  <div class="container">
    <a class="back" href="/">&larr; Back to all plans</a>
    <header>
      <h1>${esc(cfg.displayName)}</h1>
      <div class="meta">
        <div class="meta-item"><span class="meta-label">Teacher:</span><span>Mr. McCarthy</span></div>
        <div class="meta-item"><span class="meta-label">Week:</span><span>${esc(weekLabel)}</span></div>
        <div class="meta-item"><span class="meta-label">School:</span><span>Perth Amboy HS</span></div>
      </div>
    </header>

    <div class="weekly-reflection">
      <div class="weekly-reflection-label">Weekly Teaching Reflection</div>
      <div class="weekly-reflection-text">${esc(reflectionText)}</div>
    </div>

    <div class="overview">
      <div class="overview-title">Week at a Glance</div>
      <div class="overview-body">${overviewBody}</div>
    </div>

${cards.join('\n')}
  </div>
</body>
</html>`;

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, 'utf8');
  console.log('Written: ' + outPath + ' (' + html.length + ' bytes)');
}

// ─── CLI ──────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2);
  let course = null, week = null, outPath = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--course') course = args[++i];
    else if (args[i] === '--week') week = args[++i];
    else if (args[i] === '--out') outPath = args[++i];
  }
  if (!course || !week || !outPath) {
    console.error('Usage: node generate-rich-lesson-plan.cjs --course <...> --week <W21|...> --out <path>');
    process.exit(1);
  }
  if (!admin.apps.length) {
    admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
  }
  await generate(course, week, outPath);
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
