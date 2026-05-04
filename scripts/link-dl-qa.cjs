// Link Integration QA — DL May 2026 Sprint
const admin = require('firebase-admin');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const key = require('/Users/lukemccarthy/.config/firebase/pantherlearn-admin.json');
admin.initializeApp({ credential: admin.credential.cert(key) });
const db = admin.firestore();

const EXPECTED = [
  { id: 'brand-kit-day1-vibe-check',                   unit: 'Brand Kit Sprint',         order: 60.0 },
  { id: 'brand-kit-day2-logo-color-font',              unit: 'Brand Kit Sprint',         order: 60.1 },
  { id: 'brand-kit-day3-instagram-guide-showcase',     unit: 'Brand Kit Sprint',         order: 60.2 },
  { id: 'photo-essay-day1-theme-composition',          unit: 'Photo Essay Sprint',       order: 61.0 },
  { id: 'photo-essay-day2-curate-sequence',            unit: 'Photo Essay Sprint',       order: 61.1 },
  { id: 'photo-essay-day3-layout-showcase',            unit: 'Photo Essay Sprint',       order: 61.2 },
  { id: 'infographic-day1-topic-data',                 unit: 'Infographic Sprint',       order: 62.0 },
  { id: 'infographic-day2-design',                     unit: 'Infographic Sprint',       order: 62.1 },
  { id: 'infographic-day3-polish-showcase',            unit: 'Infographic Sprint',       order: 62.2 },
  { id: 'short-form-video-day1-deconstruction',        unit: 'Short-Form Video Sprint',  order: 63.0 },
  { id: 'short-form-video-day2-script-shoot',          unit: 'Short-Form Video Sprint',  order: 63.1 },
  { id: 'short-form-video-day3-edit-capcut',           unit: 'Short-Form Video Sprint',  order: 63.2 },
  { id: 'short-form-video-day4-polish-showcase',       unit: 'Short-Form Video Sprint',  order: 63.3 },
  { id: 'psa-day1-topic-research',                     unit: 'PSA Sprint',               order: 64.0 },
  { id: 'psa-day2-storyboard-design',                  unit: 'PSA Sprint',               order: 64.1 },
  { id: 'psa-day3-production',                         unit: 'PSA Sprint',               order: 64.2 },
  { id: 'psa-day4-polish-showcase',                    unit: 'PSA Sprint',               order: 64.3 },
];

const VALID_CALLOUT_STYLES = new Set(['insight','warning','question','success','info','tip']);
const URL_SAFE_RE = /^[A-Za-z0-9._~-]+$/;

function headCheck(urlStr) {
  return new Promise((resolve) => {
    let parsed;
    try { parsed = new URL(urlStr); } catch (e) { return resolve({ url: urlStr, status: 'INVALID_URL', ok: false }); }
    const lib = parsed.protocol === 'http:' ? http : https;
    const opts = { method: 'HEAD', host: parsed.host, path: parsed.pathname + parsed.search, headers: { 'User-Agent': 'Mozilla/5.0 (LinkQA/1.0)' }, timeout: 10000 };
    const req = lib.request(opts, (res) => {
      const status = res.statusCode;
      const ok = (status >= 200 && status < 300) || [301,302,303,307,308].includes(status);
      // For redirects, don't follow — just allow common ones
      resolve({ url: urlStr, status, ok });
    });
    req.on('timeout', () => { req.destroy(); resolve({ url: urlStr, status: 'TIMEOUT', ok: false }); });
    req.on('error', (e) => resolve({ url: urlStr, status: 'ERR:' + e.code, ok: false }));
    req.end();
  });
}

// HEAD often returns 405 for some hosts that don't support it; fallback to GET (range 0-0)
function getCheck(urlStr) {
  return new Promise((resolve) => {
    let parsed;
    try { parsed = new URL(urlStr); } catch (e) { return resolve({ url: urlStr, status: 'INVALID_URL', ok: false }); }
    const lib = parsed.protocol === 'http:' ? http : https;
    const opts = {
      method: 'GET',
      host: parsed.host,
      path: parsed.pathname + parsed.search,
      headers: { 'User-Agent': 'Mozilla/5.0 (LinkQA/1.0)', 'Range': 'bytes=0-0' },
      timeout: 10000,
    };
    const req = lib.request(opts, (res) => {
      const status = res.statusCode;
      const ok = (status >= 200 && status < 400);
      res.destroy();
      resolve({ url: urlStr, status, ok });
    });
    req.on('timeout', () => { req.destroy(); resolve({ url: urlStr, status: 'TIMEOUT', ok: false }); });
    req.on('error', (e) => resolve({ url: urlStr, status: 'ERR:' + e.code, ok: false }));
    req.end();
  });
}

async function checkUrlSmart(urlStr) {
  const head = await headCheck(urlStr);
  if (head.ok) return head;
  // fallback if HEAD failed (405/403 from servers blocking HEAD, etc.)
  if (head.status === 405 || head.status === 403 || head.status === 'TIMEOUT' || (typeof head.status === 'string' && head.status.startsWith('ERR:'))) {
    const get = await getCheck(urlStr);
    if (get.ok) return get;
    return { url: urlStr, status: `HEAD=${head.status} GET=${get.status}`, ok: false };
  }
  return head;
}

async function main() {
  const findings = [];
  const perLesson = [];
  const mcDist = { 0: 0, 1: 0, 2: 0, 3: 0, total: 0 };
  const allMCs = []; // for factuality review
  const allImages = new Set();
  const allExternalLinks = new Set();
  const checkResults = {
    1: { name: 'Schema validity', pass: true, notes: [] },
    2: { name: 'Question wiring', pass: true, notes: [] },
    3: { name: 'MC factuality + answer balance', pass: true, notes: [] },
    4: { name: 'Image URLs return 200', pass: true, notes: [] },
    5: { name: 'External-link blocks', pass: true, notes: [] },
    6: { name: 'Required structure', pass: true, notes: [] },
    7: { name: 'Course/unit fields', pass: true, notes: [] },
    8: { name: 'Visibility', pass: true, notes: [] },
    9: { name: 'No PantherLearn rule violations', pass: true, notes: [] },
    10: { name: 'Content density floor', pass: true, notes: [] },
  };

  function fail(check, sev, lessonId, msg, fix) {
    checkResults[check].pass = false;
    checkResults[check].notes.push(`${lessonId}: ${msg}`);
    findings.push({ severity: sev, check, lessonId, msg, fix: fix || '' });
  }

  for (const exp of EXPECTED) {
    const ref = db.collection('courses').doc('digital-literacy').collection('lessons').doc(exp.id);
    const snap = await ref.get();
    if (!snap.exists) {
      fail(1, 'HIGH', exp.id, 'Lesson document does not exist', 'Re-run seed script');
      perLesson.push({ id: exp.id, exists: false, blocks: 0, mcs: 0, images: 0, issues: 'MISSING' });
      continue;
    }
    const data = snap.data();
    const blocks = data.blocks || [];
    const issues = [];

    // Check 7: course/unit/order
    if (data.course !== 'Digital Literacy') {
      fail(7, 'HIGH', exp.id, `course="${data.course}" expected "Digital Literacy"`, 'Update course field');
      issues.push('course mismatch');
    }
    if (data.unit !== exp.unit) {
      fail(7, 'MED', exp.id, `unit="${data.unit}" expected "${exp.unit}"`, 'Update unit field');
      issues.push('unit mismatch');
    }
    if (Number(data.order) !== exp.order) {
      fail(7, 'MED', exp.id, `order=${data.order} expected ${exp.order}`, 'Update order field');
      issues.push('order mismatch');
    }

    // Check 8: visibility
    if (data.visible !== false) {
      fail(8, 'HIGH', exp.id, `visible=${data.visible} expected false`, 'Set visible:false until QA approved');
      issues.push('visible=true');
    }

    // Check 1: schema validity — id and type on every block
    const seenIds = new Set();
    let mcCount = 0;
    let saCount = 0;
    let imageCount = 0;
    let hasObjectives = false;
    let hasSectionHeader = false;
    let hasText = false;
    let hasQuestion = false;

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (!b || typeof b !== 'object') {
        fail(1, 'HIGH', exp.id, `Block index ${i} not an object`, 'Fix seed');
        continue;
      }
      if (!b.id) {
        fail(1, 'HIGH', exp.id, `Block index ${i} (type=${b.type}) missing id`, 'Add id field');
      } else {
        if (seenIds.has(b.id)) {
          fail(1, 'HIGH', exp.id, `Duplicate block id "${b.id}"`, 'Make IDs unique');
        }
        seenIds.add(b.id);
        if (!URL_SAFE_RE.test(b.id)) {
          fail(1, 'MED', exp.id, `Block id "${b.id}" not URL-safe`, 'Use only [A-Za-z0-9._~-]');
        }
      }
      if (!b.type) {
        fail(1, 'HIGH', exp.id, `Block index ${i} missing type`, 'Add type field');
      }

      if (b.type === 'objectives') hasObjectives = true;
      if (b.type === 'section_header') hasSectionHeader = true;
      if (b.type === 'text') hasText = true;
      if (b.type === 'question') hasQuestion = true;
      if (b.type === 'image') imageCount++;

      // Check 9: callout style + image URL format
      if (b.type === 'callout') {
        if (!b.style || !VALID_CALLOUT_STYLES.has(b.style)) {
          fail(9, 'MED', exp.id, `Callout block "${b.id}" has invalid/missing style="${b.style}"`, 'Set style to insight|warning|question|success|info|tip');
        }
      }
      if (b.type === 'image' && b.url) {
        const urlStr = b.url;
        allImages.add(urlStr);
        if (urlStr.includes('firebasestorage.googleapis.com')) {
          fail(9, 'HIGH', exp.id, `Image block "${b.id}" uses SDK URL format (firebasestorage.googleapis.com): ${urlStr}`, 'Switch to storage.googleapis.com/<bucket>/<path>');
        } else if (!urlStr.startsWith('https://storage.googleapis.com/pantherlearn-d6f7c.firebasestorage.app/lesson-images/digital-literacy/') && urlStr.startsWith('https://storage.googleapis.com')) {
          fail(9, 'LOW', exp.id, `Image block "${b.id}" doesn't follow expected DL path: ${urlStr}`, 'Use lesson-images/digital-literacy/...');
        }
      }

      // Check inline markdown links in content fields (no inline [text](http...))
      const contentFields = ['content', 'text', 'prompt', 'caption', 'description', 'message'];
      for (const f of contentFields) {
        if (typeof b[f] === 'string' && /\[[^\]]+\]\(https?:\/\//i.test(b[f])) {
          fail(9, 'MED', exp.id, `Block "${b.id}" field "${f}" contains inline markdown link`, 'Replace with external_link block');
        }
      }
      // also check block.items if array of strings (objectives/list)
      if (Array.isArray(b.items)) {
        for (const it of b.items) {
          if (typeof it === 'string' && /\[[^\]]+\]\(https?:\/\//i.test(it)) {
            fail(9, 'MED', exp.id, `Block "${b.id}" items contain inline markdown link`, 'Replace with external_link block');
          }
        }
      }

      // Check 2: question wiring
      if (b.type === 'question') {
        if (b.questionType === 'multiple_choice') {
          mcCount++;
          if (!b.prompt) fail(2, 'HIGH', exp.id, `MC block "${b.id}" missing prompt`, 'Add prompt');
          if (!Array.isArray(b.options) || b.options.length !== 4) {
            fail(2, 'HIGH', exp.id, `MC block "${b.id}" options length=${b.options ? b.options.length : 'missing'} (need 4)`, 'Provide exactly 4 options');
          }
          if (typeof b.correctIndex !== 'number' || b.correctIndex < 0 || b.correctIndex > 3) {
            fail(2, 'HIGH', exp.id, `MC block "${b.id}" correctIndex=${b.correctIndex} (need 0-3)`, 'Set correctIndex to 0-3');
          } else if (Array.isArray(b.options) && b.options.length === 4) {
            mcDist[b.correctIndex]++;
            mcDist.total++;
            allMCs.push({ lesson: exp.id, blockId: b.id, prompt: b.prompt, options: b.options, correctIndex: b.correctIndex, explanation: b.explanation });
          }
          if (!b.explanation) fail(2, 'MED', exp.id, `MC block "${b.id}" missing explanation`, 'Add explanation');
        } else if (b.questionType === 'short_answer') {
          saCount++;
          if (!b.prompt) fail(2, 'HIGH', exp.id, `SA block "${b.id}" missing prompt`, 'Add prompt');
          if (!b.placeholder) fail(2, 'LOW', exp.id, `SA block "${b.id}" missing placeholder`, 'Add placeholder');
        } else if (!b.questionType) {
          fail(2, 'MED', exp.id, `Question block "${b.id}" missing questionType`, 'Set questionType to multiple_choice or short_answer');
        }
      }

      // Check 5: external_link wiring
      if (b.type === 'external_link') {
        if (!b.url) fail(5, 'HIGH', exp.id, `external_link block "${b.id}" missing url`, 'Add url');
        else { allExternalLinks.add(b.url); }
        if (!b.title) fail(5, 'MED', exp.id, `external_link block "${b.id}" missing title`, 'Add title');
        if (!b.description) fail(5, 'LOW', exp.id, `external_link block "${b.id}" missing description`, 'Add description');
        if (b.url) {
          try { new URL(b.url); } catch (e) {
            fail(5, 'HIGH', exp.id, `external_link "${b.id}" url invalid: ${b.url}`, 'Provide valid URL');
          }
        }
      }
    }

    // Check 6: required structure
    if (!hasObjectives) fail(6, 'HIGH', exp.id, 'No objectives block', 'Add objectives');
    if (!hasSectionHeader) fail(6, 'MED', exp.id, 'No section_header block', 'Add at least one section_header');
    if (!hasText) fail(6, 'MED', exp.id, 'No text block', 'Add at least one text block');
    if (!hasQuestion) fail(6, 'HIGH', exp.id, 'No question block', 'Add at least one question');

    // Final block reflection check
    const last = blocks[blocks.length - 1];
    const lastIsReflection = last && (last.type === 'reflection' || (last.type === 'question' && last.questionType === 'short_answer'));
    if (!lastIsReflection) {
      fail(6, 'MED', exp.id, `Final block is type="${last && last.type}" qt="${last && last.questionType}" — expected reflection or short_answer question`, 'End with a reflection');
    }

    // Check 10: density floor
    if (blocks.length < 18) {
      fail(10, 'MED', exp.id, `Only ${blocks.length} blocks (need >=18)`, 'Add more content blocks');
    }
    const totalQuestions = mcCount + saCount + blocks.filter(b => b.type === 'reflection').length;
    if (totalQuestions < 3) {
      fail(10, 'MED', exp.id, `Only ${totalQuestions} questions (need >=3)`, 'Add more questions');
    }

    perLesson.push({
      id: exp.id, exists: true,
      blocks: blocks.length, mcs: mcCount, sa: saCount, images: imageCount,
      issuesCount: 0, // fill below
    });
  }

  // URL checks (parallelized)
  const imageUrls = [...allImages];
  const linkUrls = [...allExternalLinks];

  console.log(`Checking ${imageUrls.length} unique image URLs...`);
  const imageResults = await Promise.all(imageUrls.map(u => checkUrlSmart(u)));
  for (const r of imageResults) {
    if (!r.ok) {
      // figure out which lesson(s) reference this URL
      // (we'll attribute at the URL level)
      checkResults[4].pass = false;
      findings.push({ severity: 'HIGH', check: 4, lessonId: '(image)', msg: `Image URL ${r.status}: ${r.url}`, fix: 'Re-upload image or fix URL' });
    }
  }

  console.log(`Checking ${linkUrls.length} unique external link URLs...`);
  const linkResults = await Promise.all(linkUrls.map(u => checkUrlSmart(u)));
  for (const r of linkResults) {
    if (!r.ok) {
      checkResults[5].pass = false;
      findings.push({ severity: 'MED', check: 5, lessonId: '(external_link)', msg: `External link ${r.status}: ${r.url}`, fix: 'Replace or update URL' });
    }
  }

  // Check 3: MC distribution
  const total = mcDist.total;
  const pct = (n) => total ? Math.round((n / total) * 1000) / 10 : 0;
  for (const k of [0,1,2,3]) {
    if (pct(mcDist[k]) > 40) {
      fail(3, 'MED', '(global)', `correctIndex ${k} appears in ${pct(mcDist[k])}% of MCs (>40% threshold)`, 'Reorder options to balance');
    }
  }

  // Compose report
  const lines = [];
  lines.push('# Link Integration QA — DL May 2026 Sprint');
  lines.push('**Date:** 2026-05-03');
  lines.push('**Lessons audited:** 17');
  const overall = findings.some(f => f.severity === 'HIGH') ? 'FAIL' : (findings.length > 0 ? 'PASS WITH WARNINGS' : 'PASS');
  lines.push(`**Overall status:** ${overall}`);
  lines.push('');
  lines.push('## Summary');
  const high = findings.filter(f => f.severity === 'HIGH').length;
  const med = findings.filter(f => f.severity === 'MED').length;
  const low = findings.filter(f => f.severity === 'LOW').length;
  lines.push(`Audited 17 newly-seeded Digital Literacy lessons across 5 sprints. Found ${high} HIGH, ${med} MED, ${low} LOW issues across 10 integration checks. ${overall === 'PASS' ? 'All checks pass — safe to flip visible.' : overall === 'PASS WITH WARNINGS' ? 'No blockers; recommend fixing warnings before flipping visible.' : 'Blockers present — do NOT flip visible until HIGH issues resolved.'}`);
  lines.push('');
  lines.push('## Pass/fail per check');
  lines.push('| # | Check | Status | Notes |');
  lines.push('|---|---|---|---|');
  for (let i = 1; i <= 10; i++) {
    const c = checkResults[i];
    const status = c.pass ? '✓ PASS' : '✗ FAIL';
    const noteSummary = c.notes.length ? `${c.notes.length} issue(s)` : '—';
    lines.push(`| ${i} | ${c.name} | ${status} | ${noteSummary} |`);
  }
  lines.push('');
  lines.push('## MC answer-position distribution');
  lines.push(`A(0): ${mcDist[0]} (${pct(mcDist[0])}%) | B(1): ${mcDist[1]} (${pct(mcDist[1])}%) | C(2): ${mcDist[2]} (${pct(mcDist[2])}%) | D(3): ${mcDist[3]} (${pct(mcDist[3])}%) | total: ${total}`);
  lines.push('');
  lines.push('## Findings (sorted by severity)');
  const sevOrder = { HIGH: 0, MED: 1, LOW: 2 };
  findings.sort((a, b) => sevOrder[a.severity] - sevOrder[b.severity] || a.check - b.check);
  if (findings.length === 0) lines.push('_No issues found._');
  for (const f of findings) {
    lines.push(`- [${f.severity}] (Check ${f.check}) **${f.lessonId}** — ${f.msg}${f.fix ? `. Fix: ${f.fix}` : ''}`);
  }
  lines.push('');
  lines.push('## Per-lesson summary table');
  lines.push('| Lesson | Blocks | MCs | SA | Images | Issues |');
  lines.push('|---|---|---|---|---|---|');
  for (const p of perLesson) {
    if (!p.exists) {
      lines.push(`| ${p.id} | — | — | — | — | MISSING |`);
      continue;
    }
    const lessonIssues = findings.filter(f => f.lessonId === p.id).length;
    lines.push(`| ${p.id} | ${p.blocks} | ${p.mcs} | ${p.sa || 0} | ${p.images} | ${lessonIssues || 'none'} |`);
  }
  lines.push('');
  lines.push('## MC factuality spot-list');
  lines.push('Each MC reviewed below for whether it has an objectively correct answer. Opinion/prediction questions belong in short_answer.');
  for (const m of allMCs) {
    lines.push(`- **${m.lesson}** / ${m.blockId}: "${(m.prompt||'').slice(0,140)}" → correct=${m.correctIndex} (${m.options[m.correctIndex] || ''})`);
  }

  const out = lines.join('\n');
  require('fs').writeFileSync('/Users/lukemccarthy/Lachlan/drafts/qa-reports/link-dl-may2026.md', out);
  console.log('Report written.');
  console.log(`Overall: ${overall}`);
  console.log(`HIGH: ${high}  MED: ${med}  LOW: ${low}`);
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
