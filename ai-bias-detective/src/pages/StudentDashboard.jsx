import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { CASES, BADGES } from '../data/cases'
import { getRank, getNextRank } from '../utils/scoring'
import { Trophy, Target, Clock, ArrowRight, Star } from 'lucide-react'

export default function StudentDashboard() {
  const { user, userProfile } = useAuth()
  const navigate = useNavigate()
  const [investigations, setInvestigations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const load = async () => {
      const q = query(
        collection(db, 'investigations'),
        where('studentId', '==', user.uid),
        orderBy('startedAt', 'desc')
      )
      const snap = await getDocs(q)
      setInvestigations(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoading(false)
    }
    load()
  }, [user])

  const totalXP = investigations
    .filter(i => i.status === 'submitted')
    .reduce((sum, i) => sum + (i.score?.xpEarned || 0), 0)

  const currentRank = getRank(totalXP)
  const nextRank = getNextRank(totalXP)
  const completedCases = investigations.filter(i => i.status === 'submitted').length
  const avgScore = completedCases > 0
    ? Math.round(investigations.filter(i => i.status === 'submitted').reduce((s, i) => s + (i.score?.total || 0), 0) / completedCases)
    : 0

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <span className="text-sm font-[family-name:var(--font-mono)] text-clue-gold animate-pulse">Loading case files...</span>
    </div>
  )

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-text-primary mb-6">Your Dashboard</h1>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Rank', value: `${currentRank.icon} ${currentRank.name}`, accent: 'text-clue-gold' },
          { label: 'Total XP', value: totalXP, accent: 'text-clue-amber' },
          { label: 'Cases Closed', value: `${completedCases}/4`, accent: 'text-mitigate-green' },
          { label: 'Avg Score', value: `${avgScore}%`, accent: 'text-info-blue' },
        ].map(stat => (
          <div key={stat.label} className="bg-case-dark border border-case-border rounded-xl p-4">
            <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-dim uppercase tracking-wider">{stat.label}</span>
            <p className={`text-lg font-semibold mt-1 ${stat.accent}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* XP progress to next rank */}
      {nextRank && (
        <div className="bg-case-dark border border-case-border rounded-xl p-4 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-secondary">Progress to {nextRank.icon} {nextRank.name}</span>
            <span className="text-xs font-[family-name:var(--font-mono)] text-text-dim">{totalXP}/{nextRank.minXP} XP</span>
          </div>
          <div className="h-2 bg-case-mid rounded-full overflow-hidden">
            <div className="h-full bg-clue-gold rounded-full transition-all"
              style={{ width: `${Math.min(100, (totalXP / nextRank.minXP) * 100)}%` }} />
          </div>
        </div>
      )}

      {/* Investigations list */}
      <h2 className="text-sm font-semibold text-text-primary mb-3">Your Investigations</h2>
      {investigations.length === 0 ? (
        <div className="bg-case-dark border border-case-border rounded-xl p-8 text-center">
          <p className="text-text-secondary text-sm mb-3">No investigations started yet.</p>
          <button onClick={() => navigate('/cases')}
            className="text-sm text-clue-gold hover:text-clue-amber transition-colors">
            Browse case files →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {investigations.map(inv => {
            const caseData = CASES.find(c => c.id === inv.caseId)
            return (
              <div key={inv.id} className="bg-case-dark border border-case-border rounded-xl p-4 flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-text-primary">{inv.caseTitle || caseData?.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[10px] font-[family-name:var(--font-mono)] uppercase tracking-wider ${
                      inv.status === 'submitted' ? 'text-mitigate-green' : 'text-clue-amber'
                    }`}>
                      {inv.status === 'submitted' ? 'Closed' : 'Active'}
                    </span>
                    {inv.score && (
                      <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-dim">
                        Score: {inv.score.total}/100
                      </span>
                    )}
                    <span className="text-[10px] font-[family-name:var(--font-mono)] text-text-dim">
                      Clues: {inv.discoveredClues?.length || 0}/{caseData?.totalClues || '?'}
                    </span>
                  </div>
                </div>
                {inv.status !== 'submitted' && (
                  <button onClick={() => navigate(`/investigate/${inv.caseId}`)}
                    className="text-xs text-clue-gold hover:text-clue-amber flex items-center gap-1 transition-colors">
                    Continue <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
