import { v2 as cloudinary } from 'cloudinary'
import { IFileUploadService } from '../../application/interfaces/file-upload.interface'
import { createLogger } from '@certiflow/shared'
import { buildPublicReportUrl, deleteLocalReportFile, saveReportFileLocally } from '../storage/report-file-storage'

const logger = createLogger('compliance-service:cloudinary')

const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
}

const cloudinaryEnabled = Boolean(cloudinaryConfig.cloud_name && cloudinaryConfig.api_key && cloudinaryConfig.api_secret)

if (cloudinaryEnabled) {
  cloudinary.config(cloudinaryConfig)
}

export class CloudinaryUploadService implements IFileUploadService {
  async upload(file: Express.Multer.File, options?: { publicBaseUrl?: string }): Promise<string> {
    if (cloudinaryEnabled) {
      try {
        logger.info('Uploading file to Cloudinary', { filename: file.originalname })
        const resourceType = resolveResourceType(file.mimetype, file.originalname)

        return await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'certiflow/reports',
              resource_type: resourceType,
              use_filename: true,
              unique_filename: true,
              access_mode: 'public',
            },
            (error, result) => {
              if (error || !result) {
                logger.warn('Cloudinary upload failed, saving locally instead', {
                  error: error instanceof Error ? error.message : error,
                })
                resolve(saveLocally(file, options?.publicBaseUrl))
                return
              }

              logger.info('File uploaded successfully', { url: result.secure_url })
              resolve(result.secure_url)
            }
          )

          uploadStream.end(file.buffer)
        })
      } catch (error) {
        logger.warn('Cloudinary upload setup failed, saving locally instead', {
          error: error instanceof Error ? error.message : error,
        })
      }
    } else {
      logger.warn('Cloudinary config missing, saving report locally', {
        hasCloudName: Boolean(cloudinaryConfig.cloud_name),
        hasApiKey: Boolean(cloudinaryConfig.api_key),
        hasApiSecret: Boolean(cloudinaryConfig.api_secret),
      })
    }

    return saveLocally(file, options?.publicBaseUrl)
  }

  async delete(fileUrl: string): Promise<void> {
    if (fileUrl.startsWith('file://') || fileUrl.includes('/uploads/reports/')) {
      deleteLocalReportFile(fileUrl)
      logger.info('Local report file deleted', { fileUrl })
      return
    }

    const resourceType = inferResourceTypeFromUrl(fileUrl)
    const publicId = fileUrl.split('/').slice(-2).join('/').split('.')[0]
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
    logger.info('File deleted from Cloudinary', { publicId, resourceType })
  }
}

function saveLocally(file: Express.Multer.File, publicBaseUrl?: string) {
  const saved = saveReportFileLocally(file)
  const url = buildPublicReportUrl(publicBaseUrl, saved.fileName)

  logger.info('File stored locally', {
    fileName: saved.fileName,
    url,
  })

  return url
}

function resolveResourceType(mimeType?: string, fileName?: string) {
  const normalizedMime = (mimeType || '').toLowerCase()
  const normalizedName = (fileName || '').toLowerCase()

  if (normalizedMime.startsWith('image/')) {
    return 'image'
  }

  if (
    normalizedMime === 'application/pdf' ||
    normalizedMime.startsWith('text/') ||
    normalizedMime === 'application/json' ||
    normalizedName.endsWith('.pdf') ||
    normalizedName.endsWith('.csv') ||
    normalizedName.endsWith('.txt') ||
    normalizedName.endsWith('.md') ||
    normalizedName.endsWith('.json')
  ) {
    return 'raw'
  }

  return 'auto'
}

function inferResourceTypeFromUrl(fileUrl: string) {
  if (fileUrl.includes('/raw/')) return 'raw'
  if (fileUrl.includes('/image/')) return 'image'
  if (fileUrl.includes('/video/')) return 'video'
  return 'auto'
}
