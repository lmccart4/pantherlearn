import { createContext, useContext, useState, useCallback } from 'react'
import { db } from '../firebase'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore'
import { useAuth } from './AuthContext'
import { CASES } from '../data/cases'

const InvestigationContext = createContext(null)

export function InvestigationProvider({ children }) {
  const { user } = useAuth()
  const [activeInvestigation, setActiveInvestigation] = useState(null)
  const [loading, setLoading] = useState(false)

  const startInvestigation = useCallback(async (caseId) => {
    if (!user) return
    setLoading(true)
    
    // Check for existing active investigation
    const q = query(
      collection(db, 'investigations'),
      where('studentId', '==', user.uid),
      where('caseId', '==', caseId),
      where('status', '==', 'active')
    )
    const existing = await getDocs(q)
    
    if (!existing.empty) {
      const existingDoc = existing.docs[0]
      setActiveInvestigation({ id: existingDoc.id, ...existingDoc.data() })
      setLoading(false)
      return existingDoc.id
    }
    
    // Create new investigation
    const investRef = doc(collection(db, 'investigations'))
    const caseData = CASES.find(c => c.id === caseId)
    
    const investigation = {
      studentId: user.uid,
      studentName: user.displayName,
      caseId,
      caseTitle: caseData.title,
      status: 'active',
      currentPhase: 'briefing',
      discoveredClues: [],
      flaggedEvidence: [],
      evidenceNotes: {},
      biasReport: {
        identifiedBiases: [],
        mitigations: [],
        summary: '',
      },
      score: null,
      startedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
    
    await setDoc(investRef, investigation)
    setActiveInvestigation({ id: investRef.id, ...investigation })
    setLoading(false)
    return investRef.id
  }, [user])

  const updatePhase = useCallback(async (phase) => {
    if (!activeInvestigation) return
    await updateDoc(doc(db, 'investigations', activeInvestigation.id), {
      currentPhase: phase,
      updatedAt: serverTimestamp(),
    })
    setActiveInvestigation(prev => ({ ...prev, currentPhase: phase }))
  }, [activeInvestigation])

  const discoverClue = useCallback(async (clueId) => {
    if (!activeInvestigation) return
    const current = activeInvestigation.discoveredClues || []
    if (current.includes(clueId)) return
    
    const updated = [...current, clueId]
    await updateDoc(doc(db, 'investigations', activeInvestigation.id), {
      discoveredClues: updated,
      updatedAt: serverTimestamp(),
    })
    setActiveInvestigation(prev => ({ ...prev, discoveredClues: updated }))
  }, [activeInvestigation])

  const flagEvidence = useCallback(async (evidenceId, note) => {
    if (!activeInvestigation) return
    const flagged = activeInvestigation.flaggedEvidence || []
    const notes = activeInvestigation.evidenceNotes || {}
    
    const updatedFlagged = flagged.includes(evidenceId) ? flagged : [...flagged, evidenceId]
    const updatedNotes = { ...notes, [evidenceId]: note }
    
    await updateDoc(doc(db, 'investigations', activeInvestigation.id), {
      flaggedEvidence: updatedFlagged,
      evidenceNotes: updatedNotes,
      updatedAt: serverTimestamp(),
    })
    setActiveInvestigation(prev => ({
      ...prev,
      flaggedEvidence: updatedFlagged,
      evidenceNotes: updatedNotes,
    }))
  }, [activeInvestigation])

  const updateBiasReport = useCallback(async (report) => {
    if (!activeInvestigation) return
    await updateDoc(doc(db, 'investigations', activeInvestigation.id), {
      biasReport: report,
      updatedAt: serverTimestamp(),
    })
    setActiveInvestigation(prev => ({ ...prev, biasReport: report }))
  }, [activeInvestigation])

  const submitInvestigation = useCallback(async (score) => {
    if (!activeInvestigation) return
    await updateDoc(doc(db, 'investigations', activeInvestigation.id), {
      status: 'submitted',
      score,
      submittedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    setActiveInvestigation(prev => ({ ...prev, status: 'submitted', score }))
  }, [activeInvestigation])

  const loadInvestigation = useCallback(async (investigationId) => {
    setLoading(true)
    const investDoc = await getDoc(doc(db, 'investigations', investigationId))
    if (investDoc.exists()) {
      setActiveInvestigation({ id: investDoc.id, ...investDoc.data() })
    }
    setLoading(false)
  }, [])

  return (
    <InvestigationContext.Provider value={{
      activeInvestigation,
      loading,
      startInvestigation,
      updatePhase,
      discoverClue,
      flagEvidence,
      updateBiasReport,
      submitInvestigation,
      loadInvestigation,
      setActiveInvestigation,
    }}>
      {children}
    </InvestigationContext.Provider>
  )
}

export const useInvestigation = () => {
  const ctx = useContext(InvestigationContext)
  if (!ctx) throw new Error('useInvestigation must be used within InvestigationProvider')
  return ctx
}
