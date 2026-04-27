import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  // Retrieve the raw string from localStorage
  const userString = localStorage.getItem("user");
  
  // Safely parse it. If it doesn't exist, default to null.
  const user = userString ? JSON.parse(userString) : null;

  // Rule 1: Not logged in? Back to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Rule 2: Logged in, but wrong role? 
  // We check if the user's role is included in the allowedRoles array passed as a prop.
  if (!allowedRoles.includes(user.role)) {
    // You could route them to an "/unauthorized" page, 
    // or just bounce them back to their respective dashboards.
    return user.role === "DOCTOR" 
        ? <Navigate to="/doctor-messages" replace /> 
        : <Navigate to="/patient-messages" replace />;
  }

  // Rule 3: Checks passed. Render the requested route.
  return <Outlet />;
};

export default ProtectedRoute;