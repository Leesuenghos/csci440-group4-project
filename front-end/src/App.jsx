
/*
@authors: Alex Tzonis

- Alex T. 
To start the server, follow the instructions below: 
1. Open up the terminal
2. Enter: cd front-end
3. Enter: npm run dev
4. Copy the outputted URL from the terminal into your browser (should be http://localhost:5173/)
*/

import './App.css';
import React, {useState} from 'react';

import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AnalysisPage } from './pages/AnalysisPage.jsx';
import { AttackSimPage } from './pages/AttackSimPage.jsx';
import { Home } from './pages/home.jsx';
import { ThreatEventsPage } from './pages/ThreatEventsPage.jsx';
import { Navbar } from './components/Navbar.jsx';
import ThreatEventList from './components/ThreatEventList';

function App() {
  return (
    <>
      <Router>
        <header>
          <h1 className='header-title'>Dashboard</h1>
          <div className='navbar-container'>
            <Navbar />
          </div>
        </header>
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Simulation" element={<AttackSimPage />} />
          <Route path="/ThreatEventPage" element={<ThreatEventsPage />} />
          <Route path="/AnalysisPage" element={<AnalysisPage />} />
        </Routes>

        <ThreatEventList />
        
      </Router>
    </>
  );
}

export default App;