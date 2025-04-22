
/*
    @authors: Alex Tzonis
    @date (last updated): 4/20/2025 
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

  const [phishAttack, setPhishAttack] = useState({
    targets: [],
    subject: '',
    fromAddress: '',
    fromName: '',
    dontAddTracking: false,
    message: ''
  });

  // click-handling functions
  const handleLaunchAttack = () => launchAttack();    // handles clicks for execute sim buttion
  const handlePauseAttack = () => pauseAttack();      // handles clicks for pause sim button
  const handleStopAttack = () => stopAttack();        // handles clicks for stop sim button

  // responsible for "retrieving" passed values from ConfigDoS
  const handleDataFromDoS = (targetURL, ipAddress, message, method, portNum, speed, threads, timeout, waitForReply, addingDos) => {
    // update dosAttack with new values
    updateDoSAttack(targetURL, ipAddress, message, method, portNum, speed, threads, timeout, waitForReply);
    if (addingDos) {
      enableDoSReady(); // if the user is adding the attack, set dosReady to true
    }
    else {
      disableDoSReady();  // else, the user is removing the attack, set dosReady to false
    }
  }

  // updates the values of dosAttack
  const updateDoSAttack = (targetURL, ipAddress, message, method, portNum, speed, threads, timeout, waitForReply) => {
    setDoSAttack({
      URL: targetURL, IP: ipAddress, message: message, method: method,
      portNumber: portNum, speed: speed, threads: threads, timeout: timeout, waitForReply: waitForReply
    });
  }

  // responsible for "retrieving" passed values from ConfigPhish
  const handlePhishConfig = (subject, targetList, fromAddress, fromName, doNotAddTracking, emailContent, addingPhish) => {
    savePhishConfig(subject, targetList, fromAddress, fromName, doNotAddTracking, emailContent, addingPhish);
  }

  function savePhishConfig(subject, targetList, fromAddress, fromName, doNotAddTracking, emailContent, addingPhish) {
    updatePhishAttack(subject, targetList, fromAddress, fromName, doNotAddTracking, emailContent);
    if (addingPhish) {
      enablePhishReady();   // if the user is adding the attack, set phishReady to true
    }
    else {
      disablePhishReady();  // else, the user is removing the attack, set phishReady to false
    }
  }

  function updatePhishAttack(subject, targetList, fromAddress, fromName, doNotAddTracking, emailContent) {
    setPhishAttack({
      subject: subject, targets: targetList, fromAddress: fromAddress, fromName: fromName,
      dontAddTracking: doNotAddTracking, message: emailContent
    });

    /*
    for (let i=0; i<targetList.length;i++) {
      console.log(targetList[i])
    }
    */
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

  const enablePhishReady = () => {
    setPhishReady(true);
  }

  const disablePhishReady = () => {
    setPhishReady(false);
  }


  const changeAttackStatus = (optionString) => {
    if (optionString === "RUNNING") { setAttackStatus(optionString); }
    else if (option === "IDLE") { setAttackStatus(optionString); }
    else if (optionString === "PAUSED") { setAttackStatus(optionString); }
    else { }// invalid attack status 
  }

  function launchAttack() {
    // determine which attack to launch
    // checks if the attack is ready, if true, grab info to launch attack, else: move on to next attack
    if (currentConfig === "dos-option" && dosReady) {
      changeAttackStatus("RUNNING");  // change attack status to running
      launchDoSAttack();

    }
    else if (currentConfig === "ph-option" && phishReady) {
      changeAttackStatus("RUNNING");  // change attack status to running
      launchPhAttack();
    }
    else if (currentConfig === "bf-option" && bfReady) {
      changeAttackStatus("RUNNING");  // change attack status to running
      // launch brute force attack 
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
    if (attackStatus === "IDLE") {
      // start attack
      changeAttackStatus("RUNNING");
    }
    // else, can't accept input if already running or paused
  }

  function launchPhAttack() {
    /*
    below are the values to launch the dos attack
    no need for validating the values
    no need to check if the attack should be ran in this function

    phishAttack.subject
    phishAttack.fromAddress
    phishAttack.fromName
    phishAttack.dontAddTracking
    phishAttack.message
    phishAttack.targets

    phishAttack.targets is a 3d array; format -> phishAttack.targets[i] -> one target with email, fName, and lName

    the for loop below can be used to print all of the targets array
    console.log(phishAttack.targets.length);
    for(let i=0;i<phishAttack.targets.length;i++) {
      console.log(String(i) + ". Email: " + phishAttack.targets[i].email);
      console.log(String(i) + ". First Name: " + phishAttack.targets[i].fName);
      console.log(String(i) + ". Last Name:" + phishAttack.targets[i].lName);
    }
    */

    // if attack is idle (hasn't started)
    if (attackStatus === "IDLE") {
      // start attack
      changeAttackStatus("RUNNING");
    }
    // else, can't accept input if already running or paused
  }

  function launchBFAttack() {


    // if attack is idle (hasn't started)
    if (attackStatus === "IDLE") {
      // start attack
      changeAttackStatus("RUNNING");
    }
    // else, can't accept input if already running or paused
  }

  function pauseAttack() {
    // if attack is currently running, able to pause attack, else: nothing happens
    if (attackStatus === "RUNNING") {
      // no option to pause a phish attacking because it can't be paused
      if (currentConfig === "dos-option") {
        pauseDoSAttack();
        changeAttackStatus("PAUSED");
      }
      else if (currentConfig === "bf-option") {
        pauseBFAttack();
        changeAttackStatus("PAUSED");
      }
      else {
        // no attack to pause
      }
    }
  }

  function pauseDoSAttack() {
    // pseudocode to pause DoS attack
  }

  function pauseBFAttack() {
    // pseudocode to pause BF attack
  }

  function stopAttack() {
    // if attack is currently running, able to stop attack, else: nothing happens
    if (attackStatus === "RUNNING") {
      // no option to stop a phish attacking because it can't be stopped
      if (currentConfig === "dos-option") {
        stopDoSAttack();
        changeAttackStatus("IDLE");
      }
      else if (currentConfig === "bf-option") {
        stopBFAttack();
        changeAttackStatus("IDLE");
      }
      // pseudocode to stop attack
    }
  }

  function stopBFAttack() {
    // pseudocode to stop brute force attack
  }

  function stopDoSAttack() {
    // pseudocode to stop DoS attack
  }

  function toggleOffCurrentConfig(currentConfigValue) {
    if (currentConfigValue === "dos-option") {
      toggleDoSConfig("NONE");
    }
    else if (currentConfigValue === "bg-option") {
      toggleBFConfig("NONE");
    }
    else if (currentConfigValue === "ph-option") {
      togglePhishConfig("NONE");
    }
  }

  function toggleNewConfig(targetValue) {
    if (targetValue === "dos-option") {
      toggleDoSConfig(targetValue);
    }
    else if (targetValue === "bf-option") {
      toggleBFConfig(targetValue);
    }
    else if (targetValue === "ph-option") {
      togglePhishConfig(targetValue);
    }
  }

  function handleConfigToggle(event) {
    if (event.target.value === currentConfig) {
      // user chose the same option so don't change anything
    }
    // user chose the empty section
    else if (event.target.value === "NONE") {
      toggleOffCurrentConfig(currentConfig);
    }
    // user chose new config
    else {
      toggleOffCurrentConfig(currentConfig);
      toggleNewConfig(event.target.value);
    }
  }

  return (<>
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
        <label className='attack-info-labels'>Subject: {phishAttack.subject}</label>
        <label className='attack-info-labels'>From Address: {phishAttack.fromAddress}</label>
        <label className='attack-info-labels'>From Name: {phishAttack.fromName}</label>
        <label className='attack-info-labels'>Do NOT Add Tracking: {String(phishAttack.dontAddTracking).toUpperCase()}</label>
      </div>
      <div className='attack-info-container' id='bf-info-container' hidden={!bfReady}>
      </div>
    </div>
    <div className='attack-types-container'>
      <div className='attack-select-container'>
        <h2>Choose Attack</h2>
        <select className='attack-selector-input' id="attack-type-selector"
          disabled={dosReady || phishReady || bfReady} onChange={handleConfigToggle}>
          <option value="NONE"></option>
          <option value="dos-option">Denial-of-Service Attack (DoS)</option>
          <option value="bf-option">Brute Force Attack</option>
          <option value="ph-option">Phishing Attack</option>
        </select>
        <br />
      </div>
      <div className='attack-config-container'>
        <ConfigBF isBFVisible={showBFConfig}></ConfigBF>
        <ConfigDoS isDoSVisible={showDoSConfig} sendDoSConfig={handleDataFromDoS}></ConfigDoS>
        <ConfigPhish isPhishVisible={showPhishConfig} sendPhishConfig={handlePhishConfig}></ConfigPhish>
      </div>
    </div>
  </>);
}