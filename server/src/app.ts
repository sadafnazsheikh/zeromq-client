import { DataListener, getSynchronisedDataStream } from './zmq-consumer';

import * as express from 'express';
import { Server as WebSocketServer } from 'ws';
import * as http from 'http';
const app = express();
 
app.get('/', function (req, res) {
  res.send('Synchronised Messages')
});
 
app.get('/user', function (req, res) {
  res.send({
    first: 'Sadaf',
    last: 'Sheikh'
  });
});

const server = http.createServer(app);
server.listen(8080);

// listen to incoming websocket connections
const wss = new WebSocketServer({server: server, path: "/systemData"});
wss.on('connection', (socket) => {
    console.log('Incoming connection');
    const stream = getSynchronisedDataStream();

    const callback: DataListener = (message) => {
        console.log('Sending', message);
        // send it on the websocket
        socket.send(JSON.stringify(message));
    };

    // add the listener
    stream.onMessage(callback);

    // remove listener when websocket is closed
    socket.on('close', () => stream.offMessage(callback))
});
