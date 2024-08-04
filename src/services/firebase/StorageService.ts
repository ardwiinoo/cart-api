import admin from 'firebase-admin'
import serviceAccount from '@/services/firebase/creds/merce-api-firebase-adminsdk.json'
import { nanoid } from 'nanoid'
import { env } from '@/utils/env'

export class StorageService {
    private storage: admin.storage.Storage
    private bucketName: string

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            storageBucket: env.get('FIREBASE_STORAGE').toString()
        })

        this.storage = admin.storage()
        this.bucketName = this.storage.bucket().name
    }

    async uploadFile(fileBuffer: Buffer, destFolder: string, filename: string, contentType: string) {
        const bucket = this.storage.bucket(this.bucketName)
        const file = bucket.file(`${destFolder}/${nanoid(16)}-${filename}`)

        await file.save(fileBuffer, {
            resumable: false,
            metadata: {
                contentType: contentType
            }
        })

        return file.publicUrl()
    }

    async deleteFile(filePath: string) {
        const bucket = this.storage.bucket(this.bucketName)
        const file = bucket.file(filePath)

        await file.delete()
    }
}