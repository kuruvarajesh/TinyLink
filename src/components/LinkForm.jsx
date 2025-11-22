// ============================================
// src/components/LinkForm.jsx
// ============================================
import { useState } from 'react'
import { api } from '../api/links'
import { validateUrl, validateCode, getBaseUrl, copyToClipboard } from '../utils/helpers'

function LinkForm({ onLinkCreated, showToast }) {
  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [successData, setSuccessData] = useState(null)

  const validate = () => {
    const errs = {}
    if (!url.trim()) {
      errs.url = 'URL is required'
    } else if (!validateUrl(url)) {
      errs.url = 'Please enter a valid URL (http:// or https://)'
    }
    if (code && !validateCode(code)) {
      errs.code = 'Code must be 6-8 alphanumeric characters'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessData(null)
    if (!validate()) return

    setLoading(true)
    try {
      const result = await api.createLink(url.trim(), code.trim())
      setSuccessData(result.data)
      setUrl('')
      setCode('')
      setErrors({})
      showToast('Link created successfully!', 'success')
      onLinkCreated()
    } catch (err) {
      if (err.status === 409) {
        setErrors({ code: err.message })
      } else {
        showToast(err.message, 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await copyToClipboard(`${getBaseUrl()}/${successData.code}`)
    showToast('Copied to clipboard!', 'success')
  }

  return (
    <div className="card">
      <h2 className="card-title">Create New Link</h2>
      <form onSubmit={handleSubmit} className="link-form">
        <div className="form-row">
          <div className="form-group form-group-url">
            <label htmlFor="url">Long URL <span className="required">*</span></label>
            <input
              type="text"
              id="url"
              value={url}
              onChange={(e) => { setUrl(e.target.value); errors.url && setErrors({...errors, url: ''}) }}
              placeholder="https://example.com/very/long/url"
              className={errors.url ? 'error' : ''}
              disabled={loading}
            />
            {errors.url && <span className="error-msg">{errors.url}</span>}
          </div>

          <div className="form-group form-group-code">
            <label htmlFor="code">Custom Code <span className="optional">(optional)</span></label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/[^A-Za-z0-9]/g, '')); errors.code && setErrors({...errors, code: ''}) }}
              placeholder="mycode"
              maxLength={8}
              className={errors.code ? 'error' : ''}
              disabled={loading}
            />
            <span className="hint">6-8 alphanumeric characters</span>
            {errors.code && <span className="error-msg">{errors.code}</span>}
          </div>

          <div className="form-group form-group-btn">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Shorten URL'}
            </button>
          </div>
        </div>
      </form>

      {successData && (
        <div className="success-box">
          <span className="success-icon">✓</span>
          <span>Link created!</span>
          <a href={`${getBaseUrl()}/${successData.code}`} target="_blank" rel="noopener noreferrer" className="success-link">
            {getBaseUrl()}/{successData.code}
          </a>
          <button className="btn btn-small btn-outline" onClick={handleCopy}>Copy</button>
        </div>
      )}
    </div>
  )
}

export default LinkForm



