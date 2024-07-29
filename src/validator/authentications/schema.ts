import { z } from 'zod'

export const PostAuthPayloadSchema = z.object({
    email: z.string().min(1).email(),
    password: z.string().min(1)
})

export const PutAuthPayloadSchema = z.object({
    refreshToken: z.string().min(1)
})

export const DeleteAuthPayloadSchema = z.object({
    refreshToken: z.string().min(1)
})

export type PostAuthPayload = z.infer<typeof PostAuthPayloadSchema>
export type PutAuthPayload = z.infer<typeof PutAuthPayloadSchema>
export type DeleteAuthPayload = z.infer<typeof DeleteAuthPayloadSchema>