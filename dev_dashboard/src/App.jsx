import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SlotManagerPage from './pages/SlotManagerPage'
import UserManagerPage from './pages/UserManagerPage'
import Sidebar from './components/Sidebar'
import Toast from './components/Toast'

function ProtectedLayout() {
  const { isAuthenticated } = useAuth()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), 3500)
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />

  return (
    <div className="app-layout">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(p => !p)} />
      <main className={`main-content${sidebarCollapsed ? ' sidebar-collapsed' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/slots" replace />} />
          <Route path="/slots" element={<SlotManagerPage showToast={showToast} />} />
          <Route path="/users" element={<UserManagerPage showToast={showToast} />} />
        </Routes>
      </main>
      {toast && <Toast {...toast} />}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
