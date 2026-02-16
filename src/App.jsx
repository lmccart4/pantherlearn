// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <div className="spinner" />
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  return children;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Reset all possible scroll containers
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    // Also reset any scrollable divs in the page
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
        <Route path="/" element={<ProtectedRoute><TopBar /><Dashboard /></ProtectedRoute>} />
        <Route path="/course/:courseId" element={<ProtectedRoute><TopBar /><CoursePage /></ProtectedRoute>} />
        <Route path="/course/:courseId/lesson/:lessonId" element={<ProtectedRoute><TopBar /><LessonViewer /></ProtectedRoute>} />
        <Route path="/editor" element={<ProtectedRoute><TopBar /><LessonEditor /></ProtectedRoute>} />
        <Route path="/grading" element={<ProtectedRoute><TopBar /><GradingDashboard /></ProtectedRoute>} />
        <Route path="/rosters" element={<ProtectedRoute><TopBar /><RosterSync /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><TopBar /><StudentProgress /></ProtectedRoute>} />
        <Route path="/xp-controls/:courseId" element={<ProtectedRoute><TopBar /><XPControls /></ProtectedRoute>} />
        <Route path="/teams/:courseId" element={<ProtectedRoute><TopBar /><TeamManager /></ProtectedRoute>} />
        <Route path="/mana/:courseId" element={<ProtectedRoute><TopBar /><ManaManager /></ProtectedRoute>} />
        <Route path="/boss-battle/:courseId" element={<ProtectedRoute><TopBar /><BossBattle /></ProtectedRoute>} />
        <Route path="/avatar" element={<ProtectedRoute><TopBar /><AvatarCreator /></ProtectedRoute>} />
      </Routes>
      {user && <ClassChat />}
    </PreviewProvider>
  );
}

export default function App() {
  // Disable browser's automatic scroll restoration
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
