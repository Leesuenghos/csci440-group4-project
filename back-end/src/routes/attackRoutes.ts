// routes/attackRoutes.ts
import { Router } from 'express';
import {
    startDDoS,
    stopDDoS,
    getDDoSAttackStatus,
    launchExploit,
    stopExploitExecution,
    getExploitExecutionStatus
} from '../controllers/attackController';

const router = Router();

// DDoS routes
router.post('/ddos/start', startDDoS as any);
router.post('/ddos/stop', stopDDoS as any);
router.get('/ddos/status', getDDoSAttackStatus as any);

// Exploit routes
router.post('/exploit/launch', launchExploit as any);
router.post('/exploit/stop', stopExploitExecution as any);
router.get('/exploit/status', getExploitExecutionStatus as any);

export default router;