import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, authLoading } = useAuth();
  if (authLoading) {
    return null;
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role not allowed
  //   if (roles && !roles.includes(user.role)) {
  //     return <Navigate to="/unauthorized" replace />;
  //   }

  return children;
};

export default ProtectedRoute;
