/**
 * API Utility Module
 * Handles all API requests with token management
 * Features:
 * - Automatic token injection from localStorage
 * - Error handling and response parsing
 * - Configurable headers and request options
 */

const SESSION_KEY = 'eduelevate_session'
const RAW_API_URL = import.meta.env.VITE_API_URL || '/api'
export const API_URL = RAW_API_URL.endsWith('/api') ? RAW_API_URL : `${RAW_API_URL.replace(/\/+$/, '')}/api`
export const API_BASE = API_URL
export { SESSION_KEY }

/**
 * Makes an authenticated API request
 * @param {string} path - API endpoint path
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise} API response JSON
 */
export async function api(path, options = {}) {
  let token = ''
  
  // Get token from localStorage if available
  if (typeof window !== 'undefined') {
    try {
      const saved = window.localStorage.getItem(SESSION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        token = parsed?.token || ''
      }
    } catch {
      token = ''
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    },
    ...options
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const data = await res.json()
      message = data.message || message
    } catch {
      message = await res.text()
    }
    throw new Error(message)
  }

  if (res.status === 204) return null
  return res.json()
}
