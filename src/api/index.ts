/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthenticationsService, ProductsService, UsersService } from '@/services/postgres'
import { authentications, AuthenticationsOptions } from './authentications'
import { TokenManager } from '@/tokenize/TokenManager'
import { AuthenticationsValidator, UsersValidator } from '@/validator'
import { users, UsersOptions } from './users'
import { ProducerService } from '@/services/rabbitmq/ProducerService'
import { StorageService } from '@/services/firebase/StorageService'
import { products, ProductsOptions } from './products'
import { ProductsValidator } from '@/validator/products'

const authenticationsService = new AuthenticationsService()
const productsService = new ProductsService()
const storageService = new StorageService()
const usersService = new UsersService()

interface Plugin<TOptions> {
    plugin: any
    options: TOptions
}

const plugins: Array<Plugin<AuthenticationsOptions | ProductsOptions | UsersOptions>> = [
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
        plugin: products,
        options: {
            service: productsService,
            storage: storageService,
            validator: ProductsValidator
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