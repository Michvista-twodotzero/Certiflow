import { writable } from 'svelte/store'
import { browser } from '$app/environment'
import type { AuthSession, ApiResponse } from '@certiflow/shared'
import { getApiBaseUrl } from './api-base-url'

const STORAGE_KEY = 'certiflow-auth-session'

function loadStoredSession(): AuthSession | null {
  if (!browser) return null

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthSession
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const authSession = writable<AuthSession | null>(loadStoredSession())

export function getStoredSession() {
  return loadStoredSession()
}

export function setAuthSession(session: AuthSession | null) {
  authSession.set(session)

  if (!browser) return
  if (session) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } else {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

export function clearAuthSession() {
  setAuthSession(null)
}

async function postAuth(path: string, body: Record<string, string>) {
  let response: Response

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch (error) {
    throw new Error('Cannot reach the API gateway. Check PUBLIC_API_BASE_URL and Railway deployment status.')
  }

  const payload = (await response.json()) as ApiResponse<AuthSession>
  if (!response.ok || !payload.success || !payload.data) {
    throw new Error(payload.error || 'Authentication failed')
  }

  setAuthSession(payload.data)
  return payload.data
}

export function register(input: { name: string; email: string; password: string }) {
  return postAuth('/auth/register', input)
}

export function login(input: { email: string; password: string }) {
  return postAuth('/auth/login', input)
}

export function logout() {
  clearAuthSession()
  if (browser) {
    window.localStorage.removeItem('certiflow-report-status-snapshot')
  }
}
