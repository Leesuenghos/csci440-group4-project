// returns stored threat events

import { Request, Response } from 'express';
import { getAllEvents } from '../models/eventModel';

export async function getThreatEvents(req: Request, res: Response) {
    const events = await getAllEvents();
    return res.json(events);
}
