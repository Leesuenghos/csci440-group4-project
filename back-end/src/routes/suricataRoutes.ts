import { Router } from 'express';
import {
    startSuricata,
    stopSuricata,
    restartSuricata,
    getSuricataStatus
} from '../services/suricataService';

const router = Router();

router.get('/status', (req, res) => {
    res.json(getSuricataStatus());
});

router.post('/start', (req, res) => {
    startSuricata();
    res.json({ success: true, message: 'Suricata started' });
});

router.post('/stop', (req, res) => {
    stopSuricata();
    res.json({ success: true, message: 'Suricata stopped' });
});

router.post('/restart', (req, res) => {
    restartSuricata();
    res.json({ success: true, message: 'Suricata restarted' });
});

export default router;
