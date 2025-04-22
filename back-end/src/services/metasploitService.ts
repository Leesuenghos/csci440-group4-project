// services/metasploitService.ts
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { insertEvent } from '../models/eventModel';
import fs from 'fs';
import path from 'path';

let msfProcess: ChildProcessWithoutNullStreams | null = null;
let lastExploitParams: ExploitParams | null = null;
let lastCmdStr: string | null = null;
let startTimestamp: number | null = null;

interface ExploitParams {
    exploitModule: string;
    targetIP: string;
    targetPort?: number;
    options?: Record<string, string>;
}

export async function runExploit(params: ExploitParams): Promise<boolean> {
    console.log('runExploit called with params:', params);
    lastExploitParams = params;
    try {
        if (msfProcess) {
            console.log('existing msfProcess detected, stopping before new run');
            stopExploit();
        }

        // build the Metasploit RC script
        const rcLines = [
            `use ${params.exploitModule}`,
            `set RHOSTS ${params.targetIP}`,
            params.targetPort ? `set RPORT ${params.targetPort}` : null,
            ...Object.entries(params.options || {}).map(([k, v]) => `set ${k} ${v}`),
            'exploit -j',
            'exit'
        ].filter(Boolean);

        const rcPath = path.resolve(__dirname, 'temp_msf_commands.rc');
        fs.writeFileSync(rcPath, rcLines.join('\n'));
        console.log('RC file written to:', rcPath);

        await insertEvent({
            type: 'exploit_attempt',
            source_ip: 'localhost',
            dest_ip: params.targetIP,
            severity: 'high'
        });

        // correct Windows path with backslashes
        const msfBatPath = 'E:\\metasploit-framework\\bin\\msfconsole.bat';
        console.log('Using msfconsole path:', msfBatPath);
        const cmdStr = `${msfBatPath} -r ${rcPath}`;
        lastCmdStr = cmdStr;
        startTimestamp = Date.now();
        console.log('spawning msfconsole with command:', cmdStr);

        // use cmd.exe with /s /c to properly parse quotes and backslashes
        msfProcess = spawn('cmd.exe', ['/s', '/c', cmdStr], { shell: false });

        msfProcess.on('error', err => {
            console.error('spawn error:', err);
        });

        msfProcess.stdout.on('data', async (data: Buffer) => {
            const out = data.toString();
            console.log('Metasploit stdout:', out);
            if (/Meterpreter session|Command shell session/.test(out)) {
                console.log('Exploit success detected in output');
                await insertEvent({
                    type: 'exploit_success',
                    source_ip: 'localhost',
                    dest_ip: params.targetIP,
                    severity: 'critical'
                });
            }
        });

        msfProcess.stderr.on('data', data => {
            console.error('Metasploit stderr:', data.toString());
        });

        msfProcess.on('close', code => {
            console.log('msfconsole exited with code:', code);
            msfProcess = null;
        });

        return true;
    } catch (e) {
        console.error('runExploit failed with error:', e);
        return false;
    }
}

export function stopExploit(): void {
    if (msfProcess) {
        console.log('Stopping msfconsole process');
        msfProcess.kill();
        msfProcess = null;
        console.log('Exploit stopped');
    }
}

export function getExploitStatus(): {
    active: boolean;
    pid?: number;
    command?: string;
    startedAt?: string;
    params?: ExploitParams;
} {
    const active = msfProcess !== null;
    return {
        active,
        pid: msfProcess?.pid || undefined,
        command: lastCmdStr || undefined,
        startedAt: startTimestamp ? new Date(startTimestamp).toISOString() : undefined,
        params: lastExploitParams || undefined
    };
}