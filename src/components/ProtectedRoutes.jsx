import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// For routes that REQUIRE authentication
export const ProtectedRoute = ({ children }) => {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  if (!authStatus || !userData) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// For routes that should redirect if ALREADY logged in
export const PublicOnlyRoute = ({ children }) => {
  const authStatus = useSelector((state) => state.auth.status);

  if (authStatus) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;