// src/components/TopBar.jsx
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logOut } from "../lib/firebase";
import { resolveDisplayName } from "../lib/displayName";
import LanguageSelector from "./LanguageSelector";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";

export default function TopBar() {
  const { user, userRole, nickname } = useAuth();
  const location = useLocation();
  const isTeacher = userRole === "teacher";

  const isActive = (path) => location.pathname === path ? "top-nav-link active" : "top-nav-link";

  const displayedName = isTeacher
    ? user?.displayName
    : resolveDisplayName({ displayName: user?.displayName, nickname });

  // Translate student-facing nav labels
  const uiStrings = useTranslatedTexts(isTeacher ? [] : [
    "Dashboard",     // 0
    "Character",     // 1
    "Sign out",      // 2
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  return (
    <div className="top-bar">
      <Link to="/" className="top-brand" style={{ textDecoration: "none" }}>PantherLearn</Link>

      <div className="top-nav-links">
        <Link to="/" className={isActive("/")} data-translatable>{isTeacher ? "Dashboard" : ui(0, "Dashboard")}</Link>
        <Link to="/avatar" className={isActive("/avatar")} data-translatable>⚔️ {isTeacher ? "Character" : ui(1, "Character")}</Link>
        {isTeacher && <Link to="/editor" className={isActive("/editor")}>Editor</Link>}
        {isTeacher && <Link to="/grading" className={isActive("/grading")}>Grading</Link>}
      </div>

      <div className="top-bar-right">
        <LanguageSelector />
        {user?.photoURL && <img src={user.photoURL} className="user-avatar" alt="" referrerPolicy="no-referrer" />}
        <span className="user-name">{displayedName}</span>
        <button className="sign-out-btn" onClick={logOut} data-translatable>{isTeacher ? "Sign out" : ui(2, "Sign out")}</button>
      </div>
    </div>
  );
}
