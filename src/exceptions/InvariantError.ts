import ClientError from "./ClientError";

class InvariantError extends ClientError {

    public name: string

    constructor(message: string) {
        super(message)
        this.name = 'InvariantError'
    }
}

export default InvariantError