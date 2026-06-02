import { createLogger } from '@certiflow/shared'
import { GoogleVisionOcrProvider } from './providers/GoogleVisionOcr.provider'
import type { OcrProvider } from './types'

const logger = createLogger('ai-worker:ocr')

export function createOcrProvider(): OcrProvider {
  const provider = (process.env.OCR_PROVIDER || 'google-vision').toLowerCase().replace(/[_\s]/g, '-')

  if (provider === 'google-vision') {
    logger.info('Using Google Vision OCR provider')
    return new GoogleVisionOcrProvider()
  }

  logger.warn('Unsupported OCR provider configured, falling back to Google Vision', {
    provider,
  })

  return new GoogleVisionOcrProvider()
}
