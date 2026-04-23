// src/pages/MessageCenter.jsx
// Teacher-only Message Center — full-page view of all ClassChat conversations
// organized by section/period and sub-organized by participant.
import { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, where, orderBy, limit, doc, getDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";

export default function MessageCenter() {
  const { user, userRole } = useAuth();

  // Navigation state
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [collapsedSections, setCollapsedSections] = useState({});
  const [activeTab, setActiveTab] = useState("conversations"); // "conversations" | "announcements"

  // Data state
  const [chats, setChats] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [sectionMap, setSectionMap] = useState({}); // uid → section
  const [studentMap, setStudentMap] = useState({}); // uid → { displayName, email, photoURL }
  const [expandedChat, setExpandedChat] = useState(null);
  const [messages, setMessages] = useState({}); // chatId → messages[]

  // Announcements state
  const [announcements, setAnnouncements] = useState([]);
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(false);
  const [deletingAnn, setDeletingAnn] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: "", body: "", icon: "📢", pinned: false });
  const [savingAnn, setSavingAnn] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const ANNOUNCEMENT_EMOJIS = [
    "📢","📣","🔔","🎉","⚠️","✅","❌","📅","📌","🏆",
    "🎯","💡","📝","🔗","🧪","🎓","📚","🖥️","🧠","⭐",
    "🚀","🔥","💬","🕐","📊","🎒","✏️","🏫","👀","🙌",
  ];

  // Loading state
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(null);

  // ─── Step 1: Load courses on mount ───
  useEffect(() => {
    if (userRole !== "teacher") return;
    const fetchCourses = async () => {
      try {
        const snap = await getDocs(collection(db, "courses"));
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((c) => !c.hidden);
        setCourses(list);
        if (list.length > 0) setSelectedCourse(list[0].id);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
      setLoadingCourses(false);
    };
    fetchCourses();
  }, [userRole]);

  // ─── Step 2: When course changes, load enrollments + all chats ───
  useEffect(() => {
    if (!selectedCourse) return;
    const fetchCourseData = async () => {
      setLoadingData(true);
      setExpandedChat(null);
      setMessages({});
      setSearchTerm("");

      try {
        // Fetch enrollments for section mapping
        const enrollSnap = await getDocs(
          query(collection(db, "enrollments"), where("courseId", "==", selectedCourse))
        );
        const enrollList = [];
        const uidToSection = {};
        enrollSnap.forEach((d) => {
          const data = d.data();
          const uid = data.uid || data.studentUid;
          if (uid) {
            uidToSection[uid] = data.section || "";
            enrollList.push({
              uid,
              name: data.name || data.email || "Unknown",
              email: data.email || "",
              section: data.section || "",
            });
          }
        });
        setEnrollments(enrollList);
        setSectionMap(uidToSection);

        // Fetch user profiles for enrolled students (parallel)
        const uniqueUids = [...new Set(enrollList.map((e) => e.uid))];
        const userDocs = await Promise.all(
          uniqueUids.map((uid) => getDoc(doc(db, "users", uid)).catch(() => null))
        );
        const users = {};
        userDocs.forEach((userDoc, i) => {
          if (userDoc?.exists()) {
            const data = userDoc.data();
            users[uniqueUids[i]] = {
              displayName: data.displayName || data.email || uniqueUids[i],
              email: data.email || "",
              photoURL: data.photoURL || "",
            };
          }
        });
        setStudentMap(users);

        // Fetch ALL chats for this course (teacher has read access),
        // then exclude chats the teacher is a member of — those belong in
        // the floating message widget, not the course-wide Message Center.
        const chatsSnap = await getDocs(
          query(
            collection(db, "courses", selectedCourse, "chats"),
            orderBy("lastMessageAt", "desc")
          )
        );
        const chatList = chatsSnap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((c) => !(c.members || []).includes(user?.uid));
        setChats(chatList);
      } catch (err) {
        console.error("Error fetching message center data:", err);
      }
      setLoadingData(false);
    };
    fetchCourseData();
  }, [selectedCourse, user?.uid]);

  // ─── Step 3: Load announcements when course or tab changes ───
  useEffect(() => {
    if (!selectedCourse || activeTab !== "announcements") return;
    const fetchAnnouncements = async () => {
      setLoadingAnnouncements(true);
      try {
        const snap = await getDocs(
          query(
            collection(db, "courses", selectedCourse, "announcements"),
            orderBy("createdAt", "desc")
          )
        );
        setAnnouncements(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
      setLoadingAnnouncements(false);
    };
    fetchAnnouncements();
  }, [selectedCourse, activeTab]);

  const handleDeleteAnnouncement = async (annId) => {
    if (!selectedCourse) return;
    setDeletingAnn(annId);
    try {
      await deleteDoc(doc(db, "courses", selectedCourse, "announcements", annId));
      setAnnouncements((prev) => prev.filter((a) => a.id !== annId));
    } catch (err) {
      console.error("Failed to delete announcement:", err);
    }
    setDeletingAnn(null);
  };

  const handleCreateAnnouncement = async () => {
    if (!selectedCourse || !newAnn.title.trim()) return;
    setSavingAnn(true);
    try {
      const ref = await addDoc(collection(db, "courses", selectedCourse, "announcements"), {
        title: newAnn.title.trim(),
        body: newAnn.body.trim(),
        icon: newAnn.icon || "📢",
        pinned: newAnn.pinned,
        authorName: user?.displayName || "Mr. McCarthy",
        authorUid: user?.uid,
        createdAt: serverTimestamp(),
      });
      const created = {
        id: ref.id,
        title: newAnn.title.trim(),
        body: newAnn.body.trim(),
        icon: newAnn.icon || "📢",
        pinned: newAnn.pinned,
        authorName: user?.displayName || "Mr. McCarthy",
        createdAt: new Date(),
      };
      setAnnouncements((prev) => newAnn.pinned ? [created, ...prev] : [created, ...prev]);
      setNewAnn({ title: "", body: "", icon: "📢", pinned: false });
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create announcement:", err);
    }
    setSavingAnn(false);
  };

  // ─── Expand/collapse chat and lazy-load messages ───
  const handleExpandChat = async (chatId) => {
    if (expandedChat === chatId) {
      setExpandedChat(null);
      return;
    }
    setExpandedChat(chatId);
    if (!messages[chatId]) {
      setLoadingMessages(chatId);
      try {
        const msgSnap = await getDocs(
          query(
            collection(db, "courses", selectedCourse, "chats", chatId, "messages"),
            orderBy("createdAt", "asc"),
            limit(200)
          )
        );
        const msgList = msgSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMessages((prev) => ({ ...prev, [chatId]: msgList }));
      } catch (err) {
        console.error("Failed to load messages:", err);
      }
      setLoadingMessages(null);
    }
  };

  // ─── Helpers ───
  const getChatDisplayName = (chat) => {
    if (chat.type === "team") return chat.name || "Team Chat";
    if (chat.type === "group") return chat.name || "Group Chat";
    if (chat.memberNames) {
      const otherUid = (chat.members || []).find((m) => m !== user?.uid);
      return chat.memberNames[otherUid] || "Direct Message";
    }
    return "Direct Message";
  };

  // Get all participant names for clear display (e.g., "Kenely → Mr. McCarthy")
  const getChatParticipants = (chat) => {
    const names = (chat.members || []).map((uid) => {
      const name = chat.memberNames?.[uid] || studentMap[uid]?.displayName || uid.slice(0, 8);
      const isTeacherMember = uid === user?.uid;
      return { uid, name, isTeacher: isTeacherMember };
    });
    return names;
  };

  const getChatIcon = (chat) => {
    if (chat.type === "dm") return "👤";
    if (chat.type === "team") return "⚔️";
    return "👥";
  };

  const formatTime = (date) => {
    if (!date) return "";
    const d = date?.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return "just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatMessageTime = (date) => {
    if (!date) return "";
    const d = date?.toDate ? date.toDate() : new Date(date);
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  const getSectionLabel = (section) => section || "No Section Assigned";

  const getStudentPhoto = (uid) => studentMap[uid]?.photoURL || "";

  // ─── Section grouping ───
  const getSectionGroups = () => {
    // Build section → chats mapping
    const chatsBySection = {};

    chats.forEach((chat) => {
      // Find the primary section by looking at chat members' enrollments
      const memberSections = (chat.members || [])
        .filter((uid) => uid !== user?.uid) // exclude teacher
        .map((uid) => sectionMap[uid])
        .filter((s) => s !== undefined);

      // Use first student's section, or "" if none found
      const primarySection = memberSections.length > 0 ? memberSections[0] : "";

      if (!chatsBySection[primarySection]) chatsBySection[primarySection] = [];
      chatsBySection[primarySection].push(chat);
    });

    // Sort sections: named sections first (alphabetical), then "" (no section) last
    const sectionKeys = Object.keys(chatsBySection).sort((a, b) => {
      if (a === "" && b !== "") return 1;
      if (a !== "" && b === "") return -1;
      return a.localeCompare(b);
    });

    return { chatsBySection, sectionKeys };
  };

  // ─── Filter and sort chats ───
  const filterAndSortChats = (chatList) => {
    let filtered = chatList;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = chatList.filter((chat) => {
        const names = Object.values(chat.memberNames || {}).join(" ").toLowerCase();
        const preview = (chat.lastMessage || "").toLowerCase();
        const chatName = (chat.name || "").toLowerCase();
        return names.includes(term) || preview.includes(term) || chatName.includes(term);
      });
    }
    return [...filtered].sort((a, b) => {
      if (sortBy === "recent") {
        const aTime = a.lastMessageAt?.toDate?.() || new Date(0);
        const bTime = b.lastMessageAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      }
      if (sortBy === "messages") return (b.members?.length || 0) - (a.members?.length || 0);
      if (sortBy === "name") return getChatDisplayName(a).localeCompare(getChatDisplayName(b));
      return 0;
    });
  };

  // ─── Toggle section collapse ───
  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // ─── Teacher guard ───
  if (userRole !== "teacher") {
    return (
      <div className="page-wrapper" style={{ textAlign: "center", paddingTop: 120 }}>
        <h2 style={{ fontFamily: "var(--font-display)" }}>Teacher access only</h2>
        <p style={{ color: "var(--text2)", marginTop: 8 }}>This page is only available to teachers.</p>
      </div>
    );
  }

  const isLoading = loadingCourses || loadingData;
  const { chatsBySection, sectionKeys } = getSectionGroups();

  // Stats
  const totalChats = chats.length;
  const totalDMs = chats.filter((c) => c.type === "dm").length;
  const totalGroups = chats.filter((c) => c.type === "group" || c.type === "team").length;

  return (
    <main id="main-content" className="page-wrapper">
        <h1 className="page-title" style={{ marginBottom: 8 }}>
          Message Center
        </h1>
        <p className="page-subtitle" style={{ marginBottom: 28 }}>
          View all student conversations organized by section.
        </p>

        {isLoading ? (
          <div>
            {/* Course tab skeletons */}
            <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton" style={{ width: 120, height: 36, borderRadius: 8 }} />
              ))}
            </div>
            {/* Stats card skeletons */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton skeleton-card" style={{ height: 88 }} />
              ))}
            </div>
            {/* Section + conversation row skeletons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="skeleton" style={{ height: 48, borderRadius: "10px 10px 0 0" }} />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton skeleton-line" style={{ height: 58, borderRadius: 0, marginBottom: 0 }} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Course tabs + view tabs + search/sort */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
              {/* Course tabs */}
              <div style={{ display: "flex", gap: 4, background: "var(--bg)", borderRadius: 8, padding: 3, width: "fit-content" }}>
                {courses.map((c) => (
                  <button key={c.id}
                    className={`top-nav-link ${selectedCourse === c.id ? "active" : ""}`}
                    onClick={() => setSelectedCourse(c.id)}>
                    {c.icon} {c.title}
                  </button>
                ))}
              </div>

              {/* Search (conversations tab only) */}
              {activeTab === "conversations" && (
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ position: "relative", minWidth: 200 }}>
                    <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: "100%", padding: "10px 14px 10px 36px", borderRadius: 8,
                        border: "1px solid var(--border)", background: "var(--surface)",
                        color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "var(--amber)")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{
                      padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)",
                      background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13,
                    }}
                  >
                    <option value="recent">Most Recent</option>
                    <option value="name">Participant Name</option>
                    <option value="messages">Most Members</option>
                  </select>
                </div>
              )}
            </div>

            {/* View tabs: Conversations | Announcements */}
            <div style={{ display: "flex", gap: 4, background: "var(--bg)", borderRadius: 8, padding: 3, width: "fit-content", marginBottom: 24 }}>
              {[
                { key: "conversations", label: "💬 Conversations" },
                { key: "announcements", label: "📢 Announcements" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  className={`top-nav-link ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "conversations" && (
              <>
                {/* Stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
                  {[
                    { label: "Total Conversations", value: totalChats, color: "var(--green)", icon: "💬" },
                    { label: "Direct Messages", value: totalDMs, color: "var(--cyan)", icon: "👤" },
                    { label: "Group Chats", value: totalGroups, color: "var(--amber)", icon: "👥" },
                  ].map((stat) => (
                    <div key={stat.label} className="card" style={{ textAlign: "center", padding: "16px 12px" }}>
                      <div style={{ fontSize: 18, marginBottom: 4 }}>{stat.icon}</div>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                      <div style={{ fontSize: 10, fontWeight: 600, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Section groups */}
                {totalChats === 0 ? (
                  <div className="card" style={{ textAlign: "center", padding: 60, color: "var(--text3)" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>💬</div>
                    <div style={{ fontSize: 15 }}>No conversations yet in this course</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>Student messages will appear here once they start chatting.</div>
                  </div>
                ) : (
                  sectionKeys.map((section) => {
                    const sectionChats = filterAndSortChats(chatsBySection[section]);
                    if (sectionChats.length === 0 && searchTerm) return null;
                    const isCollapsed = collapsedSections[section];
                    const sectionStudents = enrollments.filter((e) => (e.section || "") === section);

                    return (
                      <div key={section} style={{ marginBottom: 24 }}>
                        {/* Section header */}
                        <div
                          onClick={() => toggleSection(section)}
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "12px 16px", background: "var(--surface)", border: "1px solid var(--border)",
                            borderRadius: isCollapsed ? 10 : "10px 10px 0 0", cursor: "pointer",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--surface)")}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{
                              fontSize: 14, color: "var(--text3)", transition: "transform 0.2s",
                              transform: isCollapsed ? "rotate(-90deg)" : "rotate(0deg)",
                              display: "inline-block",
                            }}>▾</span>
                            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
                              {getSectionLabel(section)}
                            </span>
                          </div>
                          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text3)" }}>
                            <span style={{ fontWeight: 600 }}>💬 {sectionChats.length} {sectionChats.length === 1 ? "conversation" : "conversations"}</span>
                            <span style={{ fontWeight: 600 }}>👥 {sectionStudents.length} {sectionStudents.length === 1 ? "student" : "students"}</span>
                          </div>
                        </div>

                        {/* Section content */}
                        {!isCollapsed && (
                          <div style={{
                            border: "1px solid var(--border)", borderTop: "none",
                            borderRadius: "0 0 10px 10px", overflow: "hidden",
                          }}>
                            {sectionChats.length === 0 ? (
                              <div style={{ padding: 24, textAlign: "center", color: "var(--text3)", fontSize: 13 }}>
                                No conversations match your search
                              </div>
                            ) : (
                              sectionChats.map((chat) => (
                                <ConversationCard
                                  key={chat.id}
                                  chat={chat}
                                  user={user}
                                  isExpanded={expandedChat === chat.id}
                                  onToggle={() => handleExpandChat(chat.id)}
                                  messages={messages[chat.id] || null}
                                  loadingMessages={loadingMessages === chat.id}
                                  getChatDisplayName={getChatDisplayName}
                                  getChatParticipants={getChatParticipants}
                                  getChatIcon={getChatIcon}
                                  formatTime={formatTime}
                                  formatMessageTime={formatMessageTime}
                                  getStudentPhoto={getStudentPhoto}
                                  sectionMap={sectionMap}
                                />
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </>
            )}

            {activeTab === "announcements" && (
              <>
                {/* Announcements count + create button */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
                      {announcements.length} {announcements.length === 1 ? "announcement" : "announcements"}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text3)" }}>
                      for {courses.find((c) => c.id === selectedCourse)?.title || "this course"}
                    </span>
                  </div>
                  {selectedCourse && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      style={{
                        padding: "8px 16px", borderRadius: 8, border: "none",
                        background: "var(--amber)", color: "#1a1a1a",
                        fontSize: 13, fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 6,
                      }}
                    >
                      + New Announcement
                    </button>
                  )}
                </div>

                {loadingAnnouncements ? (
                  <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><div className="spinner" /></div>
                ) : announcements.length === 0 ? (
                  <div className="card" style={{ textAlign: "center", padding: 60, color: "var(--text3)" }}>
                    <div style={{ fontSize: 32, marginBottom: 12 }}>📢</div>
                    <div style={{ fontSize: 15 }}>No announcements for this course</div>
                    <div style={{ fontSize: 13, marginTop: 6 }}>Announcements you create from the dashboard will appear here.</div>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {announcements.map((ann) => {
                      const date = ann.createdAt?.toDate ? ann.createdAt.toDate() : ann.createdAt ? new Date(ann.createdAt) : null;
                      return (
                        <div
                          key={ann.id}
                          className="card"
                          style={{
                            padding: "16px 20px",
                            border: ann.pinned ? "1px solid rgba(245,166,35,0.35)" : "1px solid var(--border)",
                            background: ann.pinned ? "linear-gradient(135deg, rgba(245,166,35,0.08), transparent)" : undefined,
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <span style={{ fontSize: 20 }}>{ann.icon || "📢"}</span>
                                <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, color: "var(--text)" }}>
                                  {ann.title}
                                </span>
                                {ann.pinned && (
                                  <span style={{
                                    fontSize: 10, fontWeight: 700, color: "var(--amber)",
                                    padding: "2px 8px", background: "rgba(245,166,35,0.15)",
                                    borderRadius: 4, textTransform: "uppercase", letterSpacing: "0.06em",
                                  }}>
                                    Pinned
                                  </span>
                                )}
                              </div>
                              {ann.body && (
                                <div style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6, marginBottom: 8 }}>
                                  {ann.body}
                                </div>
                              )}
                              <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--text3)" }}>
                                {ann.authorName && <span>By {ann.authorName}</span>}
                                {date && (
                                  <span>
                                    {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    {" at "}
                                    {date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteAnnouncement(ann.id)}
                              disabled={deletingAnn === ann.id}
                              title="Delete announcement"
                              style={{
                                padding: "6px 12px", borderRadius: 6, border: "1px solid rgba(248,113,113,0.3)",
                                background: "rgba(248,113,113,0.1)", color: "#f87171",
                                fontSize: 12, fontWeight: 600, cursor: "pointer",
                                opacity: deletingAnn === ann.id ? 0.5 : 1,
                                transition: "background 0.15s, border-color 0.15s",
                                flexShrink: 0,
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.2)"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.5)"; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(248,113,113,0.1)"; e.currentTarget.style.borderColor = "rgba(248,113,113,0.3)"; }}
                            >
                              {deletingAnn === ann.id ? "..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        )}

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div
          onClick={() => setShowCreateModal(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000, padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 14, padding: 28, width: "100%", maxWidth: 520,
              display: "flex", flexDirection: "column", gap: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--text)" }}>
              New Announcement
            </div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginTop: -10 }}>
              {courses.find((c) => c.id === selectedCourse)?.title || "This course"}
            </div>

            {/* Icon + Title row */}
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker((p) => !p)}
                  style={{
                    width: 52, height: "100%", minHeight: 42, borderRadius: 8, textAlign: "center",
                    border: "1px solid var(--border)", background: "var(--bg)",
                    fontSize: 22, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  title="Pick emoji"
                >
                  {newAnn.icon}
                </button>
                {showEmojiPicker && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 10,
                    background: "var(--surface)", border: "1px solid var(--border)",
                    borderRadius: 10, padding: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                    display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4, width: 220,
                  }}>
                    {ANNOUNCEMENT_EMOJIS.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => { setNewAnn((p) => ({ ...p, icon: e })); setShowEmojiPicker(false); }}
                        style={{
                          background: newAnn.icon === e ? "var(--surface2)" : "transparent",
                          border: "none", borderRadius: 6, fontSize: 20, cursor: "pointer",
                          padding: 4, lineHeight: 1,
                        }}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <input
                type="text"
                placeholder="Announcement title..."
                value={newAnn.title}
                onChange={(e) => setNewAnn((p) => ({ ...p, title: e.target.value }))}
                style={{
                  flex: 1, padding: "10px 14px", borderRadius: 8,
                  border: "1px solid var(--border)", background: "var(--bg)",
                  color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14,
                }}
                autoFocus
                onFocus={() => setShowEmojiPicker(false)}
              />
            </div>

            {/* Body */}
            <textarea
              placeholder="Message body (optional)..."
              value={newAnn.body}
              onChange={(e) => setNewAnn((p) => ({ ...p, body: e.target.value }))}
              rows={4}
              style={{
                width: "100%", padding: "10px 14px", borderRadius: 8,
                border: "1px solid var(--border)", background: "var(--bg)",
                color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14,
                resize: "vertical", boxSizing: "border-box",
              }}
            />

            {/* Pinned toggle */}
            <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 13, color: "var(--text2)" }}>
              <input
                type="checkbox"
                checked={newAnn.pinned}
                onChange={(e) => setNewAnn((p) => ({ ...p, pinned: e.target.checked }))}
              />
              Pin this announcement
            </label>

            {/* Actions */}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  padding: "8px 18px", borderRadius: 8, border: "1px solid var(--border)",
                  background: "transparent", color: "var(--text2)", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAnnouncement}
                disabled={savingAnn || !newAnn.title.trim()}
                style={{
                  padding: "8px 18px", borderRadius: 8, border: "none",
                  background: newAnn.title.trim() ? "var(--amber)" : "var(--surface2)",
                  color: newAnn.title.trim() ? "#1a1a1a" : "var(--text3)",
                  fontSize: 13, fontWeight: 700, cursor: newAnn.title.trim() ? "pointer" : "not-allowed",
                  opacity: savingAnn ? 0.6 : 1,
                }}
              >
                {savingAnn ? "Posting..." : "Post Announcement"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

// ─── Conversation Card ───
function ConversationCard({
  chat, user, isExpanded, onToggle, messages, loadingMessages,
  getChatDisplayName, getChatParticipants, getChatIcon, formatTime, formatMessageTime,
  getStudentPhoto, sectionMap,
}) {
  const endRef = useRef(null);

  useEffect(() => {
    if (isExpanded && messages && endRef.current) {
      endRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [isExpanded, messages]);

  const memberCount = (chat.members || []).length;
  const icon = getChatIcon(chat);
  const lastTime = chat.lastMessageAt ? formatTime(chat.lastMessageAt) : "";
  const participants = getChatParticipants(chat);

  // Build participant display for DMs: "Student Name ↔ Teacher Name"
  // For groups: show group name with all members listed below
  const renderParticipantNames = () => {
    if (chat.type === "dm") {
      const student = participants.find((p) => !p.isTeacher);
      const teacher = participants.find((p) => p.isTeacher);
      if (student && teacher) {
        return (
          <span>
            <span style={{ fontWeight: 600, color: "var(--text)" }}>{student.name}</span>
            <span style={{ color: "var(--text3)", margin: "0 6px", fontSize: 12 }}>↔</span>
            <span style={{ fontWeight: 600, color: "var(--amber)" }}>{teacher.name}</span>
          </span>
        );
      }
      // DM between two students (no teacher)
      return (
        <span>
          {participants.map((p, i) => (
            <span key={p.uid}>
              {i > 0 && <span style={{ color: "var(--text3)", margin: "0 6px", fontSize: 12 }}>↔</span>}
              <span style={{ fontWeight: 600, color: "var(--text)" }}>{p.name}</span>
            </span>
          ))}
        </span>
      );
    }
    // Group / team chat
    return <span style={{ fontWeight: 600, color: "var(--text)" }}>{getChatDisplayName(chat)}</span>;
  };

  // All member names for group chats
  const allMemberNames = participants.map((p) => {
    const label = p.isTeacher ? `${p.name} (Teacher)` : p.name;
    return label;
  }).join(", ");

  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      {/* Card header */}
      <div
        onClick={onToggle}
        style={{
          display: "flex", alignItems: "center", gap: 14,
          padding: "14px 20px", cursor: "pointer", transition: "background 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface2)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {/* Chat type icon */}
        <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>

        {/* Main info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, fontSize: 14 }}>
            {renderParticipantNames()}
            {chat.type !== "dm" && (
              <span style={{
                fontSize: 11, color: "var(--text3)", padding: "1px 8px",
                background: "var(--surface2)", borderRadius: 4,
              }}>
                {memberCount} {memberCount === 1 ? "member" : "members"}
              </span>
            )}
          </div>
          {chat.type !== "dm" && (
            <div style={{
              fontSize: 11, color: "var(--text3)", marginBottom: 4,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {allMemberNames}
            </div>
          )}
          {!isExpanded && chat.lastMessage && (
            <div style={{
              fontSize: 13, color: "var(--text2)", overflow: "hidden",
              textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              "{chat.lastMessage}"
            </div>
          )}
        </div>

        {/* Right side: time + expand arrow */}
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: 12, color: "var(--text3)" }}>{lastTime}</div>
          <div style={{
            fontSize: 16, color: "var(--text3)", marginTop: 4,
            transition: "transform 0.2s", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          }}>▾</div>
        </div>
      </div>

      {/* Expanded message thread */}
      {isExpanded && (
        <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
          {/* Conversation info bar */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "10px 20px", borderBottom: "1px solid var(--border)",
            fontSize: 12, color: "var(--text3)",
          }}>
            <span>
              {chat.type === "dm" ? "Direct message" : `${memberCount} members`}
              {" · "}
              {allMemberNames}
              {chat.createdAt && ` · Started ${formatTime(chat.createdAt)}`}
            </span>
            <span>
              {messages ? `${messages.length} messages` : "Loading..."}
            </span>
          </div>

          {/* Message thread */}
          <div style={{
            padding: "16px 20px", maxHeight: 500, overflowY: "auto",
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            {loadingMessages ? (
              <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                <div className="spinner" style={{ width: 20, height: 20 }} />
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((msg) => {
                const isTeacher = msg.senderId === user?.uid;
                return (
                  <div key={msg.id} style={{ alignSelf: isTeacher ? "flex-end" : "flex-start", maxWidth: "80%" }}>
                    {!isTeacher && (
                      <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 2, paddingLeft: 2 }}>
                        {msg.senderName}
                      </div>
                    )}
                    <div style={{
                      padding: "8px 12px",
                      borderRadius: isTeacher ? "12px 12px 4px 12px" : "12px 12px 12px 4px",
                      background: isTeacher ? "var(--amber)" : "var(--surface)",
                      color: isTeacher ? "#1a1a1a" : "var(--text)",
                      fontSize: 13, lineHeight: 1.45, wordBreak: "break-word",
                      border: isTeacher ? "none" : "1px solid var(--border)",
                    }}>
                      {msg.text}
                    </div>
                    <div style={{
                      fontSize: 9, color: "var(--text3)", marginTop: 2,
                      textAlign: isTeacher ? "right" : "left", paddingLeft: 2, paddingRight: 2,
                    }}>
                      {formatMessageTime(msg.createdAt)}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ textAlign: "center", color: "var(--text3)", padding: 24, fontSize: 13 }}>
                No messages in this conversation
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>
      )}
    </div>
  );
}
