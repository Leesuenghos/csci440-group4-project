
/*
    @authors: Alex Tzonis
    @date (last updated): 18

    This componenet will be used to take user inputs that will be used to execute a Phishing attack.

    Idea/Workflow: 
    * Prompt the user for target email, subject, and message
    * We will send a phishing email with the inputs to the inputed target email
*/

import { useState } from "react"

function ConfigPhish(props) {
  // may change email to be an array of strings (to send email to multiple targets) but this is probably unneeded for the project
  const [email, setEmail] = useState("");       // holds the target email
  const [subject, setSubject] = useState("");   // holds subject line of email
  const [message, setMessage] = useState("");   // holds message sent in the body of the email

  // holds the link embedded in the email that we want the user to access ; will be added to message before transmission
  // currently set to rick roll the poor victim
  const [link, setLink] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=RickAstley"); 

  if (props.isPhishVisible == true)
  {
    return( <>
              <div className="phish-configs">
                <div className="ph-email-container">
                  <label>Target Email</label>
                  <input type="text"></input>
                </div>
                <div className="ph-subject-container">
                  <label>Subject</label>
                  <input type="text"></input>
                </div>
                <div className="ph-message-container">
                  <label>Message</label>
                  <input type="text"></input>
                </div>
              </div>
            </>)
  }
}

export default ConfigPhish