import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import type { ApiResponse, AuthSession, Report, Violation, UserSettings } from '@certiflow/shared'
import { clearAuthSession, getStoredSession } from './auth'
import { getApiBaseUrl } from './api-base-url'

type ReportRecord = Omit<Report, 'uploadedAt'> & { uploadedAt: string | Date }
type ViolationRecord = Omit<Violation, 'detectedAt'> & { detectedAt: string | Date }

function requireSession(): AuthSession {
  const session = getStoredSession()
  if (!session) {
    if (browser) {
      clearAuthSession()
      goto('/401')
    }

    throw new Error('Unauthorized')
  }

  return session
}

function createHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra)
  const session = requireSession()
  headers.set('Authorization', `Bearer ${session.token}`)
  return headers
}

function handleUnauthorized() {
  clearAuthSession()
  if (browser) {
    void goto('/401')
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: createHeaders(init?.headers),
    })
  } catch {
    throw new Error('Cannot reach the API gateway. Check PUBLIC_API_BASE_URL and Railway deployment status.')
  }

  const payload = (await response.json()) as ApiResponse<T>
  if (response.status === 401) {
    handleUnauthorized()
  }

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || 'Request failed')
  }

  return payload.data as T
}

function toReport(record: ReportRecord): Report {
  return {
    ...record,
    uploadedAt: new Date(record.uploadedAt),
  }
}

function toViolation(record: ViolationRecord): Violation {
  return {
    ...record,
    detectedAt: new Date(record.detectedAt),
  }
}

export async function fetchReports(): Promise<Report[]> {
  const records = await request<ReportRecord[]>('/reports')
  return records.map(toReport)
}

export async function fetchReport(reportId: string): Promise<Report> {
  const record = await request<ReportRecord>(`/reports/${reportId}`)
  return toReport(record)
}

export async function fetchViolations(reportId: string): Promise<Violation[]> {
  const records = await request<ViolationRecord[]>(`/reports/${reportId}/violations`)
  return records.map(toViolation)
}

export async function resolveViolation(violationId: string): Promise<Violation> {
  const record = await request<ViolationRecord>(`/reports/violations/${violationId}/resolve`, {
    method: 'PATCH',
  })

  return toViolation(record)
}

export async function submitReport(payload: {
  projectId: string
  projectName?: string
  reportType: Report['reportType']
  notes?: string
  file: File
}): Promise<Report> {
  const formData = new FormData()
  formData.append('projectId', payload.projectId)
  formData.append('projectName', payload.projectName || '')
  formData.append('reportType', payload.reportType)
  formData.append('notes', payload.notes || '')
  formData.append('file', payload.file)

  let response: Response

  try {
    response = await fetch(`${getApiBaseUrl()}/reports`, {
      method: 'POST',
      headers: createHeaders(),
      body: formData,
    })
  } catch {
    throw new Error('Cannot reach the API gateway. Check PUBLIC_API_BASE_URL and Railway deployment status.')
  }

  const record = (await response.json()) as ApiResponse<ReportRecord>
  if (response.status === 401) {
    handleUnauthorized()
  }

  if (!response.ok || !record.success || !record.data) {
    throw new Error(record.error || 'Unable to submit report')
  }

  return toReport(record.data)
}

export function fetchSettings(): Promise<UserSettings> {
  return request<UserSettings>('/settings')
}

export function saveSettings(
  payload: Pick<UserSettings, 'emailNotifications' | 'criticalViolationAlerts' | 'notificationSound'>,
): Promise<UserSettings> {
  return request<UserSettings>('/settings', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
}
