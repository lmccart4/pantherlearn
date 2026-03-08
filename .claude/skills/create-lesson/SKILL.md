---
name: create-lesson
description: >
  Use when someone asks to create a lesson, build a lesson, make a lesson,
  design an activity, generate lesson content, create blocks for a lesson,
  or scaffold a new PantherLearn lesson or activity.
argument-hint: [topic or description]
---

## What This Skill Does

Generates PantherLearn lessons composed of blocks, optionally creates new custom block components when needed, and seeds the lesson to Firestore via a seed script.

## Steps

### Step 1: Gather Requirements

If the user provides a detailed outline, skip to Step 2. Otherwise, ask clarifying questions (use AskUserQuestion, one round):

- **Course ID**: Which Firestore course to write to (e.g., `ai-literacy`, `physics`, `digital-literacy`)
- **Lesson topic & title**
- **Learning objectives** (or let Claude draft them)
- **Target duration** (e.g., 45 min class period)
- **Desired block types** (or let Claude choose appropriate ones)
- **Any specific activities, chatbots, or interactives** the user wants included

If `` is provided, use it as the topic starting point.

### Step 2: Design the Lesson

Read the block reference in [block-reference.md](block-reference.md) for all available block types and their schemas.

Design the lesson following these structural conventions:
- Start with a **Warm Up** section header (~5-10 min)
- Add **Learning Objectives** block early
- Include a **Question of the Day** callout
- Build 1-3 **Activity** sections with interactives (chatbots, sorting, simulations, etc.)
- Add **Check Your Understanding** section with assessment questions
- End with **Wrap Up** section and **Key Vocabulary** vocab list
- Use a mix of block types — avoid long stretches of just text blocks
- Questions should span Bloom's taxonomy levels (remember through create)
- Chatbot blocks need well-crafted systemPrompt and clear student instructions

Block IDs must be unique strings (e.g., `"section-warmup"`, `"b1"`, `"chat1"`).

### Step 3: Evaluate If Custom Blocks Are Needed

If the lesson topic requires an interactive that none of the existing 30+ block types can handle:

1. Create the new block component at `src/components/blocks/NewBlockName.jsx`
   - Follow the standard pattern: `({ block, studentData, onAnswer })` props
   - Implement data persistence via `onAnswer(block.id, { ... })`
   - Handle Firestore hydration and teacher reset (see block-reference.md for the pattern)
2. Register it in `src/components/blocks/BlockRenderer.jsx` — add import + BLOCK_MAP entry
3. Register it in `src/pages/LessonEditor.jsx` — add to BLOCK_TYPES array + defaultBlockData switch
4. If it's an external activity, also update `src/config/activityRegistry.js` and create a review component in `src/components/grading/activities/`

**Only create custom blocks when truly necessary.** The existing block types cover most use cases.

### Step 4: Generate the Seed Script

Create a seed script at `scripts/seed-<lesson-slug>.js` using the **Firebase Admin SDK** (bypasses Firestore security rules):

```javascript
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

initializeApp({ projectId: "pantherlearn-d6f7c" });
const db = getFirestore();

const lesson = {
  title: "Lesson Title",
  course: "Course Name",
  unit: "Unit Name",
  order: <number>,
  visible: false,  // Start hidden — teacher publishes when ready
  blocks: [
    // ... block objects
  ]
};

async function seed() {
  try {
    await db.collection('courses').doc('<course-id>')
      .collection('lessons').doc('<lesson-slug>')
      .set(lesson);
    console.log('Lesson "<title>" seeded successfully!');
    console.log('   Path: courses/<course-id>/lessons/<lesson-slug>');
    console.log('   Blocks:', lesson.blocks.length);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding lesson:', err);
    process.exit(1);
  }
}

seed();
```

**Important:** Use Firebase Admin SDK (`firebase-admin/app` + `firebase-admin/firestore`), NOT the client SDK. The client SDK requires authentication and will fail with PERMISSION_DENIED.

### Step 5: Confirm Before Writing to Firestore

**ALWAYS** present the lesson plan to the user before running the seed script:
- Show the lesson title, course, and unit
- List all blocks with their types and brief descriptions
- Show the total block count
- State the Firestore path where it will be written
- Ask for explicit confirmation before running

### Step 6: Seed to Firestore

After user confirms, run:
```
node scripts/seed-<lesson-slug>.js
```

Verify the output shows success.

## Guardrails

- **Never overwrite existing lessons.** Use a unique lesson slug. If unsure, check Firestore first.
- **Always seed with `visible: false`.** Lessons start hidden from students so teachers can review before publishing via the Lesson Editor.
- **Always confirm before running seed scripts.** Never auto-execute writes to Firestore.
- **Chatbot system prompts** must include: role/persona, age-appropriate behavior, topic boundaries, and response length guidance.
- **Question blocks** should include `explanation` for MC questions and appropriate `difficulty` levels.
- **Block IDs** must be unique within the lesson. Use descriptive prefixes (e.g., `section-`, `chat-`, `q-`).
- Keep individual blocks focused. Break long content into multiple text blocks with interactives between them.
