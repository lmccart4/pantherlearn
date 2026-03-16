# Multiple Choice Questions — Global Rules

These rules apply ANY time multiple choice questions are created, modified, or seeded to Firestore — whether via the create-lesson skill, a seed script, a manual edit, or any other method.

## 1. Randomize Correct Answer Positions

The `correctIndex` MUST vary across MC questions within a lesson. Never set the same `correctIndex` for all questions.

- With 3+ MC questions, distribute correct answers roughly evenly across indices 0-3
- Example (good): [1, 3, 0, 2] — Example (bad): [1, 1, 1, 1]
- If editing a single question, check what indices the other questions use and pick a different one

## 2. Per-Period Shuffling

When writing MC questions to multiple course variants (e.g., AI literacy periods 4/5/7/9), each period MUST have different answer orderings.

- After seeding the base lesson, shuffle each period's MC options so the correct answer appears at a different index
- Reorder the `options` array and update `correctIndex` to match
- No two periods should share the same `correctIndex` sequence across all MC questions
- This prevents students from sharing letter answers across sections

### Known Multi-Period Courses

| Course | Source ID | Period Course IDs |
|--------|-----------|-------------------|
| AI Literacy | `ai-literacy` | `Y9Gdhw5MTY8wMFt6Tlvj` (P4), `DacjJ93vUDcwqc260OP3` (P5), `M2MVSXrKuVCD9JQfZZyp` (P7), `fUw67wFhAtobWFhjwvZ5` (P9) |

## 3. Distractor Quality

All wrong answers must be plausible. Avoid obviously absurd options that students can eliminate without understanding the material.
