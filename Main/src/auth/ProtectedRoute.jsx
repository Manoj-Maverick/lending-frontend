import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import FullScreenLoader from "components/ui/FullScreenLoader";

const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
