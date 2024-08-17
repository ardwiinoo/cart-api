import { Pool } from "pg"
import EventService from "../event/EventService"
import { InvariantError, NotFoundError } from "@/exceptions"
import { AddItemToCart, CartItem, DeleteCartItem, OrderStatus, PostCartItem } from "@/utils/types"
import { nanoid } from "nanoid"

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
    
        await this.deleteCartItemsByCartId(cart.id)
        await this.deleteCartById(cart.id)
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

    async getCartItemsByCartId(cartId: string) {
        const query = {
            text: 'SELECT * FROM cart_items WHERE cart_id = $1',
            values: [cartId]
        }

        const { rows } = await this.pool.query(query)
        return rows
    }

    async deleteCartItemsByCartId(cartId: string) {
        const query = {
            text: 'DELETE FROM cart_items WHERE cart_id = $1',
            values: [cartId]
        }

        const { rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new InvariantError('Failed to delete cart items')
        }
    }

    async deleteCartById(cartId: string) {
        const query = {
            text: 'DELETE FROM carts WHERE id = $1',
            values: [cartId]
        }

        const { rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new InvariantError('Failed to delete cart')
        }
    }

    async createOrder(userId: string, total: number) {
        const orderId = `order-${nanoid(16)}`
        const query = {
            text: 'INSERT INTO orders (id, user_id, status, total) VALUES ($1, $2, $3, $4) RETURNING id',
            values: [orderId, userId, OrderStatus.PLACEMENT, total]
        }

        const { rows, rowCount } = await this.pool.query(query)

        if (!rowCount) {
            throw new InvariantError('Failed to create order')
        }

        return rows[0].id
    }

    async moveCartItemsToOrderItems(cartItems: CartItem[], orderId: string) {
        const query = {
            text: `
                INSERT INTO order_items (id, order_id, product_id, quantity, price)
                SELECT $1 || '-' || gen_random_uuid(), $2, product_id, quantity, price
                FROM unnest($3::uuid[], $4::int[], $5::int[]) as t(product_id, quantity, price)
            `,
            values: [
                nanoid(16),
                orderId,
                cartItems.map(item => item.product_id),
                cartItems.map(item => item.quantity),
                cartItems.map(item => item.price),
            ]
        }

        await this.pool.query(query)
    }

    async checkout(userId: string) {
        const cart = await this.getCartByUserId(userId)
        const cartItems = await this.getCartItemsByCartId(cart.id)

        if (cartItems.length === 0) {
            throw new InvariantError('No items in cart to checkout')
        }

        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        const orderId = await this.createOrder(userId, total)
        await this.moveCartItemsToOrderItems(cartItems, orderId)
        await this.deleteCartItemsByCartId(cart.id)
        await this.deleteCartById(cart.id)

        return orderId
    }
}