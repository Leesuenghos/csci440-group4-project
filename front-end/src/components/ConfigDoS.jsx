/*
    @authors: Alex Tzonis
    @date (last updated): 4/12/2025 

    This componenet will be used to take user inputs that will be used to execute a DoS attack. 
    The inputs will be passed to LOIC. 
    
    Code is created based on a "tutorial" for LOIC. Video below...
    https://www.youtube.com/watch?v=4uEfD68BBaY&ab_channel=AlexPhillips
*/

import react, { useState } from 'react';

function ConfigDoS(props) {
    const [targetURL,setTargetURL] = useState("");  // stores target URL
    const [ipAddress, setIpAddress] = useState(""); // stores ip address
    const [portNum, setPortNum] = useState();       // stores port num
    const [method, setMethod] = useState();         // stores method (can only be UDP,TCP, or NONE)
    const [timeout, setTimeout] = useState();       // stores timeout
    const [threads, setThreads] = useState(0);      // stores threads
    const [message, setMessage] = useState("");     // stores message
    const [waitForReply, setWaitForReply] = useState(false);        // stores WFR (boolean)
    const [speed, setSpeed] = useState();           // stores speed
    const [targetLockIP, setTargetLockIP] = useState(false);        // if IP is locked in       
    const [targetLockURL, setTargetLockURL] = useState(false);      // if URL is locked in
    const [fullTargetLock, setFullTargetLock] = useState(false);    // if all config values are inputted and valid
    // const [attackStatus, setAttackStatus] = useState();

    // click-handling functions
    const handleLockIPTarget = () => lockIPTarget();    // handles clicks for Lock IP button
    const handleLockURLTarget = () => lockURLTarget();  // handles clicks for Lock URL button
    const handleLockFullConfig = () => lockFullConfig();  // handles clicks for Lock Config Button
    function handleMethodChange(event) { updateMethod(event.target.value); }    // handles method changes

    // setter/update functions
    const updateTargetURL = (inputURL) => { setTargetURL(inputURL); }           // updates targetURL
    const updateIpAddress = (inputAddress) => { setIpAddress(inputAddress); }   // updates ipAddress
    const updatePortNumber = (inputPortNum) => { setPortNum(inputPortNum); }    // updates portNum
    const updateMethod = (inputMethod) => { setMethod(inputMethod); }           // updates method
    const updateTimeout = (inputTimeout) => { setTimeout(inputTimeout); }       // updates timeout
    const updateThreads = (inputThreads) => { setThreads(inputThreads); }       // updates threads
    const updateMessage = (inputMessage) => { setMessage(inputMessage); }       // updates message
    const updateWaitForReply = (inputWFR) => { setWaitForReply(inputWFR); }     // updates waitForReply
    const updateSpeed = (inputSpeed) => { setSpeed(inputSpeed); }               // updates speed
    const updateTargetLockIP = () => { setTargetLockIP(!targetLockIP); }        // updates targetLockIP
    const updateTargetLockURL = () => { setTargetLockURL(!targetLockURL); }     // updates targetLockURL
    const updateFullTargetLock = () => { setFullTargetLock(!fullTargetLock); }        // updates fullTargetLock

    // checking/validation functions
    function checkTargetURL(inputURL) {
        // will need to check if URL is valid or not
        return true;
    }

    function checkIPAddress(inputAddress) {
        // will need to check if address is valid or not
        return true;
    }

    // checks if port number is valid
    function checkPortNumber(inputPortNum) {
        if(isNaN(inputPortNum)) {
            return false;
        }
        else {
            // check if valid port number
            // may need to differentiate between ephemeral and non-ephemeral port numbers
            return true;
        }
    }

    // checks if threads is a valid number
    function checkThreads(inputThreads) {
        if(isNaN(inputThreads)) {
            return false;
        }
        else {
            // too small or too large
            if (inputThreads < 1 || inputThreads > 10) {
                return false;
            }
            else {
                return true;
            }
        }
    }

    function checkTimeout(inputTimeout) {
        // will need to check if there is a valid timeout value
        return true;
    }

    function checkSpeed(inputSpeed) {
        // will need to check if value of speed is valid
        return true;
    }

    function checkMessage(message) {
        // will need to check if string for message is valid
        return true;
    }

    function checkMethod(method) {
        // if method is UDP or TCP, return true
        // else, return false
        if(method === 'UDP' || method === 'TCP') {
            return true;
        }
        else {
            return false;
        }
    }

    function lockIPTarget() {
        const ipInput = document.getElementById('ip-input').value.trim();   // store inputted IP

        // if IP is locked on -> user wants to unlock, trigger statements
        if(targetLockIP) {
            updateTargetLockIP();   // set targetLockIP to false
            enableIPURLFields();    // enable text fields
            document.getElementById('dos-lock-url').disabled = false;   // unlock url button
            document.getElementById('dos-lock-ip').textContent = "Lock IP"; // change unlock ip button => lock ip button
        }
        // else user is locking on
        else {
            // if IP address is valid
            if(checkIPAddress(ipInput)) {
                updateIpAddress(ipInput);
                updateTargetLockIP();   // set targetLockIP to true
                disableIPURLFields();   // lock out IP and URL fields
                document.getElementById('url-input').value = "";    // clear URL field
                document.getElementById('dos-lock-url').disabled = true;    // lock url button
                document.getElementById('dos-lock-ip').textContent = "Unlock IP";   // change lock ip button => unlock ip button
            }
            // else IP address invalid
            else {
                // inform user somehow
            }
        }
    }

    function lockURLTarget() {
        const urlInput = document.getElementById('url-input').value.trim(); // store inputted URL

        // if isDisabled is true -> user wants to unlock, trigger statements
        if(targetLockURL) {
            enableIPURLFields();    // enable text fields
            updateTargetLockURL();  // set targetLockURL to false
            document.getElementById('dos-lock-ip').disabled = false;    // unlock ip button
            document.getElementById('dos-lock-url').textContent = "Lock URL";   // change unlock url button => lock url button
        }
        else {
            if(checkTargetURL(urlInput)) {
                updateTargetURL(urlInput); // update URL
                updateTargetLockURL();  // set targetLockURL to true
                disableIPURLFields();   // lock out IP and URL fields
                document.getElementById('ip-input').value = "";         // clear IP field
                document.getElementById('dos-lock-ip').disabled = true; // lock ip button
                document.getElementById('dos-lock-url').textContent = "Unlock URL";  // change unlock url button => lock url button
            }
            else {
                // invalid URL
                // inform user somehow
            }
        }

    }

    function disableIPURLFields() {
        document.getElementById('ip-input').disabled = true;    // lock out IP field
        document.getElementById('url-input').disabled = true;   // lock out URL field
    }

    function enableIPURLFields() {
        document.getElementById('ip-input').disabled = false;    // lock out IP field
        document.getElementById('url-input').disabled = false;   // lock out URL field
    }

    function lockFullConfig() {
        const messageValue = document.getElementById('message-input').value;
        const methodValue = document.getElementById('method-input').value;
        const portNumValue = document.getElementById('port-input').value;
        const speedValue = document.getElementById('speed-input').value;
        const threadsValue = document.getElementById('threads-input').value;
        const timeoutValue = document.getElementById('timeout-input').value;

        // user wants to unlock fullTargetLock
        if (fullTargetLock) {
            unlockInputFields();
            updateFullTargetLock();
        }
        // else if targetLockIP and targetLockURL are both equal to each other -> 
        // not target lock or error, can't establish full lock, inform user
        else if(targetLockIP === targetLockURL) {
            // placeholder
        }
        // else, valid target lock on either IP or URL -> good to go
        else {
            // if all other parameters are valid, lock full config
            if(verifyConfigElements(messageValue, methodValue, portNumValue, speedValue, threadsValue, timeoutValue))
            {
                lockInputFields();
                updateFullTargetLock();
            }
            // else, invalid configuration -> do nothing
            else {
    
            }
        }
    }

    // verifies DOS configuration is valid
    function verifyConfigElements(message, method, portNum, speed, threads, timeout) {
        const validMessage = checkMessage(message);       // check message
        const validMethod = checkMethod(method);          // check method
        const validPortNum = checkPortNumber(portNum);    // check port number
        const validSpeed = checkSpeed(speed);             // check speed
        const validThreads = checkThreads(threads);       // check threads
        const validTimeout = checkTimeout(timeout);       // checks timeout
        
        console.log("attempting to verify");
        if(validMessage && validMethod && validPortNum && validSpeed && validThreads && validTimeout) {
            console.log('All valid');
            return true;
        }
        else {
            console.log('Not all valid');
            console.log("Message " + validMessage);
            console.log("Method " + validMethod);
            console.log("Port Num " + validPortNum);
            console.log("Speed " + validSpeed);
            console.log("Threads " + validThreads);
            console.log("Timeout " + validTimeout);
            // dos configuration is invalid
            return false;
        }
    }

    // locks all input fields
    // also disables button for unlocking URL or unlocking IP (whichever is currently enabled)
    function lockInputFields() {
        document.getElementById('message-input').disabled = true;
        document.getElementById('method-input').disabled = true;
        document.getElementById('port-input').disabled = true;
        document.getElementById('speed-input').disabled = true;
        document.getElementById('threads-input').disabled = true;
        document.getElementById('timeout-input').disabled = true;
        document.getElementById('wfr-input').disabled = true;

        if(targetLockIP) {
            document.getElementById('dos-lock-ip').disabled = true;
        }
        else if(targetLockURL) {
            document.getElementById('dos-lock-url').disabled = true;
        }

        document.getElementById('dos-lock-config').disabled = false;
        document.getElementById('dos-lock-config').textContent = "Unlock Config";
    }

    // unlocks all input fields exceot for IP & URL
    function unlockInputFields() {
        document.getElementById('message-input').disabled = false;
        document.getElementById('method-input').disabled = false;
        document.getElementById('port-input').disabled = false;
        document.getElementById('speed-input').disabled = false;
        document.getElementById('threads-input').disabled = false;
        document.getElementById('timeout-input').disabled = false;
        document.getElementById('wfr-input').disabled = false;

        if(targetLockIP) {
            document.getElementById('dos-lock-ip').disabled = false;
        }
        else if(targetLockURL) {
            document.getElementById('dos-lock-url').disabled = false;
        }

        document.getElementById('dos-lock-config').disabled = false;
        document.getElementById('dos-lock-config').textContent = "Lock Config";
    }

    if(props.isDoSVisible == true)
    {
        return( <>  
                    <div className='DOS_Configs'>
                        <form>
                            <div className='dos-input-container'>
                                <label>Target URL: </label>
                                <input type='text' id='url-input'></input>
                            </div>
                            <button className='dos-button-locks' id='dos-lock-url' onClick={handleLockURLTarget}>Lock URL</button>
                            <div className='dos-input-container'>
                                <label>IP Address: </label>
                                <input type='text' id='ip-input'></input>
                            </div>
                            <button className='dos-button-locks' id='dos-lock-ip' onClick={handleLockIPTarget}>Lock IP</button>
                            <div className='dos-input-container'>
                                <label>Port Number: </label>
                                <input type='number' id='port-input'></input>
                            </div>
                            <div className='dos-select-container'>
                                <label>Select Method (UDP or TCP): </label>
                                <select id='method-input' onChange={handleMethodChange}>
                                    <option value="none"></option>
                                    <option value="UDP">UDP</option>
                                    <option value="TCP">TCP</option>
                                </select>
                            </div>
                            <div className='dos-input-container'>
                                <label>Threads: </label>
                                <input type='number' id='threads-input'></input>
                            </div>
                            <div className='dos-input-container'>
                                <label>Timeout: </label>
                                <input type="text" id='timeout-input'></input>
                            </div>
                            <div className='dos-input-container'>
                                <label>Wait For Reply: </label>
                                <input type="checkbox" id='wfr-input'></input>
                            </div>
                            <div className='dos-input-container'>
                                <label>Speed: {speed}</label>
                                <input type="number" id='speed-input'></input>
                            </div>
                            <div className='dos-input-container'>
                                <label>Message: {message}</label>
                                <input type='text' id='message-input'></input>
                            </div>
                            <button className='dos-button-locks' id='dos-lock-config' onClick={handleLockFullConfig}>Lock Config</button>
                        </form>
                    </div>
                </>
        );
    }
}

export default ConfigDoS