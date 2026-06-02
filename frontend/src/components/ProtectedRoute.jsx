// src/components/ProtectedRoute.jsx
import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

/**
 * Guard component for admin‑only routes.
 *   * If not authenticated → redirect to /admin/login.
 *   * If authenticated but role !== "admin" → redirect to /not-authorized.
 *   * Otherwise render the protected children.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    // Unauthenticated users go to the admin login page.
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (user?.role !== "admin") {
    // Authenticated but not an admin → show access‑denied page.
    return <Navigate to="/not-authorized" replace />;
  }

  // Authenticated admin – render the protected component tree.
  return children;
}
