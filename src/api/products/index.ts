import { StorageService } from "@/services/firebase/StorageService";
import { ProductsService } from "@/services/postgres";
import { ProductsValidator } from "@/validator/products";
import { Express } from "express";
import ProductsHandler from "./handler";
import routes from "./routes";

export interface ProductsOptions {
    service: ProductsService
    storage: StorageService
    validator: typeof ProductsValidator
}

export const products = {
    name: 'products',
    version: '1.0.0',
    register: (app: Express, options: ProductsOptions) => {
        const productsHandler = new ProductsHandler(options.service, options.storage, options.validator)
        app.use('/api', routes(productsHandler))
    }
}