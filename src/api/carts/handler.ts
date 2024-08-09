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

            res.status(200).json({
                status: 'success'
            })
        } catch (err) {
            next(err)
        }
    }

    async postCartHandler(req: Request, res: Response, next: NextFunction) {
        try {

            res.status(200).json({
                status: 'success'
            })
        } catch (err) {
            next(err)
        }
    }

    async putCartHandler(req: Request, res: Response, next: NextFunction) {
        try {

            res.status(200).json({
                status: 'success'
            })
        } catch (err) {
            next(err)
        }
    }

    async deleteCartHandler(req: Request, res: Response, next: NextFunction) {
        try {

            res.status(200).json({
                status: 'success'
            })
        } catch (err) {
            next(err)
        }
    }

    async deleteCartsHandler(req: Request, res: Response, next: NextFunction) {
        try {

            res.status(200).json({
                status: 'success'
            })
        } catch (err) {
            next(err)
        }
    }
}

export default CartsHandler