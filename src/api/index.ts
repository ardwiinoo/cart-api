import { AuthenticationsService, UsersService } from '@/services/postgres'
import { authentications } from './authentications'
import { TokenManager } from '@/tokenize/TokenManager'
import { AuthenticationsValidator } from '@/validator'

const usersService = new UsersService()
const authenticationsService = new AuthenticationsService()

const plugins = [
    {
        plugin: authentications,
        options: {
            usersService, 
            authenticationsService,
            tokenManager: TokenManager,
            validator: AuthenticationsValidator
        }
    }
]

export default plugins