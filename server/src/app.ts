import { getSynchronisedDataStream } from './zmq-consumer';

const stream = getSynchronisedDataStream();
stream.onMessage((message) => {
    console.log("sending", message);
})