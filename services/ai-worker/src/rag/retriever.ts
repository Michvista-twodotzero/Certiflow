import * as fs from 'fs'
import * as path from 'path'
import { GoogleGenAI, createPartFromUri, createUserContent } from '@google/genai'
import pdfParse from 'pdf-parse'
import { createLogger } from '@certiflow/shared'

const logger = createLogger('ai-worker:gemini-files')
const OSHA_FILE_SEARCH_DISPLAY_NAME = process.env.GEMINI_FILE_SEARCH_DISPLAY_NAME || 'certiflow-osha-reference'
const FILE_POLL_INTERVAL_MS = 2000
const FILE_POLL_TIMEOUT_MS = 60_000
const RETRY_DELAYS_MS = [1000, 3000, 6000]

interface HostedFile {
  name: string
  uri: string
  mimeType?: string
  state?: string | { name?: string } | null
}

interface FileSearchStore {
  name: string
  displayName?: string
}

let cachedOshaStore: FileSearchStore | null = null

export function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set')
  }

  return new GoogleGenAI({ apiKey })
}

export async function ensureOshaFileSearchStore(ai: GoogleGenAI): Promise<FileSearchStore> {
  const configuredStore = process.env.GEMINI_FILE_SEARCH_STORE_NAME?.trim()

  if (configuredStore) {
    const store = await ai.fileSearchStores.get({ name: configuredStore })
    cachedOshaStore = { name: store.name!, displayName: store.displayName }
    return cachedOshaStore
  }

  if (cachedOshaStore?.name) {
    return cachedOshaStore
  }

  const oshaPdfPath = resolveOshaPdfPath()
  if (!oshaPdfPath) {
    throw new Error('OSHA reference PDF not found at services/ai-worker/src/rag/documents/osha-1926.pdf')
  }

  const store = await retryGeminiCall(() => ai.fileSearchStores.create({
    config: {
      displayName: OSHA_FILE_SEARCH_DISPLAY_NAME,
      embeddingModel: 'models/gemini-embedding-001',
    },
  }))

  if (!store.name) {
    throw new Error('Gemini did not return a file search store name for OSHA indexing')
  }

  const storeName = store.name
  const oshaSource = await materializeOshaSourceFile(oshaPdfPath)

  const operation = await retryGeminiCall(() => ai.fileSearchStores.uploadToFileSearchStore({
    fileSearchStoreName: storeName,
    file: oshaSource.filePath,
    config: {
      mimeType: oshaSource.mimeType,
      displayName: oshaSource.displayName,
    },
  }))

  await waitForOperation(ai, operation)

  cachedOshaStore = {
    name: store.name,
    displayName: store.displayName,
  }
  logger.info('Created OSHA Gemini File Search store', { name: cachedOshaStore.name })
  return cachedOshaStore
}

export async function uploadReportFile(ai: GoogleGenAI, tempFilePath: string, fileUrl: string): Promise<HostedFile> {
  const mimeType = inferMimeType(tempFilePath, fileUrl)
  const uploaded = await retryGeminiCall(() => ai.files.upload({
    file: tempFilePath,
    config: {
      mimeType,
      displayName: `Site report ${path.basename(tempFilePath)}`,
    },
  }))

  return waitForFileActive(ai, normalizeHostedFile(uploaded))
}

export function createAuditContents(reportFiles: HostedFile[], prompt: string) {
  return createUserContent([
    ...reportFiles.map((reportFile) =>
      createPartFromUri(reportFile.uri, reportFile.mimeType || 'application/octet-stream'),
    ),
    prompt,
  ])
}

export async function deleteHostedFile(ai: GoogleGenAI, hostedFile: HostedFile | null) {
  if (!hostedFile?.name) {
    return
  }

  try {
    await ai.files.delete({ name: hostedFile.name })
  } catch (error) {
    logger.warn('Failed to delete Gemini hosted file', { name: hostedFile.name, error })
  }
}

function resolveOshaPdfPath() {
  const candidates = [
    path.join(__dirname, 'documents', 'osha-1926.pdf'),
    path.join(__dirname, '..', '..', 'src', 'rag', 'documents', 'osha-1926.pdf'),
    path.join(process.cwd(), 'services', 'ai-worker', 'src', 'rag', 'documents', 'osha-1926.pdf'),
    path.join(process.cwd(), 'src', 'rag', 'documents', 'osha-1926.pdf'),
  ]

  return candidates.find((candidate) => fs.existsSync(candidate)) || null
}

async function waitForFileActive(ai: GoogleGenAI, file: HostedFile): Promise<HostedFile> {
  const startedAt = Date.now()
  let current = file

  while (true) {
    const state = readFileState(current)

    if (!state || state === 'ACTIVE') {
      return current
    }

    if (state === 'FAILED') {
      throw new Error(`Gemini file processing failed for ${current.name}`)
    }

    if (Date.now() - startedAt > FILE_POLL_TIMEOUT_MS) {
      throw new Error(`Timed out waiting for Gemini file to become ACTIVE: ${current.name}`)
    }

    await sleep(FILE_POLL_INTERVAL_MS)
    current = normalizeHostedFile(await ai.files.get({ name: current.name }))
  }
}

async function waitForOperation(ai: GoogleGenAI, operation: any) {
  if (!operation.name) {
    throw new Error('Gemini File Search upload did not return an operation name')
  }

  let current = operation
  const startedAt = Date.now()

  while (!current.done) {
    if (Date.now() - startedAt > FILE_POLL_TIMEOUT_MS) {
      throw new Error(`Timed out waiting for Gemini File Search operation: ${operation.name}`)
    }

    await sleep(FILE_POLL_INTERVAL_MS)
    current = await ai.operations.get({ operation: current })
  }

  if (current.error) {
    throw new Error(`Gemini File Search operation failed: ${JSON.stringify(current.error)}`)
  }
}

function readFileState(file: HostedFile) {
  if (!file.state) {
    return null
  }

  if (typeof file.state === 'string') {
    return file.state
  }

  return file.state.name || null
}

function normalizeHostedFile(file: {
  name?: string
  uri?: string
  mimeType?: string
  state?: string | { name?: string } | null
}): HostedFile {
  if (!file.name || !file.uri) {
    throw new Error('Gemini file response did not include a file name and uri')
  }

  return {
    name: file.name,
    uri: file.uri,
    mimeType: file.mimeType,
    state: file.state ?? null,
  }
}

function inferMimeType(tempFilePath: string, fileUrl: string) {
  const extension = path.extname(fileUrl || tempFilePath).toLowerCase()

  if (extension === '.pdf') return 'application/pdf'
  if (extension === '.txt') return 'text/plain'
  if (extension === '.md') return 'text/markdown'
  if (extension === '.csv') return 'text/csv'
  if (extension === '.json') return 'application/json'
  if (extension === '.png') return 'image/png'
  if (extension === '.jpg' || extension === '.jpeg') return 'image/jpeg'
  if (extension === '.webp') return 'image/webp'
  if (extension === '.gif') return 'image/gif'
  if (extension === '.bmp') return 'image/bmp'
  if (extension === '.tif' || extension === '.tiff') return 'image/tiff'
  return 'application/octet-stream'
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function materializeOshaSourceFile(oshaPdfPath: string) {
  const tempDir = path.join(process.cwd(), 'tmp')
  fs.mkdirSync(tempDir, { recursive: true })

  try {
    const pdfData = await pdfParse(fs.readFileSync(oshaPdfPath))
    const extractedText = pdfData.text?.trim()
    if (extractedText) {
      const textPath = path.join(tempDir, 'osha-1926-index.txt')
      fs.writeFileSync(textPath, extractedText, 'utf-8')
      return {
        filePath: textPath,
        mimeType: 'text/plain',
        displayName: 'OSHA 29 CFR 1926 Extracted Text',
      }
    }
  } catch (error) {
    logger.warn('Failed to extract OSHA text for File Search, falling back to PDF upload', { error })
  }

  return {
    filePath: oshaPdfPath,
    mimeType: 'application/pdf',
    displayName: 'OSHA 29 CFR 1926',
  }
}

async function retryGeminiCall<T>(operation: () => Promise<T>) {
  let lastError: unknown

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      if (!isRetryableGeminiError(error) || attempt === RETRY_DELAYS_MS.length) {
        throw error
      }

      await sleep(RETRY_DELAYS_MS[attempt])
    }
  }

  throw lastError
}

function isRetryableGeminiError(error: unknown) {
  const status = typeof error === 'object' && error && 'status' in error ? (error as { status?: number }).status : undefined
  return status === 429 || status === 500 || status === 503
}
