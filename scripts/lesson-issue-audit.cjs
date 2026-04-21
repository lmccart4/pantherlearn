const admin = require('firebase-admin');
admin.initializeApp({ projectId: 'pantherlearn-d6f7c' });
const db = admin.firestore();

const CUTOFF = '2026-04-16';

(async () => {
  const coursesSnap = await db.collection('courses').get();
  const courses = [];
  coursesSnap.forEach(d => {
    const dd = d.data();
    courses.push({ id: d.id, name: dd.name || dd.title || d.id });
  });

  const issues = []; // {course, lesson, kind, detail}
  let inScope = 0;

  for (const c of courses) {
    const ls = await db.collection('courses').doc(c.id).collection('lessons').get();
    for (const ldoc of ls.docs) {
      const l = ldoc.data();
      const due = l.dueDate || l.due || l.dueAt;
      const dueStr = typeof due === 'string' ? due : (due && due.toDate ? due.toDate().toISOString().slice(0,10) : null);
      if (dueStr && dueStr < CUTOFF) continue; // out of scope
      inScope++;
      const vis = l.visible !== false;

      const blocks = l.blocks || [];
      const mcCorrects = []; // for distribution check
      let scoredEmbedCount = 0;
      for (const b of blocks) {
        // Missing/invalid MC correctIndex
        if (b.type === 'question' && b.questionType === 'multiple_choice') {
          if (b.correctIndex === undefined) {
            if (b.correct !== undefined) {
              issues.push({ c: c.name, lesson: ldoc.id, kind: 'MC uses old `correct` field', detail: `block ${b.id}` });
            } else {
              issues.push({ c: c.name, lesson: ldoc.id, kind: 'MC missing correctIndex', detail: `block ${b.id}` });
            }
          } else {
            mcCorrects.push(b.correctIndex);
            // range check
            const opts = b.options || [];
            if (b.correctIndex < 0 || b.correctIndex >= opts.length) {
              issues.push({ c: c.name, lesson: ldoc.id, kind: 'MC correctIndex out of range', detail: `block ${b.id} idx=${b.correctIndex} opts=${opts.length}` });
            }
            if (opts.length !== 4) {
              issues.push({ c: c.name, lesson: ldoc.id, kind: 'MC not 4 options', detail: `block ${b.id} has ${opts.length}` });
            }
          }
        }
        // Text block content field
        if (b.type === 'text' && !b.content) {
          if (b.text) issues.push({ c: c.name, lesson: ldoc.id, kind: 'text block uses `text` not `content`', detail: b.id });
          else issues.push({ c: c.name, lesson: ldoc.id, kind: 'text block empty', detail: b.id });
        }
        // Callout content field
        if (b.type === 'callout' && !b.content) {
          if (b.text) issues.push({ c: c.name, lesson: ldoc.id, kind: 'callout uses `text` not `content`', detail: b.id });
        }
        // Scored embed should have weight 5
        if (b.type === 'embed' && b.scored) {
          scoredEmbedCount++;
          if (b.weight !== 5) issues.push({ c: c.name, lesson: ldoc.id, kind: 'scored embed weight != 5', detail: `block ${b.id} weight=${b.weight}` });
        }
        // External link URL missing
        if (b.type === 'external_link' && !b.url) {
          issues.push({ c: c.name, lesson: ldoc.id, kind: 'external_link missing url', detail: b.id });
        }
        // Image missing URL
        if (b.type === 'image' && !(b.imageUrl || b.url || b.src)) {
          issues.push({ c: c.name, lesson: ldoc.id, kind: 'image block missing url', detail: b.id });
        }
        // Unknown block types vs registry
      }
      // MC distribution skew (if >=4 MCs)
      if (mcCorrects.length >= 4) {
        const counts = [0,0,0,0];
        mcCorrects.forEach(i => { if (i >= 0 && i < 4) counts[i]++; });
        const max = Math.max(...counts);
        if (max / mcCorrects.length > 0.6) {
          issues.push({ c: c.name, lesson: ldoc.id, kind: 'MC answer distribution skew', detail: `counts=${counts.join('/')}` });
        }
      }
      // Empty lesson
      if (blocks.length === 0) {
        issues.push({ c: c.name, lesson: ldoc.id, kind: 'empty lesson', detail: '' });
      }
      // gradesReleased check — if visible, has scored blocks, and due today or past, warn if not released
      const hasScored = blocks.some(b => (b.type === 'embed' && b.scored) || (b.type === 'question'));
      if (vis && hasScored && dueStr && dueStr <= new Date().toISOString().slice(0,10) && l.gradesReleased !== true) {
        issues.push({ c: c.name, lesson: ldoc.id, kind: 'gradesReleased not set for live scored lesson', detail: `due=${dueStr}` });
      }
    }
  }

  console.log(`\n=== AUDIT: ${inScope} in-scope visible lessons (due >= ${CUTOFF} or no due date) ===\n`);
  if (!issues.length) { console.log('No issues found.'); process.exit(0); }

  // Group by kind
  const byKind = {};
  issues.forEach(it => { (byKind[it.kind] = byKind[it.kind] || []).push(it); });
  for (const kind of Object.keys(byKind).sort()) {
    console.log(`--- ${kind} (${byKind[kind].length}) ---`);
    byKind[kind].slice(0, 15).forEach(it => console.log(`  ${it.c} / ${it.lesson} :: ${it.detail}`));
    if (byKind[kind].length > 15) console.log(`  ... +${byKind[kind].length - 15} more`);
  }
  process.exit(0);
})();
