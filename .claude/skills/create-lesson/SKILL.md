---
name: create-lesson
description: >
  Use when someone asks to create a lesson, build a lesson, make a lesson,
  design an activity, generate lesson content, create blocks for a lesson,
  scaffold a new PantherLearn lesson or activity, turn slides into a lesson,
  convert a PDF to PantherLearn format, or create a module for a topic.
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

### Step 5: Multiple Choice Audit

Before presenting the lesson, apply the global MC rules from `.claude/rules/multiple-choice.md`:
- Verify `correctIndex` varies across questions (not all the same)
- Plan per-period shuffling if seeding to multiple course variants
- Check distractor quality

Report the audit results when presenting the lesson plan.

### Step 6: Confirm Before Writing to Firestore

**ALWAYS** present the lesson plan to the user before running the seed script:
- Show the lesson title, course, and unit
- List all blocks with their types and brief descriptions
- Show the total block count
- State the Firestore path where it will be written
- Show the MC audit results: correct answer positions per question, per-period shuffle plan
- Ask for explicit confirmation before running

### Step 7: Seed to Firestore

After user confirms, run:
```
node scripts/seed-<lesson-slug>.js
```

Verify the output shows success.

**If seeding to multiple periods**, immediately run the MC shuffle step per `.claude/rules/multiple-choice.md`. Do NOT leave all periods with identical answer orderings.

## Guardrails

- **Never overwrite existing lessons.** Use a unique lesson slug. If unsure, check Firestore first.
- **Always seed with `visible: false`.** Lessons start hidden from students so teachers can review before publishing via the Lesson Editor.
- **Always confirm before running seed scripts.** Never auto-execute writes to Firestore.
- **Chatbot system prompts** must include: role/persona, age-appropriate behavior, topic boundaries, and response length guidance.
- **Question blocks** should include `explanation` for MC questions and appropriate `difficulty` levels.
- **Block IDs** must be unique within the lesson. Use descriptive prefixes (e.g., `section-`, `chat-`, `q-`).
- Keep individual blocks focused. Break long content into multiple text blocks with interactives between them.

## Content Quality Guidelines

### Writing for 9th Graders
- Use clear, accessible language — avoid jargon unless defining it
- Make abstract concepts concrete through analogies and scenarios students can relate to
- Frame activities as collaborative and exploratory, not lecture-style
- Include moments of student agency: "What do YOU think?" not "The answer is..."

### Chatbot Environments
When a lesson calls for AI interaction, create chatbot blocks with carefully crafted system prompts:
- Define the chatbot's role and personality in the first sentence
- Constrain the conversation to the lesson topic
- Include guardrails appropriate for high school students
- Guide students toward discovery rather than giving away answers
- Keep chatbot responses concise (2-3 sentences) to maintain conversational flow
- Always end the system prompt with: "Stay appropriate for high school students."

### Question Design
- **Short answer questions** should be open-ended and invite genuine thinking
- **Multiple choice questions** should have plausible distractors, not obviously wrong answers. The correct answer (`correctIndex`) MUST vary across questions — never put the correct answer at the same index for every question. When seeding to multiple periods, shuffle option order per period so students can't share letter answers.
- **Ranking questions** should have a defensible correct order with items that require reasoning to sequence
- **Linked questions** reference a student's prior answer — use these for "revisit your thinking" reflection moments
- Place focus questions BEFORE videos so students know what to look for
- Use reflection questions in the Wrap Up that require synthesis across the lesson

### Video Blocks
For video blocks, use placeholder URLs formatted as `https://www.youtube.com/embed/VIDEO_ID_PLACEHOLDER` and add a comment noting the topic and approximate duration so the user can find an appropriate video. Alternatively, ask the user to provide video links before generating.

## Converting Existing Content

When converting slides, PDFs, or outlines into PantherLearn format:

1. **Map content types to blocks** — Slide headings → `section_header` or `text` with bold headings. Bullet points → `text` blocks with markdown lists. Key terms → `definition` or `vocab_list`. Images → `image` blocks (ask user for hosted URLs).
2. **Don't just transcribe — transform.** Add interactivity that slides lack: insert `question` blocks after key concepts, create `chatbot` environments for exploration, add `activity` blocks for hands-on practice.
3. **Reorganize into the 40-minute flow** even if the source material doesn't follow it. The source is raw content; the output should be a structured lesson with Warm Up, Main Instruction, and Wrap Up.
4. **Flag gaps** — If the source is thin on a topic, note where additional content or activities would strengthen the lesson.

## Known Courses

- **"Exploring Generative AI"** (courseId: `exploring-gen-ai`) — AI literacy
- **"Problem Solving with AI"** — Practical AI use, prompt engineering
- **"Digital Literacy"** — Canva, WeVideo, CapCut, gaming units
- **Physics** — Momentum/CQM inquiry-based units

If the lesson is for a new course, ask the user for the course name and courseId.
