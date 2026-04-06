import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  // Helper to highlight the active tab
  const isActive = (path) =>
    location.pathname === path ? "bg-primary" : "text-white";

  return (
    <nav
      className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white"
      style={{ width: "250px", height: "100vh" }}
    >
      <Link
        className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        to="/"
      >
        <span className="fs-4 fw-bold ">Clinivo</span>
      </Link>

      <hr />

      <ul className="nav nav-pills flex-column mb-auto gap-2">
        <li className="nav-item">
          {/* Home can be a dashboard, adjust as needed */}
          <Link className={`nav-link ${isActive("/")}`} to="/">
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${isActive("/patient-messages")}`}
            to="/patient-messages"
          >
            Messages
          </Link>
        </li>
        <li className="nav-item">
          <Link className={`nav-link ${isActive("/settings")}`} to="/settings">
            Settings
          </Link>
        </li>
      </ul>

      <hr />

      <div>
        <Link className="nav-link text-white" to="/login">
          Logout
        </Link>
      </div>
    </nav>
  );
}

export default Sidebar;
