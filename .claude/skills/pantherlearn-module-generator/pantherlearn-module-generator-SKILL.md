---
name: pantherlearn-module-generator
description: Generate PantherLearn lesson modules as Firestore seed scripts with block-based content. Use this skill whenever the user wants to create a new lesson, module, or content for PantherLearn — including when they mention lesson content, AI literacy lessons, chatbot environments, block arrays, seed scripts, or ask to turn slides/PDFs into PantherLearn format. Also trigger when the user references PantherLearn, lesson blocks, or says things like "create the next lesson", "build a module for [topic]", or "turn these slides into a lesson". Even if the user just says "lesson" or "module" in context where PantherLearn is clearly the platform, use this skill.
---

# PantherLearn Module Generator

Generate complete, deploy-ready PantherLearn lesson modules as Firestore seed scripts. Each module follows Luke's established block-based architecture and 40-minute class structure.

## Output Modes

This skill has two output modes — decide which one the user needs before generating anything:

- **Full seed script** — The default. Generates a complete Node.js ES module that writes the lesson document to Firestore. Use when the user says "create a lesson", "build a module", or is starting from scratch.
- **Blocks-only** — Outputs just the raw JSON `blocks` array. Use when the user says "just give me the blocks", is adding content to an existing lesson, or only needs the content structure.

If the user wants to convert existing content (slides, PDFs, outlines), follow the **Converting Existing Content** workflow below before generating output in either mode.

## Architecture Overview

PantherLearn is a React + Vite app hosted on Firebase Hosting. Lesson content is stored in Firestore as documents containing a `blocks` array. Each block is a content unit rendered by a corresponding React component.

### Lesson Document Structure

```javascript
{
  title: "Lesson Title",
  course: "Course Name",       // e.g. "Exploring Generative AI"
  unit: "Lesson N",            // e.g. "Lesson 1"
  order: 0,                    // 0-indexed sort order within the course
  blocks: [ /* array of block objects */ ]
}
```

The `order` field determines lesson sequence. It is 0-indexed, so Lesson 1 = `order: 0`, Lesson 7 = `order: 6`. Ask the user what position the lesson should occupy if unclear.

### The 40-Minute Class Flow

Luke's lessons follow a consistent pedagogical structure. Every lesson should include these sections:

1. **Warm Up** (~10 minutes) — An engaging hook that connects to prior knowledge or introduces the topic through an accessible activity. Often includes a thought experiment, improv game, or relatable scenario.

2. **Main Instruction** (~25 minutes) — The core content, broken into digestible chunks. Alternates between:
   - Explanatory text and definitions
   - Videos with focus questions (asked before watching)
   - Interactive questions (short answer, multiple choice, ranking, and linked)
   - Hands-on activities and chatbot environments
   - Callouts highlighting key concepts

3. **Wrap Up** (~5 minutes) — Socratic reflection questions that ask students to synthesize what they learned. These should push students to think critically, not just recall facts.

Each section begins with a `section_header` block.

## Block Types Reference

Read `references/block-types.md` for the complete specification of all block types with their fields and example JSON.

The reference covers the 15 core content block types used in standard lessons. PantherLearn also has specialized interactive blocks (sorting, calculator, data_table, sketch, bar_chart, simulation, etc.) — these are typically built as custom components and are outside the scope of seed-script generation. If a lesson concept calls for one of these, note it in a comment and flag it for the user.

## Block ID Conventions

Use consistent ID prefixes so generated lessons are predictable:

- Section headers: `section-warmup`, `section-main`, `section-wrapup`
- Sequential content blocks: `b1`, `b2`, `b3`... (text, definition, callout, image, video, activity, objectives, embed)
- Questions: `q1`, `q2`, `q3`...
- Chatbots: `chat1`, `chat2`, `chat3`...
- Dividers: `div1`, `div2`...
- Vocab lists: `vocab1` (typically only one per lesson)

IDs must be unique within a lesson. Number sequentially in the order they appear.

## Output Format

The primary output is a **Firestore seed script** — a Node.js ES module that writes the lesson document to Firestore. Use this template:

```javascript
// seed-lessonN.js
// Run from your pantherlearn directory: node seed-lessonN.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// ⬇️ PASTE YOUR FIREBASE CONFIG HERE (same as src/lib/firebase.jsx) ⬇️
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "pantherlearn-d6f7c.firebaseapp.com",
  projectId: "pantherlearn-d6f7c",
  storageBucket: "pantherlearn-d6f7c.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

if (firebaseConfig.apiKey === "YOUR_API_KEY") {
  console.error("❌ Please paste your Firebase config before running.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const lesson = {
  title: "LESSON_TITLE",
  course: "COURSE_NAME",
  unit: "Lesson N",
  order: N,
  blocks: [
    // Block array goes here
  ]
};

async function seed() {
  // courseId: kebab-case slug for the course (e.g. "exploring-gen-ai")
  // lessonId: kebab-case slug (e.g. "lesson-5-prompt-engineering")
  // Ask the user for these if not obvious from context.
  const courseId = "COURSE_ID";
  const lessonId = "LESSON_ID";
  await setDoc(doc(db, "courses", courseId, "lessons", lessonId), lesson);
  console.log("✅ Seeded:", lesson.title);
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
```

If the user only needs the blocks array (not a full seed script), output just the JSON array.

## Student Data Persistence

All student-facing interactive blocks auto-save to Firestore. When designing lessons, be aware of how each block type persists:

- **Short answer / linked questions** — Draft auto-saves every 30 seconds and on blur. Officially submitted on button click.
- **Multiple choice / ranking questions** — Ranking drafts auto-save on reorder. MC saves on submit.
- **Chatbot blocks** — Each message saves to Firestore via Cloud Function as it's sent. You only need to generate the block JSON — the Cloud Function and Gemini integration are handled by PantherLearn's infrastructure.
- **Checklist blocks** — Each toggle saves immediately.
- **Calculator / Data Table blocks** — Auto-save every 30 seconds and on blur via their own Firestore path.
- **Sketch blocks** — Auto-save every 2 seconds.

Progress path in Firestore: `progress/{userId}/courses/{courseId}/lessons/{lessonId} → answers: { blockId: { answer, submitted, ... } }`

## Content Quality Guidelines

### Writing for 9th Graders
- Use clear, accessible language — avoid jargon unless defining it
- Make abstract concepts concrete through analogies and scenarios students can relate to
- Frame activities as collaborative and exploratory, not lecture-style
- Include moments of student agency: "What do YOU think?" not "The answer is..."

### Chatbot Environments
When a lesson calls for AI interaction, create chatbot blocks with carefully crafted system prompts. The system prompt should:
- Define the chatbot's role and personality in the first sentence
- Constrain the conversation to the lesson topic
- Include guardrails appropriate for high school students
- Guide students toward discovery rather than giving away answers
- Match the difficulty level to the lesson's learning objectives
- Keep chatbot responses concise (2-3 sentences) to maintain conversational flow
- Always end the system prompt with: "Stay appropriate for high school students."

### Question Design
- **Short answer questions** should be open-ended and invite genuine thinking
- **Multiple choice questions** should have plausible distractors, not obviously wrong answers
- **Ranking questions** should have a defensible correct order with items that require reasoning to sequence
- **Linked questions** reference a student's prior answer — use these for "revisit your earlier thinking" reflection moments
- Place focus questions BEFORE videos so students know what to look for
- Use reflection questions in the Wrap Up that require synthesis across the lesson

### Video Blocks
For video blocks, use placeholder URLs formatted as `https://www.youtube.com/embed/VIDEO_ID_PLACEHOLDER` and add a comment noting the topic and approximate duration so the user can find an appropriate video. Alternatively, ask the user to provide video links before generating.

### Block Sequencing Patterns
- Start sections with a `section_header`
- Place `objectives` immediately after the Warm Up `section_header`
- Use `text` blocks for narrative and exposition
- Follow definitions with questions that apply the concept
- Place `callout` blocks to highlight key takeaways or definitions
- Use `activity` blocks for structured hands-on tasks
- End with `vocab_list` if the lesson introduced significant terminology
- Use `divider` blocks sparingly to create visual separation between major topic shifts

## Converting Existing Content

When converting slides, PDFs, or outlines into PantherLearn format:

1. **Map content types to blocks** — Slide headings → `section_header` or `text` with bold headings. Bullet points → `text` blocks with markdown lists. Key terms → `definition` or `vocab_list`. Images → `image` blocks (ask user for hosted URLs or note that URLs need to be provided).
2. **Don't just transcribe — transform.** Add interactivity that slides lack: insert `question` blocks after key concepts, create `chatbot` environments for exploration, add `activity` blocks for hands-on practice.
3. **Reorganize into the 40-minute flow** even if the source material doesn't follow it. The source is raw content; the output should be a structured lesson with Warm Up, Main Instruction, and Wrap Up.
4. **Flag gaps** — If the source is thin on a topic, note where additional content or activities would strengthen the lesson.

## Courses on PantherLearn

Ask the user which course the lesson belongs to and what the `courseId` is. Known courses include:
- **"Exploring Generative AI"** — AI literacy (LLMs, bias, prompt engineering, attention, embeddings)
- **"Problem Solving with AI"** — Practical AI use, prompt engineering, chatbot interaction
- **"Digital Literacy"** — Canva, WeVideo, CapCut, gaming units
- **Physics** — Momentum/CQM inquiry-based units

If the lesson is for a new course, ask the user for the course name and courseId.

## Workflow

1. **Gather context**: Ask the user for the lesson topic, which course it belongs to, the courseId/lessonId, and any source materials (slides, outlines, etc.)
2. **Read the block types reference**: `cat references/block-types.md` to ensure you use the correct field names
3. **Plan the lesson flow**: Outline the Warm Up → Main Instruction → Wrap Up before writing blocks
4. **Generate the output**: Create the full seed script or blocks-only JSON depending on what the user needs
5. **Review chatbot prompts**: If the lesson includes chatbot environments, double-check that system prompts are well-crafted and appropriately constrained
