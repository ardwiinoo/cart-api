import { z } from 'zod'

export const PostUserPayloadSchema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Invalid email address'}),
    password: z.string().min(4, { message: 'Password must be at least 4 characters long' }),
    fullname: z.string().min(1, { message: 'Fullname is required' }),
    phone: z.string().min(10, 'Phone number must be at least 10 digits long')
})

export type PostUserPayload = z.infer<typeof PostUserPayloadSchema>