import ClientError from "./ClientError";

class NotFoundError extends ClientError {
    
    public name: string

    constructor(message: string) {
        super(message, 404)
        this.name = 'NotFoundError'
    }
}

export default NotFoundError