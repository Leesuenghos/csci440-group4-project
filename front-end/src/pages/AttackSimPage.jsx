
/*
    @authors: Alex Tzonis
    @date (last updated): 4/17/2025 
*/

import ConfigDoS from '../components/ConfigDoS';
import ConfigPhish from '../components/ConfigPhish';
import ConfigBF from '../components/ConfigBF';
import react, { useState } from 'react';

export function AttackSimPage() {
  const [showDoSConfig, setShowDoSConfig] = useState(false);      // boolean, toggles visibility of the ConfigDoS component
  const [showBFConfig, setShowBFConfig] = useState(false);        // boolean, toggles visibility of the ConfigBF component
  const [showPhishConfig, setShowPhishConfig] = useState(false);  // boolean, toggles visibility of the ConfigPhish component
  const [currentConfig, setCurrentConfig] = useState("NONE");     // holds the current config, dos-option, bf-option, phish-option, NONE
  const [dosReady, setDoSReady] = useState(false);                // boolean, determines if DoS attack is ready to launch
  const [phishReady, setPhishReady] = useState(false);            // boolean, determines if phish attack is ready to launch
  const [bfReady, setBFReady] = useState(false);                  // boolean, determines if brute force attack is ready to launch
  const [attackStatus, setAttackStatus] = useState("IDLE");       // holds the current attack status, IDLE, RUNNING, PAUSED

  // object to hold all necessary info to launch a DoS attack
  const [dosAttack, setDoSAttack] = useState({
    URL: '',
    IP: '',
    message: '',
    method: 'none',
    portNumber: 0,
    speed: '',
    threads: 0,
    timeout: 0,
    waitForReply: false
  });

  // click-handling functions
  const handleLaunchAttack = () => launchAttack();    // handles clicks for execute sim buttion
  const handlePauseAttack = () => pauseAttack();      // handles clicks for pause sim button
  const handleStopAttack = () => stopAttack();        // handles clicks for stop sim button

  // responsible for "retrieveing" passed values from ConfigDoS
  const handleDataFromDoS = (targetURL, ipAddress, message, method, portNum, speed, threads, timeout, waitForReply, addingDos) => {
    // update dosAttack with new values
    updateDoSAttack(targetURL, ipAddress, message, method, portNum, speed, threads, timeout, waitForReply); 
    if(addingDos) {
      enableDoSReady(); // if the user is adding the attack, set dosReady to true
    }
    else {
      disableDoSReady();  // else, the user is removing the attack, set dosReady to false
    }
  }

  // updates the values of dosAttack
  const updateDoSAttack = (targetURL, ipAddress, message, method, portNum, speed, threads, timeout, waitForReply) => 
  { 
    setDoSAttack({URL: targetURL, IP: ipAddress, message: message, method: method, 
      portNumber: portNum, speed: speed, threads: threads, timeout: timeout, waitForReply: waitForReply}); 
  } 

  const toggleBFConfig = (optionString) => {
    setCurrentConfig(optionString);
    setShowBFConfig(!showBFConfig);
  }

  const toggleDoSConfig = (optionString) => {
    setCurrentConfig(optionString);
    setShowDoSConfig(!showDoSConfig);
  }

  const togglePhishConfig = (optionString) => {
    setCurrentConfig(optionString);
    setShowPhishConfig(!showPhishConfig);
  }

  const enableDoSReady = () => {
    setDoSReady(true);
  }

  const disableDoSReady = () => {
    setDoSReady(false);
  }

  const changeAttackStatus = (optionString) => {
    if(optionString === "RUNNING") { setAttackStatus(optionString); }
    else if(option === "IDLE") { setAttackStatus(optionString); }
    else if(optionString === "PAUSED") { setAttackStatus(optionString); }
    else {}// invalid attack status 
  }

  function launchAttack() {
    // determine which attack to launch
    // checks if the attack is ready, if true, grab info to launch attack, else: move on to next attack
    if (currentConfig === "dos-option" && dosReady) {
      // launch dos attack
      launchDoSAttack();
    }
    else if (currentConfig === "ph-option" && phishReady) {
      // launch phishing attack
      changeAttackStatus("RUNNING");
    }
    else if (currentConfig === "bf-option" && bfReady) {
      // launch brute force attack
      changeAttackStatus("RUNNING");
    }
    else {
      // no attacks could be launched - inform user
    }
  }

  function launchDoSAttack() {
    /*
    below are the values to launch the dos attack
    no need for validating the values
    no need to check if the attack should be ran in this function

    for IP and URL: one of them will be "". This is an empty string.
    Empty strings have a boolean value of false. Anything else has a boolean value of true
    */

    /*
    dosAttack.IP
    dosAttack.URL
    dosAttack.message
    dosAttack.method
    dosAttack.portNumber
    dosAttack.speed
    dosAttack.threads
    dosAttack.timeout
    dosAttack.waitForReply
    */

    // if attack is idle (hasn't started)
    if (attackStatus ==="IDLE") {
      // start attack
      changeAttackStatus("RUNNING");
    }
    else if(attackStatus === "PAUSED") {
      // resume attack
      changeAttackStatus("RUNNING");
    }
    // else, can't accept input if already running
  }

  function launchPhAttack() {


    // if attack is idle (hasn't started)
    if (attackStatus ==="IDLE") {
      // start attack
      changeAttackStatus("RUNNING");
    }
    else if(attackStatus === "PAUSED") {
      // resume attack
      changeAttackStatus("RUNNING");
    }
    // else, can't accept input if already running
  }

  function launchBFAttack() {


    // if attack is idle (hasn't started)
    if (attackStatus ==="IDLE") {
      // start attack
      changeAttackStatus("RUNNING");
    }
    else if(attackStatus === "PAUSED") {
      // resume attack
      changeAttackStatus("RUNNING");
    }
    // else, can't accept input if already running
  }

  function pauseAttack() {


    // if attack is currently running, able to pause attack, else: nothing happens
    if(attackStatus === "RUNNING") {
      changeAttackStatus("PAUSED");
      // pseudocode to pause attack
    }
  }

  function stopAttack() {
    // if attack is currently running, able to stop attack, else: nothing happens
    if(attackStatus === "RUNNING") {
      changeAttackStatus("IDLE");
      // pseudocode to stop attack
    }
  }

  function toggleOffCurrentConfig(currentConfigValue){
    if(currentConfigValue === "dos-option"){
      toggleDoSConfig("NONE");
    }
    else if(currentConfigValue === "bg-option"){
      toggleBFConfig("NONE");
    }
    else if(currentConfigValue === "ph-option"){
      togglePhishConfig("NONE");
    }
  }

  function toggleNewConfig(targetValue) {
    if (targetValue === "dos-option") {
      toggleDoSConfig(targetValue);
    }
    else if(targetValue === "bf-option") {
      toggleBFConfig(targetValue);
    }
    else if(targetValue === "ph-option") {
      togglePhishConfig(targetValue);
    }
  }

  function handleConfigToggle(event) {
    if(event.target.value === currentConfig)
    {
      // user chose the same option so don't change anything
    }
    // user chose the empty section
    else if(event.target.value === "NONE")
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
            <button className='execute-sim-button' onClick={handleLaunchAttack}>Execute Simulation</button>
            <button className='pause-sim-button' onClick={handlePauseAttack}>Pause Simulation</button>
            <button className='stop-sim-button' onClick={handleStopAttack}>Stop Simulation</button>
            <div className='attack-info-container' id='dos-info-container' hidden={!dosReady}>
              <label className='attack-info-labels' hidden={!dosAttack.IP}>IP Address: {dosAttack.IP}</label>
              <label className='attack-info-labels' hidden={!dosAttack.URL}>URL: {dosAttack.URL}</label>
              <label className='attack-info-labels'>Port Number: {dosAttack.portNumber}</label>
              <label className='attack-info-labels'>Method: {dosAttack.method}</label>
              <label className='attack-info-labels'>Threads: {dosAttack.threads}</label>
              <label className='attack-info-labels'>Timeout: {dosAttack.timeout}</label>
              <label className='attack-info-labels'>Speed: {dosAttack.speed}</label>
              <label className='attack-info-labels'>Wait For Reply: {String(dosAttack.waitForReply).toUpperCase()}</label>
              <label className='attack-info-labels'>Message: {dosAttack.message}</label>
            </div>
            <div className='attack-info-container' id='ph-info-container' hidden={!phishReady}>
            </div>
            <div className='attack-info-container' id='bf-info-container' hidden={!bfReady}>
            </div>
          </div>
          <div className='attack-types-container'>
            <div className='attack-select-container'>
              <h2>Choose Attack</h2>
              <select className='attack-selector-input' id="attack-type-selector" onChange={handleConfigToggle}>
                <option value="NONE"></option>
                <option value="dos-option">Denial-of-Service Attack (DoS)</option>
                <option value="bf-option">Brute Force Attack</option>
                <option value="ph-option">Phishing Attack</option>
              </select>
              <br/>
            </div>
            <div className='attack-config-container'>
              <ConfigBF isBFVisible={showBFConfig}></ConfigBF>
              <ConfigDoS isDoSVisible={showDoSConfig} sendConfig={handleDataFromDoS}></ConfigDoS>
              <ConfigPhish isPhishVisible={showPhishConfig}></ConfigPhish>
            </div>
          </div>
          </>);
}