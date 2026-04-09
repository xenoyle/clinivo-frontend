import { Link, useLocation } from "react-router-dom";

function Sidebar({ isOpen, toggleSidebar }) {
    const location = useLocation();
    const currentUser = JSON.parse(localStorage.getItem("user"));

    const isProvider = currentUser?.role === "PROVIDER";
    const isPatient = currentUser?.role === "PATIENT";

    const isProviderPage = location.pathname.startsWith("/provider-messages");
    const isPatientPage = location.pathname.startsWith("/patient-messages");

    // ⭐ Correct logic:
    // 1. If you're on provider page → stay on provider page
    // 2. If you're on patient page → stay on patient page
    // 3. If you're on neither → choose based on role
    let messagesPath = "/patient-messages"; // default

    if (isProviderPage) {
        messagesPath = "/provider-messages";
    } else if (isPatientPage) {
        messagesPath = "/patient-messages";
    } else if (isProvider) {
        messagesPath = "/provider-messages";
    } else if (isPatient) {
        messagesPath = "/patient-messages";
    }

    const isActive = (path) =>
        location.pathname === path ? "bg-primary text-white" : "text-white";

    const sidebarStyle = {
        width: isOpen ? "20rem" : "5rem",
        height: "100vh",
        transition: "width 0.3s ease",
        overflowX: "hidden",
        whiteSpace: "nowrap"
    };

    return (
        <nav className="d-flex flex-column flex-shrink-0 p-3 bg-dark text-white shadow" style={sidebarStyle}>
            <div className={`d-flex align-items-center mb-3 ${isOpen ? 'justify-content-between' : 'justify-content-center'}`}>
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

                <li className="nav-item">
                    <Link className={`nav-link ${isActive('/')}`} to="/">
                        {isOpen ? "Home" : <i className="bi bi-house"></i>}
                    </Link>
                </li>

                {/* ⭐ Messages link that behaves EXACTLY how you want */}
                <li className="nav-item">
                    <Link className={`nav-link ${isActive(messagesPath)}`} to={messagesPath}>
                        {isOpen ? "Messages" : <i className="bi bi-envelope"></i>}
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className={`nav-link ${isActive('/settings')}`} to="/settings">
                        {isOpen ? "Settings" : <i className="bi bi-gear"></i>}
                    </Link>
                </li>
            </ul>

            <hr />

            <Link className="nav-link text-white p-1" to="/login">
                {isOpen ? "Logout" : <i className="bi bi-box-arrow-right"></i>}
            </Link>
        </nav>
    );
}

export default Sidebar;
