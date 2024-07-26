import EventEmitter from 'events'

class EventService {
    private eventEmitter: EventEmitter

    constructor() {
        this.eventEmitter = new EventEmitter()
    }

    public on(event: string, listener: (...args: unknown[]) => void) {
        this.eventEmitter.on(event, listener)
    }

    public emit(event: string, listener: (...args: unknown[]) => void) {
        this.eventEmitter.emit(event, listener)
    }
}

export default EventService