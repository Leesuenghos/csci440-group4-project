// sets up express with middleware and routes

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import simulationRoutes from './routes/simulationRoutes';
import threatRoutes from './routes/threatRoutes';

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/simulation', simulationRoutes);
app.use('/api/threats', threatRoutes);

export default app;
