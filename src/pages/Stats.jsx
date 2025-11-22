// ============================================
// src/pages/Stats.jsx
// ============================================
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal'
import { api } from '../api/links'
import { formatShortDate, getBaseUrl, copyToClipboard } from '../utils/helpers'

function Stats({ showToast }) {
  const { code } = useParams()
  const navigate = useNavigate()
  const [link, setLink] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const baseUrl = getBaseUrl()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const result = await api.getLinkStats(code)
        setLink(result.data)
      } catch (err) {
        setError(err.status === 404 ? 'Link not found' : err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [code])

  const handleCopy = async () => {
    await copyToClipboard(`${baseUrl}/${code}`)
    showToast('Copied to clipboard!', 'success')
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.deleteLink(code)
      showToast('Link deleted successfully', 'success')
      navigate('/')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setDeleting(false)
      setDeleteModal(false)
    }
  }

  if (loading) return <div className="stats-page"><Spinner size="large" /></div>

  if (error) {
    return (
      <div className="stats-page">
        <div className="error-page-content">
          <div className="error-icon">😕</div>
          <h1>{error}</h1>
          <p>The link you are looking for does not exist or has been deleted.</p>
          <Link to="/" className="btn btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="stats-page">
      <Link to="/" className="back-link">← Back to Dashboard</Link>

      <div className="page-header">
        <h1>Link Statistics</h1>
        <p className="subtitle">Detailed stats for your short link</p>
      </div>

      <div className="stats-grid">
        <div className="card stats-main">
          <h2 className="code-display">{link.code}</h2>
          <div className="short-url-row">
            <span className="short-url">{baseUrl}/{link.code}</span>
            <button className="btn btn-small btn-outline" onClick={handleCopy}>Copy</button>
          </div>
          <div className="target-section">
            <label>Target URL</label>
            <a href={link.original_url} target="_blank" rel="noopener noreferrer" className="target-url">
              {link.original_url}
            </a>
          </div>
        </div>

        <div className="card stat-card">
          <span className="stat-icon">👆</span>
          <div className="stat-info">
            <span className="stat-value">{link.total_clicks}</span>
            <span className="stat-label">Total Clicks</span>
          </div>
        </div>

        <div className="card stat-card">
          <span className="stat-icon">🕐</span>
          <div className="stat-info">
            <span className="stat-value">{formatShortDate(link.last_clicked)}</span>
            <span className="stat-label">Last Clicked</span>
          </div>
        </div>

        <div className="card stat-card">
          <span className="stat-icon">📅</span>
          <div className="stat-info">
            <span className="stat-value">{formatShortDate(link.created_at)}</span>
            <span className="stat-label">Created</span>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Actions</h3>
        <div className="actions-row">
          <a href={`${baseUrl}/${link.code}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
            Test Redirect
          </a>
          <button className="btn btn-danger" onClick={() => setDeleteModal(true)}>Delete Link</button>
        </div>
      </div>

      <Modal
        isOpen={deleteModal}
        title="Delete Link"
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        confirmText="Delete"
        confirmDanger
        loading={deleting}
      >
        <p>Are you sure you want to delete this link?</p>
        <p className="modal-code">Code: <strong>{code}</strong></p>
      </Modal>
    </div>
  )
}

export default Stats