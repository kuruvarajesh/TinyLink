// ============================================
// src/components/LinkTable.jsx
// ============================================
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { formatDate, getBaseUrl, copyToClipboard } from '../utils/helpers'

function LinkTable({ links, onDelete, showToast }) {
  const [sort, setSort] = useState({ key: null, dir: 'asc' })
  const baseUrl = getBaseUrl()

  const handleCopy = async (code) => {
    await copyToClipboard(`${baseUrl}/${code}`)
    showToast('Copied to clipboard!', 'success')
  }

  const handleSort = (key) => {
    setSort(prev => ({
      key,
      dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc'
    }))
  }

  const sortedLinks = useMemo(() => {
    if (!sort.key) return links
    return [...links].sort((a, b) => {
      let aVal, bVal
      switch (sort.key) {
        case 'code':
          aVal = a.code.toLowerCase()
          bVal = b.code.toLowerCase()
          break
        case 'url':
          aVal = a.original_url.toLowerCase()
          bVal = b.original_url.toLowerCase()
          break
        case 'clicks':
          aVal = a.total_clicks
          bVal = b.total_clicks
          break
        case 'last':
          aVal = a.last_clicked ? new Date(a.last_clicked).getTime() : 0
          bVal = b.last_clicked ? new Date(b.last_clicked).getTime() : 0
          break
        default:
          return 0
      }
      if (aVal < bVal) return sort.dir === 'asc' ? -1 : 1
      if (aVal > bVal) return sort.dir === 'asc' ? 1 : -1
      return 0
    })
  }, [links, sort])

  const sortIcon = (key) => {
    if (sort.key !== key) return ''
    return sort.dir === 'asc' ? ' ↑' : ' ↓'
  }

  if (links.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔗</div>
        <h3>No links yet</h3>
        <p>Create your first shortened link using the form above.</p>
      </div>
    )
  }

  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th className="sortable" onClick={() => handleSort('code')}>Short Code{sortIcon('code')}</th>
            <th className="sortable" onClick={() => handleSort('url')}>Target URL{sortIcon('url')}</th>
            <th className="sortable" onClick={() => handleSort('clicks')}>Clicks{sortIcon('clicks')}</th>
            <th className="sortable" onClick={() => handleSort('last')}>Last Clicked{sortIcon('last')}</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedLinks.map((link) => (
            <tr key={link.code}>
              <td>
                <div className="code-cell">
                  <a href={`${baseUrl}/${link.code}`} target="_blank" rel="noopener noreferrer" className="code-link">
                    {link.code}
                  </a>
                  <button className="btn-icon" onClick={() => handleCopy(link.code)} title="Copy">📋</button>
                </div>
              </td>
              <td>
                <a href={link.original_url} target="_blank" rel="noopener noreferrer" className="url-link" title={link.original_url}>
                  {link.original_url}
                </a>
              </td>
              <td className="center">
                <span className="badge">{link.total_clicks}</span>
              </td>
              <td className="date-cell">
                {link.last_clicked ? formatDate(link.last_clicked) : <span className="muted">Never</span>}
              </td>
              <td className="actions-cell">
                <Link to={`/code/${link.code}`} className="btn btn-small btn-outline">Stats</Link>
                <button className="btn btn-small btn-danger" onClick={() => onDelete(link.code)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LinkTable