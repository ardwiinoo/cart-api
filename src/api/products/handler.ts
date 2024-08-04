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

    private verifyUserRole(user?: User) {
        if (!user || user.role_id !== Roles.ADMIN) {
            throw new AuthorizationError('Unauthorized')
        }
    }
} 

export default ProductsHandler