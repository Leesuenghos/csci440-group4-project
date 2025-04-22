// src/components/Navbar.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/Simulation', label: 'Simulation' },
  { path: '/ThreatEventPage', label: 'Threat Events' },
  { path: '/AnalysisPage', label: 'Analysis' },
]

export default function Navbar() {
  return (
    <nav className="navbar-container">
      <ul className="nav-list">
        {navItems.map(({ path, label }) => (
          <li key={path} className="nav-item">
            <NavLink
              to={path}
              className={({ isActive }) =>
                isActive ? 'nav-link active' : 'nav-link'
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
