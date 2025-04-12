// routes/simulationRoutes.ts
import { Router } from 'express';
import { startSimulation, stopSimulation } from '../controllers/simulationController';

const router = Router();

router.post('/start', startSimulation as any);
router.post('/stop', stopSimulation as any);

export default router;
