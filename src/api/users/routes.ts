import { Router } from "express";
import UsersHandler from "./handler";

const routes = (handler: UsersHandler) => {
    const v1 = Router()

    v1.post('/users', handler.postUserHandler)

    return v1
}

export default routes