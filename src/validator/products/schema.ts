import { z } from "zod";

export const PostProductPayloadSchema = z.object({
    name: z.string().min(1),
    price: z.number().min(1),
    stock: z.number().min(1),    
    description: z.string().min(1)
})

export type PostProductPayload = z.infer<typeof PostProductPayloadSchema>