// ============================================
// src/App.jsx
// ============================================
import { useState, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Toast from './components/Toast'
import Dashboard from './pages/Dashboard'
import Stats from './pages/Stats'
import Health from './pages/Health'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  return (
    <div className="app">
      <Header />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Dashboard showToast={showToast} />} />
            <Route path="/code/:code" element={<Stats showToast={showToast} />} />
            <Route path="/health" element={<Health />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  )
}

export default App