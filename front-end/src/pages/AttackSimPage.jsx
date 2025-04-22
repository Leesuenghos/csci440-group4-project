
// src/pages/AttackSimPage.jsx
import React, { useState } from 'react'
import ConfigDoS from '../components/ConfigDoS'
import ConfigPhish from '../components/ConfigPhish'
import ConfigBF from '../components/ConfigBF'
import ConfigExploit from '../components/ConfigExploit'

export default function AttackSimPage() {
  const [currentConfig, setCurrentConfig] = useState('NONE')

  function handleConfigToggle(e) {
    setCurrentConfig(e.target.value)
  }

  console.log(currentConfig === 'exploit-option')
  return (
    <section className="attack-types-container">
      <div className='attack-type-selector-container'>

        <h2>Choose Attack Type</h2>
        <select className="attack-selector-input" onChange={handleConfigToggle} value={currentConfig}>
          <option value="NONE">--</option>
          <option value="dos-option">DDoS Attack</option>
          <option value="exploit-option">Exploit Attack</option>
        </select>
      </div>
      <ConfigDoS isDoSVisible={currentConfig === 'dos-option'} />
      <ConfigBF isBFVisible={currentConfig === 'bf-option'} />
      <ConfigPhish isPhishVisible={currentConfig === 'ph-option'} />
      <ConfigExploit isExploitVisible={currentConfig === 'exploit-option'} />
    </section>
  )
}
