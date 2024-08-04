import { InvariantError } from "@/exceptions";
import { PostProductPayloadSchema } from "./schema";
import { PostProductPayload } from "@/utils/types";

export const ProductsValidator = {
    validatePostProductSchema: (payload: PostProductPayload) => {
        const result = PostProductPayloadSchema.safeParse(payload)
        if (!result.success) {
            throw new InvariantError(result.error.errors[0]!.message)
        }
    }
}