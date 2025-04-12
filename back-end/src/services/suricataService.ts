// services/suricataService.ts
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { suricataConfig } from '../config/suricataConfig';
import { insertEvent, ThreatEvent } from '../models/eventModel';
import fs from 'fs';
import path from 'path';
import { getIo } from '../socket';

let suricataProcess: ChildProcessWithoutNullStreams | null = null;

// Parse Suricata alerts to extract more detailed information
function parseAlert(alertText: string): Partial<ThreatEvent> {
    const event: Partial<ThreatEvent> = {
        type: 'detected_threat',
        severity: 'medium'
    };

    // Extract source IP
    const sourceIpMatch = alertText.match(/\b(?:\d{1,3}\.){3}\d{1,3}:\d+\b.*?->/);
    if (sourceIpMatch) {
        const ipWithPort = sourceIpMatch[0].replace('->', '').trim();
        event.source_ip = ipWithPort.split(':')[0];
    }

    // Extract destination IP
    const destIpMatch = alertText.match(/->.*?\b(?:\d{1,3}\.){3}\d{1,3}:\d+\b/);
    if (destIpMatch) {
        const ipWithPort = destIpMatch[0].replace('->', '').trim();
        event.dest_ip = ipWithPort.split(':')[0];
    }

    // Extract alert type
    const typeMatch = alertText.match(/\[\*\*\] \[(.*?)\] (.*?) \[\*\*\]/);
    if (typeMatch && typeMatch[2]) {
        event.type = typeMatch[2].trim().toLowerCase();
    }

    // Determine severity based on alert classification
    if (alertText.toLowerCase().includes('priority: 1') ||
        alertText.toLowerCase().includes('critical')) {
        event.severity = 'critical';
    } else if (alertText.toLowerCase().includes('priority: 2') ||
        alertText.toLowerCase().includes('high')) {
        event.severity = 'high';
    } else if (alertText.toLowerCase().includes('priority: 3') ||
        alertText.toLowerCase().includes('medium')) {
        event.severity = 'medium';
    } else {
        event.severity = 'low';
    }

    return event;
}

// Add custom Suricata rules for detecting attacks
export function setupCustomRules(): void {
    const { rulesPath } = suricataConfig;
    const customRulesPath = path.join(rulesPath, 'custom.rules');

    // Define custom detection rules
    const customRules = `
        # Detect LOIC DDoS attacks
        alert tcp any any -> any any (msg:"Possible LOIC DDoS Attack"; flags:S; threshold:type threshold, track by_dst, count 100, seconds 5; classtype:attempted-dos; sid:10000001; rev:1;)
        alert udp any any -> any any (msg:"Possible UDP Flood"; threshold:type threshold, track by_dst, count 100, seconds 5; classtype:attempted-dos; sid:10000002; rev:1;)
        alert http any any -> any any (msg:"Possible HTTP Flood"; flow:established,to_server; threshold:type threshold, track by_dst, count 50, seconds 5; classtype:attempted-dos; sid:10000003; rev:1;)

        # Detect common Metasploit patterns
        alert tcp any any -> any any (msg:"Possible Metasploit Exploit Attempt"; flow:established,to_server; content:"Meterpreter"; nocase; classtype:attempted-admin; sid:10000004; rev:1;)
        alert tcp any any -> any any (msg:"Metasploit Reverse Shell Connect Attempt"; flow:established,to_server; content:"|00 01 00 01|"; classtype:trojan-activity; sid:10000005; rev:1;)

        # Detect common port scans
        alert tcp any any -> any any (msg:"NMAP TCP Scan"; flags:S; threshold:type threshold, track by_src, count 20, seconds 5; classtype:attempted-recon; sid:10000006; rev:1;)
    `;

    // Write custom rules to file
    fs.writeFileSync(customRulesPath, customRules);

    // Update suricata.yaml to include custom rules
    const suricataYamlPath = path.join(rulesPath, 'suricata.yaml');
    let suricataYaml = fs.readFileSync(suricataYamlPath, 'utf8');

    // Check if custom rules are already included
    if (!suricataYaml.includes('custom.rules')) {
        // Find the rule-files section and add custom.rules
        const ruleFilesMatch = suricataYaml.match(/rule-files:[\s\S]*?(?=\n\w|\Z)/);
        if (ruleFilesMatch) {
            const updatedRuleFiles = ruleFilesMatch[0] + '\n  - custom.rules';
            suricataYaml = suricataYaml.replace(ruleFilesMatch[0], updatedRuleFiles);
            fs.writeFileSync(suricataYamlPath, suricataYaml);
        }
    }

    console.log('Custom Suricata rules configured');
}

export function startSuricata(): void {
    // Set up custom rules first
    setupCustomRules();

    const { suricataCommand, rulesPath, interface: netInterface } = suricataConfig;

    suricataProcess = spawn(suricataCommand, [
        '-c', `${rulesPath}\\suricata.yaml`,
        '-i', netInterface,
        '-v' // Verbose mode for more detailed output
    ], {
        shell: true
    });

    if (suricataProcess.stdout) {
        let buffer = '';

        suricataProcess.stdout.on('data', async (data: Buffer) => {
            const output = data.toString();
            buffer += output;

            // Process complete alert lines
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

            for (const line of lines) {
                console.log('Suricata output:', line);

                // Process alerts
                if (line.includes('[**]') && line.toLowerCase().includes('alert')) {
                    const parsedEvent = parseAlert(line);
                    const event = await insertEvent(parsedEvent as ThreatEvent);

                    // Emit the event via Socket.IO for real-time updates
                    const io = getIo();
                    if (io) {
                        io.emit('threat-detected', event);
                    }
                }
            }
        });
    }

    if (suricataProcess.stderr) {
        suricataProcess.stderr.on('data', (data: Buffer) => {
            console.error('Suricata stderr:', data.toString());
        });
    }

    suricataProcess.on('close', (code: number) => {
        console.log(`Suricata exited with code: ${code}`);
        suricataProcess = null;
    });

    console.log('Suricata started with enhanced detection rules');
}

export function restartSuricata(): void {
    stopSuricata();
    setTimeout(() => startSuricata(), 1000);
}

export function stopSuricata(): void {
    if (suricataProcess) {
        suricataProcess.kill();
        suricataProcess = null;
        console.log('Suricata process stopped');
    }
}

export function getSuricataStatus(): { running: boolean } {
    return {
        running: suricataProcess !== null
    };
}