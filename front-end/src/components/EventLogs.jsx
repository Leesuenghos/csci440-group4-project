
/*
@authors: Alex Tzonis
*/ 

function EventLogs(){
  // holds all the events retreived from the backend
  const threatEvents = [];

  // array for testing, will be deleted
  const testThreatEvents = ["Test 1", "Test 2", "Test 3"];

  // holds the threat events but maps everything into the list
  const eventList = testThreatEvents.map(threatEvent => <li>{threatEvent}</li>)

  function filterTable() {
      // will take table contents and filter them
      // will also send how contents will be filtered (IP address, port number, attack type, priority, etc.)
  }

  function sortTable() {
      // will send table contents to backend to be sorted
      // will also send how contents will be sorted (IP address, port number, attack type, priority, etc.)
  }

  return( <>
              <h1>Event Logs</h1>
              <div className="event-table-container">
                  <table className='event-table'>
                      <tr>
                          <th>Priority</th>
                          <th>Event Type</th>
                          <th>IP Address</th>
                          <th>Port Number</th>
                          <th>Time Occured</th>
                      </tr>
                      <tr>
                      </tr>
                  </table>
              </div>
          </>);
}

export default EventLogs

