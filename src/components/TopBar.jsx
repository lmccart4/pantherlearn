// src/components/TopBar.jsx — Savanna Signal rewrite
import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { logOut } from "../lib/firebase";
import { resolveDisplayName } from "../lib/displayName";
import { setRole } from "../lib/theme";
import NotificationBell from "./NotificationBell";
import PerfModeToggle from "./PerfModeToggle";
import ThemeToggle from "./ThemeToggle";
import { useTranslatedTexts } from "../hooks/useTranslatedText.jsx";
import { Topnav, TopnavBrand, Button } from "./savanna";
import "./topbar-savanna.css";

export default function TopBar() {
  const { user, userRole, nickname } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isTeacher = userRole === "teacher";

  // Sync teacher role → cobalt hero palette
  useEffect(() => {
    setRole(isTeacher ? "teacher" : "student");
  }, [isTeacher]);

  const displayedName = isTeacher
    ? user?.displayName
    : resolveDisplayName({ displayName: user?.displayName, nickname });

  // Translate student-facing nav labels (indices stable for i18n)
  const uiStrings = useTranslatedTexts(isTeacher ? [] : [
    "Dashboard", // 0
    "Character", // 1
    "Sign out",  // 2
    "My Grades", // 3
  ]);
  const ui = (i, fallback) => uiStrings?.[i] ?? fallback;

  const path = location.pathname;
  const active = (to, prefix = false) =>
    prefix ? path.startsWith(to) : path === to;
  const cls = (on) => (on ? "active" : undefined);

  const brand = (
    <TopnavBrand glyph="P" onClick={() => navigate("/")}>PantherLearn</TopnavBrand>
  );

  const studentLinks = (
    <>
      <NavLink to="/" end className={cls(active("/"))} data-translatable>{ui(0, "Dashboard")}</NavLink>
      <NavLink to="/avatar" className={cls(active("/avatar"))} data-translatable>{ui(1, "Character")}</NavLink>
      <NavLink to="/my-grades" className={cls(active("/my-grades"))} data-translatable>{ui(3, "My Grades")}</NavLink>
      <NavLink to="/my-mana" className={cls(active("/my-mana", true))}>Mana</NavLink>
    </>
  );

  const teacherLinks = (
    <>
      <NavLink to="/" end className={cls(active("/"))}>Dashboard</NavLink>
      <NavLink to="/avatar" className={cls(active("/avatar"))}>Character</NavLink>
      <NavLink to="/editor" className={cls(active("/editor"))}>Editor</NavLink>
      <NavLink to="/grading" className={cls(active("/grading"))}>Grading</NavLink>
      <NavLink to="/progress" className={cls(active("/progress"))}>Progress</NavLink>
      <NavLink to="/analytics" className={cls(active("/analytics"))}>Analytics</NavLink>
      <NavLink to="/rosters" className={cls(active("/rosters"))}>Rosters</NavLink>
      <NavLink to="/messages" className={cls(active("/messages"))}>Messages</NavLink>
      <NavLink to="/teacher/mana-requests" className={cls(active("/teacher/mana-requests", true))}>Mana</NavLink>
    </>
  );

  const rightSlot = (
    <>
      <ThemeToggle />
      <PerfModeToggle />
      <NotificationBell />
      {user?.photoURL && (
        <img src={user.photoURL} className="sv-topbar-avatar" alt="" referrerPolicy="no-referrer" />
      )}
      <span className="sv-topbar-name" title={displayedName}>{displayedName}</span>
      <Button variant="ghost" size="sm" onClick={logOut} data-translatable>
        {isTeacher ? "Sign out" : ui(2, "Sign out")}
      </Button>
    </>
  );

  return (
    <div className="sv-topbar-wrap">
      <a href="#main-content" className="skip-to-content">Skip to content</a>
      <Topnav
        className="sv-topbar"
        brand={brand}
        links={isTeacher ? teacherLinks : studentLinks}
        rightSlot={rightSlot}
      />
    </div>
  );
}
