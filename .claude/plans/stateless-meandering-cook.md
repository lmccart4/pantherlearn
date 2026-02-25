# Plan: Teacher Message Center Page

## Context
Teachers need a full-page view of all ClassChat (direct messaging widget) conversations, organized by section/period and sub-organized by participant. Currently the only way to view these messages is through the floating ClassChat widget, which shows a small panel. The Message Center provides a comprehensive, read-only overview of all student conversations across the course.

## What's Being Built
- New `/messages` page — teacher-only, full-page Message Center
- Clickable "Student Messages" stat card on the Grading Dashboard that navigates to `/messages`
- Conversations grouped by enrollment section/period, with expandable message threads

## Data Sources
- **Chats**: `courses/{courseId}/chats/{chatId}` — has `members[]`, `memberNames`, `type` (dm/group/team), `lastMessage`, `lastMessageAt`
- **Messages**: `courses/{courseId}/chats/{chatId}/messages/{messageId}` — has `text`, `senderId`, `senderName`, `createdAt`
- **Enrollments**: `enrollments` collection filtered by `courseId` — has `uid`, `name`, `email`, `section`
- No Firestore rules changes needed — teachers already have read access to all chats/messages

## Files

### 1. `src/pages/MessageCenter.jsx` (NEW, ~400 lines)

**Structure follows GradingDashboard.jsx pattern exactly:**
- `useAuth()` for role check + teacher-only guard
- Course loading on mount → course tabs at top
- When course changes: fetch enrollments (for section mapping) + all chats (ordered by `lastMessageAt` desc)
- Section grouping: cross-reference each chat's `members[]` with enrollment `section` field
- Lazy-load messages only when a conversation is expanded

**State:**
```
courses, selectedCourse, expandedChat, searchTerm
chats[], enrollments[], sectionMap (uid→section), messages (chatId→msg[])
loadingCourses, loadingData, loadingMessages
```

**Section grouping logic:**
- For each chat, look up members in sectionMap to find their section
- Group under the section of the first enrolled student member (skip teacher UID)
- Students with no section → "No Section Assigned" group
- Empty sections are hidden

**Page layout:**
```
┌─ Message Center ──────────────────────────────┐
│ h1: Message Center                            │
│ p: subtitle                                   │
│                                               │
│ [Course 1] [Course 2] [Course 3]   [🔍 search]│
│                                               │
│ Stats: [💬 Total] [👤 DMs] [👥 Groups]         │
│                                               │
│ ▼ Period 3 (8 conversations, 12 students)     │
│   ┌─ 👤 Alice Smith ─────── 2m ago ──────┐    │
│   │ "Thanks for the help with..."         │    │
│   └───────────────────────────────────────┘    │
│   ┌─ 👥 Study Group (4) ──── 1h ago ────┐    │
│   │ "Can we meet after class?"            │    │
│   │ ▼ [expanded: full message thread]     │    │
│   └───────────────────────────────────────┘    │
│                                               │
│ ▼ Period 5 (5 conversations, 8 students)      │
│   ...                                         │
│                                               │
│ ▼ No Section Assigned (2 conversations)       │
│   ...                                         │
└───────────────────────────────────────────────┘
```

**ConversationCard (inline sub-component):**
- Header: chat type icon (👤/👥/⚔️), participant name(s), last message preview, relative timestamp, member count badge for groups
- Click to expand → lazy-loads messages from Firestore
- Expanded: read-only message thread with sender names, timestamps, message bubbles (student messages left-aligned, teacher messages right-aligned amber)
- Reuses message bubble styling from ClassChat

### 2. `src/App.jsx` (MODIFY — 2 lines)

- Add lazy import: `const MessageCenter = lazy(() => import("./pages/MessageCenter"));`
- Add route after line 104: `<Route path="/messages" element={<MessageCenter />} />`

### 3. `src/components/grading/CourseOverview.jsx` (MODIFY — ~10 lines)

- Import `useNavigate` from react-router-dom
- Make the "Student Messages" stat card (3rd in the grid) clickable with `onClick={() => navigate("/messages")}`
- Add hover effect (border color change to green) and "View all →" label beneath the count
- Other two stat cards remain non-clickable

## Key Design Decisions
- **One-time fetch** (not real-time) for v1 — matches GradingDashboard pattern. ClassChat widget handles real-time for active conversations.
- **Lazy message loading** — only fetch messages subcollection when a conversation is expanded. Chat metadata (lastMessage, memberNames) is enough for the list view.
- **Cross-section group chats** — grouped under the section of the first enrolled student member (avoids duplication).
- **Reuse SearchSortBar** from `src/components/grading/SearchSortBar.jsx` — already supports search + sort dropdown.
- **Collapsible section groups** — each section header is clickable to collapse/expand, all start expanded.

## Verification
1. `npm run build` → no errors
2. Navigate to `/grading` → "Student Messages" card shows "View all →", click navigates to `/messages`
3. `/messages` page → course tabs visible, chats grouped by section
4. Click a conversation → expands to show full message thread
5. Search filters across participant names and message previews
6. Mobile: responsive layout
7. Non-teacher access → shows "Teacher access only" guard
8. Commit, push, merge, deploy
