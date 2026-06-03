import * as fs from 'fs'
import * as path from 'path'
import { pathToFileURL } from 'url'

const REPORT_UPLOAD_ROOT = path.resolve(process.cwd(), 'tmp', 'uploads', 'reports')

export function getReportUploadRoot() {
  fs.mkdirSync(REPORT_UPLOAD_ROOT, { recursive: true })
  return REPORT_UPLOAD_ROOT
}

export function saveReportFileLocally(file: Express.Multer.File) {
  const uploadRoot = getReportUploadRoot()
  const fileName = buildSafeFileName(file.originalname, file.mimetype)
  const filePath = path.join(uploadRoot, fileName)

  fs.writeFileSync(filePath, file.buffer)

  return {
    fileName,
    filePath,
  }
}

export function buildPublicReportUrl(baseUrl: string | undefined, fileName: string) {
  if (baseUrl?.trim()) {
    return `${baseUrl.replace(/\/$/, '')}/uploads/reports/${encodeURIComponent(fileName)}`
  }

  return pathToFileURL(path.join(getReportUploadRoot(), fileName)).href
}

export function deleteLocalReportFile(fileUrl: string) {
  const filePath = resolveLocalReportPath(fileUrl)
  if (!filePath || !fs.existsSync(filePath)) {
    return
  }

  fs.unlinkSync(filePath)
}

export function resolveLocalReportPath(fileUrl: string) {
  if (fileUrl.startsWith('file://')) {
    return fileUrl.startsWith('file:///')
      ? decodeURIComponent(fileUrl.replace('file:///', '/'))
      : decodeURIComponent(fileUrl.replace('file://', ''))
  }

  const uploadsMarker = '/uploads/reports/'
  const markerIndex = fileUrl.indexOf(uploadsMarker)
  if (markerIndex === -1) {
    return null
  }

  const fileName = decodeURIComponent(fileUrl.slice(markerIndex + uploadsMarker.length))
  return path.join(getReportUploadRoot(), path.basename(fileName))
}

function buildSafeFileName(originalName: string, mimeType?: string) {
  const normalizedName = path.basename(originalName || 'report').replace(/[^a-zA-Z0-9._-]/g, '-')
  const extension = resolveExtension(originalName, mimeType)
  const baseName = normalizedName.replace(/\.[^.]+$/, '') || 'report'
  const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

  return `${baseName}-${uniqueSuffix}${extension}`
}

function resolveExtension(originalName: string, mimeType?: string) {
  const existingExt = path.extname(originalName || '').toLowerCase()
  if (existingExt) {
    return existingExt
  }

  const normalizedMime = (mimeType || '').toLowerCase()
  if (normalizedMime === 'application/pdf') return '.pdf'
  if (normalizedMime.startsWith('image/')) {
    if (normalizedMime.includes('png')) return '.png'
    if (normalizedMime.includes('jpeg') || normalizedMime.includes('jpg')) return '.jpg'
    if (normalizedMime.includes('webp')) return '.webp'
    if (normalizedMime.includes('gif')) return '.gif'
    if (normalizedMime.includes('bmp')) return '.bmp'
    if (normalizedMime.includes('tiff') || normalizedMime.includes('tif')) return '.tiff'
  }

  if (normalizedMime === 'text/plain') return '.txt'
  if (normalizedMime === 'text/csv') return '.csv'
  if (normalizedMime === 'application/json') return '.json'

  return '.bin'
}
