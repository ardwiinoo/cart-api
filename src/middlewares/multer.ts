import { InvariantError } from '@/exceptions'
import { Request ,Response, NextFunction } from 'express'
import multer, { FileFilterCallback} from 'multer'

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

const checkFilePresence = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return next(new InvariantError('File is required'))
    }

    next()
}

const createUpload = (allowedMimeTypes: string[], maxSize: number) => {
    const multerMiddleware = multer({
        storage: storage,
        limits: {
            fileSize: maxSize,
        },
        fileFilter: createFileFilter(allowedMimeTypes),
    }).single('file')

    return [multerMiddleware, checkFilePresence]
}

export const uploadImage = createUpload(['image/jpeg', 'image/png'], 2 * 1024 * 1024) // 2MB 
export const uploadPdf = createUpload(['application/pdf'], 5 * 1024 * 1024) // 5MB