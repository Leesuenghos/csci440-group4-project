// handles suricata lifecycle via rest
import { Request, Response } from 'express';
import {
    getSuricataStatus,
    restartSuricata,
    stopSuricata
} from '../services/suricataService';

// get current running status
export function getSuricataStatusHandler(req: Request, res: Response) {
    const status = getSuricataStatus();
    res.json({ success: true, ...status });
}

// restart suricata process
export function restartSuricataHandler(req: Request, res: Response) {
    restartSuricata();
    res.json({ success: true, message: 'suricata restart initiated' });
}

// stop suricata process
export function stopSuricataHandler(req: Request, res: Response) {
    stopSuricata();
    res.json({ success: true, message: 'suricata stopped' });
}
