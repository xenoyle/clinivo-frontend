import { Link, useLocation } from "react-router-dom";

function Sidebar({ isOpen, toggleSidebar }) {
    const location = useLocation();
    const isActive = (path) => location.pathname === path ? "bg-primary" : "text-white";

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
            
            {isOpen && <hr />}

            <ul className="nav nav-pills flex-column mb-auto gap-2">
                <li className="nav-item">
                    <Link className={`nav-link ${isActive('/')}`} to="/">
                        {isOpen && "Home"}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className={`nav-link ${isActive('/patient-messages')}`} to="/patient-messages">
                        {isOpen && "Messages"}
                    </Link>
                </li>
                <li className="nav-item">
                    <Link className={`nav-link ${isActive('/settings')}`} to="/settings">
                        {isOpen && "Settings"}
                    </Link>
                </li>
            </ul>

            {isOpen && <hr />}
            
            <Link className="nav-link text-white p-1" to="/login">
                {isOpen && "Logout"}
            </Link>
        </nav>
    );
}

export default Sidebar;
