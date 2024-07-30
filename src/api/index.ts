/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationsService, UsersService } from '@/services/postgres'
import { authentications, AuthenticationsOptions } from './authentications'
import { TokenManager } from '@/tokenize/TokenManager'
import { AuthenticationsValidator, UsersValidator } from '@/validator'
import { users, UsersOptions } from './users'
import { ProducerService } from '@/services/rabbitmq/ProducerService'

const usersService = new UsersService()
const authenticationsService = new AuthenticationsService()

interface Plugin<TOptions> {
    plugin: any
    options: TOptions
}

const plugins: Array<Plugin<UsersOptions | AuthenticationsOptions>> = [
    {
        plugin: authentications,
        options: {
            usersService, 
            authenticationsService,
            tokenManager: TokenManager,
            validator: AuthenticationsValidator
        }
    },
    {
        plugin: users,
        options: {
            usersService: usersService,
            producerService: ProducerService,
            validator: UsersValidator
        }
    }
]

export default plugins