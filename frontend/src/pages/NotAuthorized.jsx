// src/pages/NotAuthorized.jsx
import React from "react";
import { Link } from "react-router-dom";

/**
 * Professional "Access Denied" page shown when a logged‑in user lacks the "admin" role.
 * Uses Tailwind CSS with dark‑mode support and a clear call‑to‑action.
 */
export default function NotAuthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You do not have permission to view this page. If you believe this is an error,
          please contact the site administrator.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
