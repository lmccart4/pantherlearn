import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Search, FolderOpen, LayoutDashboard, LogOut, Shield } from 'lucide-react'

export default function Layout() {
  const { user, userProfile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navItems = [
    { to: '/cases', label: 'Case Files', icon: FolderOpen },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Sidebar */}
      <aside className="w-64 bg-case-dark border-r border-case-border flex flex-col fixed h-full z-20">
        {/* Logo */}
        <div className="p-5 border-b border-case-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-clue-gold/10 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-clue-gold" />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-display)] text-lg text-text-primary leading-tight">
                Bias Detective
              </h1>
              <p className="text-[10px] font-[family-name:var(--font-mono)] text-text-dim uppercase tracking-widest">
                AI Investigation Unit
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? 'bg-clue-gold/10 text-clue-gold'
                    : 'text-text-secondary hover:bg-case-light hover:text-text-primary'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-case-border">
          <div className="flex items-center gap-3 mb-3">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-case-light flex items-center justify-center text-xs text-text-secondary">
                {user?.displayName?.[0] || '?'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-text-primary truncate">{user?.displayName}</p>
              <p className="text-[10px] font-[family-name:var(--font-mono)] text-clue-gold uppercase tracking-wider">
                {userProfile?.role === 'teacher' ? 'Instructor' : userProfile?.rank || 'Junior Analyst'}
              </p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-xs text-text-dim hover:text-bias-red transition-colors w-full px-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <div className="p-8 max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
