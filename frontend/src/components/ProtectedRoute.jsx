import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect unauthenticated users to the admin login page
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authenticated – render the protected component tree
  return children;
}
