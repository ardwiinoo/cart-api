import { Pool } from "pg";

export class CartsService {
    
    private pool: Pool

    constructor() {
        this.pool = new Pool()
    }  
}