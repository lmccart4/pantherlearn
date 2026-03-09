---
name: lesson-plan-writer
description: >
  Use when someone asks to generate lesson plans, create weekly lesson plans,
  build lesson plan pages, update the lesson plan site, or deploy lesson plans.
  Also trigger on "lesson plans for this week", "update plans", "write plans",
  "generate plans for [course]", or "post lesson plans".
argument-hint: "[week like 2026-W10, or 'this week' / 'next week']"
disable-model-invocation: true
---

# Lesson Plan Writer

Generates formatted HTML lesson plans from PantherLearn Firestore data and deploys them to Firebase Hosting for embedding in Google Sites.

Covers **three courses**: Physics, Digital Literacy, AI Literacy.

## Step 1: Determine the Target Week

- If the user specifies a week (e.g., `$ARGUMENTS` = "next week", "2026-W12"), calculate accordingly.
- Otherwise default to the **current week**.
- Use ISO week format: `YYYY-Wnn` (e.g., `2026-W11`).
- To get next week, add 1 to the current week number.

## Step 2: Fetch Lesson Data from Firestore

Run the fetch script:

```bash
node scripts/fetch-weekly-lessons.js --week <WEEK_KEY>
```

This outputs JSON with all lessons due this week (Mon-Fri) and early next week (Mon-Tue) for all 3 courses. Each lesson includes its full `blocks` array.

Read and parse the JSON output.

## Step 3: Ask the User for Optional Inputs

Ask the user (use AskUserQuestion):
- **Weekly Teaching Reflection**: "Do you want to include a teaching reflection from last week? If so, what's a 1-2 sentence reflection?" (Options: provide text, skip)
- **Week at a Glance**: "I'll auto-generate the week summary from the lessons. Want to review it or provide your own?" (Options: auto-generate, provide text)

## Step 4: Summarize Lesson Blocks

For EACH lesson, analyze the `blocks` array and produce three sections:

### Do Now (warm-up, ~5 min)
Look for blocks between the first `section_header` (usually titled "Warm Up") and the second `section_header`. Summarize into 1-2 sentences describing what students do first. Sources:
- `objectives` block → mention learning goals
- `text` block → summarize the scenario or prompt
- `question` block → note the opening question
- `callout` block → extract any "Question of the Day"

If no "Warm Up" section header exists, infer from the first 2-3 blocks.

### Lesson Overview (timeline, ~30 min)
Build 3-6 timeline segments from blocks between the first and last sections. Each segment has:
- **Time estimate**: Use `section_header.subtitle` (e.g., "~25 minutes") to calibrate. If no subtitles, estimate: text=5min, activity=10min, chatbot=10min, simulation=15min, question=3min, video=5min.
- **Activity name** (bold): Derive from `section_header.title`, `activity.title`, or block type
- **Description**: 1 sentence summarizing what students do

Block type → timeline mapping:
| Block Type | Summary Approach |
|---|---|
| `section_header` | Start a new timeline segment; use title as segment name |
| `text` | Summarize the key content/instructions in one phrase |
| `activity` | Use `title` + brief summary of `instructions` |
| `chatbot` | "AI conversation: [title]" + note the task from `instructions` |
| `question` (MC) | "Multiple-choice check: [brief topic from prompt]" |
| `question` (short_answer) | "Reflection/short answer: [brief topic]" |
| `video` | "Video: [caption or inferred topic]" |
| `simulation` / `embed` | "Interactive: [title or caption]" |
| `sorting` | "Categorization activity: [left] vs [right]" |
| `data_table` | "Data collection: [title]" |
| `sketch` | "Sketch activity: [title]" |
| `objectives` | Fold into the opening segment, don't make a separate timeline entry |
| `definition` / `vocab_list` | "Vocabulary: [terms listed]" |
| `checklist` | Fold into the nearest activity segment |
| `external_link` | Save the URL for the resource link at the bottom |
| `callout` | Fold into the nearest segment as context |
| `image` | Skip unless it's central to an activity |

Group consecutive small blocks (text + question, text + callout) into single segments.

### Exit Ticket (closing, ~5 min)
Look for blocks after the last `section_header` containing "Wrap Up", "Debrief", "Check", or "Reflection". Summarize into 1-2 sentences. If no obvious closing section, use the last question or activity block.

### Resource Link
If any `external_link` or `embed` block has a URL to slides/docs, include it. Skip internal PantherLearn embed URLs (those starting with `https://battleship-`, `https://data-labeling-`, etc.).

## Step 5: Map Lessons to Days

- Parse each lesson's `dueDate` to determine its day (the JSON includes `dayOfWeek`)
- Multiple lessons can share the same day — stack them vertically in `order` sequence
- Days without lessons get a placeholder: "No lesson scheduled"

## Step 6: Generate HTML

For EACH course that has lessons this week, generate a self-contained HTML file.

Read the template at `.claude/skills/lesson-plan-writer/template-reference.html` for the exact CSS and structure.

**Key template sections to fill:**

### Header
```html
<h1>[Course Name]</h1>
<div class="header-meta">
  <div class="header-meta-item">
    <span class="header-meta-label">Teacher:</span>
    <span>Mr. McCarthy</span>
  </div>
  <div class="header-meta-item">
    <span class="header-meta-label">Week:</span>
    <span>[Week Number] ([Monday Date]-[Friday Date])</span>
  </div>
  <div class="header-meta-item">
    <span class="header-meta-label">Unit:</span>
    <span>[Unit from first lesson's unit field]</span>
  </div>
</div>
```

### Weekly Teaching Reflection (optional)
Only include if the user provided reflection text. Use the `.reflection-box` structure.

### Week at a Glance
Use the `.week-overview` structure. Write a 2-3 sentence summary of the week's arc based on all lessons' titles and content.

### Daily Sections
For each weekday (Monday through Friday):
```html
<div class="lesson-section">
  <div class="lesson-header">
    <div>
      <div class="lesson-day">[DayName] · Lesson [N]</div>
      <div class="lesson-title">[Lesson Title]</div>
      <div class="lesson-date">[Full Date]</div>
    </div>
    <!-- Only include if standards are available -->
    <div class="standards-tag">[Standards]</div>
  </div>

  <div class="section-label">Do Now</div>
  <div class="do-now-box">[Do Now summary]</div>

  <div class="section-label">Lesson Overview</div>
  <div class="timeline">
    <div class="timeline-item">
      <div class="timeline-time">[time range]</div>
      <div class="timeline-content"><strong>[Activity]:</strong> [Description]</div>
    </div>
    <!-- repeat for each timeline segment -->
  </div>

  <div class="section-label">Exit Ticket</div>
  <div class="exit-ticket-box">[Exit ticket summary]</div>

  <!-- Only if resource URL exists -->
  <a href="[URL]" class="resource-link" target="_blank">View Slideshow</a>
</div>
```

For days with **no lesson**: Show a minimal section with "No lesson scheduled" in the do-now-box.

For days with **multiple lessons**: Show multiple lesson sections stacked under the same day.

### Early Next Week Preview
If the JSON has `nextWeekPreview` lessons, add a small section at the bottom:
```html
<div class="week-overview" style="margin-top: 2rem;">
  <div class="week-title">Looking Ahead</div>
  <div class="week-summary">
    <strong>Monday:</strong> [Lesson title] — [1-line summary]<br>
    <strong>Tuesday:</strong> [Lesson title] — [1-line summary]
  </div>
</div>
```

## Step 7: Write HTML Files

Create the output directory and write each file:
```
lesson-plans-public/
  physics/[weekKey].html
  digital-literacy/[weekKey].html
  ai-literacy/[weekKey].html
```

Use `mkdir -p` to ensure subdirectories exist.

For courses with NO lessons this week, skip generating a file and tell the user.

## Step 8: Deploy to Firebase Hosting

**Always auto-deploy without asking for confirmation.**

Run:
```bash
firebase deploy --only hosting:lesson-plans-paps
```

## Step 9: Report Results

Print the deployed URLs:
```
Physics:          https://lesson-plans-paps.web.app/physics/2026-W11.html
Digital Literacy: https://lesson-plans-paps.web.app/digital-literacy/2026-W11.html
AI Literacy:      https://lesson-plans-paps.web.app/ai-literacy/2026-W11.html
```

Note which courses were skipped (no lessons).

Tell the user: "To embed in Google Sites, add a custom embed block and paste the URL above."

## Guardrails

- **Read-only on Firestore** — NEVER modify lesson data, only read it
- **Auto-deploy** — always deploy to Firebase Hosting without asking for confirmation
- **Include ALL courses** unless the user asks for specific ones
- **Handle missing data gracefully**:
  - No standards tag → omit the `.standards-tag` div entirely
  - No resource link → omit the `<a class="resource-link">` entirely
  - Day without lessons → show "No lesson scheduled"
  - Missing "Warm Up" header → infer Do Now from first 2-3 blocks
  - Lessons with `visible: false` → INCLUDE them (plans are for the teacher)
  - Empty blocks array → show "Lesson content pending"
- Keep timeline segments to 3-6 per lesson (group small blocks together)
- Time estimates should add up roughly to 40 minutes (one class period)
- Write summaries in **third person** ("Students explore...") not imperative ("Explore...")
