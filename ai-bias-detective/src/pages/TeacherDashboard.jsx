import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../firebase'
import { doc, setDoc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { generateClassCode } from '../utils/scoring'
import { CASES } from '../data/cases'
import { Plus, Copy, Check, Users, FileText, ChevronDown } from 'lucide-react'

export default function TeacherDashboard() {
  const { user, userProfile } = useAuth()
  const [classrooms, setClassrooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newClassName, setNewClassName] = useState('')
  const [copiedCode, setCopiedCode] = useState(null)
  const [expandedClass, setExpandedClass] = useState(null)
  const [classStudents, setClassStudents] = useState({})
  const [classInvestigations, setClassInvestigations] = useState({})

  useEffect(() => {
    if (!user) return
    loadClassrooms()
  }, [user])

  const loadClassrooms = async () => {
    const q = query(collection(db, 'classrooms'), where('teacherId', '==', user.uid))
    const snap = await getDocs(q)
    setClassrooms(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    setLoading(false)
  }

  const createClassroom = async () => {
    if (!newClassName.trim()) return
    setCreating(true)
    const code = generateClassCode()
    await setDoc(doc(db, 'classrooms', code), {
      code,
      name: newClassName.trim(),
      teacherId: user.uid,
      teacherName: user.displayName,
      createdAt: new Date(),
    })
    setNewClassName('')
    setCreating(false)
    loadClassrooms()
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const toggleExpand = async (classId) => {
    if (expandedClass === classId) {
      setExpandedClass(null)
      return
    }
    setExpandedClass(classId)

    // Load students
    if (!classStudents[classId]) {
      const studSnap = await getDocs(collection(db, 'classrooms', classId, 'students'))
      const students = studSnap.docs.map(d => ({ id: d.id, ...d.data() }))
      setClassStudents(prev => ({ ...prev, [classId]: students }))

      // Load investigations for all students in this class
      if (students.length > 0) {
        const studentIds = students.map(s => s.uid)
        // Firestore 'in' queries limited to 30
        const batches = []
        for (let i = 0; i < studentIds.length; i += 30) {
          batches.push(studentIds.slice(i, i + 30))
        }
        let allInvestigations = []
        for (const batch of batches) {
          const invQ = query(collection(db, 'investigations'), where('studentId', 'in', batch))
          const invSnap = await getDocs(invQ)
          allInvestigations = [...allInvestigations, ...invSnap.docs.map(d => ({ id: d.id, ...d.data() }))]
        }
        setClassInvestigations(prev => ({ ...prev, [classId]: allInvestigations }))
      }
    }
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <span className="text-sm font-[family-name:var(--font-mono)] text-clue-gold animate-pulse">Loading classrooms...</span>
    </div>
  )

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-text-primary mb-6">Teacher Dashboard</h1>

      {/* Create classroom */}
      <div className="bg-case-dark border border-case-border rounded-xl p-5 mb-8">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Create Classroom</h2>
        <div className="flex gap-3">
          <input type="text" value={newClassName} onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Classroom name (e.g. Period 3 AI Literacy)"
            className="flex-1 bg-case-light border border-case-border rounded-lg px-3 py-2.5 text-sm text-text-primary placeholder:text-text-dim focus:outline-none focus:border-clue-gold/40" />
          <button onClick={createClassroom} disabled={creating || !newClassName.trim()}
            className="flex items-center gap-2 bg-clue-gold text-ink px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-clue-amber transition-colors disabled:opacity-50">
            <Plus className="w-4 h-4" />
            Create
          </button>
        </div>
      </div>

      {/* Classrooms list */}
      {classrooms.length === 0 ? (
        <div className="bg-case-dark border border-case-border rounded-xl p-8 text-center">
          <p className="text-text-secondary text-sm">No classrooms yet. Create one above to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {classrooms.map(cls => {
            const isExpanded = expandedClass === cls.id
            const students = classStudents[cls.id] || []
            const investigations = classInvestigations[cls.id] || []

            return (
              <div key={cls.id} className="bg-case-dark border border-case-border rounded-xl overflow-hidden">
                <div className="p-5 flex items-center gap-4">
                  <div className="flex-1">
                    <h3 className="text-text-primary font-semibold">{cls.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-[family-name:var(--font-mono)] text-text-dim">
                        Code: <span className="text-clue-gold">{cls.code}</span>
                      </span>
                      <button onClick={() => copyCode(cls.code)}
                        className="text-text-dim hover:text-clue-gold transition-colors">
                        {copiedCode === cls.code ? <Check className="w-3.5 h-3.5 text-mitigate-green" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                  <button onClick={() => toggleExpand(cls.id)}
                    className="flex items-center gap-2 text-xs text-text-secondary hover:text-text-primary transition-colors">
                    <Users className="w-4 h-4" />
                    View Students
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {isExpanded && (
                  <div className="border-t border-case-border p-5">
                    {students.length === 0 ? (
                      <p className="text-xs text-text-dim text-center py-4">No students have joined yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full data-table">
                          <thead>
                            <tr>
                              <th className="text-left">Student</th>
                              {CASES.map(c => (
                                <th key={c.id}>{c.title.split(' ')[0]}</th>
                              ))}
                              <th>Avg</th>
                            </tr>
                          </thead>
                          <tbody>
                            {students.map(student => {
                              const studentInvs = investigations.filter(i => i.studentId === student.uid)
                              const scores = CASES.map(c => {
                                const inv = studentInvs.find(i => i.caseId === c.id && i.status === 'submitted')
                                return inv?.score?.total ?? null
                              })
                              const validScores = scores.filter(s => s !== null)
                              const avg = validScores.length > 0
                                ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : null

                              return (
                                <tr key={student.uid}>
                                  <td className="text-left font-medium">{student.displayName}</td>
                                  {scores.map((score, i) => (
                                    <td key={i}>
                                      {score !== null ? (
                                        <span className={`${score >= 70 ? 'text-mitigate-green' : score >= 40 ? 'text-clue-amber' : 'text-bias-red'}`}>
                                          {score}
                                        </span>
                                      ) : (
                                        <span className="text-text-dim">—</span>
                                      )}
                                    </td>
                                  ))}
                                  <td>
                                    {avg !== null ? (
                                      <span className="text-info-blue font-semibold">{avg}</span>
                                    ) : (
                                      <span className="text-text-dim">—</span>
                                    )}
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
