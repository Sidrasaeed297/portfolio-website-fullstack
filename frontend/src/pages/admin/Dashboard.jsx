// src/pages/admin/Dashboard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <li>
          <Link to="/admin/projects" className="block p-4 bg-white dark:bg-gray-800 rounded shadow hover:bg-primary/10">
            Projects
          </Link>
        </li>
        <li>
          <Link to="/admin/blogs" className="block p-4 bg-white dark:bg-gray-800 rounded shadow hover:bg-primary/10">
            Blogs
          </Link>
        </li>
        <li>
          <Link to="/admin/skills" className="block p-4 bg-white dark:bg-gray-800 rounded shadow hover:bg-primary/10">
            Skills
          </Link>
        </li>
        <li>
          <Link to="/admin/experience" className="block p-4 bg-white dark:bg-gray-800 rounded shadow hover:bg-primary/10">
            Experience
          </Link>
        </li>
        <li>
          <Link to="/admin/education" className="block p-4 bg-white dark:bg-gray-800 rounded shadow hover:bg-primary/10">
            Education
          </Link>
        </li>
        <li>
          <Link to="/admin/contact-messages" className="block p-4 bg-white dark:bg-gray-800 rounded shadow hover:bg-primary/10">
            Contact Messages
          </Link>
        </li>
      </ul>
    </div>
  );
}
