import { Pool } from 'pg'

export class UsersService {

    private pool: Pool

    constructor() {
        this.pool = new Pool()
    }
}