import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createState,
  waveSpeed,
  wavePeriod,
  checkAnswers,
  answersComplete,
} from "./wave-properties-explorer-model.js";

// Build a "perfect" answer set for a given state.
function perfectAnswers(state) {
  return {
    amplitudeRead: state.amplitude,
    wavelengthRead: state.wavelength,
    speedCalc: waveSpeed(state),
    predDoubleF: "doubles",
    predLambdaUp: "increases",
  };
}

test("waveSpeed implements v = f * lambda", () => {
  const s = createState({ amplitude: 1.5, wavelength: 4.0, frequency: 1.0 });
  assert.equal(waveSpeed(s), 4.0); // 1.0 * 4.0
  const s2 = createState({ amplitude: 2.0, wavelength: 6.0, frequency: 2.0 });
  assert.equal(waveSpeed(s2), 12.0); // 2.0 * 6.0
});

test("wavePeriod is 1/frequency", () => {
  const s = createState({ frequency: 2.0 });
  assert.equal(wavePeriod(s), 0.5);
});

test("perfect answers score the max of 5", () => {
  const s = createState({ amplitude: 2.0, wavelength: 5.0, frequency: 1.5 });
  const r = checkAnswers(s, perfectAnswers(s));
  assert.equal(r.score, 5);
  assert.equal(r.maxScore, 5);
});

test("empty answers score 0, never negative", () => {
  const s = createState();
  const r = checkAnswers(s, {});
  assert.equal(r.score, 0);
  assert.ok(r.score >= 0);
});

test("all-wrong answers score 0", () => {
  const s = createState({ amplitude: 2.0, wavelength: 5.0, frequency: 1.5 });
  const r = checkAnswers(s, {
    amplitudeRead: 99,
    wavelengthRead: 99,
    speedCalc: 99,
    predDoubleF: "halves",
    predLambdaUp: "decreases",
  });
  assert.equal(r.score, 0);
});

test("score always within [0, maxScore] across random states/answers", () => {
  for (let i = 0; i < 50; i++) {
    const s = createState({
      amplitude: 0.5 + Math.random() * 2.5,
      wavelength: 1.0 + Math.random() * 7.0,
      frequency: 0.2 + Math.random() * 1.8,
    });
    const garbage = {
      amplitudeRead: Math.random() * 10,
      wavelengthRead: Math.random() * 10,
      speedCalc: Math.random() * 20,
      predDoubleF: Math.random() > 0.5 ? "doubles" : "halves",
      predLambdaUp: Math.random() > 0.5 ? "increases" : "decreases",
    };
    const r = checkAnswers(s, garbage);
    assert.ok(r.score >= 0 && r.score <= r.maxScore, `score ${r.score} out of range`);
  }
});

test("partial credit: only the speed calc correct -> 1 of 5", () => {
  const s = createState({ amplitude: 2.0, wavelength: 5.0, frequency: 1.0 });
  const r = checkAnswers(s, { speedCalc: waveSpeed(s) });
  assert.equal(r.score, 1);
});

test("answersComplete false until all five filled, true when complete", () => {
  assert.equal(answersComplete({}), false);
  assert.equal(
    answersComplete({ amplitudeRead: 1, wavelengthRead: 2, speedCalc: 3, predDoubleF: "doubles" }),
    false
  );
  assert.equal(
    answersComplete({
      amplitudeRead: 1,
      wavelengthRead: 2,
      speedCalc: 3,
      predDoubleF: "doubles",
      predLambdaUp: "increases",
    }),
    true
  );
});

test("answersComplete treats empty string / null as not filled", () => {
  assert.equal(
    answersComplete({
      amplitudeRead: "",
      wavelengthRead: 2,
      speedCalc: 3,
      predDoubleF: "doubles",
      predLambdaUp: "increases",
    }),
    false
  );
  assert.equal(
    answersComplete({
      amplitudeRead: 1,
      wavelengthRead: 2,
      speedCalc: 3,
      predDoubleF: null,
      predLambdaUp: "increases",
    }),
    false
  );
});
