import { UsersService } from "@/services/postgres"
import { UsersValidator } from "@/validator"
import { Express } from "express"
import UsersHandler from "./handler"
import routes from "./routes"

export interface UsersOptions {
    service: UsersService
    validator: typeof UsersValidator
}

export const users = {
    name: 'users',
    version: '1.0.0',
    register: (app: Express, options: UsersOptions) => {
        const usersHandler = new UsersHandler(options.service, options.validator)
        app.use('/api', routes(usersHandler))
    }
}