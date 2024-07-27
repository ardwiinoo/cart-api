import { Request, Response } from 'express'
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

    async postAuthHandler(req: Request, res: Response) {
        res.status(201).send({
            status: 'success',
            data: {
                userId: 1
            }
        })
    }
}

export default AuthenticationsHandler