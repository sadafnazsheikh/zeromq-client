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

var wss = new WebSocketServer({server: server, path: "/systemData"});
wss.on('connection', (socket) => {
    const stream = getSynchronisedDataStream();
    const callback: DataListener = (message) => socket.send(message);
    stream.onMessage(callback);
    socket.on('close', () => stream.offMessage(callback))
});
