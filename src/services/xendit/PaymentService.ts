import { env } from '@/utils/env'
import { XenditInvoiceRequest } from '@/utils/types'
import { Invoice as InvoiceClient } from 'xendit-node'
import { Invoice } from 'xendit-node/invoice/models'

export class PaymentService {
    private xenditClient: InvoiceClient

    constructor() {
        this.xenditClient = new InvoiceClient({
            secretKey: env.get('XENDIT_SECRET_API_KEY').toString(),
        })
    }

    async createNewInvoice(data: XenditInvoiceRequest): Promise<Invoice> {
        try {
            return await this.xenditClient.createInvoice({ data })
        } catch (error) {
            throw new Error('Invoice cannot be processed by xendit')
        }
    }
}
