const k = require('../unit1-seed-kit.cjs');
const assert = require('node:assert');
const { test } = require('node:test');

test('uid is unique-ish, short, string', () => {
  const a = k.uid(), b = k.uid();
  assert.strictEqual(typeof a, 'string');
  assert.ok(a.length >= 8);
  assert.notStrictEqual(a, b);
});

test('callout uses content field, carries style', () => {
  const b = k.callout({ style: 'insight', title: 'Key Idea', content: 'Energy is conserved.' });
  assert.strictEqual(b.type, 'callout');
  assert.strictEqual(b.content, 'Energy is conserved.'); // NOT b.text
  assert.strictEqual(b.style, 'insight');
  assert.ok(b.id);
});

test('objectives always has a title', () => {
  const b = k.objectives(['Define energy']);
  assert.strictEqual(b.type, 'objectives');
  assert.strictEqual(b.title, 'Learning Objectives');
  assert.deepStrictEqual(b.items, ['Define energy']);
});

test('mc stores 0-based correctIndex and options', () => {
  const b = k.mc({ prompt: 'Unit of power?', options: ['Joule', 'Watt', 'Newton', 'Volt'], correctIndex: 1, explanation: 'W = J/s' });
  assert.strictEqual(b.type, 'question');
  assert.strictEqual(b.questionType, 'multiple_choice');
  assert.strictEqual(b.correctIndex, 1);
  assert.strictEqual(b.options.length, 4);
});

test('cer produces a short_answer with CER scaffold in prompt', () => {
  const b = k.cer({ prompt: 'Where did the lost energy go?' });
  assert.strictEqual(b.questionType, 'short_answer');
  assert.match(b.prompt, /CLAIM/);
  assert.match(b.prompt, /EVIDENCE/);
  assert.match(b.prompt, /REASONING/);
});

test('embed defaults to scored, weight 5', () => {
  const b = k.embed({ url: 'https://pantherlearn.com/tools/x.html', caption: 'X' });
  assert.strictEqual(b.type, 'embed');
  assert.strictEqual(b.scored, true);
  assert.strictEqual(b.weight, 5);
  assert.strictEqual(b.maxScore, 5);
  assert.strictEqual(b.height, 750);
});

test('rubric3D has 3 criteria each with 4 levels', () => {
  const b = k.rubric3D({ title: 'Mastery', linkedBlockId: 'cp1', totalPoints: 15 });
  assert.strictEqual(b.type, 'rubric');
  assert.strictEqual(b.criteria.length, 3);
  b.criteria.forEach(c => assert.strictEqual(c.levels.length, 4));
  assert.strictEqual(b.linkedBlockId, 'cp1');
});

test('teacherCheckpoint is scored and accepts explicit id', () => {
  const b = k.teacherCheckpoint({ id: 'cp1', title: 'Show Me', prompt: 'Explain.', weight: 15 });
  assert.strictEqual(b.id, 'cp1');
  assert.strictEqual(b.type, 'teacher_checkpoint');
  assert.strictEqual(b.scored, true);
  assert.strictEqual(b.weight, 15);
});
