import { Router } from "express"
import ProductsHandler from "./handler"
import { auth } from "@/middlewares/auth"
import { uploadImage } from "@/middlewares/multer"

const routes = (handler: ProductsHandler) => {
    const v1 = Router()

    // v1.get('/products', handler)
    // v1.get('/products/:id', handler)
    v1.post('/products', ...uploadImage, auth, handler.postProductHandler)
    // v1.put('/products/:id', handler)
    // v1.delete('/products/:id', handler)

    return v1
}

export default routes