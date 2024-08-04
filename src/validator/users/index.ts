import { InvariantError } from "@/exceptions";
import { PostUserPayloadSchema } from "./schema";
import { PostUserPayload } from "@/utils/types";

export const UsersValidator = { 
    validatePostUserPayload: (payload: PostUserPayload) => {
        const result = PostUserPayloadSchema.safeParse(payload)
        if (!result.success) {
            throw new InvariantError(result.error.errors[0]!.message)
        }
    }
 } 