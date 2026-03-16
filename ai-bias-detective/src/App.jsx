import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { InvestigationProvider } from './contexts/InvestigationContext'
import Layout from './components/layout/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import RoleSelect from './pages/RoleSelect'
import CaseBoard from './pages/CaseBoard'
import Investigation from './pages/Investigation'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'

function ProtectedRoute({ children, requiredRole }) {
  const { user, userProfile, loading } = useAuth()
  
  if (loading) return (
    <div className="min-h-screen bg-ink flex items-center justify-center">
      <div className="text-clue-gold font-mono text-sm animate-pulse">LOADING CASE FILES...</div>
    </div>
  )
  
  if (!user) return <Navigate to="/login" />
  if (!userProfile?.role) return <Navigate to="/role-select" />
  if (requiredRole && userProfile.role !== requiredRole) return <Navigate to="/cases" />
  
  return children
}

function AppRoutes() {
  const { user, userProfile } = useAuth()

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/cases" /> : <Landing />} />
      <Route path="/login" element={user ? <Navigate to={userProfile?.role ? '/cases' : '/role-select'} /> : <Login />} />
      <Route path="/role-select" element={
        user ? (userProfile?.role ? <Navigate to="/cases" /> : <RoleSelect />) : <Navigate to="/login" />
      } />
      <Route element={<Layout />}>
        <Route path="/cases" element={
          <ProtectedRoute><CaseBoard /></ProtectedRoute>
        } />
        <Route path="/investigate/:caseId" element={
          <ProtectedRoute><Investigation /></ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            {userProfile?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
          </ProtectedRoute>
        } />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <InvestigationProvider>
          <AppRoutes />
        </InvestigationProvider>
      </AuthProvider>
    </Router>
  )
}
