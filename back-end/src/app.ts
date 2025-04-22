// app.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import threatRoutes from './routes/threatRoutes';
import attackRoutes from './routes/attackRoutes';
import suricataRoutes from './routes/suricataRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev')); // Add logging middleware

// Routes
app.use('/api/attack', attackRoutes);
app.use('/api/threats', threatRoutes);
app.use('/api/suricata', suricataRoutes);


// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

export default app;