
/*
@authors: Alex Tzonis
*/ 

import { useState } from "react";

function EventLogs() {
  const [events, setEvents] = useState([
    { type: "DDoS", ip: "192.168.1.1", timestamp: "2025-03-20 10:00" },
    { type: "Phishing", ip: "192.168.1.2", timestamp: "2025-03-20 10:05" },
    { type: "Malware", ip: "192.168.1.3", timestamp: "2025-03-20 10:10" }
  ]);

  const [filterType, setFilterType] = useState("");
  const [sortBy, setSortBy] = useState("");

  const filteredEvents = events.filter((event) =>
    filterType ? event.type === filterType : true
  );

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === "time") return new Date(a.timestamp) - new Date(b.timestamp);
    if (sortBy === "type") return a.type.localeCompare(b.type);
    return 0;
  });

  return (
    <div>
      <h2>Event Logs</h2>

      <div>
        <label>Filter by Type:</label>
        <select onChange={(e) => setFilterType(e.target.value)}>
          <option value="">All</option>
          <option value="DDoS">DDoS</option>
          <option value="Phishing">Phishing</option>
          <option value="Malware">Malware</option>
        </select>

        <label>Sort by:</label>
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="">None</option>
          <option value="time">Time</option>
          <option value="type">Type</option>
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>IP Address</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {sortedEvents.map((event, index) => (
            <tr key={index}>
              <td>{event.type}</td>
              <td>{event.ip}</td>
              <td>{event.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EventLogs;
