// suricataService.ts
// spawns the suricata process on windows

import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { suricataConfig } from '../config/suricataConfig';
import { insertEvent } from '../models/eventModel';

let suricataProcess: ChildProcessWithoutNullStreams | null = null;

export function startSuricata(): void {
    const { suricataCommand, rulesPath, interface: netInterface } = suricataConfig;

    suricataProcess = spawn(suricataCommand, [
        '-c', `${rulesPath}\\suricata.yaml`,
        '-i', netInterface
    ], {
        shell: true // sometimes needed on windows
    });

    if (suricataProcess.stdout) {
        suricataProcess.stdout.on('data', async (data: Buffer) => {
            const output = data.toString();
            console.log('suricata stdout:', output);

            // parse alerts from the output
            if (output.toLowerCase().includes('alert')) {
                await insertEvent({
                    type: 'detected threat',
                    source_ip: 'unknown',
                    dest_ip: 'unknown',
                    severity: 'high'
                });
            }
        });
    }

    if (suricataProcess.stderr) {
        suricataProcess.stderr.on('data', (data: Buffer) => {
            console.log('suricata stderr:', data.toString());
        });
    }

    suricataProcess.on('close', (code: number) => {
        console.log(`suricata exited with code: ${code}`);
        suricataProcess = null;
    });
}

export function stopSuricata(): void {
    if (suricataProcess) {
        suricataProcess.kill();
        suricataProcess = null;
        console.log('suricata process stopped');
    }
}
