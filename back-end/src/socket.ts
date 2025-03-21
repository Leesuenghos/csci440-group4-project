// sets up socket.io logic

import { Server } from 'socket.io';

export function setupSocket(io: Server) {
    io.on('connection', (socket) => {
        console.log('client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('client disconnected:', socket.id);
        });
    });
}
