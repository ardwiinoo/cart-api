import { z } from 'zod'

export const PostCartPayloadSchema = z.object({
    productId: z.string().min(1, { message: 'ProductId is required' }),
    quantity: z.number().min(1, { message: 'Quantity is required' })
})