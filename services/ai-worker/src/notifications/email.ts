import nodemailer from 'nodemailer'
import { AuditViolationResult, createLogger, ReportType } from '@certiflow/shared'

const logger = createLogger('ai-worker:email')

type NotificationRecipient = {
  email: string
  name: string
  emailNotifications?: boolean
}

type ReportStatusEmailInput = {
  recipient: NotificationRecipient
  projectName: string
  reportId: string
  reportType: ReportType
  fileName: string
  status: 'COMPLETE' | 'FAILED'
  summary?: string
  violations?: AuditViolationResult[]
  failureReason?: string
}

let transporter: nodemailer.Transporter | null | undefined

export async function sendReportStatusEmail(input: ReportStatusEmailInput) {
  if (!input.recipient.emailNotifications) {
    return null
  }

  const activeTransporter = getTransporter()
  if (!activeTransporter) {
    logger.warn('Email delivery skipped because SMTP is not configured')
    return null
  }

  const criticalCount = input.violations?.filter((violation) => violation.severity === 'CRITICAL').length ?? 0
  const majorCount = input.violations?.filter((violation) => violation.severity === 'MAJOR').length ?? 0
  const minorCount = input.violations?.filter((violation) => violation.severity === 'MINOR').length ?? 0

  const info = await activeTransporter.sendMail({
    from: getMailFrom(),
    to: input.recipient.email,
    subject: buildSubject(input),
    text: buildText(input, { criticalCount, majorCount, minorCount }),
    html: buildHtml(input, { criticalCount, majorCount, minorCount }),
  })

  logger.info('Report status email sent', {
    reportId: input.reportId,
    recipientEmail: input.recipient.email,
    status: input.status,
  })

  return {
    messageId: info.messageId,
    previewUrl: nodemailer.getTestMessageUrl(info),
  }
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

function buildSubject(input: ReportStatusEmailInput) {
  if (input.status === 'FAILED') {
    return `[CertiFlow] Audit failed for ${input.projectName}`
  }

  return `[CertiFlow] Audit complete for ${input.projectName}`
}

function buildText(
  input: ReportStatusEmailInput,
  counts: { criticalCount: number; majorCount: number; minorCount: number },
) {
  if (input.status === 'FAILED') {
    return [
      `Hi ${input.recipient.name},`,
      '',
      `Your ${formatReportType(input.reportType)} audit for "${input.projectName}" could not be completed.`,
      `Source file: ${input.fileName}`,
      '',
      input.failureReason ? `Reason: ${input.failureReason}` : 'Reason: The worker could not finish the analysis.',
      '',
      'Please sign in to CertiFlow and retry the upload or review the report details.',
    ].join('\n')
  }

  return [
    `Hi ${input.recipient.name},`,
    '',
    `Your ${formatReportType(input.reportType)} audit for "${input.projectName}" has completed in CertiFlow.`,
    `Source file: ${input.fileName}`,
    `Critical: ${counts.criticalCount} | Major: ${counts.majorCount} | Minor: ${counts.minorCount}`,
    '',
    `Summary: ${input.summary || 'The audit completed successfully.'}`,
    '',
    'Please sign in to CertiFlow to review the full findings and recommended actions.',
  ].join('\n')
}

function buildHtml(
  input: ReportStatusEmailInput,
  counts: { criticalCount: number; majorCount: number; minorCount: number },
) {
  if (input.status === 'FAILED') {
    return `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <p>Hi ${escapeHtml(input.recipient.name)},</p>
        <p>Your <strong>${escapeHtml(formatReportType(input.reportType))}</strong> audit for <strong>${escapeHtml(input.projectName)}</strong> could not be completed.</p>
        <p><strong>Source file:</strong> ${escapeHtml(input.fileName)}</p>
        <p><strong>Reason:</strong> ${escapeHtml(input.failureReason || 'The worker could not finish the analysis.')}</p>
        <p>Please sign in to CertiFlow and retry the upload or review the report details.</p>
      </div>
    `.trim()
  }

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
      <p>Hi ${escapeHtml(input.recipient.name)},</p>
      <p>Your <strong>${escapeHtml(formatReportType(input.reportType))}</strong> audit for <strong>${escapeHtml(input.projectName)}</strong> has completed in CertiFlow.</p>
      <p><strong>Source file:</strong> ${escapeHtml(input.fileName)}<br />
      <strong>Critical:</strong> ${counts.criticalCount} |
      <strong>Major:</strong> ${counts.majorCount} |
      <strong>Minor:</strong> ${counts.minorCount}</p>
      <p><strong>Summary:</strong> ${escapeHtml(input.summary || 'The audit completed successfully.')}</p>
      <p>Please sign in to CertiFlow to review the full findings and recommended actions.</p>
    </div>
  `.trim()
}

function getMailFrom() {
  return process.env.MAIL_FROM?.trim() || process.env.SMTP_USER?.trim() || 'no-reply@certiflow.local'
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
