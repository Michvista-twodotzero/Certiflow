export interface IFileUploadService {
  upload(
    file: Express.Multer.File,
    options?: { publicBaseUrl?: string },
  ): Promise<string>
  delete(fileUrl: string): Promise<void>
}
