import { Pool } from "pg";
import EventService from "../event/EventService";
import { InvariantError, NotFoundError } from "@/exceptions";
import { AddItemToCart, DeleteCartItem, PostCartItem } from "@/utils/types";
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
            this.event.emit<AddItemToCart>('new-cart-item', { 
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

            this.event.emit<AddItemToCart>('new-cart-item', { 
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

    async getCarts(userId: string) {
        const cart = await this.getCartByUserId(userId)

        const query = {
            text: 'SELECT * FROM cart_items WHERE cart_id = $1',
            values: [cart.id]
        }

        const { rows } = await this.pool.query(query)

        return {
            cart: cart,
            cart_items: rows
        }
    }

    async deleteCarts(userId: string) {
        const cart = await this.getCartByUserId(userId)
    
   
        const deleteItemsQuery = {
            text: 'DELETE FROM cart_items WHERE cart_id = $1',
            values: [cart.id]
        }

        const { rowCount: itemsDeleted } = await this.pool.query(deleteItemsQuery)

        if (!itemsDeleted) {
            throw new InvariantError('Failed to delete cart items')
        }

        const deleteCartQuery = {
            text: 'DELETE FROM carts WHERE id = $1',
            values: [cart.id]
        }

        const { rowCount: cartDeleted } = await this.pool.query(deleteCartQuery)

        if (!cartDeleted) {
            throw new InvariantError('Failed to delete cart')
        }
    }

    async deleteCartItem(payload: DeleteCartItem) {
        const cart = await this.getCartByUserId(payload.userId)

        const query = {
            text: 'DELETE FROM cart_items WHERE id = $1 AND cart_id = $2',
            values: [payload.itemId, cart.id]
        }

        const { rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new NotFoundError('Cart item not found')
        }
    }
}