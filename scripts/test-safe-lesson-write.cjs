// Tests for safe-lesson-write.fixed.cjs
// Uses only node:assert and an in-memory mock Firestore.

const assert = require("node:assert");
const { safeLessonWrite } = require("./safe-lesson-write.cjs");

// ---------------------------------------------------------------------------
// In-memory Firestore mock supporting the exact chainable API used by SUT
// ---------------------------------------------------------------------------

class MockDocSnapshot {
  constructor(exists, data) {
    this.exists = exists;
    this._data = data;
  }
  data() {
    return this._data;
  }
}

class MockDoc {
  constructor(store, path) {
    this._store = store;
    this._path = path;
  }
  collection(name) {
    return new MockCollection(this._store, [...this._path, name]);
  }
  async get() {
    const key = this._path.join("/");
    const data = this._store.docs[key];
    return new MockDocSnapshot(data !== undefined, data ?? null);
  }
  async set(data) {
    const key = this._path.join("/");
    this._store.docs[key] = JSON.parse(JSON.stringify(data));
  }
  async update() { throw new Error("update not used"); }
}

class MockCollection {
  constructor(store, path) {
    this._store = store;
    this._path = path;
  }
  doc(id) {
    return new MockDoc(this._store, [...this._path, id]);
  }
  where(field, op, value) {
    return {
      get: async () => {
        const prefix = this._path.join("/");
        const docs = [];
        for (const [key, data] of Object.entries(this._store.docs)) {
          if (!key.startsWith(prefix + "/")) continue;
          if (data[field] === value) {
            docs.push({ id: key.split("/").pop(), data: () => data });
          }
        }
        return { docs };
      }
    };
  }
}

class MockDb {
  constructor() {
    this.docs = {};
  }
  collection(name) {
    return new MockCollection(this, [name]);
  }
}

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function makeBlock(id, type, textOrPrompt, extra = {}) {
  const base = { id, type, ...extra };
  if (type === "question") {
    base.prompt = textOrPrompt;
    base.questionType = extra.questionType || "multiple_choice";
  } else if (type === "text") {
    base.text = textOrPrompt;
  } else if (type === "embed") {
    base.url = textOrPrompt;
  } else {
    base.title = textOrPrompt;
  }
  return base;
}

function seedEnrollment(db, courseId, uid) {
  db.docs[`enrollments/${uid}`] = { courseId, uid };
}

function seedProgress(db, courseId, lessonId, uid, hasProgress = true) {
  db.docs[`progress/${uid}/courses/${courseId}/lessons/${lessonId}`] = {
    completed: hasProgress,
    answers: hasProgress ? { someBlock: "someAnswer" } : {}
  };
}

function getWrittenLesson(db, courseId, lessonId) {
  return db.docs[`courses/${courseId}/lessons/${lessonId}`];
}

// ---------------------------------------------------------------------------
// Test runner
// ---------------------------------------------------------------------------

let failures = 0;

async function runCase(name, fn) {
  try {
    await fn();
    console.log(`PASS: ${name}`);
  } catch (err) {
    failures++;
    console.error(`FAIL: ${name}`);
    console.error(err.message);
  }
}

(async () => {
  await runCase("(a) new lesson -> action 'created'", async () => {
    const db = new MockDb();
    const courseId = "c1";
    const lessonId = "l1";
    const newLesson = {
      title: "New Lesson",
      blocks: [makeBlock("new-1", "text", "Hello")]
    };
    const result = await safeLessonWrite(db, courseId, lessonId, newLesson);
    assert.strictEqual(result.action, "created");
    const written = getWrittenLesson(db, courseId, lessonId);
    assert.strictEqual(written.title, "New Lesson");
    assert.strictEqual(written.blocks[0].id, "new-1");
  });

  await runCase("(b) existing, no progress -> 'updated', overwrites", async () => {
    const db = new MockDb();
    const courseId = "c1";
    const lessonId = "l2";
    db.docs[`courses/${courseId}/lessons/${lessonId}`] = {
      title: "Old Title",
      blocks: [makeBlock("old-1", "text", "Old text")]
    };
    const newLesson = {
      title: "New Title",
      blocks: [makeBlock("new-1", "text", "New text")]
    };
    const result = await safeLessonWrite(db, courseId, lessonId, newLesson);
    assert.strictEqual(result.action, "updated");
    const written = getWrittenLesson(db, courseId, lessonId);
    assert.strictEqual(written.title, "New Title");
    assert.strictEqual(written.blocks[0].text, "New text");
    assert.strictEqual(written.blocks[0].id, "new-1");
  });

  await runCase("(c) existing WITH progress, identical content -> all block IDs preserved", async () => {
    const db = new MockDb();
    const courseId = "c1";
    const lessonId = "l3";
    const oldBlocks = [
      makeBlock("old-q1", "question", "What is 2+2?", { questionType: "multiple_choice" }),
      makeBlock("old-q2", "question", "What is 3+3?", { questionType: "multiple_choice" })
    ];
    db.docs[`courses/${courseId}/lessons/${lessonId}`] = { title: "Math", blocks: oldBlocks };
    seedEnrollment(db, courseId, "u1");
    seedProgress(db, courseId, lessonId, "u1", true);

    const newBlocks = [
      makeBlock("new-q1", "question", "What is 2+2?", { questionType: "multiple_choice" }),
      makeBlock("new-q2", "question", "What is 3+3?", { questionType: "multiple_choice" })
    ];
    const result = await safeLessonWrite(db, courseId, lessonId, { title: "Math", blocks: newBlocks });
    assert.strictEqual(result.action, "updated-preserved");
    assert.strictEqual(result.preserved, 2);
    const written = getWrittenLesson(db, courseId, lessonId);
    assert.strictEqual(written.blocks[0].id, "old-q1");
    assert.strictEqual(written.blocks[1].id, "old-q2");
  });

  await runCase("(d) existing WITH progress, one block appended -> existing IDs preserved, appended keeps new id", async () => {
    const db = new MockDb();
    const courseId = "c1";
    const lessonId = "l4";
    const oldBlocks = [
      makeBlock("old-q1", "question", "What is 2+2?", { questionType: "multiple_choice" }),
      makeBlock("old-q2", "question", "What is 3+3?", { questionType: "multiple_choice" })
    ];
    db.docs[`courses/${courseId}/lessons/${lessonId}`] = { title: "Math", blocks: oldBlocks };
    seedEnrollment(db, courseId, "u1");
    seedProgress(db, courseId, lessonId, "u1", true);

    const newBlocks = [
      makeBlock("new-q1", "question", "What is 2+2?", { questionType: "multiple_choice" }),
      makeBlock("new-q2", "question", "What is 3+3?", { questionType: "multiple_choice" }),
      makeBlock("new-q3", "question", "What is 4+4?", { questionType: "multiple_choice" })
    ];
    const result = await safeLessonWrite(db, courseId, lessonId, { title: "Math", blocks: newBlocks });
    assert.strictEqual(result.action, "updated-preserved");
    assert.strictEqual(result.preserved, 2);
    const written = getWrittenLesson(db, courseId, lessonId);
    assert.strictEqual(written.blocks[0].id, "old-q1");
    assert.strictEqual(written.blocks[1].id, "old-q2");
    assert.strictEqual(written.blocks[2].id, "new-q3");
  });

  await runCase("(e) existing WITH progress, reworded block -> no id theft", async () => {
    const db = new MockDb();
    const courseId = "c1";
    const lessonId = "l5";
    const oldBlocks = [
      makeBlock("old-q1", "question", "What is 2+2?", { questionType: "multiple_choice" }),
      makeBlock("old-q2", "question", "What is 3+3?", { questionType: "multiple_choice" })
    ];
    db.docs[`courses/${courseId}/lessons/${lessonId}`] = { title: "Math", blocks: oldBlocks };
    seedEnrollment(db, courseId, "u1");
    seedProgress(db, courseId, lessonId, "u1", true);

    // First block identical; second is a slight rewording that should NOT steal old-q1's id.
    const newBlocks = [
      makeBlock("new-q1", "question", "What is 2+2?", { questionType: "multiple_choice" }),
      makeBlock("new-q2", "question", "What is two plus two?", { questionType: "multiple_choice" })
    ];
    const result = await safeLessonWrite(db, courseId, lessonId, { title: "Math", blocks: newBlocks });
    assert.strictEqual(result.action, "updated-preserved");
    const written = getWrittenLesson(db, courseId, lessonId);

    // Exact match preserved
    assert.strictEqual(written.blocks[0].id, "old-q1");

    // No duplicate old IDs assigned
    const ids = written.blocks.map(b => b.id);
    assert.strictEqual(new Set(ids).size, ids.length, "duplicate block ids detected");

    // The reworded block must not have stolen old-q1
    assert.notStrictEqual(written.blocks[1].id, "old-q1", "reworded block stole old-q1");
  });

  await runCase("(f) existing WITH progress, teacher fields omitted -> preserved", async () => {
    const db = new MockDb();
    const courseId = "c1";
    const lessonId = "l6";
    const oldBlocks = [
      makeBlock("old-q1", "question", "What is 2+2?", { questionType: "multiple_choice" })
    ];
    db.docs[`courses/${courseId}/lessons/${lessonId}`] = {
      title: "Math",
      visible: false,
      visibleAt: "2026-04-20T12:00:00Z",
      dueDate: "2026-05-01",
      gradesReleased: true,
      gradesReleasedAt: "2026-05-01T14:00:00Z",
      order: 42,
      weight: 3,
      blocks: oldBlocks
    };
    seedEnrollment(db, courseId, "u1");
    seedProgress(db, courseId, lessonId, "u1", true);

    // newLesson intentionally omits teacher-managed fields
    const newLesson = {
      title: "Math Updated",
      blocks: [makeBlock("new-q1", "question", "What is 2+2?", { questionType: "multiple_choice" })]
    };
    const result = await safeLessonWrite(db, courseId, lessonId, newLesson);
    assert.strictEqual(result.action, "updated-preserved");
    const written = getWrittenLesson(db, courseId, lessonId);
    assert.strictEqual(written.visible, false);
    assert.strictEqual(written.visibleAt, "2026-04-20T12:00:00Z");
    assert.strictEqual(written.dueDate, "2026-05-01");
    assert.strictEqual(written.gradesReleased, true);
    assert.strictEqual(written.gradesReleasedAt, "2026-05-01T14:00:00Z");
    assert.strictEqual(written.order, 42);
    assert.strictEqual(written.weight, 3);
    // Title from newLesson wins
    assert.strictEqual(written.title, "Math Updated");
  });

  if (failures > 0) {
    console.error(`\n${failures} test(s) failed`);
    process.exit(1);
  }
  console.log("\nAll tests passed");
})();
