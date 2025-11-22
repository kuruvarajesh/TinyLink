
// ============================================
// src/components/Header.jsx
// ============================================
import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🔗</span>
          <span className="logo-text">TinyLink</span>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Dashboard</Link>
          <Link to="/health" className="nav-link">Health</Link>
        </nav>
      </div>
    </header>
  )
}

export default Header