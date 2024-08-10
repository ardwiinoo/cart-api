import { InvariantError, NotFoundError } from '@/exceptions'
import { AddItemToCart, PostProduct, PutProduct } from '@/utils/types'
import { nanoid } from 'nanoid'
import { Pool } from 'pg'
import { StorageService } from '../firebase/StorageService'
import CacheService from '../redis/CacheService'
import EventService from '../event/EventService'

export class ProductsService {

    private pool: Pool
    private storage: StorageService
    private cache: CacheService
    private event: EventService

    constructor(storageService: StorageService, cacheService: CacheService, eventService: EventService) {
        this.pool = new Pool()
        this.storage = storageService
        this.cache = cacheService
        this.event = eventService

        this.observeCartEvents()
    }

    async addProduct(payload: PostProduct) {
        const id = `product-${nanoid(16)}`

        const query = {
            text: 'INSERT INTO products (id, name, price, stock, img_url, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
            values: [id, payload.name, payload.price, payload.stock, payload.imgUrl, payload.description]
        }

        const { rows, rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new InvariantError('Failed to add product')
        }

        await Promise.all([
            this.cache.delete('products:all'),
            this.cache.deleteAllByKeyPattern('products:page:*')
        ])

        return rows[0].id
    }

    async updateProduct(id: string, payload: PutProduct) {
        const { data } = await this.getProductById(id)

        if (payload.imgUrl && data.img_url) {
            await this.storage.deleteFile(data.img_url)
        }

        const query = {
            text: 'UPDATE products SET name = $1, price = $2, stock = $3, img_url = $4, description = $5 WHERE id = $6',
            values: [payload.name, payload.price, payload.stock, payload.imgUrl, payload.description, id]
        }

        const { rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new InvariantError('Failed to update product')
        }

        await Promise.all([
            this.cache.delete(`products:${id}`),
            this.cache.delete('products:all'),
            this.cache.deleteAllByKeyPattern('products:page:*')
        ])
    }

    async getProductById(id: string) {
        const cacheKey = `products:${id}`

        return this.cache.get(cacheKey).then(cachedData => {
            return {
                data: JSON.parse(cachedData),
                cached: true
            }
        }).catch(async () => {
            const query = {
                text: 'SELECT * FROM products WHERE id = $1',
                values: [id]
            }

            const { rows, rowCount } = await this.pool.query(query)

            if (!rowCount) {
                throw new NotFoundError('Product not found')
            }

            await this.cache.set(cacheKey, rows[0])

            return {
                data: rows[0],
                cached: false
            }
        })
    }

    async deleteProduct(id: string) {
        const { data } = await this.getProductById(id)

        if (data.img_url) {
            await this.storage.deleteFile(data.img_url)
        }

        const query = {
            text: 'DELETE FROM products WHERE id = $1',
            values: [id]
        }

        const { rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new InvariantError('Failed to delete product')
        }

        await Promise.all([
            this.cache.delete(`products:${id}`),
            this.cache.delete('products:all'),
            this.cache.deleteAllByKeyPattern('products:page:*')
        ])
    }

    async getProducts() {
        const cacheKey = `products:all`

        return this.cache.get(cacheKey).then(cachedData => {
            return {
                data: JSON.parse(cachedData),
                cached: true
            }
        }).catch(async () => {
            const query = {
                text: 'SELECT * FROM products',
                values: []
            }

            const { rows } = await this.pool.query(query)
            await this.cache.set(cacheKey, rows)

            return {
                data: rows,
                cached: false
            }
        })
    }

    async getProductsWithPaging(page: number, limit: number) {
        const offset = (page - 1) * limit
        const cacheKey = `products:page:${page}:limit:${limit}`

        return this.cache.get(cacheKey).then(cachedData => {
            return {
                data: JSON.parse(cachedData),
                cached: true
            }
        }).catch( async () => {
            const query = {
                text: 'SELECT * FROM products LIMIT $1 OFFSET $2',
                values: [limit, offset]
            }

            const { rows } = await this.pool.query(query)
            await this.cache.set(cacheKey, rows)

            return {
                data: rows,
                cached: false
            }
        })
    }

    private observeCartEvents() {
        this.event.on<AddItemToCart>('cartItemAdded', this.addProductToCart.bind(this))
    }

    private async addProductToCart(payload: AddItemToCart) {
        const { data: product } = await this.getProductById(payload.productId)
        const id = `cart_item-${nanoid(16)}`
        const totalPrice = product.price * payload.quantity

        const query = {
            text: 'INSERT INTO cart_items (id, cart_id, product_id, quantity, price) VALUES ($1, $2, $3, $4, $5)',
            values: [id, payload.cartId, payload.productId, payload.quantity, totalPrice]
        }

        const { rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new InvariantError('Failed to add product item to cart')
        }

        await this.cache.delete(`cart_items:${payload.cartId}`)
    }
}