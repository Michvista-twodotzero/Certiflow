import { createLogger } from '@certiflow/shared'
import { GoogleVisionOcrProvider } from './providers/GoogleVisionOcr.provider'
import type { OcrProvider } from './types'

const logger = createLogger('ai-worker:ocr')

export function createOcrProvider(): OcrProvider {
  const provider = (process.env.OCR_PROVIDER || 'google-vision').toLowerCase()

  if (provider === 'google-vision') {
    logger.info('Using Google Vision OCR provider')
    return new GoogleVisionOcrProvider()
  }

  throw new Error(`Unsupported OCR provider: ${provider}`)
}
