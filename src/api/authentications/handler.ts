import { NextFunction, Request, Response } from 'express'
import autoBind from 'auto-bind'
import { AuthenticationsService, UsersService } from '@/services/postgres'
import { TokenManager } from '@/tokenize/TokenManager'
import { AuthenticationsValidator } from '@/validator'

class AuthenticationsHandler {

    constructor(
        private usersService: UsersService, 
        private authenticationsService: AuthenticationsService,
        private tokenManager: typeof TokenManager,
        private validator: typeof AuthenticationsValidator
    ) {
        autoBind(this)
    }

    async postAuthHandler(req: Request, res: Response, next: NextFunction) {
        try {
            this.validator.validatePostAuthPayload(req.body)
            const userId = await this.usersService.verifyUserCredentials(req.body)

            const { accessToken, refreshToken } = this.generateJwtToken(userId)
            await this.authenticationsService.addRefreshToken(refreshToken)

            res.status(201).json({
                status: 'success',
                data: {
                    accessToken,
                    refreshToken
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async putAuthHandler(req: Request, res: Response, next: NextFunction) {
        try {
            this.validator.validatePutAuthPayload(req.body)
            await this.authenticationsService.verifyRefreshToken(req.body)

            const { id } = await this.tokenManager.verifyRefreshToken(req.body)   
            const { accessToken } = this.generateJwtToken(id)
            
            res.status(200).json({
                status: 'success',
                data: {
                    accessToken
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async deleteAuthHandler(req: Request, res: Response, next: NextFunction) {
        try {
            this.validator.validateDeleteAuthPayload(req.body)
            await this.authenticationsService.verifyRefreshToken(req.body)
            await this.authenticationsService.deleteRefreshToken(req.body)

            res.status(200).json({
                status: 'success',
                message: 'Refresh token successfully deleted'
            })
        } catch (err) {
            next(err)
        }
    }

    private generateJwtToken(id: string) {
        return {
            accessToken: this.tokenManager.generateAccessToken({ id }),
            refreshToken: this.tokenManager.generateRefreshToken({ id })
        }
    }
}

export default AuthenticationsHandler