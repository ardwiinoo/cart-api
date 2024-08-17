import { CartsService } from "@/services/postgres"
import { CartsValidator } from "@/validator"
import autoBind from "auto-bind"
import { NextFunction, Request, Response } from "express"

class CartsHandler {

    constructor(
        private service: CartsService,
        private validator: typeof CartsValidator
    ) {
        autoBind(this)
    }

    async getCartsHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await this.service.getCarts(req.user!.id)

            res.status(200).json({
                status: 'success',
                data: result
            })
        } catch (err) {
            next(err)
        }
    }

    async postCartHandler(req: Request, res: Response, next: NextFunction) {
        try {
            this.validator.validatePostCartSchema(req.body)
            const cartId = await this.service.addItemToCart({ ...req.body, userId: req.user?.id })

            res.status(200).json({
                status: 'success',
                data: {
                    cartId
                }
            })
        } catch (err) {
            next(err)
        }
    }

    async deleteCartHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const itemId = req.getParam('itemId').toString()
            const userId = req.user!.id

            await this.service.deleteCartItem({ userId, itemId })

            res.status(200).json({
                status: 'success',
                message: 'Cart item deleted'
            })
        } catch (err) {
            next(err)
        }
    }

    async deleteCartsHandler(req: Request, res: Response, next: NextFunction) {
        try {
            await this.service.deleteCarts(req.user!.id)

            res.status(200).json({
                status: 'success',
                message: 'Cart deleted'
            })
        } catch (err) {
            next(err)
        }
    }

    async postCheckoutHandler(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user!.id
            const orderId = await this.service.checkout(userId)

            res.status(200).json({
                status: 'success',
                data: {
                    orderId
                }
            })
        } catch (err) {
            next(err)
        }
    }
}

export default CartsHandler