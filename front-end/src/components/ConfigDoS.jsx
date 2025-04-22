
/*
    @authors: Alex Tzonis & Jacob Kennedy
    @date (last updated): 4/17/2025 

    This componenet will be used to take user inputs that will be used to execute a DoS attack. 
    The inputs will be passed to LOIC. 
    
    Code is created based on a "tutorial" for LOIC. Video below...
    https://www.youtube.com/watch?v=4uEfD68BBaY&ab_channel=AlexPhillips
*/

import React, { useState, useEffect } from 'react'
import { apiPost, apiGet } from '../services/api'

export default function ConfigDoS({ isDoSVisible }) {
    const [target, setTarget] = useState('')
    const [port, setPort] = useState(80)
    const [protocol, setProtocol] = useState('TCP')
    const [threads, setThreads] = useState(10)
    const [duration, setDuration] = useState(60)
    const [locked, setLocked] = useState(false)
    const [error, setError] = useState('')
    const [status, setStatus] = useState({ active: false, params: null, pid: null, uptimeSeconds: 0 })

    useEffect(() => {
        let interval
        async function fetchStatus() {
            try { const res = await apiGet('/attack/ddos/status'); setStatus(res.data) } catch { }
        }
        if (locked) { fetchStatus(); interval = setInterval(fetchStatus, 5000) }
        return () => interval && clearInterval(interval)
    }, [locked])

    const handleSubmit = async e => {
        e.preventDefault(); setError('')
        if (!target.trim()) return setError('target is required')
        if (port <= 0) return setError('port must be >0')
        if (threads < 1) return setError('threads>=1')
        if (duration <= 0) return setError('duration>0')
        try {
            if (!locked) { await apiPost('/attack/ddos/start', { targetIP: target.trim(), port, method: protocol, threads, duration }); setLocked(true) }
            else { await apiPost('/attack/ddos/stop', {}); setLocked(false) }
        } catch { setError(locked ? 'failed to stop ddos' : 'failed to start ddos') }
    }

    if (!isDoSVisible) return null

    return (
        <form className="dos-config" onSubmit={handleSubmit}>
            {error && <p className="error">{error}</p>}
            <div className="dos-settings">
                <div className="dos-field">
                    <label>target (ip or hostname):</label>
                    <input value={target} onChange={e => setTarget(e.target.value)} disabled={locked} />
                </div>
                <div className="dos-field">
                    <label>port:</label>
                    <input type="number" value={port} onChange={e => setPort(+e.target.value)} disabled={locked} />
                </div>
                <div className="dos-field">
                    <label>protocol:</label>
                    <select value={protocol} onChange={e => setProtocol(e.target.value)} disabled={locked}>
                        <option>TCP</option><option>UDP</option>
                    </select>
                </div>
                <div className="dos-field">
                    <label>threads (rate):</label>
                    <input type="number" value={threads} onChange={e => setThreads(+e.target.value)} disabled={locked} />
                </div>
                <div className="dos-field">
                    <label>duration (sec):</label>
                    <input type="number" value={duration} onChange={e => setDuration(+e.target.value)} disabled={locked} />
                </div>
                <div className="dos-field dos-submit">
                    <button className="dos-button" type="submit">
                        {locked ? 'unlock & stop ddos' : 'lock & launch ddos'}
                    </button>
                </div>
            </div>
            <div className="dos-status">
                <div className="dos-status-row"><p>status:</p><p>{status.active ? 'active' : 'inactive'}</p></div>
                {status.params && <>
                    <div className="dos-status-row"><p>target:</p><p>{status.params.targetIP}</p></div>
                    <div className="dos-status-row"><p>port:</p><p>{status.params.port}</p></div>
                    <div className="dos-status-row"><p>protocol:</p><p>{status.params.method}</p></div>
                    <div className="dos-status-row"><p>threads:</p><p>{status.params.threads}</p></div>
                    <div className="dos-status-row"><p>duration:</p><p>{status.params.duration}</p></div>
                </>}
                <div className="dos-status-row"><p>pid:</p><p>{status.pid}</p></div>
                <div className="dos-status-row"><p>uptime:</p><p>{status.uptimeSeconds}s</p></div>
            </div>
        </form>
    )
}
