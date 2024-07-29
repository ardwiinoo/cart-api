import { AuthenticationError, InvariantError } from '@/exceptions'
import { comparePassword, hashPassword } from '@/utils/hash'
import { PostAuthPayload } from '@/validator/authentications/schema'
import { PostUserPayload } from '@/validator/users/schema'
import { nanoid } from 'nanoid'
import { Pool } from 'pg'

export class UsersService {

    private pool: Pool

    constructor() {
        this.pool = new Pool()
    }

    async addUser(payload: PostUserPayload) {
        this.verifyEmail(payload.email)

        const id = `user-${nanoid(16)}`
        const hashedPassword = await hashPassword(payload.password)
        const avatarUrl = `https://ui-avatars.com/api/?name=${payload.fullname}`

        const query = {
            text: 'INSERT INTO users (id, email, fullname, password, phone, avatar_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, payload.email, payload.fullname, hashedPassword, payload.phone, avatarUrl]
        }

        const { rows, rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new InvariantError('Failed to add user')
        }

        return rows[0].id
    }

    async verifyUserCredentials(payload: PostAuthPayload) {
        const query = {
            text: 'SELECT id, password FROM users WHERE email = $1',
            values: [payload.email]
        }

        const { rows, rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new AuthenticationError('Authentication failed, invalid credentials')
        }

        const user = rows[0]
        const match = comparePassword(payload.password, user.password)

        if (!match) {
            throw new AuthenticationError('Authentication failed, invalid credentials')
        }

        return user.id
    }

    private async verifyEmail(email: string) {
        const query = {
            text: 'SELECT email FROM users WHERE email = $1',
            values: [email]
        }

        const { rowCount } = await this.pool.query(query)

        if (rowCount != null && rowCount > 0) {
            throw new InvariantError('Failed to add user. Email is already in use')
        }
    }
}