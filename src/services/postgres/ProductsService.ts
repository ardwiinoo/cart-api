import { Pool } from "pg";

export class ProductsService {

    private pool: Pool

    constructor() {
        this.pool = new Pool()
    }
}