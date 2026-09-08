import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = () => {
  const { userData, loading, enableProfileFetch } = useAuth();
  // const location = useLocation();

  // This is the single common wrapper for every authenticated route --
  // both the standalone /onboarding route and everything under AppLayout
  // sit behind this. That makes it the right place to opt into the
  // farm-profile fetch: it covers every page that could possibly need
  // userProfile, while guaranteeing public routes (landing, login,
  // register) never trigger it, since they never render this component.
  useEffect(() => {
    if (userData) {
      enableProfileFetch();
    }
  }, [userData, enableProfileFetch]);

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
