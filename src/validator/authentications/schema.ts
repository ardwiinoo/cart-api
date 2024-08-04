import { z } from 'zod'

export const PostAuthPayloadSchema = z.object({
    email: z.string().min(1, { message: 'Email is required' }).email({ message: 'Ivalid email address' }),
    password: z.string().min(1, { message: 'Password is required' })
})

export const PutAuthPayloadSchema = z.object({
    refreshToken: z.string().min(1, { message: 'Refresh token is required' })
})

export const DeleteAuthPayloadSchema = z.object({
    refreshToken: z.string().min(1, { message: 'Refresh token is required' })
})