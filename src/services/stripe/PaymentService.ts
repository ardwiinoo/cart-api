import { env } from "@/utils/env"
import Stripe from "stripe"

export class PaymentService {

    private stripe: Stripe
 
    constructor() {
        this.stripe = new Stripe(env.get('STRIPE_KEY').toString(), {
            apiVersion: '2024-06-20'
        })
    }

    async processPayment() {
        
    }
}