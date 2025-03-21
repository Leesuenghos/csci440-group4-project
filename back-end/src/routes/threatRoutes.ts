import { Router } from 'express';
import { getThreatEvents } from '../controllers/threatController';

const router = Router();

router.get('/', getThreatEvents as any);

export default router;
