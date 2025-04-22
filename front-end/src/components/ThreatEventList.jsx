import useWebSocket from "../hooks/useWebSocket";

function ThreatEventList() {
  const events = useWebSocket("ws://localhost:4000/threat-events");

  return (
    <div>
      <h2>Threat Events</h2>
      <ul>
        {events
          ? events.map((event, index) => (
            <li key={index}>
              {event.type} - {event.ip} ({event.event_time.toLocaleString()})
            </li>
          ))
          : "Waiting for events..."}
      </ul>
    </div>
  );
}

export default ThreatEventList;
