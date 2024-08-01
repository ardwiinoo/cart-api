import { InvariantError } from '@/exceptions'
import { env } from '@/utils/env'
import jwt, { JwtPayload } from 'jsonwebtoken'

export const TokenManager = {
    generateAccessToken: (payload: object): string => {
        return jwt.sign(payload, env.get('ACCESS_TOKEN_KEY').toString(), { expiresIn: '1h' })
    },
    generateRefreshToken: (payload: object): string => {
        return jwt.sign(payload, env.get('REFRESH_TOKEN_KEY').toString(), { expiresIn: '7d' })
    },
    verifyRefreshToken: (token: string): JwtPayload => {
        try {
            return jwt.verify(token, env.get('REFRESH_TOKEN_KEY').toString()) as JwtPayload
        } catch (error) {
            throw new InvariantError('Refresh token tidak valid')
        }
    },
    verifyAccessToken: (token: string): JwtPayload => {
        try {
            return jwt.verify(token, env.get('ACCESS_TOKEN_KEY').toString()) as JwtPayload
        } catch (error) {
            throw new InvariantError('Access token tidak valid')
        }
    },
}