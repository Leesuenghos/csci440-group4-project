
/*
    @authors: Alex Tzonis
    @date (last updated): 4/20/2025

    This componenet will be used to take user inputs that will be used to execute a Phishing attack.

    Idea/Workflow: 
    * Prompt the user for target email, subject, and message
    * We will send a phishing email with the inputs to the inputed target email
    * 
    * Below is a link of metasploit documentation for setting up a phishing campaign
    * https://docs.rapid7.com/metasploit/create-a-new-campaign/
*/

import { useState } from "react"

function ConfigPhish(props) {
  const [targetList, setTargetList] = useState([]); // object array, each object holds an email, first name, and last name
  const [subject, setSubject] = useState("");   // holds subject line of email
  const [fromAddress, setFromAddress] = useState(""); // holds address recipients will see
  const [fromName, setFromName] = useState("");       // holds the name recipients will see
  const [doNotAddTracking, setDoNotAddTracking] = useState(false);  // If true, emails that are opened will not be tracked.
  const [emailContent, setEmailContent] = useState("");   // holds message sent in the body of the email
  const [listLock, setListLock] = useState(false);
  const [emailSettingsLock, setEmailSettingsLock] = useState(false);
  const [fullTargetLock, setFullTargetLock] = useState(false);    // if all config values are inputted and valid
  const [phishAdded, setPhishAdded] = useState(false);    // for knowing if phish attack has been added to the simulation


  // setter/updater functions
  const updateSubject = (inputSubject) => { setSubject(inputSubject); }
  const updateFromAddress = (inputAddress) => { setFromAddress(inputAddress); }
  const updateFromName = (inputAddress) => { setFromName(inputAddress); }
  const enableDoNotAddTracking = () => { setDoNotAddTracking(true); }
  const disableDoNotAddTracking = () => { setDoNotAddTracking(false); }
  const enablePhishAdded = () => { setPhishAdded(true); }
  const disablePhishAdded = () => { setPhishAdded(false); }
  const enableListLock = () => { setListLock(true); }
  const disableListLock = () => { setListLock(false); }
  const enableEmailSettingsLock = () => { setEmailSettingsLock(true); }
  const disableEmailSettingsLock = () => { setEmailSettingsLock(false); }
  const updateEmailContent = (inputContent) => { setEmailContent(inputContent); }

  // click-handling functions
  const handleEmailSettingsLock = () => lockEmailSettings();  // handles clicks for the lock email settings button
  const handleLockTargetList = () => lockTargetList();    // handles clicks for the lock target list button
  const handleAddTarget = () => addTarget();    // handles clicks for the add target button
  const handleRemoveTarget = (index) => removeTarget(index);  // handles clicks for removing targets from target list


  // handles adding a target to the target list
  function addTarget() {
    const newEmail = document.getElementById('ph-email-input').value.trim();
    const newFName = document.getElementById('ph-firstName-input').value.trim();
    const newLName = document.getElementById('ph-lastName-input').value.trim();

    // if user didn't enter names or entered an invalid email
    if(!checkEmail(newEmail) || !newFName || !newLName) {
      // inform user which one is incorrect
    }
    else if(targetList.length === 0) {
      clearTargetInputValues();   // remove entered values
      setTargetList(targetList => [...targetList, {email: newEmail, fName: newFName, lName: newLName}]);  // add target
    }
    else {
      // determine location of object where email matches user input
      // checkIndex will be -1 if no such object exists
      const checkIndex = targetList.findIndex(object => object.email === newEmail); 

      // if email has not been found in targetList
      if(checkIndex === -1) {
        clearTargetInputValues();   // remove entered values
        setTargetList(targetList => [...targetList, {email: newEmail, fName: newFName, lName: newLName}]);  // add target
      }
      // else target already exists
      else {
        // do nothing, inform user
        // console.log('email already in list');
      }
    }
  }

  function clearTargetInputValues() {
    // remove entered values
    document.getElementById('ph-email-input').value = "";
    document.getElementById('ph-firstName-input').value = "";
    document.getElementById('ph-lastName-input').value = "";
  }

  // handles removing a target from target list
  function removeTarget(index) 
  {
    // if target lock is on, don't remove target (listlock will never be true when this functions runs -> this is just in case)
    if(!listLock) {
    // filter targetList based on the given index then store filtered list into targetList
    setTargetList(targetList.filter((element, i) => i !== index));
    }
  }

  function lockTargetList() {
    // if target list is already locked, unlock
    if(listLock) {
      document.getElementById('ph-addTarget-button').disabled = false;// unlock add target button
      document.getElementById('ph-lock-list-button').textContent="Lock Target List"// change text on lock target list button
      revealDeleteTargetButtons();  // allow user to remove targets from table
      disableListLock(); // update list lock to false
      enableAddTargetInputs(); // enable inputs for adding a new target
    }
    // else if target list is unlocked and target list is not empty
    else if (!listLock && targetList.length > 0){
      document.getElementById('ph-addTarget-button').disabled = true; // lock add target button
      document.getElementById('ph-lock-list-button').textContent="Unlock Target List" // change text on lock target list button
      hideDeleteTargetButtons();  // prevent user from removing targets from table
      enableListLock(); // update list lock to false
      disableAddTargetInputs(); // disable inputs for adding a new target
    }
    // else target list is unlocked but target list is empty -> do nothing
    else {

    }
  }

  function disableAddTargetInputs() {
    document.getElementById('ph-email-input').disabled = true;
    document.getElementById('ph-firstName-input').disabled = true;
    document.getElementById('ph-lastName-input').disabled = true;
  }

  function enableAddTargetInputs() {
    document.getElementById('ph-email-input').disabled = false;
    document.getElementById('ph-firstName-input').disabled = false;
    document.getElementById('ph-lastName-input').disabled = false;
  }

  // responsible for hiding the delete target buttons on the target table
  function hideDeleteTargetButtons() {
    const numOfButtons = document.getElementsByClassName('ph-delete-target').length;  // store number of delete buttons for for loop

    // for each delete button, set their hidden property to true (hide them)
    for (let i = 0; i < numOfButtons; i++) {
      document.getElementsByClassName('ph-delete-target')[i].hidden=true;
    }
  }

  // responsible for revealing the delete target buttons on the target table
  function revealDeleteTargetButtons() {
    const numOfButtons = document.getElementsByClassName('ph-delete-target').length;  // store number of delete buttons for for loop

    // for each delete button, set their hidden property to false (unhide them)
    for (let i = 0; i < numOfButtons; i++) {
      document.getElementsByClassName('ph-delete-target')[i].hidden=false;
    }
  }

  function lockEmailSettings() {
    // if email settings are locked -> user wants to unlock
    if(emailSettingsLock) {
      enableInputSettingsFields();
      document.getElementById('ph-lock-settings').textContent='Lock Email Settings';
      disableEmailSettingsLock();
    }
    // else -> user wants to lock; let's verify if there are valid inputs
    else {
      const inputSubject = document.getElementById('ph-subject-input').value.trim();          // stores inputted subject
      const inputFromAddress = document.getElementById('ph-fromAddress-input').value.trim();  // stores inputted fromAddress
      const inputFromName = document.getElementById('ph-fromName-input').value.trim();        // stores inputted fromName
      const inputDoNotTrack = document.getElementById('addTrack-input').value.trim();         // stores inputted Do No Track
      const inputEmailContent = document.getElementById('message-input-ta').value.trim();     // stores inputted email content

      // if true, all valid inputs
      if(verifyEmailSettings(inputSubject, inputFromAddress, inputFromName, inputEmailContent))
        {
          disableInputSettingsFields();   // lock relevant input fields
          document.getElementById('ph-lock-settings').textContent='Unlock Email Settings';  // change text of lock button -> now unlock button
          enableEmailSettingsLock();    // set the email settings lock to true
          updateSubject(inputSubject);
          updateFromAddress(inputFromAddress);
          updateFromName(inputFromName);
          updateEmailContent(inputEmailContent);
          if(inputDoNotTrack) {
            enableDoNotAddTracking();
          }
          else {
            disableDoNotAddTracking();
          }
        }
    }
  }

  function verifyEmailSettings(inputSubject, inputFromAddress, inputFromName, inputEmailContent) {
    const validInputSubject = checkSubject(inputSubject);
    const validFromAddress = checkFromAddress(inputFromAddress);
    const validFromName = checkFromName(inputFromName);
    const validEmailContent = checkEmailContent(inputEmailContent);

    if(!validInputSubject) {
      // inform user
      return false;
    }
    else if(!validFromAddress) {
      // inform user
      return false;
    }
    else if(!validFromName) {
      // inform user
      return false;
    }
    else if(!validEmailContent) {
      // inform user
      return false;
    }
    // else, all inputs are valid
    else {
      return true;
    }
  }

  function disableInputSettingsFields() {
    document.getElementById('ph-subject-input').disabled=true;
    document.getElementById('ph-fromAddress-input').disabled=true;
    document.getElementById('ph-fromName-input').disabled=true;
    document.getElementById('addTrack-input').disabled=true;
    document.getElementById('message-input-ta').disabled=true;
  }

  function enableInputSettingsFields() {
    document.getElementById('ph-subject-input').disabled=false;
    document.getElementById('ph-fromAddress-input').disabled=false;
    document.getElementById('ph-fromName-input').disabled=false;
    document.getElementById('addTrack-input').disabled=false;
    document.getElementById('message-input-ta').disabled=false;
  }

  // checks if entered email meets the criteria for a valid email address
  function checkEmail(inputEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(inputEmail); // return true if inputEmail matches the regex pattern
  }

  function checkFromAddress(inputEmail) {
    if(checkEmail(inputEmail))
    {
      return true;
    }
    else {
      return false;
    }
  }

  function checkFromName(inputName) {
    // if not an empty string, return true - else, return false
    if(inputName) {
      return true;
    }
    else {
      return false;
    }
  }

  function checkSubject(inputSubject) {
    // if not an empty string, return true - else, return false
    if(inputSubject) {
      return true;
    }
    else {
      return false;
    }    
  }

  function checkEmailContent(inputEmailContent) {
    // if not an empty string, return true - else, return false
    if(inputEmailContent) {
      return true;
    }
    else {
      return false;
    }
  }

  const handleSendConfig = (event) => {
    // full target lock is established and phish attack hasn't been added, send data
    if (listLock && emailSettingsLock && !phishAdded) {
        props.sendPhishConfig(subject, targetList, fromAddress, fromName, doNotAddTracking, emailContent, !phishAdded);
        document.getElementById('ph-addConfig-button').textContent = 'Remove Phishing Configuration from Simulation'
        document.getElementById('ph-lock-list-button').disabled = true;
        document.getElementById('ph-lock-settings').disabled = true;
        enablePhishAdded();
    }
    // full target lock is established and phish attack is alread added, user wants to remove attack
    else if (listLock && emailSettingsLock && phishAdded){
        props.sendPhishConfig('', [], '', '', false, '', !phishAdded);
        document.getElementById('ph-addConfig-button').textContent = 'Add Phishing Configuration to Simulation'
        document.getElementById('ph-lock-list-button').disabled = false;
        document.getElementById('ph-lock-settings').disabled = false;
        disablePhishAdded();
    }
}

  if (props.isPhishVisible == true)
  {
    return( <>
              <div className="phish-configs">
                <div id='phish-email-settings'>
                  <h2>Email Settings</h2>
                  <div className="ph-input-container" id="ph-subject-container">
                    <label>Subject</label>
                    <input type="text" id='ph-subject-input'></input>
                  </div>
                  <div className="ph-input-container" id="ph-fromAddress-container">
                    <label>From Address</label>
                    <input type="text" id='ph-fromAddress-input'></input>
                  </div>
                  <div className="ph-input-container" id="ph-fromName-container">
                    <label>From Name</label>
                    <input type="text" id='ph-fromName-input'></input>
                  </div>
                  <div className="ph-input-container" id="ph-addTrack-container">
                    <label>Do NOT add tracking</label>
                    <input type="checkbox" id='addTrack-input'></input>
                  </div>                
                  <div className="ph-input-container" id="ph-message-container">
                    <textarea id='message-input-ta' cols="40" rows="10" placeholder="Add body of email..."></textarea>
                  </div>
                  <button className="ph-input-button" id='ph-lock-settings' onClick={handleEmailSettingsLock}>Lock Email Settings</button>
                </div>
                <div id='ph-email-list-container'>
                  <h2>Email List</h2>
                  <div className="ph-input-container" id="ph-email-container">
                    <label>Target Email 
                      <input type="text" className='ph-target-inputFields' id='ph-email-input'></input> 
                    </label>
                    <label>First Name
                      <input type="text" className='ph-target-inputFields' id='ph-firstName-input'></input>
                    </label>
                    <label>Last Name
                      <input type="text" className='ph-target-inputFields' id='ph-lastName-input'></input>
                    </label>
                    <button className='ph-target-inputButton' id='ph-addTarget-button' onClick={handleAddTarget}>Add Target</button>
                    <button className='ph-target-inputButton' id='ph-lock-list-button' onClick={handleLockTargetList}>Lock Target List</button>
                  </div>
                  <div id='ph-targetTable-container'>
                    <table>
                      <thead>
                        <tr>
                          <th width='40%'>Email</th>
                          <th width='25%'>First Name</th>
                          <th width='25%'>Last Name</th>
                          <th width='10%'>Delete Control</th>
                        </tr>
                      </thead>
                      <tbody id='ph-table-body'>
                        {targetList.map((target, index) => (
                          <tr key={index}>
                            <td width='40%'>{target.email}</td>
                            <td width='25%'>{target.fName}</td>
                            <td width='25%'>{target.lName}</td>
                            <td width='10%' className='ph-delete-target' onClick={() => handleRemoveTarget(index)}>DELETE</td>
                          </tr>
                        ))}                     
                      </tbody>
                    </table>
                  </div> 
                  <button className="ph-input-button" id='ph-addConfig-button' disabled={!listLock || !emailSettingsLock} onClick={handleSendConfig}>
                    Add Phishing Configuration to Simulation
                  </button>
                </div>
              </div>             
            </>)
  }
}

export default ConfigPhish