import { test } from "node:test";
import assert from "node:assert/strict";
import { buildScorePayload, makeStateSaver, makeTranslator } from "./embed-kit.js";

test("buildScorePayload produces the exact EmbedBlock contract shape", () => {
  const p = buildScorePayload(3.75, 5, true);
  assert.equal(p.type, "activityScore");
  assert.equal(p.score, 3.75);
  assert.equal(p.maxScore, 5);
  assert.equal(p.gameComplete, true);
  assert.equal(typeof p.completedAt, "string");
  assert.ok(!Number.isNaN(Date.parse(p.completedAt)), "completedAt is ISO-parseable");
});

test("buildScorePayload clamps negative scores to 0", () => {
  const p = buildScorePayload(-2, 5, false);
  assert.equal(p.score, 0);
  assert.equal(p.gameComplete, false);
});

test("makeStateSaver coalesces rapid saves and flush sends latest state", () => {
  const sent = [];
  const saver = makeStateSaver({ delay: 1000, send: (msg) => sent.push(msg) });
  saver.save({ a: 1 });
  saver.save({ a: 2 });
  assert.equal(sent.length, 0, "nothing sent before flush/timeout");
  saver.flush();
  assert.equal(sent.length, 1, "exactly one send");
  assert.equal(sent[0].type, "html-activity-state");
  assert.deepEqual(sent[0].state, { a: 2 }, "sends the latest state");
});

test("makeStateSaver flush with no pending state is a no-op", () => {
  const sent = [];
  const saver = makeStateSaver({ delay: 1000, send: (msg) => sent.push(msg) });
  saver.flush();
  assert.equal(sent.length, 0);
});

test("makeStateSaver() with no injected send does not throw in Node on flush", () => {
  const saver = makeStateSaver(); // no send → default browser closure
  saver.save({ a: 1 });
  assert.doesNotThrow(() => saver.flush(), "default send must no-op in Node, not ReferenceError");
});

test("makeTranslator returns current-language strings with en fallback", () => {
  const tr = makeTranslator({ hello: { en: "Hello", es: "Hola" }, only_en: { en: "Only" } }, "en");
  assert.equal(tr.t("hello"), "Hello");
  tr.setLang("es");
  assert.equal(tr.t("hello"), "Hola");
  assert.equal(tr.t("only_en"), "Only", "falls back to en when es missing");
  assert.equal(tr.t("missing_key"), "missing_key", "falls back to the key itself");
});
