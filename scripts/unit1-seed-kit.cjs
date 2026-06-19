// unit1-seed-kit.cjs — shared block builders + safe seed wrapper for Physics Unit 1.
// NOTE: firebase-admin + safe-lesson-write are lazy-required *inside* seedLesson()
// so the pure block builders (and their unit tests) load with zero heavy deps —
// the worktree has no firebase-admin installed until the gated seed run.

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const sectionHeader = ({ icon = '⚡', title, subtitle }) =>
  ({ id: uid(), type: 'section_header', icon, title, ...(subtitle ? { subtitle } : {}) });

const objectives = (items, title = 'Learning Objectives') =>
  ({ id: uid(), type: 'objectives', title, items });

const text = (content) => ({ id: uid(), type: 'text', content });

const callout = ({ style = 'info', icon, title, content }) =>
  ({ id: uid(), type: 'callout', style, ...(icon ? { icon } : {}), ...(title ? { title } : {}), content });

const mc = ({ prompt, options, correctIndex, explanation, difficulty = 'understand', allCorrect = false }) =>
  ({ id: uid(), type: 'question', questionType: 'multiple_choice', prompt, options, correctIndex, allCorrect, explanation, difficulty });

const shortAnswer = ({ prompt, placeholder = 'Type your answer here…', difficulty = 'apply' }) =>
  ({ id: uid(), type: 'question', questionType: 'short_answer', prompt, placeholder, difficulty });

const cer = ({ prompt, claimHint = 'State your claim.', evidenceHint = 'Cite the data/observations that support it.', reasoningHint = 'Explain why that evidence proves the claim (use physics ideas).' }) =>
  ({ id: uid(), type: 'question', questionType: 'short_answer', difficulty: 'evaluate',
     prompt: `${prompt}\n\n**CLAIM:** ${claimHint}\n**EVIDENCE:** ${evidenceHint}\n**REASONING:** ${reasoningHint}`,
     placeholder: 'Claim: …\n\nEvidence: …\n\nReasoning: …' });

const ranking = ({ prompt, items, difficulty = 'apply' }) =>
  ({ id: uid(), type: 'question', questionType: 'ranking', prompt, items, difficulty });

// INTERACTIVE table — students type values into blank cells. rows/columns are arrays
// of {key,label} objects (NOT a 2D value array — Firestore forbids arrays nested in arrays).
const dataTable = ({ title, preset = 'numeric', rows, columns, ...rest }) =>
  ({ id: uid(), type: 'data_table', title, preset, ...(rows ? { rows } : {}), ...(columns ? { columns } : {}), ...rest });

// DISPLAY table — renders pre-filled reference data as a GFM markdown table inside a text
// block (renderMarkdown supports `| a | b |` + `| --- |`). Use this for data students READ;
// use dataTable for data students ENTER. `rows` is a 2D array but only used to build a string
// at construction time, so nothing nested-array is ever written to Firestore.
const mdTable = ({ headers, rows, lead, note }) => {
  const head = `| ${headers.join(' | ')} |`;
  const sep = `| ${headers.map(() => '---').join(' | ')} |`;
  const body = rows.map(r => `| ${r.join(' | ')} |`).join('\n');
  let md = `${head}\n${sep}\n${body}`;
  if (lead) md = `${lead}\n\n${md}`;
  if (note) md = `${md}\n\n*${note}*`;
  return text(md);
};

const barChart = ({ title, barCount = 3 }) => ({ id: uid(), type: 'bar_chart', title, barCount });

const sketch = ({ title, instructions, prompt }) =>
  ({ id: uid(), type: 'sketch', title, instructions, prompt });

const evidenceUpload = ({ title, instructions, prompt }) =>
  ({ id: uid(), type: 'evidence_upload', title, instructions, prompt });

const image = ({ url, alt, caption, width, height }) =>
  ({ id: uid(), type: 'image', url, alt, ...(caption ? { caption } : {}), ...(width ? { width } : {}), ...(height ? { height } : {}) });

const externalLink = ({ icon = '🔗', title, description, url, buttonLabel = 'Open' }) =>
  ({ id: uid(), type: 'external_link', icon, title, description, url, buttonLabel, openInNewTab: true });

const embed = ({ url, caption, height = 750, scored = true, weight = 5, maxScore = 5 }) =>
  ({ id: uid(), type: 'embed', url, caption, height, scored, weight, maxScore });

const rubric = ({ title, intro, linkedBlockId, totalPoints, criteria }) =>
  ({ id: uid(), type: 'rubric', title, ...(intro ? { intro } : {}), ...(linkedBlockId ? { linkedBlockId } : {}), totalPoints, criteria });

const teacherCheckpoint = ({ id, title, prompt, weight, levels }) =>
  ({ id: id || uid(), type: 'teacher_checkpoint', title, prompt, scored: true, weight, levels: levels || LEVELS_4(weight) });

// 4-level scale generator scaled to a max score.
function LEVELS_4(max) {
  return [
    { score: max, label: 'Advanced', description: 'Complete, accurate, and clearly reasoned.' },
    { score: +(max * 0.8).toFixed(2), label: 'Proficient', description: 'Mostly complete and accurate; minor gaps.' },
    { score: +(max * 0.6).toFixed(2), label: 'Developing', description: 'Partial; key ideas present but incomplete or unclear.' },
    { score: 0, label: 'Beginning', description: 'Missing or major misconceptions.' },
  ];
}

// 3-dimensional summative rubric (spec §6): DCI / SEP / CCC, 4 levels each.
const rubric3D = ({ title, intro = 'Each summative is scored on three dimensions.', linkedBlockId, totalPoints = 15 }) => {
  const per = +(totalPoints / 3).toFixed(2);
  const dim = (id, name, advanced) => ({
    id, name, weight: per,
    levels: [
      { score: per, label: 'Advanced', description: advanced },
      { score: +(per * 0.8).toFixed(2), label: 'Proficient', description: 'Mostly correct with minor gaps.' },
      { score: +(per * 0.6).toFixed(2), label: 'Developing', description: 'Partial understanding; notable gaps.' },
      { score: 0, label: 'Beginning', description: 'Missing or fundamentally incorrect.' },
    ],
  });
  return rubric({ title, intro, linkedBlockId, totalPoints, criteria: [
    dim('dci', 'Science Ideas (DCI)', 'Correctly uses energy transfer/conservation, fields, induction, and resource ideas.'),
    dim('sep', 'Science Practice (SEP)', 'Models, designs solutions, or analyzes data rigorously; CER is complete.'),
    dim('ccc', 'Crosscutting Lens (CCC)', 'Applies energy & matter, systems, and stability & change to reason.'),
  ]});
};

async function seedLesson(db, courseId, lesson) {
  const admin = require('firebase-admin');
  const { safeLessonWrite } = require('./safe-lesson-write.cjs');
  const ref = db.collection('courses').doc(courseId).collection('lessons').doc(lesson.id);
  const existing = await ref.get();
  const out = { ...lesson };
  if (existing.exists) {
    const d = existing.data();
    if (d.visible !== undefined) out.visible = d.visible;
    if (d.dueDate !== undefined) out.dueDate = d.dueDate;
    if (d.gradesReleased !== undefined) out.gradesReleased = d.gradesReleased;
  }
  if (!out.createdAt) out.createdAt = admin.firestore.FieldValue.serverTimestamp();
  return safeLessonWrite(db, courseId, lesson.id, out);
}

module.exports = {
  uid, sectionHeader, objectives, text, callout, mc, shortAnswer, cer, ranking,
  dataTable, mdTable, barChart, sketch, evidenceUpload, image, externalLink, embed,
  rubric, teacherCheckpoint, rubric3D, LEVELS_4, seedLesson,
};
