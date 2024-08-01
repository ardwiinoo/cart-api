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