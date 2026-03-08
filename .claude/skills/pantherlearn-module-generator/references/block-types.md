# PantherLearn Block Types Reference

Complete specification for all block types used in PantherLearn lesson documents. Each block must have an `id` (unique string) and `type` field.

## Table of Contents

1. [section_header](#section_header)
2. [text](#text)
3. [video](#video)
4. [image](#image)
5. [definition](#definition)
6. [callout](#callout)
7. [objectives](#objectives)
8. [checklist](#checklist)
9. [activity](#activity)
10. [vocab_list](#vocab_list)
11. [embed](#embed)
12. [divider](#divider)
13. [chatbot](#chatbot)
14. [question (short_answer)](#question-short_answer)
15. [question (multiple_choice)](#question-multiple_choice)
16. [question (ranking)](#question-ranking)
17. [question (linked)](#question-linked)

---

## section_header

Marks the beginning of a lesson section (Warm Up, Main Instruction, Wrap Up). Always use these to delineate the 40-minute class structure.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID, e.g. `"section-warmup"` |
| type | string | ✅ | `"section_header"` |
| title | string | ✅ | Section name, e.g. `"Warm Up"` |
| subtitle | string | ✅ | Time estimate, e.g. `"~10 minutes"` |
| icon | string | ✅ | Emoji icon, e.g. `"🔥"` |

```json
{
  "id": "section-warmup",
  "type": "section_header",
  "title": "Warm Up",
  "subtitle": "~10 minutes",
  "icon": "🔥"
}
```

Standard section headers:
- Warm Up: `icon: "🔥"`, `subtitle: "~10 minutes"`
- Main Instruction: `icon: "📚"`, `subtitle: "~25 minutes"`
- Wrap Up: `icon: "🎯"`, `subtitle: "~5 minutes"`

---

## text

General-purpose content block. Supports markdown (bold, italic, headings, lists, links).

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"text"` |
| content | string | ✅ | Markdown-formatted text |

```json
{
  "id": "b1",
  "type": "text",
  "content": "Before we dive into AI, let's play a quick improv game that will help us understand how AI actually works."
}
```

---

## video

Embedded video with optional caption. Place a focus question (as a separate `text` or `question` block) BEFORE the video block.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"video"` |
| url | string | ✅ | YouTube or video embed URL |
| caption | string | ❌ | Description shown below video |

```json
{
  "id": "b5",
  "type": "video",
  "url": "https://www.youtube.com/embed/VIDEO_ID",
  "caption": "How Machine Learning Works (3 min)"
}
```

---

## image

Display an image with caption and alt text.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"image"` |
| url | string | ✅ | Image URL |
| caption | string | ❌ | Caption below image |
| alt | string | ❌ | Alt text for accessibility |

```json
{
  "id": "b8",
  "type": "image",
  "url": "https://example.com/ai-family-tree.png",
  "caption": "The AI Family Tree",
  "alt": "Diagram showing AI > ML > Deep Learning > Generative AI"
}
```

---

## definition

A single term with its definition, rendered as a highlighted card.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"definition"` |
| term | string | ✅ | The term being defined |
| definition | string | ✅ | The definition text |

```json
{
  "id": "b4",
  "type": "definition",
  "term": "Machine Learning",
  "definition": "A subset of AI where systems learn patterns from data instead of being explicitly programmed with rules."
}
```

---

## callout

Highlighted box for key concepts, insights, warnings, or definitions. Use the `style` field to control visual appearance.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"callout"` |
| icon | string | ✅ | Emoji icon |
| style | string | ✅ | `"insight"`, `"definition"`, `"warning"`, or `"tip"` |
| content | string | ✅ | Markdown content |

```json
{
  "id": "b7",
  "type": "callout",
  "icon": "🎯",
  "style": "insight",
  "content": "**Unit Goal:**\n\nUnderstanding generative AI enables us to actively **guide its impact** on our lives and ensures its **responsible use** within society."
}
```

---

## objectives

Learning objectives list, typically placed near the beginning of a lesson.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"objectives"` |
| title | string | ✅ | Usually `"Learning Objectives"` |
| items | string[] | ✅ | Array of objective strings |

```json
{
  "id": "b0",
  "type": "objectives",
  "title": "Learning Objectives",
  "items": [
    "Define artificial intelligence and identify examples in daily life",
    "Explain the relationship between AI, ML, Deep Learning, and Generative AI",
    "Describe what a Large Language Model is and how it works"
  ]
}
```

---

## checklist

Interactive checklist for step-by-step tasks students can check off.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"checklist"` |
| title | string | ✅ | Checklist heading |
| items | string[] | ✅ | Array of checklist item strings |

```json
{
  "id": "b12",
  "type": "checklist",
  "title": "Before You Begin",
  "items": [
    "Open your school Google account",
    "Navigate to gemini.google.com",
    "Make sure you can send a test message"
  ]
}
```

---

## activity

Structured hands-on activity with instructions. Used for group work, individual tasks, or guided explorations.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"activity"` |
| title | string | ✅ | Activity name |
| icon | string | ✅ | Emoji icon |
| instructions | string | ✅ | Markdown-formatted instructions |

```json
{
  "id": "b2",
  "type": "activity",
  "title": "Yes, And…",
  "icon": "🎭",
  "instructions": "Start with this sentence:\n\n**\"A mysterious talking cat started showing up to math class.\"**\n\nIn your group, take turns building on the story. Each person must start their addition with \"Yes, and...\" to accept what came before and add something new.\n\nPlay for 3-4 rounds, then discuss: What made the story interesting? What happened when someone took it in an unexpected direction?"
}
```

---

## vocab_list

A collection of terms and definitions, typically placed at the end of a lesson.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"vocab_list"` |
| title | string | ✅ | Usually `"Key Vocabulary"` |
| terms | object[] | ✅ | Array of `{ term, definition }` objects |

```json
{
  "id": "b23",
  "type": "vocab_list",
  "title": "Key Vocabulary",
  "terms": [
    {
      "term": "Artificial Intelligence",
      "definition": "A technology that mimics human intelligence, performing tasks such as understanding language, recognizing patterns, and making decisions."
    },
    {
      "term": "Large Language Model",
      "definition": "A computer program that analyzes large amounts of raw human-created data to the point where it can represent and recreate new data to perform a variety of tasks."
    }
  ]
}
```

---

## embed

Embeds an external tool (Google Forms, Padlet, Pear Deck, etc.) via iframe.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"embed"` |
| url | string | ✅ | Embed URL |
| caption | string | ❌ | Description |
| height | number | ❌ | Iframe height in px (default 400) |

```json
{
  "id": "b15",
  "type": "embed",
  "url": "https://docs.google.com/forms/d/e/FORM_ID/viewform?embedded=true",
  "caption": "Quick Check: AI or Not?",
  "height": 500
}
```

---

## divider

Simple visual separator. Use sparingly between major topic shifts within a section.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"divider"` |

```json
{
  "id": "div1",
  "type": "divider"
}
```

---

## chatbot

Embedded AI chatbot environment powered by Gemini via Cloud Function. The `systemPrompt` defines the chatbot's behavior and constraints. Conversations are logged for teacher review.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"chatbot"` |
| title | string | ✅ | Display name for the chatbot |
| icon | string | ✅ | Emoji icon (usually `"🤖"`) |
| starterMessage | string | ✅ | First message shown to student |
| systemPrompt | string | ✅ | System instructions for the AI |
| placeholder | string | ❌ | Input placeholder text |

```json
{
  "id": "chat1",
  "type": "chatbot",
  "title": "Biased Recommendation Bot",
  "icon": "🤖",
  "starterMessage": "Hi! I'm the community recommendation bot. Tell me what kind of entertainment you're looking for and I'll suggest something!",
  "systemPrompt": "You are a recommendation bot for a community organization. You recommend movies, books, music, and activities. However, you have a hidden bias: you strongly favor action movies, rock music, and outdoor sports. When users ask for recommendations, subtly steer toward these categories. If pressed, insist your recommendations are balanced. Students are trying to detect your bias — don't reveal it directly but don't hide it so well they can't find it. Keep responses concise (2-3 sentences). Stay appropriate for high school students.",
  "placeholder": "Ask for a recommendation..."
}
```

### System Prompt Best Practices
- Define the role clearly in the first sentence
- State behavioral constraints explicitly
- Include grade-level appropriateness guardrails
- For bias detection lessons: make the bias discoverable but not obvious
- For prompt engineering lessons: respond differently based on prompt quality to reward good technique
- Keep chatbot responses concise (2-3 sentences) to maintain conversational flow
- Always end with: "Stay appropriate for high school students."

---

## question (short_answer)

Open-ended text response question. Use for reflection, analysis, and creative thinking.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"question"` |
| questionType | string | ✅ | `"short_answer"` |
| prompt | string | ✅ | The question text (supports markdown) |
| placeholder | string | ❌ | Input hint text |

```json
{
  "id": "b3",
  "type": "question",
  "questionType": "short_answer",
  "prompt": "Can you think of examples of Artificial Intelligence that you encounter in your daily life?",
  "placeholder": "Some examples of AI I see are..."
}
```

---

## question (multiple_choice)

Multiple choice question with options and a correct answer.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"question"` |
| questionType | string | ✅ | `"multiple_choice"` |
| prompt | string | ✅ | The question text |
| options | string[] | ✅ | Array of answer choices |
| correctIndex | number | ✅ | 0-based index of correct answer |
| explanation | string | ❌ | Shown after answering |

```json
{
  "id": "q1",
  "type": "question",
  "questionType": "multiple_choice",
  "prompt": "Which of the following is the BEST example of generative AI?",
  "options": [
    "A spam filter that sorts your email",
    "A chatbot that writes original poetry",
    "A thermostat that learns your schedule",
    "A robot vacuum that maps your house"
  ],
  "correctIndex": 1,
  "explanation": "Generative AI creates NEW content. The other examples are AI, but they classify, predict, or navigate — they don't generate original output."
}
```

---

## question (ranking)

Drag-to-reorder question where students arrange items in the correct sequence. Auto-saves draft on every reorder.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"question"` |
| questionType | string | ✅ | `"ranking"` |
| prompt | string | ✅ | The question text |
| items | string[] | ✅ | Array of items in the CORRECT order (displayed shuffled to students) |
| difficulty | string | ❌ | Bloom's level: `"remember"`, `"understand"`, `"apply"`, `"analyze"`, `"evaluate"`, `"create"` |

```json
{
  "id": "q3",
  "type": "question",
  "questionType": "ranking",
  "prompt": "Rank these AI capabilities from MOST to LEAST dependent on large datasets:",
  "items": [
    "Training a large language model",
    "Fine-tuning a pre-trained model",
    "Writing a rule-based chatbot",
    "Using prompt engineering with an existing model"
  ],
  "difficulty": "analyze"
}
```

---

## question (linked)

Follow-up question that displays the student's answer to a previous question as context. The student sees their prior response and then answers a new prompt that builds on it. Great for "revisit your thinking" moments.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | ✅ | Unique ID |
| type | string | ✅ | `"question"` |
| questionType | string | ✅ | `"linked"` |
| prompt | string | ✅ | The follow-up question text |
| linkedBlockId | string | ✅ | The `id` of the earlier question block to reference |
| difficulty | string | ❌ | Bloom's level |

```json
{
  "id": "q5",
  "type": "question",
  "questionType": "linked",
  "prompt": "Look at what you wrote earlier. Now that you've seen the video and tried the chatbot, would you change your answer? What would you add or remove?",
  "linkedBlockId": "q1",
  "difficulty": "evaluate"
}
```
