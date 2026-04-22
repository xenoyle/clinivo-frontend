import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../api/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  
  if (!user) return <Navigate to="/login" replace />;

  return allowedRoles.includes(user.role) ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;