import { Router } from 'express'
import AuthenticationsHandler from './handler'

const routes = (handler: AuthenticationsHandler) => {
    const v1 = Router()

    v1.post('/authentications', handler.postAuthHandler)
    v1.put('/authentications', handler.putAuthHandler)
    v1.delete('/authentications', handler.deleteAuthHandler)

    return v1
}

export default routes