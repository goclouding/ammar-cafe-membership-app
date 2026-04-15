import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import MembershipForm from './pages/MembershipForm'
import Success from './pages/Success'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted">...جاري التحميل</div>
  }

  return (
    <Routes>
      <Route path="/" element={<MembershipForm />} />
      <Route path="/success" element={<Success />} />
      <Route path="/admin/login" element={session ? <Navigate to="/admin" replace /> : <AdminLogin />} />
      <Route path="/admin" element={session ? <AdminDashboard session={session} /> : <Navigate to="/admin/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
