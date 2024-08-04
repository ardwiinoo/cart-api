/* eslint-disable @typescript-eslint/no-namespace */
import { AuthenticationError } from "@/exceptions";
import { UsersService } from "@/services/postgres";
import { TokenManager as tokenManager } from "@/tokenize/TokenManager";
import { User } from "@/utils/types";
import { NextFunction, Request, Response } from "express";

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader) throw new Error()

        const token = authHeader.replace('Bearer', '')
        const { id } = tokenManager.verifyAccessToken(token)

        const usersService = UsersService.getInstance()
        const user = await usersService.getUserById(id)
        req.user = user

        next()
    } catch (err) {
        next(new AuthenticationError('Unauthorized'))
    }
}