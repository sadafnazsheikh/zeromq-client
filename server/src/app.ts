import { ZMQConsumer } from './zmq-consumer';

const systemA = new ZMQConsumer('tcp://127.0.0.1:20001');
const systemB = new ZMQConsumer('tcp://127.0.0.1:20002');

systemA.onMessage((value) => {
    console.log('System A', value.timestamp, value.lat, value.lon);
});

systemB.onMessage((value) => {
    console.log('System B', value.timestamp, value.information);
});