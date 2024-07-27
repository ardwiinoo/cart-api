import { env } from '@/utils/env'
import redis, { RedisClientType } from 'redis'

class CacheService {

    private client: RedisClientType

    constructor() {
        this.client = redis.createClient({
            socket: {
                host: env.get('REDIS_SERVER').toString()
            }
        })

        this.client.on('error', (error) => {
            console.error(error)
        })

        this.client.connect()
    }

    async set(key: string, value: unknown, expirationInSecond: number = 1800) { // 30 mins
        await this.client.set(key, JSON.stringify(value), {
            EX: expirationInSecond
        })
    }

    async get(key: string) {
        const result = await this.client.get(key)
        if (result === null) throw new Error('Cache tidak ditemukan')
        return result
    }

    delete(key: string) {
        this.client.del(key)
    }
}

export default CacheService