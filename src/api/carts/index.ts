import { Express } from 'express'
import CartsHandler from './handler'
import { CartsService } from '@/services/postgres'
import { CartsValidator } from '@/validator'
import routes from './routes'

interface CartsOptions {
    cartsService: CartsService
    cartsValidator: typeof CartsValidator
}

export const carts = {
    name: 'carts',
    version: '1.0.0',
    register: (app: Express, options: CartsOptions) => {
        const cartsHandler = new CartsHandler(options.cartsService, options.cartsValidator)
        app.use('/api', routes(cartsHandler))
    }
}