import { env } from '@/utils/env'
import redis, { RedisClientType } from 'redis'

class CacheService {

    private client: RedisClientType
    private cacheKeys: Set<string>

    constructor() {
        this.client = redis.createClient({
            socket: {
                host: env.get('REDIS_SERVER').toString()
            }
        })

        this.cacheKeys = new Set()

        this.client.on('error', (error) => {
            console.error(error)
        })

        this.client.connect()
    }

    async set(key: string, value: unknown, expirationInSecond: number = 1800) { // 30 mins
        await this.client.set(key, JSON.stringify(value), {
            EX: expirationInSecond
        })

        this.cacheKeys.add(key)
    }

    async get(key: string) {
        const result = await this.client.get(key)
        if (result === null) throw new Error('Cache not found')
        return result
    }

    async delete(key: string) {
        this.client.del(key)
        this.cacheKeys.delete(key)
    }

    async deleteAllByKeyPattern(keyPattern: string) {
        for (const key of this.cacheKeys) {
            if (key.startsWith(keyPattern)) { // key => products:page:*
                await this.delete(key)
            }
        } 
    }
}

export default CacheService