/*
    @authors: Alex Tzonis
    @date (last updated): 3/6/2025 

    This componenet will be used to take user inputs that will be used to execute a DoS attack. 
    The inputs will be passed to LOIC. 
    
    Code is created based on a "tutorial" for LOIC. Video below...
    https://www.youtube.com/watch?v=4uEfD68BBaY&ab_channel=AlexPhillips
*/

import react, { useState } from 'react';

function ConfigDoS(props) {
    const [ipAddress, setIpAddress] = useState("");
    const [portNum, setPortNum] = useState();
    const [method, setMethod] = useState();     // can only be UDP,TCP, or NONE
    const [timeout, setTimeout] = useState();
    const [threads, setThreads] = useState(0);
    const [message, setMessage] = useState("");
    const [waitForReply, setWaitForReply] = useState();     // boolean, true or false
    const [speed, setSpeed] = useState();
    // const [attackStatus, setAttackStatus] = useState();

    const updateIpAddress = (inputAddress) => {
        setIpAddress(inputAddress);
    }

    const updatePortNumber = (inputPortNum) => {
        setPortNum(inputPortNum);
    }

    const updateMethod = (inputMethod) => {
        setMethod(inputMethod);
    }

    const updateTimeout = (inputTimeout) => {
        setTimeout(inputTimeout);
    }

    const updateThreads = (inputThreads) => {
        setThreads(inputThreads);
    }

    const updateMessage = (inputMessage) => {
        setMessage(inputMessage);
    }

    const updateWaitForReply = (inputWFR) => {
        setWaitForReply(inputWFR);
    }

    const updateSpeed = (inputSpeed) => {
        setSpeed(inputSpeed);
    }

    function checkIPAddress(inputAddress) {
        // will need to check if address is valid or not
        return true;
    }

    function checkPortNumber(inputPortNum) {
        // will need to check if port num is valid or not
        return true;
    }

    function checkThreads(inputThreads) {
        // will need to check if there is a valid number of threads
        return true;
    }

    function checkTimeout(inputTimeout) {
        // will need to check if there is a valid timeout value
        return true;
    }

    function checkSpeed(inputSpeed) {
        // will need to check if value of speed is valid
        return true;
    }

    function verifyConfig(inputAddress, inputPortNum, inputThreads, inputTimeout, inputSpeed, inputWFR, inputMethod, inputMessage) {
        a = checkIPAddress(inputAddress);
        b = checkPortNumber(inputPortNum);
        c = checkThreads(inputThreads);
        d = checkTimeout(inputTimeout);
        e = checkSpeed(inputSpeed);

        if((a === b === c === d === e === true) && inputMethod !== "")
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    function saveConfig(inputAddress, inputPortNum, inputThreads, inputTimeout, inputSpeed, inputWFR, inputMethod, inputMessage) {
        if(verifyConfig(inputAddress, inputPortNum, inputThreads, inputTimeout, inputSpeed, inputWFR, inputMethod, inputMessage))
        {
            // send config to attack sim / backend
        }
        else
        {
            // we'll inform user not all details are inputed
        }
    }


    if(props.isDoSVisible == true)
    {
        return( <>
                    <div className='DOS_Configs'>
                        <div className='dos-ip-container'>
                            <label>IP Address: </label>
                            <input type='text'></input>
                        </div>
                        <div className='dos-port-container'>
                            <label>Port Number: </label>
                            <input type='number'></input>
                        </div>
                        <div className='dos-method-container'>
                            <p>Select Method (UDP or TCP): </p>
                            <select className='method-select'>
                                <option value=""></option>
                                <option value="UDP">UDP</option>
                                <option value="TCP">TCP</option>
                            </select>
                        </div>
                        <div className='dos-timeout-container'>
                            <label>Timeout: </label>
                            <input type="text"></input>
                        </div>
                        <div className='dos-wfr-container'>
                            <lable>Wait For Reply: </lable>
                            <input type="checkbox"></input>
                        </div>
                        <div className='dos-speed-container'>
                            <label>Speed: {speed}</label>
                            <input type="number"></input>
                        </div>
                        <div className='dos-message-container'>
                            <label>Message: {message}</label>
                            <input type='text'></input>
                        </div>
                        <button className='dos-save-config' onClick={saveConfig}>Save Config</button>
                    </div>
                </>
        );
    }
}

export default ConfigDoS