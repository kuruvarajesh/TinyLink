// ============================================
// src/api/links.js
// ============================================
const API_BASE = '/api'

export const api = {
  async createLink(url, code) {
    const res = await fetch(`${API_BASE}/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, code: code || undefined })
    })
    const data = await res.json()
    if (!res.ok) {
      const err = new Error(data.error || 'Failed to create link')
      err.status = res.status
      throw err
    }
    return data
  },

  async getLinks(search = '') {
    const params = search ? `?search=${encodeURIComponent(search)}` : ''
    const res = await fetch(`${API_BASE}/links${params}`)
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to fetch links')
    return data
  },

  async getLinkStats(code) {
    const res = await fetch(`${API_BASE}/links/${code}`)
    const data = await res.json()
    if (!res.ok) {
      const err = new Error(data.error || 'Failed to fetch stats')
      err.status = res.status
      throw err
    }
    return data
  },

  async deleteLink(code) {
    const res = await fetch(`${API_BASE}/links/${code}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Failed to delete link')
    return data
  },

  async getHealth() {
    const res = await fetch('/healthz')
    return res.json()
  }
}