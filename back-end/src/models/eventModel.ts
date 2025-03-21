// manages storing and retrieving threat events in postgres

import pool from '../config/db';

export interface ThreatEvent {
    id?: number;
    type: string;
    source_ip?: string;
    dest_ip?: string;
    severity?: string;
    event_time?: Date;
}

export async function insertEvent(eventData: ThreatEvent): Promise<ThreatEvent> {
    const query = `
    insert into threat_events (type, source_ip, dest_ip, severity, event_time)
    values ($1, $2, $3, $4, $5)
    returning *;
  `;
    const values = [
        eventData.type,
        eventData.source_ip,
        eventData.dest_ip,
        eventData.severity,
        eventData.event_time || new Date()
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function getAllEvents(): Promise<ThreatEvent[]> {
    const query = 'select * from threat_events order by event_time desc;';
    const result = await pool.query(query);
    return result.rows;
}
