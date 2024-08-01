import { NextFunction, Request, Response } from 'express'
import { parse, Parser } from '../utils/parser'

declare global {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace Express {
        interface Request {
            getQuery: (key: string) => Parser
            getParam: (key: string) => Parser
        }
    }
}

const typeable = async (req: Request, res: Response, next: NextFunction) => {
    req.getQuery = (key: string): Parser => {
        return parse(req.query[key] as string)
    }

    req.getParam = (key: string): Parser => {
        return parse(req.params[key] as string)
    }

    next()
}

export default typeable