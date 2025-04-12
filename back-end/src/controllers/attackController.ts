// controllers/attackController.ts
import { Request, Response } from 'express';
import { startDDoSAttack, stopDDoSAttack, getDDoSStatus } from '../services/ddosService';
import { runExploit, stopExploit, getExploitStatus } from '../services/metasploitService';

// DDoS attack endpoints
export async function startDDoS(req: Request, res: Response) {
    const { targetIP, port, method, threads, duration } = req.body;

    if (!targetIP || !port || !method || !threads || !duration) {
        return res.status(400).json({
            success: false,
            message: 'Missing required parameters'
        });
    }

    const success = await startDDoSAttack({
        targetIP,
        port: parseInt(port, 10),
        method: method as 'TCP' | 'UDP' | 'HTTP',
        threads: parseInt(threads, 10),
        duration: parseInt(duration, 10)
    });

    return res.json({
        success,
        message: success ? 'DDoS attack simulation started' : 'Failed to start DDoS simulation'
    });
}

export async function stopDDoS(req: Request, res: Response) {
    stopDDoSAttack();
    return res.json({
        success: true,
        message: 'DDoS attack simulation stopped'
    });
}

export async function getDDoSAttackStatus(req: Request, res: Response) {
    return res.json(getDDoSStatus());
}

// Metasploit exploit endpoints
export async function launchExploit(req: Request, res: Response) {
    const { exploitModule, targetIP, targetPort, options } = req.body;

    if (!exploitModule || !targetIP) {
        return res.status(400).json({
            success: false,
            message: 'Missing required parameters'
        });
    }

    const success = await runExploit({
        exploitModule,
        targetIP,
        targetPort: targetPort ? parseInt(targetPort, 10) : undefined,
        options
    });

    return res.json({
        success,
        message: success ? 'Exploit launched' : 'Failed to launch exploit'
    });
}

export async function stopExploitExecution(req: Request, res: Response) {
    stopExploit();
    return res.json({
        success: true,
        message: 'Exploit execution stopped'
    });
}

export async function getExploitExecutionStatus(req: Request, res: Response) {
    return res.json(getExploitStatus());
}