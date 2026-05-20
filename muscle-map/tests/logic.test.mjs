import test from 'node:test';
import assert from 'node:assert/strict';
import { ping } from '../js/logic.js';

test('logic module loads', () => {
  assert.equal(ping(), 'pong');
});
