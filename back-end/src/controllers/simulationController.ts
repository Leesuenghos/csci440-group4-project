import { Request, Response } from 'express';

// named export
export async function startSimulation(req: Request, res: Response) {
    return res.json({ message: 'simulation started' });
}
export async function stopSimulation(req: Request, res: Response) {
    return res.json({ message: 'simulation stopped' });
}

// make sure you do NOT also do `export default ...` here
