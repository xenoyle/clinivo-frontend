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

                {/* Logout */}
                <Link className="nav-link text-white p-1" to="/login">
                    {isOpen ? "Logout" : <i className="bi bi-box-arrow-right fs-4"></i>}
                </Link>
            </nav>

            {/* MOBILE BOTTOM NAV */}
            <nav className="d-md-none bg-dark text-white fixed-bottom shadow-lg">
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

                    {/* Logout */}
                    <li className="nav-item">
                        <Link className="nav-link text-white" to="/login">
                            <i className="bi bi-box-arrow-right fs-4"></i>
                        </Link>
                    </li>
                </ul>
            </nav>
        </>
    );
}

export default Sidebar;
