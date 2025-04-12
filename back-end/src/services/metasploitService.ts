// services/metasploitService.ts
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { insertEvent } from '../models/eventModel';

let msfProcess: ChildProcessWithoutNullStreams | null = null;
const METASPLOIT_PATH = 'c:/progra~1/Metasploit/msfconsole.bat';

interface ExploitParams {
    exploitModule: string;
    targetIP: string;
    targetPort?: number;
    options?: Record<string, string>;
}

export async function runExploit(params: ExploitParams): Promise<boolean> {
    try {
        if (msfProcess) {
            stopExploit();
        }

        // Create resource script (RC file) for automation
        const rcFileContent = `
            use ${params.exploitModule}
            set RHOSTS ${params.targetIP}
            ${params.targetPort ? `set RPORT ${params.targetPort}` : ''}
            ${Object.entries(params.options || {}).map(([key, value]) => `set ${key} ${value}`).join('\n')}
            exploit -j
            exit
        `;

        // Save to temporary file
        const fs = require('fs');
        const rcFilePath = './temp_msf_commands.rc';
        fs.writeFileSync(rcFilePath, rcFileContent);

        // Log the event
        await insertEvent({
            type: 'exploit_attempt',
            source_ip: 'localhost',
            dest_ip: params.targetIP,
            severity: 'high',
        });

        // Execute Metasploit with resource file
        msfProcess = spawn(METASPLOIT_PATH, ['-r', rcFilePath], { shell: true });

        console.log(`Started exploit ${params.exploitModule} against ${params.targetIP}`);

        msfProcess.stdout?.on('data', async (data: Buffer) => {
            const output = data.toString();
            console.log('Metasploit output:', output);

            // Parse for successful exploitation
            if (output.includes('Command shell session') || output.includes('Meterpreter session')) {
                await insertEvent({
                    type: 'exploit_success',
                    source_ip: 'localhost',
                    dest_ip: params.targetIP,
                    severity: 'critical',
                });
            }
        });

        msfProcess.stderr?.on('data', (data: Buffer) => {
            console.error('Metasploit error:', data.toString());
        });

        return true;
    } catch (error) {
        console.error('Failed to execute exploit:', error);
        return false;
    }
}

export function stopExploit(): void {
    if (msfProcess) {
        msfProcess.kill();
        msfProcess = null;
        console.log('Exploit execution stopped');
    }
}

export function getExploitStatus(): { active: boolean } {
    return {
        active: msfProcess !== null
    };
}