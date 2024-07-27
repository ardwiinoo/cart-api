import { ClientError } from "./ClientError";

export class AuthenticationError extends ClientError {

    public name: string

    constructor(message: string) {
        super(message, 401)
        this.name = 'AuthenticationError'
    }
}