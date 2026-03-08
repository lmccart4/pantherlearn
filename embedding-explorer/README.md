# 🧬 The Embedding Explorer

An interactive, gamified introduction to AI embeddings for high school students. Built for PantherLearn integration.

## Activity Structure

| Stage | Name | Points | Description |
|-------|------|--------|-------------|
| 1 | The Sorting Game | 10 | Drag-and-drop word arrangement by similarity |
| 2 | Number Detectives | 25 | Decode vectors and understand distance |
| 3 | The Embedding Machine | 40 | Interactive scatter plot with guided challenges |
| 4 | Why It Matters | 30 | Real-world applications + bias + reflection |
| **Total** | | **105** | |

## Quick Deploy

```bash
# 1. Install dependencies
npm install

# 2. Dev server
npm run dev

# 3. Build for production
npm run build

# 4. Deploy to Firebase
firebase deploy --only hosting
```

## Firebase Setup (first time only)

```bash
# Create a new Firebase project at console.firebase.google.com
# Then:
firebase login
firebase init hosting
# → Select "dist" as public directory
# → Yes to single-page app
# → No to GitHub deploys
```

Update `.firebaserc` with your actual project ID.

## PantherLearn Integration

This app communicates with PantherLearn via `postMessage`. When embedded as an iframe:

1. PantherLearn passes `?studentId=xxx&courseId=xxx&blockId=xxx` in the iframe URL
2. On activity completion, the app sends a `postMessage` to the parent window:
   ```json
   {
     "type": "activityScore",
     "activityId": "embedding-explorer",
     "studentId": "...",
     "courseId": "...",
     "blockId": "...",
     "score": 85,
     "maxScore": 105,
     "completedAt": "2026-03-02T..."
   }
   ```
3. PantherLearn's embed block listener picks up the score and writes it to Firestore

### Add to Activity Registry

Add this entry to `src/config/activityRegistry.js` in PantherLearn:

```js
{
  id: "embedding-explorer",
  title: "Embedding Explorer",
  icon: "🧬",
  collection: "embedding_explorer",
  component: () => import("../components/grading/EmbeddingExplorerReview"),
  url: "https://YOUR-PROJECT.web.app",
  course: "ai-literacy",
  maxScore: 105,
}
```

### Seed the Lesson

Run `seed-embeddings-lesson.js` (in the outputs folder) from your PantherLearn directory after updating the course IDs and embed URL.

## Tech Stack

- React 18 + Vite
- Firebase Hosting
- No external UI framework (all custom styles)
- Pre-computed word embeddings (no API calls needed)
