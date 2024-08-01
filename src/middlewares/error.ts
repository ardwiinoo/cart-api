/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientError } from '@/exceptions'
import { NextFunction, Request, Response } from 'express'

const errorHandler = async (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof ClientError) {
        res.status(err.statusCode).json({
            status: 'fail',
            message: err.message
        })
    } else if ('status' in err && 'message' in err) {
        res.status((err as any).status).json({
            status: 'fail',
            message: (err as any).message
        })
    } else {
        res.status(500).json({
            status: 'error',
            message: 'Maaf, terjadi kesalahan pada server'
        })
    }

    next()
}

export default errorHandler