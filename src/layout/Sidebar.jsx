import { Link, useLocation } from "react-router-dom";

function Sidebar({ isOpen, toggleSidebar }) {
    const location = useLocation();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const isProvider = currentUser?.role === "PROVIDER";
    const isPatient = currentUser?.role === "PATIENT";

    const isProviderPage = location.pathname.startsWith("/provider-messages");
    const isPatientPage = location.pathname.startsWith("/patient-messages");

    // Determine correct messages path
    let messagesPath = "/patient-messages";
    if (isProviderPage) messagesPath = "/provider-messages";
    else if (isPatientPage) messagesPath = "/patient-messages";
    else if (isProvider) messagesPath = "/provider-messages";
    else if (isPatient) messagesPath = "/patient-messages";

    const isActive = (path) =>
        location.pathname === path ? "bg-primary text-white" : "text-white";

    // ⭐ REAL LOGOUT FUNCTION
    const handleLogout = () => {
        // Close all WebSocket connections
        if (window.__wsConnections) {
            Object.values(window.__wsConnections).forEach((client) => {
                try { client.disconnect(); } catch { }
            });
            window.__wsConnections = {};
        }

        // Clear all user data
        localStorage.removeItem("user");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        // Redirect
        window.location.href = "/login";
    };

    return (
        <>
            {/* DESKTOP SIDEBAR */}
            <nav
                className="d-none d-md-flex flex-column flex-shrink-0 p-3 bg-dark text-white shadow"
                style={{
                    width: isOpen ? "18rem" : "5rem",
                    height: "100vh",
                    transition: "width 0.3s ease",
                    overflowX: "hidden",
                    whiteSpace: "nowrap"
                }}
            >
                <div
                    className={`d-flex align-items-center mb-3 ${isOpen ? "justify-content-between" : "justify-content-center"
                        }`}
                >
                    {isOpen && <span className="fs-4 fw-bold">Clinivo</span>}

                    <button
                        className="btn btn-outline-light border-0 p-1"
                        onClick={toggleSidebar}
                        style={{ width: "32px" }}
                    >
                        ☰
                    </button>
                </div>

                <hr />

                <ul className="nav flex-column mb-auto gap-2">

                    {/* Messages */}
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive(messagesPath)}`} to={messagesPath}>
                            {isOpen ? "Messages" : <i className="bi bi-envelope fs-4"></i>}
                        </Link>
                    </li>

                    {/* Settings */}
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive("/settings")}`} to="/settings">
                            {isOpen ? "Settings" : <i className="bi bi-gear fs-4"></i>}
                        </Link>
                    </li>
                </ul>

                <hr />

                {/* LOGOUT BUTTON (DESKTOP) */}
                <button
                    className="nav-link text-white p-1 bg-transparent border-0 text-start"
                    onClick={handleLogout}
                >
                    {isOpen ? "Logout" : <i className="bi bi-box-arrow-right fs-4"></i>}
                </button>
            </nav>

            {/* MOBILE BOTTOM NAV */}
            <nav className="d-md-none bg-dark text-white fixed-bottom sticky shadow-lg">
                <ul className="nav justify-content-around py-2">

                    {/* Messages */}
                    <li className="nav-item">
                        <Link className={`nav-link text-white ${isActive(messagesPath)}`} to={messagesPath}>
                            <i className="bi bi-envelope fs-4"></i>
                        </Link>
                    </li>

                    {/* Settings */}
                    <li className="nav-item">
                        <Link className={`nav-link text-white ${isActive("/settings")}`} to="/settings">
                            <i className="bi bi-gear fs-4"></i>
                        </Link>
                    </li>

                    {/* LOGOUT BUTTON (MOBILE) */}
                    <li className="nav-item">
                        <button
                            className="nav-link text-white bg-transparent border-0"
                            onClick={handleLogout}
                        >
                            <i className="bi bi-box-arrow-right fs-4"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Sidebar;
