import { InvariantError } from "@/exceptions";
import { PostProduct } from "@/utils/types";
import { nanoid } from "nanoid";
import { Pool } from "pg";

export class ProductsService {

    private pool: Pool

    constructor() {
        this.pool = new Pool()
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
}