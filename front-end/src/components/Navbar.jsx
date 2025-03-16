
// 15:00
import { Link } from 'react-router-dom';

export function Navbar() {
  return( <>
            <Link to="/">
              <button id="navbar-buttons">
                Home
              </button>
            </Link>
            <Link to="/Simulation">
              <button id="navbar-buttons">
                Simulation
              </button>
            </Link>
            <Link to="/ThreatEventPage">
              <button id="navbar-buttons">
                Threat Events
              </button>
            </Link>
            <Link to="/AnalysisPage">
              <button id="navbar-buttons">
                Analysis
              </button>
            </Link>
          </>);
}