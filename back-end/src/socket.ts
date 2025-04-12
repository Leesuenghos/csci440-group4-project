// socket.ts
import { Server, Socket } from 'socket.io';
import { getAllEvents, ThreatEvent } from './models/eventModel';

// This is the global Socket.IO server instance
let io: Server | null = null;

export function setupSocket(socketServer: Server) {
    io = socketServer;

    io.on('connection', async (socket: Socket) => {
        console.log('Client connected:', socket.id);

        // Send initial threat data on connection
        const initialEvents = await getAllEvents();
        socket.emit('threat-history', initialEvents);

        // Join different notification channels
        socket.on('join-channel', (channel: string) => {
            socket.join(channel);
            console.log(`Client ${socket.id} joined channel: ${channel}`);
        });

        // Leave notification channels
        socket.on('leave-channel', (channel: string) => {
            socket.leave(channel);
            console.log(`Client ${socket.id} left channel: ${channel}`);
        });

        // Manually simulate a threat event (for testing)
        socket.on('simulate-threat', async (threatData: ThreatEvent) => {
            console.log('Manual threat simulation:', threatData);
            // This should only be available in development/testing mode
            if (process.env.NODE_ENV !== 'production') {
                const event = { ...threatData, event_time: new Date() };
                io?.emit('threat-detected', event);
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });
}

// Export the function to get the Socket.IO instance
export function getIo(): Server | null {
    return io;
}

// Broadcast a threat event to all connected clients
export function broadcastThreatEvent(event: ThreatEvent): void {
    if (io) {
        io.emit('threat-detected', event);
    }
}

// Broadcast to specific channels
export function broadcastToChannel(channel: string, event: any): void {
    if (io) {
        io.to(channel).emit('channel-event', event);
    }
}