import { socket, Socket } from 'zeromq';

export class ZMQConsumer {
    private socket: Socket;

    constructor(url: string) {
        this.socket = socket('pull');
        this.socket.connect(url);
        console.log(`Listening to ${url}`)
    }

    onMessage(listener: (value: {[key: string]: any}) => void) {
        this.socket.on('message', (msg) => listener(JSON.parse(msg)));        
    }

}