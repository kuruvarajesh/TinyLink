
import { useState, useEffect } from 'react'
import Spinner from '../components/Spinner'
import { api } from '../api/links'
import { formatUptime } from '../utils/helpers'

function Health() {
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await api.getHealth()
        setHealth(data)
        setError(null)
      } catch {
        setError('Failed to fetch health status')
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="health-page"><Spinner /></div>

  return (
    <div className="health-page">
      <div className="page-header">
        <h1>System Health</h1>
        <p className="subtitle">Service status and uptime information</p>
      </div>

      <div className="card">
        {error ? (
          <div className="health-error">
            <span className="status-dot status-error"></span>
            <span>Service Unavailable</span>
          </div>
        ) : (
          <div className="health-list">
            <div className="health-item">
              <span className="health-label">Status</span>
              <span className="health-value">
                <span className={`status-dot ${health.ok ? 'status-ok' : 'status-error'}`}></span>
                {health.ok ? 'Healthy' : 'Unhealthy'}
              </span>
            </div>
            <div className="health-item">
              <span className="health-label">Version</span>
              <span className="health-value">{health.version}</span>
            </div>
            <div className="health-item">
              <span className="health-label">Uptime</span>
              <span className="health-value">{formatUptime(health.uptime)}</span>
            </div>
            <div className="health-item">
              <span className="health-label">Database</span>
              <span className="health-value">
                <span className={`status-dot ${health.database === 'connected' ? 'status-ok' : 'status-error'}`}></span>
                {health.database}
              </span>
            </div>
            <div className="health-item">
              <span className="health-label">Timestamp</span>
              <span className="health-value">{new Date(health.timestamp).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Raw Response</h3>
        <pre className="json-block">{JSON.stringify(health || { error }, null, 2)}</pre>
      </div>
    </div>
  )
}

export default Health