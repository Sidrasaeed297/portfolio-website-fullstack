// src/pages/NotAuthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * Professional "Access Denied" page shown when a logged‑in user lacks the "admin" role.
 * Uses Tailwind CSS with dark‑mode support and a clear call‑to‑action.
 */
export default function NotAuthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0B1020] p-4">
      <div className="glass-card max-w-md w-full p-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Access Denied</h1>
        <p className="text-slate-300 mb-6">
          You do not have permission to view this page. If you believe this is an error,
          please contact the site administrator.
        </p>
        <Link
          to="/"
          className="btn-primary inline-block px-6 py-2"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
