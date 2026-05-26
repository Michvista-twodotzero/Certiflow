import * as fs from 'fs'
import * as path from 'path'
import pdfParse from 'pdf-parse'
import { createLogger } from '@certiflow/shared'
import { createOcrProvider } from './ocr'
import type { ExtractedDocument, OcrProvider, SourceKind } from './types'

const logger = createLogger('ai-worker:ingestion-pipeline')
const PDF_TEXT_MIN_LENGTH = 40

export async function extractDocumentContent(
  tempFilePath: string,
  fileUrl: string,
  fileMeta?: { originalFileName?: string; mimeType?: string },
): Promise<ExtractedDocument> {
  return extractDocumentContentWithProvider(tempFilePath, fileUrl, createOcrProvider(), fileMeta)
}

export async function extractDocumentContentWithProvider(
  tempFilePath: string,
  fileUrl: string,
  ocrProvider: OcrProvider,
  fileMeta?: { originalFileName?: string; mimeType?: string },
): Promise<ExtractedDocument> {
  const sourceKind = detectSourceKind(fileUrl, fileMeta)

  if (sourceKind === 'text') {
      return {
        content: fs.readFileSync(tempFilePath, 'utf-8').trim(),
        sourceKind,
        strategy: 'NATIVE_TEXT',
        ocrPerformed: false,
      }
  }

  if (sourceKind === 'pdf') {
    const pdfData = await pdfParse(fs.readFileSync(tempFilePath))
    const text = pdfData.text?.trim() || ''

      if (text.length >= PDF_TEXT_MIN_LENGTH) {
        return {
          content: text,
          sourceKind,
          strategy: 'NATIVE_TEXT',
          ocrPerformed: false,
        }
    }

    logger.warn('PDF text extraction was sparse, attempting OCR fallback', { fileUrl, textLength: text.length })
    return performOcr(tempFilePath, fileUrl, sourceKind, ocrProvider, fileMeta)
  }

  if (sourceKind === 'image') {
    logger.info('Image input detected, attempting OCR', { fileUrl })
    return performOcr(tempFilePath, fileUrl, sourceKind, ocrProvider, fileMeta)
  }

  logger.warn('No extraction strategy configured for file type', { fileUrl })
  return {
    content: '',
    sourceKind,
    strategy: 'NONE',
    ocrPerformed: false,
  }
}

async function performOcr(
  tempFilePath: string,
  fileUrl: string,
  sourceKind: SourceKind,
  ocrProvider: OcrProvider,
  fileMeta?: { originalFileName?: string; mimeType?: string },
): Promise<ExtractedDocument> {
  let result

  try {
    result = await ocrProvider.extractText({
      tempFilePath,
      fileUrl,
      sourceKind,
      originalFileName: fileMeta?.originalFileName,
      mimeType: fileMeta?.mimeType,
    })
  } catch (error) {
    logger.warn('OCR failed, falling back to direct Gemini file analysis', {
      fileUrl,
      provider: ocrProvider.name,
      error,
    })

    return {
      content: '',
      sourceKind,
      strategy: 'NONE',
      ocrPerformed: false,
    }
  }

  if (!result?.text?.trim()) {
    logger.warn('OCR did not return text', { fileUrl, provider: ocrProvider.name })
    return {
      content: '',
      sourceKind,
      strategy: 'NONE',
      ocrPerformed: true,
    }
  }

  return {
    content: result.text.trim(),
    sourceKind,
    strategy: 'OCR',
    ocrPerformed: true,
    ocrProvider: result.provider,
    ocrConfidence: result.confidence,
  }
}

function detectSourceKind(fileUrl: string, fileMeta?: { originalFileName?: string; mimeType?: string }): SourceKind {
  const mimeType = fileMeta?.mimeType?.toLowerCase()
  if (mimeType?.startsWith('image/')) return 'image'
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType?.startsWith('text/') || mimeType === 'application/json') return 'text'

  const extension = path.extname(fileMeta?.originalFileName || fileUrl).toLowerCase()

  if (extension === '.pdf') return 'pdf'
  if (['.txt', '.csv', '.md', '.json'].includes(extension)) return 'text'
  if (['.png', '.jpg', '.jpeg', '.webp', '.tif', '.tiff', '.bmp', '.gif'].includes(extension)) return 'image'
  return 'unknown'
}
