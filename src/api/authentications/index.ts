import { AuthenticationsService, UsersService } from '@/services/postgres'
import AuthenticationsHandler from './handler'
import routes from './routes'
import { Express } from 'express'
import { TokenManager } from '@/tokenize/TokenManager'
import { AuthenticationsValidator } from '@/validator'

export const authentications = {
    name: 'authentications',
    version: '1.0.0',
    register: (app: Express, options: { 
        usersService: UsersService, 
        authenticationsService: AuthenticationsService, 
        tokenManager: typeof TokenManager, 
        validator: typeof AuthenticationsValidator 
    }) => {
        const authenticationsHandler = new AuthenticationsHandler(
            options.usersService, 
            options.authenticationsService, 
            options.tokenManager, 
            options.validator)
        app.use('/api', routes(authenticationsHandler))
    }
}