import { Worker, Job } from 'bullmq'
import { AuditJobPayload, createLogger } from '@certiflow/shared'
import { auditReport } from '../agent/auditor'
import { sendAuditNotifications } from '../notifications/email'
import { prisma } from '../utils/prisma'

const logger = createLogger('ai-worker:queue-consumer')

export const AUDIT_QUEUE_NAME = 'audit-queue'

export function startQueueConsumer() {
  const worker = new Worker(
    AUDIT_QUEUE_NAME,
    async (job: Job<AuditJobPayload>) => {
      const { reportId, fileUrl, projectName, originalFileName, mimeType } = job.data

      logger.info('Job received', { reportId, jobId: job.id })

      await prisma.report.update({
        where: { id: reportId },
        data: { status: 'ANALYZING' },
      })

      const auditResult = await auditReport(fileUrl, projectName, { originalFileName, mimeType })

      if (auditResult.violations.length > 0) {
        await prisma.violation.createMany({
          data: auditResult.violations.map((violation) => ({
            reportId,
            ruleReference: violation.ruleReference,
            severity: violation.severity,
            description: violation.description,
            suggestion: violation.suggestion,
            sector: violation.sector ?? null,
          })),
        })

        logger.info('Violations saved', {
          reportId,
          count: auditResult.violations.length,
        })
      }

      await prisma.report.update({
        where: { id: reportId },
        data: {
          status: 'COMPLETE',
          summary: auditResult.summary,
          extractionStrategy: auditResult.extraction.strategy,
          ocrProvider: auditResult.extraction.ocrProvider ?? null,
          ocrConfidence: auditResult.extraction.ocrConfidence ?? null,
        },
      })

      const completedReport = await prisma.report.findUnique({
        where: { id: reportId },
        include: {
          project: {
            include: {
              user: true,
            },
          },
        },
      })

      if (completedReport?.project?.user?.email) {
        await sendAuditNotifications({
          recipient: {
            email: completedReport.project.user.email,
            name: completedReport.project.user.name,
            emailNotifications: completedReport.project.user.emailNotifications,
            criticalViolationAlerts: completedReport.project.user.criticalViolationAlerts,
          },
          projectName: completedReport.project.name,
          reportId,
          reportType: completedReport.reportType,
          fileName: completedReport.originalFileName || deriveFileName(fileUrl, reportId),
          summary: auditResult.summary,
          violations: auditResult.violations,
        }).catch((error: unknown) => {
          logger.error('Failed to send audit notification email', {
            reportId,
            error,
          })
        })
      }

      logger.info('Report completed', { reportId })
    },
    {
      connection: createRedisConnection(),
      concurrency: 2,
    }
  )

  worker.on('completed', (job) => {
    logger.info('Job completed', { jobId: job.id, reportId: job.data.reportId })
  })

  worker.on('failed', async (job, error) => {
    logger.error('Job failed', { jobId: job?.id, reportId: job?.data?.reportId, error: error.message })

    if (job?.data?.reportId) {
      await prisma.report.update({
        where: { id: job.data.reportId },
        data: { status: 'FAILED' },
      }).catch((updateError: unknown) => {
        logger.error('Failed to mark report as FAILED', { updateError })
      })
    }
  })

  worker.on('error', (error) => {
    logger.error('Worker error', { error: error.message })
  })

  logger.info(`Listening on ${AUDIT_QUEUE_NAME}`)

  return worker
}

function deriveFileName(fileUrl: string, reportId: string) {
  try {
    const pathname = new URL(fileUrl).pathname
    const lastSegment = pathname.split('/').filter(Boolean).pop()
    return lastSegment || `report-${reportId}`
  } catch {
    return `report-${reportId}`
  }
}

function createRedisConnection() {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

  if (!redisUrl.startsWith('rediss://')) {
    return { url: redisUrl }
  }

  return {
    url: redisUrl,
    tls: {},
    maxRetriesPerRequest: null as null,
    enableReadyCheck: false,
  }
}
