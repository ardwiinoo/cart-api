import { InvariantError } from '@/exceptions'
import { Pool } from 'pg'

export class AuthenticationsService {

    private pool: Pool

    constructor() {
        this.pool = new Pool()
    }

    async addRefreshToken(refreshToken: string) {
        const query = {
            text: 'INSERT INTO authentications (token) VALUES ($1)',
            values: [refreshToken]
        }

        await this.pool.query(query)
    }

    async verifyRefreshToken(refreshToken: string) {
        const query = {
            text: 'SELECT token FROM authentications WHERE token = $1',
            values: [refreshToken]
        }

        const { rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new InvariantError('Invalid refresh token')
        }
    }

    async deleteRefreshToken(refreshToken: string) {
        const query ={
            text: 'DELETE FROM authentications WHERE token = $1',
            values: [refreshToken]
        }

        await this.pool.query(query)
    }
}