// src/components/admin/Header.jsx
import React, { useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

/**
 * Admin header displayed at the top of the admin layout.
 * Shows the current page title (derived from the route),
 * the logged‑in admin's name & email, and a logout button.
 * Fully responsive and supports dark mode via Tailwind.
 */
export default function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Derive a readable title from the pathname, e.g. "/admin/projects" → "Projects"
  const pathParts = location.pathname.split("/").filter(Boolean); // remove empty strings
  const pageTitle = pathParts.length > 1 ?
    // second segment after "admin" is the entity name; capitalize first letter
    pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1)
    : "Dashboard";

  const handleLogout = () => {
    logout();
    // After logout, send user back to the admin login page
    navigate("/admin/login", { replace: true });
  };

  return (
    <header className="flex items-center justify-between bg-white dark:bg-gray-800 shadow px-4 py-3 md:px-6">
      {/* Left side – page title */}
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        {pageTitle}
      </h1>

      {/* Right side – user info and logout */}
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {user?.username || user?.name || "Admin"}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {user?.email || "admin@meenu-dev.com"}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
