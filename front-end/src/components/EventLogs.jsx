
/*
@authors: Alex Tzonis & Jacob Kennedy
*/

import React, { useEffect, useState } from 'react'
import { apiGet } from '../services/api'

export default function EventLogs() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGet('/threats')
      .then(res => setEvents(res))
      .finally(() => setLoading(false))
  }, [])

  const threatTypeMap = {
    'brute-force': 'Brute Force Attack',
    'ddos_simulation': 'DDoS Attack',
    'sql-injection': 'SQL Injection',
    'xss': 'Cross-Site Scripting',
    'malware': 'Malware Detection',
    'exploit_attempt': 'Exploit Attempt',
  }

  if (loading) return <p>Waiting for events...</p>
  return (
    <div className="event-logs-container">
      <table className="event-table">
        <thead>
          <tr><th>Threat Type</th><th>Source IP</th><th>Time</th><th>Severity</th></tr>
        </thead>
        <tbody>
          {events.map((e, i) => (
            <tr key={i}>
              <td>{threatTypeMap[e.type]}</td>
              <td>{e.source_ip}</td>
              <td>{new Date(e.event_time).toLocaleString()}</td>
              <td>{e.severity.toUpperCase()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}