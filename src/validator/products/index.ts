import { InvariantError } from "@/exceptions";
import { PostProductPayload, PostProductPayloadSchema } from "./schema";

export const ProductsValidator = {
    validatePostProductSchema: (payload: PostProductPayload) => {
        const result = PostProductPayloadSchema.safeParse(payload)
        if (!result.success) {
            throw new InvariantError(result.error.errors[0]!.message)
        }
    }
}