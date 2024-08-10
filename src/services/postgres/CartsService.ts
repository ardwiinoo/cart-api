import { Pool } from "pg";
import EventService from "../event/EventService";
import { InvariantError, NotFoundError } from "@/exceptions";
import { AddItemToCart, PostCartItem } from "@/utils/types";
import { nanoid } from "nanoid";

export class CartsService {
    
    private pool: Pool
    private event: EventService

    constructor(eventService: EventService) {
        this.pool = new Pool()
        this.event = eventService
    }  

    async addItemToCart(payload: PostCartItem) {
        const id = `cart-${nanoid(16)}`
        
        return this.getCartByUserId(payload.userId).then(cartData => {
            this.event.emit<AddItemToCart>('cartItemAdded', { 
                ...payload, cartId: cartData.id 
            })

            return cartData.id
        }).catch(async () => {
            const query = {
                text: 'INSERT INTO carts (id, user_id) VALUES ($1, $2) RETURNING id',
                values: [id, payload.userId]
            }

            const { rows, rowCount } = await this.pool.query(query)

            if (!rowCount) {
                throw new InvariantError('Failed to add user cart')
            }

            this.event.emit<AddItemToCart>('cartItemAdded', { 
                ...payload, cartId: rows[0].id 
            })

            return rows[0].id
        }) 
    }

    async getCartByUserId(userId: string) {
        const query = {
            text: 'SELECT * FROM carts WHERE user_id = $1',
            values: [userId]
        }

        const { rows, rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new NotFoundError('Cart not found')
        }

        return rows[0]
    }
}