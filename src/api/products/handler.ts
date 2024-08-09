import { AuthorizationError, InvariantError } from "@/exceptions";
import { StorageService } from "@/services/firebase/StorageService";
import { ProductsService } from "@/services/postgres";
import { Roles, User } from "@/utils/types";
import { ProductsValidator } from "@/validator/products";
import autoBind from "auto-bind";
import { NextFunction, Request, Response } from "express";

class ProductsHandler {

    constructor(
        private service: ProductsService,
        private storage: StorageService,
        private validator: typeof ProductsValidator
    ) {
        autoBind(this)
    }

    async postProductHandler(req: Request, res: Response, next: NextFunction) {
        try {
            this.verifyUserRole(req.user)
            this.validator.validatePostProductSchema(req.body)

            if (!req.file) {
                throw new InvariantError('File is required')
            }

            const imgUrl = await this.storage.uploadFile(req.file.buffer, '/images', req.file.originalname, req.file.mimetype)
            const productId = await this.service.addProduct({ ...req.body, imgUrl })
            
            res.status(201).json({
                status: 'success',
                data: {
                    productId
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async putProductHandler(req: Request, res: Response, next: NextFunction) {
        try {
            this.verifyUserRole(req.user)
            this.validator.validatePostProductSchema(req.body)

            const id = req.getParam('id').toString()
            const imgUrl = req.file ? await this.storage.uploadFile(req.file.buffer, '/images', req.file.originalname, req.file.mimetype) : undefined

            await this.service.updateProduct(id, { ...req.body, imgUrl })

            res.status(200).json({
                status: 'success',
                message: 'Product updated'
            })
        } catch (err) {
            next(err)
        }
    }

    async getProductByIdHandler(req: Request, res: Response, next: NextFunction) {
        try {
            this.verifyUserRole(req.user)
            const id = req.getParam('id').toString()

            const result = await this.service.getProductById(id)

            if (result.cached) res.setHeader('X-Data-Source', 'cache')
            
            res.status(200).json({
                status: 'success',
                data: result.data
            })
        } catch (err) {
            next(err)
        }
    }

    async getProductsHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const page = req.getQuery('page').toNumber(0)
            const limit = req.getQuery('limit').toNumber(0)
            
            const result = (page > 0 && limit > 0) ? await this.service.getProductsWithPaging(page, limit) : await this.service.getProducts()

            if (result.cached) res.setHeader('X-Data-Source', 'cache')

            res.status(200).json({
                status: 'success',
                data: result.data
            })
        } catch (err) {
            next(err)
        }
    }

    async deleteProductHandler(req: Request, res: Response, next: NextFunction) {
        try {
            this.verifyUserRole(req.user)
            const id = req.getParam('id').toString()

            await this.service.deleteProduct(id)

            res.status(200).json({
                status: 'success',
                message: 'Product deleted'
            })
        } catch (err) {
            next(err)
        }
    }

    private verifyUserRole(user?: User) {
        if (!user || user.role_id !== Roles.ADMIN) {
            throw new AuthorizationError('Unauthorized')
        }
    }
} 

export default ProductsHandler