// src/components/grading/SearchSortBar.jsx
export default function SearchSortBar({ searchTerm, setSearchTerm, sortBy, setSortBy, placeholder }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
      <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
        <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)", fontSize: 14, pointerEvents: "none" }}>🔍</span>
        <input type="text" placeholder={placeholder || "Search conversations..."} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "10px 14px 10px 36px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 14, outline: "none" }}
          onFocus={(e) => (e.target.style.borderColor = "var(--amber)")} onBlur={(e) => (e.target.style.borderColor = "var(--border)")} />
      </div>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
        style={{ padding: "10px 14px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--surface)", color: "var(--text)", fontFamily: "var(--font-body)", fontSize: 13 }}>
        <option value="recent">Most Recent</option>
        <option value="messages">Most Messages</option>
        <option value="student">Student Name</option>
      </select>
    </div>
  );
}