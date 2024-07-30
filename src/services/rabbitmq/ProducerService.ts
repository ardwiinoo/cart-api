import { env } from '@/utils/env'
import amqp from 'amqplib'

export const ProducerService = {
    sendMessage: async (queue: string, message: string) => {
        const connection = await amqp.connect(env.get('RABBITMQ_SERVER').toString())
        const channel = await connection.createChannel()

        await channel.assertQueue(queue, { durable: true })
        channel.sendToQueue(queue, Buffer.from(message))

        setTimeout(() => {
            connection.close()
        }, 1000)
    }
}