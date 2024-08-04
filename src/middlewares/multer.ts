import { InvariantError } from '@/exceptions'
import { Request } from 'express'
import multer, { FileFilterCallback } from 'multer'

const storage = multer.memoryStorage() // save in buffer for steam

const createFileFilter = (allowedMimeTypes: string[]) => {
    return (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            cb(new InvariantError('Unsupported file type'))
        } else {
            cb(null, true)
        }
    }
}

const createUpload = (allowedMimeTypes: string[], maxSize: number) => {
    return multer({
        storage: storage,
        limits: {
            fileSize: maxSize,
        },
        fileFilter: createFileFilter(allowedMimeTypes),
    }).single('file')
}

export const uploadImage = createUpload(['image/jpeg', 'image/png'], 2 * 1024 * 1024) // 2MB 
export const uploadPdf = createUpload(['application/pdf'], 5 * 1024 * 1024) // 5MB