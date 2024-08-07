import { Router } from "express"
import ProductsHandler from "./handler"
import { auth } from "@/middlewares/auth"
import { uploadImage } from "@/middlewares/multer"

const routes = (handler: ProductsHandler) => {
    const v1 = Router()

    v1.get('/products', auth, handler.getProductsHandler)
    // v1.get('/products/:id', handler)
    v1.post('/products', auth, uploadImage, handler.postProductHandler)
    v1.put('/products/:id', auth, uploadImage, handler.putProductHandler)
    // v1.delete('/products/:id', handler)

    return v1
}

export default routes