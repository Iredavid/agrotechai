import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { userData, loading } = useAuth();
  // const location = useLocation();

  // Still resolving Firebase auth state.
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in at all.
  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
