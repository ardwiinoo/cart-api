import { z } from "zod";

export const PostProductPayloadSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    price: z.number().min(1, { message: 'Price is required' }),
    stock: z.number().min(1, { message: 'Stock is required' }),    
    description: z.string().min(1 ,{ message: 'Description is required' })
})