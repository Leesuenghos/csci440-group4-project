// src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export async function apiGet(path) {
    const res = await fetch(`${API_BASE}${path}`)
    if (!res.ok) throw new Error(`get ${path} failed: ${res.status}`)
    return res.json()
}

export async function apiPost(path, body) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`post ${path} failed: ${res.status}`)
    return res.json()
}
