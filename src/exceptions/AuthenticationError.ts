import ClientError from "./ClientError";

class AuthenticationError extends ClientError {

    public name: string

    constructor(message: string) {
        super(message, 401)
        this.name = 'AuthenticationError'
    }
}

export default AuthenticationError