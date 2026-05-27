import { browser } from '$app/environment'
import { get } from 'svelte/store'
import type { Report, ReportStatus } from '@certiflow/shared'
import { fetchReports } from './api'
import { notifications, playNotificationPing } from './notifications'
import { getReportSourceFileName } from './report-file'
import { userSettings } from './settings'

const POLL_INTERVAL_MS = 20000

type StatusSnapshot = Record<string, ReportStatus>

export function startReportStatusMonitor() {
  if (!browser) {
    return () => {}
  }

  let stopped = false
  let initialized = false

  const poll = async () => {
    if (stopped) return

    try {
      const reports = await fetchReports()
      const previous = readSnapshot()
      const current = toSnapshot(reports)

      if (initialized) {
        notifyOnTransitions(reports, previous)
      } else {
        initialized = true
      }

      writeSnapshot(current)
    } catch {
      // Silent on purpose: this runs in the background and should not disturb the user.
    }
  }

  poll()
  const timer = window.setInterval(poll, POLL_INTERVAL_MS)

  return () => {
    stopped = true
    window.clearInterval(timer)
  }
}

function notifyOnTransitions(reports: Report[], previous: StatusSnapshot) {
  const settings = get(userSettings)
  if (!settings.criticalViolationAlerts) {
    return
  }

  for (const report of reports) {
    const previousStatus = previous[report.id]
    if (previousStatus !== 'ANALYZING') {
      continue
    }

    if (report.status !== 'COMPLETE' && report.status !== 'FAILED') {
      continue
    }

    const reportLabel = getReportSourceFileName(report)
    if (report.status === 'COMPLETE') {
      notifications.add(`${reportLabel} finished analysis and is ready to review.`, 'success')
    } else {
      notifications.add(`${reportLabel} failed during analysis. Please review and retry the upload.`, 'warning')
    }

    if (settings.notificationSound) {
      playNotificationPing()
    }
  }
}

function toSnapshot(reports: Report[]): StatusSnapshot {
  return Object.fromEntries(reports.map((report) => [report.id, report.status]))
}

function readSnapshot(): StatusSnapshot {
  try {
    const raw = window.localStorage.getItem('certiflow-report-status-snapshot')
    if (!raw) return {}
    return JSON.parse(raw) as StatusSnapshot
  } catch {
    return {}
  }
}

function writeSnapshot(snapshot: StatusSnapshot) {
  window.localStorage.setItem('certiflow-report-status-snapshot', JSON.stringify(snapshot))
}
