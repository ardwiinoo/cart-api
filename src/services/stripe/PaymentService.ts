import { env } from "@/utils/env"
import Stripe from "stripe"

export class PaymentService {

    private stripe: Stripe
 
    constructor() {
        this.stripe = new Stripe(env.get('STRIPE_KEY').toString(), {
            apiVersion: '2024-06-20'
        })
    }

    async createPaymentIntent(amount: number, currency: string, orderId: string) {
        return await this.stripe.paymentIntents.create({
            amount,
            currency,
            metadata: { orderId },
            payment_method_types: ['card'],
        })
    }

    async confirmPayment(paymentIntentId: string, paymentMethodId: string) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
                payment_method: paymentMethodId,
            })

            return {
                success: true,
                paymentIntent,
            }
        } catch (error) {
            return {
                success: false,
                error: (error as Error).message,
            }
        }
    }
}