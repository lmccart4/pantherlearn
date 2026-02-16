// src/components/ClassChat.jsx
// Floating class chat widget — DMs, group chats, and team chats
// All messages are logged and visible to the teacher (Mr. McCarthy)

import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, doc, setDoc, getDoc, getDocs, serverTimestamp, limit
} from "firebase/firestore";
import { db } from "../lib/firebase";

// ─── Chat List View ───
function ChatList({ chats, onSelect, onNew, user, unreadMap }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{
        padding: "14px 16px", borderBottom: "1px solid var(--border, #2a2f3d)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text, #e0e0e0)" }}>
          💬 Messages
        </span>
        <button onClick={onNew} style={{
          background: "var(--amber, #f59e0b)", color: "#1a1a1a", border: "none",
          borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer",
        }}>
          + New
        </button>
      </div>

      {/* Monitoring notice */}
      <div style={{
        padding: "8px 16px", background: "rgba(245, 158, 11, 0.08)",
        borderBottom: "1px solid var(--border, #2a2f3d)",
        fontSize: 10, color: "var(--amber, #f59e0b)", textAlign: "center",
        fontWeight: 600, letterSpacing: "0.03em",
      }}>
        🔒 All messages are logged and visible to Mr. McCarthy
      </div>

      <div style={{ flex: 1, overflowY: "auto" }}>
        {chats.length === 0 && (
          <p style={{ color: "var(--text3, #888)", fontSize: 13, textAlign: "center", padding: 24 }}>
            No conversations yet. Start one!
          </p>
        )}
        {chats.map((chat) => {
          const isUnread = unreadMap[chat.id];
          const chatName = getChatName(chat, user.uid);
          return (
            <button key={chat.id} onClick={() => onSelect(chat)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "12px 16px", border: "none", borderBottom: "1px solid var(--border, #2a2f3d)",
              background: isUnread ? "rgba(245, 158, 11, 0.06)" : "transparent",
              cursor: "pointer", textAlign: "left",
            }}>
              <span style={{ fontSize: 20 }}>
                {chat.type === "dm" ? "👤" : chat.type === "team" ? "⚔️" : "👥"}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: isUnread ? 700 : 500,
                  color: "var(--text, #e0e0e0)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {chatName}
                </div>
                {chat.lastMessage && (
                  <div style={{
                    fontSize: 11, color: "var(--text3, #888)", marginTop: 2,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {chat.lastMessage}
                  </div>
                )}
              </div>
              {isUnread && (
                <span style={{
                  width: 8, height: 8, borderRadius: "50%", background: "var(--amber, #f59e0b)",
                  flexShrink: 0,
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Message View ───
function MessageView({ chat, user, courseId, onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const hasScrolled = useRef(false);

  useEffect(() => {
    if (!chat?.id) return;
    const q = query(
      collection(db, "courses", courseId, "chats", chat.id, "messages"),
      orderBy("createdAt", "asc"),
      limit(200)
    );
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    // Mark as read
    const readRef = doc(db, "courses", courseId, "chats", chat.id, "readBy", user.uid);
    setDoc(readRef, { readAt: serverTimestamp() }, { merge: true });

    return unsub;
  }, [chat?.id, courseId, user.uid]);

  useEffect(() => {
    if (messages.length > 0) {
      endRef.current?.scrollIntoView({ behavior: hasScrolled.current ? "smooth" : "auto" });
      hasScrolled.current = true;
    }
  }, [messages]);

  const send = async () => {
    if (!input.trim() || sending) return;
    setSending(true);
    const text = input.trim();
    setInput("");
    try {
      await addDoc(collection(db, "courses", courseId, "chats", chat.id, "messages"), {
        text,
        senderId: user.uid,
        senderName: user.displayName || "Anonymous",
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "courses", courseId, "chats", chat.id), {
        lastMessage: text,
        lastMessageAt: serverTimestamp(),
      }, { merge: true });
      await setDoc(doc(db, "courses", courseId, "chats", chat.id, "readBy", user.uid), {
        readAt: serverTimestamp(),
      }, { merge: true });
    } catch (err) {
      console.error("Send failed:", err);
    }
    setSending(false);
  };

  const chatName = getChatName(chat, user.uid);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{
        padding: "10px 14px", borderBottom: "1px solid var(--border, #2a2f3d)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", color: "var(--text3, #888)",
          cursor: "pointer", fontSize: 18, padding: "0 4px",
        }}>←</button>
        <span style={{ fontSize: 16 }}>
          {chat.type === "dm" ? "👤" : chat.type === "team" ? "⚔️" : "👥"}
        </span>
        <span style={{
          fontWeight: 700, fontSize: 14, color: "var(--text, #e0e0e0)",
          flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {chatName}
        </span>
      </div>

      <div style={{
        padding: "6px 14px", background: "rgba(245, 158, 11, 0.06)",
        fontSize: 10, color: "var(--amber, #f59e0b)", textAlign: "center", fontWeight: 600,
      }}>
        🔒 Messages are logged and visible to Mr. McCarthy
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 6 }}>
        {messages.map((msg) => {
          const isMe = msg.senderId === user.uid;
          return (
            <div key={msg.id} style={{ alignSelf: isMe ? "flex-end" : "flex-start", maxWidth: "80%" }}>
              {!isMe && (
                <div style={{ fontSize: 10, color: "var(--text3, #888)", marginBottom: 2, paddingLeft: 2 }}>
                  {msg.senderName}
                </div>
              )}
              <div style={{
                padding: "8px 12px",
                borderRadius: isMe ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                background: isMe ? "var(--amber, #f59e0b)" : "var(--surface, #1e2132)",
                color: isMe ? "#1a1a1a" : "var(--text, #e0e0e0)",
                fontSize: 13, lineHeight: 1.45, wordBreak: "break-word",
                border: isMe ? "none" : "1px solid var(--border, #2a2f3d)",
              }}>
                {msg.text}
              </div>
              <div style={{
                fontSize: 9, color: "var(--text3, #888)", marginTop: 2,
                textAlign: isMe ? "right" : "left", paddingLeft: 2, paddingRight: 2,
              }}>
                {msg.createdAt?.toDate?.()?.toLocaleTimeString?.([], { hour: "numeric", minute: "2-digit" }) || ""}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <div style={{
        padding: "10px 14px", borderTop: "1px solid var(--border, #2a2f3d)",
        display: "flex", gap: 8,
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Type a message..."
          style={{
            flex: 1, padding: "8px 12px", borderRadius: 8,
            border: "1px solid var(--border, #2a2f3d)",
            background: "var(--bg, #141622)", color: "var(--text, #e0e0e0)",
            fontSize: 13, outline: "none",
          }}
        />
        <button onClick={send} disabled={sending || !input.trim()} style={{
          background: "var(--amber, #f59e0b)", color: "#1a1a1a", border: "none",
          borderRadius: 8, padding: "8px 14px", fontSize: 13, fontWeight: 700,
          cursor: "pointer", opacity: (!input.trim() || sending) ? 0.5 : 1,
        }}>
          Send
        </button>
      </div>
    </div>
  );
}

// ─── New Chat View ───
// FIX #31: Try per-course enrollments first, fall back to user doc check if empty.
// Students only see the course owner (teacher), not all teachers in the system.
function NewChatView({ courseId, user, userRole, onCreated, onBack }) {
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Get all users (needed for name resolution and role checking)
        const usersSnap = await getDocs(collection(db, "users"));
        const allUsers = usersSnap.docs.map((d) => ({ uid: d.id, ...d.data() }));

        // Try per-course enrollments subcollection first
        let enrolledUids = new Set();
        try {
          const enrollSubSnap = await getDocs(collection(db, "courses", courseId, "enrollments"));
          enrollSubSnap.forEach((d) => {
            const data = d.data();
            if (data.uid) enrolledUids.add(data.uid);
            if (data.studentUid) enrolledUids.add(data.studentUid);
          });
        } catch (e) { /* subcollection may not exist */ }

        let enrolledStudents;

        if (enrolledUids.size > 0) {
          // Use subcollection results
          enrolledStudents = allUsers.filter((u) =>
            u.uid !== user.uid && u.role !== "teacher" && enrolledUids.has(u.uid)
          );
        } else {
          // Fallback: check enrolledCourses on user docs
          enrolledStudents = allUsers.filter((u) => {
            if (u.uid === user.uid) return false;
            if (u.role === "teacher") return false;
            const ec = u.enrolledCourses;
            if (Array.isArray(ec)) return ec.includes(courseId);
            if (ec && typeof ec === "object") return courseId in ec;
            return false;
          });

          // Second fallback: check global enrollments collection
          if (enrolledStudents.length === 0) {
            const enrollSnap = await getDocs(
              query(collection(db, "enrollments"), where("courseId", "==", courseId))
            );
            const fallbackUids = new Set();
            enrollSnap.docs.forEach((d) => {
              const data = d.data();
              if (data.uid) fallbackUids.add(data.uid);
              if (data.studentUid) fallbackUids.add(data.studentUid);
            });
            fallbackUids.delete(user.uid);
            enrolledStudents = allUsers.filter((u) => fallbackUids.has(u.uid) && u.role !== "teacher");
          }
        }

        // Build final list
        const result = [...enrolledStudents];

        // For students: add only the course owner (teacher), not all teachers
        if (userRole !== "teacher") {
          try {
            const courseDoc = await getDoc(doc(db, "courses", courseId));
            const ownerUid = courseDoc.exists() ? courseDoc.data().ownerUid : null;
            if (ownerUid && ownerUid !== user.uid) {
              const existingUids = new Set(result.map((r) => r.uid));
              if (!existingUids.has(ownerUid)) {
                const ownerUser = allUsers.find((u) => u.uid === ownerUid);
                if (ownerUser) {
                  result.push(ownerUser);
                } else {
                  // Owner not in allUsers (shouldn't happen, but fetch directly as fallback)
                  const ownerDoc = await getDoc(doc(db, "users", ownerUid));
                  if (ownerDoc.exists()) {
                    result.push({ uid: ownerUid, ...ownerDoc.data() });
                  }
                }
              }
            }
          } catch (e) { /* ignore */ }
        }

        setStudents(result);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
      setLoading(false);
    };
    fetchStudents();
  }, [courseId, user.uid, userRole]);

  const create = async () => {
    if (selected.length === 0) return;
    const members = [user.uid, ...selected];
    const isDm = selected.length === 1;

    if (isDm) {
      const existing = await findExistingDm(courseId, user.uid, selected[0]);
      if (existing) { onCreated(existing); return; }
    }

    const memberNames = { [user.uid]: user.displayName || "Anonymous" };
    selected.forEach((uid) => {
      const s = students.find((st) => st.uid === uid);
      if (s) memberNames[uid] = s.displayName || s.name || "Student";
    });

    const chatData = {
      type: isDm ? "dm" : "group",
      name: isDm ? "" : (groupName || "Group Chat"),
      members,
      memberNames,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      lastMessage: "",
      lastMessageAt: serverTimestamp(),
    };

    const ref = await addDoc(collection(db, "courses", courseId, "chats"), chatData);
    onCreated({ id: ref.id, ...chatData });
  };

  const toggle = (uid) => {
    setSelected((prev) => prev.includes(uid) ? prev.filter((u) => u !== uid) : [...prev, uid]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{
        padding: "10px 14px", borderBottom: "1px solid var(--border, #2a2f3d)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", color: "var(--text3, #888)",
          cursor: "pointer", fontSize: 18, padding: "0 4px",
        }}>←</button>
        <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text, #e0e0e0)" }}>
          New Conversation
        </span>
      </div>

      {selected.length > 1 && (
        <div style={{ padding: "10px 14px", borderBottom: "1px solid var(--border, #2a2f3d)" }}>
          <input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Group name (optional)"
            style={{
              width: "100%", padding: "7px 10px", borderRadius: 8,
              border: "1px solid var(--border, #2a2f3d)",
              background: "var(--bg, #141622)", color: "var(--text, #e0e0e0)",
              fontSize: 13, outline: "none",
            }}
          />
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto" }}>
        {loading ? (
          <p style={{ color: "var(--text3)", textAlign: "center", padding: 24, fontSize: 13 }}>Loading...</p>
        ) : students.length === 0 ? (
          <p style={{ color: "var(--text3)", textAlign: "center", padding: 24, fontSize: 13 }}>No students enrolled yet.</p>
        ) : (
          students.map((s) => (
            <button key={s.uid} onClick={() => toggle(s.uid)} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "10px 16px", border: "none",
              borderBottom: "1px solid var(--border, #2a2f3d)",
              background: selected.includes(s.uid) ? "rgba(245, 158, 11, 0.1)" : "transparent",
              cursor: "pointer", textAlign: "left",
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: 6,
                border: selected.includes(s.uid)
                  ? "2px solid var(--amber, #f59e0b)"
                  : "2px solid var(--border, #2a2f3d)",
                background: selected.includes(s.uid) ? "var(--amber, #f59e0b)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: "#1a1a1a",
              }}>
                {selected.includes(s.uid) ? "✓" : ""}
              </span>
              <span style={{ fontSize: 13, color: "var(--text, #e0e0e0)" }}>
                {s.displayName || s.name || "Student"}
              </span>
              {s.role === "teacher" && (
                <span style={{
                  fontSize: 10, color: "var(--amber, #f59e0b)", fontWeight: 700,
                  background: "rgba(245, 158, 11, 0.1)", padding: "2px 6px", borderRadius: 4,
                }}>TEACHER</span>
              )}
            </button>
          ))
        )}
      </div>

      {selected.length > 0 && (
        <div style={{ padding: "12px 14px", borderTop: "1px solid var(--border, #2a2f3d)" }}>
          <button onClick={create} style={{
            width: "100%", padding: "10px 0", borderRadius: 8, border: "none",
            background: "var(--amber, #f59e0b)", color: "#1a1a1a",
            fontWeight: 700, fontSize: 13, cursor: "pointer",
          }}>
            {selected.length === 1 ? "Start Direct Message" : `Create Group Chat (${selected.length + 1} members)`}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Helpers ───
function getChatName(chat, currentUid) {
  if (chat.type === "team") return chat.name || "Team Chat";
  if (chat.type === "group") return chat.name || "Group Chat";
  if (chat.memberNames) {
    const otherUid = (chat.members || []).find((m) => m !== currentUid);
    return chat.memberNames[otherUid] || "Direct Message";
  }
  return "Direct Message";
}

async function findExistingDm(courseId, uid1, uid2) {
  const q = query(
    collection(db, "courses", courseId, "chats"),
    where("type", "==", "dm"),
    where("members", "array-contains", uid1)
  );
  const snap = await getDocs(q);
  for (const d of snap.docs) {
    const data = d.data();
    if (data.members?.includes(uid2) && data.members?.length === 2) {
      return { id: d.id, ...data };
    }
  }
  return null;
}

// ─── Main Chat Widget ───
export default function ClassChat() {
  const { user, userRole } = useAuth();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("list");
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [unreadMap, setUnreadMap] = useState({});
  const [courseId, setCourseId] = useState(null);
  const [courses, setCourses] = useState([]);
  const [chatEnabled, setChatEnabled] = useState(true);

  // FIX #30: Get courses — teachers fetch all, students resolve from user doc then fetch only those
  useEffect(() => {
    if (!user) return;
    const fetchCourses = async () => {
      if (userRole === "teacher") {
        const snap = await getDocs(collection(db, "courses"));
        const allCourses = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setCourses(allCourses);
        if (allCourses.length > 0) setCourseId(allCourses[0].id);
      } else {
        // Students: read enrolledCourses from their user doc to get IDs
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const ec = userDoc.exists() ? userDoc.data().enrolledCourses : null;
        let enrolledIds = new Set();

        if (ec && typeof ec === "object" && !Array.isArray(ec)) {
          Object.entries(ec).forEach(([key, value]) => {
            if (value === true && isNaN(key)) enrolledIds.add(key);
            else if (typeof value === "string" && value) enrolledIds.add(value);
          });
        } else if (Array.isArray(ec)) {
          enrolledIds = new Set(ec);
        }

        // Fallback: check enrollments collection by email
        if (enrolledIds.size === 0) {
          const enrollSnap = await getDocs(
            query(collection(db, "enrollments"), where("email", "==", user.email?.toLowerCase()))
          );
          enrollSnap.forEach((d) => enrolledIds.add(d.data().courseId));
        }

        // Fetch only the enrolled course docs (not ALL courses)
        const enrolled = [];
        for (const cid of enrolledIds) {
          try {
            const courseDoc = await getDoc(doc(db, "courses", cid));
            if (courseDoc.exists()) {
              enrolled.push({ id: courseDoc.id, ...courseDoc.data() });
            }
          } catch (e) { /* course may not exist */ }
        }

        setCourses(enrolled);
        if (enrolled.length > 0) setCourseId(enrolled[0].id);
      }
    };
    fetchCourses();
  }, [user, userRole]);

  // Check if chat enabled
  useEffect(() => {
    if (!courseId) return;
    const unsub = onSnapshot(doc(db, "courses", courseId), (snap) => {
      const data = snap.data();
      setChatEnabled(data?.chatEnabled !== false);
    });
    return unsub;
  }, [courseId]);

  // Listen to chats
  useEffect(() => {
    if (!courseId || !user) return;

    let q;
    if (userRole === "teacher") {
      q = query(collection(db, "courses", courseId, "chats"), orderBy("lastMessageAt", "desc"));
    } else {
      q = query(
        collection(db, "courses", courseId, "chats"),
        where("members", "array-contains", user.uid),
        orderBy("lastMessageAt", "desc")
      );
    }

    const unsub = onSnapshot(q, (snap) => {
      setChats(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [courseId, user, userRole]);

  // FIX #32: Parallelize unread checks instead of sequential loop
  useEffect(() => {
    if (!courseId || !user || chats.length === 0) return;
    const checkUnread = async () => {
      const map = {};
      const readPromises = chats.map(async (chat) => {
        try {
          const readDoc = await getDoc(doc(db, "courses", courseId, "chats", chat.id, "readBy", user.uid));
          if (!readDoc.exists()) {
            if (chat.lastMessage) map[chat.id] = true;
          } else {
            const readAt = readDoc.data()?.readAt?.toDate?.();
            const lastAt = chat.lastMessageAt?.toDate?.();
            if (readAt && lastAt && lastAt > readAt) map[chat.id] = true;
          }
        } catch (e) { /* ignore */ }
      });
      await Promise.all(readPromises);
      setUnreadMap(map);
    };
    checkUnread();
  }, [chats, courseId, user]);

  if (!user || !courseId) return null;
  if (!chatEnabled && userRole !== "teacher") return null;

  const totalUnread = Object.values(unreadMap).filter(Boolean).length;

  return (
    <>
      {/* Floating button */}
      <button onClick={() => setOpen(!open)} style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 9000,
        width: 56, height: 56, borderRadius: "50%",
        background: "var(--amber, #f59e0b)", border: "none",
        boxShadow: "0 4px 20px rgba(245, 158, 11, 0.35)",
        cursor: "pointer", fontSize: 24,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "transform 0.15s",
        transform: open ? "scale(0.9)" : "scale(1)",
      }}>
        {open ? "✕" : "💬"}
        {totalUnread > 0 && !open && (
          <span style={{
            position: "absolute", top: -2, right: -2,
            background: "#ef4444", color: "#fff",
            fontSize: 11, fontWeight: 700,
            width: 20, height: 20, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {totalUnread}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: "fixed", bottom: 92, right: 24, zIndex: 9000,
          width: 360, height: 520,
          background: "var(--bg, #141622)",
          border: "1px solid var(--border, #2a2f3d)",
          borderRadius: 16,
          boxShadow: "0 12px 48px rgba(0, 0, 0, 0.5)",
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Course selector */}
          {courses.length > 1 && (
            <div style={{
              padding: "8px 14px", borderBottom: "1px solid var(--border, #2a2f3d)",
              display: "flex", gap: 4, overflowX: "auto",
            }}>
              {courses.map((c) => (
                <button key={c.id} onClick={() => { setCourseId(c.id); setView("list"); setActiveChat(null); }}
                  style={{
                    padding: "4px 10px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 600,
                    cursor: "pointer", whiteSpace: "nowrap",
                    background: courseId === c.id ? "var(--amber, #f59e0b)" : "var(--surface, #1e2132)",
                    color: courseId === c.id ? "#1a1a1a" : "var(--text3, #888)",
                  }}>
                  {c.icon || "📚"} {c.title}
                </button>
              ))}
            </div>
          )}

          {!chatEnabled && userRole === "teacher" && (
            <div style={{
              padding: "8px 14px", background: "rgba(239, 68, 68, 0.08)",
              fontSize: 11, color: "#ef4444", textAlign: "center", fontWeight: 600,
            }}>
              Chat is disabled for students in this course
            </div>
          )}

          <div style={{ flex: 1, overflow: "hidden" }}>
            {view === "list" && (
              <ChatList
                chats={chats} user={user} unreadMap={unreadMap}
                onSelect={(chat) => { setActiveChat(chat); setView("chat"); }}
                onNew={() => setView("new")}
              />
            )}
            {view === "chat" && activeChat && (
              <MessageView
                chat={activeChat} user={user} courseId={courseId}
                onBack={() => { setView("list"); setActiveChat(null); }}
              />
            )}
            {view === "new" && (
              <NewChatView
                courseId={courseId} user={user} userRole={userRole}
                onBack={() => setView("list")}
                onCreated={(chat) => { setActiveChat(chat); setView("chat"); }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}