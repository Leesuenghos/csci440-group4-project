import { spawn, execSync } from 'child_process';
import { insertEvent, ThreatEvent } from '../models/eventModel';
import { getIo } from '../socket';

let proc: any = null;

function detectSuricataInterface(): number {
    const bin = '"C:\\Snort\\bin\\snort.exe"';
    const raw = execSync(`${bin} -W`, { encoding: 'utf8' });
    const lines = raw.split(/\r?\n/);

    // skip header (first two lines)
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // match: index, phys, ip, device, description
        const m = line.match(/^(\d+)\s+\S+\s+(\S+)\s+\S+\s+(.+)$/);
        if (!m) continue;

        const idx = parseInt(m[1], 10);
        const ip = m[2];
        const desc = m[3].toLowerCase();

        // skip disabled or loopback devices
        if (ip === 'disabled' || desc.includes('loopback')) continue;

        console.log(`auto‑selected snort iface ${idx} (${desc.trim()})`);
        return idx;
    }

    // fallback to env var if present
    if (process.env.SNORT_IFACE) {
        const envIdx = parseInt(process.env.SNORT_IFACE, 10);
        if (!isNaN(envIdx)) {
            console.log(`using SNORT_IFACE override: ${envIdx}`);
            return envIdx;
        }
    }

    throw new Error('no suitable snort interface found');
}

export function startSuricata() {
    if (proc) stopSuricata();

    const idx = detectSuricataInterface();
    const args = [
        '-c', 'C:\\Snort\\etc\\snort.conf',
        '-i', String(idx),
        '-A', 'console'
    ];

    proc = spawn('C:\\Snort\\bin\\snort.exe', args);

    proc.stdout.on('data', async (buf: Buffer) => {
        const line = buf.toString().trim();
        if (line.includes('[**]')) {
            const event = await insertEvent({
                type: line,
                source_ip: '',
                dest_ip: '',
                severity: 'medium'
            } as ThreatEvent);
            getIo()?.emit('threat-detected', event);
        }
    });

    proc.stderr.on('data', (d: any) => console.error('snort stderr:', d.toString()));
    proc.on('close', (c: any) => { console.log('snort exited', c); proc = null; });
}

export function stopSuricata() {
    if (proc) { proc.kill(); proc = null; }
}

export function getSuricataStatus() {
    return { running: proc !== null, interface: proc ? proc.spawnargs.join(' ') : undefined };
}

export function restartSuricata() {
    stopSuricata();
    startSuricata();
}