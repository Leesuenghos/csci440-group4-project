
/*
@authors: Alex Tzonis & Jacob Kennedy

- Alex T. 
To start the server, follow the instructions below: 
1. Open up the terminal
2. Enter: cd front-end
3. Enter: npm run dev
4. Copy the outputted URL from the terminal into your browser (should be http://localhost:5173/)
*/

import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AttackSimPage from './pages/AttackSimPage'
import ThreatEventsPage from './pages/ThreatEventsPage'
import AnalysisPage from './pages/AnalysisPage'
import Navbar from './components/Navbar'
import './App.css'

export default function App() {
  return (
    <Router>
      <Navbar />
      <main className="app-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Simulation" element={<AttackSimPage />} />
          <Route path="/ThreatEventPage" element={<ThreatEventsPage />} />
          <Route path="/AnalysisPage" element={<AnalysisPage />} />
        </Routes>
      </main>
      <footer>© 2025 Alex Tzonis | Jacob Kennedy</footer>
    </Router>
  )
}
