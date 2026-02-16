// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import TopBar from "./components/TopBar";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import CoursePage from "./pages/CoursePage";
import LessonViewer from "./pages/LessonViewer";
import LessonEditor from "./pages/LessonEditor";
import GradingDashboard from "./pages/GradingDashboard";
import RosterSync from "./pages/RosterSync";
import StudentProgress from "./pages/StudentProgress";
import XPControls from "./pages/XPControls";
import TeamManager from "./pages/TeamManager";
import ManaManager from "./pages/ManaManager";
import BossBattle from "./pages/BossBattle";
import AvatarCreator from "./pages/AvatarCreator";
import { TranslationProvider } from "./contexts/TranslationContext";
import { PreviewProvider } from "./contexts/PreviewContext";
import PreviewBanner from "./components/PreviewBanner";
import ClassChat from "./components/ClassChat";

// Reuse PantherPrep's existing translate Cloud Function
const TRANSLATE_URL = "https://us-central1-pantherprep-a5a73.cloudfunctions.net/translateText";

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div className="spinner" />
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  return (
    <>
      <TopBar />
      <Outlet />
    </>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    document.querySelectorAll('[style*="overflow"]').forEach(el => {
      el.scrollTop = 0;
    });
  }, [pathname]);
  return null;
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div className="spinner" />
    </div>
  );

  return (
    <PreviewProvider>
      <ScrollToTop />
      <PreviewBanner />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/course/:courseId/lesson/:lessonId" element={<LessonViewer />} />
          <Route path="/editor" element={<LessonEditor />} />
          <Route path="/grading" element={<GradingDashboard />} />
          <Route path="/rosters" element={<RosterSync />} />
          <Route path="/progress" element={<StudentProgress />} />
          <Route path="/xp-controls/:courseId" element={<XPControls />} />
          <Route path="/teams/:courseId" element={<TeamManager />} />
          <Route path="/mana/:courseId" element={<ManaManager />} />
          <Route path="/boss-battle/:courseId" element={<BossBattle />} />
          <Route path="/avatar" element={<AvatarCreator />} />
        </Route>
      </Routes>
      {user && <ClassChat />}
    </PreviewProvider>
  );
}

export default function App() {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <TranslationProvider cloudFunctionUrl={TRANSLATE_URL}>
          <AppRoutes />
        </TranslationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}