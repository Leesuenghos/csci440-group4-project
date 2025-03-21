// main entry point, starts the express server and socket.io

import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setupSocket } from './socket';
import { startSuricata } from './services/suricataService';

const port = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

setupSocket(io);
startSuricata();

server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
