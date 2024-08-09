import { InvariantError } from '@/exceptions';
import { PostCartPayload } from '@/utils/types';
import { PostCartPayloadSchema } from './schema';

export const CartsValidator = {
    validatePostCartSchema: (payload: PostCartPayload) => {
        const result = PostCartPayloadSchema.safeParse(payload)
        if (!result.success) {
            throw new InvariantError(result.error.errors[0]!.message)
        }
    }
}