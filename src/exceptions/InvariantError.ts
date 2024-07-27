import { ClientError } from "./ClientError";

export class InvariantError extends ClientError {

    public name: string

    constructor(message: string) {
        super(message)
        this.name = 'InvariantError'
    }
}