import { InvariantError } from '@/exceptions'
import { DeleteAuthPayloadSchema, PostAuthPayloadSchema, PutAuthPayloadSchema } from './schema'
import { DeleteAuthPayload, PostAuthPayload, PutAuthPayload } from '@/utils/types'

export const AuthenticationsValidator = {
    validatePostAuthPayload: (payload: PostAuthPayload) => {
        const result = PostAuthPayloadSchema.safeParse(payload)
        if (!result.success) {
            throw new InvariantError(result.error.errors[0]!.message)
        }
    },
    validatePutAuthPayload: (payload: PutAuthPayload) => {
        const result = PutAuthPayloadSchema.safeParse(payload)
        if (!result.success) {
            throw new InvariantError(result.error.errors[0]!.message)
        }
    },
    validateDeleteAuthPayload: (payload: DeleteAuthPayload) => {
        const result = DeleteAuthPayloadSchema.safeParse(payload)
        if (!result.success) {
            throw new InvariantError(result.error.errors[0]!.message)
        }
    }
}