import bcrypt from 'bcrypt'
import { env } from './env'

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, env.get('SALT_ROUNDS').toNumber(10))
}

export const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword)
}