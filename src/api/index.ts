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
import CacheService from '@/services/redis/CacheService'

interface Plugin<TOptions> {
    plugin: any
    options: TOptions
}

type PluginType = AuthenticationsOptions | ProductsOptions | UsersOptions

class PluginManager {
    private static instance: PluginManager
    private plugins: Array<Plugin<PluginType>> = []

    private constructor() {}

    public static getInstance(): PluginManager {
        if (!PluginManager.instance) {
            PluginManager.instance = new PluginManager()
        }

        return PluginManager.instance
    }

    public initializePlugins(): void {
        const authenticationsService = new AuthenticationsService()
        const storageService = new StorageService()
        const cacheService = new CacheService()
        const productsService = new ProductsService(storageService, cacheService)
        const usersService = UsersService.getInstance()

        this.plugins = [
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
    }

    public getPlugins(): Array<Plugin<PluginType>> {
        return this.plugins
    }
}

export default PluginManager