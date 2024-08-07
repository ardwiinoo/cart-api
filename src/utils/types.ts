import { DeleteAuthPayloadSchema, PostAuthPayloadSchema, PutAuthPayloadSchema } from "@/validator/authentications/schema"
import { PostProductPayloadSchema } from "@/validator/products/schema"
import { PostUserPayloadSchema } from "@/validator/users/schema"
import { z } from "zod"

export enum Roles {
    ADMIN = 1,
    CUSTOMER = 2
}

export interface User {
    id: string
    email: string
    avatar_url: string
    phone: string
    role_id: number
    is_verified: boolean
} 

export type PostAuthPayload = z.infer<typeof PostAuthPayloadSchema>
export type PutAuthPayload = z.infer<typeof PutAuthPayloadSchema>
export type DeleteAuthPayload = z.infer<typeof DeleteAuthPayloadSchema>
export type PostProductPayload = z.infer<typeof PostProductPayloadSchema>
export type PostUserPayload = z.infer<typeof PostUserPayloadSchema>

export interface PostProduct extends PostProductPayload {
    imgUrl: string
}

export interface PutProduct extends PostProductPayload {
    imgUrl?: string
}