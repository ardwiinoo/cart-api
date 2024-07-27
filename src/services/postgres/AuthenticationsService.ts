import { Pool } from 'pg'

export class AuthenticationsService {

    private pool: Pool

    constructor() {
        this.pool = new Pool()
    }
}