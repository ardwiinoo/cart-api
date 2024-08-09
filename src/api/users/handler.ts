import { UsersService } from "@/services/postgres";
import { ProducerService } from "@/services/rabbitmq/ProducerService";
import { UsersValidator } from "@/validator";
import autoBind from "auto-bind";
import { NextFunction, Request, Response } from "express";

class UsersHandler {

    constructor(
        private usersService: UsersService,
        private producerService: typeof ProducerService,
        private validator: typeof UsersValidator
    ) {
        autoBind(this)
    }

    async postUserHandler(req: Request, res: Response, next: NextFunction) {
        try {
            this.validator.validatePostUserPayload(req.body)
            const userId = await this.usersService.addUser(req.body)

            //  await this.producerService.sendMessage()

            res.status(201).json({
                status: 'success',
                data: { userId }
            })
        } catch (err) {
            next(err)
        }
    }
}

export default UsersHandler