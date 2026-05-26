import nodemailer from 'nodemailer'
import { AuditViolationResult, createLogger, ReportType } from '@certiflow/shared'

const logger = createLogger('ai-worker:email')

type NotificationRecipient = {
  email: string
  name: string
  emailNotifications: boolean
  criticalViolationAlerts: boolean
}

type AuditNotificationInput = {
  recipient: NotificationRecipient
  projectName: string
  reportId: string
  reportType: ReportType
  fileName: string
  summary: string
  violations: AuditViolationResult[]
}

let transporter: nodemailer.Transporter | null | undefined

export async function sendAuditNotifications(input: AuditNotificationInput) {
  const activeTransporter = getTransporter()
  if (!activeTransporter) {
    logger.warn('Email delivery skipped because SMTP is not configured')
    return []
  }

  const { recipient, violations } = input
  const criticalCount = violations.filter((violation) => violation.severity === 'CRITICAL').length
  const majorCount = violations.filter((violation) => violation.severity === 'MAJOR').length
  const minorCount = violations.filter((violation) => violation.severity === 'MINOR').length

  const results: Array<{ kind: 'completion' | 'critical'; messageId: string; previewUrl?: string | false }> = []

  if (recipient.emailNotifications) {
    const info = await activeTransporter.sendMail({
      from: getMailFrom(),
      to: recipient.email,
      subject: `[CertiFlow] Audit complete for ${input.projectName}`,
      text: buildCompletionText({ ...input, criticalCount, majorCount, minorCount }),
      html: buildCompletionHtml({ ...input, criticalCount, majorCount, minorCount }),
    })
    results.push({
      kind: 'completion',
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    })

    logger.info('Audit completion email sent', {
      reportId: input.reportId,
      recipientEmail: recipient.email,
    })
  }

  if (recipient.criticalViolationAlerts && criticalCount > 0) {
    const info = await activeTransporter.sendMail({
      from: getMailFrom(),
      to: recipient.email,
      subject: `[CertiFlow] Critical violations detected for ${input.projectName}`,
      text: buildCriticalAlertText({ ...input, criticalCount }),
      html: buildCriticalAlertHtml({ ...input, criticalCount }),
    })
    results.push({
      kind: 'critical',
      messageId: info.messageId,
      previewUrl: nodemailer.getTestMessageUrl(info),
    })

    logger.info('Critical violation alert email sent', {
      reportId: input.reportId,
      recipientEmail: recipient.email,
      criticalCount,
    })
  }

  return results
}

function getTransporter() {
  if (transporter !== undefined) {
    return transporter
  }

  const smtpUrl = process.env.SMTP_URL?.trim()
  if (smtpUrl) {
    transporter = nodemailer.createTransport(smtpUrl)
    return transporter
  }

  const host = process.env.SMTP_HOST?.trim()
  const portRaw = process.env.SMTP_PORT?.trim()
  const user = process.env.SMTP_USER?.trim()
  const pass = process.env.SMTP_PASS?.trim()

  if (!host || !portRaw || !user || !pass) {
    transporter = null
    return transporter
  }

  const port = Number(portRaw)
  transporter = nodemailer.createTransport({
    host,
    port: Number.isFinite(port) ? port : 587,
    secure: readBoolean(process.env.SMTP_SECURE, false),
    auth: {
      user,
      pass,
    },
  })

  return transporter
}

function getMailFrom() {
  return process.env.MAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || 'no-reply@certiflow.local'
}

function buildCompletionText(input: AuditNotificationInput & {
  criticalCount: number
  majorCount: number
  minorCount: number
}) {
  return [
    `Hi ${input.recipient.name},`,
    '',
    `Your ${formatReportType(input.reportType)} audit for "${input.projectName}" has completed in CertiFlow.`,
    `Source file: ${input.fileName}`,
    `Critical: ${input.criticalCount} | Major: ${input.majorCount} | Minor: ${input.minorCount}`,
    '',
    `Summary: ${input.summary}`,
    '',
    'Please sign in to CertiFlow to review the full findings and recommended actions.',
  ].join('\n')
}

function buildCompletionHtml(input: AuditNotificationInput & {
  criticalCount: number
  majorCount: number
  minorCount: number
}) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
      <p>Hi ${escapeHtml(input.recipient.name)},</p>
      <p>Your <strong>${escapeHtml(formatReportType(input.reportType))}</strong> audit for <strong>${escapeHtml(input.projectName)}</strong> has completed in CertiFlow.</p>
      <p><strong>Source file:</strong> ${escapeHtml(input.fileName)}<br />
      <strong>Critical:</strong> ${input.criticalCount} |
      <strong>Major:</strong> ${input.majorCount} |
      <strong>Minor:</strong> ${input.minorCount}</p>
      <p><strong>Summary:</strong> ${escapeHtml(input.summary)}</p>
      <p>Please sign in to CertiFlow to review the full findings and recommended actions.</p>
    </div>
  `.trim()
}

function buildCriticalAlertText(input: AuditNotificationInput & { criticalCount: number }) {
  return [
    `Hi ${input.recipient.name},`,
    '',
    `CertiFlow detected ${input.criticalCount} critical violation(s) in "${input.projectName}".`,
    `Report type: ${formatReportType(input.reportType)}`,
    `Source file: ${input.fileName}`,
    '',
    `Summary: ${input.summary}`,
    '',
    'Immediate review is recommended.',
  ].join('\n')
}

function buildCriticalAlertHtml(input: AuditNotificationInput & { criticalCount: number }) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
      <p>Hi ${escapeHtml(input.recipient.name)},</p>
      <p><strong>CertiFlow detected ${input.criticalCount} critical violation(s)</strong> in <strong>${escapeHtml(input.projectName)}</strong>.</p>
      <p><strong>Report type:</strong> ${escapeHtml(formatReportType(input.reportType))}<br />
      <strong>Source file:</strong> ${escapeHtml(input.fileName)}</p>
      <p><strong>Summary:</strong> ${escapeHtml(input.summary)}</p>
      <p>Immediate review is recommended.</p>
    </div>
  `.trim()
}

function formatReportType(reportType: ReportType) {
  return reportType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
}

function readBoolean(value: string | undefined, fallback: boolean) {
  if (!value) return fallback
  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase())
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
