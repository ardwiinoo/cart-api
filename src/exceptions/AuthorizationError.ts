import { ClientError } from "./ClientError";

export class AuthorizationError extends ClientError {

    public name: string

    constructor(message: string) {
        super(message, 403)
        this.name = 'AuthorizationError'
    }
}