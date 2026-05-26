import type { Report } from '@certiflow/shared'

export function getReportSourceFileName(report: Pick<Report, 'originalFileName' | 'fileUrl' | 'reportType' | 'id'>): string {
  if (report.originalFileName?.trim()) {
    return report.originalFileName.trim()
  }

  try {
    const pathname = new URL(report.fileUrl).pathname
    const fileName = pathname.split('/').pop()
    if (fileName) {
      return decodeURIComponent(fileName)
    }
  } catch {
    // Fall through to generated fallback for malformed or legacy URLs.
  }

  const extension = inferExtension(report.fileUrl)
  return `${report.reportType.toLowerCase()}-${report.id.slice(0, 8)}${extension}`
}

function inferExtension(fileUrl: string): string {
  const lowerUrl = fileUrl.toLowerCase()

  if (lowerUrl.endsWith('.pdf')) return '.pdf'
  if (lowerUrl.endsWith('.png')) return '.png'
  if (lowerUrl.endsWith('.jpg') || lowerUrl.endsWith('.jpeg')) return '.jpg'
  if (lowerUrl.endsWith('.tif') || lowerUrl.endsWith('.tiff')) return '.tiff'
  if (lowerUrl.endsWith('.csv')) return '.csv'
  return ''
}
