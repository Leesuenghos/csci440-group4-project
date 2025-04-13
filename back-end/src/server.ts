// server.ts
import http from 'http';
import { Server } from 'socket.io';
import app from './app';
import { setupSocket } from './socket';
import { startSuricata } from './services/suricataService';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const port = process.env.PORT || 4000;
const server = http.createServer(app);

// Set up Socket.IO with CORS configuration
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST']
    }
});

// Setup socket handlers
setupSocket(io);

// Start Suricata for threat detection
startSuricata();

// Start the server
server.listen(port, () => {
    console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║  Vulnerability Testing & Threat Detection Server   ║
║  Running on port ${port}                             ║
║                                                    ║
╚════════════════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
    });
});