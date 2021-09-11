import { socket, Socket } from 'zeromq';
import * as faker from 'faker';

const systemA = socket('push');
const systemB = socket('push');

systemA.bindSync('tcp://127.0.0.1:20001');
console.log('Producer bound to port 20001');

systemB.bindSync('tcp://127.0.0.1:20002');
console.log('Producer bound to port 20002');

enum systems {
    SYSTEMA = 1,
    SYSTEMB = 2
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

function scheduleMessage(socket: Socket, msg: {[key: string]: any}) {
    const delay = Math.random() * 1200;
    setTimeout(() => {
        socket.send(JSON.stringify(msg));
    }, delay);
}

function createMessage() {
    const senders = getRandomInt(3) + 1; // random choice 1, 2, or 3
    const timestamp = Date.now();
    
    if (senders & systems.SYSTEMA) {
        scheduleMessage(systemA, {
            timestamp: timestamp,
            lat: faker.address.latitude(),
            lon: faker.address.longitude()
        });
    }

    if (senders & systems.SYSTEMB) {
        scheduleMessage(systemB, {
            timestamp: timestamp,
            information: faker.hacker.phrase()
        });
    }
    setTimeout(createMessage, Math.random()*500);
} 

createMessage();