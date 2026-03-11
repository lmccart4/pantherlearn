---
name: pantherlearn-grader
description: Grade student responses from PantherLearn lessons using Luke's 5-bucket system (0%, 55%, 65%, 85%, 100%). Use this skill whenever the user wants to grade, score, evaluate, or give feedback on student work — including short answer responses, multiple choice answers, chatbot conversation logs, or activity submissions. Also trigger when the user says things like "grade these", "score this batch", "how did they do", "check their answers", or references student submissions, responses, or work from PantherLearn. Even if the user just says "grade" or "feedback" in the context of PantherLearn or classroom work, use this skill.
disable-model-invocation: true
---

# PantherLearn Grader

Grade student submissions from PantherLearn using Luke's 5-bucket grading system. This skill ensures consistent, fair grading across all response types while providing meaningful feedback that helps students grow.

## When to use this skill

- Grading individual or batch student responses
- Evaluating short answer questions, chatbot conversation logs, or activity submissions
- Scoring multiple choice responses
- Generating feedback reports for students or for Luke's review
- Any time student work from PantherLearn needs evaluation

## The 5-Bucket Grading System

Every student response receives one of exactly five grades. There is no in-between. The grade reflects the quality of thinking demonstrated, not just correctness.

### 0% — No Credit

The student either didn't submit, or what they submitted shows zero genuine engagement.

**Assign 0% when:**
- No response submitted
- Response is completely off-topic or nonsensical (e.g., "asdfghjk", "idk", random characters)
- Response is a clear copy-paste from an AI tool with no personal thought added
- Evidence of academic dishonesty
- Response has no connection whatsoever to the question or activity

**The key question:** Did the student even try?

### 55% — Minimal Effort

The student showed up and technically attempted the work, but the response reveals no real understanding. It's surface-level at best.

**Assign 55% when:**
- Response is extremely vague or generic (e.g., "AI is important for the future")
- Student restates the question as their answer
- One-word or single-phrase answers to questions that clearly require elaboration
- Response technically addresses the topic but says nothing meaningful
- Student clearly skimmed the material and guessed

**The key question:** Did the student engage with the actual content, or just go through the motions?

**Distinguishing 0% from 55%:** A 0% shows no attempt or bad faith. A 55% shows the student *tried* but put in minimal cognitive effort. If you can tell they at least read the question and responded to it (even poorly), that's 55%.

### 65% — Partial Understanding

The student demonstrates some understanding but it's incomplete, vague, or has significant gaps. They're in the neighborhood but haven't arrived.

**Assign 65% when:**
- Response shows awareness of the concept but can't fully explain it
- Student gets the general idea right but misses key details or nuance
- Response contains a mix of correct and incorrect reasoning
- Student can identify *what* but struggles with *why* or *how*
- Answer is on-topic and shows effort but lacks depth or specificity

**The key question:** Does the student understand the basics but fall short of a complete picture?

**Distinguishing 55% from 65%:** A 55% is going through the motions — the student isn't demonstrating understanding, just participation. A 65% shows genuine (if incomplete) thinking. You can see the gears turning, even if the output isn't fully formed.

### 85% — Solid Understanding

The student clearly gets it. Their response is accurate, relevant, and demonstrates real comprehension of the material. This is a good answer.

**Assign 85% when:**
- Response correctly explains the concept with relevant details
- Student can connect the topic to examples (given or original)
- Answer addresses all parts of the question competently
- Reasoning is sound and demonstrates actual learning
- Response shows the student engaged meaningfully with the content

**The key question:** Would you be confident this student understood the lesson if this was all you saw?

**Distinguishing 65% from 85%:** A 65% has gaps — you'd want to follow up to make sure they actually get it. An 85% doesn't leave you with doubts about their comprehension. The understanding is clearly there.

### 100% — Exceptional Understanding

The student didn't just learn it — they *own* it. Their response goes beyond demonstrating comprehension to showing genuine insight, synthesis, or application. This is the student who could teach it back to someone else.

**Assign 100% when:**
- Response demonstrates deep understanding AND articulates it clearly
- Student makes original connections, analogies, or applications
- Answer shows critical thinking beyond what was explicitly taught
- Student synthesizes multiple concepts from the lesson
- Response reveals the student internalized the material and can reason with it, not just recall it

**The key question:** Did the student show their thinking in a way that proves they truly internalized the concept — not just followed along?

**Distinguishing 85% from 100%:** An 85% says "I understand this." A 100% says "I understand this AND here's how I'm thinking about it at a deeper level." The difference is the student verbalizing comprehension that goes above and beyond baseline understanding. They're not just nodding along — they're building on it.

## Grading by Response Type

Read `references/grading-by-type.md` for specific guidance on how to apply the 5-bucket system to each PantherLearn response type (short answer, multiple choice, chatbot conversations, and activities).

## Firestore Schema

Grades are stored at `progress/{studentUid}/courses/{courseId}/lessons/{lessonId}` inside the `answers` map. When grading, write these fields to `answers.{blockId}`:

```json
{
  "writtenScore": 0.85,
  "writtenLabel": "Developing",
  "needsGrading": false,
  "gradedAt": "Timestamp"
}
```

IMPORTANT: Always preserve the student's existing fields (`answer`, `submitted`, `submittedAt`) when writing grades. Use Firestore `merge: true` or include the original fields in the write.

### Grade Tier Mapping

| Bucket | writtenScore | writtenLabel | Description |
|--------|-------------|-------------|-------------|
| No Credit | 0 | "Missing" | No submission or zero engagement |
| Minimal Effort | 0.55 | "Emerging" | Attempted but surface-level |
| Partial Understanding | 0.65 | "Approaching" | Some understanding, gaps remain |
| Solid Understanding | 0.85 | "Developing" | Clear comprehension demonstrated |
| Exceptional | 1.0 | "Refining" | Deep internalization, goes beyond |

## Output Format

For each graded response, output:

```json
{
  "studentId": "student_uid_here",
  "lessonId": "lesson_id_here",
  "blockId": "block_id_here",
  "writtenScore": 0.85,
  "writtenLabel": "Developing",
  "feedback": "Brief, constructive feedback in 1-2 sentences. Should tell the student what they did well and (if not 100%) what would push their thinking further.",
  "reasoning": "Internal note for Luke explaining why this bucket was chosen over adjacent ones. Not shown to students."
}
```

When grading a batch, output an array of these objects.

### Feedback Tone

- Write feedback as if talking to a 9th grader — warm, encouraging, direct
- Even a 0% should be matter-of-fact, not punitive: "I don't see a response here. Make sure to give it a try next time."
- For 55%, acknowledge the attempt but be honest: "You touched on the topic, but I'd love to see you dig deeper into *why* that matters."
- For 65%, be specific about what's missing: "You're on the right track with [X]. To level up, think about [specific gap]."
- For 85%, affirm and nudge: "Strong answer — you clearly understand [concept]. To push even further, consider [extension]."
- For 100%, celebrate the thinking: "This is excellent. Your point about [specific insight] shows real depth of understanding."

### Grading Principles

1. **Grade the thinking, not the writing.** A grammatically rough answer that shows deep understanding beats a polished answer that says nothing. These are 9th graders.
2. **Context matters.** Consider the question's difficulty and what was taught in the lesson. A "solid" answer to a basic recall question is different from a "solid" answer to a synthesis question.
3. **When in doubt between two adjacent buckets, look at the distinguishing questions above.** They're designed to break ties.
4. **Be consistent across a batch.** If two students give functionally equivalent answers, they get the same grade. Review your grades for a batch before finalizing.
5. **The rubric is the rubric.** Don't invent grades between buckets. Every response is exactly 0%, 55%, 65%, 85%, or 100%.

## Self-Calibration via Teacher Overrides

The grading agent improves over time by learning from Luke's manual corrections. When the agent grades a response and Luke later overrides it on the dashboard, that override is captured as a calibration data point.

### How Override Capture Works

When the agent writes a grade, it stores its decision in an `autogradeOriginal` field:

```json
{
  "answers": {
    "blockId": {
      "writtenScore": 0.55,
      "writtenLabel": "Emerging",
      "gradedBy": "autograde-agent",
      "autogradeOriginal": {
        "writtenScore": 0.55,
        "writtenLabel": "Emerging",
        "feedback": "...",
        "reasoning": "...",
        "gradedAt": "Timestamp"
      }
    }
  }
}
```

When Luke overrides via the dashboard, the top-level grade fields change but `autogradeOriginal` is preserved:

```json
{
  "answers": {
    "blockId": {
      "writtenScore": 0.65,
      "writtenLabel": "Approaching",
      "gradedBy": "teacher",
      "autogradeOriginal": {
        "writtenScore": 0.55,
        "writtenLabel": "Emerging",
        "feedback": "...",
        "reasoning": "...",
        "gradedAt": "Timestamp"
      }
    }
  }
}
```

An override is identified by: `gradedBy === "teacher"` AND `autogradeOriginal` exists.

### Override Reasons

Not every teacher override is a calibration signal. Sometimes grades are changed for reasons that shouldn't influence future grading. When overriding, Luke can tag the reason:

| overrideReason | Meaning | Used for calibration? |
|---------------|---------|----------------------|
| `"calibration"` or `null` | Agent got it wrong — this is what the grade should have been | ✅ Yes |
| `"glitch"` | Data issue, missing submission due to a bug, student had a technical problem | ❌ No |
| `"mercy"` | Giving credit as a one-time exception, not a grading standard change | ❌ No |
| `"ignore"` | Any other reason this override should not train the agent | ❌ No |

The harvester skips overrides tagged with `"glitch"`, `"mercy"`, or `"ignore"`. Overrides with `"calibration"` or no reason tag (`null`) are treated as real corrections.

### Harvesting Overrides for Calibration

Before each grading run, the agent queries Firestore for all override data points — responses where `gradedBy === "teacher"` and `autogradeOriginal` is present. These are formatted as few-shot correction examples and injected into the system prompt:

```
CALIBRATION FROM PAST CORRECTIONS:
The teacher has corrected your grading in the past. Learn from these:

- Question: "Why might an AI system develop biases?"
  Student answer: "because the training data has bias in it from history"
  You graded: Emerging (0.55)
  Teacher corrected to: Approaching (0.65)
  Lesson: Even a short answer that identifies the core mechanism (training data) shows genuine understanding, not just surface participation.

- Question: "What did you learn about prompt engineering?"
  Student answer: "being specific helps"
  You graded: Approaching (0.65)
  Teacher corrected to: Emerging (0.55)
  Lesson: Vague one-liners that restate the obvious without demonstrating any specific learning from the activity are Emerging, not Approaching.
```

This creates a feedback loop: agent grades → Luke corrects edge cases → corrections feed back into future grading → agent gets closer to Luke's judgment over time.

### Override Storage Path

Override data lives in the same progress documents — no separate collection needed. The `autogradeOriginal` field is the only addition. The calibration harvest is a read-only scan across progress docs filtered by `gradedBy === "teacher"`.

## Workflow

1. **Harvest overrides** — Query Firestore for past teacher corrections to build calibration examples
2. **Receive student responses** — Either as raw JSON from Firestore, pasted text, or a file
3. **Identify the block context** — What question/activity was this responding to? What was the learning objective?
4. **If grading by type guidance is needed**, read `references/grading-by-type.md`
5. **Build the grading prompt** — Include the base rubric + any calibration examples from past overrides
6. **Grade each response** using the 5-bucket system
7. **Output structured grades** in the JSON format above
8. **If grading a batch**, do a consistency pass — scan for similar answers that received different grades and reconcile
