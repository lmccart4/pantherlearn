# Grading by Response Type

Specific guidance for applying the 5-bucket system to each PantherLearn response type.

## Table of Contents

1. [Short Answer Questions](#short-answer-questions)
2. [Multiple Choice Questions](#multiple-choice-questions)
3. [Chatbot Conversations](#chatbot-conversations)
4. [Activity Responses](#activity-responses)

---

## Short Answer Questions

Short answer questions are the most common gradeable block. They range from simple recall to deep reflection depending on placement in the lesson.

### Context Awareness

Before grading, identify what kind of short answer this is:

- **Recall / Comprehension** — "What is [term]?" or "Describe [concept]." These have relatively clear correct answers.
- **Application** — "Give an example of..." or "How would you use..." These require students to transfer knowledge.
- **Reflection / Synthesis** — "Why do you think..." or "What did you learn about..." These are open-ended and reward depth of thought.

The bucket thresholds shift based on the question type. A 100% on a recall question means getting the facts right and explaining clearly. A 100% on a synthesis question means demonstrating original thinking that goes beyond the lesson.

### Short Answer Grading Examples

**Question:** "What is the difference between AI and Machine Learning?"

| Grade | Example Response | Why |
|-------|-----------------|-----|
| 0% | "they are different things" | No actual content. Restates the question. |
| 55% | "AI is bigger and ML is smaller" | Vaguely gestures at the relationship but demonstrates no understanding of what either term means. |
| 65% | "AI is technology that acts smart and ML is when it learns from data" | Right neighborhood — captures that ML involves learning from data, but the AI definition is too vague and the relationship isn't explained. |
| 85% | "AI is the broad field of making machines do intelligent tasks. Machine Learning is a subset where instead of programming rules directly, the system learns patterns from data." | Clear, accurate, shows real understanding of the relationship. |
| 100% | "AI is the whole field of making machines do things that normally require human intelligence. ML is a specific approach within AI where instead of writing explicit rules, you feed the system data and let it find patterns on its own. So all ML is AI, but not all AI is ML — like how a rule-based spam filter is AI but not ML, while Netflix recommendations use ML." | Everything the 85% has, plus an original analogy and a concrete example that proves they can apply the distinction, not just define it. |

---

## Multiple Choice Questions

Multiple choice questions have an objectively correct answer. Grading is straightforward but there's nuance.

### Standard Multiple Choice Grading

- **Correct answer → 100%**
- **Incorrect answer → 0%**

Multiple choice is binary by nature. The question was designed with one right answer and plausible distractors. Either the student identified the correct answer or they didn't.

### Exception: When Multiple Choice Has an Explanation Field

If the multiple choice question is paired with a follow-up "Explain your reasoning" prompt (either as a subsequent short_answer block or within the activity), grade the explanation using the short answer rubric. The MC selection and the explanation are graded separately.

---

## Chatbot Conversations

Chatbot blocks log the full conversation between a student and the AI environment. Grading these is different — you're evaluating the student's side of the conversation, not the chatbot's responses.

### What to Look For

1. **Engagement depth** — Did the student have a real conversation or just send one message?
2. **Quality of prompts/questions** — Did the student ask thoughtful questions or just poke randomly?
3. **Evidence of learning** — Did the student's understanding visibly evolve during the conversation?
4. **Task completion** — If the chatbot had a specific goal (e.g., "discover the bias"), did the student work toward it?

### Chatbot Grading by Bucket

**0%** — Student didn't interact with the chatbot, or sent only gibberish / off-topic messages.

**55%** — Student sent 1-2 generic messages with no apparent strategy. Minimal engagement, no evidence of thinking about the task. Example: Sending "hi" and "what do you like" to a bias-detection chatbot.

**65%** — Student engaged with the chatbot and made some progress toward the learning goal, but didn't push deep enough. They started exploring but abandoned the thread before reaching insight. Example: Asked a few probing questions to the bias bot but didn't identify the actual bias pattern.

**85%** — Student demonstrated clear, purposeful interaction. They worked toward the learning goal with strategy, and their conversation shows they understood the key concept. Example: Systematically tested the bias bot with different genres, noticed the pattern, and correctly identified the bias.

**100%** — Student's conversation shows sophisticated engagement. They not only accomplished the task but demonstrated meta-awareness of their approach or drew conclusions that go beyond the surface. Example: Identified the bias, tested edge cases to confirm it, and in a follow-up response reflected on how this kind of hidden bias could affect real-world AI systems.

### Conversation Length

Don't grade on length alone. A short, incisive conversation can be 100% and a long, meandering one can be 55%. What matters is the quality of the student's thinking visible in their messages.

---

## Activity Responses

Activity blocks describe structured tasks — group work, explorations, hands-on experiments. Student submissions for activities vary widely in format (written reflections, lists, descriptions of what they did).

### Activity Grading Approach

Since activities are highly variable, lean on the core bucket definitions and ask the key distinguishing questions:

- **0%**: Did the student even try?
- **55%**: Did they engage with the actual content, or just go through the motions?
- **65%**: Do they understand the basics but fall short of a complete picture?
- **85%**: Would you be confident they understood the lesson from this alone?
- **100%**: Did they show their thinking in a way that proves true internalization?

### Special Consideration: Group Activities

If the activity was collaborative, grade what the individual student submitted — not the group's collective output. If you can't distinguish individual contribution from group contribution, note this in the reasoning field and grade based on what's visible.

### Special Consideration: Process vs. Product

Some activities emphasize the process (e.g., "try three different prompts and describe what happened"). For these, grade based on whether the student actually did the process, not whether they got a "right" answer. A student who tried three genuinely different approaches and reflected on the results is showing more than one who found the "right" prompt on the first try and stopped.
