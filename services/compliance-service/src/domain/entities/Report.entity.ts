import { ExtractionStrategy, ReportStatus, ReportType } from '@certiflow/shared'

interface ReportProps {
  id: string
  projectId: string
  reportType: ReportType
  fileUrl: string
  originalFileName?: string
  mimeType?: string
  status: ReportStatus
  notes?: string
  summary?: string
  extractionStrategy: ExtractionStrategy
  ocrProvider?: string
  ocrConfidence?: number
  uploadedAt: Date
}

export class ReportEntity {
  private props: ReportProps

  constructor(props: ReportProps) {
    this.props = props
  }

  get id() { return this.props.id }
  get projectId() { return this.props.projectId }
  get reportType() { return this.props.reportType }
  get fileUrl() { return this.props.fileUrl }
  get originalFileName() { return this.props.originalFileName }
  get mimeType() { return this.props.mimeType }
  get status() { return this.props.status }
  get notes() { return this.props.notes }
  get summary() { return this.props.summary }
  get extractionStrategy() { return this.props.extractionStrategy }
  get ocrProvider() { return this.props.ocrProvider }
  get ocrConfidence() { return this.props.ocrConfidence }
  get uploadedAt() { return this.props.uploadedAt }

  canBeAnalyzed(): boolean {
    return this.props.status === 'PENDING'
  }

  canBeCompleted(): boolean {
    return this.props.status === 'ANALYZING'
  }

  isFailed(): boolean {
    return this.props.status === 'FAILED'
  }

  markAsAnalyzing(): ReportEntity {
    if (!this.canBeAnalyzed()) {
      throw new Error(`Report ${this.id} cannot be analyzed while ${this.status}`)
    }

    return new ReportEntity({ ...this.props, status: 'ANALYZING' })
  }

  markAsComplete(): ReportEntity {
    if (!this.canBeCompleted()) {
      throw new Error(`Report ${this.id} cannot be completed while ${this.status}`)
    }

    return new ReportEntity({ ...this.props, status: 'COMPLETE' })
  }

  markAsFailed(): ReportEntity {
    return new ReportEntity({ ...this.props, status: 'FAILED' })
  }

  recordExtraction(input: {
    summary?: string
    extractionStrategy: ExtractionStrategy
    ocrProvider?: string
    ocrConfidence?: number
  }): ReportEntity {
    return new ReportEntity({
      ...this.props,
      summary: input.summary,
      extractionStrategy: input.extractionStrategy,
      ocrProvider: input.ocrProvider,
      ocrConfidence: input.ocrConfidence,
    })
  }

  static create(props: Omit<ReportProps, 'status' | 'uploadedAt' | 'extractionStrategy' | 'ocrProvider' | 'ocrConfidence'>): ReportEntity {
    return new ReportEntity({
      ...props,
      status: 'PENDING',
      extractionStrategy: 'NONE',
      uploadedAt: new Date(),
    })
  }

  toObject(): ReportProps {
    return { ...this.props }
  }
}
