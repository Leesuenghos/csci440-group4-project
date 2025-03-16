
import ConfigDoS from '../components/ConfigDoS';
import react, { useState } from 'react';

export function AttackSimPage() {
  const [showDoSConfig, setShowDoSConfig] = useState(false);
  const [showBFConfig, setShowBFConfig] = useState(false);
  const [currentConfig, setCurrentConfig] = useState("");



  const toggleBFConfig = (optionString) => {
    setCurrentConfig(optionString);
    setShowBFConfig(!showBFConfig);
  }

  const toggleDoSConfig = (optionString) => {
    setCurrentConfig(optionString);
    setShowDoSConfig(!showDoSConfig);
  }

  function toggleOffCurrentConfig(currentConfigValue){
    if(currentConfigValue === "dos-option"){
      toggleDoSConfig("");
    }
    else if(currentConfigValue === "bg-option"){
      toggleBFConfig("");
    }
  }

  function toggleNewConfig(targetValue) {
    if (targetValue === "dos-option") {
      toggleDoSConfig(targetValue);
    }
    else if(targetValue === "bf-option") {
      toggleBFConfig(targetValue);
    }
  }

  function handleConfigToggle(event) {
    if(event.target.value === currentConfig)
    {
      // user chose the same option so don't change anything
    }
    // user chose the empty section
    else if(event.target.value === "")
    {
      toggleOffCurrentConfig(currentConfig);
    }
    // user chose new config
    else
    {
      toggleOffCurrentConfig(currentConfig);
      toggleNewConfig(event.target.value);
    }
  }



  
  return( <>
            <div className="attack-controls-container">
                <h2>Attack Controls</h2>
                <button className='execute-sim-button'>Execute Simulation</button>
                <button className='pause-sim-button'>Pause Simulation</button>
                <button className='stop-sim-button'>Stop Simulation</button>
              </div>
              <div className='attack-types-container'>
                <div className='attack-select-container'>
                  <h2>Choose Attack</h2>
                  <select name="attack-type" onChange={handleConfigToggle}>
                    <option value=""></option>
                    <option value="dos-option">Denial-of-Service Attack (DoS)</option>
                    <option value="bf-option">Brute Force</option>
                  </select>
                  <br/>
                  <button className='add-config-button'>Add Configuration To Simulation</button>
                </div>
                <div className='attack-config-container'>
                  <ConfigDoS isDoSVisible={showDoSConfig}></ConfigDoS>
                </div>
              </div>
          </>);
}

 

