import EventEmitter from 'events'

class EventService {
    
    private eventEmitter: EventEmitter

    constructor() {
        this.eventEmitter = new EventEmitter()
    }

    public on<T>(event: string, listener: (data: T) => void) {
        this.eventEmitter.on(event, listener)
    }

    public emit<T>(event: string, data: T) {
        this.eventEmitter.emit(event, data)
    }
}

export default EventService