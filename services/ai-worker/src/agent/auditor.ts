import * as fs from 'fs'
import * as http from 'http'
import * as https from 'https'
import type { IncomingMessage } from 'http'
import * as path from 'path'
import { Type } from '@google/genai'
import { AuditResult, createLogger } from '@certiflow/shared'
import { OSHA_FALLBACK_REFERENCE, createAuditContents, createGeminiClient, deleteHostedFile, ensureOshaFileSearchStore, uploadReportFile } from '../rag/retriever'
import { extractDocumentContent } from '../ingestion/pipeline'

const logger = createLogger('ai-worker:auditor')
const AUDIT_RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    violations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          severity: {
            type: Type.STRING,
            format: 'enum',
            enum: ['CRITICAL', 'MAJOR', 'MINOR'],
          },
          ruleReference: {
            type: Type.STRING,
          },
          description: {
            type: Type.STRING,
          },
          suggestion: {
            type: Type.STRING,
          },
          sector: {
            type: Type.STRING,
          },
        },
        required: ['severity', 'ruleReference', 'description', 'suggestion'],
        propertyOrdering: ['severity', 'ruleReference', 'description', 'suggestion', 'sector'],
      },
    },
    summary: {
      type: Type.STRING,
    },
    actionableCount: {
      type: Type.INTEGER,
    },
  },
  required: ['violations', 'summary', 'actionableCount'],
  propertyOrdering: ['violations', 'summary', 'actionableCount'],
} as const

const SYSTEM_PROMPT = `
You are a senior construction safety auditor.
Review the site report against the OSHA material provided to you.

Return only valid JSON in this shape:
{
  "violations": [
    {
      "severity": "CRITICAL" | "MAJOR" | "MINOR",
      "ruleReference": "OSHA §1926.XXX",
      "description": "What the violation is",
      "suggestion": "Specific corrective action to take",
      "sector": "Area of site where found (if mentioned)"
    }
  ],
  "summary": "Brief 2-3 sentence overall assessment",
  "actionableCount": 3
}

If no violations are found, return an empty array and a compliant summary.
`.trim()

export async function auditReport(
  fileUrl: string,
  projectName: string,
  fileMeta?: { originalFileName?: string; mimeType?: string },
): Promise<AuditResult> {
  const ai = createGeminiClient()

  logger.info('Starting AI audit', { projectName, fileUrl })

  let tempFilePath: string | null = null
  let hostedReportFiles: Array<Awaited<ReturnType<typeof uploadReportFile>>> = []
  let transcriptPath: string | null = null

  try {
    tempFilePath = await downloadFile(fileUrl)
    const extractedDocument = await extractDocumentContent(tempFilePath, fileUrl, fileMeta)
    let oshaStoreName: string | null = null

    try {
      const oshaStore = await ensureOshaFileSearchStore(ai)
      oshaStoreName = oshaStore.name
    } catch (error) {
      logger.warn('OSHA file search store unavailable, using embedded reference notes', {
        error,
      })
    }

    hostedReportFiles.push(await uploadReportFile(ai, tempFilePath, fileUrl, fileMeta))

    if (extractedDocument.content.trim()) {
      transcriptPath = await writeTranscriptFile(tempFilePath, extractedDocument.content)
      hostedReportFiles.push(await uploadReportFile(ai, transcriptPath, `${fileUrl}.txt`))
    }

    logger.info('Gemini file inputs ready for audit', {
      reportFileCount: hostedReportFiles.length,
      oshaStoreName,
      extractionStrategy: extractedDocument.strategy,
      sourceKind: extractedDocument.sourceKind,
      ocrPerformed: extractedDocument.ocrPerformed,
      ocrProvider: extractedDocument.ocrProvider,
      ocrConfidence: extractedDocument.ocrConfidence,
    })

    const prompt = [
      SYSTEM_PROMPT,
      `Project: ${projectName}`,
      'Use the uploaded site report file as the primary evidence.',
      'If a plain-text transcript is attached, treat it as OCR or extracted support for the uploaded report.',
      ...(oshaStoreName
        ? ['Use the File Search tool over OSHA 29 CFR 1926 as the compliance source of truth.']
        : [
            'Use these OSHA reference notes as the compliance source of truth:',
            OSHA_FALLBACK_REFERENCE,
          ]),
      'Return only the JSON response.',
    ].join('\n\n')

    const result = await retryGenerateContent(() => ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      contents: createAuditContents(hostedReportFiles, prompt),
      config: oshaStoreName
        ? {
            responseMimeType: 'application/json',
            responseSchema: AUDIT_RESPONSE_SCHEMA,
            tools: [
              {
                fileSearch: {
                  fileSearchStoreNames: [oshaStoreName],
                  topK: 8,
                },
              },
            ],
          }
        : {
            responseMimeType: 'application/json',
            responseSchema: AUDIT_RESPONSE_SCHEMA,
          },
    }))
    const rawResponse = readGeneratedText(result)

    logger.info('Gemini analysis complete, parsing response')
    return parseGeminiResponse(rawResponse, extractedDocument)
  } catch (error) {
    logger.error('Audit failed', { error })
    throw error
  } finally {
    for (const hostedReportFile of hostedReportFiles) {
      await deleteHostedFile(ai, hostedReportFile)
    }

    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath)
    }

    if (transcriptPath && fs.existsSync(transcriptPath)) {
      fs.unlinkSync(transcriptPath)
    }
  }
}

function parseGeminiResponse(raw: string, extractedDocument: Awaited<ReturnType<typeof extractDocumentContent>>): AuditResult {
  try {
    const cleaned = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return {
      violations: parsed.violations || [],
      summary: parsed.summary || 'Analysis complete.',
      actionableCount: parsed.actionableCount || parsed.violations?.length || 0,
      extraction: {
        strategy: extractedDocument.strategy === 'NONE' ? 'GEMINI_FILE' : extractedDocument.strategy,
        sourceKind: extractedDocument.sourceKind,
        ocrPerformed: extractedDocument.ocrPerformed,
        ocrProvider: extractedDocument.ocrProvider,
        ocrConfidence: extractedDocument.ocrConfidence,
      },
    }
  } catch (error) {
    logger.error('Failed to parse Gemini response', { raw, error })
    return {
      violations: [],
      summary: 'AI analysis could not be parsed. Manual review required.',
      actionableCount: 0,
      extraction: {
        strategy: extractedDocument.strategy === 'NONE' ? 'GEMINI_FILE' : extractedDocument.strategy,
        sourceKind: extractedDocument.sourceKind,
        ocrPerformed: extractedDocument.ocrPerformed,
        ocrProvider: extractedDocument.ocrProvider,
        ocrConfidence: extractedDocument.ocrConfidence,
      },
    }
  }
}

function readGeneratedText(result: unknown) {
  if (typeof result === 'object' && result && 'text' in result) {
    const text = (result as { text?: string | null }).text
    return text ?? ''
  }

  return ''
}

async function writeTranscriptFile(sourcePath: string, content: string) {
  const transcriptPath = `${sourcePath}.extracted.txt`
  fs.writeFileSync(transcriptPath, content, 'utf-8')
  return transcriptPath
}

async function retryGenerateContent<T>(operation: () => Promise<T>) {
  const delays = [1000, 3000, 6000]
  let lastError: unknown

  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      const status = typeof error === 'object' && error && 'status' in error ? (error as { status?: number }).status : undefined
      if (![429, 500, 503].includes(status || 0) || attempt === delays.length) {
        throw error
      }

      await new Promise((resolve) => setTimeout(resolve, delays[attempt]))
    }
  }

  throw lastError
}

function downloadFile(url: string): Promise<string> {
  const tempDir = path.join(__dirname, '..', '..', 'tmp')
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  const extension = path.extname(new URL(url).pathname) || '.bin'
  const tempPath = path.join(tempDir, `report-${Date.now()}${extension}`)
  const requestClient = url.startsWith('https://') ? https : http

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(tempPath)

    const request = requestClient.get(url, (response: IncomingMessage) => {
      if (response.statusCode && response.statusCode >= 400) {
        file.close()
        fs.unlink(tempPath, () => {})
        reject(new Error(`Failed to download report: ${response.statusCode}`))
        return
      }

      response.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve(tempPath)
      })
    })

    request.on('error', (error: Error) => {
      file.close()
      fs.unlink(tempPath, () => {})
      reject(error)
    })
  })
}
