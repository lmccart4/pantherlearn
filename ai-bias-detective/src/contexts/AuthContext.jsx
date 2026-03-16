import { createContext, useContext, useState, useEffect } from 'react'
import { auth, db, googleProvider } from '../firebase'
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (profileDoc.exists()) {
          setUserProfile(profileDoc.data())
        }
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setUserProfile(null)
  }

  const setRole = async (role) => {
    if (!user) return
    const profile = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      classroomCodes: [],
      rank: role === 'student' ? 'Junior Analyst' : null,
      totalXP: 0,
      badges: [],
    }
    await setDoc(doc(db, 'users', user.uid), profile, { merge: true })
    setUserProfile(profile)
  }

  const joinClassroom = async (code) => {
    if (!user || !userProfile) return
    const classDoc = await getDoc(doc(db, 'classrooms', code))
    if (!classDoc.exists()) throw new Error('Classroom not found')
    
    const currentCodes = userProfile.classroomCodes || []
    if (currentCodes.includes(code)) throw new Error('Already in this classroom')
    
    const updatedCodes = [...currentCodes, code]
    await setDoc(doc(db, 'users', user.uid), { 
      classroomCodes: updatedCodes,
      updatedAt: serverTimestamp()
    }, { merge: true })
    
    await setDoc(doc(db, 'classrooms', code, 'students', user.uid), {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      joinedAt: serverTimestamp(),
    })
    
    setUserProfile(prev => ({ ...prev, classroomCodes: updatedCodes }))
  }

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      signInWithGoogle,
      signOut,
      setRole,
      joinClassroom,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
