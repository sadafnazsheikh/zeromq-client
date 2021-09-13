import { socket, Socket } from 'zeromq';

const MAX_MSG_DELAY = 800;

export interface DataA {
    timestamp: number;
    lat: number;
    lon: number;
}
export interface DataB {
    timestamp: number;
    information: string;
}

export interface MessageData {
    timestamp: number;
    lat: number;
    lon: number;
    information?: string;
}

export class ZMQConsumer<T> {
    private socket: Socket;

    constructor(url: string) {
        this.socket = socket('pull');
        this.socket.connect(url);
        console.log(`Listening to ${url}`)
    }

    onMessage(listener: (value: T) => void) {
        this.socket.on('message', (msg) => listener(JSON.parse(msg)));        
    }

}

class PendingMessage<T> {
    sent: boolean;
    message: T;
}

export type DataListener = (message: MessageData) => void;
export class ZMQJoiner {
    private consumerA: ZMQConsumer<DataA>;
    private consumerB: ZMQConsumer<DataB>;

    /** 
     * map pending data by timestamp
     */
    private pendingA: Map<number, PendingMessage<DataA>>; 

    /** 
     * map pending data by timestamp
     */
    private pendingB: Map<number, PendingMessage<DataB>>; 

    private callback: DataListener;

    constructor(callback: DataListener) {
        this.callback = callback;

        this.consumerA = new ZMQConsumer<DataA>('tcp://127.0.0.1:20001');
        this.consumerA.onMessage(this.handleMessageA.bind(this));

        this.consumerB = new ZMQConsumer<DataB>('tcp://127.0.0.1:20002');
        this.consumerB.onMessage(this.handleMessageB.bind(this));

        this.pendingA = new Map();
        this.pendingB = new Map();
    }

    private handleMessageA(message: DataA) {
        if (this.pendingB.has(message.timestamp)) {
            // message B has arraived first and is waiting
            const pendingMessageB = this.pendingB.get(message.timestamp);
            this.pendingB.delete(message.timestamp);
            pendingMessageB.sent = true;
            this.callback({
                ...message,
                information: pendingMessageB.message.information
            });
        } else {
            // wait 800ms for message B then send
            const pendingMessageA: PendingMessage<DataA> = {
                message: message,
                sent: false
            };
            this.pendingA.set(message.timestamp, pendingMessageA);
            setTimeout(() => {
                if (!pendingMessageA.sent) {
                    this.callback({...message});
                    this.pendingA.delete(message.timestamp);
                }
            }, MAX_MSG_DELAY);
        }
    }

    private handleMessageB(message: DataB) {
        if (this.pendingA.has(message.timestamp)) {
            // message A has arraived first and is waiting
            const pendingMessageA = this.pendingA.get(message.timestamp);
            this.pendingB.delete(message.timestamp);
            pendingMessageA.sent = true;
            this.callback({
                ...pendingMessageA.message,
                information: message.information
            });
        } else {
            // wait 800ms for message A then abandon
            const pendingMessageB: PendingMessage<DataB> = {
                message: message,
                sent: false
            };
            this.pendingB.set(message.timestamp, pendingMessageB);
            setTimeout(() => {
                if (this.pendingB.has(message.timestamp)) {
                    console.log("Dropping", message);
                    this.pendingB.delete(message.timestamp);
                }
            }, MAX_MSG_DELAY);
        }
    }
}

export class SynchronisedDataStream {
    private callbacks: Set<DataListener>;
    private source: ZMQJoiner;

    constructor() {
        this.callbacks = new Set();
        this.source = new ZMQJoiner(this.handleMessage.bind(this));
    }

    onMessage(callback: DataListener) {
        this.callbacks.add(callback);
    }

    offMessage(callback: DataListener) {
        this.callbacks.delete(callback);
    }

    private handleMessage(message: MessageData) {
        this.callbacks.forEach((callback) => {
            callback(message);
        })
    }
}

let synchronisedDataStream: SynchronisedDataStream;

export function getSynchronisedDataStream() {
    if (synchronisedDataStream === undefined) {
        synchronisedDataStream = new SynchronisedDataStream();
    }
    return synchronisedDataStream;
}