
import { useState, useEffect, useCallback } from 'react'
import LinkForm from '../components/LinkForm'
import SearchBar from '../components/SearchBar'
import LinkTable from '../components/LinkTable'
import Spinner from '../components/Spinner'
import Modal from '../components/Modal'
import { api } from '../api/links'

function Dashboard({ showToast }) {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [deleteModal, setDeleteModal] = useState({ open: false, code: null })
  const [deleting, setDeleting] = useState(false)

  const fetchLinks = useCallback(async (searchTerm = '') => {
    try {
      setLoading(true)
      setError(null)
      const result = await api.getLinks(searchTerm)
      setLinks(result.data)
    } catch (err) {
      setError(err.message)
      showToast('Failed to load links', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  const handleSearch = (term) => {
    setSearch(term)
    fetchLinks(term)
  }

  const handleDeleteClick = (code) => {
    setDeleteModal({ open: true, code })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.code) return
    setDeleting(true)
    try {
      await api.deleteLink(deleteModal.code)
      setLinks(links.filter(l => l.code !== deleteModal.code))
      showToast('Link deleted successfully', 'success')
      setDeleteModal({ open: false, code: null })
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p className="subtitle">Manage your shortened links</p>
      </div>

      <LinkForm onLinkCreated={() => fetchLinks(search)} showToast={showToast} />
      <SearchBar onSearch={handleSearch} initialValue={search} />

      <div className="card">
        <div className="table-header">
          <h2 className="card-title">Your Links</h2>
          <span className="link-count">{links.length} link{links.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <div className="error-state">
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => fetchLinks(search)}>Retry</button>
          </div>
        ) : (
          <LinkTable links={links} onDelete={handleDeleteClick} showToast={showToast} />
        )}
      </div>

      <Modal
        isOpen={deleteModal.open}
        title="Delete Link"
        onClose={() => setDeleteModal({ open: false, code: null })}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        confirmDanger
        loading={deleting}
      >
        <p>Are you sure you want to delete this link? This action cannot be undone.</p>
        <p className="modal-code">Code: <strong>{deleteModal.code}</strong></p>
      </Modal>
    </div>
  )
}

export default Dashboard





