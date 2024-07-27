import { Router } from 'express'
import AuthenticationsHandler from './handler'

const routes = (handler: AuthenticationsHandler) => {
    const v1 = Router()

    v1.post('/authentications', handler.postAuthHandler)

    return v1
}

export default routes