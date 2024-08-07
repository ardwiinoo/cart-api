import { InvariantError, NotFoundError } from '@/exceptions'
import { PostProduct, PutProduct } from '@/utils/types'
import { nanoid } from 'nanoid'
import { Pool } from 'pg'
import { StorageService } from '../firebase/StorageService'
import CacheService from '../redis/CacheService'

export class ProductsService {

    private pool: Pool
    private storage: StorageService
    private cache: CacheService

    constructor(storageService: StorageService, cacheService: CacheService) {
        this.pool = new Pool()
        this.storage = storageService
        this.cache = cacheService
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

        return rows[0].id
    }

    async updateProduct(id: string, payload: PutProduct) {
        const product = await this.getProductById(id)

        if (payload.imgUrl && product.img_url) {
            await this.storage.deleteFile(product.img_url)
        }

        const query = {
            text: 'UPDATE products SET name = $1, price = $2, stock = $3, img_url = $4, description = $5 WHERE id = $6',
            values: [payload.name, payload.price, payload.stock, payload.imgUrl, payload.description, id]
        }

        const { rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new InvariantError('Failed to update product')
        }
    }

    async getProductById(id: string) {
        const query = {
            text: 'SELECT * FROM products WHERE id = $1',
            values: [id]
        }

        const { rows, rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new NotFoundError('Product not found')
        }

        return rows[0]
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
}